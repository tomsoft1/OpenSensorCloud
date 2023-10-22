import streamlit as st
import pandas as pd
import numpy as np
from flatten_json import flatten

DATE_COLUMN = 'date/time'
#DATA_URL = ('http://localhost:3000/device/1')
DATA_URL = ('http://api.opensensorcloud.com/device/1')

def load_data(nrows):
    data = pd.read_json(DATA_URL,orient="records")
    [print("la:"+d) for d in data]
    tmp = pd.json_normalize(pd.json_normalize(data['data'])[3])
    tmp.insert(1,'d1',pd.json_normalize(pd.json_normalize(data['data'])[0])['value'])
    tmp.insert(1,'d2',pd.json_normalize(pd.json_normalize(data['data'])[1])['value'])
    tmp.insert(1,'d3',pd.json_normalize(pd.json_normalize(data['data'])[2])['value'])
    tmp.insert(1,'timestamp',data['timestamp'])
    print('la:',tmp)
#    lowercase = lambda x: str(x).lower()
#    data.rename(lowercase, axis='columns', inplace=True)
#    data[DATE_COLUMN] = pd.to_datetime(data[DATE_COLUMN])
    return tmp

st.title('Data consumption')

# Create a text element and let the reader know the data is loading.
data_load_state = st.text('Loading data...')
# Load 10,000 rows of data into the dataframe.
data = load_data(2)
print(data)
# Notify the reader that the data was successfully loaded.
data_load_state.text('Loading data...done!')

st.subheader('Raw data')
st.write(data)

st.subheader('Number of pickups by hour')
hist_values = st.line_chart(data,y=['value','d1','d2','d3'],x='timestamp')
#st.bar_chart(hist_values)

def change_state(name):
    print("Change state of: "+name)

option_1 = st.checkbox('Line1')
if option_1:
    print('option 1 selected')
option_2 = st.checkbox('Line2')
option_3 = st.checkbox('Line3')
option_4 = st.checkbox('Total')

if 'clicked' not in st.session_state:
    st.session_state.clicked = False


def click_button():
    st.session_state.clicked = True

st.button('Click me', on_click=click_button)

if st.session_state.clicked:
    # The message and nested widget will remain on the page
    st.write('Button clicked!')
