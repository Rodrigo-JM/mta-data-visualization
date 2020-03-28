import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import axios from 'axios'
import {createLogger} from 'redux-logger'

const initialState = {
    status: [],
    stops: [],
    schedule: [],
}


const GOT_STATUS = 'GOT_STATUS';
const GOT_STOPS = 'GOT_STOPS';
const GOT_SCHEDULE = 'GOT_SCHEDULE';

const gotSchedule = (schedule) => {
    return {
        type: GOT_SCHEDULE,
        schedule,
    }
}


export const getSchedule = (stops) => {
    return async function (dispatch) {
        const stopIds = stops.reduce((accum, stop) => {
            accum = [...accum, stop.stop_id];
            return accum;
        }, [])
        const body = {
            stops: stopIds[0]
        }
        const { data } = await axios.post('/api/schedule', body)

        dispatch(gotSchedule(data))
    }
}
const gotStops = (stops) => {
    return {
        type: GOT_STOPS,
        stops
    }
}

export const getStops = () => {
    return async function (dispatch) {
        const { data } = await axios.get('/api/stops')
        dispatch(gotStops(data))
    }   
}

const gotStatus = (status) => {
    return {
        type: GOT_STATUS,
        status,
    }
}

export const getStatus = () => {
    return async function(dispatch) {
        const { data } = await axios.get('/api/status/subway');
        dispatch(gotStatus(data))
    }
}


const reducer = (state = initialState, action) => {
    switch (action.type) {
        case GOT_STATUS: 
            return {
                ...state,
                status: action.status
            }
        case GOT_STOPS: 
            return {
                ...state,
                stops: Object.keys(action.stops).map(key => {
                    return action.stops[key]
                })
            }
        case GOT_SCHEDULE:
            return {
                ...state,
                schedule: action.schedule 
            }
        default: 
            return state;
    }
}

const loggerMiddleware = createLogger({collapsed: true})



const store = createStore(reducer, applyMiddleware(thunk, loggerMiddleware))

export default store