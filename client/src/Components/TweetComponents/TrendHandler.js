import TweetsList from '../TweetComponents/TweetsList'
import styled from 'styled-components'
import {Button, ReturnTop, InnerContainer, Emp} from '../TweetComponents/TweetHandler'

const Container = styled.div`
    width : 100%;

`

const TrendHandler = (props) =>{
    return(
        <Container>
            <ReturnTop
            id="return-top"
            >
                <Button
                onClick={e=>{document.getElementById("scrollDiv").scrollTo(0, 0)}}
                >
                Trends
                </Button>
            </ReturnTop>
            <InnerContainer>
            <TweetsList
            type="trends"
            hashtag={props.match.params.hashtag}
            />
            </InnerContainer>
        </Container>
    )
}

export default TrendHandler;