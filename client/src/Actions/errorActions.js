import {
    GET_ERRORS,
    CLEAR_ERRORS
} from './types';

export const return_errors = (msg, status) =>{
    //console.log(msg, status);
   return{
       type : GET_ERRORS,
       payload : {msg, status}
   }
} 
export const clearErrors = () => dispatch =>{
    dispatch({type : CLEAR_ERRORS});
}