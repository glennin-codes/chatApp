
const io=require("socket.io")(8800,{
    cors:{
        origin:"http://locolhost:3000",
    }
}
)
let activeUsers=[];
io.on("connection",(socket)=>{
    //add new user
    socket.on("new-user-add",(newUserID)=>{
        //if user is not added previously
        if(!activeUsers.some((user)=>user.userId===newUserID)){
            activeUsers.push({userId:newUserID,socketId:socket.id});
            console.log("New User Connected",activeUsers);
            
        } 
         // send all active users to new user
         io.emit("get-users", activeUsers);
    })
    socket.on("disconnect",()=>{
        //remove user from active user
        activeUsers=activeUsers.filter((user)=>user.socketId!==socket.id);
        console.log("User Disconnecte",activeUsers);
        // send all active users to all users
    io.emit("get-users", activeUsers);
    })
  // send message to a specific user
  socket.on("send-message",(data)=>{
    const {receiverId}=data;
    const user=activeUsers.find((user)=>user.userId===receiverId)
    console.log("Data: ",data);
    if (user){
        io.to(user.socketId).emit("receive-message",data)
    }
  })
})