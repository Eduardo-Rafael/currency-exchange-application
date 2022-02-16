import logo from './logo.svg';
import './App.css';
import NavigationBar from './NavandFooter';
import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import CurrencyConverter from './CurrencyConverter';
import ExchangeRateList from './ExchangeRateList';
import Footer from './Footer';



function App() {
  return (
    <Router>
      <NavigationBar />
      <Switch>
        <Route path="/currency-converter" exact component={CurrencyConverter} />
        <Route path="/exchange-rate-list" exact component={ExchangeRateList}/>
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
