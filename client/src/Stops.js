import React, { Component } from 'react';
import { getStops, getSchedule } from './store';
import { connect } from 'react-redux';

class Stops extends Component {
  componentDidMount() {
    this.props.getSubwayStops();
  }

  render() {
    return (
      <div>
        <button
          onClick={() => this.props.getSchedule(this.props.stops)}
        ></button>
        <div id="container">
          {this.props.stops.map(stop => (
            <div>
              <h1>Stops</h1>
              {Object.keys(stop).map(key => (
                <p>{`${key}: ${stop[key]}`}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    stops: state.stops,
    schedule: state.schedule,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getSchedule: stops => dispatch(getSchedule(stops)),
    getSubwayStops: () => dispatch(getStops()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Stops);
