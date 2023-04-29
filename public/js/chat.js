//Client Side
const socket = io();
//server(emit)->client(receive)--acknowledgement->server

//client(emit)->server(receive)--acknowledgement->client
///---------target the html elements--------------------------
const $messageForm = document.querySelector("#message-form");
const $messageFormInput = document.querySelector("input");
const $messageFormButton = document.querySelector("button");
const $messages = document.querySelector("#messages");
//---------------------------------------------------------
//---------target the html templates-----------------------
const $messageTemplate = document.querySelector("#message-template").innerHTML;
const $urlTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

//---------------------------------------------------------
// 000000000000[Geting the query String]0000000000000000000
 const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})//to get the username and 
//  room value  from the url.ignoreQueryPrefix:true->is used to remove the '?' from query string 
// 00000000000000000000000000000000000000000000000000000000
socket.on("sendMessage", (message) => {
  //to receive the emitted event from server
  console.log(message.createdAt);
  const html = Mustache.render($messageTemplate, {
    username:message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  //for detail formating see the docs of moment.js
  $messages.insertAdjacentHTML("beforeend", html);
});
socket.on("locationMessage", (url) => {
  console.log(url);
  const html = Mustache.render($urlTemplate, {username:url.username, url:url.url,createdAt:moment(url.createdAt).format('h:mm a') });
  $messages.insertAdjacentHTML("beforeend", html);
});
// *********************[rendering userlist of room]*****
 socket.on('roomData',({room,users})=>{
  const html=Mustache.render(sidebarTemplate,{room,users})
  document.querySelector('#sidebar').innerHTML=html
 })

//****************************************************** */

// 0000000000000000000000000000000[Sending New message]0000000000000000000000000000000000000000000
$messageForm.addEventListener("submit", (e) => {
  //we can target the input field like this also "e.target.elements.message.value" message->name if the
  // input field
  e.preventDefault();
  $messageFormButton.setAttribute("disabled", "disabled"); //once form submitted disable the bvutton
  socket.emit("sendMessage", $messageFormInput.value, (serverConfirmation) => {
    //this method is going to run when event will be acknowledge by server
    //Html properties--------------------------------
    $messageFormButton.removeAttribute("disabled");
    $messageFormInput.value = "";
    $messageFormInput.focus();
    //-----------------------------------------------
    if (serverConfirmation) {
      //serverConfirmation- this will be true if message will have bad word see index.js
      return console.log(serverConfirmation);
    }
    console.log("message delivered to the server");
  });
});
// 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
//==================================Sharing Location=========================================
document.querySelector("#send-location").addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    // Show a map centered at latitude / longitude.
    socket.emit("sendLocation", {
      latitude: latitude,
      longitude: longitude,
    });
    console.log("you shared you location");
  });
  //we are receiving this in index.js
});
//=================================================================================

//88888888888888888888888888888888888888888888888888888888888888888888888888888888888
socket.emit('join',{username,room},(error)=>{
  if(error){
    alert(error)
    location.href='/'
    //to bring back to the / route
  }

})

//88888888888888888888888888888888888888888888888888888888888888888888888888888888888