import React from 'react';
import {useState} from 'react';
import '../App.css';
import {useNavigate, Link} from 'react-router-dom';
import qatar from '../img/qat.jpg';
import brazil from '../img/bra.jpg';
import england from '../img/eng.jpg';
import spain from '../img/esp.jpg';
import portugal from '../img/por.jpg';
import argentina from '../img/arg.jpg';
import france from '../img/fra.jpg';
import belgium from '../img/bel.jpg';
import help from '../img/help.png';
import PlayGame from './PlayGame'

function HomePage(){
    const navigate = useNavigate();
    const navigateToGame = () => {
        // navigate to /game
        navigate('/game');
      };
    
      const navigateHome = () => {
        // navigate to /
        navigate('/');
      };
    const [ownTeam, setOwnTeam] = useState('');
    const [opponentTeam, setOpponentTeam] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    function startGame(ev){
        ev.preventDefault();
        navigate(`/game/${ownTeam}/${opponentTeam}`)
    };

    function handleOwnTeamSelection(ev){
        console.log('ownteam', ev.target.value);
        setOwnTeam(ev.target.value);
        
        
    };

    function handleOpponentTeamSelection(ev){
        console.log('opponentteam', ev.target.value);
        setOpponentTeam(ev.target.value)
        
    };
    

    return (
    
 
        

        <div id ="startScreen">
            <div id="title">FIVA 2022</div>
            <div id="selectTeam">
                Top Seeds Teams
                <div id="ulLeft">
                    <ul id="left">
                        <li value="1"> <img src={qatar}/> Qatar </li>
                        <li value="2"> <img src={brazil}/> Brazil</li>
                        <li value='3'> <img src={belgium}/> Belgium</li>
                        <li value='4'> <img src={france}/> France</li>
                        
                    
                        <li value='5'> <img src={argentina}/> Argentina</li>
                        <li value='6'> <img src={england}/> England</li>
                        <li value='7'> <img src={spain}/> Spain</li>
                        <li value='8'> <img src={portugal}/> Portugal</li>
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
            <div id="alertMessage"><em>Please make your team selections</em></div>
            <br/><br/>
            <img src={help} height="100" width="150" id="help"/>
            <br/>
            <span id ="instructions">(Use left and right arrow keys to play)</span>
            
        </div>
        
          
        
    




    ); // return



} // HomePage

export default HomePage;