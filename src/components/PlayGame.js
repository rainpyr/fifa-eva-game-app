import React, {useRef, useEffect, useState} from 'react';
import '../App.css';
import {Routes, Router, Route, useNavigate, useParams, Link} from 'react-router-dom';
import HomePage from './App';
import SAT from 'sat';
import game from '../game'




function PlayGame(props){

    const params = useParams();
    

    const canvasRef = useRef(null)
         
    useEffect(() => {
        // init();
        game.init(canvasRef.current, params.ownteam, params.opponentteam)
    }, []);

    function refreshPage() {
        window.location.reload(false);
      }
   
    return(
        <div>
            <div id ="gameOverScreen">
                <div id="title">FIVA 2022</div>
                <button id="playagain" onClick={refreshPage}>PLAY AGAIN</button>
                <Link to="/">
                <button id="backHome">HOME {" "}PAGE</button>
                </Link>
            </div>
            <canvas ref={canvasRef} id="myCanvas" width="480" height="720"></canvas>
            <div id="score">
                <div id = "timer">
                Time Left
                <div id = "countdown">02:00</div>
                </div>
                <h3 id ="opponentName">{params.opponentteam}</h3>
                <div id="opponent">0</div>
                <h3 id ="ownName">{params.ownteam}</h3>
                <div id="own">0</div>
                <div id ="status"></div>
        
            </div>
        </div>
    )


} // PlayGame

export default PlayGame;