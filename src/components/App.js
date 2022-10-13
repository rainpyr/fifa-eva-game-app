import React from 'react';
import {useState} from 'react';
import '../App.css';
import {Routes, HashRouter as Router, Route, Link} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import PlayGame from './PlayGame';
import HomePage from './HomePage';
import GameStats from './GameStats';

function App(){
   

    return (
    <div id = "container">
 
        <Router>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/game/:ownteam/:opponentteam" element={ <PlayGame/> } /> 
            <Route path="/stats/:ownteam/:opponentteam" element={ <GameStats/> } />               
          </Routes>
            <div id='footer'>
                <footer>
                {/* <hr/> */}
                &copy; FIFA x Eva Productions 2022 
                </footer>
            </div>
        </Router>
        
    </div>

    ); // return

} // App

export default App;