import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import axios from 'axios'
import {createLogger} from 'redux-logger'

const initialState = {
    status: [],
    stops: [],
    schedule: [],
    lines: [],
}

const linesUrl = [
    'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace', //A C E
    'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm', // B D F M
    'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g', // G
    'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz', // J Z
    'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw', // N Q R W
    'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l', // L
    'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs', //  1 2 3 4 5 6 
    'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-7' //7
]

const linesRelationToUrlArr = [
    'a_c_e',
    'b_d_f_m',
    'g',
    'j_z',
    'n_q_r_w',
    'l',
    '1_2_3_4_5_6',
    '7',
]


const GOT_STATUS = 'GOT_STATUS';
const GOT_STOPS = 'GOT_STOPS';
const GOT_SCHEDULE = 'GOT_SCHEDULE';
const WROTE_LINE = 'WROTE_FILE'

const wroteLine = () => {
    return {
        type: WROTE_LINE
    }
}

// const writeFile = (content) => {
//     return async function(dispatch) {
//         const { data }
//     }
// }


const gotSchedule = (line, schedule) => {
    return {
        type: GOT_SCHEDULE,
        schedule,
        line,
    }
}


export const getSchedule = (line) => {
    return async function (dispatch) {
        const body = { url : linesUrl[linesRelationToUrlArr[line]]}

        const { data } = await axios.get(`/api/schedule/`)

        // dispatch(gotSchedule(line, data))
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
                stops: action.stops 
            }
        case GOT_SCHEDULE:
            // const newSchedule = {...state.schedule}
            
            return {
                ...state,
                schedule: [...state.schedule, action.schedule]
            }
        default: 
            return state;
    }
}

const loggerMiddleware = createLogger({collapsed: true})



const store = createStore(reducer, applyMiddleware(thunk, loggerMiddleware))

export default store