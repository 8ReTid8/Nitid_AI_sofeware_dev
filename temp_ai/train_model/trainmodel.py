import gym
from gym import spaces
import numpy as np
import pandas as pd
from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import DummyVecEnv,VecNormalize
import ta

class ForexTradingEnv(gym.Env):
    def __init__(self, data, initial_balance=100000, max_position_size=1.0,window_size=48):
        super(ForexTradingEnv, self).__init__()
        self.data = data
        self.initial_balance = initial_balance
        self.max_position_size = max_position_size
        self.window_size = window_size
        self.past_profit = 0
        
        # Define action space: [0: Hold, 1: Buy, 2: Sell, 3: Close Position]
        self.action_space = spaces.Discrete(3)

        # Observation space: Feature vector representing the market state
        self.observation_space = spaces.Box(
            low=-np.inf, high=np.inf, shape=(window_size,18), dtype=np.float32
        )

        self.reset()

    def reset(self):
        self.balance = self.initial_balance
        self.trades = [] 
        self.current_step = self.window_size
        self.done = False
        self.profit = 0
        # return self.data.iloc[self.current_step].values
        return self._get_state()
    
    def _get_state(self):
        """
        Create the current state by stacking features from the last `window_size` steps.
        """
        start = self.current_step - self.window_size
        end = self.current_step
        state = self.data.iloc[start:end].values
        return state

    def step(self, action):
        reward = 0
        size = 10000
        # if len(self.trades) > 0:
        #     for trade in self.trades:
        #         trade["hold"] += 1
        # current_profit = self.cal_profit()
    
        # # Reward based on profit change
        # reward = current_profit - self.past_profit
        # self.past_profit = current_profit
        
        if action == 0: # Hold
            if self.trades:  
                c_profit = self.cal_profit()
                reward = c_profit - self.past_profit
                self.past_profit = c_profit 
            else:
                reward = -1
                
        elif action == 1:  # Buy
            # reward = self.open_position("buy", size)
            
            # if len(self.trades) < 5:
            #     reward = self.open_position("buy", size)
            # else:
            #     reward = -1
            
            profit = 0
            close_indices = [i for i in range(len(self.trades)) if self.trades[i]["type"] == "sell"]
            for i in sorted(close_indices, reverse=True):
                profit += self.cal_balance(i)
            self.profit += profit
            
            # if current_profit > 0:
            #     reward += 0.1 * current_profit  # Encourage profitable trades
            # else:
            #     reward -= 0.05 * abs(current_profit)
            # self.open_position("buy", size)
              
            # reward += profit
            buy_trades = [trade for trade in self.trades if trade["type"] == "buy"]  
            if len(buy_trades) < 10:
                self.open_position("buy", size)
            else:
                reward -= 1               
                
        elif action == 2:  # Sell
            #  reward = self.open_position("sell", size)
                
            # if len(self.trades) < 5:
            #     reward = self.open_position("sell", size)
            # else:
            #     reward = -1
                  
            profit = 0
            close_indices = [i for i in range(len(self.trades)) if self.trades[i]["type"] == "buy"]
            
            for i in sorted(close_indices, reverse=True):
                profit += self.cal_balance(i)
            self.profit += profit
            
            # if current_profit > 0:
            #     reward += 0.1 * current_profit  # Encourage profitable trades
            # else:
            #     reward -= 0.05 * abs(current_profit) 
            # self.open_position("sell", size)
            
            reward += profit
            sell_trades = [trade for trade in self.trades if trade["type"] == "sell"]
            if len(sell_trades) < 10:
                self.open_position("sell", size)
            else:
                reward -= 1
        
        # Update state and check if the episode is done
        self.current_step += 1
        if self.current_step >= len(self.data) - 1:
            self.done = True
        
        next_state = self._get_state()
        return next_state, reward, self.done, {}
    
    def cal_profit(self):
        current_price = self.data.iloc[self.current_step]["CLOSE"]
        unrealized_profits = [
            trade["size"] * (current_price - trade["entry_price"]) if trade["type"] == "buy"
            else trade["size"] * (trade["entry_price"] - current_price)
            for trade in self.trades
        ]
        current_profit = sum(unrealized_profits)
        return current_profit
        
    
    def open_position(self, action_type, size):
        price = self.data.iloc[self.current_step]["CLOSE"] 
        if action_type == "buy":
            self.trades.append({"type": "buy", "size": size, "entry_price": price,"hold": 0})
        else:
            self.trades.append({"type": "sell", "size": size, "entry_price": price,"hold": 0})
        return 0.1
       
     
    def close_position(self, unknownprofit ,size):
        temp = sum(unknownprofit)
        profit = 0
        if(temp<5):
            for i in range(len(unknownprofit) - 1, -1, -1):
                if unknownprofit[i] > 0 or self.trades[i]["hold"] > 168:
                    profit += self.cal_balance(i)
        else:
            for i in range(len(unknownprofit) - 1, -1, -1):
                    profit += self.cal_balance(i)
                
        self.profit += profit
        return(profit)
    
    
    def cal_balance(self,index):
        current_price = self.data.iloc[self.current_step]["CLOSE"]
        trade = self.trades.pop(index)
        Tprofit = 0
        if trade["type"] == "buy":  # Closing a long position
            Tprofit = trade["size"] * (current_price - trade["entry_price"])
        elif trade["type"] == "sell":  # Closing a short position
            Tprofit = trade["size"] * (trade["entry_price"] - current_price)
            
        # self.balance += ((trade["entry_price"]*trade["size"]) + Tprofit)
        self.balance += Tprofit
        return Tprofit

    def render(self, mode="human"):
        print(f"Step: {self.current_step}, Action: {action}, Order: {len(self.trades)}, Balance: {self.balance}, Close: {self.data.iloc[self.current_step]["CLOSE"]}, Profit: {self.profit}")
    


