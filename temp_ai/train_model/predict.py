import numpy as np
import pandas as pd
from stable_baselines3 import PPO
import MetaTrader5 as mt5
from datetime import datetime
import time

# Initialize MetaTrader 5
mt5.initialize()

def load_model(model_path):
    """Load the trained model."""
    model = PPO.load(model_path)
    return model

def evaluate_model(data, model_path="/temp_ai/ppo_forex_trader.zip"):
    """Evaluate the model and predict actions."""
    model = load_model(model_path)
    
    # Ensure that data is a 1D array with 3 features, append 0 to make it 4 features
    state = data  # Add a 0 to make it 4 features
    
    print("Starting evaluation...\n")
    
    # Predict the action
    action, _ = model.predict(state)

    print(f"Predicted action: {action}")
    return int(action)  # Convert action to int

    
# def fetch_eur_usd_data(symbol="EURUSD"):
#     """Fetch the last 1 minute of EURUSD data from MT5 and prepare a 7-feature state."""
#     rates = mt5.copy_rates_from_pos(symbol, mt5.TIMEFRAME_M1, 0, 1)

#     if rates is not None and len(rates) > 0:
#         rate = rates[0]
#         time_stamp = datetime.fromtimestamp(rate[0])
#         open_price = rate[1]
#         high_price = rate[2]
#         low_price = rate[3]
#         close_price = rate[4]
#         volume = rate[5]
        
#         print(f"Time: {time_stamp}, Open: {open_price}, High: {high_price}, Low: {low_price}, Close: {close_price}, Volume: {volume}")
        
#         # Example of a 7-feature state
#         return np.array([
#             open_price,
#             high_price,
#             low_price,
#             close_price,
#             volume,
#             high_price - low_price,        # Range
#             close_price - open_price       # Price change
#         ])
#     else:
#         print("Failed to retrieve data.")
#         return None
def fetch_eur_usd_data(symbol="EURUSD", window_size=20):
    """
    Fetch the last `window_size` minutes of EURUSD data from MT5 and prepare a state.
    """
    rates = mt5.copy_rates_from_pos(symbol, mt5.TIMEFRAME_M1, 0, window_size)

    if rates is not None and len(rates) == window_size:
        rates_df = pd.DataFrame(rates)
        rates_df['range'] = rates_df['high'] - rates_df['low']
        rates_df['price_change'] = rates_df['close'] - rates_df['open']

        # Select the required columns and convert to a NumPy array
        features = rates_df[['open', 'high', 'low', 'close', 'tick_volume', 'range', 'price_change']].values

        # Flatten the array
        state = features.flatten()
        return state
    else:
        print("Insufficient data retrieved or failed to retrieve data.")
        return None


