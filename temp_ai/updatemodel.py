from dataclasses import dataclass
import os
import time
import schedule
from stable_baselines3 import PPO
from datetime import datetime, timedelta
import MetaTrader5 as mt5
import pandas as pd
import ta
from finta import TA
from stable_baselines3.common.vec_env import DummyVecEnv
import pandas as pd
from stable_baselines3 import PPO
from trainmodel import ForexTradingEnv  # นำเข้า Environment ที่แยกออกมา
import requests

# กำหนดค่าการเชื่อมต่อ MT5
LOGIN = 5033743269
PASSWORD = 'HbBi!p5a'
SERVER = 'MetaQuotes-Demo'

# กำหนดโฟลเดอร์โมเดล
MODEL_DIR = "./temp_ai/model/EURUSD/"

# ฟังก์ชันโหลดเวอร์ชันล่าสุดของโมเดล
def load_latest_model():
    global current_version
    if not os.path.exists(MODEL_DIR):
        os.makedirs(MODEL_DIR)

    available_versions = [v for v in os.listdir(MODEL_DIR) if v.startswith('v')]
    if not available_versions:
        print("No existing model found. Starting with v1.0")
        current_version = "v1.0"
        return None

    available_versions.sort(key=lambda x: list(map(int, x[1:].split('.'))))  # เรียงลำดับเวอร์ชัน
    current_version = available_versions[-1]  # เลือกเวอร์ชันล่าสุด

    model_path = os.path.join(MODEL_DIR, current_version, "best_model.zip")
    if os.path.exists(model_path):
        return PPO.load(model_path)
    return None

# ฟังก์ชันสร้างชื่อเวอร์ชันใหม่
def get_next_version():
    if not os.path.exists(MODEL_DIR):
        return "v1.0"

    available_versions = [v for v in os.listdir(MODEL_DIR) if v.startswith('v')]
    if not available_versions:
        return "v1.0"

    available_versions.sort(key=lambda x: list(map(int, x[1:].split('.'))))  # เรียงตามตัวเลข
    last_version = available_versions[-1][1:]  # ตัด 'v' ออก
    parts = list(map(int, last_version.split('.')))

    # เพิ่มหมายเลขเวอร์ชัน
    if len(parts) == 1:
        parts.append(1)  # ถ้าเป็น v1 → v1.1
    else:
        parts[-1] += 1  # v1.1 → v1.2
        if parts[-1] > 9:  # v1.9 → v2.0
            parts[-1] = 0
            parts[-2] += 1

    return "v" + ".".join(map(str, parts))

# ฟังก์ชันดึงข้อมูลราคาจาก MT5
def get_new_data():
    # ล็อกอิน MT5
    if not mt5.initialize():
        print("MetaTrader5 initialize failed!")
        return None
    
    if not mt5.login(LOGIN, PASSWORD, SERVER):
        print("MT5 login failed!")
        return None

    # ดึงข้อมูลราคา
    symbol = "EURUSD"
    timeframe = mt5.TIMEFRAME_H1
    date_to = datetime.now()
    date_from = date_to - timedelta(days=90)  # 3 เดือน

    rates = mt5.copy_rates_range(symbol, timeframe, date_from, date_to)
    mt5.shutdown()

    if rates is None or len(rates) == 0:
        print("No data received from MetaTrader 5")
        return None

    # แปลงเป็น DataFrame
    df = pd.DataFrame(rates)
    # df['Datetime'] = pd.to_datetime(df['time'], unit='s')
    # df.set_index('Datetime', inplace=True)

    # เปลี่ยนชื่อคอลัมน์
    df.rename(columns={
        'close': 'Close',
        'open': 'Open',
        'high': 'High',
        'low': 'Low',
        'tick_volume': 'Volume',
    }, inplace=True)

    # คำนวณ Indicators
    df['SMA'] = ta.trend.sma_indicator(df['Close'], window=12)
    df['RSI'] = ta.momentum.rsi(df['Close'])
    df['OBV'] = ta.volume.on_balance_volume(df['Close'], df['Volume'])
    df['EMA_9'] = ta.trend.ema_indicator(df['Close'], window=9)
    df['EMA_21'] = ta.trend.ema_indicator(df['Close'], window=21)
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
    
    df = df.drop(columns=['time', 'real_volume','spread'])
    df.fillna(0, inplace=True)
    return df



API_URL = "http://localhost:3000/api/addnewModel"  # เปลี่ยนเป็น API ที่ต้องการ

def notify_model_update(name, version):
    """ส่ง API ไปสร้างข้อมูลโมเดล"""
    payload = {
        "name": name,
        "version": float(version.replace("v", "")),  # แปลง v1.1 → 1.1
        "Update_at": datetime.utcnow().isoformat(),  # เวลาปัจจุบัน UTC
        "numberofuse": 0
    }
    
    response = requests.post(API_URL, json=payload)
    if response.status_code == 201:
        print(f"Model {name} (version {version}) successfully registered.")
    else:
        print(f"Failed to register model: {response.text}")


# ฟังก์ชันรีเทรนโมเดล
def retrain_model():
    global best_model, current_version
    print("Retraining the model...")

    df = get_new_data()
    if df is None:
        print("Error: Could not fetch new data.")
        return

    print(df)
    env = DummyVecEnv([lambda: ForexTradingEnv(df)])  # ใช้ DummyVecEnv หุ้ม Environment

    # สร้างโมเดลใหม่หรือโหลดของเดิม
    if best_model is None:
        model = PPO("MlpPolicy", env, verbose=1)
    else:
        model = PPO.load(os.path.join(MODEL_DIR, current_version, "best_model.zip"), env=env)

    model.learn(total_timesteps=10000)

    # ตั้งชื่อเวอร์ชันใหม่
    new_version = get_next_version()
    save_path = os.path.join(MODEL_DIR, new_version)
    os.makedirs(save_path, exist_ok=True)

    model.save(os.path.join(save_path, "best_model.zip"))
    best_model = model
    print(f"Model updated to {new_version}")
    
    # **เรียกใช้ API หลังจากอัปเดตโมเดล**
    notify_model_update("XAUUSD15M", new_version)


# ตั้งเวลาให้รีเทรนโมเดลทุกๆ 3 เดือน
# schedule.every(3).months.do(retrain_model)
schedule.every(2).minutes.do(retrain_model)

# ฟังก์ชันหลัก
def main():
    global best_model
    best_model = load_latest_model()

    # รัน scheduler
    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == "__main__":
    main()
