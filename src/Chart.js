import React from 'react';
import Chart from 'chart.js/auto';

class MyChart extends React.Component
{
  constructor(props)
  { 
    super(props);
    this.state = {
      labels : this.props.labels,
      data : this.props.data,
      chartLabel : `${this.props.base}/${this.props.quote}`
    };

    this.chartRef = React.createRef();
  }

  componentDidMount()
  {
    const chartdata = {
      labels : this.state.labels,
      datasets : [{
        label : this.state.chartLabel,
        backgroundColor : 'rgb(255, 195, 11)',
        borderColor : 'rgb(255, 195, 11)',
        data : this.state.data
      }]
    };

    const chartConfig = {
      type : 'line',
      data : chartdata,
      options : {}
    };

    const myChart = new Chart(this.chartRef.current, chartConfig);
  }
  render()
  {
    return(
      <figure className='my-3'>
        <canvas ref={this.chartRef}></canvas>
      </figure>
    );
  }
}

export default MyChart;