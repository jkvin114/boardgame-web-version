const socket=io();
socket.on('connect',function(){


  //두번쩨접속, 방장 아닐시 컴퓨터 턴 가져옴
  if(sessionStorage.status==='hosting'){
    sessionStorage.status='selection'
    if(sessionStorage.turn!==0){socket.emit('requestAIturn',"")}
  }
})
socket.on('player_select',function(){

  $("#Mainpage").fadeIn(1000)
  $('#Firstpage').hide()
})

function setCard(card)
{
  socket.emit('cardupdate',card)
}
function kickPlayer(turn)
{
  socket.emit('kick',turn)
}
function getCard()
{
  socket.emit('requestcard',"")
}
function setAI(aiturn)
{

  socket.emit('setai',aiturn)
}
function setCheckBox(check_status)
{
  socket.emit('setcheckbox',check_status)
}
function submitTeamSelection()
{
    socket.emit('startgame',"")
}
socket.on('startgame',function(a){
  startGame()
})

socket.on('sendcheckbox',function(check_status){
  getCheckBox(check_status)
})
socket.on('showguest',(guestnum)=>showGuest(guestnum))

socket.on('kicked',function(){
  sessionStorage.status=null
  window.location.href='/firstpage.html'
  window.alert("You have been kicked!")
})
socket.on('addplayer',function(turn){
  addplayer()
})
socket.on('cardupdate',(card)=>updateCard(card))
socket.on('setturn',(turn)=>{
  sessionStorage.turn=turn
  setTurn(turn)
  })
socket.on('setai',(aiturn)=>setAiTeamselection(aiturn))
