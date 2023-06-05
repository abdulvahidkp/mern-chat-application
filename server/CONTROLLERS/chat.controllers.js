const asyncHandler = require("express-async-handler");
const Chats = require("../MODELS/chats.model");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error("UserId not sent with request");
  }

  let isChat = await Chats.findOne({
    isGroupChat: false,
    users: { $all: [req.user._id, userId] },
  })
    .populate("users", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "name pic email",
      },
    });
  //    NEW METHOD WHICH I DON'T KNOW!
  //
  //   isChat = await Users.populate(isChat, {
  //     path: "latestMessage.sender",
  //     select: "name pic email",
  //   });

  if (isChat) return res.status(200).json(isChat);

  let chatData = {
    chatName: "sender",
    isGroupChat: false,
    users: [req.user._id, userId],
  };

  try {
    const createdChat = await Chats.create(chatData);

    const fullChat = await Chats.findOne({ _id: createdChat._id }).populate("users", "-password");
    res.status(200).json(fullChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  let chats = await Chats.find({ users: req.user._id })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate({
      path: "latestMessage",
      populate: {
        path: "sender",
        select: "name pic email",
      },
    })
    .sort({ updatedAt: -1 });
  console.log("🚀 ~ file: chat.controllers.js:53 ~ fetchChats ~ chats:", chats);
  res.status(200).json(chats);
});

const creatGroupChat = asyncHandler(async (req, res) => {
  let { chatName, users } = req.body;
  console.log("🚀 ~ file: chat.controllers.js:68 ~ creatGroupChat ~ users:", users);
  if (!chatName || !users) {
    res.status(400);
    throw new Error("Please Fill all the fields");
  }

  if (users.length < 2) {
    res.status(400);
    throw new Error("More than two users required to form a group chat");
  }
  users.push(req.user);
  let groupChat = await Chats.create({ chatName, users, isGroupChat: true, groupAdmin: req.user._id });
  groupChat = await Chats.findOne({ _id: groupChat._id })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  res.status(201).json(groupChat);
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  if (!chatId || !chatName) {
    res.status(400);
    throw new Error("Please send all fields");
  }

  const updatedGroup = await Chats.findByIdAndUpdate(chatId, { chatName }, { new: true })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedGroup) {
    res.status(404);
    throw new Error("Chat not Found");
  } else {
    res.status(200).json(updatedGroup);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  if (!chatId || !userId) {
    res.status(400);
    throw new Error("Please send all fields");
  }

  const added = await Chats.findByIdAndUpdate(
    chatId,
    {
      $addToSet: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat not Found");
  } else {
    res.status(200).json(added);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  if (!chatId || !userId) {
    res.status(400);
    throw new Error("Please send all fields");
  }

  const removed = await Chats.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat not Found");
  } else {
    res.status(200).json(removed);
  }
});

module.exports = { accessChat, fetchChats, creatGroupChat, renameGroup, addToGroup, removeFromGroup };
