import styled from 'styled-components';
import {connect} from 'react-redux';
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from 'react-router-dom';
import PropTypes from 'prop-types';
import {logOut} from '../Actions/authActions';
import Home from './MainComponents/Home';
import Search from './MainComponents/Search';
import ProfileHandler from './MainComponents/ProfileHandler';
import TweetHandler from './TweetComponents/TweetHandler';
import { useEffect, useState } from 'react';
import {getNotifsCount} from '../Actions/tweetActions'
import { usePrevious } from '../utils';
import Notifications from './MainComponents/Notifications';
import TrendHandler from './TweetComponents/TrendHandler';

const Container = styled.div`
    font-family : -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
    height : 100vh;  

`
const SideNav = styled.div`
    width : 25%;
    height : 60vh;
    text-align : right;
    font-weight : bold;
    font-size : 20px; 
    display : flex;
    flex-direction : column;
    padding : 20vh 0vh;
    position : fixed;
`
const Button = styled.button`
`
const NavContent = styled.span`
  position : absolute;
  left : 60px;
  color : rgba(255, 255, 255, 0.85);
`
const NavItem = styled.div`
    
    width : 70%;
    height : 50px;
    margin : 10px 0;
    position : relative;
    left : 30%;
    display : flex;
    align-items : flex-end;
    ${Button}{
    outline : none;
    border:none;
    border-radius : 30px;
    height : 40px;
    width : auto;
    color : rgba(255, 255, 255, 0.8);
    background : inherit;
    font-size : inherit;
    font-weight: bold;
    margin-top : 8vh;
    display : flex;
    cursor : pointer;
    : active{
        color : #2F86A3;
    }
    @media (max-width : 550px){
        margin-top : 5vh;
        height : 25px;
        width : 65px;
        font-size : 14px;
    }
    }
`
const NotifsCount = styled.div`
background-color: #6498d9;
height: 20px;
width: 25px;
border-radius: 25px;
font-size: 12px;
padding-top: 3.5px;
text-align: center;
color: white;
position: absolute;
bottom: 24px;
left: 22px;
font-weight: 500;
`
const Main = styled.div`
   width : 40%;
   height : 100vh;
   max-height : 100vh;
   position : absolute;
   left : 25%;
   top : 0;
   border-left : 1px solid rgba(255, 255, 255, 0.3);
   border-right : 1px solid rgba(255, 255, 255, 0.3);
   overflow-y : scroll;
   overflow-x : none;
`
const MainPage = props =>{
    const [notifColor, setNColor] = useState("rgba(255, 255, 255, 0.85)");
    const [logOutColor, setLOColor] = useState("rgba(255, 255, 255, 0.85)");
    const [searchColor, setSColor] = useState("rgba(255, 255, 255, 0.85)");
    const [homeColor, setHColor] = useState("rgba(255, 255, 255, 0.85)");
    const [profileColor, setPColor] = useState("rgba(255, 255, 255, 0.85)");
    const [notifsCnt, setNCount] = useState(0);
    let prevNotifs = usePrevious(props.auth.notifications);
    useEffect(
        ()=>{
        props.getNotifsCount()
       if(prevNotifs !== props.auth.notifications){
           setNCount(props.auth.notifications)
       }
    }, [props.auth.notifications])
    return (
        localStorage.getItem("token") ?
        <Container
        id="body"
        >
            <SideNav>
                <NavItem>
                    <Button
                    onClick={()=>{
                        window.location="/home";
                    }}
                    onMouseEnter={()=>{
                        document.getElementById("home").style.color = "#41bcfa";
                        setHColor("#41bcfa")
                    }}
                    onMouseLeave={()=>{
                        document.getElementById("home").style.color = "rgba(255, 255, 255, 0.85)";
                        setHColor("rgba(255, 255, 255, 0.85)");
                    }}
                    >
                    <svg width="50" height="50" viewBox="0 0 58 60" stroke={homeColor} fill="none" xmlns="http://www.w3.org/2000/svg" 
                    style={{position : 'relative', bottom : '18px',  left : "-5px"}}
                    >
                    <path d="M23 50.5H37.5" strokeWidth="3"/>
                    <circle cx="30" cy="33" r="5" strokeWidth="2"/>
                    <path d="M36 51.3186L47 32" strokeWidth="3"/>
                    <path d="M24.3599 51.3582L20.1799 42.7892L15 32.5" strokeWidth="3"/>
                    <line x1="11.9684" y1="35.9111" x2="30.9684" y2="17.9111" strokeWidth="3"/>
                    <line x1="29.9715" y1="18.8571" x2="49.9715" y2="35.8571" strokeWidth="3"/>
                    </svg>
                       <NavContent id="home"> 
                           Home 
                        </NavContent>
                    </Button>
                </NavItem>
                <NavItem>
                
                <Button
                onMouseEnter={()=>{
                    document.getElementById("profile").style.color = "#41bcfa";
                    setPColor("#41bcfa")
                }}
                onMouseLeave={()=>{
                    document.getElementById("profile").style.color = "rgba(255, 255, 255, 0.85)";
                    setPColor("rgba(255, 255, 255, 0.85)")
                }}
                onClick={(e)=>{
                    window.location = `/profile/${props.auth.user.username}`
                }}
                >
                <svg width="40" height="40" viewBox="0 0 100 100" fill={profileColor} xmlns="http://www.w3.org/2000/svg" 
                style={{position : 'relative', bottom : "10px"}}>
                <path fillRule="evenodd" clipRule="evenodd" d="M48 57C59.0457 57 68 46.7025 68 34C68 21.2975 59.0457 11 48 11C36.9543 11 28 21.2975 28 34C28 46.7025 36.9543 57 48 57ZM48 50C55.1797 50 61 43.0604 61 34.5C61 25.9396 55.1797 19 48 19C40.8203 19 35 25.9396 35 34.5C35 43.0604 40.8203 50 48 50Z" />
                <path fillRule="evenodd" clipRule="evenodd" d="M7.01641 79C7.0055 78.8339 7 78.6672 7 78.5C7 68.835 25.3563 61 48 61C70.6437 61 89 68.835 89 78.5C89 78.6672 88.9945 78.8339 88.9836 79H73.8147C72.2734 72.8037 61.3035 68 48 68C34.6965 68 23.7266 72.8037 22.1853 79H7.01641Z" />
                <path d="M7 77.5H89V84.5H7V77.5Z" />
                 </svg>
                <NavContent id="profile"> 
                    Profile 
                </NavContent>
                </Button>
                </NavItem>
                <NavItem>
                <Button
                onClick={()=>{window.location = "/notifications"}}
                onMouseEnter={()=>{
                    document.getElementById("notification").style.color = "#41bcfa";
                    setNColor("#41bcfa");
                }}
                onMouseLeave={()=>{
                    document.getElementById("notification").style.color = "rgba(255, 255, 255, 0.85)";
                    setNColor("rgba(255, 255, 255, 0.85)");
                }}
                >
                <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
                style={{position: "relative", bottom : "5px"}}
                >
<path d="M51 16C58.8805 16 64.2519 17.4518 67.8832 19.5388C71.4426 21.5845 73.5694 24.374 74.7907 27.5918C77.3475 34.328 76.0107 43.1744 73.7627 50.652C71.7396 57.3813 72.5576 65.1673 76.8313 71H24.9388C28.9072 65.2535 29.6173 57.7948 27.7196 51.297C25.5442 43.8479 24.211 34.8328 26.8324 27.9175C28.0873 24.607 30.2614 21.7358 33.881 19.633C37.569 17.4904 43.0151 16 51 16Z" stroke={notifColor} strokeWidth="8"/>
<path fillRule="evenodd" clipRule="evenodd" d="M50.5 87C56.8513 87 62 83.4183 62 79H39C39 83.4183 44.1487 87 50.5 87ZM42.8933 73H58.1067C56.0795 71.7553 53.4165 71 50.5 71C47.5835 71 44.9205 71.7553 42.8933 73Z" fill={notifColor}/>
<circle cx="49.5" cy="10.5" r="6.5" fill={notifColor}
/>
</svg>
                <NotifsCount>
    
                <center> {notifsCnt} </center>
                </NotifsCount>
                <NavContent id="notification">
                    Notifications
                </NavContent>
                </Button>
                </NavItem>
                <NavItem>
                <Button
                    onMouseEnter={()=>{
                        document.getElementById("search").style.color = "#41bcfa";
                        setSColor("#41bcfa");
                    }}
                    onMouseLeave={()=>{
                        document.getElementById("search").style.color = "rgba(255, 255, 255, 0.85)";
                        setSColor("rgba(255, 255, 255, 0.85)");
                    }}
                    onClick={e =>{
                        window.location="/search";
                    }}
                >
                <svg width="48" height="48" viewBox="0 0 60 60" fill="none" stroke={searchColor} xmlns="http://www.w3.org/2000/svg"
                style={{position : "absolute", bottom : "3px"}}
                >
<circle cx="26.5" cy="25.5" r="10.5" strokeWidth="4"/>
<line x1="32.7276" y1="35.9923" x2="39.7276" y2="47.9923" strokeWidth="4"/>
</svg>
                    <NavContent id="search">
                        Search
                    </NavContent>
                    </Button>
                </NavItem>
                <NavItem>
                <Button
                onMouseEnter={()=>{
                    document.getElementById("logout").style.color = "#41bcfa";
                    setLOColor("#41bcfa");
                }}
                onMouseLeave={()=>{
                    document.getElementById("logout").style.color = "rgba(255, 255, 255, 0.85)";
                    setLOColor("rgba(255, 255, 255, 0.85)");
                }}
                onClick = {e => {
                    props.logOut();
                    window.location.reload();
                    }
                }                
                >
                <svg id="logOutIcon" width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"
                style={{position : "absolute", bottom : "7px"}}
                >
<path d="M45 14H55V50H45V14Z" fill={logOutColor}/>
<path d="M55 49C55 51.7614 52.7614 54 50 54C47.2386 54 45 51.7614 45 49C45 46.2386 47.2386 44 50 44C52.7614 44 55 46.2386 55 49Z" fill={logOutColor}/>
<path d="M55 14C55 16.7614 52.7614 19 50 19C47.2386 19 45 16.7614 45 14C45 11.2386 47.2386 9 50 9C52.7614 9 55 11.2386 55 14Z" fill={logOutColor}/>
<path fillRule="evenodd" clip-rule="evenodd" d="M41 24.0785C28.3153 27.5795 19 39.2019 19 53C19 69.5686 32.4315 83 49 83C65.5685 83 79 69.5686 79 53C79 39.9378 70.6519 28.8254 59 24.7071V34.6757C64.978 38.1338 69 44.5972 69 52C69 63.0457 60.0457 72 49 72C37.9543 72 29 63.0457 29 52C29 43.7987 33.9364 36.7504 41 33.6642V24.0785Z" fill={logOutColor}/>
</svg>
                <NavContent id="logout">
                    Log Out
                </NavContent>
                </Button>
                </NavItem>
            </SideNav>
            <Main id="scrollDiv">
        
            {
              <Router>
                  <Switch>
                      <Route exact path = "/" component={Home}/>
                      <Route exact path = "/home" component={Home}/>
                      <Route exact path = "/search" component={Search} />
                      <Route exact path = "/notifications" component={Notifications} />
                      <Route exact path = "/profile/:username" component= {ProfileHandler}/>
                      <Route exact path = "/tweet/:id" component={TweetHandler}/>
                      <Route exact path = "/trends/:hashtag" component={TrendHandler} />
                  </Switch>
              </Router>  
            }     
            </Main>
        </Container>
        :
        window.location = "/"
    )
}

MainPage.propTypes = {
    logOut : PropTypes.func.isRequired, 
    auth : PropTypes.object.isRequired,
    getNotifsCount : PropTypes.func.isRequired
}

const mapStateToProps = (state) =>({
    auth : state.auth
})

export default connect(mapStateToProps, {logOut, getNotifsCount})(MainPage);