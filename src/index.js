const express = require("express");
const path = require("path");
const http = require("http");
var Filter = require('bad-words')
const {generateMessage,generateLocationMessage}=require('./utils/messages')
const{addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users')
const app = express();
const port = 3000;
const server = http.createServer(app); 
const socketio = require("socket.io");
const io = socketio(server); 

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));
io.on("connection", (socket) => {
 
  console.log("new websocket connection");
  // socket.emit("sendMessage", generateMessage("Welcome to chat App"));
  // ------------Broadcasting event whenever new user will join------------------------------------
  // socket.broadcast.emit("sendMessage", generateMessage("New User has Joined"));
  //----------------------------------------------------------------------------------------------
  // 88888888888888888888888888[Setting up chat room]88888888888888888888888888888888
  socket.on('join',({username,room},callback)=>{
    const {error,user}=addUser({id:socket.id,username,room})
     if(error){
      return callback(error)
     }
    socket.join(user.room)
    //io.to.emit()->emit event to all the users of the particular room
    //socket.broadcast.to.emit()->it also same as socket.broadcast.emit() but it will emit
    // to a all the user(except who emitted) of the particular chat room
  socket.emit("sendMessage", generateMessage("ChatApp-System","Welcome to chat App.."));
  socket.broadcast.to(user.room).emit("sendMessage", generateMessage("ChatApp-System",`${user.username} has joined..`));
// 999999999999999999[Displaying User list data]99999999
io.to(user.room).emit('roomData',{room:user.room,users:getUsersInRoom(user.room)})
//99999999999999999999999999999999999999999999999999999
callback()

  })
  //888888888888888888888888888888888888888888888888888888888888888888888888888888888
  // ----------------------------Using event disconnect when a user leaves/connection closes-------
  socket.on("disconnect", ()=>{
    const user= removeUser(socket.id)

    if(user){
      io.to(user.room).emit('sendMessage',generateMessage("ChatApp-System",`${user.username} has left!`))
      io.to(user.room).emit('roomData',{
        room:user.room,
        users:getUsersInRoom(user.room)

      })
    }
    
    // io.emit('sendMessage',generateMessage("A user has left"))
  });

  //----------------------------------------------------------------------------------------------
  //============================location sharing to everyone================================
socket.on("sendLocation",(position)=>{
  const user=getUser(socket.id)
    io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${position.longitude},${position.latitude}`) )
})

 //=======================================================================================
// 0000000000000000000[Filtering Bad Words from the client message]00000000000000000000000
  socket.on("sendMessage", (message,callback) => {
    const user=getUser(socket.id)

   const filter = new Filter();
     if(filter.isProfane(message)){
      //means if message contains any profane word run this if block
      return callback('profanity is not allowed')

     }
    io.to(user.room).emit("sendMessage", generateMessage(user.username,message));
    callback()//if there is no bad words in the message we don't want to send anything to the 
    // client as confirmation message as client will know by the arrow function passed in 
    // socket.emit() in chat.js(sending message section)
  });
  // 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
});


server.listen(port, () => {
  console.log("App is runnig on port " + port);
});
