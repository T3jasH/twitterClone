var initial_state = {
    token : localStorage.getItem("token"),
    user : {},
    isAuthenticated :  null,
    notifications : 0
}

const authReducer = (state=initial_state, action) => {
    switch(action.type){
        case "REGISTER_SUCCESS":
        case "LOGIN_SUCCESS" :
            localStorage.setItem("token", action.payload.token);
            return{
                ...state,
                token : localStorage.getItem("token"),
                user : action.payload.user,
                isAuthenticated : true
            }
        case "REGISTER_FAIL" :
        case "LOGIN_FAIL" :
            localStorage.removeItem("token");
            return{
                ...state,
                isAuthenticated : false
            }
        case "LOAD_USER":
           const {name, username, email} = action.payload
            return{
                ...state,
                isAuthenticated : true,
                user : {
                    name : name, 
                    username : username,
                    email : email
                }
            }
        case "NO_USER" :
            return{
                ...state,
                user : null
            }
        case "DELETE_TOKEN":
            localStorage.removeItem("token");
            return{
                ...state,
                token : null
            } 
        case "LOG_OUT":
            localStorage.removeItem("token");
            return initial_state;
        case "NOTIFICATIONS" :
                return{
                    ...state,
                    notifications : action.payload.count
                }
        default : 
            return state;
    }
}

export default authReducer;