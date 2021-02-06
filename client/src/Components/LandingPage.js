import {connect} from 'react-redux';
import styled from 'styled-components';
import {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {login} from '../Actions/authActions';
import {
    usePrevious
}
from '../utils'

const Container = styled.div`
    display : flex;
    @media (max-width : 550px){
        flex-direction : column-reverse;
    }
`
const P = styled.p`
`
const RightHalf = styled.div`
    height : 100vh;
    width : 50vw;
    @media (max-width : 550px){
        width : 100%;
        height : 65vh; 
    }
`

const LeftHalf = styled.div`
    background : #54b2de;
    height : 100vh;
    width : 50vw;
    margin : 0;
    @media (max-width : 550px){
        width : 100%;
        height : 35vh;
    }
`
const Button = styled.button`
`
const FormGroup = styled.div`
    display : flex;
    flex-direction : row;
    margin-top : 15px;
    margin-right : 0px;
    ${Button}{
    margin : 10px 8px;
    outline : none;
    border: 1px solid #1FB9EC;
    margin : 15px 0px;
    background : #111;
    color : #1FB9EC;
    height : 40px;
    width : 75px;
    border-radius : 35px;
    font-size : 15px;
    cursor : pointer;
    : active {
        background : rgba(193, 237, 232, 0.1);
    }
    @media (max-width : 550px){
        height : 30px;
    }
    }
    
`

const Input = styled.input`
    width : 35%;
    height : 45px;
    margin : 10px 20px;
    color : rgba(255, 255, 255, 0.85);
    background-color : #363636;
    border-bottom-color :  #363636 ;
    border-bottom-width : 3px;
    border-left : none;
    border-right : none;
    border-top : none;
    font-family: 'Poppin';
    font-size : 18px;
    : hover{
        border-bottom-color : #02E4FA;
        :: placeholder{
        color : #1FB9EC;
        }
    }
    outline : none;
    : focus{
        border-bottom-color : #02E4FA;
    }
    @media (max-width : 550px){
        height : 37px;
        width : 40%;
        margin : 10px 10px;
    }
`
const Span = styled.span`
`
const ErrorContainer = styled.div`
    height : 30px;
    left : 4vw;
    width : 30vw;
    position : relative;
    align-text : justify;
    ${P}{
        font-size : 18px;
        color : red;
    }
`
const RegisterPrompt = styled.div`
    height : 48vh;
    width : 55vh;
    margin-left : 8vw;
    margin-top : 10vh;
    font-family : -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    ${P} {
        
    font-weight : 600;
    font-size : 30px;
    color : rgba(255, 255, 255, 0.9);
    text-align : justify;
    word-spacing : 0.03em;
    letter-spacing : 0.01em;
    margin-top : 2vh;
    @media (max-width : 550px) {
        font-size : 24px;
    }
    }   
    ${Span}{
        font-size : 18px;
        font-weight : 500;
        word-spacing : 0.01em;
        letter-spacing : 0.005em;
        position : relative;
        top : 5vh;
        @media (max-width : 550px){
            font-size : 12px;
            top : 2vh;
        }
    }
    ${Button}{
        outline : none;
        border:none;
        border-radius : 30px;
        height : 40px;
        width : 100px;
        color : white;
        background : #018DBD;
        font-size : 18px;
        font-weight:750;
        margin-top : 8vh;
        cursor : pointer;
        : hover {
            background : #2F86A3; 
        }
        @media (max-width : 550px){
            margin-top : 5vh;
            height : 25px;
            width : 65px;
            font-size : 14px;
        }
    }
   
  
`
const LeftContent =styled.div`
    margin-left : 10%;
    margin-top : 35vh;
    font-family : -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size : 20px;
    font-weight : bold;
    word-spacing : 0.07em;
    letter-spacing : 0.04em;
    @media (max-width : 550px){
        margin-left : 5%;
        margin-top : 5vh;
        font-size : 15px;
    }
 ` 
const LandingPage = (props) =>{
    const toRegister = () =>{
        window.location.href = "/signup";
    }
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    
    const prevMsg = usePrevious(props.err.msg);
    useEffect(
        () => {
            if(prevMsg !== props.err.msg){
                setError(props.err.msg);
            }
            if(props.isAuthenticated) window.location.reload();
        }, [props.err.msg, props.isAuthenticated]
    )
    const onChange = (e) =>{
        switch(e.target.name){
            case "email" :
                setEmail(e.target.value);
                break;
            case "password" :
                setPassword(e.target.value);
                break;
            default :
                return;
        }    
    }
    const onClick = () =>{
        const user = {
            password : password,
            email : email.trim()
        }
        props.login(user);
    }
    return(
        <Container>
        <LeftHalf>
            <LeftContent>
           <P> 
           Follow your interests. <br/><br/>
           Hear what people are talking about. <br/><br/>
           Join the conversation.
           </P>
           </LeftContent>
        </LeftHalf>
        <RightHalf>
            <FormGroup>
                <Input type="text" name="email" placeholder="Email" onChange={onChange}
                style = {error === "Invalid email ID" ? {borderBottomColor : "red"} : {borderBlockColor : "#363636" }}
                /> 
                <Input type="password" name="password" placeholder="Password" onChange={onChange}
                style = {error === "Invalid password" ? {borderBottomColor : "red"} : {borderBlockColor : "#363636" }}
                />   
                <Button onClick={onClick}><h4>Log in</h4></Button>
            </FormGroup>   
            <ErrorContainer>
            {
            error ? <center><P>{error}</P></center> : null
            }
            </ErrorContainer>
            <RegisterPrompt>
                <img src="twitterIconWhite.png" alt=""/>
                <center>
                       <P> See what's happening in<br/>the world right now. </P>
                </center>
                <Span>Join Twitter today.</Span>
                <br/>
                <Button onClick={toRegister}>
                    Sign up
                </Button>
            </RegisterPrompt>
        </RightHalf>
        </Container>
    )
}

LandingPage.propTypes = {
    isAuthenticated : PropTypes.bool.isRequired,
    login : PropTypes.func.isRequired,
    err : PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    isAuthenticated : state.auth.isAuthenticated,
    err : state.error
})
export default connect(mapStateToProps, {login})(LandingPage);