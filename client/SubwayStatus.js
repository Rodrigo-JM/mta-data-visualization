import React from "react";
import { getStatus } from "./store";
import { connect } from "react-redux";
import parse from 'html-react-parser'

class SubwayStatus extends React.Component {
  componentDidMount() {
    this.props.getSubwayStatus();
  }
  render() {
    return (
      <div id='container'>
        {this.props.status.map(stat => (
          <div>
            <h1>{stat.name}</h1>
            <p>{parse(stat.text)}</p>
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    status: state.status
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getSubwayStatus: () => dispatch(getStatus())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SubwayStatus);
