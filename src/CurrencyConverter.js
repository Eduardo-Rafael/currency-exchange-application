import React from "react";
import './CurrencyConverter.css'

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
      currencyNames: {}
    };

    this.changeHandle = this.changeHandle.bind(this);
    this.submitHandle = this.submitHandle.bind(this);
    this.clickHandle = this.clickHandle.bind(this);
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
        console.log(`Exchange Rate: ${this.state.exchangeRate}`);
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
        break;
      default :
        this.setState({
          [name] : value
        });
        console.log(`The amount has been changed to ${this.state.amount}`);
        break;
    }
  }

  clickHandle(event)
  {
    console.log("I am on it");
    switch(event.target.name)
    {
      case "swap" :
        const temporalCurrency = this.state.baseCurrency;
        const temporalCurrencyFullName = this.state.baseCurrencyFullName;
        const temporalExchangeRate = 1 / this.state.exchangeRate;
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

              {/* <div className="col-12 col-md-6 align-self-center mt-3 mt-md-0">
                <button type="button" className="btn btn-warning" name="convert" >Convert</button>
              </div> */}
            </div>
          </form>
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