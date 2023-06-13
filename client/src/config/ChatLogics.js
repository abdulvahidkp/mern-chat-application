export const getSenderName = (loggedUser, users) =>
  users[0]._id === loggedUser?._id ? users[1]?.name : users[0]?.name;

export const getSender = (loggedUser, users) => (users[0]?._id === loggedUser?._id ? users[1] : users[0]);

export const isSameSender = (messages, msg, index, userId) => {
  return (
    (messages[index + 1]?.sender._id !== msg.sender._id || messages[index + 1]?.sender._id === undefined) &&
    messages[index].sender._id !== userId
  );
};

// export const isLastMessage = (messages, index, userId) => {

//     return (
//         index === messages.length - 1 &&
//         messages[messages.length - 1].sender._id !== userId &&
//         messages[messages.length - 1].sender._id
//     )
// }


export const isSameSenderMargin = (messages, index) => {
  return (
    messages[index-1]?.sender._id === messages[index]?.sender._id
  )
}