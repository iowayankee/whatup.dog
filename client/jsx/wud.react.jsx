var socket = io();

var React = require('react');
var ReactDOM = require('react-dom');

var Message = React.createClass({
    render:function(){
      var messageClass = this.props.source == 'local' ? 'message-local pull-right' : (this.props.source == 'remote' ? 'message-remote pull-left' : 'message-system text-center');
      return (
        <div className='row'>
          <p className={messageClass}>
            {this.props.text}
          </p>
        </div>
      );
    }
})

var MessagePane = React.createClass({
    render: function (){
        var renderMessage = function(message){
            return <Message key={message.id} text={message.text} source={message.source} />
        }
        var dogLeftImage = '/img/' + this.props.partnerBreed + 'l.png';
        var dogRightImage = '/img/' + this.props.breed + 'r.png';

        return(
          <div id='messagePane'>
            <div className='dog-images'>
              <div className='pull-left'>
               <h4 className='text-center'>{this.props.partnerName} </h4>
            	 <img id='dog-left'  src={dogLeftImage} />
              </div>
              <div className='pull-right'>
               <h4 className='text-center'>{this.props.name}</h4>
               <img id='dog-right' src={dogRightImage} />
              </div>
            </div>
            <div className='container'>
              <div className='row'>
                <div id='messages' className='col-sm-offset-2 col-sm-8'>
                  {this.props.messages.map(renderMessage)}
                </div>
              </div>
            </div>
          </div>
        );
    }
});

var MessageForm = React.createClass({
    getInitialState: function(){
        return {
          disabled: false,
          text: ''
        };
    },
    updateText : function(e){
        this.setState({ text : e.target.value });
    },
    sendMessage : function(e){
        e.preventDefault();
        this.props.sendMessageFunc(this.state.text);
        this.setState({ text: '' });
    },
    exitChat : function(e){
      e.preventDefault();
      this.props.exitChatFunc();
    },
    findNewPartner : function(e){
      e.preventDefault();
      this.props.findNewPartnerFunc();
    },
    render:function(){
        return(
        <div id='messageForm'  className='pageFooter'>
          <div className='container'>
            <div className='row'>
              <form className='form-horizontal' onSubmit={this.sendMessage}>
                <div className='form-group'>
                  <div className='col-xs-10'>
                    <input autocomplete='off' id='inputMessage' type='text' disabled={!this.props.canSendMessages} onChange={this.updateText} value={this.state.text} className='form-control col-xs-10' placeholder='Send message...' />
                  </div>
                  <div className='col-xs-2'>
                    <button id='btnSendMessage' disabled={!this.props.canSendMessages} type='submit' className='btn btn-block'>Send</button>
                  </div>
                </div>
              </form>
            </div>
            <div className='row'>
              <button id='btnExitChat' onClick={this.exitChat} disabled={!this.props.canExitChat} className='btn btn-default col-xs-6'>Exit Chat!</button>
              <button id='btnFindNewPartner' onClick={this.findNewPartner} disabled={!this.props.canFindNewPartner} className='btn btn-default col-xs-6'>Find New Partner</button>
            </div>
          </div>
        </div>
        );
    }
});

