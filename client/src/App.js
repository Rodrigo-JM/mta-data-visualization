import './App.css';
import axios from 'axios';
import React, { Component } from 'react';
import SubwayStatus from './SubwayStatus';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Map from './Map';
import Stops from './Stops';
import Schedule from './Schedule'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Route path='/' component={Navbar} />
        <Route exact path='/' component={Map} />
        <Route path="/status" component={SubwayStatus} />
        {/* <Route path='/stops' component={Stops} /> */}
        <Route path='/schedule' component={Schedule} />
      </BrowserRouter>
    )
  }
}

export default App;
