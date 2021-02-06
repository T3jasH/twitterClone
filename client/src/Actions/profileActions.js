import {
    UPLOAD_COVER,
    UPLOAD_DISPLAY, 
    GET_ERRORS,
    UPLOAD_BIO,
    CLEAR_ERRORS
} from './types';
import axios from 'axios';
import {getConfig} from './authActions';

// Config for multipart formdata

const getFormConfig = getState => {
    const token = getState().auth.token;
    const disp = getState().profile.display;
    const cov = getState().profile.cover;
    const config = {
        headers : {
            'content-type' : 'multipart/form-data'
       }
    }
    if(token) config.headers["x-auth-token"] = token;
    if(disp) config.headers["x-display"] = disp;
    if(cov) config.headers["x-cover"] = cov;    
    return config;
}

export const uploadDisp = (formData) => (dispatch, getState) =>{
    axios.post('/api/upload/display', formData, getFormConfig(getState))
    .then(res => {
        dispatch({
            type : UPLOAD_DISPLAY, 
            payload : res.data
        })
        dispatch({
            type : CLEAR_ERRORS
        })
    })
    .catch(err =>{
        dispatch({
            type : GET_ERRORS, 
            payload : err.response.data
        })
    })
}

export const uploadCover = (formData) => (dispatch, getState) => {
    axios.post('/api/upload/cover', formData, getFormConfig(getState))
    .then(res => {
        dispatch({
            type : UPLOAD_COVER,
            payload : res.data
        })
        dispatch({
            type : CLEAR_ERRORS
        })
    })
    .catch(err =>{
        dispatch({
            type : GET_ERRORS, 
            payload : err.response.data
        })
    })
}

export const uploadBio = (bio) => (dispatch, getState) => {
    axios.post('/api/upload/about', {bio : bio}, getConfig(getState))
    .then(res =>{
        dispatch({
            type : UPLOAD_BIO,
            payload : res.data
        })
    })
    .catch(err =>{
        dispatch({
            type : GET_ERRORS,
            payload : err.response.data
        })
    })
}  
