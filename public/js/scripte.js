
const socket=io();

//Query DOM
const massageInput=document.getElementById("massageInput"),
    chatForm=document.getElementById("chatForm"),
    chatbbox=document.getElementById('chat-box'),
    feedback=document.getElementById('feedback');

//emit Event 
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(massageInput.value){
        socket.emit('chat massage',{
            massage:massageInput.value,
        });
        massageInput.value="";
    }
});

massageInput.addEventListener('keypress',()=>{
    socket.emit("typing",{name:"امیر"});
});

socket.on('chat massage',data=>{
    feedback.innerHTML="";

    chatbbox.innerHTML += `                <li class="msg-bubble">
              <div class="msg-info">
                  <div class="msg-info-time">12:46</div>
                  <div class="msg-info-name">امیر</div>
              </div>
      
              <div class="msg-text">
                ${data.massage}
              </div>
            </li>`
})

socket.on('typing',data=>{
    feedback.innerHTML=data.name +"در حال نوشتن است"
})