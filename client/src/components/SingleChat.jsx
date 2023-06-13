import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSenderName, getSender } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "../axios/axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import io from 'socket.io-client'
var socket,selectedCompare;
let disableTypingIndicator;
import Lottie from 'react-lottie'

import animationData from '../animations/typing.json'

function SingleChat({ fetchAgain, setFetchAgain }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const [isTyping, setIsTyping] = useState(false)
  const [socketConnected, setSocketConnected]  = useState(false)

  const { user, selectedChat, setSelectedChat } = ChatState();


  const defaultOptions = {
    loop:true,
    autoplay:true,
    animationData:animationData,
    rendererSettings:{
      preserveAspectRatio:"xMidYMid slice"
    }
  }

  const toast = useToast();

  useEffect(()=>{
    socket = io(import.meta.env.VITE_ENDPOINT)
    socket.emit('setup',user)
    socket.on('connected',()=>{
      setSocketConnected(true)
    })
    socket.on('typing',()=>setIsTyping(true))
    socket.on('stop typing',()=>setIsTyping(false))
  },[])

  useEffect(()=>{
    socket.on('new message',newMessage => {
      if(!selectedCompare || selectedCompare._id !== newMessage.chat._id) {
        // notification
      } else {
      	setMessages([...messages,newMessage]);
      }
    })
  });


  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      socket.emit('join room',selectedChat._id)
    } catch (error) {
      toast({
        title: "Error occured!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    setNewMessage('')
    if(selectedCompare) socket.emit('leave room',selectedCompare?._id)
    selectedCompare = selectedChat
  }, [selectedChat]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // typing indication
    if(!socketConnected) return;
    clearTimeout(disableTypingIndicator)
    socket.emit('typing',selectedChat._id)

    disableTypingIndicator = setTimeout(()=>{
      socket.emit('stop typing',selectedChat._id)
    },2000)
    
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage && !loading) {
      try {
        const config = {
          headers: {
            "Contect-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        socket.emit('stop typing',selectedChat._id)
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        setMessages([...messages, data]);
        socket.emit('new message',data)
      } catch (error) {
        toast({
          title: "Error occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            width="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center "
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat()}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSenderName(user, selectedChat.users)}
                <ProfileModal user={getSender(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            width="100%"
            height="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner alignSelf="center" margin="auto" size="xl" width="20" height="20" />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} mt={3} isRequired>
              {isTyping && <div>
                  <Lottie 
                    options={defaultOptions}
                    width={70}
                    style={{marginBotton:15, marginLeft:10}}
                   />
                </div>}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a chat to start Chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
