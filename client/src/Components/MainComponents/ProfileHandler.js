import styled from 'styled-components';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import TweetsList from '../TweetComponents/TweetsList';
import { generateNotifications } from '../../Actions/tweetActions';

export const getConfig = (auth) =>{
    const token = auth.token;
    const config = {
        headers : {
            "Content-type" : "application/json"
        }
    }
    if(token) config.headers["x-auth-token"] = token;
    return config;
}

const Container = styled.div`
    width : 100%;
    height : auto;
    position : absolute;
`

const TopDiv = styled.div`
    position : fixed;
    height : 35px;
    width : 38%;
    padding : 1% 0 0.5% 1%;
    border-bottom : 1px solid rgba(255, 255, 255, 0.3);
    background : black;
    z-index : 2;   
    display : flex; 
`
const PrevIcon = styled.button`
    outline : none;
    border : none;
    cursor : pointer;
    background : inherit;
    height : auto;
    width : auto;
    margin-right : 15px;
`
const InnerContainer = styled.div`
    width : 100%;
    position : absolute;
    top : 60px;
    height : auto;
`
const Emp = styled.p`
    font-weight : bold;
    font-family :  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background : inherit;
    color : rgba(255, 255, 255, 0.8);
    font-size : 18px;
`;
const Std = styled.p`
    font-family : apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size : 15px;
    color : rgba(255, 255, 255, 0.9);
    margin-bottom : 10px;

`
const Sub = styled.p`
    font-size : 15px;
    font-family :  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color : rgba(255, 255, 255, 0.5);
    margin-bottom : 10px;

`
const NameAndTweetCount = styled.div`
    width : 30%;
    margin-left : 5px;
    ${Emp}{
        position : absolute;
        top : 5px;
    }
    ${Sub}{
        position : relative;
        top : 12px;
    }
`
const Disp = styled.img`
`
const Cover = styled.img`
`
const ProfilePics = styled.div`
    max-height : 240px; 
    ${Cover}{
        max-height : 200px;
    }
    ${Disp}{
        border-radius : 125px;
        position : relative;
        left : 25px;
        top : -85px;
        border : 5px solid black;
    }
`
const FollowButton = styled.button`
    outline : none;
    border: 1px solid #1FB9EC;
    background : inherit;
    color : #1FB9EC;
    height : 40px;
    width : 80px;
    border-radius : 35px;
    font-size : 15px;
    cursor : pointer;
    font-weight : bold;
    margin-right : 8px;
    : active {
        background : rgba(193, 237, 232, 0.1);
    }
    @media (max-width : 550px){
        height : 30px;
    }
`
const ProfileText = styled.div`
    position : relative;
    margin-top : 10px;
    width : 97%; 
    border-bottom : 1px solid rgba(255, 255, 255, 0.3); 
    padding : 0 0 6px 15px;

    ${FollowButton}{
        position : absolute;
        right : 0;
        top : -45px;
    }
`

