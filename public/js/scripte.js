
const socket=io();

//Query DOM
const massageInput=document.getElementById("massageInput"),
    chatForm=document.getElementById("chatForm"),
    chatbbox=document.getElementById('chat-box'),
    feedback=document.getElementById('feedback'),
    chatcontaner=document.getElementById('chat-container'),
    pvchat=document.getElementById('pvChat'),
    pvChatForm = document.getElementById("pvChatForm"),
    pvMessageInput = document.getElementById("pvMessageInput"),
    modalTitle = document.getElementById("modalTitle"),
    pvChatMessage = document.getElementById("pvChatMassage");

var socketId;

const nickname=localStorage.getItem('nickname');
const roomNumber=localStorage.getItem('room');
//*  emit Event 
socket.emit('login',{nickname,roomNumber});

chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    
    const now = new Date();
    const hoursAndMinutes = now.getHours() + ':' + now.getMinutes();

    if(massageInput.value){
        socket.emit('chat massage',{
            massage:massageInput.value,
            username:nickname,
            date:hoursAndMinutes,
            roomNumber,
        });
        massageInput.value="";
    }
});

pvChatForm.addEventListener('submit',e=>{
    e.preventDefault();
    
    socket.emit('pvChat',{
        massage:pvMessageInput.value,
        name:nickname,
        to:socketId,
        from:socket.id,
    })

    var truck_modal = document.querySelector('#pvChat');
    var modal = bootstrap.Modal.getInstance(truck_modal);    
    modal.hide();

    pvMessageInput.value="";
});

massageInput.addEventListener('keypress',()=>{
    socket.emit("typing",{name:nickname,roomNumber});
});

const OnlineUser=document.getElementById('online-users-box');
socket.on('online',users=>{
    OnlineUser.innerHTML="";
    for(var socketID in users){
        console.log(users[socketID]);
        if(roomNumber===users[socketID].roomNumber)
        OnlineUser.innerHTML+=`
        <li class="bubble-online-user">
            <button type="button"
            class="btn justify-content-center d-flex"
            ${users[socketID].nickname=== nickname ?"disabled":""}
            data-bs-toggle="modal" 
            data-bs-target="#pvChat" 
            data-bs-id="${socketID}"  data-bs-client="${users[socketID].nickname}">
                <div class="center-text">
                ${users[socketID].nickname}</div>
            </button>
        </li>
        `;
    }
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
    if(roomNumber===data.roomNumber)
    feedback.innerHTML=data.name +" در حال نوشتن است "
     
})

let flagMassage=false;

pvchat.addEventListener("show.bs.modal", function (e) {

    if(!flagMassage){
        var button = e.relatedTarget;
    
    
        var user = button.getAttribute("data-bs-client");
        socketId = button.getAttribute("data-bs-id") ;
        
        modalTitle.innerHTML =  user+" : ارسال پیام شخصی به ";
        pvChatMessage.style.display="none";
    }
    
    flagMassage=false;
});
socket.on('pvChat',(data)=>{
    flagMassage=true;
    var modal1 = new bootstrap.Modal(document.getElementById('pvChat'));
    modal1.show();
    socketId=data.from;
    modalTitle.innerHTML=" دریافت پیام از "+data.name;
    pvChatMessage.style.display="block";
    pvChatMessage.innerHTML=data.name + " : "+data.massage;

});
