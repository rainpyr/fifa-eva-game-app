import {useState, useEffect} from 'react';
import {useParams, useNavigate, Link} from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const formatDate = function(time) {
    return moment(time).format('Do MMM YYYY, HH:MM')
}

function GameStats(){

    const params = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState( true );
    const [error, setError] = useState( null );
    const [results, setResults] = useState( [] );

    useEffect( () => {
        fetchScores();
    }, [] ); 

    async function fetchScores(){

        try{
    
            setLoading(true);
            
            const res = await axios.get(`http://localhost:3000/games/${params.ownteam}/${params.opponentteam}`);
            console.log('data', res.data);
            setLoading(false);
            setResults(res.data);
            
      
          } catch(err){
            console.error('error loading results', err);
            setLoading(false);
            setError(err);
      
          }          
      }
    
      if(error){
        return <p>Error loading from API</p>
      }

    return(
        <div id="gameStats">

            <h3>Game stats between {params.ownteam} and {params.opponentteam}</h3>
            <Link to={`/game/${params.ownteam}/${params.opponentteam}`}>
            <div>
                <button id="backToGame">back to Game</button>
            </div>
            </Link>
            <Link to="/">
            <div>
                <button id="backToHome">back to HOME</button>
            </div>
            </Link>
            
                <table id="statsTable">
                    
                        <th>Own Team</th>
                        <th>Opponent Team</th>
                        <th>Own Score</th>
                        <th>Opponent Score</th>
                        <th>Game Time</th>
                    
                    {results.map(r => 
                    <tr>
                        <td>{r.self_team}</td>
                        <td>{r.opponent_team}</td>
                        <td>{r.self_score}</td>
                        <td>{r.opponent_score}</td>
                        <td>{formatDate(r.created_at)}</td>
                    </tr>
                    )}
                </table>
                
                
            
        </div>
        
    )




} // GameStats

export default GameStats;