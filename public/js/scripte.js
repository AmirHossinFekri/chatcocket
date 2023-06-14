
const socket=io();

//Query DOM
const massageInput=document.getElementById("massageInput"),
    chatForm=document.getElementById("chatForm"),
    chatbbox=document.getElementById('chat-box'),
    feedback=document.getElementById('feedback'),
    chatcontaner=document.getElementById('chat-container');


const nickname=localStorage.getItem('nickname');
//emit Event 

socket.emit('login',nickname);

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    
    const now = new Date();
    const hoursAndMinutes = now.getHours() + ':' + now.getMinutes();

    if(massageInput.value){
        socket.emit('chat massage',{
            massage:massageInput.value,
            username:nickname,
            date:hoursAndMinutes
        });
        massageInput.value="";
    }
});

massageInput.addEventListener('keypress',()=>{
    socket.emit("typing",{name:nickname});
});

const OnlineUser=document.getElementById('online-users-box');
socket.on('online',data=>{
    OnlineUser.innerHTML="";
    Object.values(data).forEach(value=>{
        OnlineUser.innerHTML+=`
        <li class="bubble-online-user">
            <div class="center-text">${value}</div>
        </li>
        `
    })
});

socket.on('chat massage',data=>{
    feedback.innerHTML="";

    chatbbox.innerHTML += `                
            <li class="msg-bubble">
              <div class="msg-info">
                  <div class="msg-info-time">${data.date}</div>
                  <div class="msg-info-name">${data.username}</div>
              </div>
      
              <div class="msg-text">
                ${data.massage}
              </div>
            </li>`;
    chatcontaner.scrollTop=chatcontaner.scrollHeight-chatcontaner.clientHeight;
})

socket.on('typing',data=>{
    feedback.innerHTML=data.name +" در حال نوشتن است "
     
})
