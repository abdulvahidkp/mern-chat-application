import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "../../axios/axios";
import useDebounce from "../../hooks/useDebounce";
import UserListItem from "../UserAvatar/UserListItem";

function UpdateGroupChatModal({ fetchAgain, setFetchAgain, fetchMessages }) {
  const [chatName, setChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const debouncedSearchValue = useDebounce(search, 1000);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleRename = async () => {
    if (!chatName) {
      toast({
        title: "Please fill chat Name!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    setRenameLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put("/api/chat/rename", { chatId: selectedChat._id, chatName }, config);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setChatName("");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setRenameLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId) => {
    if (selectedChat.groupAdmin?._id !== user._id && user._id !== userId) {
      toast({
        title: "Only admins can remove someone!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setLoading(true)
    try {
        const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const {data} = await axios.put('/api/chat/groupremove',{chatId:selectedChat._id,userId},config)
          user._id === userId ? setSelectedChat() : setSelectedChat(data)
          setFetchAgain(!fetchAgain)
          fetchMessages() ////////////////////////////////// here it is
    } catch (error) {
        toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
    } finally {
        setLoading(false)
    }
  };

  const handleAddGroup = async (userId) => {
    if (selectedChat?.groupAdmin?._id !== user._id) {
      toast({
        title: "Only admins can add someone!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (selectedChat?.users?.some((per) => per._id === userId)) {
      toast({
        title: "User already exist in this group!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put("/api/chat/groupadd", { chatId: selectedChat._id, userId },config);
      setSelectedChat(data);
      setFetchAgain(!again);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [debouncedSearchValue]);
  return (
    <>
      <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="Work sans" display="flex" justifyContent="center">
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" flexWrap="wrap" width="100">
              {selectedChat?.users?.map((user) => (
                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleRemove(user._id)} />
              ))}
            </Box>
            <FormControl display="flex">
              <Input placeholder="Chat Name" mb={3} value={chatName} onChange={(e) => setChatName(e.target.value)} />
              <Button variant="solid" colorScheme="teal" ml={1} isLoading={renameLoading} onClick={handleRename}>
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users to Group"
                value={search}
                mb={3}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSearchResult([]);
                  if (e.target.value) setLoading(true);
                  else setLoading(false);
                }}
              />
            </FormControl>
            {loading ? (
              <div>Loading..</div>
            ) : searchResult.length ? (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem key={user._id} user={user} handleFunction={() => handleAddGroup(user._id)} />
                ))
            ) : (
              search && <div>No Result Found</div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModal;
