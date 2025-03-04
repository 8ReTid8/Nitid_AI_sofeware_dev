# from backtesting import Backtest, Strategy
# import pandas as pd
# import numpy as np
# from stable_baselines3 import PPO
# import MetaTrader5 as mt5
# from backtesting.test import SMA, GOOG

# # Initialize MetaTrader 5
# if not mt5.initialize():
#     print("MetaTrader 5 initialization failed")
#     exit()

# # Get historical data (1-minute OHLC)
# symbol = "EURUSD"
# rates = mt5.copy_rates_from_pos(symbol, mt5.TIMEFRAME_H1, 0, 1000)  # Get last 10000 1-minute bars

# df = pd.DataFrame(rates)
# df['time'] = pd.to_datetime(df['time'], unit='s')
# df = df[['time', 'open', 'high', 'low', 'close', 'tick_volume']]
# df.columns = ['Time', 'Open', 'High', 'Low', 'Close', 'Tick_Volume']


# class AIPredictStrategy(Strategy):
#     model = None  # AI model (to be set before running the backtest)
#     max_positions = 10  # Maximum number of positions that can be opened at once

#     def init(self):
#         self.data_window = []
#         self.window_size = 48  # Expecting 20 rows of historical data

#     def next(self):
#         # Get the current index
#         current_index = len(self.data) - 1  # Correct index reference

#         # Collect the last 20 bars of data from the DataFrame
#         if current_index >= self.window_size:
#             data_window = df.iloc[current_index - self.window_size:current_index]
#             data_array = data_window[['Open', 'High', 'Low', 'Close', 'Tick_Volume']].values

#             # Ensure the shape is correct before making predictions
#             if data_array.shape != (48, 10):
#                 print(f"Invalid data shape: {data_array.shape}. Expected (20, 5).")
#                 return

#             # Get AI prediction
#             action_signal, _ = self.model.predict(data_array)
#             print(f"AI Prediction: {action_signal}")

#             # Convert action_signal to trading actions
#             if action_signal == 1:  # Long positio
               
#                 for p in self.trades:
#                     if p.is_short:
#                         p.close()
#                 # if not any(p.is_long for p in self.position):  # Open only 1 long position
#                 print("Opening long position")
#                 self.buy()

#             elif action_signal == 2:  # Short position

#                 for p in self.trades:
#                     if p.is_long:
#                         p.close()
#                 # if not any(p.is_short for p in self.position):  # Open only 1 short position
#                 print("Opening short position")
#                 self.sell()

#             elif action_signal == 0:  # Hold
#                 print("AI predicted HOLD - No action taken.")
#                 pass  # Do nothing (hold position)


# # Load trained AI model
# model_path = "./temp_ai/ppo_forex_trader"  # Path to your trained model
# model = PPO.load(model_path)

# # Run Backtest
# bt = Backtest(df, AIPredictStrategy, cash=10000, commission=.002, exclusive_orders=False)

# # Assign the model before running
# AIPredictStrategy.model = model
# output = bt.run()
# bt.plot()

# print("Available metrics:", output.keys())

# # Print final results
# print("\n===== Backtest Results =====")
# print(output)

# # Extract values safely
# start_balance = 10000  # Initial balance
# final_balance = output.get("Equity Final [$]", "N/A")
# total_trades = output.get("# Trades", "N/A")
# win_rate = output.get("Win Rate [%]", "N/A")
# profit_factor = output.get("Profit Factor", "N/A")
# max_drawdown = output.get("Max Drawdown [%]", output.get("Drawdown [%]", "N/A"))  # Fallback to alternative key

# # Display
# print(f"Start Balance: ${start_balance}")
# print(f"Final Balance: ${final_balance}")
# print(f"Total Trades: {total_trades}")
# print(f"Win Rate: {win_rate}%")
# print(f"Profit Factor: {profit_factor}")
# print(f"Max Drawdown: {max_drawdown}%")

from backtesting import Backtest, Strategy
import pandas as pd
import numpy as np
from stable_baselines3 import PPO
import MetaTrader5 as mt5
import ta

# Initialize MetaTrader 5
if not mt5.initialize():
    print("MetaTrader 5 initialization failed")
    exit()

# Get historical data (1-hour OHLC)
symbol = "EURUSD"
rates = mt5.copy_rates_from_pos(symbol, mt5.TIMEFRAME_H1, 0, 50000)  # Get last 1000 1-hour bars

# Convert data to DataFrame
df = pd.DataFrame(rates)
df['time'] = pd.to_datetime(df['time'], unit='s')
df = df[['time', 'open', 'high', 'low', 'close', 'tick_volume']]
df.columns = ['Time', 'Open', 'High', 'Low', 'Close', 'Tick_Volume']

# Add indicators similar to training setup
df["SMA"] = ta.trend.sma_indicator(df["Close"], window=12)
df["RSI"] = ta.momentum.rsi(df["Close"])
df["OBV"] = ta.volume.on_balance_volume(df["Close"], df["Tick_Volume"])
df["EMA_9"] = ta.trend.ema_indicator(df["Close"], window=9)
df["EMA_21"] = ta.trend.ema_indicator(df["Close"], window=21)
df = df.fillna(0)

# Load trained PPO model
model_path = "./temp_ai/model/ppo_forex_trader"
model = PPO.load(model_path)

class AIPredictStrategy(Strategy):
    model = model  # Assign trained AI model
    window_size = 48  # Match training environment

    def init(self):
        pass

    def next(self):
        # Ensure sufficient historical data
        if len(self.data) < self.window_size:
            return

        # Prepare input data (match training format)
        data_window = self.data.df.iloc[-self.window_size:]
        data_array = data_window[['Open', 'High', 'Low', 'Close', 'Tick_Volume',
                                  'SMA', 'RSI', 'OBV', 'EMA_9', 'EMA_21']].values
        
        # Ensure correct shape
        if data_array.shape != (self.window_size, 10):
            print(f"Invalid data shape: {data_array.shape}. Expected ({self.window_size}, 10).")
            return
        
        # Get AI prediction
        action_signal, _ = self.model.predict(data_array, deterministic=True)

        # Execute trades based on AI signal
        if action_signal == 1:  # Buy
            for trade in self.trades:
                if trade.is_short:
                    trade.close()
            self.buy(size=0.1)
        elif action_signal == 2:  # Sell
            for trade in self.trades:
                if trade.is_long:
                    trade.close()
            self.sell(size=0.1)

# Run Backtest
bt = Backtest(df, AIPredictStrategy, cash=10000, commission=.002, exclusive_orders=False)
output = bt.run()
bt.plot()

# Print results
print("\n===== Backtest Results =====")
print(output)
# Extract values safely
win_rate = output.get("Win Rate [%]", "N/A")
profit_factor = output.get("Profit Factor", "N/A")
max_drawdown = output.get("Avg. Drawdown [%]", "N/A") # Fallback to alternative key

# Display
print(f"Win Rate: {win_rate}%")
print(f"Profit Factor: {profit_factor}")
print(f"Avg Drawdown: {max_drawdown}%")