import {useState, useEffect} from 'react';
import styled from 'styled-components'; 
import {register} from '../Actions/authActions'; 
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {
    usePrevious
}
from '../utils' 


// import {BrowserRouter as Router, 
//     Switch,
//     Link
// } from 'react-router-dom'
const Body = styled.div`
    height : 100vh;
    width : 100vw;
    background-color : #242323;
`

const Input = styled.input`
    width : 80%;
    height : 45px;
    color : white;
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
    @media (max-width : 850px){
        height : 37px;
        font-size : 15px;
    }
    @media (max-width : 600px){
        height : 30px;
    }
`
const Button = styled.button`
    position : relative;
    outline : none;
    border : none;
    margin : 3vh 0;
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
    @media (max-width : 600px){
        height : 25px;
        width : 55px;
        font-size : 14px;
    }
`
const FormGroup = styled.div`
    display : flex;
    flex-direction : column;
    margin : 5vh 0px 4vh 3vw;
    @media (max-width : 600px){
        margin : 5vh 0px 6vh 3vw;
    }
`
const Span = styled.span`
    font-size : 18px;
    color : #FE5A4A;
    position : relative;
`

const Register = (props) =>{
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState(''); 
    const [error, setError] = useState(null);
    const onChange = (e) =>{
        switch(e.target.name){
            case "name" :
                setName(e.target.value);
                break;
            case "username" : 
                setUsername(e.target.value);
                break;
            case "email" :
                setEmail(e.target.value);
                break;
            case "password" :
                setPassword(e.target.value);
                break;
            default :
                return null;
        }    
    }
    const prevMsg = usePrevious(props.err.msg);
    useEffect(
        () => {
            if(prevMsg !== props.err.msg){
                setError(props.err.msg);
            }
            if(props.isAuthenticated){
                window.location.href="/set_up_profile";
            }
        }, [props.err.msg, props.isAuthenticated]
    )

    const onClick = () =>{
       const user = {
        username : username.trim(),
        name : name.trim(),
        password : password,
        email : email.trim()
    }
    props.register(user);
    }

    return(
        <Body>
    <div className="form">
        <h2
        style={{fontFamily : "apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
                left : "3vw", top : "2vh", position : "relative", alignContent :"justify"
    }}
        >
            Create your account
        </h2>
        <FormGroup>
            <Input name="name" type="text" placeholder="Name" onChange={onChange}
            style = {error === "Name cannot contain special characters" ? {borderBottomColor : "red"} : {borderBlockColor : "#363636" }}
            />
        </FormGroup>
        <FormGroup>
            <Input name="email" type="text" placeholder="Email" onChange={onChange}
            style = {error === "Please enter valid email id" ? {borderBottomColor : "red"} : {borderBlockColor : "#363636" }}
            />
        </FormGroup>
        <FormGroup>
            <Input name="username" type="text" placeholder="Username" onChange={onChange}
            style = {error === "Username cannot contain special characters or space" ? {borderBottomColor : "red"} : {borderBlockColor : "#363636" }}
            />
        </FormGroup>
        <FormGroup>
            <Input name="password" type="password" placeholder="Password" onChange={onChange}
            style = {error === "Password must contain 6 to 20 characters, and contain at least one special character, digit and letter" ? {borderBottomColor : "red"} : {borderBlockColor : "#363636" }}
            />
        </FormGroup>
        {
            error ?<center> <Span>{error}</Span> </center>: null
        }
        <center>
        <Button onClick={onClick}>Submit</Button>
    
        </center>
    </div>
    </Body>
    )
}

Register.propTypes = {
    isAuthenticated : PropTypes.bool.isRequired,
    register : PropTypes.func.isRequired,
    err : PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    isAuthenticated : state.auth.isAuthenticated,
    err : state.error
})

export default connect(mapStateToProps, {register})(Register);