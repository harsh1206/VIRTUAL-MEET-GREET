const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const StartButton = document.getElementById('start');
const QDTU = document.getElementById('DTU')
var questions = ['Tea or Cofee ?','DTU or NSIT ?','Beach or mountain ?','Amogh or Vaibhav','Microsoft or Google'];
const QDiv = document.getElementById('DTU');
var click =0;
// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});


console.log(username);

const socket = io.connect();

// StartButton.addEventListener("click", function () {
//   QDiv.innerHTML = questions[Math.floor(Math.random() * questions.length)];
//   click++;

//   if (click == 1) {
//     window.alert("Leader Has Started the IceBreaking Session !");
//     speechSynthesis.speak(
//       new SpeechSynthesisUtterance("Leader Has Started the IceBreaking Session")
//     );

//   }
// });

    
StartButton.addEventListener("click" ,function(){

  var question = questions[Math.floor(Math.random() * questions.length)];
   console.log(question);
   window.alert('Leader has started the session !')
   socket.emit('start',question);

});

socket.on('Start_Session',question => {
  
  QDTU.innerHTML=question;

});

// Join chatroom
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  console.log(users);

  if(users[0].username!=username)
  {
    StartButton.remove();
  }

  outputRoomName(room);
  outputUsers(users);
});

// Message from server
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;
  
  msg = msg.trim();
  
  if (!msg){
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span> ${message.time} </span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach(user=>{
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
 }

//  function Leader() {
//    var listItems = $("#users li");
//    console.log(listItems);

//    listItems.each(function (index, li) {
//      if (index == 0 && username == $(this).text) {
//        return;
//      } else {
//        StartButton.style.display="none";
//      }
//    });
//  }

//  Leader();