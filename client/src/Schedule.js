import React, { Component } from "react";
import { getStops, getSchedule } from "./store";
import { connect } from "react-redux";
import parse from "html-react-parser";

class Schedule extends Component {
  //   componentDidMount() {
  formatForMap(trip) {
    console.log(trip);
    return {
      vendor: trip.tripUpdate.trip.routeId,
      path: trip.tripUpdate.stopTimeUpdate.reduce((accum, trip) => {
        if (this.props.stops[trip.stopId] !== undefined) {
          const stopCoordinates = [
            parseFloat(this.props.stops[trip.stopId].stop_lon),
            parseFloat(this.props.stops[trip.stopId].stop_lat),
          ];
          accum.push(stopCoordinates);
        }

        return accum;
      }, []),
      timestamps: trip.tripUpdate.stopTimeUpdate.reduce((accum, trip, index, arr) => {
          if ((index + 1) < arr.length) {
              const actualTime = parseInt(trip.departure.time)
              const futureTime = parseInt(arr[index + 1].arrival.time)
              const difference = ((futureTime - actualTime) > 0) ? futureTime - actualTime : 0; 
              accum.push(difference);
          }

          return accum;
      }, [])
    };
  }

  render() {
    return (
      <div>
        <div id="container">
          {!this.props.schedule.length ? (
            <h1>Select a line...</h1>
          ) : (
            this.props.schedule[this.props.schedule.length - 1].entity.map(trip => {
              if (trip.tripUpdate !== undefined) {
                if (trip.tripUpdate.stopTimeUpdate !== undefined) {
                  return (
                    <div>
                      <h1>Trip {trip.id}</h1>
                      {JSON.stringify(trip)}
                    </div>
                  );
                }
              }
            })
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
