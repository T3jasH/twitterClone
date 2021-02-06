const initialState = {
    display : '',
    cover : '',
    about : '',
    isVerified : 0
}

const profileReducer = (state = initialState, action) =>{
    switch(action.type){
        case "DISPLAY_UPLOADED" :
            return{
                ...state,
                display : action.payload
            }
        case "LOAD_PROFILE" :
            const {display_pic, cover_pic, about, isVerified, joined} = action.payload
            return{
                display : display_pic,
                cover : cover_pic,
                about : about,
                isVerified : isVerified,
                joined : joined
            }
        case "UPLOAD_COVER":
            return{
                ...state,
                cover : action.payload.cover
            }
        case "UPLOAD_DISPLAY":
            return{
                ...state,
                display : action.payload.display
            } 
        case "UPLOAD_BIO" :
            return {
                ...state,
                about : action.payload.bio
            }
        default : 
            return state;
    }
}
export default profileReducer;