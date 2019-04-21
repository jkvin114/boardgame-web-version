const socket=io();
socket.on('connect',function(){
  console.log("game")

})
function requestsetting(){
  socket.emit('requestsetting',"")
}

function setupComplete(){
  socket.emit('startGame',"")
}
function pressDice(){
  socket.emit('pressdice',"")
}
function checkObstacle(){

  socket.emit('checkobstacle',"")
}
function obsComplete(){
  socket.emit('obscomplete',"")
}
function goNextTurn(){
  socket.emit('gonextturn',"")
}

function getSkill(s){
  socket.emit('getskill',s)
}
function sendTarget(t){
  console.log("target "+t)
  socket.emit('sendtarget',t)
}
socket.on('initialsetting',function(setting){
  initUI(setting)
})

socket.on('nextturn',function(t){
  nextTurn(t)
})
socket.on('rolldice',function(dice){
  rollDice(dice)

})
socket.on('changehp',function(val){
  animateHP(val.turn,val.currhp,val.currmaxhp,val.hp)

})
socket.on('changemoney',function(val){
    indicateMoney(val.turn,val.amt)
})
socket.on('effect',function(val){
  
  indicateEffect(val.turn,val.effect,val.num)
})
socket.on('teleport',function(val){
  levitatePlayer(val.turn)
  setTimeout(()=>tpPlayer(val.turn,val.pos),700)

})
socket.on('skillready',function(status){
  showSkillBtn(status)

})
socket.on('targets',function(result){
  if(result==='nocool'){
    alert("no cool!")
    showSkillBtn(game.skillstatus)
  }
  else if(result==='notarget'){
    alert("no targets in range!")
    showSkillBtn(game.skillstatus)
  }
  else{
    showTarget(result,false)
  }
})
socket.on('skillused',function(status){
  console.log('skillused')
    showSkillBtn(status)
})
