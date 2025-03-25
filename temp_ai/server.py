import os
import time
import schedule
import threading
from stable_baselines3 import PPO
import zmq
import json
import pandas as pd
import ta  # ใช้ pandas-ta
from finta import TA
import logging

# dictionary สำหรับเก็บโมเดลทั้งหมด
models_dict = {}

def load_all_models():
    logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
    base_dir = "./model"
    # ล้าง dictionary ก่อนโหลดใหม่
    global models_dict
    models_dict = {}
    
    # วนลูปในแต่ละคู่เงิน (เช่น XAUUSD15M, EURUSD1H)
    for pair in os.listdir(base_dir):
        pair_path = os.path.join(base_dir, pair)
        if os.path.isdir(pair_path):
            models_dict[pair] = {}
            # วนลูปในแต่ละเวอร์ชัน
            for version in os.listdir(pair_path):
                version_path = os.path.join(pair_path, version)
                if os.path.isdir(version_path):
                    model_file = os.path.join(version_path, "best_model.zip")
                    if os.path.exists(model_file):
                        logging.info(f"Loading model: {pair} {version}")
                        print(f"Loading model: {pair} {version}")
                        models_dict[pair][version] = PPO.load(model_file)
                    else:
                        logging.info(f"Model file not found for: {pair} {version}")
                        print(f"Model file not found for: {pair} {version}")

def reload_new_models():
    """ฟังก์ชันที่ตรวจสอบและโหลดโมเดลใหม่ (อัปเดตเวอร์ชัน) ทุก 30 วัน"""
    logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
    logging.info("Reloading models with new version updates...")
    print("Reloading models with new version updates...")
    load_all_models()
    print("Models reloaded.")

def scheduler_thread():
    """Thread สำหรับรัน schedule"""
    while True:
        schedule.run_pending()
        time.sleep(1)

def main():
    # โหลดโมเดลทั้งหมดตอนเริ่มต้น
    load_all_models()
    logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
    logging.info("server is running")
    # ตั้งเวลาให้รีโหลดโมเดลใหม่ทุก 30 วัน
    # schedule.every(10).minutes.do(reload_new_models)
    schedule.every(2193).hours.do(reload_new_models)
    
    
    # เริ่ม thread สำหรับ scheduler
    threading.Thread(target=scheduler_thread, daemon=True).start()
    
    # ตั้งค่า ZMQ server (ใช้ ROUTER socket รองรับ client หลายตัว)
    context = zmq.Context()
    socket = context.socket(zmq.ROUTER)
    socket.bind("tcp://*:5555")
    
    print("Python Server: Waiting for messages...")
    logging.info("Python Server: Waiting for messages...")
    
    while True:
        # รับข้อความจาก client พร้อม identity (ea_id)
        # rev = socket.recv_multipart()
        # print(rev)
        client_id, message = socket.recv_multipart()
        message_str = message.decode()
        
        try:
            # แปลงข้อมูล JSON ที่ได้รับ
            data = json.loads(message_str)
            # ea_id = data.get('ea_id')
            ohlc_data = data.get('ohlc_data')
            pair = data.get('pair')          # เช่น "XAUUSD15M", "EURUSD1H"
            # version = data.get('model_version')  # เช่น "v1.0", "v1.1"
            version = "v" + str(data.get('model_version')) 
            
            # ตรวจสอบความถูกต้องของข้อมูลที่ได้รับ
            if ohlc_data is None or pair is None:
                raise ValueError("Missing required fields: ea_id, ohlc_data, or pair")
            
            # ถ้าไม่ระบุเวอร์ชัน ให้ใช้เวอร์ชันล่าสุด (โดยเรียงลำดับแล้วเลือกตัวท้ายสุด)
            if version is None:
                available_versions = list(models_dict[pair].keys())
                if available_versions:
                    available_versions.sort()
                    version = available_versions[-1]
                else:
                    raise ValueError(f"No available models for pair: {pair}")
            
            # เลือกโมเดลที่ตรงกับคู่เงินและเวอร์ชันที่ต้องการ
            model = models_dict.get(pair, {}).get(version)
            if model is None:
                raise ValueError(f"Model not found for pair {pair} with version {version}")
            
            # แปลงข้อมูลเข้า DataFrame
            df = pd.DataFrame(ohlc_data)
            df = df.drop(["Time"],axis=1)
            # df.set_index('Datetime', inplace=True)
            
            # คำนวณ Indicator
            df["SMA"] = ta.trend.sma_indicator(df["Close"], window=12)
            df["RSI"] = ta.momentum.rsi(df["Close"])
            df["EMA_9"] = ta.trend.ema_indicator(df["Close"], window=9)
            df["EMA_21"] = ta.trend.ema_indicator(df["Close"], window=21)
            # MACD
            df["MACD"] = ta.trend.macd(df["Close"])
            df["MACD_SIGNAL"] = ta.trend.macd_signal(df["Close"])

            # ADX (Trend Strength)
            df["ADX"] = ta.trend.adx(df["High"], df["Low"], df["Close"])

            # Bollinger Bands (Volatility)
            df["BB_UPPER"] = ta.volatility.bollinger_hband(df["Close"])
            df["BB_LOWER"] = ta.volatility.bollinger_lband(df["Close"])

            # ATR (Volatility)
            df["ATR"] = ta.volatility.average_true_range(df["High"], df["Low"], df["Close"])

            # Stochastic Oscillator (Reversals)
            df["STOCH"] = ta.momentum.stoch(df["High"], df["Low"], df["Close"])

            # Williams %R (Reversals)
            df["WILLR"] = ta.momentum.williams_r(df["High"], df["Low"], df["Close"])
            
            df.fillna(0, inplace=True)
            # ใช้ข้อมูลล่าสุด 24 แท่งเท่านั้น
            df_latest = df.tail(48)
            
            # ทำ Prediction
            prediction, _ = model.predict(df_latest, deterministic=True)
            logging.info(f"prediction {prediction}")
            print("prediction", prediction)
            response = {'reply_by': str(pair)+str(version), 'prediction': str(prediction)}
            # socket.send_multipart([client_id, json.dumps(response).encode()])
            socket.send_multipart([client_id, str(prediction).encode("utf-8")])      
            
        except json.JSONDecodeError:
            print("Error: Invalid JSON format")
            socket.send_multipart([client_id, b"Error: Invalid JSON format"])
        
        except Exception as e:
            print(f"Unexpected error: {e}")
            socket.send_multipart([client_id, b"Error: Unexpected error"])

if __name__ == "__main__":
    main()