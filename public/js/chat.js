//since we have already added socket js in index.html
//now we can use io that is in socket.io.js
const  socket = io()        
socket.on('message',(message)=>{
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit',(e) => {
    e.preventDefault() //prevent from relaoding
    const message = e.target.elements.message.value //targeting form value whose name is message
    socket.emit('sendMessage', message)
})
