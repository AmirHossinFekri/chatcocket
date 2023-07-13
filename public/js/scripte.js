
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

pvChatForm.addEventListener('submit',e=>{
    e.preventDefault();

    socket.emit('pvChat',{
        massage:massageInput.value,
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
    socket.emit("typing",{name:nickname});
});

const OnlineUser=document.getElementById('online-users-box');
socket.on('online',users=>{
    OnlineUser.innerHTML="";
    console.log(users);
    for(var socketID in users){
        OnlineUser.innerHTML+=`
        <li class="bubble-online-user">
            <button type="button" class="btn justify-content-center d-flex" data-bs-toggle="modal" data-bs-target="#pvChat" 
            data-bs-id="${socketID}" data-bs-client="${users[socketID]}">
                <div class="center-text">${users[socketID]}</div>
            </button>
        </li>
        `;
        console.log(socketID);
        console.log(users[socketID]);
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
    feedback.innerHTML=data.name +" در حال نوشتن است "
     
})

pvchat.addEventListener("show.bs.modal", function (e) {
    var button = e.relatedTarget;
    var user = button.getAttribute("data-bs-client");
    socketId = button.getAttribute("data-bs-id") ;
    
    modalTitle.innerHTML =  user+" : ارسال پیام شخصی به ";
    pvChatMessage.style.display="none";
});
socket.on('pvChat',(data)=>{
    var modal1 = new bootstrap.Modal(document.getElementById('pvChat'));
    modal1.show();
    
    socketId=data.from;
    modalTitle.innerHTML=" دریافت پیام از "+data.name;
    console.log(data.massage);
    pvChatMessage.style.display="block";
    pvChatMessage.innerHTML=data.name + " : "+data.massage;

});
