import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import Map from './Map';
import { getSchedule, getLines } from './store';
import { connect } from 'react-redux';
import Audio from './ReactRoundPlayer';

class App extends Component {
  componentDidMount() {
    this.props.getSchedule();
    setInterval(() => this.props.getSchedule(), 60000);
  }

  componentDidUpdate() {
    this.props.getLines();
  }

  render() {
    return (
      <BrowserRouter>
        {/* <Route path='/' component={Navbar} /> */}
        <Route path="/" component={Audio} />
        <Route exact path="/" component={Map} />
        {/* <Route path="/status" component={SubwayStatus} />
        {/* <Route path='/stops' component={Stops} /> */}
        {/* <Route path='/schedule' component={Schedule} /> */}
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    schedule: state.schedule,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getLines: () => dispatch(getLines()),
    getSchedule: () => dispatch(getSchedule()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
