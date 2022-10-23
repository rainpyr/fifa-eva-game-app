import React, { useEffect } from 'react';
import {useState} from 'react';
import '../App.css';
import {useNavigate, Link} from 'react-router-dom';

import PlayGame from './PlayGame'
import axios from 'axios';




function HomePage(){
    const navigate = useNavigate();
    // const navigateToGame = () => {
    //     // navigate to /game
    //     navigate('/game');
    //   };
    
    //   const navigateHome = () => {
    //     // navigate to /
    //     navigate('/');
    //   };
    const [ownTeam, setOwnTeam] = useState('');
    const [opponentTeam, setOpponentTeam] = useState('');
    const [signedIn, setSignedIn] = useState(false);
    

    
   function userSignIn () {

       axios.post('http://localhost:3000/login', {email: 'eva@ga.co', password: 'chicken'}).then((res) => {
        setSignedIn(true);
        sessionStorage.setItem('jwtToken', res.data.token)   
       } )
   };

   function getProfile(ev) {
    
    ev.preventDefault();
    navigate(`/user/profile`)

   }

    function startGame(ev){
        ev.preventDefault();
        navigate(`/game/${ownTeam}/${opponentTeam}`)
    };

    function handleOwnTeamSelection(ev){
        // console.log('ownteam', ev.target.value);
        setOwnTeam(ev.target.value);
        
        
    };

    function handleOpponentTeamSelection(ev){
        // console.log('opponentteam', ev.target.value);
        setOpponentTeam(ev.target.value)
        
    };
    
    

    return (
        
        
        <div id ="startScreen">
            <div id="title">FIVA 2022</div>
            <div id='signin'>
                
                {signedIn? <button onClick={getProfile}>profile</button> : <button onClick={userSignIn}>sign in</button>}

            </div>
            <div id="selectTeam">
                Top Seeds Teams
                <div id="ulLeft">
                    <ul id="left">
                        <li value="1"> <img src="/img/qat.jpg"/> Qatar </li>
                        <li value="2"> <img src="/img/bra.jpg"/> Brazil</li>
                        <li value='3'> <img src="/img/bel.jpg"/> Belgium</li>
                        <li value='4'> <img src="/img/fra.jpg"/> France</li>
                        
                    
                        <li value='5'> <img src="/img/arg.jpg"/> Argentina</li>
                        <li value='6'> <img src="/img/eng.jpg"/> England</li>
                        <li value='7'> <img src="/img/esp.jpg"/> Spain</li>
                        <li value='8'> <img src="/img/por.jpg"/> Portugal</li>
                    </ul>
                </div>
                <div id="selections">
                <label >Select Your Team</label>
                <select onChange={handleOwnTeamSelection} id="ownTeam">
                    <option disabled selected value> -- select an option -- </option>
                    <option value="Qatar">Qatar</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Belgium">Belgium</option>
                    <option value="France">France</option>
                    <option value="Argentina">Argentina</option>
                    <option value="England">England</option>
                    <option value="Spain">Spain</option>
                    <option value="Portugal">Portugal</option>
                    

                </select>
                <label>Select Your Opponent</label>
                <select onChange={handleOpponentTeamSelection} id="opponentTeam">
                    <option disabled selected value> -- select an option -- </option>
                    <option value="Qatar">Qatar</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Belgium">Belgium</option>
                    <option value="France">France</option>
                    <option value="Argentina">Argentina</option>
                    <option value="England">England</option>
                    <option value="Spain">Spain</option>
                    <option value="Portugal">Portugal</option>
                    

                </select>
            </div>
            </div>
            
            <button id="play" onClick={startGame} disabled={!ownTeam || !opponentTeam || ownTeam == opponentTeam}>PLAY</button>
            {(!ownTeam || !opponentTeam) &&
            <div id="alertMessage"><em>Please make your team selections</em></div>
            }
            {ownTeam == opponentTeam && 
            <div id="errorMessage" ><em>You can't compete with yourself</em></div>
            }
            <br/><br/>
            <img src="/img/help.png" height="100" width="150" id="help"/>
            <br/>
            <span id ="instructions">(Use left and right arrow keys to play)</span>
            
        </div>
          
    ); // return

} // HomePage

export default HomePage;