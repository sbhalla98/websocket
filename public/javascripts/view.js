var socket = io.connect('http://localhost:4001/');
var obj =[];
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
socket.on('chat',function(data){
    feedback.innerHTML = "";
    output.innerHTML += '<div><span>'+data.handle+'</span>'+' : '+'<span>'+data.data+'</span><div>'
})
socket.on('feedback',function(data){
    feedback.innerHTML += '<div><span>'+data.handle+' is typing.....</span><div>'
})
socket.on('newuser',function(data,err){
    console.log(err);
    if(err){
        console.log(err);
    }
    else{
    $('#takeusername').hide();
    $('#board').show();
    $('#userslist').show();
    $('body').animate({padding:"10px"})
    $('#userslist').html('');
    $('#userslist').html('<div id="user">USERS LIST</div>');
    $('#userslist').append('<div class="list"><span>'+$('#user').html()+'</span><div>')
    data.forEach(element => {
        if(element!=$('#user').html()){
        console.log(data);
        $('#userslist').append('<div class="list"><span>'+element+'</span><button class="bton" onclick="display('+"'"+element+"'"+')">Chat</button><div>');
        }
    });
    }
    obj = data;
})


var username = document.getElementById("username");
username.addEventListener('keydown',function(e){
    if(e.keyCode==13){
        var name=$('#username').val();
        $('.app').animate({height:"+=100px",width:"+=350px",margin:"0"});
        $('#user').html(name);
        socket.emit('newuser',{
            handle:name
        },function(data){ $('#error').html(data)})
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
    output.innerHTML += '<div ><span>!!!private message!!! '+data.handle+'</span>'+' : '+'<span>'+data.data+'</span><div>'
})