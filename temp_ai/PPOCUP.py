import gym
from gym import spaces
import numpy as np
import pandas as pd
from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import DummyVecEnv

class ForexTradingEnv(gym.Env):
    def __init__(self, data, initial_balance=100000, max_position_size=1.0,window_size=20):
        super(ForexTradingEnv, self).__init__()
        self.data = data
        self.initial_balance = initial_balance
        self.max_position_size = max_position_size
        self.window_size = window_size

        # Define action space: [0: Hold, 1: Buy, 2: Sell, 3: Close Position]
        self.action_space = spaces.Discrete(3)

        # Observation space: Feature vector representing the market state
        self.observation_space = spaces.Box(
            low=-np.inf, high=np.inf, shape=(window_size * self.data.shape[1],), dtype=np.float32
        )

        self.reset()

    def reset(self):
        self.balance = self.initial_balance
        # self.trades = [] 
        self.current_trade = None
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
        state = self.data.iloc[start:end].values.flatten()
        return state

    def step(self, action):
        reward = 0
        size = 10000
        # if len(self.trades) > 0:
        #     for trade in self.trades:
        # self.current_trade["hold"] += 1
                
        if action == 0: # Hold
            if self.current_trade and (self.current_trade["type"] == "buy" or self.current_trade["type"] == "sell"):
                reward = 0.01
            else :
                reward = -1

        elif action == 1:  # Buy
            if self.current_trade:
                if self.current_trade["type"] == "sell":
                    reward = self.close_position()
                elif self.current_trade["type"] == "buy":
                    reward = 0.001
            else:
                reward = self.open_position("buy", size)
                
        elif action == 2:  # Sell
            if self.current_trade:
                if self.current_trade["type"] == "buy":
                    reward = self.close_position()
                elif self.current_trade["type"] == "sell":
                    reward = 0.001
            else:
                reward = self.open_position("sell", size)
        
        # elif action == 3:  # Close Position
        #     if self.trades:  
        #         current_price = self.data.iloc[self.current_step]["CLOSE"]
        #         unrealized_profits = [
        #             trade["size"] * (current_price - trade["entry_price"]) if trade["type"] == "buy"
        #             else trade["size"] * (trade["entry_price"] - current_price)
        #             for trade in self.trades
        #         ]
        #         reward = self.close_position(unrealized_profits,size)
        #     else:
        #         reward = -2

        # Update state and check if the episode is done
        self.current_step += 1
        if self.current_step >= len(self.data) - 1:
            self.done = True

        next_state = self._get_state()
        return next_state, reward, self.done, {}
    
    def open_position(self, action_type, size):
        price = self.data.iloc[self.current_step]["CLOSE"]
        cost = size * price
        if self.balance >= cost:
            self.balance -= cost
            self.current_trade = {"type": action_type, "size": size, "entry_price": price}
            return 0.1  # Small reward for successfully opening a trade
        else:
            return -1  # Penalty for insufficient balance

    # def open_position(self, action_type, size):
    #     price = self.data.iloc[self.current_step]["CLOSE"] 
    #     cost = size * price
    #     if self.balance >= cost:  # Check if there's enough balance
    #         self.balance -= cost
    #         if action_type == "buy":
    #             self.trades.append({"type": "buy", "size": size, "entry_price": price,"hold": 0})
    #         else:
    #             self.trades.append({"type": "sell", "size": size, "entry_price": price,"hold": 0})
    #     return 0.1
       
    def close_position(self):
        current_price = self.data.iloc[self.current_step]["CLOSE"]
        if self.current_trade["type"] == "buy":  # Closing a long position
            profit = self.current_trade["size"] * (current_price - self.current_trade["entry_price"])
            self.balance += ((self.current_trade["entry_price"]*self.current_trade["size"]) + profit)
        elif self.current_trade["type"] == "sell":  # Closing a short position
            profit = self.current_trade["size"] * (self.current_trade["entry_price"] - current_price)
            self.balance += ((self.current_trade["entry_price"]*self.current_trade["size"]) + profit)
        self.profit += profit
        self.current_trade = None
        return profit
           
    # def close_position(self, unknownprofit ,size):
    #     temp = sum(unknownprofit)
    #     profit = 0
    #     if(temp<5):
    #         for i in range(len(unknownprofit) - 1, -1, -1):
    #             if unknownprofit[i] > 0 or self.trades[i]["hold"] > 168:
    #                 profit += self.cal_balance(i)
    #     else:
    #         for i in range(len(unknownprofit) - 1, -1, -1):
    #                 profit += self.cal_balance(i)
                
    #     self.profit += profit
    #     return(profit)
    
    
    # def cal_balance(self,index):
    #     current_price = self.data.iloc[self.current_step]["CLOSE"]
    #     trade = self.trades.pop(index)
    #     if trade["type"] == "buy":  # Closing a long position
    #         profit = trade["size"] * (current_price - trade["entry_price"])
    #         self.balance += ((trade["entry_price"]*trade["size"]) + profit)
    #     elif trade["type"] == "sell":  # Closing a short position
    #         profit = trade["size"] * (trade["entry_price"] - current_price)
    #         self.balance += ((trade["entry_price"]*trade["size"]) + profit)
    #     return profit
        

    def render(self, mode="human"):
        print(f"Step: {self.current_step}, Action: {action}, Balance: {self.balance}, Profit: {self.profit}")
    


# Example usage
if __name__ == "__main__":
    
    #data
    # data = pd.read_csv('EURUSD_H1.csv', delimiter='\t')
    data = pd.read_csv('./temp_ai/EURUSD_M1.csv', delimiter='\t')
    
    data.columns = [col.replace('<', '').replace('>', '') for col in data.columns]
    data['DATETIME'] = pd.to_datetime(data['DATE'] + ' ' + data['TIME'])
    data = data.drop(["DATE","TIME"],axis=1)
    data['DATETIME'] = data['DATETIME'].astype(np.int64)
    print(data)
    # Wrap the environment
    env = DummyVecEnv([lambda: ForexTradingEnv(data)])

    # Initialize the PPO model
    model = PPO("MlpPolicy", env, verbose=1)

    # Train the model
    model.learn(total_timesteps=10000)

    # Save the model
    model.save("./temp_ai/ppo_forex_trader")

    # model = PPO.load("ppo_forex_trader")
    
    # Test the model
    env = ForexTradingEnv(data)  # Use the base environment for testing
    obs = env.reset()
    for _ in range(50000):
        action, _states = model.predict(obs)
        obs, reward, done, info = env.step(action)
        env.render()
        if done:
            break
