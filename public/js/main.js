const chatForm = document.getElementById('chat-form')
const chatmessage = document.querySelector('.chat-messages');
const Roomname = document.getElementById('room-name');
const Roomname1 = document.getElementById('room-name1');
const userList = document.getElementById('users');
const socket = io();

const {username,room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
});


socket.on('message',message =>{
    console.log(message);
    outputMsg(message);

    //scroll down
    chatmessage.scrollTop = chatmessage.scrollHeight;
})

socket.emit('joinRoom',{username,room});

//message submit 
chatForm.addEventListener('submit', (e) => {
    //prevent from submit to file
    e.preventDefault();
    
    const msg = e.target.elements.msg.value;

    //emiting message to server
    socket.emit('chatmsg',msg)

    //clear the input after sending message
    e.target.elements.msg.value ='';
    e.target.elements.msg.value.focus();
})

//Get Room and its users
socket.on('roomUsers',({room,users}) =>{
    outputRooms(room);
    outputUsers(users);
})

//display revicieved message
function outputMsg(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML =`<p class="meta">${message.username}    <span>${message.time}</span></p>
                    <p class="text">${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

function outputRooms(room){
    Roomname.innerText = room;
    Roomname1.innerText = room;
}

function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
  }