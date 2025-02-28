from stable_baselines3 import PPO
import zmq
import json
import pandas as pd
import ta  # ใช้ไลบรารี pandas-ta (ต้องติดตั้ง: pip install ta)

def main():
    context = zmq.Context()
    socket = context.socket(zmq.REP)
    socket.bind("tcp://*:5555")
    
    model_path = "./temp_ai/ppo_forex_trader"  # Path to your trained model
    # model_path = "./temp_ai/CUP"  # Path to your trained model
    
    model = PPO.load(model_path)
    
    print("Python Server: Waiting for messages...")
    
    # กำหนด DataFrame ล่วงหน้า
    # df = pd.DataFrame(columns=["Datetime", "Open", "High", "Low", "Close", "Volume", "Spread"]).astype({
    #     "Datetime": "string",
    #     "Open": "float64",
    #     "High": "float64",
    #     "Low": "float64",
    #     "Close": "float64",
    #     "Volume": "int64",
    #     "Spread": "int64",
    # })
    df = pd.DataFrame(columns=["Open", "High", "Low", "Close", "Volume"]).astype({
        "Open": "float64",
        "High": "float64",
        "Low": "float64",
        "Close": "float64",
        "Volume": "int64",
    })
    
    while True:
        message = socket.recv()
        message_str = message.decode()
        # print(f"Received: {message_str}")

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
            df["OBV"] = ta.volume.on_balance_volume(df["Close"], df["Volume"])
            df["EMA_9"] = ta.trend.ema_indicator(df["Close"], window=9)
            df["EMA_21"] = ta.trend.ema_indicator(df["Close"], window=21)
            
            # # แทนค่า NaN ด้วย 0
            df.fillna(0, inplace=True)

            print(df.tail(24))  # แสดงข้อมูลล่าสุด 24 แท่ง

        except json.JSONDecodeError:
            print("Error: Invalid JSON format")
        except KeyError as e:
            print(f"KeyError: {e}")

        # ตอบกลับไปยัง MT5
        
        prediction, _ = model.predict(df.tail(48))
        print("prediction",prediction)
        
        # socket.send_string(str(prediction))
        socket.send_string(str(prediction))
        

if __name__ == "__main__":
    main()
