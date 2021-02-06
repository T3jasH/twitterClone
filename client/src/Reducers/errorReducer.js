// import {
//     GET_ERRORS, 
//     CLEAR_ERRORS
// } from '../Actions/types'

var initial_state = {
    msg : null,
    status : null
}

const errorReducer = (state=initial_state, action) => {
    switch(action.type){
        case "GET_ERRORS" :
            return {
                msg : action.payload.msg,
                status : action.payload.status
            }
        case "CLEAR_ERRORS" :
            return{
                msg : null,
                status : null
            }
        default : 
            return state; 
    } 
}

export default errorReducer;