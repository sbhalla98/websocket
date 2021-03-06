var socket = io.connect('https://letcat.herokuapp.com/');
$('#board').hide();
$('#personalchat').hide();
$('#userslist').hide();
var output = document.getElementById("output");
var feedback = document.getElementById("feedback");
var message = document.getElementById("message");
var btn = document.getElementById("btn");
btn.addEventListener('click',function(){
    socket.emit('chat',{
        handle:$('#user').html(),
        data: message.value
    })
    document.getElementById("message").value = "";
})
message.addEventListener('focus',function(){
    socket.emit('feedback',{
        handle:$('#user').html()
    })
},[])
message.addEventListener('blur',function(){
    socket.emit('feedbackout')
},[])
socket.on('chat',function(data){
    feedback.innerHTML = "";
    output.innerHTML += '<div style="color:green; padding:1%; font-weight: bold;"><span>'+data.handle+'</span>'+' : '+'<span>'+data.data+'</span><div>'
})
socket.on('feedback',function(data){
    feedback.innerHTML += '<div><span>'+data.handle+' is typing.....</span><div>'
})
socket.on('feedbackout',function(data){
    feedback.innerHTML = '';
})
socket.on('newuser',function(data,err){
    $('#takeusername').hide();
    $('#board').show();
    $('#userslist').show();
    $('body').animate({padding:"10px"})
    $('#userslist').html('');
    $('#userslist').html('<div id="user">USERS LIST</div>');
    $('#userslist').append('<div class="list"><span>'+$('#user').html()+'</span><div>')
    data.forEach(element => {
        if(element!=$('#user').html()){
        $('#userslist').append('<div class="list"><span>'+element+'</span><button class="bton" onclick="display('+"'"+element+"'"+')">Chat</button><div>');
        }
    });
})


var username = document.getElementById("username");
username.addEventListener('keydown',function(e){
    if(e.keyCode==13){
        var name=$('#username').val();
        if(name.trim()==""){
            $('#error').html("choose your username");
        }
        else{
        $('#user').html(name);
        socket.emit('newuser',{handle:name},function(data){
            if(data==false){
                $('#error').html("this username is already taken!!");
            }
            else{
                $('.app').animate({height:"+=100px",width:"+=350px",margin:"0"});
            }
        });
        }
    }
})
function display(e){
    $('#person').html(e);
    $('#personalchat').show();
}


var privatemessage = document.getElementById("privatemessage");
var privatebtn = document.getElementById("privatebtn");
privatebtn.addEventListener('click',function(){
    socket.emit('privatechat',{
        handle:$('#user').html(),
        sendto:$('#person').html(),
        data:privatemessage.value
    })
    document.getElementById("privatemessage").value = "";
})

socket.on('privatechat',function(data){
    output.innerHTML += '<div style="color:red; padding:1%; font-style: italic;"><span>!!!private message!!! '+data.handle+'</span>'+' : '+'<span>'+data.data+'</span><div>'
})
socket.on('sendchat',function(data){
    output.innerHTML += '<div style="color:blue; padding:1%;"><span>!!!YOU SENT !!! private message!!! </span>'+' : '+'<div>'+data.data+'</div><div>'
})

socket.on('disconnect', (reason) => {
    var x=socket.open();
    x.emit('user',{ handle: $('#user').html()});
  });

  socket.on('user',(socket)=>{
      socket.name=$('#user').html();
  })