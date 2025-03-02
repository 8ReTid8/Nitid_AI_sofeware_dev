import gym
from gym import spaces
import numpy as np
import pandas as pd
from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import DummyVecEnv
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
        self.action_space = spaces.Discrete(4)

        # Observation space: Feature vector representing the market state
        self.observation_space = spaces.Box(
            low=-np.inf, high=np.inf, shape=(window_size,10), dtype=np.float32
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
      
        if len(self.trades) == 0:
            self.open_position("buy", size)
            
            self.open_position("sell", size)    
        
        if action == 0: # Hold
            if self.trades:  
                c_profit = self.cal_profit()
                reward = c_profit - self.past_profit
                self.past_profit = c_profit 
            else:
                reward = -0.5
                
        elif action == 1:  #open position buy
            buy_profit, buy_count = self.cal_profit_buy()
            sell_profit, sell_count = self.cal_profit_sell()
            
            if(buy_count>1 and sell_count==1):
                self.open_position("buy", size)
            elif(sell_count==1 and buy_count==1):
                self.open_position("buy", size)
            else:
                reward = -1
                
        elif action == 2:  #open position sell
            buy_profit, buy_count = self.cal_profit_buy()
            sell_profit, sell_count = self.cal_profit_sell()
            
            if(sell_count>1 and buy_count==1):
                self.open_position("sell", size) 
            elif(buy_count==1 and sell_count==1):
                self.open_position("sell", size)
            else:
                reward = -1
             
        elif action == 3:  #close position
            buy_profit, buy_count = self.cal_profit_buy()
            sell_profit, sell_count = self.cal_profit_sell()
            
            if(buy_count>1):
                profit = 0
                close_indices = [i for i in range(len(self.trades)) if self.trades[i]["type"] == "buy"]
                for i in sorted(close_indices, reverse=True):
                    profit += self.cal_balance(i)
                    
                self.profit += profit
                reward = profit
                self.open_position("buy", size)
            elif(sell_count>1):
                profit = 0
                close_indices = [i for i in range(len(self.trades)) if self.trades[i]["type"] == "sell"]
                for i in sorted(close_indices, reverse=True):
                    profit += self.cal_balance(i)
                    
                self.profit += profit    
                reward = profit
                self.open_position("sell", size)
            else:
                reward = -1
    
        # elif action == 1:  # Buy
        #     buy_profit, buy_count = self.cal_profit_buy()
        #     sell_profit, sell_count = self.cal_profit_sell()
            
            # if(sell_count==1):
            # if(buy_profit<0):
                # self.open_position("buy", size)
                
            # elif(buy_count>1): 
            # if(buy_profit>0 and buy_count>1):
            #     profit = 0
            #     close_indices = [i for i in range(len(self.trades)) if self.trades[i]["type"] == "buy"]
            #     for i in sorted(close_indices, reverse=True):
            #         profit += self.cal_balance(i)
                    
            #     self.profit += profit
            #     reward = profit
            #     self.open_position("buy", size)
            
            # if(sell_count==1):
            #     self.open_position("sell", size)  
            # elif(buy_count==1):
            #     self.open_position("buy", size)

    
                
                
                
        # elif action == 2:  # Sell
        #     sell_profit, sell_count = self.cal_profit_sell()
        #     buy_profit, buy_count = self.cal_profit_buy()
            
            # if(buy_count==1):
            # if(sell_profit<0):
            #     self.open_position("sell", size)
            
            # elif(sell_count>1):
            # if(sell_profit>0 and sell_count>1):
            #     profit = 0
            #     close_indices = [i for i in range(len(self.trades)) if self.trades[i]["type"] == "sell"]
            #     for i in sorted(close_indices, reverse=True):
            #         profit += self.cal_balance(i)
                    
            #     self.profit += profit
            #     reward = profit
            #     self.open_position("sell", size)
                
            # if(buy_count==1):
            #     self.open_position("sell", size)  
            # elif(sell_count==1):
            #     self.open_position("buy", size)
                                             
                                             
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
        
    def cal_profit_buy(self):
        current_price = self.data.iloc[self.current_step]["CLOSE"]
        buy_trades = [trade for trade in self.trades if trade["type"] == "buy"]
        
        buy_profits = sum(
            trade["size"] * (current_price - trade["entry_price"])
            for trade in buy_trades
        )
        
        return buy_profits, len(buy_trades)

    def cal_profit_sell(self):
        current_price = self.data.iloc[self.current_step]["CLOSE"]
        sell_trades = [trade for trade in self.trades if trade["type"] == "sell"]
        
        sell_profits = sum(
            trade["size"] * (trade["entry_price"] - current_price)
            for trade in sell_trades
        )
        
        return sell_profits, len(sell_trades)
    
    def open_position(self, action_type, size):
        price = self.data.iloc[self.current_step]["CLOSE"] 
        if action_type == "buy":
            self.trades.append({"type": "buy", "size": size, "entry_price": price,"hold": 0})
        else:
            self.trades.append({"type": "sell", "size": size, "entry_price": price,"hold": 0})
        return 0.1
       
    
    def cal_balance(self,index):
        current_price = self.data.iloc[self.current_step]["CLOSE"]
        trade = self.trades.pop(index)
        Tprofit = 0
        if trade["type"] == "buy":  # Closing a long position
            Tprofit = trade["size"] * (current_price - trade["entry_price"])
        elif trade["type"] == "sell":  # Closing a short position
            Tprofit = trade["size"] * (trade["entry_price"] - current_price)
        self.balance += Tprofit
        return Tprofit
        

    def render(self, mode="human"):
        trade_types = [trade["type"] for trade in self.trades]
        print(f"Step: {self.current_step}, Action: {action}, Order: {len(self.trades)}, Balance: {self.balance}, Close: {self.data.iloc[self.current_step]["CLOSE"]}, Profit: {self.profit}")
        # print(f"{self.trades}")
        print(f"Trade Types: {trade_types}") 
    


# Example usage
if __name__ == "__main__":
    
    #data
    data = pd.read_csv('./temp_ai/data/EURUSD_H1.csv', delimiter='\t')
    # data = pd.read_csv('./temp_ai/EURUSD_M1.csv', delimiter='\t')
    # data = pd.read_csv('./temp_ai/test.csv', delimiter='\t')
    
    
    data.columns = [col.replace('<', '').replace('>', '') for col in data.columns]
    # data['DATETIME'] = pd.to_datetime(data['DATE'] + ' ' + data['TIME'])
    data = data.drop(["DATE","TIME","TICKVOL","SPREAD"],axis=1)
    # data['DATETIME'] = data['DATETIME'].astype(np.int64)
    data["SMA"] = ta.trend.sma_indicator(data["CLOSE"], window=12)
    data["RSI"] = ta.momentum.rsi(data["CLOSE"])
    data["OBV"] = ta.volume.on_balance_volume(data["CLOSE"], data["VOL"])
    data["EMA_9"] = ta.trend.ema_indicator(data["CLOSE"], window=9)
    data["EMA_21"] = ta.trend.ema_indicator(data["CLOSE"], window=21)
    data = data.fillna(0)
    print(data)

    # Wrap the environment
    env = DummyVecEnv([lambda: ForexTradingEnv(data)])

    # Initialize the PPO model
    # model = PPO("MlpPolicy", env, verbose=1)
    model = PPO(
        "MlpPolicy",
        env,
        learning_rate=0.0003,  # Reduce learning rate for stability
        gamma=0.99,  # Keep high to encourage long-term profit
        gae_lambda=0.95,  # Generalized advantage estimation (helps smooth rewards)
        ent_coef=0.01,  # Encourage exploration
        vf_coef=0.5,  # Value function loss weight
        batch_size=64,  # Process fewer steps per update for stability
        n_steps=2048,  # More steps per update improves training
        clip_range=0.2,  # PPO clipping parameter
        verbose=1
    )

    # Train the model
    model.learn(total_timesteps=300000)

    # Save the model
    model.save("./temp_ai/CUP")

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
