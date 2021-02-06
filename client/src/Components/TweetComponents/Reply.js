import styled from 'styled-components';
import MakeTweet from './MakeTweet';
import {Btn, Tweet, Display, TweetContent, Emp, Sub, Std, A, getTimeDif} from './TweetsList'

const Container = styled.div`
    background : #000;
    z-index : 1;
    width : 35%;
    height : auto;
    min-height : 300px;
    position : fixed;
    flex-direction : column;
    top : 100px;
    margin : auto;
    border-radius : 30px;
`

const Reply = props => {
    return (
        <Container
        id={`reply${props.item.id}`}
        style={{display : "none"}}
        onKeyDown={key=>{
            if(key.code === "Escape"){
                document.getElementById(`reply${props.item.id}`).style.display="none";
                document.getElementById("body").style.background= "#000";
                document.getElementById("return-top").style.background="#000";
            }
        }}
        >
            <Btn
            style={{position : "relative", top : "10px", left : "15px"}}
                onClick = {()=>{
                    document.getElementById(`reply${props.item.id}`).style.display="none";
                    document.getElementById("body").style.background= "#000";
                    document.getElementById("return-top").style.background="#000";
                    }}>
                <img src="/closeIcon.png" width="25px" height="25px" alt=""/>  
            </Btn>
            <Tweet style={{marginTop : "10px", borderBottom : "none"}}>
                {
                props.item.display_pic ?
                <Display src={`/display/${props.item.display_pic}`} alt="" width="45px" height="45px"/>
                : 
                <Display src="/avatar.jpg" width="45px" height="45px" alt=""/>}
            <TweetContent>
                <Emp style={{display : "inline"}}>
                {props.item.name}
                {
                props.item.isverified ?
                <img src="/verifiedIcon.png" width="20px" alt="" style={{
                position : "relative", 
                left : "4px", 
                top : "4px"}}/>
                : null}
                </Emp>
                <Sub style={{display : "inline", marginLeft : "6px"}}>
                    @{props.item.username + ' · ' + getTimeDif(props.item.sent_time)}
                </Sub>
                <Std
                onClick={e=>{window.location=`/tweet/${props.item.id}`}}
                    style={{cursor : "pointer"}}>
                    {
                    props.item.content ?
                    props.item.content.split(' ').map((text, ix)=>{
                    if(text[0]==='@') return <A href={`/profile/${text.substring(1, text.length)} `}>{text}</A>
                    if(text[0]==='#') return <A href={`/trends/${text.substring(1, text.length)}`}>{text + " "}</A>
                    return text + ' ';
                    })
                    : null
                    }
                </Std>
                </TweetContent>  
            </Tweet>
            <Tweet style={{border : "none", marginLeft : "5px", width : "98%"}}>
                    <MakeTweet
                    displaySize="45px"
                    tweetbtn="Reply"
                    id={props.item.id}
                    user_to = {props.item.username}
                    />
            </Tweet>
        </Container>
    )
}

export default Reply;