import axios from 'axios';
import {NOTIFICATIONS} from './types'
import { getConfig } from './authActions';

export const generateNotifications = (tweet_id, user_from, user_to, type, content) => {
    if(user_from === user_to) return;
    if(type===0  || type===-1){
       axios.post('/api/notifications', {type : type, user_from : user_from, user_to : user_to, tweet_id : null})
       .then(res => console.log(res.data))
       .catch(err => console.log(err))
       return; 
    }
    if(type === 2){
        axios.post('/api/notifications', {type : 2, user_from : user_from, user_to : user_to, tweet_id : tweet_id})
        .then(res => null)
        .catch(err => console.log(err))
    }
    let S = new Set();
    content.split(' ').map((text, ix)=>{  
        if(text[0]==='@'){
            S.add(text.substring(1, text.length));
        }
        return null
    })
    S.forEach(usernname => {
        if(usernname === user_from) return
        axios.post('/api/notifications', {type : 1, user_from : user_from, user_to : usernname, tweet_id : tweet_id})
        .then(res => null)
        .catch(err => console.log(err))
        console.log(usernname)
    })
}
const parseTrends = (id, content) =>{
    content.split(' ').map((text, ix)=>{
        if(text[0]==="#"){
            axios.post('/api/tweet/trends', {id : id, hashtag : text.substring(1, text.length)})
            .catch(err => console.log(err.response))
            .then(res => console.log(text + " updated"))
        }
        return null;
    })
}
const getFormConfig = (getState, payload) => {
    const token = getState().auth.token;
    const content = payload[0];
    let id = null;
    if(payload.length===2) id=payload[1]; 
    const config = {
        headers : {
            'content-type' : 'multipart/form-data'
       }
    }
    if(token) config.headers["x-auth-token"] = token;
    if(content) config.headers["content"] = String(content);  
    if(id) config.headers["id"] = String(id); 
    return config;
}

export const uploadTweet = (content, image, id) => (dispatch, getState) =>{
    axios.post('/api/tweet/', image, getFormConfig(getState, [content]))
    .then(res => {
        const {tweet_id, user_to} = res.data;
        generateNotifications(tweet_id, getState().auth.user.username, user_to, 1, content);
        parseTrends(tweet_id, content);
    })
    .catch(err => console.log(err))
}

export const uploadReply = (content, image, user_to, id) => (dispatch, getState) => {
    axios.post('/api/tweet/reply', image, getFormConfig(getState, [content, id]))
    .then(res => {
        const {tweet_id} = res.data;
        generateNotifications(id, getState().auth.user.username, user_to, 2, content);
        parseTrends(tweet_id, content);

    })
}

export const getNotifsCount = () => (dispatch, getState) => {
    axios.get('/api/notifications', getConfig(getState))
    .then(res => {
        dispatch({type : NOTIFICATIONS , payload : res.data}
        )})
    .catch(err => console.log(err))
}
