import React, { useEffect, useState } from 'react';
import axios from '../axios/axios';

function Chatpage() {

    const [chat,setChat] = useState([]);
    
    const fetchChat = async () => {
        try {
            const {data} = await axios.get('/api/chat')
            setChat(data);
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(()=>{
        fetchChat();
    },[])

  return (
    <div>
       {
        chat.map(per=>
           <h1 key={per._id}>{per.chatName}</h1>     
        )
       }
    </div>
  )
}

export default Chatpage