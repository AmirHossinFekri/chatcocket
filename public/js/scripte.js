
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

socket.on('chat massage',data=>{
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
