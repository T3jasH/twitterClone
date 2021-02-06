import styled from 'styled-components'
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import TweetsList from '../TweetComponents/TweetsList';
import MakeTweet from '../TweetComponents/MakeTweet'

const Container = styled.div`
    width : 100%;
`
const Button = styled.button``;
const Body = styled.div`
    width : 98.5%;
    display : flex;
    flex-direction : column;
    position : relative;
    top : 60px;
`;
const ReturnHome = styled.div`
    position : fixed;
    height : 35px;
    width : 37.5vw;
    padding : 1vw 0 1vw 1vw;
    border-bottom : 1px solid rgba(255, 255, 255, 0.3);
    background : black;
    z-index : 3;
    ${Button}{
        outline : none;
        border : none;
        font-size : 20px;
        font-weight : bold;
        font-family :  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        background : inherit;
        color : rgba(255, 255, 255, 0.9);
        cursor : pointer;
    }
`

const Home = props => {
    
    return(
        <Container >
            <ReturnHome
            id="return-top"
            >
                <Button
                onClick={e =>{
                    e.preventDefault();
                    document.getElementById("scrollDiv").scrollTo(0, 0);
                }}
                >
                    Home
                </Button>
            </ReturnHome>
            <Body>
            <MakeTweet
            displaySize = "55px"
            tweetbtn="Tweet"
            id="none"
            />
            <TweetsList
            type="followers"
            />
            </Body>
                
        </Container>
    )
}
Home.propTypes = {
    profile : PropTypes.object.isRequired,
}
const mapStateToProps = (state) => ({
    profile : state.profile
})
export default connect(mapStateToProps, {})(Home);

