import gym
from gym import spaces
import numpy as np
import pandas as pd
from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import DummyVecEnv

class ForexTradingEnv(gym.Env):
    def __init__(self, data, initial_balance=10000, max_position_size=1.0):
        super(ForexTradingEnv, self).__init__()
        self.data = data
        self.initial_balance = initial_balance
        self.max_position_size = max_position_size

        # Define action space: [0: Hold, 1: Buy, 2: Sell, 3: Close Position]
        self.action_space = spaces.Discrete(4)

        # Observation space: Feature vector representing the market state
        self.observation_space = spaces.Box(
            low=-np.inf, high=np.inf, shape=(self.data.shape[1],), dtype=np.float32
        )

        self.reset()

    def reset(self):
        self.balance = self.initial_balance
        # self.position_size = 0
        self.trades = [] 
        self.current_step = 0
        self.done = False
        self.profit = 0
        return self.data.iloc[self.current_step].values

    def step(self, action):
        reward = 0
        if action == 0:
            reward += 0
        elif action == 1:  # Buy
            self.open_position("buy")
        elif action == 2:  # Sell
            self.open_position("sell")
        elif action == 3:  # Close Position
            if self.trades:  # Ensure there are trades to close
            # Find the most profitable trade
                current_price = self.data.iloc[self.current_step]["CLOSE"]
                unrealized_profits = [
                    trade["size"] * (current_price - trade["entry_price"]) if trade["type"] == "buy"
                    else trade["size"] * (trade["entry_price"] - current_price)
                    for trade in self.trades
                ]
                max_profit = max(unrealized_profits)
                if max_profit > 0:  # Only close if the most profitable trade has positive profit
                    most_profitable_index = np.argmax(unrealized_profits)
                    reward = self.close_position(most_profitable_index)
                else:
                    # Do nothing if no trades have positive unrealized profits
                    reward += 0

        # Update state and check if the episode is done
        self.current_step += 1
        if self.current_step >= len(self.data) - 1:
            self.done = True

        next_state = self.data.iloc[self.current_step].values
        return next_state, reward, self.done, {}

    def open_position(self, action_type, size=2.0):
        price = self.data.iloc[self.current_step]["CLOSE"] 
        cost = size * price
        if self.balance >= cost:  # Check if there's enough balance
            self.balance -= cost
            if action_type == "buy":
                self.trades.append({"type": "buy", "size": size, "entry_price": price})
            else:
                self.trades.append({"type": "sell", "size": size, "entry_price": price})   
        else:
            print("Insufficient balance to buy.")
       

    def close_position(self, trade_index):
        if trade_index < 0 or trade_index >= len(self.trades):
            print("Invalid trade index.")
            return 0

        current_price = self.data.iloc[self.current_step]["CLOSE"]
        trade = self.trades.pop(trade_index)

        if trade["type"] == "buy":  # Closing a long position
            profit = trade["size"] * (current_price - trade["entry_price"])
            self.balance += ((trade["entry_price"]*trade["size"]) + profit)
        elif trade["type"] == "sell":  # Closing a short position
            profit = trade["size"] * (trade["entry_price"] - current_price)
            self.balance += ((trade["entry_price"]*trade["size"]) + profit)

        else:
            profit = 0

        self.profit += profit
        return profit  # Use profit as reward

    def render(self, mode="human"):
        print(f"Step: {self.current_step}, Count: {len(self.trades)}, Balance: {self.balance}, Profit: {self.profit}")
    


# Example usage
if __name__ == "__main__":
    # Load dummy forex data

    # data = pd.DataFrame({
    #     "Open": np.random.rand(1000) + 1.1,
    #     "High": np.random.rand(1000) + 1.2,
    #     "Low": np.random.rand(1000) + 1.0,
    #     "Close": np.random.rand(1000) + 1.15,
    #     "Volume": np.random.randint(100, 200, 1000),
    # })
    
    data = pd.read_csv('EURUSD_H1.csv', delimiter='\t')
    data.columns = [col.replace('<', '').replace('>', '') for col in data.columns]
    data = data.drop(["DATE","TIME"],axis=1)
    print(data)

    # Wrap the environment
    env = DummyVecEnv([lambda: ForexTradingEnv(data)])

    # Initialize the PPO model
    model = PPO("MlpPolicy", env, verbose=1)

    # Train the model
    model.learn(total_timesteps=10000)

    # Save the model
    model.save("ppo_forex_trader")

    # model = PPO.load("ppo_forex_trader")
    

    # Test the model
    env = ForexTradingEnv(data)  # Use the base environment for testing
    obs = env.reset()
    for _ in range(500):
        action, _states = model.predict(obs)
        obs, reward, done, info = env.step(action)
        env.render()
        if done:
            break
