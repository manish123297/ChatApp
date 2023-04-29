# Hello Everyone 😀

_Today i came with a new project chatApp.lets get started..._

## WebSocket

- The WebSocket API is an advanced technology that makes it possible to open a two-way interactive communication session between the user's browser and a server. With this API, you can send messages to a server and receive event-driven responses without having to poll the server for a reply.

## Socket.io

- Socket.IO is a library that enables low-latency, bidirectional and event-based communication between a client and a server. It is built on top of the WebSocket protocol and provides additional guarantees like fallback to HTTP long-polling or automatic reconnection.

## Ways to emit an event

```
socket.emit("sendMessage",message.value) //to a single user
```

```
io.emit("sendMessage",message) //to all the connected user
```

```
socket.broadcast.emit("newUser","A New User Has Joined") //Broadcast a message to all other connected sockets except for itself. Used most often after a socket level event occurs, eg, a new message arrived on an existing client socket.

```

## Ways to receive an event

```
socket.on("newUser",(message)=>{
  //to receive the emitted event from server
  console.log(message)
  })
```

## Using Geolocation Api

- See the mdn(Mozilla) geolocation documentation

## Event Acknowledgement

```
=========================Client Side=========================

 socket.emit("sendMessage",message.value,(serverConfirmation)=>{
    //this arrow method is going to run when event will be acknowledge by server
 console.log("message is received by server")
console.log(serverConfirmation)
    //serverConfirmation is the message that server is want to send to the client after
    //delivery which we have passed in callback method
 })
================================================================
```

```
++++++++++++++++++++++++Server Side+++++++++++++++++++++++++++++

 socket.on("sendMessage", (message,callback) => {
 io.emit("sendMessage", message);
 callback("received by server-server message")
      //this callback is going to run only if server will receive the client message
      //callback can take argument that we want to send back -    to the client as
      //  acknowledgement text.we can access it in the client side by passing a parameter to the arrow
      // function in the client side who acknowledeges the server side delivery
 });
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
```

## Rendering Messages

- To Render Messages on App we are going to use Mustache template engine
- CDN

```
<script src="https://cdnjs.cloudflare.com/ajax/libs/mustache.js/3.0.1/mustache.min.js"></script>
```

```
----------------------chat.html------------------------------
 <script id="message-template" type="text/html">
      <div>
        <p>
          <span class="message__name">{{username}}</span>
          <span class="message__meta">{{createdAt}}</span>
          //{{username}}-this is how we use dynamic values in Mustache
          //very soon in this series only we are going to see how to get these values here.so just
          //wait till then .....😃
        </p>
        <p>{{message}}</p>
      </div>
    </script>
```

```
---------------------------chat.html---------------------------
<div id="messages" class="chat__messages">
          <!-- //here we add the message dynamically using mustache from chat.js -->
        </div>
```

- Now we are going to target these html tags and render the messages dynamically as we will get from server

```
//---------target the html template------------------------------------------
const $messageTemplate = document.querySelector("#message-template").innerHTML;
//----------------------------------------------------------------------------
//+++++++++++++++++++++++++rendering the template with dynamic values and moment.js+++++++
socket.on("sendMessage", (message) => {
  //to receive the emitted event from server
  const html = Mustache.render($messageTemplate, {
    username:message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  //the second parameter passed in Mustache.render() is the values that we are using in chat.html

  //for detail formating see the docs of moment.js
  $messages.insertAdjacentHTML("beforeend", html);
});
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


```

- moment.js-This is one of the best ❤ js library for time formating so do visit the docs....👌

## Socket.io Rooms

- Rooms are like a group where many user are present and they all can share the messages
  -ways to send message in a particular room

```
 io.to.emit()  //emit event to all the users of the particular room

```

```
socket.broadcast.to.emit() //it also same as socket.broadcast.emit() but it will emitto a all the user(except who emitted) of the particular chat room
```

##### If you have any dificulty/feedback in this project please contact me [Click Here](https://github.com/manish123297)
