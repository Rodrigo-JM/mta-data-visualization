import React, { Component } from "react";
import { getStops, getSchedule } from "./store";
import { connect } from "react-redux";
import parse from "html-react-parser";
import { Link } from "react-router-dom";



function Navbar(props) {
    const handleChange = e =>{
        const line = e.target.value
        props.getSchedule(line);
    }
  
    return (
    <div id="navbar">
      <button
        onClick={() => props.getSubwayStops()}
      >
        LOAD STOPS
      </button>
      <select onChange={handleChange}>
          <option>SElECT LINE</option>
          <option value='a_c_e'>A C E</option>
          <option value='b_d_f_m'>B D F M</option>
          <option value='g'>G</option>
          <option value='j_z'>J Z</option>
          <option value='n_q_r_w'>N Q R W</option>
          <option value='l'>L</option>
          <option value='1_2_3_4_5_6'>1 2 3 4 5 6</option>
          <option value='7'>7</option>
      </select>
      <Link to="/schedule">schedule</Link>
      {/* <Link to="/stops">Stops</Link> */}
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
