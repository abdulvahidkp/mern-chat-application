const asyncHandler = require("express-async-handler");
const Messages = require("../MODELS/messages.modal");
const Chats = require("../MODELS/chats.model");

const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, content } = req.body;
  if (!chatId || !content) {
    res.status(400);
    throw new Error("chatId or content is missing");
  }

  let newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    let message = await Messages.create(newMessage);

    message = await message.populate("sender", "name pic email");
    message = await message.populate({ path: "chat", populate: { path: "users", select: "name pic email" } });

    await Chats.findByIdAndUpdate(chatId, { latestMessage: message._id });
    res.status(201).json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.mesage);
  }
});

const allMessages = asyncHandler(async (req,res) => {
    const {chatId} = req.params
    try {
        const messages = await Messages.find({chat:chatId}).populate('sender','name pic email').populate('chat')
        res.status(200).json(messages)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

module.exports = { sendMessage, allMessages };