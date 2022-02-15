import React from "react";
import './ExchangeRateList.css'

class ExchangeRateList extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      baseCurrency : this.props.baseCurrency,
      currencyFullName : 'US Dollar',
      currencyNames : {},
      rates : {}
    };
  }

  componentDidMount()
  {
    const requestRates = fetch(`https://api.frankfurter.app/latest?from=${this.state.baseCurrency}`);
    requestRates.then((response)=>{
      if(response.ok)
        return response.json();
    }).then((data)=>{
      this.setState({
        rates : data.rates
      });
    });

    const requestCurrencyNames = fetch('https://api.frankfurter.app/currencies');

    requestCurrencyNames.then((response)=>{
      if(response.ok)
        return response.json();
    }).then((data)=>{
      this.setState({
        currencyNames : data
      });
    });

  }
  listCurrencyNames()
  {
    const arrayOfCurrencyNames = [];
    for(var prop in this.state.currencyNames)
    {
      arrayOfCurrencyNames.push(<option value={prop}>{this.state.currencyNames[prop]}</option>);
    }   

    return arrayOfCurrencyNames;
  }

  generateRows()
  {
    const arrayOfRows = [];
    for(var prop in this.state.rates)
    {
      arrayOfRows.push(
        <tr>
          <td>{this.state.currencyNames[prop]}</td>
          <td>{this.state.rates[prop]}</td>
          <td>{1 / this.state.rates[prop]}</td>
        </tr>
      );
    }
    return arrayOfRows;
  }
  render()
  {
    return (
      <React.Fragment>
        <h3 className="text-center my-2">
          {this.state.currencyFullName} EXCHANGE RATES TABLE
        </h3>
        <div className="main-content border overflow-auto p-3 shadow bg-body rounded">
          <h4 className="text-center my-3" >Live Exchange Rates</h4>
          <form className="container-fluid" >
            <table className="table table-striped table-light" >
              <thead>
                <tr>
                  <th>
                    <select name="currencies" value={this.state.baseCurrency} >
                    {this.listCurrencyNames()}
                    </select>
                  </th>
                  <th>1.00 {this.state.baseCurrency}</th>
                  <th>inv. 1.00 {this.state.baseCurrency}</th>
                </tr>
              </thead>
              <tbody>
                {this.generateRows()}
              </tbody>
            </table>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

ExchangeRateList.defaultProps = {
  baseCurrency : 'USD'
};

export default ExchangeRateList;