# Example usage
if __name__ == "__main__":
    
    #data
    data = pd.read_csv('./temp_ai/data/EURUSD_H1.csv', delimiter='\t')
    # data = pd.read_csv('./temp_ai/EURUSD_M1.csv', delimiter='\t')
    # data = pd.read_csv('./temp_ai/test.csv', delimiter='\t')
    
    data.columns = [col.replace('<', '').replace('>', '') for col in data.columns]
    data = data.drop(["DATE","TIME","VOL","SPREAD"],axis=1)
        
    data["SMA"] = ta.trend.sma_indicator(data["CLOSE"], window=12)
    data["RSI"] = ta.momentum.rsi(data["CLOSE"])
    data["OBV"] = ta.volume.on_balance_volume(data["CLOSE"], data["TICKVOL"])
    data["EMA_9"] = ta.trend.ema_indicator(data["CLOSE"], window=9)
    data["EMA_21"] = ta.trend.ema_indicator(data["CLOSE"], window=21)
    
    # MACD
    data["MACD"] = ta.trend.macd(data["CLOSE"])
    data["MACD_SIGNAL"] = ta.trend.macd_signal(data["CLOSE"])

    # ADX (Trend Strength)
    data["ADX"] = ta.trend.adx(data["HIGH"], data["LOW"], data["CLOSE"])

    # Bollinger Bands (Volatility)
    data["BB_UPPER"] = ta.volatility.bollinger_hband(data["CLOSE"])
    data["BB_LOWER"] = ta.volatility.bollinger_lband(data["CLOSE"])

    # ATR (Volatility)
    data["ATR"] = ta.volatility.average_true_range(data["HIGH"], data["LOW"], data["CLOSE"])

    # Stochastic Oscillator (Reversals)
    data["STOCH"] = ta.momentum.stoch(data["HIGH"], data["LOW"], data["CLOSE"])

    # Williams %R (Reversals)
    data["WILLR"] = ta.momentum.williams_r(data["HIGH"], data["LOW"], data["CLOSE"])

    data = data.fillna(0)
    print(data)

    # Wrap the environment
    env = DummyVecEnv([lambda: ForexTradingEnv(data)])
    env = VecNormalize(env, norm_reward=True)
    
    # Initialize the PPO model
    # model = PPO("MlpPolicy", env, verbose=1)
    model = PPO(
        "MlpPolicy",
        env,
        learning_rate=0.0001, 
        batch_size=256,
        gae_lambda=0.95,
        ent_coef=0.01,  # Encourage exploration
        verbose=1
    )

    # Train the model
    model.learn(total_timesteps=200000)

    # Save the model
    model.save("./temp_ai/model/EURUSD/ppo_forex_trader")

    # model = PPO.load("ppo_forex_trader")
    
    # Test the model
    env = ForexTradingEnv(data)  # Use the base environment for testing
    obs = env.reset()
    for _ in range(10000):
    # while True:
        action, _states = model.predict(obs)
        obs, reward, done, info = env.step(action)
        env.render()
        if done:
            break