def send_order(action, symbol="EURUSD", lot=0.1):
    """Send orders based on the predicted action."""
    if action == 0:  # Hold
        print("Action: Hold. No orders sent.")
    elif action == 1:  # Buy Long
        
        symbol_info = mt5.symbol_info(symbol)
        if not symbol_info or not symbol_info.visible:
            print(f"Symbol {symbol} not found or not visible.")
            return
        
        max_retries = 3  # Limit retries to prevent infinite loop
        retries = 0
        
        while retries < max_retries:
            request = {
                "action": mt5.TRADE_ACTION_DEAL,
                "symbol": symbol,
                "volume": lot,
                "type": mt5.ORDER_TYPE_BUY,
                "price": mt5.symbol_info_tick(symbol).ask,  # Use updated price
                "deviation": 100,  # Adjust price deviation
                "magic": 234000,
                "comment": "Buy Long",
                "type_time": mt5.ORDER_TIME_GTC,
                "type_filling": mt5.ORDER_FILLING_IOC,
            }
            result = mt5.order_send(request)

            if result.retcode == mt5.TRADE_RETCODE_DONE:
                print(f"Buy Long successful: {result}")
                break
            elif result.retcode == 10004:  # Requote error
                print(f"Buy Long failed with error code 10004, Requote. Retrying {retries + 1}/{max_retries}...")
                retries += 1
            else:
                print(f"Buy Long failed with error code {result.retcode}: {result}")
                break

    elif action == 2:  # Sell Short
        max_retries = 3
        retries = 0

        while retries < max_retries:
            tick = mt5.symbol_info_tick(symbol)
            if not tick:
                print(f"Failed to get tick data for {symbol}. Cannot place Sell Short order.")
                break

            # Create the trade request
            request = {
                "action": mt5.TRADE_ACTION_DEAL,
                "symbol": symbol,
                "volume": lot,
                "type": mt5.ORDER_TYPE_SELL,
                "price": tick.bid,
                "deviation": 50,
                "magic": 234000,
                "comment": "Sell Short",
                "type_time": mt5.ORDER_TIME_GTC,
                "type_filling": mt5.ORDER_FILLING_RETURN,
            }

            print(f"Attempting Sell Short with request: {request}")
            result = mt5.order_send(request)

            if result.retcode == mt5.TRADE_RETCODE_DONE:
                print(f"Sell Short successful: {result}")
                break
            elif result.retcode in (10004, 10021):  # Requote or No prices
                retries += 1
                print(f"Sell Short failed with error {result.retcode}: {result.comment}. Retrying {retries}/{max_retries}...")
                time.sleep(1)  # Wait 1 second before retrying
            else:
                print(f"Sell Short failed with error code {result.retcode}, {result.comment}")
                break

        if retries == max_retries:
            print(f"Sell Short failed after {max_retries} attempts.")

    elif action == 3:  # Close Position
        # Get all open positions for the symbol
        positions = mt5.positions_get(symbol=symbol)
        if not positions:
            print(f"No open positions found for {symbol}.")
            return

        tick = mt5.symbol_info_tick(symbol)
        if not tick:
            print(f"Failed to get tick data for {symbol}. Cannot close position.")
            return
        
        profitsum = 0
        profitplussum = 0
        for pos in positions:
            profitsum += pos.profit
            if pos.profit>0:
                profitplussum += pos.profit
                
        if profitsum>5:
            for pos in positions:
                if pos.type == mt5.ORDER_TYPE_BUY:
                    order_type = mt5.ORDER_TYPE_SELL
                    price = tick.bid
                elif pos.type == mt5.ORDER_TYPE_SELL:
                    order_type = mt5.ORDER_TYPE_BUY
                    price = tick.ask
                else:
                    print(f"Unknown position type: {pos.type}")
                    continue
                close_position(pos, symbol, tick,order_type,price)
                
        elif profitplussum>5:
            for pos in positions:
                if pos.profit>0 or pos.profit<-10:
                    if pos.type == mt5.ORDER_TYPE_BUY:
                        order_type = mt5.ORDER_TYPE_SELL
                        price = tick.bid
                    elif pos.type == mt5.ORDER_TYPE_SELL:
                        order_type = mt5.ORDER_TYPE_BUY
                        price = tick.ask
                else:
                    print(f"Unknown position type: {pos.type} {profitsum}")
                    continue
                close_position(pos, symbol, tick,order_type,price)
        else:
            print("there is no not reach minimum profit")

    elif action == 4:  # Do Nothing
        print("Action: Do Nothing. No orders sent.")
    
def close_position(pos, symbol, tick,order_type,price):
    max_retries = 3
    retries = 0

    while retries < max_retries:
        # Create the trade request
        request = {
            "action": mt5.TRADE_ACTION_DEAL,
            "symbol": symbol,
            "volume": pos.volume,
            "type": order_type,
            "price": price,
            "deviation": 50,
            "magic": 234000,
            "comment": "Close Position",
            "type_time": mt5.ORDER_TIME_GTC,
            "type_filling": mt5.ORDER_FILLING_IOC,
            "position": pos.ticket,  # Reference the position ticket
        }

        print(f"Attempting to close position with request: {request}")

        result = mt5.order_send(request)
        if result.retcode == mt5.TRADE_RETCODE_DONE:
            print(f"Successfully closed position {pos.ticket}.")
            break
        elif result.retcode == mt5.TRADE_RETCODE_REQUOTE:
            print(f"Requote encountered. Retrying {retries + 1}/{max_retries}...")
            retries += 1
            # Update the price for the retry
            tick = mt5.symbol_info_tick(symbol)
            if not tick:
                print(f"Failed to get updated tick data for {symbol}.")
                break
            price = tick.bid if order_type == mt5.ORDER_TYPE_SELL else tick.ask
        else:
            print(f"Failed to close position {pos.ticket}. Error: {result.comment} (Error Code: {result.retcode})")
            break
            
# Example Usage
if __name__ == "__main__":
    model_path = "./temp_ai/ppo_forex_trader"  # Path to your trained model
    
    # Log in to MT5
    login = 89468246 # Your login
    password = '-4YkNdCm'  # Your password
    server = 'MetaQuotes-Demo'  # Correct server
    # 	nsyCSFXe
    
    login_result = mt5.login(login, password, server)
    if login_result:
        print("Login successful!")
    else:
        print("Login failed.")
        mt5.shutdown()
        exit(1)

    try:
        while True:
            data = fetch_eur_usd_data(window_size=20)
            if data is not None:
                action = evaluate_model(data, model_path)
                send_order(action)

            time.sleep(60)  # Sleep for 1 minute
    except KeyboardInterrupt:
        print("Program interrupted. Shutting down...")
    finally:
        mt5.shutdown()
