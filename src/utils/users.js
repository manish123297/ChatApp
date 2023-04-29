// addUser,removeUser,getUser,getUsersInRoom
const users=[]

const addUser = ({ id, username, room }) => {
  //this function is going to return the array of user
  //cleaning the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  //validate the data
  if (!username || !room) {
    return { error: "Room and Username is required!" };
  }
  //check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });
  //validate username
  if (existingUser) {
    return { error: "Username is in use" };
  }
  // Store User
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  //returns the removed user whose id we will provide
  const index = users.findIndex((user) => {
    return user.id === id;
  });

  if (index != -1) {
    return users.splice(index, 1)[0];
  }
};
const getUser = (id) => {
  const user = users.find((user) => {
    return user.id === id;
  });

  if (user) {
    return user;
  }
};

const getUsersInRoom=(room)=>{
     room=room.trim().toLowerCase()
 return users.filter((user)=>user.room===room)
}
module.exports={addUser,removeUser,getUser,getUsersInRoom}