var LoginForm = React.createClass({
  getInitialState: function(){
    return {
      disabled: false,
      name: 'Jack',
      breed: 'dog1',
    };
  },
  componentDidMount: function(){

  },
  enterChat : function(e){
      e.preventDefault();
      this.props.enterChatFunc(
        {
          'name' : this.state.name,
          'breed' : this.state.breed
        }
      );
  },
  updateName : function(e){
      this.setState({ name : e.target.value });
  },
  updateBreed : function(e){
      this.setState({ breed : e.target.value });
      console.log(e.target.value);
  },
  render:function(){

      var modalStyle = {};

      if(this.props.showLoginForm){
        modalStyle = { 'display' : 'block' };
      }

      return(
        <div style={modalStyle} className='modal'  id='loginModal' tabindex='-1' role='dialog' >
          <div className='modal-dialog' role='document'>
            <img src='/img/dog3.png' className='login-dog'/>
            <div className='modal-content'>
              <div className='modal-body'>
                <h1>Hey, <span className='whatupTitle'>whatup.dog?</span></h1>
                <h5>Chat with dogs all over the world. Enter your information below to continue.</h5>
                <form id='loginForm' onSubmit={this.enterChat} >
                  <div className='form-group'>
                    <label for='inputName' className='control-label'>Name:</label>
                      <input autocomplete='off' className='form-control' id='inputName' placeholder='Jack' onChange={this.updateName} />
                  </div>
                  <div className='form-group'>
                    <label for='inputBreed' className='control-label'>Breed:</label>
                    <select className='form-control' id='inputBreed' onChange={this.updateBreed} value={this.state.breed}>
                      <option>dog1</option>
                      <option>dog2</option>
                    </select>
                  </div>
                  <div className='form-group'>
                    <button disabled={!this.props.canEnterChat} id='btnEnterChat' className='btn btn-default'>Enter Chat!</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
  }
});

var WhatUpDogApp = React.createClass({
    getInitialState: function(){
        return {
          connected : false,
          entered : false,
          paired : false,
          name : '',
          breed : '',
          partnerName : '',
          partnerBreed : '',
          room : '',
          messages: [],
          showLoginForm : true,
          canEnterChat : false,
          canExitChat : false,
          canFindNewPartner : false,
          canSendMessages : false
        };
    },
    componentDidMount: function(){
        socket.on('connect', this.connect);
        socket.on('entered', this.entered);
        socket.on('wait', this.wait);
        socket.on('pair', this.pair);
        socket.on('message', this.message);
        socket.on('unpair', this.unpair);
        socket.on('exited', this.exited);
        socket.on('disconnect', this.disconnect);
    },
    connect: function(){
      this.setState({ connected : true, canEnterChat: true });
      this.forceUpdate();
    },
    entered: function(){
      this.setState({ entered : true, showLoginForm : false, canExitChat: true });
      this.addMessage('server', 'Welcome ' + this.state.name + '!');
    },
    wait: function(){
      this.setState({
        paired : false,
        partnerName : '',
        partnerBreed : '',
        room : '',
        canExitChat : true,
        canFindNewPartner : false,
        canSendMessages : false
      });
      this.forceUpdate();
      this.addMessage('server', 'Waiting... you will be paired up with the next dog that appears.');
    },
    pair: function(data){
      this.setState({
          paired : true,
          partnerName : data.name,
          partnerBreed : data.breed,
          room : data.room,
          canSendMessages : true,
          canFindNewPartner : true
        });
        this.forceUpdate();
        this.addMessage('server', 'Sweet! You\'re now chatting with ' + data.name + '. What up, dog?');
    },
    message: function(message){
      this.addMessage('remote', message);
    },
    unpair: function(){
      this.setState({
          paired : false,
          partnerName : '',
          partnerBreed : '',
          room : '',
          canSendMessages : false
        });
      this.forceUpdate();
      this.addMessage('server', 'Your partner left... Use the buttons below to find a new partner or exit the chat.');
    },
    exited: function(){
      this.addMessage('server', 'Goodbye!');
    },
    disconnect: function (){
      if(this.state.entered){
        this.exitChat();
      }
      this.setState({
        connected : false,
        entered : false,
        paired : false,
        name : '',
        breed : '',
        partnerName : '',
        partnerBreed : '',
        room : '',
        messages: [],
        showLoginForm : true,
        canEnterChat : false,
        canExitChat : false,
        canFindNewPartner : false,
        canSendMessages : false
      });
    },
    enterChat : function(data){
      this.setState({
        name: data.name,
        breed: data.breed
      });
      this.clearMessages();
      this.forceUpdate();
      socket.emit('enter',data);
    },
    exitChat : function(){
      if(this.state.paired){
        this.unpair;
      }
      socket.emit('exit');
      this.clearMessages();
      this.setState({
        entered : false,
        paired : false,
        name : '',
        breed : '',
        partnerName : '',
        partnerBreed : '',
        room : '',
        showLoginForm : true,
        canEnterChat : true,
        canExitChat : false,
        canFindNewPartner : false,
        canSendMessages : false
      });
    },
    findNewPartner : function(){
      if(this.state.paired){
        this.addMessage('server','You abandoned your partner... finding you a new one!');
        this.setState({ paired : false, canFindNewPartner : false });
        socket.emit('unpair');
      }
      socket.emit('repair');
    },
    sendMessage : function(message){
      if(this.state.paired){
        /*
        {
          name : 'hop',
          pattern : /(\/hop [\s\S]*)/g,
          function : function (match) {}
        },
        {
          name : 'delay',
          pattern : /(\/delay (\d*) ([\s\S]*))/g,
          function : function (match) {}
        }
        */

        //Check for special commands in the message... this should be way more more robust. Sufficient for now!
        var commands = {
          hop : /(\/hop(?!\S))/g,
          delay : /(\/delay (\d*) ([\s\S]*))/g
        };

        var matched = null;
        var match = null;

        (Object.keys(commands)).forEach(function(value) {
            match = commands[value].exec(message);
            if(match){
              matched = value;
            }
        });

        if(matched){
          if(matched == 'hop'){
            this.findNewPartner();
          }
          else if(matched == 'delay'){
            this.setState( { canSendMessages : false });

            var wudApp = this;
            var delayedMessage = match[3];

            var sendMessageAfterWaiting = function(){
              wudApp.addMessage('local',delayedMessage);
              wudApp.setState( { canSendMessages : true })
            }
            setTimeout( sendMessageAfterWaiting , match[2]);
          }
        }
        else{
          socket.emit('message',message);
          this.addMessage('local', message);
        }

      }
    },
    addMessage : function(source, message){
      this.state.messages.push({
        id: this.state.messages.length,
        source: source,
        text: message
      });
      this.forceUpdate();
      var elem = document.getElementById('messagePane');
      elem.scrollTop = elem.scrollHeight;
    },
    clearMessages : function(){
      this.setState({ messages: [] });
    },
    render: function(){
      return(
        <div id='whatupDogApp'>
          <div className='pageHeader' >
            <h1 className='whatupTitle'>whatup.dog</h1>
          </div>
          <LoginForm showLoginForm={this.state.showLoginForm} canEnterChat={this.state.canEnterChat}  enterChatFunc={this.enterChat} />
          <MessagePane breed={this.state.breed} name={this.state.name} partnerBreed={this.state.partnerBreed} partnerName={this.state.partnerName} messages={this.state.messages} />
          <MessageForm canSendMessages={this.state.canSendMessages} canExitChat={this.state.canExitChat} canFindNewPartner={this.state.canFindNewPartner}
                  sendMessageFunc={this.sendMessage} exitChatFunc={this.exitChat} findNewPartnerFunc={this.findNewPartner} />
          <p>Connected: {this.state.connected.toString()}  -  Entered: {this.state.entered.toString()} - Paired: {this.state.paired.toString()}</p>
        </div>
      );
    }
});

function render(){
    ReactDOM.render(<WhatUpDogApp />,
      document.getElementById('reactContainer'));
}
render();
