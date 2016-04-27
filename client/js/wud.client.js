/*
var socket = io();

var connected = true;
var entered = false;

var paired = false;

var partnerName = '';
var partnerBreed = '';
var room = '';

var name = 'Fido';
var breed = 'Mutt';

var $loginView = $('#viewLogin');
var $loginForm = $('#formLogin');

var $inputName = $('#inputName');
var $inputBreed = $('#inputBreed');

var $btnEnterChat = $('#btnEnterChat');
var $btnExitChat = $('#btnExitChat');
var $btnFindNewPartner = $('#btnFindNewPartner');

var $viewChat = $('#viewChat');

var $viewMessages = $('#viewMessages');

var $inputMessage = $('#inputMessage');
var $btnSendMessage = $('#btnSendMessage');

var enterChat = function (){
  socket.emit('enter',
    {
      'name' : $inputName.val(),
      'breed' : $inputBreed.val()
    }
  );
}

var exitChat = function (){
  socket.emit('exit');
}

var unpair = function (){
  paired = false;
  partnerName = '';
  partnerBreed = '';
  room = '';
  $btnSendMessage.prop('disabled',true);
}

var appendMessage = function(text){
  $viewMessages.append('<p>' + text + '</p>');
}

//Page events, jquery stuff
$btnEnterChat.click(function() {
  enterChat();
});

$btnExitChat.click(function() {
  socket.emit('unpair');
  unpair();
  exitChat();
});

$btnSendMessage.click(function (){
  socket.emit('message',$inputMessage.val());
  appendMessage(name + ': ' + $inputMessage.val());
  $inputMessage.val('');
});

$btnFindNewPartner.click(function (){
  if(paired){
    appendMessage('You abandoned your partner... finding you a new one!');
    socket.emit('unpair');
  }
  socket.emit('repair');
});

// Socket events
socket.on('connect', function (){
  connected = true;
  $btnEnterChat.prop('disabled',false);
  $btnExitChat.prop('disabled',true);
  $btnFindNewPartner.prop('disabled',true);
  appendMessage('Connected to chat server.');
});

// Socket events
socket.on('disconnect', function (){
  connected = false;
  $btnEnterChat.prop('disabled',true);
  $btnExitChat.prop('disabled',true);
  $btnFindNewPartner.prop('disabled',true);
  unpair();
  appendMessage('Disconnected from chat server.');
});

socket.on('wait', function(){
  appendMessage('Waiting to be paired...');
  $btnFindNewPartner.prop('disabled',true);
  $btnSendMessage.prop('disabled',true);
});

socket.on('pair', function(data){
  paired = true;
  partnerName = data.name;
  partnerBreed = data.breed;
  room = data.room;
  appendMessage('Now chatting with ' + partnerName + ' the ' + partnerBreed + '!');
  $btnSendMessage.prop('disabled',false);
  $btnFindNewPartner.prop('disabled',false);
});

socket.on('unpair', function(data){
  unpair();
  appendMessage('Your partner left... Find new partner, or exit?');
});

socket.on('entered', function (){
  appendMessage('You entered the chat!');
  name = $inputName.val();
  breed = $inputBreed.val();
  entered = true;
  $btnEnterChat.prop('disabled',true);
  $btnFindNewPartner.prop('disabled',true);
  $btnExitChat.prop('disabled',false);
});

socket.on('exited', function (){
  appendMessage('You exited the chat.');
  name = '';
  breed = '';
  entered = false;
  $btnEnterChat.prop('disabled',false);
  $btnFindNewPartner.prop('disabled',true);
  $btnExitChat.prop('disabled',true);
});

socket.on('message', function(message){
  appendMessage(partnerName + ': ' + message);
});
*/
