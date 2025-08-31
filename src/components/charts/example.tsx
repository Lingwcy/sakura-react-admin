import React from 'react';
import ReactECharts from 'echarts-for-react';

const ExampleChart: React.FC = () => {
  const options = {
  xAxis: {
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {},
  series: [
    {
      type: 'bar',
      data: [23, 24, 18, 25, 27, 28, 25]
    },
    {
      type: 'bar',
      data: [26, 24, 18, 22, 23, 20, 27]
    }
  ]
};

  return <ReactECharts option={options} />;
};

export default ExampleChart;