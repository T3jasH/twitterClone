import {
    CLEAR_ERRORS,
    GET_ERRORS,
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOAD_USER, 
    NO_USER,
    LOAD_PROFILE,
    DELETE_TOKEN,
    LOG_OUT
} from './types'
import axios from 'axios'

export const getConfig = getState =>{
    const token = getState().auth.token;
    const config = {
        headers :{
            "Content-type" : "application/json"
        }
    }
    if(token) config.headers["x-auth-token"] = token
    return config;
}


export const register = (user) => dispatch =>{
    axios.post('/api/auth/register', user)
    .then(res => {
        console.log(res)
        dispatch({type : REGISTER_SUCCESS, payload : res.data});
        dispatch({type : CLEAR_ERRORS});
    })
    .catch(err => {
        console.log(err)
        dispatch({type : REGISTER_FAIL});
        dispatch({type : GET_ERRORS, payload :  {msg : err.response.data.msg, status : err.response.status}});
    }
        )
}

export const login = (user) => dispatch =>{
    axios.post('/api/auth/login', user)
    .then(res => {
        dispatch({type : LOGIN_SUCCESS, payload : res.data});
        dispatch({type : CLEAR_ERRORS});
    })
    .catch(err => {
        dispatch({type : LOGIN_FAIL});
        dispatch({type : GET_ERRORS, payload :  {msg : err.response.data.msg, status : err.response.status}});
    }
        )
}

export const loadUser = () => (dispatch, getState) => {
    axios.get('/api/auth/user', getConfig(getState))
    .then(res=>{
        dispatch(
            {
                type : LOAD_USER,
                payload : res.data
            }
        );
        dispatch({
            type : LOAD_PROFILE,
            payload : res.data
        })
    })
    .catch(err=>{
        if(err.response.data.msg === "Invalid token") dispatch({type : DELETE_TOKEN})
        else
        dispatch({type : NO_USER})
    })
}

export const logOut = () => (dispatch) =>{
    console.log("logOut called")
    dispatch({type : LOG_OUT});
}