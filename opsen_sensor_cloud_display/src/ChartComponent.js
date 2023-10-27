import React, { useEffect, useReducer, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import moment from 'moment';
import io from 'socket.io-client';
import { PowerJauge } from './PowerJauge';

const ChartComponent = () => {
  const [chartData, setChartData] = useState([]);
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
  const [rerender, setRerender] = useState(false);

  //  const SERVER_URL = 'http://localhost:8003';
  const SERVER_URL = 'http://api.opensensorcloud.com';

  useEffect(() => {
    // Connect to Socket.io server
    const socket = io(SERVER_URL);

    // Listen for messages from the server
    socket.on('message', (message) => {
      console.log('Message from server:', message);
  //    fetchData();
    });

    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    window.addEventListener('keypress', e => {
      // forceUpdate()
      setRerender(!rerender);     //whenever you want to re-render
      setChartData()
    });
  }, []);

  const fetchData = () => {    // Fetch data from API
    //    fetch('http://api.opensensorcloud.com/device/1?limit=14000')
    fetch(SERVER_URL + '/device/1?limit=14000')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        //    data =  data.slice(-1000)
        // Extract relevant data (for demonstration, let's use the 'id' field)
        const res = ['watt_0', 'watt_1', 'watt_2', 'watt'].map((elem, i) => {
          return {
            name: elem,
            data: data.map(item => [moment(item.timestamp).add(2, 'hours').valueOf(), item.data[i].value])
          }
        })
        setChartData(res);  // Use first 10 data points
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    fetchData();

    // Add keypress event listener
    const handleKeyPress = (event) => {
      if (event.key === 'r') {  // Replace 'r' with the key you want
        fetchData();
      }
    };

    window.addEventListener('keypress', handleKeyPress);

    // Cleanup
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, []);

  const options = {
    chart: {
      zoomType: 'x'
    },
    xAxis: {
      type: 'datetime'
    },
    title: {
      text: 'Electricity'
    }, series: chartData
  };
  return (
    <div  >
      <PowerJauge value={10} ></PowerJauge>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
};

export default ChartComponent;
