import react from "react";
import { Link } from "react-router-dom";


const NavigationBar = () => {
  return(
    <div className="container">
      <nav className="navbar navbar-expand-md navbar-light">
        <a className="navbar-brand fs-1" href="#">Exchange</a>
        <button className="navbar-toggler" type="button" data-bs-toggle='collapse' data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="navbar-nav text-center text-md-end fs-4">
            <Link to="/currency-converter" className="nav-link">Currency-Converter</Link> 
            <Link to="/exchange-rate-list" className="nav-link">Exchange-Rate-List</Link>
          </div> 
        </div>
      </nav>
    </div>
  );
}

export default NavigationBar;