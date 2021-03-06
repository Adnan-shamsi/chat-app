const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io') 
const { generateMsg } = require('./utils/messages.js') 
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users.js')

const app = express()                //new express application
const server = http.createServer(app) //we make server just to pass is to socket.io   
const port = process.env.PORT || 3000 
const io = socketio(server)

const  publicDirectoryPath = path.join(__dirname , '../public')

///setting up public directory
app.use(express.static(publicDirectoryPath))
 

//////////////////////// CONNECTION ///////////////////////////////////////////////
io.on('connection',(socket) => {

    console.log('New connection')
    
    //////  join ///////////
    socket.on('join', ({ userName, room }, callback) => {
        
        const { error, user } = addUser({ id: socket.id ,userName, room })
        
        if(error){
            return callback(error)         
        }
        
        //joining room
        socket.join(user.room)

        socket.emit('message',generateMsg('Admin',"Welcome!"))
        socket.broadcast.to(user.room).emit('message',generateMsg("Admin",`${user.userName} has joined!`)) //send to all except that user in that room
        io.to(user.room).emit('roomData',{
            room:user.room,
            users: getUsersInRoom(user.room)
        })
        
        //callback without error means sucessful acknowledgement
        callback() 
    })
    
    ////sending message to others in room //////
    
    socket.on('sendMessage',(message,callback) => {
        const user = getUser(socket.id)
        if(!user){
            callback("no user defined")
        }
        io.to(user.room).emit('message',generateMsg(user.userName,message)) //emit to all
        callback()
    })
    

    ///////// disconnection ///////////// 
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        
        if(user){
            io.to(user.room).emit('message', generateMsg("Admin",`${user.userName} has left`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () =>{
     console.log(`server is running on port ${port}`)
 })