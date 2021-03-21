import styled from 'styled-components';
import {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import {getConfig} from '../MainComponents/ProfileHandler';
import Reply from './Reply';

const Container = styled.div`
    width : 100%;
    height : auto;
    display : flex;
    flex-direction : column;
    overflow : none;
`
export const Emp = styled.p`
    font-weight : bold;
    font-family :  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background : inherit;
    color : rgba(255, 255, 255, 0.8);
    font-size : 16px;
`
export const Sub = styled.p`
    font-size : 15px;
    font-family :  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color : rgba(255, 255, 255, 0.5);
    margin-bottom : 10px;

`
export const Std = styled.p`
    font-family : apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size : 15px;
    color : rgba(255, 255, 255, 0.8);
    margin-bottom : 10px;

`
export const Display = styled.img`
    margin : 0;
    border-radius : 45px;
`
const MediaImage = styled.div`
    height : auto;
    width : auto;
    margin-left : 30px;
    margin-right : 80px;
    :hover{
        transform : scale(1.4, 1.25);
        cursor : pointer;
    }
`
export const Btn = styled.button`
    outline : none;
    border : none;
    width : auto;
    height : 18px;
    background : inherit;
    cursor : pointer;
`
export const Like = styled.svg`
    :hover {
        stroke : red;
    }
`
export const ReplyIcon = styled.svg`
    :hover{
        stroke : #1FB9EC;
    }
`
export const IconDiv = styled.div`
    display : flex;
    width : 100%;
    justify-content : space-evenly;
    margin-top : 8px;
`
export const TweetContent = styled.div`
    position : relative;
    width : 95%;
    padding : 8px;
`
export const A = styled.a`
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
export const Tweet = styled.div`
    width : 100%;
    border-bottom : 1px solid rgba(255, 255, 255, 0.3);
    border-top : 1px solid rgba(255, 255, 255, 0.3);
    display : flex;
    ${Display}{
        position : relative;
        margin-top : 10px;
        margin-left : 15px;
    }
    
`

export const updateLike = (like, id, props) =>{
    axios.post('/api/tweet/likes', {like : like, id : id}, getConfig(props.auth))
    .then(res => null)
    .catch(err => console.log(err))
    
}
export const getTimeDif = (tweetDate) =>{
    const year = tweetDate[0] + tweetDate[1] + tweetDate[2] + tweetDate[3];
    var month = tweetDate[5] + tweetDate[6];
    month--;
    var day = tweetDate[8] + tweetDate[9];
    const sentTime = new Date(year, month, day, tweetDate[11]+tweetDate[12], tweetDate[14]+tweetDate[15], 0, 0).getTime()/ (1000*60);
    const current = Date.now()/(1000*60);
    var dif = current - sentTime;
    dif = parseInt(dif);
    if(dif < 60){
        return dif + "m";
    }
    dif /= 60;
    dif = parseInt(dif);
    if(dif < 24){
        return dif + "h";
    }
    dif /= 24;
    dif = parseInt(dif);
    if(dif < 7){
        return dif + "d";
    }
    if(day[0]==='0') day = day[1]; 
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    
    if(year === new Date().getFullYear()){
        return months[month] + ' ' + day;
    }
    return months[month] + ' ' + day + ', ' + year;
 }
const TweetsList = props => {
    const [dummy, setDummy] = useState(0);
    const [like, setLike] = useState(null);
    const [likesCount, setLikesCount] = useState(null);
    const [repliesCount, setRepliesCount] = useState(null);
    const [tweetStore, setTweetStore] = useState(null);
    let S = new Set();
    
    const forceUpdate = () =>{
        return setDummy(dummy => dummy + 1);
    }
    
    useEffect(()=>{
        setTweetStore(null);
        const getProfileTweets = (username) =>{
            axios.get(`/api/tweet/profile/${username}`, getConfig(props.auth))
                .then(res => {
                    setTweetStore(res.data);
                    const dict = {};
                    const likesCountDict = {};
                    const repliesCountDict = {};
                    res.data.map((item)=>{
                        if(item.liked_by === props.auth.user.username){
                            dict[item.id] = 1;
                        }
                        else if( !(item.id in dict) ) {
                            dict[item.id] = 0;
                        }
                        likesCountDict[item.id] = item.likes_cnt;
                        repliesCountDict[item.id] = item.replies_cnt;
                        return null;
                    })
                    setLike(dict);
                    setLikesCount(likesCountDict);
                    setRepliesCount(repliesCountDict);
                })
                .catch(err => console.log(err))
            }
            const getFollowingTweets = () =>{
                axios.get('/api/tweet/following', getConfig(props.auth))
                .then(res=>{
                    setTweetStore(res.data);
                    const dict = {};
                    const likesCountDict = {};
                    const repliesCountDict = {};
                    res.data.map((item)=>{
                        if(item.liked_by === props.auth.user.username){
                            dict[item.id] = 1;
                            likesCountDict[item.id] = item.likes_cnt;   
                            repliesCountDict[item.id] = item.replies_cnt; 
                        }
                        else if( !(item.id in dict) ) {
                            dict[item.id] = 0;
                            likesCountDict[item.id] = item.likes_cnt;
                            repliesCountDict[item.id] = item.replies_cnt;
                        }
                        return null;
                    })
                    setLike(dict);
                    setLikesCount(likesCountDict);
                    setRepliesCount(repliesCountDict);
                })
                .catch(err => console.log(err))
            }
            const getReplies = (id) => {
                axios.get(`/api/tweet/replies/${id}`,  getConfig(props.auth))
                .then(res => {
                    setTweetStore(res.data);
                    const dict = {};
                    const likesCountDict = {};
                    const repliesCountDict = {};
                    res.data.map((item)=>{
                        if(item.liked_by === props.auth.user.username){
                            dict[item.id] = 1;
                            likesCountDict[item.id] = item.likes_cnt;   
                            repliesCountDict[item.id] = item.replies_cnt; 
                        }
                        else if( !(item.id in dict) ) {
                            dict[item.id] = 0;
                            likesCountDict[item.id] = item.likes_cnt;
                            repliesCountDict[item.id] = item.replies_cnt;
                        }
                        return null;
                    })
                    setLike(dict);
                    setLikesCount(likesCountDict);
                    setRepliesCount(repliesCountDict);
                })
                .catch(err => console.log(err))
            };
            const getTrendTweets = (hashtag) =>{
                axios.get(`/api/tweet/trends/${hashtag}`)
                .then(res =>{
                        setTweetStore(res.data);
                        const dict = {};
                        const likesCountDict = {};
                        const repliesCountDict = {};
                        res.data.map((item)=>{
                            if(item.liked_by === props.auth.user.username){
                                dict[item.id] = 1;
                                likesCountDict[item.id] = item.likes_cnt;   
                                repliesCountDict[item.id] = item.replies_cnt; 
                            }
                            else if( !(item.id in dict) ) {
                                dict[item.id] = 0;
                                likesCountDict[item.id] = item.likes_cnt;
                                repliesCountDict[item.id] = item.replies_cnt;
                            }
                            return null;
                        })
                        setLike(dict);
                        setLikesCount(likesCountDict);
                        setRepliesCount(repliesCountDict);
                })
            }
        if(props.username && props.auth.user.username)
        getProfileTweets(props.username);
        else if(props.type === "replies")
        getReplies(props.id)
        else if(props.type === "trends")
        getTrendTweets(props.hashtag)
        else if(props.auth.user.username) 
        getFollowingTweets();
  
    }, [props.username, props.auth.user.username])

    const likeToggle = (id) =>{
        updateLike(!like[id], id, props);
        const newDict = like;
        newDict[id]  = !like[id];
        const countDict = likesCount;
        if(!like[id]) countDict[id] = likesCount[id] -1;
        else countDict[id] = likesCount[id] + 1;
        setLike(newDict);
        setLikesCount(countDict);
        forceUpdate();
    }
    
    return(
        repliesCount && likesCount && like && tweetStore ?
        <Container>
            {tweetStore.map((item, idx)=>{
                if(!S.has(item.id)){
                    S.add(item.id)
                return(
                    <div>
                    <Reply
                    item={item}
                    />
                <Tweet> 
                <A href={`/profile/${item.username}`}>   
                {
                item.display_pic ?
                <Display src={`/display/${item.display_pic}`} alt="" width="45px" height="45px"/>
                : 
                <Display src="/avatar.jpg" width="45px" height="45px" alt=""/>
                }
                </A>
                <TweetContent>
                    <A href={`/profile/${item.username}`}>
                    <Emp
                    style={{display : "inline"}}
                    >
                        {item.name}
                    
                    {
                    item.isverified ?
                    <img src="/verifiedIcon.png" width="20px" alt="" style={{
                        position : "relative", 
                        left : "4px", 
                        top : "4px"
                    }}/>
                    : null
                    }
                    </Emp>
                    <Sub
                    style={{display : "inline", marginLeft : "6px"}}
                    >
                        @{item.username} 
                    </Sub>
                    </A>
                    <Sub
                    style={{display : "inline", marginLeft : "6px"}}                    
                    >
                    {' · ' + getTimeDif(item.sent_time)}
                    </Sub>
                    <Std
                    onClick={e=>{window.location=`/tweet/${item.id}`}}
                    style={{cursor : "pointer"}}
                    >
                        {
                        item.content ?
                        item.content.split(' ').map((text, ix)=>{
                            if(text[0]==='@') return <A href={`/profile/${text.substring(1, text.length)}`}>{text + " "}</A>
                            if(text[0]==='#') return <A href={`/trends/${text.substring(1, text.length)}`}>{text + " "}</A>
                            return text + ' ';
                        })
                        : null
                        }
                    </Std>
                    {
                        item.image? 
                            <MediaImage
                            onClick={e=>{window.location = `/tweet/${item.id}`}}
                            >
                            <img src={`/tweetImage/${item.image}`} alt="" width="400px" height="300px" style={{borderRadius : "10px",
                            display : "inline-block"}}
                            />
                            </MediaImage>
                        :
                        null
                    }
                    <IconDiv>
                    <div>
                    <Btn onClick={(e)=>likeToggle(item.id)}>
                    <Like id="like" width="20" height="20" viewBox="0 0 20 20" fill={like[item.id] ? "red" : "none"} stroke={like[item.id] ? "red" : "#838485"} xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0)">
                    <path d="M1.82419 6.7441C1.57937 5.30131 1.96806 4.3331 2.56118 3.71971C3.17619 3.08368 4.08836 2.75 5.00103 2.75C6.7999 2.75 8.16731 4.09781 8.16731 5.65217H8.91731H9.66731C9.66731 4.09781 11.0347 2.75 12.8336 2.75C13.8385 2.75 14.8819 2.98601 15.5324 3.54741C15.8423 3.81489 16.0747 4.1645 16.1829 4.63854C16.2934 5.12225 16.2838 5.77903 16.0292 6.66177C15.7871 7.50154 15.2215 8.47067 14.4563 9.48018C13.6985 10.4798 12.7811 11.4723 11.8867 12.3566C10.9939 13.2392 10.1338 14.0043 9.49654 14.5489C9.27497 14.7382 9.08073 14.9006 8.92186 15.0317C8.7433 14.882 8.5199 14.6926 8.26329 14.4702C7.581 13.879 6.66746 13.0585 5.73866 12.1384C4.80745 11.2159 3.8739 10.2062 3.14387 9.23616C2.39634 8.2429 1.93231 7.38128 1.82419 6.7441Z" strokeWidth="1.5"/>
                    </g>
                    <defs>
                    <clipPath id="clip0">
                    <rect width="20px" height="20px" fill="white"/> 
                    </clipPath>
                    </defs>
                    </Like>
                    </Btn>
                    <Sub
                    style={{display : "inline", position : "relative", bottom : "5px", left : "5px"}}
                    >{likesCount[item.id]}
                    </Sub>
                    </div>
                    <div>
                    <Btn
                    onClick={()=>{
                        document.getElementById(`reply${item.id}`).style.display="block";
                        document.getElementById("body").style.background= "#222";
                        document.getElementById("return-top").style.background="#222";
                    }}
                    >
                    <ReplyIcon width="18px" height="18px" viewBox="0 0 20 20" fill="none" stroke="#838485" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M14.1904 12C15.3112 10.8321 16 9.24649 16 7.5C16 3.91015 13.0899 1 9.5 1C5.91015 1 3 3.91015 3 7.5C3 10.9216 5.64378 13.7257 9 13.9811V14.9836C5.09098 14.7263 2 11.4741 2 7.5C2 3.35786 5.35786 0 9.5 0C13.6421 0 17 3.35786 17 7.5C17 9.18841 16.4421 10.7465 15.5005 12H14.1904Z" strokeWidth="1" />
                    <path d="M9 14V19" strokeWidth="1"/>
                    <path d="M9.00029 18.9856C9.0005 19.369 15.0029 12.1039 15 12.0001" strokeWidth="1.5"/>
                    </ReplyIcon>
                    </Btn>
                    <Sub
                    style={{display : "inline", position : "relative", bottom : "5px", left : "5px"}}
                    >{repliesCount[item.id]}
                    </Sub>
                    </div>
                    </IconDiv>
                </TweetContent>
            </Tweet>
            </div>
                )
            }
            return null;
            })}
        </Container>
        :
        null
    )
}

TweetsList.propTypes = {
    auth : PropTypes.object.isRequired,
    profile : PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth : state.auth,
    profile : state.profile,
})

export default connect(mapStateToProps,{})(TweetsList);