import React, { Component } from "react";
import { getStops, getSchedule } from "./store";
import { connect } from "react-redux";
import parse from "html-react-parser";
import { Link } from "react-router-dom";

function Navbar(props) {
  return (
    <div id="navbar">
      <button
        onClick={() => props.getSchedule(props.stops)}
        onCLick={() => props.getSubwayStops()}
      >
        CLIK HERE TO LOAD THE DATA
      </button>
      <Link to="/schedule">schedule</Link>
      <Link to="/stops">Stops</Link>
      <Link to="/status">Status</Link>
    </div>
  );
}

const mapDispatchToProps = dispatch => {
  return {
    getSchedule: stops => dispatch(getSchedule(stops)),
    getSubwayStops: () => dispatch(getStops())
  };
};

const mapStateToProps = state => {
  return {
    stops: state.stops,
    schedule: state.schedule
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
