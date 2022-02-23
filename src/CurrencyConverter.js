import React from "react";
import './CurrencyConverter.css'
import Chart from 'chart.js/auto';

class CurrencyConverter extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      baseCurrency: this.props.baseCurrency,
      baseCurrencyFullName: 'US Dollars',
      secondaryCurrency: this.props.secondaryCurrency,
      secondaryCurrencyFullName: 'Euros',
      amount: this.props.amount.toFixed(2),
      exchangeRate: 0,
      currencyNames: {},
      currentDate: new Date().toISOString().split('T')[0]
    };

    this.changeHandle = this.changeHandle.bind(this);
    this.submitHandle = this.submitHandle.bind(this);
    this.clickHandle = this.clickHandle.bind(this);

    this.chartRef = React.createRef();
  }
  componentDidMount(){

    const exchangerequest = fetch(`https://api.frankfurter.app/latest?from=${this.state.baseCurrency}&to=${this.state.secondaryCurrency}&amount=${1}`);
    exchangerequest.then((response)=>{
      if(response.ok)
        return response.json();
    }).then((data)=>{
        this.setState({
          exchangeRate : data.rates[this.state.secondaryCurrency]
        });
    });

    const currenciesRequest = fetch('https://api.frankfurter.app/currencies');
    currenciesRequest.then((response)=>{
      if(response.ok)
        return response.json();
    }).then((data)=>{
      this.setState({
        currencyNames: data
      });
    });

    this.getHistoricalRates(this.state.baseCurrency, this.state.secondaryCurrency);

  }

  submitHandle(event)
  {
    event.preventDefault();
  }

  changeHandle(event)
  {
    const {name , value} = event.target;
    switch(name)
    {
      case "baseCurrency" :
        const request = fetch(`https://api.frankfurter.app/latest?from=${value}&to=${this.state.secondaryCurrency}&amount=${1}`);
        request.then((response)=>{
          if(response.ok)
            return response.json();
        }).then((data)=>{
          this.setState({
            baseCurrency : value,
            baseCurrencyFullName : this.state.currencyNames[value],
            exchangeRate : data.rates[this.state.secondaryCurrency]
          });
        });
        this.getHistoricalRates(value, this.state.secondaryCurrency);
        break;
      case "secondaryCurrency" :
        const request1 = fetch(`https://api.frankfurter.app/latest?from=${this.state.baseCurrency}&to=${value}&amount=${1}`);
        request1.then((response)=>{
          if(response.ok)
            return response.json();
        }).then((data)=>{
          this.setState({
            secondaryCurrency : value,
            secondaryCurrencyFullName : this.state.currencyNames[value],
            exchangeRate : data.rates[value]
          });
        });
        this.getHistoricalRates(this.state.baseCurrency, value);
        break;
      default :
        this.setState({
          [name] : value
        });
        break;
    }
  }

  clickHandle(event)
  {
    switch(event.target.name)
    {
      case "swap" :
        const temporalCurrency = this.state.baseCurrency;
        const temporalCurrencyFullName = this.state.baseCurrencyFullName;
        const temporalExchangeRate = 1 / this.state.exchangeRate;
        this.getHistoricalRates(this.state.secondaryCurrency, this.state.baseCurrency);
        this.setState({
          baseCurrency : this.state.secondaryCurrency,
          baseCurrencyFullName : this.state.secondaryCurrencyFullName,
          secondaryCurrency : temporalCurrency,
          secondaryCurrencyFullName : temporalCurrencyFullName,
          exchangeRate : temporalExchangeRate
        });
        break;

      default :
        console.log("Out of control");
        break;
    }
  }

  listCurrencyNames(currency)
  {
    const arrayOfcurrencyNames = [];
    for(var prop in this.state.currencyNames)
    { 
      if(prop != currency)
        arrayOfcurrencyNames.push(<option value={prop}>{this.state.currencyNames[prop]}</option>);
    }
    return arrayOfcurrencyNames;
  }
  getHistoricalRates(baseCurrency, secondaryCurrency)
  {
    const request = fetch(`https://api.frankfurter.app/${new Date((new Date).getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]}..${this.state.currentDate}?from=${baseCurrency}&to=${secondaryCurrency}`);
    request.then((response)=>{
      if(response.ok)
        return response.json();
    }).then((data)=>{
      this.setState({
        historicalRates : data.rates
      });

      const chartLabels = Object.keys(data.rates);
      const chartData = Object.values(data.rates).map(rate => rate[this.state.secondaryCurrency]);
      const chartLabel = `${this.state.baseCurrency}/${this.state.secondaryCurrency}`;
      this.buildChart(chartLabels, chartData, chartLabel);
    });
  }

  buildChart(labels, data, label)
  {
    const chartRef = this.chartRef.current.getContext("2d");

    if (typeof this.chart !== "undefined") {
      this.chart.destroy();
    }

    this.chart = new Chart(this.chartRef.current.getContext("2d"), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: label,
            data,
            fill: false,
            tension: 0,
            backgroundColor: 'rgb(255, 195, 11)',
            borderColor: 'rgb(255, 195, 11)'
          }
        ]
      },
      options: {
        responsive: true,
      }
    });

  }

  render(){
    return (
      <section className="container">
        <h3 className="text-center my-2">{this.state.amount} {this.state.baseCurrency} to {this.state.secondaryCurrency} - Convert {this.state.baseCurrencyFullName} to {this.state.secondaryCurrencyFullName}</h3>
        <h3 className="text-center">Currency-Calculator</h3>
        <div className="border p-3 mt-5 shadow bg-body rounded">
          <h4 className="text-center my-3">Convert</h4>
          <form className="container-fluid" onSubmit={this.submitHandle} >
            <div className="row my-3 text-light justify-content-center">
              <div className="col">
                <label className="text-body">
                  Amount<br/>
                  <input name="amount" value={this.state.amount} onChange={this.changeHandle} />
                </label>
              </div> 

              <div className="col">
                <label className="text-body" >
                  From<br/>
                  <select name='baseCurrency' value={this.state.baseCurrency} onChange={this.changeHandle} >
                    {this.listCurrencyNames(this.state.secondaryCurrency)}
                  </select>
                </label>
              </div>

              <div className="col">
                <br/>
                <button className="btn btn-warning" name="swap" onClick={this.clickHandle}>Swap</button>
              </div>

              <div className="col">
                <label className="text-body">
                  To<br/>
                  <select name="secondaryCurrency" value={this.state.secondaryCurrency} onChange={this.changeHandle} >
                    {this.listCurrencyNames(this.state.baseCurrency)}
                  </select>
                </label>
              </div>

            </div>
            <br/><br/>
            <div className="row my-3 text-body fs-4 fw-bold">
              <div className="col-12">
                <div className="mb-3 text-center">
                  {this.state.amount} {this.state.baseCurrencyFullName} = <br/>
                  {this.state.exchangeRate * this.state.amount} {this.state.secondaryCurrencyFullName}
                </div>

                <div className="text-center">
                  1 {this.state.baseCurrency} = {this.state.exchangeRate} {this.state.secondaryCurrency}<br/>
                  1 {this.state.secondaryCurrency} = {1 / this.state.exchangeRate} {this.state.baseCurrency}
                </div>
              </div>
            </div>
          </form>
          <canvas ref={this.chartRef} />
        </div>
      </section>
    );
  }
}

CurrencyConverter.defaultProps = {
  amount : 1.00,
  baseCurrency : 'USD',
  secondaryCurrency : 'EUR'
};

export default CurrencyConverter;