"use client";
import React, { useEffect, useRef } from 'react';

const TradingViewWidget = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ensure TradingView script is loaded
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "width": "100%",
      "height": "610",
      "symbol": "FX:EURUSD",
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "light",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "hide_top_toolbar": true,
      "allow_symbol_change": true,
      "calendar": false,
      "support_host": "https://www.tradingview.com"
    });

    if (container.current) {
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Live Forex Rates</h2>
      <div className="tradingview-widget-container" ref={container}>
        <div className="tradingview-widget-container__widget"></div>
      </div>
    </div>
  );
};

const ForexMultipleSymbols = () => {
  const symbols = [
    "FX:EURUSD",
    "FX:GBPUSD",
    "FX:USDJPY"
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Forex Currencies</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {symbols.map((symbol) => (
          <div key={symbol} className="border rounded-lg overflow-hidden">
            <div 
              className="tradingview-widget-container"
              style={{ height: "300px", width: "100%" }}
            >
              <iframe
                scrolling="no"
                marginHeight={100}
                marginWidth={100}
                src={`https://www.tradingview.com/embed-widget/mini-symbol-overview/?locale=en#%7B%22symbol%22%3A%22${symbol}%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22300%22%2C%22dateRange%22%3A%2212M%22%2C%22colorTheme%22%3A%22light%22%2C%22trendLineColor%22%3A%22rgba(41%2C%2098%2C%20255%2C%201)%22%2C%22underLineColor%22%3A%22rgba(41%2C%2098%2C%20255%2C%200.3)%22%2C%22underLineBottomColor%22%3A%22rgba(41%2C%2098%2C%20255%2C%200)%22%2C%22interval%22%3A%22D%22%2C%22scalingColor%22%3A%22rgba(41%2C%2098%2C%20255%2C%201)%22%2C%22scalingType%22%3A%22logarithmic%22%7D`}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ForexCharts() {
  return (
    <div>
      <TradingViewWidget />
      {/* <ForexMultipleSymbols /> */}
    </div>
  );
}