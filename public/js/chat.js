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
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options 
const { userName , room } =  Qs.parse(location.search,{ignoreQueryPrefix: true})


//////////////////////auto scroll /////////////////////////////////////////////

const autoscroll = () => {
  //New message element 
  const $newMessage = $messages.lastElementChild
  //margin height
  //we are are getting margin each time as hardcoding is not a good option
  const newMessageMargin = parseInt(getComputedStyle($newMessage).marginBottom)
  //height of the last message
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin//height + margin 

  //visible.height
  const visibleHeight = $messages.offsetHeight 

  //height of messages container
  const containerHeight = $messages.scrollHeight

  //How far i have scrolled
  const scrollOffset = $messages.scrollTop + visibleHeight
  
  //we are taking account just before new msg added thats why we are subtracting this
  if(containerHeight - newMessageHeight <= 1.1*scrollOffset){
      $messages.scrollTop = $messages.scrollHeight 
  }
}


///////// Message Rendering by mustache /////////////////////////////////////////////

socket.on('message',(message) => {
    
    //setting ids for me others, and , 'Admin'
    idName = 'other'
    
    if(message.userName === userName)
        idName= "me"
    else if(message.userName === 'Admin')
        idName = "Admin"     

    const html = Mustache.render(messageTemplate,{
        userName:message.userName,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a'),
        idName
    })
    
    $messages.insertAdjacentHTML('beforeend',html) // new message just at bottom
        
    autoscroll()
})

////////////// room DATA sidebar rendering /////////////////////////////////////
socket.on('roomData',({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    }) 
    document.querySelector('#sidebar').innerHTML = html    
})


//////////// join ///////////////////////////////////////////////////////////////

socket.emit('join',{ userName , room },(error) => {
   if(error)
   {
       alert(error)
       location.href = '/'
   }
})


//////////////////////////////////// FORM MANIPULATION ////////////////////////////

$messageForm.addEventListener('submit',(e) => {
    e.preventDefault() //prevent from relaoding
    
    //disabling button
    $messageFormButton.setAttribute('disabled','disabled')
    
    const message = e.target.elements.message.value //targeting form value whose name is message
    
    const mainMsgDiv = document.querySelector('.emojionearea-editor')
    console.log(mainMsgDiv.innerText)
    
    mainMsgDiv.innerText = "" 
    mainMsgDiv.setAttribute('tabindex',0)
    mainMsgDiv.focus();

    socket.emit('sendMessage', message , (error) => {
        //enabling button
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''        
        //$messageFormInput.focus()
        if(error){
            return console.log(error);
        }
        console.log('Message Dilevered')
    })
 
})
