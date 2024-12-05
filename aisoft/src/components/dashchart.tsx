type ChartProps = {
    symbol: string;
    timeframe: string;
    numBars: number;
  };

export default function Chart({ symbol, timeframe, numBars }: ChartProps) {
    const dashUrl = `http://localhost:8050?page-content=true&symbol=${symbol}&timeframe=${timeframe}&num_bars=${numBars}`;
    return (
        <iframe
            src={dashUrl}
            style={{
                width: '100%',
                height: '600px',
                border: 'none'
            }}
            title="Real-Time Chart"
        />
    );
}