import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import ChatBox from "../components/ChatBox";
import MyChats from "../components/MyChats";
import { Box } from "@chakra-ui/react";

function Chatpage() {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return <div style={{width:"100%"}}>
    {user && <SideDrawer/>}
    <Box
        display='flex'
        justifyContent='space-between'
        width='100%'
        height='91.5vh'
        padding='10px'
    >
         {user && <MyChats fetchAgain={fetchAgain}/>}
         {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
    </Box>
  </div>
}

export default Chatpage;
