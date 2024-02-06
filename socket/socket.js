import { io } from "../index.js";
import { updateUserVotes } from "../features/poll/pollRespository.js";

const liveRooms = new Set();

export const handleSocketConnection = (socket) => {
  console.log("User connected");

  socket.on("createRoom", (roomId) => {
    socket.join(roomId);
    console.log(`Room created: ${roomId}`);
  });

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("createPoll", (data) => {
    liveRooms.add(data.roomId);
    const questions = data.questions?.map(({ question, options }) => ({
      question,
      options,
    }));
    io.to(data.roomId).emit("sendPoll", questions);
  });

  socket.on("userAnswer", async (userAnswer, roomId) => {
    if (liveRooms.has(roomId)) {
      try {
        await updateUserVotes(roomId, userAnswer);
        io.to(roomId).emit("updatedWithUserAns", { reload: true });
        socket.emit("thankYou", "Thank you for your response");
        socket.leave(roomId);
      } catch (err) {
        console.error("Error updating user votes:", err.message);
      }
    } else {
      console.log(`Room ${roomId} is not live. Ignoring user answer.`);
    }
  });

  socket.on("closeRoom", (roomId) => {
    io.to(roomId).emit(
      "closingRoom",
      "Presenter has stopped polling. You cannot respond anymore."
    );
    liveRooms.delete(roomId);
    console.log(`Room ${roomId} closed and removed from live rooms.`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
};
