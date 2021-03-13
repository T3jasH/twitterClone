import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { usePrevious } from '../utils';
import {uploadDisp, uploadCover, uploadBio} from '../Actions/profileActions';
import {logOut} from '../Actions/authActions'
import {clearErrors} from '../Actions/errorActions';
import axios from 'axios';
import { getConfig } from './MainComponents/ProfileHandler';
import store from '../store';

const Body = styled.div`
height : 100vh;
width : 100vw;
background-color : #242323;
font-family : "-apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif"
`
const MiniNav = styled.div`
    display : inline;
`
const PrevButton = styled.button`
    outline : none;
    background : black;
    border : none;
    cursor : pointer;
    position : relative;
    left : 6%;
    top : 1%;
    
`

const Logo = styled.img`
    top : 2px; 
    position : absolute;
    right : 20.2vw;
    @media (max-width : 900px){
        height : 30px;
        width : 30px;
        right : 25vw;
    } 
    @media (max-width : 550px){
        right : 40vw;
    }         
`
const Next = styled.button`
    
    position : absolute;
    outline : none;
    border : none;
    right : 4vw;
    top : 1.5vh;
    box-shadow : 0px 1px 1px 1px #1FB9EC;
    color : white;
    height : 30px;
    width : 70px;
    border-radius : 15px;
    background-color : #1FB9EC;
    cursor : pointer;
    :active{
        box-shadow : 0px 2px 2px 2px #111;
        transition : 0.2s all;
    }
    @media (max-width : 900px){
        height : 25px;
        width : 50px;
    }
    @media (max-width : 550px){
        right : 6vw;
    }
`
const DispImage = styled.img`
    width : 160px;
    height : 160px;
    border-radius : 160px;
    @media (max-width : 900px){
        width : 120px;
        height : 120px;
        border-radius: 120px;
    }
`
const CovImage = styled.img`
width : 330px; 
height : 145px;
@media (max-width : 900px){
    width : 250px;
    height : 110px;
}
@media (max-width : 350px){
    width : 125px;
    height : 55px;
} 
`
const Upload = styled.button`
position : relative;
outline : none;
border : none;
box-shadow : 0px 1px 1px 1px #1FB9EC;
color : white;
height : 30px;
width : 70px;
border-radius : 15px;
background-color : #1FB9EC;
cursor : pointer;
font-weight : bold;
:active{
    box-shadow : 0px 2px 2px 2px #111;
    transition : 0.2s all;
}
@media (max-width : 900px){
    height : 25px;
    width : 50px;
}
`
const DeleteAccount = styled.button`
position : relative;
margin-top : 50px;
outline : none;
border : none;
box-shadow : 1px 1px 1px 1px red;
color : white;
height : 30px;
width : 120px;
border-radius : 15px;
background-color : red;
cursor : pointer;
font-weight : bold;
font-size : 14px;
:active{
    box-shadow : 0px 2px 2px 2px #111;
    transition : 0.2s all;
}
@media (max-width : 900px){
    height : 25px;
    width : 105px;
}   
`
const About = styled.textarea`
    resize : none;
    height : 100px;
    width : 30vw;
    background : #2A2D2D;
    outline : none;
    border-width : 0px 0px 3px 0px;
    padding : 10px;
    color : rgba(255, 255, 255, 0.8);
    font-size : 20px;
    : hover{
        border-bottom-color : #02E4FA;
        :: placeholder{
        color : #1FB9EC;
        }
    }

    :   focus{
        border-bottom-color : #02E4FA;
        :: placeholder{
        color : #1FB9EC;
        }
    }
    @media (max-width : 900px){
        width : 40vw;
    }
    @media (max-width : 550px){
        width : 70vw;
    }
`
const P = styled.p``;
const Yes = styled.button`
    outline : none;
    width : 50px;
    position : relative;  
    top : 15px;
    left : 60px;
    border-radius : 15px;
    background : inherit;
    color : red;
    border : 1px solid red;
    cursor : pointer;
    font-family : inherit;
    font-size : inherit;
`
const No = styled.button`
    outline : none;
    width : 50px;
    position : relative;  
    top : 15px;
    margin-left : 180px;
    border-radius : 15px;
    background : inherit;
    color : #1FB9EC;
    border : 1px solid #1FB9EC;
    font-family : inherit;
    font-size : inherit;
    cursor : pointer;
`
const DeletePrompt = styled.div`
    display : none;
    border-radius : 30px;
    position : fixed;
    height : 150px;
    width : 25%;
    top : 65px;
    left : 37%;
    z-index : 1;
    background-color : #111;
    font-size : 20px;
    font-family : "-apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif";
    ${P}{
        margin-top : 5px;
        width : 90%;
        margin-left : 5%;
        height : auto;
        color : red;
    }
`
const ProfileUpload = props =>{
    const [dispPic, setDispPic] = useState('');
    const [coverPic, setCoverPic] = useState('');
    const [bio, setBio] = useState('');
    const [content, setContent] = useState("display");
    const prevDisplay = usePrevious(props.profile.display);
    const prevCover = usePrevious(props.profile.cover);
    const prevBio = usePrevious(props.profile.about);
    useEffect(()=>{
        if(props.profile.cover)
        setCoverPic(props.profile.cover);
        if(props.profile.display)
        setDispPic(props.profile.display);
        if(props.profile.about)
        setBio(props.profile.about); 
    }, [])
    useEffect(()=>{
      if(props.profile.display !== prevDisplay){
          setDispPic(props.profile.display);
      }
      if(props.profile.cover !== prevCover){
        setCoverPic(props.profile.cover);
      }
      if(props.profile.about !== prevBio){
        setBio(props.profile.about);
      }
    }, [props.profile])
    const displayDeleteBtn = (date) =>{
       console.log(date)
       const year = date[0] + date[1] + date[2] + date[3];
       var month = date[5] + date[6];
       month--;
       var day = date[8] + date[9];
       const sentTime = new Date(year, month, day, date[11]+ date[12], date[14]+ date[15], 0, 0).getTime()/ (1000*60);
       const current = Date.now()/(1000*60);
       var dif = current - sentTime;
       return dif > 60 ;
    }
    const onChange = (e) =>{
        setBio(e.target.value);
    }
    const submit = (e) =>{
        props.uploadBio(document.getElementById("about").value);
        window.location.href=`/profile/${props.auth.user.username}`
    }
    const shiftRight = () =>{
        props.clearErrors();
        if(content==="display"){
            setContent("cover")
        }
        else if(content==="cover"){
            setContent("about")
        }
    }
    const shifLeft = () =>{
        props.clearErrors();
        if(content==="about")
        setContent("cover");
        else if (content==="cover")
        setContent("display");
    }
    const hiddenFileDisp = useRef(null);
    const clickDisp = (e) => hiddenFileDisp.current.click();
    const onChangeDisp = e => { 
        const file = e.target.files[0];
        document.getElementById("display").value=null;
        if(!file) return;
        const formData = new FormData();
        formData.append('display', file);
        props.uploadDisp(formData);
    }
    const hiddenFileCov = useRef(null);
    const clickCov = (e) => hiddenFileCov.current.click();
    const onChangeCov = e => { 
        const file = e.target.files[0];
        document.getElementById("cover").value=null;
        if(!file) return;
        const formData = new FormData();
        formData.append('cover', file);
        props.uploadCover(formData);
    }
    const deleteAccount = () =>{
        axios.get('/api/auth/delete', getConfig(props.auth))
        .then(
            () => {
                props.logOut();
                window.location.href="/"
            }
        )
        .catch(err => console.log(err))
    }
    return(
        !store.getState().auth.token ? window.location="/home" :
        <Body>
        <div className="profileSetup">
            <MiniNav>
            {
            content === "display" ? null :
            <PrevButton onClick={shifLeft}>
            <img src="prevIcon.png" width="45px" alt=""/>
            </PrevButton>
            }
            <Logo src="twitterIconWhite.png" />
            {
            content === "about" ? null :
            <Next className="btn-next" onClick={shiftRight}><b>Next</b></Next>
            }
            </MiniNav>
        
            <br/><br/><br/><br/>
            
           {
           content === "display" ?  
        <p
            style={{
                fontSize : "3vh",
                position : "absolute",
                left : "2vw"
            }}
        >Pick a profile picture</p>
        :
        content === "cover" ?
        <p
            style={{
                fontFamily : "-apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif",
                fontSize : "3vh",
                position : "absolute",
                left : "2vw"
            }}
        >Pick a header</p>
        
        :
        <p
            style={{
                fontFamily : "-apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif",
                fontSize : "3vh",
                position : "absolute",
                left : "2vw"
            }}
        >Describe yourself</p>
        }
        <br/><br/><br/>
        {content !== "about" ?
    
            content === "display" ?
            <center>
                {
                dispPic  ?
                <DispImage className ="dispImage" src={`/display/${dispPic}`} />
                :
                <DispImage className ="dispImage" src="avatar.jpg" height="120px" width="120px"/>
                }
                <br/>
            </center>
            :
            <center>
                {!coverPic ?
                <CovImage src="/grey.png" 
              style={{
                  position : "relative",
                  bottom : "1vh"
              }}
              /> 
              :
              <CovImage src={`/cover/${coverPic}`} 
              className="coverImg"   
              style={{
                  position : "relative",
                  bottom : "1vh"
              }}
              />
            }
              <br/>
            </center>
            
            :
            null
        }   
               {
                content !== "about" ?
                content === "display" ?
                <div>
                <input type="file" style={{visibility : "hidden"}} id="display" 
                ref = {hiddenFileDisp} 
                onChange={onChangeDisp}
                ></input>
                <center>
                <Upload
                onClick={clickDisp}
                className="btn-upload"
                >
                Upload
                </Upload>
                </center>
                </div>
                :
                <div>
                <input type="file" style={{visibility : "hidden"}} id="cover" 
                ref = {hiddenFileCov} 
                onChange={onChangeCov}
                ></input>
                <center>
                <Upload
                onClick={clickCov}
                className="btn-upload"
                >
                Upload
                </Upload>
                </center>
                </div>
                :
                <div>
                <DeletePrompt id="deletePrompt">
                    <img src="/closeIcon.png" height="18px" style={{marginLeft : "12px", marginTop : "12px", cursor : "pointer"}}
                    onClick={(e)=>{document.getElementById("deletePrompt").style.display = "none"}} 
                    />
                    <P><b>Are you sure you want to delete your account ?</b></P>
                    <Yes
                    onClick={()=>{deleteAccount()}}
                    >Yes</Yes> <No
                    onClick={()=>{document.getElementById("deletePrompt").style.display = "none"}}
                    >No</No>

                </DeletePrompt>
                <center><About contentEditable={true} placeholder="Your bio" 
                maxLength={160}
                suppressContentEditableWarning={true}
                onChange={onChange}
                id="about"
                >
                {props.profile.about}
                </About>
                </center>
                <span
                style={{fontSize : "18px", float : "right", marginRight : "2em", color : "rgba(255, 255, 255, 0.85)"}}
                >
                { bio?
                `${bio.length}/160`
                : null}
                </span>
                <center>
                <br/><br/>
                <Upload onClick={submit} 
                className="btn-upload"
                >Save</Upload>
                </center>
                <center>
                {
                   displayDeleteBtn(props.profile.joined) ?
                <DeleteAccount
                onClick={()=>{document.getElementById("deletePrompt").style.display = "block"}}
                >
                    Delete Account
                </DeleteAccount>
                :
                null
                }
                </center>
                </div>
                }
                {
                props.error ?
                    <center>
                    <br/><p
                    style={{fontSize : "18px", color : "red"}}
                    >
                    {props.error.msg} 
                    </p>
                    </center>
                    :
                    null
                } 
         </div>
        </Body>
            
    )
}
ProfileUpload.propTypes = {
    profile : PropTypes.object.isRequired,
    auth : PropTypes.object.isRequired,
    error : PropTypes.object,
    uploadDisp : PropTypes.func.isRequired,
    uploadCover : PropTypes.func.isRequired,
    uploadBio : PropTypes.func.isRequired,
    clearErrors : PropTypes.func.isRequired,
    logOut : PropTypes.func.isRequired
}
const mapStateToProps = state =>({
    profile : state.profile,
    auth : state.auth,
    error : state.error
})
export default connect(mapStateToProps, {uploadDisp, uploadCover, uploadBio, clearErrors, logOut})(ProfileUpload); 