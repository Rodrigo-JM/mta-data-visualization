import React, { Component } from "react";
import { getStops, getSchedule } from "./store";
import { connect } from "react-redux";
import parse from "html-react-parser";

// const recursivePrint = obj => {
//     Object.keys(schedule).map(key => {
//         if ()
//         `<p>${key}: ${schedule[key]}</p>`
//     })
      
// }

class Schedule extends Component {
  //   componentDidMount() {
  //     this.props.getSubwayStops();
  //   }

  render() {
    return (
      <div>
        <div id="container">
          {!this.props.schedule.entity ? (
            <h1>Go to stops and press the button...</h1>
          ) : (
            this.props.schedule.entity.map(stop => (
              <div>
                <h1>Schedule</h1>
                {JSON.stringify(stop).replace(/\,/g, "\n")}
              </div>
            ))
          )}    
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    stops: state.stops,
    schedule: state.schedule
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getSchedule: stops => dispatch(getSchedule(stops)),
    getSubwayStops: () => dispatch(getStops())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Schedule);
