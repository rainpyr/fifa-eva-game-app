import { useEffect, useState } from "react";
import axios from 'axios';



function Profile (){

    const [displayProfile, setDisplayProfile] = useState(false);
    const [profile, setProfile] = useState({});

    useEffect(() => {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + sessionStorage.getItem('jwtToken')
              }
        }
        axios.get('http://localhost:3000/users/profile', config).then((res) => {
            console.log(res.data);
            
    })
    }) 


    return(
        <div>
            profile page
        </div>
    )
}

export default Profile;