const ProfileHandler = (props) =>{
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [tweetCount, setTweetCount] = useState(null);
    const [follow, setFollow] = useState(null);
    const username = props.match.params.username;
    const countFormat = x =>{
        if(x<10000) return x;
        if(x>=1000 && x < 1000000) return parseInt(x/1000) + "K";
        return parseInt(x/1000000) + "M";
    }
    const getProfile = () =>{
        axios.post('/api/auth/profile',  {username : username})
        .then(res =>{
            var result=null;
            if(res.data.length === undefined) result = [res.data]; 
            else result = res.data;
            const {name, email, username, display_pic, cover_pic, about, isVerified, joined, followers_cnt, following_cnt} = result[0];
            if(!res.data) return
            setUser({
                name : name,
                email : email, 
                username : username});
            setProfile({
                display : display_pic, 
                cover : cover_pic, 
                about : about, 
                isVerified : isVerified,
                joined : joined,
                followers : followers_cnt, 
                following : following_cnt
            });
            result.map((item, idx)=>{
                if(item.followed_by === props.auth.user.username) {
                    setFollow(1);
                }
                else if(!follow) setFollow(0)
                return null;
            })
        })
        .catch(err => console.log(err));
    }
    const updateFollow = (state) =>{
        setFollow(state);
        axios.post('/api/auth/follow', {username : username, follow : state}, getConfig(props.auth))
        .then(res =>{
            console.log(state);
            if(state)
            props.generateNotifications(null, props.auth.user.username, username, 0, null);
            else
            props.generateNotifications(null, props.auth.user.username, username, -1, null);
        })
        .catch(err => console.log(err))
    }
    const getTweetCount = () =>{
        axios.post('/api/tweet/count', {username : username})
        .then(res => {
            setTweetCount(res.data.count)
        })
        .catch(err => console.log(err))
    }
    const getJoinedDate = () =>{
        const date = profile.joined;
        const month = date[5] + date[6];
        const list = ["January", "February", "March" ,"April", "May", "June", "July", "August", "September", "October", "November", "December"]
        return list[month-1] + ' ' + date[0]+date[1]+date[2]+date[3];
    }
    useEffect(()=>{
        getProfile();
        getTweetCount()
    }, [props.auth])
    return(
        user && profile && follow!=null?
        <Container>
            <TopDiv
            id="return-top"
            >
                <PrevIcon
                onClick={()=>{window.history.back()}}
                >
                <img src="/prevIcon.png" alt="" width="30px"/>
                </PrevIcon>
                <NameAndTweetCount>
                <Emp>
                {user.name}
                {
                    profile.isVerified ?
                <img src="/verifiedIcon.png" width="20px" alt="" style={{
                    position : "relative", 
                    left : "4px", 
                    top : "3px"
                }}/>
                : null
                }
                </Emp>
                <Sub>
                {`${tweetCount} Tweet`}{tweetCount !== 1 ? 's' : null}
                </Sub>
                </NameAndTweetCount>
            </TopDiv>
          <InnerContainer>
           
            <ProfilePics>
                    {
                        profile.cover?
                    <Cover src={`/cover/${profile.cover}`} alt="" width="100%"/>
                    :
                    <Cover src="/grey.png" width="100%"/>
                    }
                    
                    {
                        profile.display?
                    <Disp src={`/display/${profile.display}`} alt="" width="125px" height="125px"/>
                    :
                    <Disp src="/avatar.jpg" width="125px" height="125px" alt=""/>
                    }
                    
            </ProfilePics>
            <ProfileText>
            {
            user.username !== props.auth.user.username ?
            follow?
            <FollowButton
            onClick={e=>updateFollow(!follow)}
            style={{background : "#1FB9EC", color : "rgba(255, 255, 255, 0.85)", fontWeight : "bold"}}
            >Following</FollowButton>
            :
            <FollowButton
            onClick={e=>updateFollow(!follow)}
            >Follow</FollowButton>
            : 
            <FollowButton
            onClick={e =>{window.location="/set_up_profile"}}
            style={{width : "125px"}}
            >
                Update Profile
            </FollowButton>
            }
                <Emp>
                {user.name}
                {
                profile.isVerified ?
                <img src="/verifiedIcon.png" width="20px" alt="" style={{
                position : "relative", 
                left : "4px", 
                top : "3px"
                }}/>
                : null
                }
                </Emp>
                <Sub>
                    @{user.username}
                </Sub>
                <Std>
                    {profile.about}
                </Std>
                <Sub>
                    <img src="/calendarIcon.png" alt="" width="18px"
                    style = {{
                        position : "relative",
                        bottom : "-2px",
                        marginRight : "4px"
                    }}
                    />
                    Joined {getJoinedDate()}
                 </Sub>
                 <Emp
                 style={{display : "inline"}}
                 >{countFormat(profile.following)}
                 </Emp>
                 <Sub
                 style={{display : "inline", marginLeft : "6px"}}
                 > 
                Following
                 </Sub>
                 <Emp
                 style={{display : "inline", marginLeft : "6px"}}
                 >{countFormat(profile.followers)}
                 </Emp>
                 <Sub
                 style={{display : "inline", marginLeft : "6px"}}
                 > 
                Followers
                 </Sub> 
            </ProfileText>
            <TweetsList
            type="profile"
            username={props.match.params.username}
            />
            </InnerContainer>
        </Container>
        :
        null
    )
}

ProfileHandler.propTypes = {
    auth : PropTypes.object.isRequired,
    profile : PropTypes.object.isRequired,
    generateNotifications : PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
    auth : state.auth,
    profile : state.profile
})


export default connect(mapStateToProps, {generateNotifications})(ProfileHandler);