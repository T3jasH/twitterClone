import axios from 'axios';
import styled from 'styled-components';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {ReturnTop, Button} from '../TweetComponents/TweetHandler'
import { useEffect, useState } from 'react';
import { getConfig } from './ProfileHandler';
import {Std, Emp, A} from '../TweetComponents/TweetsList'

const Container = styled.div`
    width : 100%;
` 
const InnerContainer = styled.div`
    width : 100%;
    display : flex;
    flex-direction : column;
    position : absolute;
    top : 60px;
`
const Notification = styled.div`
    border-bottom : 1px solid rgba(255, 255, 255, 0.3);
    padding : 5px 10px 10px 15px;

`
const Notifications = (props) =>{
    const [notifList, setNotifList] = useState(null);

    const getNotifications = () => {
        axios.get('/api/notifications/list', getConfig(props.auth))
        .then(res => {
            if(res.data.length)
            setNotifList(res.data)
            else
            setNotifList(null)
        })
        .catch(err => console.log(err))
    }
    useEffect(()=>{
        if(props.auth !== undefined){
        getNotifications();
        }
    }, [] )
    return (
        <Container>
            <ReturnTop>
                <Button>
                    Notifications
                </Button>
            </ReturnTop>
            <InnerContainer>
                {
                    notifList ?
                    notifList.map((item, ix)=>{
                        let bg = null;
                        bg = item.seen === 0 ? "#222" : "inherit" ;
                        return <Notification style={{background : bg}}>
                            
                            {
                                item.display_pic ?
                            <img src={`/display/${item.display_pic}`} width="35px" height="35px" style={{borderRadius  : "35px"}} alt=""/>                           
                            :
                            <img src={`/avatar.jpg`} width="35px" height="35px" style={{borderRadius  : "35px"}} alt=""/>
                            }
                            {
                                item.type===0 ?
                                <Std>
                                    <A href={`/profile/${item.user_from}`} style={{color : "white"}}>
                                        <b>
                                            {item.name}
                                        </b>
                                    </A>{" started following you"} 
                                </Std> 
                                :
                                item.type === 1?
                                <Std>
                                <A href={`/profile/${item.user_from}`} style={{color : "white"}}>
                                        <b>
                                            {item.name}
                                        </b>
                                    </A>{" mentioned you in a tweet"}
                                    <br/>
                                    <A href={`/tweet/${item.tweet_id}`} style={{color : "white"}}>
                                    {item.content.split(' ').map((text, ix)=>{
                                        if(text[0]==='@') return <A href={`/profile/${text.substring(1, text.length)}`}>{text + " "}</A>
                                        return text + ' ';
                                    })}
                                    </A>
                                </Std>
                                
                                :
                                <Std>
                                    <A href={`/profile/${item.user_from}`} style={{color : "white"}}>
                                        <b>
                                            {item.name}
                                        </b>
                                    </A>
                                    <A href={`tweet/${item.tweet_id}`} style={{color : "white"}}>
                                    {" replied to your tweet"}
                                    </A>
                                    <br/>
                                    
                                </Std>
                            }
                            </Notification>
                    })
                    :
                <Emp style={{position : "relative", top : "20px", margin : "auto", fontSize : "18px"}}>
                You do not have any notifications
                </Emp>
                }
            </InnerContainer>
        </Container>
    )
}

Notifications.propTypes = {
    auth : PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth : state.auth
})

export default connect(mapStateToProps, {})(Notifications); 