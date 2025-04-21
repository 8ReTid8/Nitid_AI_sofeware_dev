from stable_baselines3 import PPO
import zmq
import json
import pandas as pd
import ta  # ใช้ไลบรารี pandas-ta (ต้องติดตั้ง: pip install ta)

def main():
    context = zmq.Context()
    
    # socket = context.socket(zmq.REP)
    socket = context.socket(zmq.ROUTER)
    socket.bind("tcp://*:5555")
    
    # model_path = "./temp_ai/model/EURUSD/v1.0/best_model"  # Path to your trained model
    model_path = "./temp_ai/test"  # Path to your trained model
    
    model = PPO.load(model_path)
    
    print("Python Server: Waiting for messages...")
    
    # กำหนด DataFrame ล่วงหน้า
    df = pd.DataFrame(columns=["Open", "High", "Low", "Close"]).astype({
        "Open": "float64",
        "High": "float64",
        "Low": "float64",
        "Close": "float64",
    })
    
    while True:
        # message = socket.recv()
        client_id, message = socket.recv_multipart()
        message_str = message.decode()

        try:
            # รองรับการรับ JSON Array
            data_list = json.loads(message_str)

            # แปลงข้อมูลเข้า DataFrame
            new_rows = pd.DataFrame(data_list)
            
            # แปลงคอลัมน์ Time เป็น datetime
            # รวมข้อมูลใหม่เข้า DataFrame หลัก
            df = pd.concat([df, new_rows], ignore_index=True)
            df = df.drop(["Time"],axis=1)
            
            # # คำนวณ Indicator
            # df.set_index('Datetime',inplace=True)
            df["SMA"] = ta.trend.sma_indicator(df["Close"], window=12)
            df["RSI"] = ta.momentum.rsi(df["Close"])
            df["EMA_9"] = ta.trend.ema_indicator(df["Close"], window=9)
            df["EMA_21"] = ta.trend.ema_indicator(df["Close"], window=21)
            # MACD
            df["MACD"] = ta.trend.macd(df["Close"])
            df["MACD_SIGNAL"] = ta.trend.macd_signal(df["Close"])

            # ADX (Trend Strength)
            # df["ADX"] = ta.trend.adx(df["High"], df["Low"], df["Close"])

            # Bollinger Bands (Volatility)
            df["BB_UPPER"] = ta.volatility.bollinger_hband(df["Close"])
            df["BB_LOWER"] = ta.volatility.bollinger_lband(df["Close"])

            # ATR (Volatility)
            df["ATR"] = ta.volatility.average_true_range(df["High"], df["Low"], df["Close"])

            # Stochastic Oscillator (Reversals)
            df["STOCH"] = ta.momentum.stoch(df["High"], df["Low"], df["Close"])

            # Williams %R (Reversals)
            df["WILLR"] = ta.momentum.williams_r(df["High"], df["Low"], df["Close"])
            
            # # แทนค่า NaN ด้วย 0
            df.fillna(0, inplace=True)

            # print(df.tail(24))  # แสดงข้อมูลล่าสุด 24 แท่ง

        except json.JSONDecodeError:
            print("Error: Invalid JSON format")
        except KeyError as e:
            print(f"KeyError: {e}")

        # ตอบกลับไปยัง MT5
        
        prediction, _ = model.predict(df.tail(16))
        print("prediction",prediction)
        
        # socket.send_string(str(prediction))
        socket.send_multipart([client_id, str(prediction).encode("utf-8")])      

if __name__ == "__main__":
    main()
