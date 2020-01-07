
var socket = new JsSIP.WebSocketInterface('wss://chats-development.smartz-solutions.com:8089/ws');
var configuration = {
  sockets  : [ socket ],
  uri      : 'sip:7014_development@10.0.3.32',
  password : 'Abc@12345678'
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

var ua = new JsSIP.UA(configuration);

var Status = "Status: ";
var Cause = "Cause: ";
var option;
var calling = "Calling: ";
var remoteAudioStream;
var dtmfSender;

ua.start();
//ua.register(); 

ua.on('connected', function(data){
  console.log('connected to sip server');
  document.getElementById('sig').style.color = "blue";
  var miliseconds = document.getElementById('milisec');
  var minutes = document.getElementById('minute');
  var totSec = 0;

  // setInterval(setTime, 1000);

  // function setTime(){
  //   totSec++;
  //   milisec.innerHTML = pad(totSec % 60);
  //   minutes.innerHTML = pad(parseInt(totSec / 60));
  // }

  // function pad(val){
  //   valLength = val + "";
  //   if(valLength.length == 2)
  //   {
  //     return valLength
  //   }else{
  //     return "0" + valLength;
  //   }
  // }
});

  ua.on('disconneted', function(data){
  // document.getElementById('sig').style.color = "blue";
  console.log("disconneted");
});


ua.on('registered', function(data){ 
  document.getElementById("reg").innerHTML = Status + 'Registered';
 });

ua.on('unregistered', function(data){ 
  ua.register();
 });
ua.on('registrationFailed', function(data){
  document.getElementById("reg").innerText = Status + 'Registration failed'; 
  document.getElementById("cause").innerHTML = Cause + data.cause;
 });

var options = {
  'eventHandlers' : eventHandlers,
  'mediaConstraints' : { 'audio': true, 'video': false },
    // render: {
    //             remote: {
    //                 audio: document.getElementById('remoteAudio')
    //             },
    //             local: {
    //                 audio: document.getElementById('localAudio'),
    //             }
    //         }
  };

 
  ua.on('newRTCSession', function(data){

    //Outbound call
       data.session.on('ended', function(data) {
          document.getElementById("reg").innerHTML = Status + 'Call ended';
        });
        data.session.on("confirmed",function(){
        //the call has connected, and audio is playing
        document.getElementById("reg").innerHTML = Status + 'Call confirmed';
            remoteAudioStream = this.connection.getRemoteStreams()[0];
            document.getElementById("remoteAudio").srcObject = remoteAudioStream; 
                        // localStream = data.session.connection.getLocalStreams()[0];
                        // dtmfSender = data.session.connection.createDTMFSender(localStream.getAudioTracks()[0])
          });
        data.session.on("accepted",function(data){
              console.log('call answered');
              document.getElementById("reg").innerHTML = Status + 'Call answered';
//               var startTime = new Date().getTime();

// setTimeout(function () {
//   var endTime = new Date().getTime();
//   console.log("duration [ms] = " + (endTime-startTime));
// }, 1500);
            })
          data.session.on('connecting', function(data) {
            console.log('call connecting');
            document.getElementById("reg").innerHTML = Status + 'Connecting';
          });
              data.session.on('connected', function(data) {
                document.getElementById("reg").innerHTML = Status + 'Connected';
            });
                data.session.on('failed', function(data) {
                document.getElementById("reg").innerHTML = Status + 'Connection failed';
                document.getElementById("cause").innerHTML = Cause + data.cause

              });

                // data.session.on('addstream', function(data){
                // // set remote audio stream (to listen to remote audio)
                // // remoteAudio is <audio> element on page
                // remoteAudio.src = window.URL.createObjectURL(data.stream);
                // remoteAudio.play();
                // });

          //Inbound call
          if (data.session.direction === "incoming") {
          // incoming call here 
          document.getElementById("reg").innerHTML = Status + 'incoming call';
          document.getElementById("answr").style.backgroundColor = '#66bb6a';
          document.getElementById("call").style.backgroundColor = '#white';
            // the call has answered
           data.session.on("accepted",function(data){
              document.getElementById("reg").innerHTML = Status + 'Call answered';
            })
              // call confirmed
              data.session.on("confirmed",function(data){
                document.getElementById("reg").innerHTML = Status + 'Call confirmed';
                remoteAudioStream = this.connection.getRemoteStreams()[0];
                document.getElementById("remoteAudio").srcObject = remoteAudioStream;
                        // localStream = data.session.connection.getLocalStreams()[0];
                        // dtmfSender = data.session.connection.createDTMFSender(localStream.getAudioTracks()[0]) 
              
              });
               
                  data.session.on("failed",function(data){
                    document.getElementById("reg").innerHTML = Status + 'Unable to establish a call';
                    console.log('unable to establish a call');
                    //document.getElementById("calling").innerHTML = location.reload();
                  });

        // data.session.on('addstream', function(data){
        //     // set remote audio stream (to listen to remote audio)
        //     // remoteAudio is <audio> element on page
        //     remoteAudio.src = window.URL.createObjectURL(data.stream);
        //     remoteAudio.play();
        // });

    }


      $("#answr").on('click', function() {
            data.session.answer(options);
          })

          $("#hang").on('click', function() {
            data.session.terminate();
            // location.reload();
          })

});


var eventHandlers = {
  'succeeded': function(data){ console.log('message sent') },
  'failed':    function(data){ console.log('message not sent') }
};

var text = 'hello kenneth';

ua.sendMessage('sip:7011@10.0.3.32', text, options);

ua.on('sendMessage', function(data) {
  if (data.direction === 'local') {
    console.log('Sending Message!');  
  }
  else if (data.direction === 'remote') {
        console.log('Received Message!');
        data.message.accept();
      }
  });


function makeCall(number)
{
    ua.call(number, options);
    document.getElementById("calling").innerHTML = calling + number;
    console.log(number);
}



