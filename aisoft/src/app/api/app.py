from dash import Dash, html, dcc
import dash_bootstrap_components as dbc
from dash.dependencies import Input, Output, State
import pandas as pd
import plotly.graph_objects as go
import MetaTrader5 as mt5
from mt import get_symbol_names, TIMEFRAMES, TIMEFRAME_DICT
from flask_cors import CORS
from flask import request

# Initialize the Dash app and allow CORS
app = Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])
CORS(app.server)

# Dropdown for symbol selection
symbol_dropdown = html.Div([
    html.P('Symbol:'),
    dcc.Dropdown(
        id='symbol-dropdown',
        options=[{'label': symbol, 'value': symbol} for symbol in get_symbol_names()],
        value='EURUSD'
    )
])

# Dropdown for timeframe selection
timeframe_dropdown = html.Div([
    html.P('Timeframe:'),
    dcc.Dropdown(
        id='timeframe-dropdown',
        options=[{'label': timeframe, 'value': timeframe} for timeframe in TIMEFRAMES],
        value='D1'
    )
])

# Input for number of bars
num_bars_input = html.Div([
    html.P('Number of Candles'),
    dbc.Input(id='num-bar-input', type='number', value=20)
])

# Layout for the Dash app
app.layout = html.Div([
    html.H1('Real-Time Charts'),

    dbc.Row([
        dbc.Col(symbol_dropdown),
        dbc.Col(timeframe_dropdown),
        dbc.Col(num_bars_input)
    ]),

    html.Hr(),

    dcc.Interval(id='update', interval=200),

    html.Div(id='page-content')

], style={'margin-left': '5%', 'margin-right': '5%', 'margin-top': '20px'})


# Callback for updating the chart
@app.callback(
    Output('page-content', 'children'),
    Input('update', 'n_intervals'),
    State('symbol-dropdown', 'value'),
    State('timeframe-dropdown', 'value'),
    State('num-bar-input', 'value')
)
def update_ohlc_chart(interval, symbol, timeframe, num_bars):
    # Fallback to request parameters if app is accessed via URL with query params
    symbol = request.args.get('symbol', symbol)
    timeframe = request.args.get('timeframe', timeframe)
    num_bars = int(request.args.get('num_bars', num_bars))

    # Generate the chart
    timeframe_str = timeframe
    timeframe = TIMEFRAME_DICT[timeframe]
    bars = mt5.copy_rates_from_pos(symbol, timeframe, 0, num_bars)
    df = pd.DataFrame(bars)
    df['time'] = pd.to_datetime(df['time'], unit='s')

    fig = go.Figure(data=go.Candlestick(x=df['time'],
                    open=df['open'],
                    high=df['high'],
                    low=df['low'],
                    close=df['close']))

    fig.update(layout_xaxis_rangeslider_visible=False)
    fig.update_layout(yaxis={'side': 'right'})
    fig.layout.xaxis.fixedrange = True
    fig.layout.yaxis.fixedrange = True

    return [
        html.H2(id='chart-details', children=f'{symbol} - {timeframe_str}'),
        dcc.Graph(figure=fig, config={'displayModeBar': False})
    ]


if __name__ == '__main__':
    # Start the Dash server
    app.run_server()
