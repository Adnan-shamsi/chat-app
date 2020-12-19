const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io') 


const app = express()                //new express application
const server = http.createServer(app) //w make server just to pass is to socket.io   
const port = process.env.PORT || 3000 
const io = socketio(server)

const  publicDirectoryPath = path.join(__dirname , '../public')

app.use(express.static(publicDirectoryPath))

let count = 0

io.on('connection',(socket) => {
    console.log('New connection')
    
    socket.emit('message',"Welcome!")
    socket.broadcast.emit('message','A new user has joined!') //send to all except that user
    
    socket.on('sendMessage',(message)=>{
        console.log(message)
        io.emit('message',message) //emit to all
    })
    socket.on('disconnect',()=>{
        io.emit('message','A user has left')
    })
})

server.listen(port, () =>{
     console.log(`server is running on port ${port}`)
 })