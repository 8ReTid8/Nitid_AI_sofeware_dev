def cal_profit(self):
        current_price = self.data.iloc[self.current_step]["CLOSE"]
        unrealized_profits = [
            trade["size"] * (current_price - trade["entry_price"]) if trade["type"] == "buy"
            else trade["size"] * (trade["entry_price"] - current_price)
            for trade in self.trades
        ]
        current_profit = sum(unrealized_profits)
        return current_profit