# from backtesting import Backtest, Strategy
# import pandas as pd
# import numpy as np
# from stable_baselines3 import PPO

# class PPOForexStrategy(Strategy):
#     # def __init__(self, model, window_size=20):
#     #     self.model = model
#     #     self.window_size = window_size

#     def init(self):
#         self.window_size = 20
    
#     def next(self):
#         # Prepare the state for prediction (using the last window of data)
#         state = self.data.Close[-self.window_size:].values  # Assuming window size of 20, adjust as needed
        
#         # Ensure the state shape matches what PPO expects
#         state = np.expand_dims(state, axis=0)  # Add a batch dimension for prediction
        
#         # Use the PPO model to predict the action (0: Hold, 1: Buy, 2: Sell)
#         action, _states = self.model.predict(state)
        
#         if action == 0:
#             print("Holding... No action taken.")
#             return  

#         # Action 1: Buy Order (Close all sells before buying)
#         elif action == 1:
#             if self.position and self.position.is_short:
#                 print("Closing all short positions before opening a long position")
#                 self.position.close()  # Close any open short positions
#             print("Opening long position")
#             self.buy()  # Open a long position
               
#         # Action 2: Sell Order (Close all buys before selling)
#         elif action == 2:
#             if self.position and self.position.is_long:
#                 print("Closing all long positions before opening a short position")
#                 self.position.close()  # Close any open long positions
#             print("Opening short position")
#             self.sell()  # Open a short position
    
#     def stop(self):
#         print(f"Ending Portfolio Value: {self.equity}")


# # Example usage
# if __name__ == "__main__":
#     # Load your forex data (preprocess it as needed)
#     data = pd.read_csv('./temp_ai/EURUSD_M1.csv', delimiter='\t')
#     data = pd.read_csv('./temp_ai/test.csv', delimiter='\t')
#     data.columns = [col.replace('<', '').replace('>', '') for col in data.columns]
#     data['DATETIME'] = pd.to_datetime(data['DATE'] + ' ' + data['TIME'])
#     data = data.drop(["DATE", "TIME", "TICKVOL", "SPREAD"], axis=1)
#     data['DATETIME'] = data['DATETIME'].astype(np.int64)
    
#     # Rename columns to match the Backtest requirements
#     data = data.rename(columns={"CLOSE": "Close", "OPEN": "Open", "HIGH": "High", "LOW": "Low"})
    
#     # Check if the required columns exist
#     required_columns = ['Open', 'High', 'Low', 'Close']
#     for col in required_columns:
#         if col not in data.columns:
#             raise ValueError(f"Missing required column: {col}")
    
#     # Ensure that the 'Close' column is the correct one
#     if 'Close' not in data.columns:
#         raise ValueError("The data must contain a 'Close' column.")

#     # Load the trained PPO model
#     model = PPO.load("./temp_ai/ppo_forex_trader")  # Path to your trained PPO model
#     # PPOForexStrategy(model)
#     # Run the backtest with the PPO model as the strategy
#     bt = Backtest(data, PPOForexStrategy, cash=100000, commission=0.002 , exclusive_orders=True)
#     result = bt.run()
    
#     # Print the results
#     print(f"Final Portfolio Value: {result['Equity'][-1]}")
    
#     # Optionally, plot the results
#     bt.plot()

from backtesting import Backtest, Strategy
import pandas as pd
import numpy as np
from stable_baselines3 import PPO
import MetaTrader5 as mt5
from backtesting.test import SMA, GOOG

# Initialize MetaTrader 5
if not mt5.initialize():
    print("MetaTrader 5 initialization failed")
    exit()

# Get historical data (1-minute OHLC)
symbol = "EURUSD"
rates = mt5.copy_rates_from_pos(symbol, mt5.TIMEFRAME_H1, 0, 1000)  # Get last 10000 1-minute bars

df = pd.DataFrame(rates)
df['time'] = pd.to_datetime(df['time'], unit='s')
df = df[['time', 'open', 'high', 'low', 'close', 'tick_volume']]
df.columns = ['Time', 'Open', 'High', 'Low', 'Close', 'Tick_Volume']


class AIPredictStrategy(Strategy):
    model = None  # AI model (to be set before running the backtest)
    max_positions = 10  # Maximum number of positions that can be opened at once

    def init(self):
        self.data_window = []
        self.window_size = 20  # Expecting 20 rows of historical data

    def next(self):
        # Get the current index
        current_index = len(self.data) - 1  # Correct index reference

        # Collect the last 20 bars of data from the DataFrame
        if current_index >= self.window_size:
            data_window = df.iloc[current_index - self.window_size:current_index]
            data_array = data_window[['Open', 'High', 'Low', 'Close', 'Tick_Volume']].values

            # Ensure the shape is correct before making predictions
            if data_array.shape != (20, 5):
                print(f"Invalid data shape: {data_array.shape}. Expected (20, 5).")
                return
            # data_array = data_array.flatten()
            # Get AI prediction
            action_signal, _ = self.model.predict(data_array)
            print(f"AI Prediction: {action_signal}")

            # Convert action_signal to trading actions
            if action_signal == 0:  # Long position
                if self.position and self.position.is_short:
                    print("Closing all short positions before opening long")
                    self.position.close()

                if len(self.trades) < self.max_positions:
                    print("Opening long position")
                    self.buy()

            elif action_signal == 1:  # Short position
                if self.position and self.position.is_long:
                    print("Closing all long positions before opening short")
                    self.position.close()

                if len(self.trades) < self.max_positions:
                    print("Opening short position")
                    self.sell()

            elif action_signal == 2:  # Hold
                print("AI predicted HOLD - No action taken.")
                pass  # Do nothing (hold position)


# Load trained AI model
model_path = "./temp_ai/ppo_forex_trader"  # Path to your trained model
model = PPO.load(model_path)

# Run Backtest
bt = Backtest(df, AIPredictStrategy, cash=10000, commission=.002, exclusive_orders=False)

# Assign the model before running
AIPredictStrategy.model = model
output = bt.run()
bt.plot()

print("Available metrics:", output.keys())

# Print final results
print("\n===== Backtest Results =====")
print(output)

# Extract values safely
start_balance = 10000  # Initial balance
final_balance = output.get("Equity Final [$]", "N/A")
total_trades = output.get("# Trades", "N/A")
win_rate = output.get("Win Rate [%]", "N/A")
profit_factor = output.get("Profit Factor", "N/A")
max_drawdown = output.get("Max Drawdown [%]", output.get("Drawdown [%]", "N/A"))  # Fallback to alternative key

# Display
print(f"Start Balance: ${start_balance}")
print(f"Final Balance: ${final_balance}")
print(f"Total Trades: {total_trades}")
print(f"Win Rate: {win_rate}%")
print(f"Profit Factor: {profit_factor}")
print(f"Max Drawdown: {max_drawdown}%")
