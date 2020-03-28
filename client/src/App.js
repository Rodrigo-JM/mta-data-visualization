import './App.css';
import axios from 'axios'
import React, { Component } from 'react'
import SubwayStatus from './SubwayStatus'
import { BrowserRouter, Link, Route } from 'react-router-dom'
import Navbar from './Navbar'
import Stops from './Stops';
class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <Route path='/' component={Navbar} />
        <Route path="/status" component={SubwayStatus} />
        <Route path='/stops' component={Stops} />
      </BrowserRouter>
    )
  }
}


export default App;
