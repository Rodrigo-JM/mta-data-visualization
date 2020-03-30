import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import { createLogger } from 'redux-logger';

const initialState = {
  status: [],
  stops: [],
  schedule: [],
  lines: [],
};
const GOT_STATUS = 'GOT_STATUS';
const GOT_STOPS = 'GOT_STOPS';
const GOT_SCHEDULE = 'GOT_SCHEDULE';
const GOT_LINES = 'GOT_LINES';

const gotLines = lines => {
  return {
    type: GOT_LINES,
    lines,
  };
};

export const getLines = () => {
  return async function(dispatch) {
    const { data } = await axios.get('/api/routes');
    dispatch(gotLines(data));
  };
};

const gotSchedule = schedule => {
  return {
    type: GOT_SCHEDULE,
    schedule,
  };
};

export const getSchedule = () => {
  return async function(dispatch) {
    const { data } = await axios.get(`/api/schedule/`);
    dispatch(gotSchedule(data));
  };
};
const gotStops = stops => {
  return {
    type: GOT_STOPS,
    stops,
  };
};

export const getStops = () => {
  return async function(dispatch) {
    const { data } = await axios.get('/api/stops');
    dispatch(gotStops(data));
  };
};

const gotStatus = status => {
  return {
    type: GOT_STATUS,
    status,
  };
};

export const getStatus = () => {
  return async function(dispatch) {
    const { data } = await axios.get('/api/status/subway');
    dispatch(gotStatus(data));
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GOT_STATUS:
      return {
        ...state,
        status: action.status,
      };
    case GOT_STOPS:
      return {
        ...state,
        stops: action.stops,
      };
    case GOT_SCHEDULE:
      return {
        ...state,
        schedule: action.schedule,
      };
    case GOT_LINES:
      return {
        ...state,
        lines: action.lines,
      };
    default:
      return state;
  }
};

const loggerMiddleware = createLogger({ collapsed: true });

const store = createStore(reducer, applyMiddleware(thunk, loggerMiddleware));

export default store;
