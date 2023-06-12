
const socket=io();

//Query DOM
const massageInput=document.getElementById("massageInput"),
    chatForm=document.getElementById("chatForm"),
    chatbbox=document.getElementById('chat-box'),
    feedback=document.getElementById('feedback');


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
            </li>`
})

socket.on('typing',data=>{
    feedback.innerHTML=data.name +" در حال نوشتن است "
     
})
