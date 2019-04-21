var hpframe=null;
var hpspan=null
var ui=null
var names=null
var skillbtns=null
var statusbtn=null
var dicebtn=null

var Map=null

var coordinates=null
var finishPos=null
var muststop=null
var respawn=null

var game=null
class Game{
  constructor(){
    this.skillstatus=null
    this.turnsInUI=[];
    this.thisturn=0
    this.thisui=0
    this.ismyturn=false
    this.S=0       //total number of player
    this.myturn=Number(sessionStorage.turn)
    this.dicecount=0
  }
  turn2ui(turn){
    return this.turnsInUI[turn]
  }
  updateTurn(t){
    this.thisturn=t
    this.thisui=this.turn2ui(t)
    this.ismyturn=(t===this.myturn)

  }

}

var mapRequest=new XMLHttpRequest();
mapRequest.open('GET',"https://raw.githubusercontent.com/jkvin114/Boardgame-map/master/map.json")
mapRequest.onload=function(){
  try{
    Map=JSON.parse(mapRequest.responseText)
  }
  catch(e)
  {
    alert("Invaild map format!")
  }
  coordinates=Map.coordinates         //2d array of each position on board
  finishPos=Map.finish           //finish position
  muststop=Map.muststop
  respawn=Map.respawn
}
mapRequest.send()



$(document).ready(function(e){
  dicebtn=$(".dicebtn").toArray()
  hpframe=$(".hpframe").toArray()
  hpspan=$(".hp").toArray()
  ui=$(".ui").toArray()
  names=$(".hpi").toArray()
  skillbtns=$(".skillbtn").toArray()
  statusbtn=$(".status").toArray()
  game=new Game()

  requestsetting()


  $("#dicebtn").click(pressDice)
  $("#nextturn").click(function(){
    hideSkillBtn()
    goNextTurn()
  })

  $("#skillcancel").click(function(){
    resetTarget()
    showSkillBtn(game.skillstatus)
  })
  $("#projectilecancel").click(function(){
    tileReset()
    showSkillBtn(game.skillstatus)
  })
  // $(".infobtn").popover()
  // $('.popover-dismiss').popover({
  //   trigger: 'focus'
  // })

  $(".skillbtn").click(function(){
    let val=$(this).val()
    hideSkillBtn()
    getSkill(val)
  })


})
function initUI(setting){
  game.S=setting.length    //total number of player
  if(game.S<4){
    $(ui[3]).hide()
  }
  if(game.S<3){
    $(ui[2]).hide()
  }
  let othercount=1
  for(let i=0;i<game.S;++i)
  {
    if(setting[i].turn===game.myturn)
    {
      $(names[0]).html(setting[i].name+" "+setting[i].HP+"/"+setting[i].MaxHP)
      if(setting[0].team===0)
      {
        $(names[0]).css("background","#ff7f7f")
      }
      else if(setting[i].team===1)
      {
        $(names[0]).css("background","#77a9f9")
      }
      game.turnsInUI.push(0)
    }
    else
    {
      $(names[othercount]).html(setting[i].name+" "+setting[i].HP+"/"+setting[i].MaxHP)
      if(setting[othercount].team===0)
      {
        $(names[othercount]).css("background","#ff7f7f")
      }
      else if(setting[i].team===1)
      {
        $(names[othercount]).css("background","#77a9f9")
      }
      game.turnsInUI.push(othercount)
      othercount+=1


    }

  }

  for(let i=0;i<game.S;++i)
  {
    let j=game.turnsInUI[i]
    $(hpframe[j]).css("width",String(setting[i].MaxHP*2)+"px")
    $(hpspan[j]).css("width",String(setting[i].HP*2)+"px")
  }
  game.thisui=game.turnsInUI[0]
  $(".progress-bar").animate({width:"100%"},1700,boardReady)

  setTimeout(()=>drawboard(),1500)
}


function boardReady(){
  setTimeout(()=>$(".progress").hide(),500)
  setupComplete()

}
// 0 상점 1,2,3 돈 4덫 5강도 6포탑 7지뢰 8 칼 9열매
// 10수면제 11물약 12마법성 13 거미줄
//  14도박 15도둑 16눈덩이 17흡혈 18소매 19소환 20위치교환 21
//  신손 22 연금 23날강도 24대피소 25방어막
//   26대전자 27살인법 28 독거미줄 29 썩은감자 30폭탄 31핵폭탄 32 방사능
//    33납치 34노예 35수용소 36 태풍 37카지노 38사형재판
  function targetLocked(target,godhand)
  {

      sendTarget(target)

      resetTarget()
      // if(godhand)
      // {
      //   chooseLocation(players[target].pos,10,true)
      //   godhandtarget=players[target]
      //   resetTarget()
      // }
      // else {
      //   var p=players[thisturn]
      //   skilldmg.func(target)
      //   resetTarget()
      //   var died=p.hitOneTarget(target,skilldmg,p.turn,skilldmg.skill)
      // //  skilldmg=-1
      //
      // }

  }




  //t:{turn:number,stun:boolean}
  function nextTurn(t)
  {
    game.updateTurn(t.turn)


    if(game.ismyturn)
    {
//  players[thisturn].respawn()

    }

    hideSkillBtn()

    highlightUI(t.turn)
    showDiceBtn(t.turn,t.stun)


  }
  function highlightUI(t)
  {
    for(let i=0;i<game.S;++i)
    {
      if(i===game.thisui)
      {
        $(ui[i]).css("border","7px solid red")
      }
      else {
        $(ui[i]).css("border","7px solid lightgray")
      }

    }
  }

  //turn:number,stun:boolean
  function showDiceBtn(turn,stun)
  {
    console.log(stun)

    if(stun)
    {
      manageStun()
    }
    else
    {
      $(dicebtn[game.thisui]).attr("src","dice/1.png");
      $(dicebtn[game.thisui]).show()
    }

  }
  function manageStun()
  {

    if(game.ismyturn)
    {
      $("#dicebtn").attr("src","dice/stun.png");
      $(".dicebtn").attr("disabled",true)
      $("#dicebtn").show()
    }

    setTimeout(function(){
      $("#dicebtn").hide()
      $(".dicebtn").attr("disabled",false)
      if(game.myturn===0){

        checkObstacle()

        setTimeout(function(){
          obsComplete()
        },500)
      }

    },500)
  }

  function rollDice(dice)
  {
    if(dice==='stun'){return;}
    canvas.renderAll()
    game.dicecount=0
    diceAnimation(dice)
  }

