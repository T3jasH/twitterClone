import axios from 'axios';
import styled from 'styled-components';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import { getConfig } from '../MainComponents/ProfileHandler';
import { useState, useEffect} from 'react';
import TweetsList from './TweetsList';
import {updateLike} from './TweetsList';
import Reply from './Reply';

const Container = styled.div`
    width : 100%;
    height : auto;
    display : flex;
    flex-direction : column;
`;
export const InnerContainer = styled.div`
    width : 100%;
    display : flex;
    position : absolute;
    top : 60px;
    flex-direction : column;
`
export const Button=styled.button`
    outline : none;
    border : none;
    background : inherit;
    cursor : pointer;
`;
export const ReturnTop = styled.div`
    position : fixed;
    height : 35px;
    width : 37.5%;
    padding : 1% 0 0.5% 1%;
    border-bottom : 1px solid rgba(255, 255, 255, 0.3);
    background : black;
    z-index : 3;
    ${Button}{
        font-size : 20px;
        font-weight : bold;
        font-family :  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color : rgba(255, 255, 255, 0.9);
    }
`
const Emp = styled.p`
    font-weight : bold;
    font-family :  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background : inherit;
    color : rgba(255, 255, 255, 0.8);
    font-size : 16px;
`
const Sub = styled.p`
    font-size : 15px;
    font-family :  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color : rgba(255, 255, 255, 0.5);
    margin-bottom : 10px;

`
const Std = styled.p`
    font-family : apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size : 15px;
    color : rgba(255, 255, 255, 0.8);
    margin-bottom : 10px;

`
const Display = styled.img`
    margin : 0;
    border-radius : 45px;
`
const MediaImage = styled.div`
    height : auto;
    width : auto;
    margin-left : 30px;
    margin-right : 80px;
    :hover{
        transform : scale(1.1, 1.1);
        cursor : pointer;
    }
`
const Like = styled.svg`
    :hover {
        stroke : red;
    }
`
const ReplyIcon = styled.svg`
    :hover{
        stroke : #1FB9EC;
    }
`
const IconDiv = styled.div`
    display : flex;
    width : 100%;
    justify-content : space-evenly;
    margin-top : 8px;
`
const Profile = styled.div`
    position : relative;
    width : 95%;
    padding : 8px;
    display : flex;
`
const A = styled.a`
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
`
const Tweet = styled.div`
    width : 99%;
    border-bottom : 1px solid rgba(255, 255, 255, 0.3);
    border-top : 1px solid rgba(255, 255, 255, 0.3);
    display : flex;
    flex-direction : column;
    ${Display}{
        position : relative;
        margin-top : 10px;
    }
`
const TweetHandler = props =>{
    const [tweet, setTweet] = useState(null);
    const [like, setLike] = useState(null);
    const [likesCountMain, setLikesCountMain] = useState(null);
    const getTweetById = id =>{
        axios.post('/api/tweet/id', {id : id}, getConfig(props.auth))
        .then(res => {
            var result = res.data;
            if(res.data.length === undefined) result = [res.data];
            setTweet(result[0]);
            setLikesCountMain(result[0].likes_cnt);
            result.map((item, idx)=>{
                if(item.liked_by === props.auth.user.username){
                    setLike(true);
                }
                else if(!item.liked_by) setLike(false);
                return null;
            })
        })
        .catch(err => console.log(err))
    }
    const likeToggle = (id, likeStatus) =>{
        updateLike(!likeStatus, id, props);
        setLike(!likeStatus);
        if(!likeStatus) setLikesCountMain(likesCountMain+1);
        else setLikesCountMain(likesCountMain-1);
    }
    const getTimeFormat = (tweetDate) =>{
        const year = tweetDate[0] + tweetDate[1] + tweetDate[2] + tweetDate[3];
        var month = tweetDate[5] + tweetDate[6];
        month--;
        var day = tweetDate[8] + tweetDate[9];
        var hr = tweetDate[11] + tweetDate[12], mins = tweetDate[14] + tweetDate[15];
        var t = 'AM';
        if(hr>=13) {
            t = 'PM';
            hr-=12;
        }
        if(hr === 0) hr=12
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        return hr+':'+mins+ ' ' + t +' · ' + months[month] + ' ' + day + ', ' + year;
     }
    useEffect(()=>{
        if(props.match.params.id && props.auth.user.username)
        getTweetById(props.match.params.id)
    }, [props.match.params.id, props.auth.user.username])
    return(
        tweet?
        <Container>
            {console.log(like)}
            <ReturnTop
            id="return-top"
            >
                <Button
                onClick={e=>{document.getElementById("scrollDiv").scrollTo(0, 0)}}
                >
                Tweet
                </Button>
            </ReturnTop>
            <InnerContainer>
            <Reply
            id={`reply${props.match.params.id}`}
            style={{display : "none"}}
            item={tweet}
            />
            <Tweet>
                <Profile>
                {
                tweet.display_pic ?
                <Display src={`/display/${tweet.display_pic}`} alt="" width="55px" height="55px"/>
                : 
                <Display src="/avatar.jpg" width="55px" height="55px" alt=""/>
                }
                <div style={{marginLeft : "10px", marginTop : "10px"}}>
                    <A href={`/profile/${tweet.username}`}>
                   <Emp>
                        {tweet.name}
                    {
                    tweet.isverified ?
                    <img src="/verifiedIcon.png" width="20px" alt="" style={{
                        position : "relative", 
                        left : "4px", 
                        top : "4px"
                    }}/>
                    : null
                    }
                    </Emp>
                    <Sub>
                        @{tweet.username}
                    </Sub>
                    </A>
                </div>
                </Profile>
                    <Std
                    style={{fontSize : "20px", marginLeft : "12px", marginRight : "12px"}}
                    >
                        {
                        tweet.content ?
                        tweet.content.split(' ').map((text, ix)=>{
                            if(text[0]==='@') return <A href={`/profile/${text.substring(1, text.length)} `}>{text+" "}</A>
                            if(text[0]==='#') return <A href={`/trends/${text.substring(1, text.length)}`}>{text + " "}</A>
                            return text + ' ';
                        })
                        : null
                        }
                    </Std>
                    {
                        tweet.image? 
                            <MediaImage>
                            <img src={`/tweetImage/${tweet.image}`} alt="" width="550px" height="320px" style={{borderRadius : "10px",
                            display : "inline-block"}}
                            />
                            </MediaImage>
                        :
                        null
                    }
                    <Sub
                    style={{marginLeft : "12px", marginTop : "10px" }}
                    >
                   { getTimeFormat(tweet.sent_time) }
                    </Sub>
                    <IconDiv style={{marginBottom : "5px"}}>
                    <div>
                    <Button onClick={(e)=>likeToggle(tweet.id, like)}>
                    <Like id="like" width="20" height="20" viewBox="0 0 20 20" fill={like ? "red" : "none"} stroke={like ? "red" : "#838485"} xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0)">
                    <path d="M1.82419 6.7441C1.57937 5.30131 1.96806 4.3331 2.56118 3.71971C3.17619 3.08368 4.08836 2.75 5.00103 2.75C6.7999 2.75 8.16731 4.09781 8.16731 5.65217H8.91731H9.66731C9.66731 4.09781 11.0347 2.75 12.8336 2.75C13.8385 2.75 14.8819 2.98601 15.5324 3.54741C15.8423 3.81489 16.0747 4.1645 16.1829 4.63854C16.2934 5.12225 16.2838 5.77903 16.0292 6.66177C15.7871 7.50154 15.2215 8.47067 14.4563 9.48018C13.6985 10.4798 12.7811 11.4723 11.8867 12.3566C10.9939 13.2392 10.1338 14.0043 9.49654 14.5489C9.27497 14.7382 9.08073 14.9006 8.92186 15.0317C8.7433 14.882 8.5199 14.6926 8.26329 14.4702C7.581 13.879 6.66746 13.0585 5.73866 12.1384C4.80745 11.2159 3.8739 10.2062 3.14387 9.23616C2.39634 8.2429 1.93231 7.38128 1.82419 6.7441Z" strokeWidth="1.5"/>
                    </g>
                    <defs>
                    <clipPath id="clip0">
                    <rect width="20px" height="20px" fill="white"/> 
                    </clipPath>
                    </defs>
                    </Like>
                    </Button>
                    <Sub
                    style={{display : "inline", position : "relative", bottom : "5px", left : "5px"}}
                    >{likesCountMain}
                    </Sub>
                    </div>
                    <div>
                    <Button onClick={
                        () => {
                        document.getElementById(`reply${tweet.id}`).style.display="block";
                        document.getElementById("body").style.background= "#222";
                        document.getElementById("return-top").style.background="#222";
                        }
                    }>
                    <ReplyIcon width="18px" height="18px" viewBox="0 0 20 20" fill="none" stroke="#838485" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M14.1904 12C15.3112 10.8321 16 9.24649 16 7.5C16 3.91015 13.0899 1 9.5 1C5.91015 1 3 3.91015 3 7.5C3 10.9216 5.64378 13.7257 9 13.9811V14.9836C5.09098 14.7263 2 11.4741 2 7.5C2 3.35786 5.35786 0 9.5 0C13.6421 0 17 3.35786 17 7.5C17 9.18841 16.4421 10.7465 15.5005 12H14.1904Z" strokeWidth="1" />
                    <path d="M9 14V19" strokeWidth="1"/>
                    <path d="M9.00029 18.9856C9.0005 19.369 15.0029 12.1039 15 12.0001" strokeWidth="1.5"/>
                    </ReplyIcon>
                    </Button>
                    <Sub
                    style={{display : "inline", position : "relative", bottom : "5px", left : "5px"}}
                    >{tweet.replies_cnt}
                    </Sub>
                    </div>
                    </IconDiv>
            </Tweet>
            <TweetsList
            type="replies" id={props.match.params.id}
            />
            </InnerContainer>
        </Container>
        :
        null
    )
}

TweetHandler.propTypes = {
    auth : PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth : state.auth
})

export default connect(mapStateToProps, {})(TweetHandler);