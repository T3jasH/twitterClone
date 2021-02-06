import styled from 'styled-components'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {useRef, useState, useEffect} from 'react';
import {uploadTweet, uploadReply} from '../../Actions/tweetActions';

const Container = styled.div`
width : 100%;
display : flex;
flex-direction : column;
height : auto;

`
const Img = styled.img``;
const ImgDiv = styled.div`
    top : 10px;
    left : 10px;
    width : 60px;
    margin : 0;
`
const TxtDiv = styled.div`
width : 100%;
height : auto;
position : relative;
top : 10px;
`;
const A = styled.a``;
const TextArea = styled.textarea`
${A}{
font-family : inherit;
font-size : inherit;
text-decoration : none;
: link{
    color : #1FB9EC;
}
: visited{
    color : #1FB9EC;
}
: hover{
    color : #1FB9EC;
}
: active{
    color : #1FB9EC;
}
`;
const DispAndContent = styled.div`
padding : 10px;
display : flex;
width : 98%;
margin-bottom : 10px;

${TextArea}{
    border : none;
    outline : none;
    resize : none;
    background : inherit;
    width : 100%;
    font-family : Helvetica, sans-serif;
    font-size : 18px;
    margin : 0px 5px;
    border : none;
    color : rgba(255, 255, 255, 0.8);
}

`
const Image = styled.div`
margin : 10px;
position : relative;
left : 10%;
`
const CloseIcon = styled.button`
outline : none;
border : none;
background : inherit;
cursor : pointer;
position : absolute;
left : 1%;
top : 15px;
`
const Buttons = styled.div`
display : flex;

width : 90%;
height : 45px;
position : relative;
left : 10%;
`
const UploadImageIcon = styled.button`
border : none;
outline : none;
cursor : pointer;
background : inherit;
// Must be same as upload icon
height : 20px;
width : 20px;
`
const SendTweet = styled.button`
position : absolute;
right : 5%;
top : 0px;
outline : none;
border : none;
height : 30px;
width : 70px;
border-radius : 15px;
background-color : #1FB9EC;
cursor : pointer;
font-weight : bold;
color : #fff;

@media (max-width : 900px){
height : 25px;
width : 50px;
}
`
const ErrorDiv = styled.div`
position : absolute;
top : 80vh;
left : 30%;
background : #18a4f5;
height : 30px;
width : 0%;
visibility : hidden;
color : rgba(255, 255, 255, 0.85);
font-family : "Segoe UI", Roboto, Helvetica;
font-size : 16px;
font-weight : bold;
align-content : center;
border-radius : 15px;
`

