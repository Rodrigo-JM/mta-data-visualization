import React, { Component } from "react";
import { getStops } from "./store";
import { connect } from "react-redux";
import parse from "html-react-parser";

class Stops extends Component {
  componentDidMount() {
    this.props.getSubwayStops();
  }

  render() {
    return (
      <div id="container">
        {this.props.stops.map(stop => (
          <div>
            <h1>Stops</h1>
            {Object.keys(stop).map(key => (<p>{stop[key]}</p>))}
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    stops: state.stops
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getSubwayStops: () => dispatch(getStops())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Stops);
