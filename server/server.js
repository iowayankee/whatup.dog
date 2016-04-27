
var port = process.env.PORT || 3000;

var express = require('express');
var path = require('path');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(port, function(){
  console.log('Waiting for dogs on ' + port);
});

//Routes
app.use(express.static(path.join(__dirname, '../client')));
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

//Chat room server
var users = 0;

var kennel = []; // Dogs without a partner
var dogs = {}; // All the dogs, with their names, breed, sockets and pairings

var pairDog = function(dog){
  console.log('Dogs in the kennel: ' + kennel.length);
  if (kennel.length > 0) {
    var dog2 = kennel.pop();
    var room = dog.socket.id + '|' + dog2.socket.id;
    console.log('Pairing up dog (' + dog.socket.id + ') with dog (' + dog2.socket.id + ') from the kennel!');
    dog.room = room;
    dog2.room = room;
    dog.socket.join(room);
    dog2.socket.join(room);
    dog.socket.emit('pair', { 'name':dog2.name, 'breed':dog2.breed , 'room':room });
    dog2.socket.emit('pair', { 'name':dog.name, 'breed':dog.breed , 'room':room });
  }
  else{
    console.log('Putting dog (' + dog.name + ',' + dog.socket.id + ') in the kennel');
    kennel.push(dog);
    dog.socket.emit('wait');
  }
}

var unpairDog = function(dog){
  var room = dog.room;
  var dog1 = dogs[room.split('|')[0]];
  var dog2 = dogs[room.split('|')[1]];
  dog.socket.broadcast.to(dog.room).emit('unpair');
  if(dog1){
    dog1.socket.leave(room);
  }
  if(dog2){
    dog2.socket.leave(room);
  }
}

var exitDog = function(dog){
    if(dog.room){
      unpairDog(dog);
    }
    else{
      kennel.pop();
    }
    dog.socket.emit('exited');
    console.log('A dog (' + dog.socket.id  + ') named ' + dog.name + ' has exited');
    delete dogs[dog.socket.id];
}

io.on('connection', function(socket){
  console.log('A dog (' + socket.id  + ') connected');
  users++;
  socket.on('enter', function(dog){
    if(dogs[socket.id] == null){
      dog.socket = socket;
      dog.room = '';
      dogs[socket.id] = dog;
      socket.emit('entered',socket.id);
      console.log('A dog (' + socket.id  + ') named ' + dogs[socket.id].name + ' has entered');
      pairDog(dogs[socket.id]);
    }
    else{
      console.log('A dog (' + socket.id  + ') tried to enter more than once!');
    }
  });
  socket.on('message', function(message){
    var room = dogs[socket.id].room;
    console.log('A message was sent to ' + room + ' - ' + message)
    socket.broadcast.to(room).emit('message', message);
  });
  socket.on('unpair', function(){
    unpairDog(dogs[socket.id]);
  });
  socket.on('repair', function(){
    pairDog(dogs[socket.id]);
  });
  socket.on('exit', function(){
    exitDog(dogs[socket.id]);
  });
  socket.on('disconnect', function(){
    if(dogs[socket.id]){
      exitDog(dogs[socket.id]);
    }
    users--;
    console.log('A dog (' + socket.id  + ') disconnected');
  });

});