function diceAnimation(dice){
    if(game.dicecount>10) {
      afterDice(dice)
      return;
    }
    game.dicecount+=1
    var d=Math.floor(Math.random()*6)+1
    setDice(d)
    setTimeout(()=>diceAnimation(dice),60)

}

function setDice(dice){
  $(dicebtn[game.thisui]).attr("src","dice/"+String(dice)+".png");
}

function afterDice(dice)
{

    setDice(dice.dice)
    setTimeout(()=>movePlayer(dice.actualdice,1,dice.currpos,dice.turn),500)

}
function moveComplete(end)
{

  if(end){gameOver()}

  $(".dicebtn").hide()


  if(game.myturn===0){
    checkObstacle()
    console.log('stun')
    setTimeout(function(){
      obsComplete()
    },500)
  }

}



function showSkillBtn(status)
{
  if(status.turn!==game.myturn){
    let t=game.turn2ui(status.turn)-1
    $(statusbtn[t]).html("Choosing skill....")
    return;
  }
  game.skillstatus=status
  $("#nextturn").show()
  $(".skillbtn").attr("disabled",false)
  $("#nextturn").attr("disabled",false)
//  if(skillcount===4 || players[thisturn].effects[3]>0)
  if(status.silent>0)
  {       //silent or used skill 4 times
    $(".noskill").show()
  }
  else {
    $(".storebtn").hide()
    $(".skillbtn").show()

    for(let i=0;i<3;++i)
    {
      if(status.cooltime[i]===0)
      {
        $(skillbtns[i]).css({"background-color": "#00b235"})
      }
      else {
        $(skillbtns[i]).css({"background-color": "gray"})
      }
    }
    if(status.level<3)
    {
      $(skillbtns[2]).css({"background-color": "gray"})
    }
    if(status.level<2)
    {
      $(skillbtns[1]).css({"background-color": "gray"})
    }

  }

}


function hideSkillBtn()
{
  $(".status").html("")
  $(".skillbtn").hide()
  $("#nextturn").hide()
  $(".noskill").hide()
  $(".storebtn").hide()
}
function disableSkillBtn()
{
  $(".skillbtns button").attr("disabled",true)
  $("#nextturn").attr("disabled",true)

}

function rgetSkill(s)
{

  var p=players[thisturn]
  skilldmg=p.initSkill(s)
  if(skilldmg===-1){     //no cool

    showSkillBtn()
  }

  else if(skilldmg===0){        //non-attack skill
    skillcount+=1
    showSkillBtn()
  }
  else if(skilldmg.nontarget)      //projectile
  {
    skillcount+=1
    chooseLocation(p.pos,skilldmg.proj.skillrange,false)
  }
  else {                           //targeting skill
    skillcount+=1
    players[thisturn].chooseTarget(skilldmg.range,s)

  }
}
//proj: Projectile object
function chooseLocation(pos,range,godhand)
{
  disableSkillBtn()
  if(godhand){$("#godhandcancel").show()}
  else{$("#projectilecancel").show()}
  let p=players[thisturn]
  canvas.bringToFront(shadow)
  canvas.discardActiveObject()
  shadow.set({visible:true})

  for(let i=pos-(range/2);i<pos+(range/2+1);++i)
  {
    liftTile(i,godhand)
  }
  playersToFront()

}

function playerDie(turn)
{
  let pos=players[turn].pos
  playerimgs[turn].set({visible:false,top:coordinates[pos].y,left:coordinates[pos].x})
  canvas.renderAll()
  $(ui[turn]).css({"background-color":"gray"})
}
function playerRespawn(turn)
{
  let pos=players[turn].pos
  playerimgs[turn].set({visible:true,top:coordinates[pos].y,left:coordinates[pos].x})
  canvas.renderAll()
  $(storebtn[turn]).show()
  $(ui[turn]).css({"background-color":"white"})
}

 //   1. dice
 //  2.projectile
 //  3.creed w
 //   4.cooltime,effect cooldown
 //   5.obstacle
 //   6.lastmoneycooldown
 //   7.durcooldown
 //    8.useskill
 //    9.etc cooldown
function endgame(){
  hideSkillBtn()
  $("#dicebtn").hide()
}
function gameOver(){
  endgame()
  alert("game over")
}
