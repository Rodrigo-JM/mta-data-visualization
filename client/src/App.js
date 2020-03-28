import './App.css';
import axios from 'axios';
import React, { Component } from 'react';
import SubwayStatus from './SubwayStatus';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Map from './Map';
import Stops from './Stops';
class App extends Component {
  render() {
    return <Map />;
  }
}

export default App;
