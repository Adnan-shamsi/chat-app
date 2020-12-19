//since we have already added socket js in index.html
//now we can use io that is in socket.io.js
const  socket = io()        

//DOM Elements
const $messageForm = document.querySelector('#message-form')   
const $messageFormInput  = $messageForm.querySelector('input')
const $messageFormButton  = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML

//Options 
const { userName , room } =  Qs.parse(location.search,{ignoreQueryPrefix: true})


socket.on('message',(message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        userName:message.userName,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html) // new message just at bottom
})

document.querySelector('#message-form').addEventListener('submit',(e) => {
    e.preventDefault() //prevent from relaoding
    
    //disabling button
    $messageFormButton.setAttribute('disabled','disabled')
    
    const message = e.target.elements.message.value //targeting form value whose name is message

    socket.emit('sendMessage', message , (error) => {
        //enabling button
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''        
        $messageFormInput.focus()
        if(error){
            return console.log(error);
        }
        console.log('Message Dilevered')
    })
 
})

socket.emit('join',{ userName , room },(error) => {
   if(error)
   {
       alert(error)
       location.href = '/'
   }
})