const MakeTweet = props => {
    const [imgFile, setImgFile] = useState(null);
    const [content, setContent] = useState('');
    useEffect(()=>{ 
        if(!imgFile && !content) 
        {
            document.getElementById(`${props.tweetbtn}${props.id}`).style.background="rgba(31, 185, 236, 0.7)";
            document.getElementById(`${props.tweetbtn}${props.id}`).style.color="rgba(255, 255, 255, 0.5)";
            document.getElementById(`${props.tweetbtn}${props.id}`).disabled = true;
            document.getElementById(`${props.tweetbtn}${props.id}`).style.cursor = "default";
        }
        else {
            document.getElementById(`${props.tweetbtn}${props.id}`).style.background="rgba(31, 185, 236, 1)";
            document.getElementById(`${props.tweetbtn}${props.id}`).style.color="rgba(255, 255, 255, 0.85)"
            document.getElementById(`${props.tweetbtn}${props.id}`).disabled = false;
            document.getElementById(`${props.tweetbtn}${props.id}`).style.cursor = "pointer";
        }
        if(props.tweetbtn==="Tweet"){
            document.getElementById("mktwt").style.borderBottom = "1px solid rgba(255, 255, 255, 0.3)"; 
        }
    }, [imgFile, content])
   const onChangeTInput = (e) => {
        e.preventDefault()
        if(document.getElementById(`${props.tweetbtn}${props.id}input`).value.length>=160){
            document.getElementById(`${props.tweetbtn}${props.id}counter`).style.color = "red";
            
        }
        else if(document.getElementById(`${props.tweetbtn}${props.id}input`).value.length<=159){
            document.getElementById(`${props.tweetbtn}${props.id}counter`).style.color = "#009ac9";
        }
        setContent(document.getElementById(`${props.tweetbtn}${props.id}input`).value);
        e.target.style.height = "50px";
        e.target.style.height = (e.target.scrollHeight+25)+"px";
    }
    const onClickClose = e => {
        setImgFile(null);
    }
    const hiddenImgUpload = useRef(null);
    const clickImg = (e) => hiddenImgUpload.current.click();
    const onChangeImg = e => { 
        const file = e.target.files[0];
        e.target.value=null;
        if (!file.name.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
            document.getElementById("errorDiv").style.visibility="visible";
            document.getElementById("errorDiv").style.width="35%";
            setTimeout(()=>{
                document.getElementById("errorDiv").style.visibility="hidden";
                document.getElementById("errorDiv").style.width="0%";
            }, 1500);
            return;
        }
        if(!file) return;
        setImgFile(file);
    }
    const submit = (e) =>{
        const formData = new FormData();
        formData.append('image', imgFile);
        if(props.tweetbtn==="Tweet")
        props.uploadTweet(content, formData, null);
        else{
        props.uploadReply(content, formData, props.user_to, props.id);
        document.getElementById(`reply${props.id}`).style.display="none";
        document.getElementById("body").style.background= "#000";
        document.getElementById("return-top").style.background="#000";
        }
        setImgFile(null);
        document.getElementById(`${props.tweetbtn}${props.id}input`).value=null;
        setContent('');
    }
    return (
        <Container id="mktwt">
                <DispAndContent>
                <ImgDiv>
                {
                    props.profile.display?
                <Img src={`/display/${props.profile.display}`} alt=""
                style={{height : `${props.displaySize}`, borderRadius : `${props.displaySize}`, width : `${props.displaySize}`}}
                />
                :
                <Img src="avatar.jpg" alt=""
                style={{height : `${props.displaySize}`, borderRadius : `${props.displaySize}`, width : `${props.displaySize}`}}
                />
                }
                </ImgDiv>
                    <TxtDiv>
                    <TextArea placeholder={props.tweetbtn === "Tweet" ? "What's happening?" : "Your reply"}
                    maxLength ={160}
                    id={`${props.tweetbtn}${props.id}input`}
                    onChange={onChangeTInput}
                    >
                    </TextArea> 
                    </TxtDiv>
                </DispAndContent>
                    {
                       imgFile? 
                       <Image>
                        <CloseIcon
                        onClick = {onClickClose}
                        >
                        <img src="/closeIcon.png" width="30px" height="30px" alt=""/>
                        </CloseIcon>
                       <img src = {URL.createObjectURL(imgFile)} width="400px" height="300px" max-height = "250px" alt=""
                       style={{borderRadius : "25px"}}
                       />
                       </Image>
                       : null
                    }
                <Buttons>
                <input type="file" style={{visibility : "hidden", width : "0px"}}  
                ref = {hiddenImgUpload} 
                onChange={onChangeImg}
                ></input>
                <UploadImageIcon
                onClick={clickImg}
                >
                <img src="/photoUploadIcon.png" height="20px" width="20px" style={{top : "10px"}} alt=""/>
                </UploadImageIcon>
                <span
                id={`${props.tweetbtn}${props.id}counter`}
                style={{color : "#009ac9",
                        marginLeft : "20px"}}>
                {
                   content ?  `${content.trim().length}/160` : null
                }
                </span>
                <SendTweet id={`${props.tweetbtn}${props.id}`}
                onClick={submit}
                >
                    {props.tweetbtn}
                </SendTweet>
            </Buttons>
            <center>
                <ErrorDiv id="errorDiv"
                >
                    Please choose a photo
                </ErrorDiv>
            </center>
         </Container>
    )
}

MakeTweet.propTypes = {
    auth : PropTypes.object.isRequired,
    profile : PropTypes.object.isRequired,
    uploadTweet : PropTypes.func.isRequired,
    uploadReply : PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    auth : state.auth,
    profile : state.profile
})

export default connect(mapStateToProps, {uploadTweet, uploadReply})(MakeTweet); 