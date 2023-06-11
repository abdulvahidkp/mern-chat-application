import {
  Box,
  Button,
  FormControl,
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
import axios from "../../axios/axios";
import UserListItem from "../UserAvatar/UserListItem";
import useDebounce from "../../hooks/useDebounce";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

function GroupChatModal({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [chatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearchValue = useDebounce(search, 1000);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

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

  useEffect(() => {
    handleSearch();
  }, [debouncedSearchValue]);

  const handleGroup = (userToAdd) => {
    if (selectedUsers.length && selectedUsers.some((user) => user._id === userToAdd._id)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (delUserId) => setSelectedUsers((prev) => prev.filter((per) => per._id !== delUserId));

  const handleSubmit = async () => {
    if (!chatName || selectedUsers.length < 2) {
      let description = 'give a group name'
      if(chatName && selectedUsers.length<2) description = 'more than two users required to form a group'
      toast({
        title: "Please fill all the Fields",
        description,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat/group", { chatName, users: selectedUsers }, config);
      setChats([data, ...chats]);
      onClose()
      setGroupChatName('')
      setSelectedUsers([])
      setSearch('')
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    } catch (error) {
      toast({
        title: "Failed to create chat",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" fontFamily="Work sans" display="flex" justifyContent="center">
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                value={chatName}
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: Abdul, Niyas"
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
            <Box display="flex" flexWrap="wrap" width="100%">
              {selectedUsers?.map((user) => (
                <UserBadgeItem key={user._id} user={user} handleFunction={() => handleDelete(user._id)} />
              ))}
            </Box>
            {loading ? (
              <div>Loading..</div>
            ) : searchResult.length ? (
              searchResult
                ?.slice(0, 4)
                .map((user) => <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />)
            ) : (
              search && <div>No Result Found</div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupChatModal;
