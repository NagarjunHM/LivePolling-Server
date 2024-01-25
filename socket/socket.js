import { io } from "../index.js";

export const handleSocketConnection = (socket) => {
  console.log("user connected");

  let allQuestion = [];

  socket.on("createRoom", (roomId) => {
    socket.join(roomId);
    console.log(`room created ${roomId}`);
  });

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`user joined a ${room}`);
  });

  socket.on("createPoll", (data) => {
    // broadcast to all connected clients in the room
    allQuestion = data.questions;
    io.to(data.room).emit("sendPoll", data.questions);
  });

  socket.on("userAnswer", (question, userAnswer, roomId) => {
    userAnswer.forEach((poll) => {
      if (
        question[poll.pollIndex] &&
        Array.isArray(question[poll.pollIndex].usersAnswer)
      ) {
        question[poll.pollIndex].usersAnswer.push(poll.optionIndex);
      }
    });

    console.log(question);
    // Now, question contains updated usersAnswer arrays
    // You can emit this updated question to the room or perform further actions

    // For example, emitting the updated question to the room
    io.to(roomId).emit("votedPoll", question);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
};
