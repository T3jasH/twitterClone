import styled from 'styled-components';
import {useEffect, useState} from 'react';
import axios from 'axios';

const SearchContainer = styled.div`
    width : 100%;
    font-family : Roboto, Helvetica, Arial, sans-serif;
    font-size : 16px;
`
const SearchBar = styled.textarea`
    outline : none;
    resize : none;
    width : 66%;
    margin : 15px 15% 0px 15%;
    padding : 8px 1% 2px 1%;
    border-radius : 15px;
    height : 25px;
    font-family : inherit;
    font-size : inherit;
    background : #5c5a5a;
    border : 1px solid #5c5a5a; 
    color : rgba(255, 255, 255, 0.9);
    : focus {
        border : 2px solid #1FB9EC;
    }
    :: placeholder {
        color : rgba(255, 255, 255, 0.5);
      
    }
`
const DropDown = styled.div`
    margin : 0 16% 15px 16%;
    min-height : 65px;
    max-height : 260px;
    overflow-y : auto;
    overflow-x : hidden;
    width : 67%;
    background : #181c1a;
    display : flex;
    flex-direction : column;
    box-shadow : 1px 1px 6px rgba(255, 255, 255, 0.5);
    position : absolute;
    z-index : 3; 
`
const FinalResults = styled.div`
    width : 100%;
    position : absolute;
    top : 15vh;
    max-height : 75vh;
    overflow-y : auto;
    overflow-x : hidden;
    display : flex;
    flex-direction : column;
    z-index : 1;
`
const Img = styled.img``;
const Span = styled.span``;
const P = styled.p``;
const Bio = styled.p``;
const Profile = styled.a`
    height : auto;
    width : 100%;
    border-bottom : 1px solid rgba(255, 255, 255, 0.3);
    z-index : inherit;
    border-top : 1px solid rgba(255, 255, 255, 0.3);
    text-decoration : none;
    color : inherit;
    padding-bottom : 8px;
    ${Img}{
        position : relative;
        left : 5px;
        top : 10px;
        z-index : inherit;
    }
    ${Span}{
        position : relative;
        left : 18px;
        bottom : 20px;
        font-weight : bold;
        z-index : inherit;
    }
    ${P}{
        font-size : 15px;
        color : rgba(255, 255, 255, 0.65);
        position : relative;
        bottom : 15px;
        z-index : inherit;
        left : 65px;
    }
    ${Bio}{
        position : relative;
        font-size : 16px;
        left : 74px;
        width : 85%;
        z-index : inherit;
        font-size : 17px;
        color : rgba(255, 255, 255, 0.8);
    }
`

const Search = () =>{
    const [getDropDown, setDropDown] = useState(false);
    const [searchResults, setResults] = useState([]);
    const [displayResults, setDisplayResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const onChange = (e) =>{
        if(!getDropDown) setDropDown(true)
        const name = e.target.value.toLowerCase().trim();
        if(!name) {
            setResults([]);
            e.target.value=null;
            return;
        }
        getResults(name);
    }
    const getResults = (name) =>{
        axios.post('/api/search', {name : name})
        .then(res => {
            setResults(res.data)
        })
        .catch(err => console.log(err))
    }
    const onSubmit = (e) =>{
        if(e.code==="Enter") {
            setDisplayResults(searchResults);
            setShowResults(true);
            document.getElementById("searchBar").blur=true;
            document.getElementById("searchBar").focus = false;
            document.getElementById("searchBar").value=null;
            setDropDown(false)
            return;
        }
    }
    
    return(
        <SearchContainer
        onKeyDown={key => {
            console.log(key.code)
            if(key.code === "Escape") {
                setDropDown(false);
            }
        }}
        >
            <SearchBar
            onClick={()=> setDropDown(true)}
            id="searchBar"
            placeholder="Search Twitter"
            onChange={onChange}
            onKeyDown={onSubmit}
            maxLength="20"
            >
            </SearchBar>
            {
                getDropDown ? 
                <DropDown>
                    {
                        searchResults?
                        searchResults.map((profile, cnt) =>{
                            if(cnt>7) return null;
                            return(
                            <Profile href={`/profile/${profile.username}`}>
                                {
                                profile.display_pic?
                                <Img src={`/display/${profile.display_pic}`} alt=""  
                                width="45px" height="45px" style={{borderRadius : "45px"}}
                                />
                                :
                                <Img src="avatar.jpg" alt=""
                                width="45px" height="45px" style={{borderRadius : "45px"}}
                                />
                                }
                                <Span>
                                    {profile.name}
                                </Span>
                                {
                                    profile.isVerified ?
                                    <img src="verifiedIcon.png" width="20px" height="20px"
                                style={{
                                    position : "relative",
                                    left : "22px",
                                    bottom : "15px"
                                }} alt=""/> 
                                :
                                null
                                }
                                <P>
                                    {`@${profile.username}`}
                                </P>
                                
                            </Profile>
                            );
                        })
                        : null
                    }
                </DropDown>
                :
                null
            }
        <FinalResults>
        {
            showResults&&displayResults? 
            displayResults.map(profile =>{
                return(
                    <Profile href={`/profile/${profile.username}`}> 
                        { profile.display_pic ?
                        <Img src={`/display/${profile.display_pic}`} height="55px" width="55px" 
                                style={{borderRadius : "55px", top : "15px"}}
                                />
                        :
                        <Img src="avatar.jpg"
                        height="55px" width="55px" style={{borderRadius : "55px", top : "15px"}}
                        />
                        }
                                <Span>{profile.name}</Span>
                                {
                                    profile.isVerified ?
                                    <img src="verifiedIcon.png" width="20px" height="20px"
                                style={{
                                    position : "relative",
                                    left : "22px",
                                    bottom : "15px"
                                }} alt=""/> 
                                :
                                null
                                }
                                <P
                                style={{left : "70px"}}
                                >
                                    {`@${profile.username}`}
                                </P>
                                <Bio>{profile.about}</Bio>
                    </Profile>
                )
            })
            :
            null
        }
        </FinalResults>
        </SearchContainer>
    )
}

export default Search;