var sizes=[0.8,1,1.2,1.4,1.6,1.8]
var cursize=1
$('#individual').click(playIndividual)
$('#team').click(playTeam)
$("#submit").click(setup)
$(".confirm").click(startgame)
$("#dicebtn").click(throwDice)
$("#nextturn").click(nextTurn)
$("#skillcancel").click(resetTarget)
$("#skillbtns button:nth-child(1)").click(chooseSkill1)
$("#skillbtns button:nth-child(2)").click(chooseSkill2)
$("#skillbtns button:nth-child(3)").click(chooseSkill3)
$(".enlarge").click(function(){
    cursize+=1
   $("#board").css("transform","scale("+String(sizes[cursize])+")")

})
$(".shrink").click(function(){
   cursize=Math.max(0,cursize-=1)
  $("#board").css("transform","scale("+String(sizes[cursize])+")")

})

$("#FINISH").click(endgame)
var canvas=new fabric.Canvas("board")
var PNUM=0;
var CNUM=0;
var isTeam=false;
var players=[];
var redteams=[]
var blueteams=[]
var playerimgs=[]
var targetimgs=[]
var otherhpfrms=$(".otherhpfrm").toArray()
var otherhps=$(".otherhp").toArray()
var thisturn=0
var skilldmg=-1
var skillcount=0
var diff=[[20,20],[20,-20],[-20,20],[-20,-20]]
const Map={
  "coordinates":
  [
  {"x":138,"y":178},
  {"x":258,"y":178},
  {"x":378,"y":178},
  {"x":510,"y":178},
  {"x":647,"y":178},
  {"x":778,"y":178},
  {"x":967,"y":178},
  {"x":967,"y":378},
  {"x":778,"y":378},
  {"x":647,"y":378},
  {"x":510,"y":378},
  {"x":378,"y":378},
  {"x":258,"y":378},
  {"x":138,"y":378}
  ],
  "finish":13
}


const coordinates=Map.coordinates         //2d array of each position on board
const finishPos=Map.finish                //num of finish position




function playIndividual()
{
    PNUM=$("#numselection option:selected").val()
    $('#IndividualSelectpage').fadeIn(1000)
    $("#Mainpage").hide()
    addPlayer()
}
function playTeam()
{
    PNUM=Number($("#numselection option:selected").val())
    isTeam=true;
    $('#Selectpage').fadeIn(1000)
    $("#Mainpage").hide()

    addPlayer()
    teamSelection()
}
function addPlayer()
{
    for(var i=0;i<PNUM;++i)
    {
        players.push(new Swordsman(i,false))
    }
}

function teamSelection()
{
    if(PNUM<4) {$("#Selectpage h2").html(4-PNUM+" Computers are added to make teams")}
    CNUM=4-PNUM
    for(var i=PNUM;i<4;++i)
    {
        players.push(new Swordsman(i,true))
    }
    if(CNUM===1)
        {
            $("#p4choice p").html("Computer1")
        }
    if(CNUM===2)
        {
            $("#p3choice p").html("Computer1")
            $("#p4choice p").html("Computer2")
        }
    if(CNUM===3)
        {
            $("#p2choice p").html("Computer1")
            $("#p3choice p").html("Computer2")
            $("#p4choice p").html("Computer3")
        }
}
function setup()
{
    players[0].team=Number($('#p1choice input[name="p1team"]:checked').val())
    players[1].team=Number($('#p2choice input[name="p2team"]:checked').val())
    players[2].team=Number($('#p3choice input[name="p3team"]:checked').val())
    players[3].team=Number($('#p4choice input[name="p4team"]:checked').val())
    if(
        (players[0].team===players[1].team)&&
        (players[2].team===players[3].team)&&
        (players[1].team===players[3].team)
    )
        {
            alert("you must divide teams")
            $("#form").reset()
            teamSelection()
        }
    $('#TeamCheckpage').fadeIn(1000)
    $("#Selectpage").hide()
    for(var i=0;i<4;++i)
    {
        if(players[i].team===1)
        {redteams.push(players[i])}
        else
        {blueteams.push(players[i])}
    }
    for(var i=0;i<redteams.length;++i)
    {
        if(redteams[i].AI) {$("#redteam").append("<h4> (Computer)"+(redteams[i].turn+1) +"P </h4>")}
        else {$("#redteam").append("<h4>"+(redteams[i].turn+1) +"P </h4>")}
    }
    for(var i=0;i<blueteams.length;++i)
    {
        if(blueteams[i].AI) {$("#blueteam").append("<h4> (Computer)"+(blueteams[i].turn+1) +"P </h4>")}
        else {$("#blueteam").append("<h4>"+(blueteams[i].turn+1) +"P </h4>")}
    }

}
function startgame()
{
    if(players.length>=3){
      $(otherhpfrms[1]).show()
    }
    if(players.length===4){$(otherhpfrms[2]).show()
  }

    $('#Gamepage').show()
    $('#IndividualSelectpage').hide()
    $('#TeamCheckpage').hide()
    $("header").hide()
    drawboard()
    confirm("Game Started")
    showDiceBtn()


}


function drawboard()
{
var ctx=document.getElementById("board").getContext('2d')


    canvas.selection=false

    var board=new fabric.Image(document.getElementById("boardimg"),{
        left:0,top:0,
        lockMovementX: true, lockMovementY: true,
        hasControls: false,
        lockScalingX: true, lockScalingY:true,lockRotation: true,
        hoverCursor: "pointer"

    })
    canvas.setBackgroundImage(board)

    for(var i=0;i<PNUM;++i)
    {
      var p=new fabric.Image(document.getElementById("playerimg"),{
          left:(coordinates[0].x+diff[i][0]),top:(coordinates[0].y+diff[i][1]),width:300,height:400,
          lockMovementX: true, lockMovementY: true,
          hasControls: false,hasBorders:false,
          lockScalingX: true, lockScalingY:true,lockRotation: true,
          hoverCursor: "pointer",
          originX: 'center',
          originY: 'center'


      })

      canvas.add(p.scale(0.2))
      playerimgs.push(p)
    }
    for(var i=0;i<PNUM;++i)
    {
      var p=new fabric.Image(document.getElementById("targetimg"),
        {opacity:0,
          width:500,height:500,
          lockMovementX: true, lockMovementY: true,
          hasControls: false,
          lockScalingX: true, lockScalingY:true,lockRotation: true,
          hoverCursor: "pointer",
          originX: 'center',
        originY: 'center'
        })
        switch (i) {
          case 0:
          p.on('mousedown', function() {
            targetLocked(0)
          });
            break;
          case 1:
          p.on('mousedown', function() {
            targetLocked(1)
          });
            break;
          case 2:
          p.on('mousedown', function() {
            targetLocked(2)
          });
            break;
          case 3:
          p.on('mousedown', function() {
            targetLocked(3)
          });
            break;

        }


          canvas.add(p.scale(0.16))
          targetimgs.push(p)

    }

}
function nextTurn()
{
  hideSkillBtn()
  players[thisturn].coolDown3()

  thisturn+=1
  thisturn%=players.length
  if(players[thisturn].effects[2]<=0)
  {
  //
    showDiceBtn()

  }
  else {
    //stun
  }
}


function showDiceBtn()
{
  $("#mainhpframe").css("width",String(players[thisturn].MaxHP)+"px")
  $("#mainhp").css("width",String(players[thisturn].HP)+"px")
  var j=0;
  for(var i=0;i<players.length;++i)
  {

    if(i!==thisturn)
    {
      $(otherhpfrms[j]).css("width",String((players[i].MaxHP*0.6))+"px")
      $(otherhps[j]).css("width",String(players[i].HP*0.6)+"px")
      j+=1;
    }


  }
  $("#dicebtn").show()
}
var dicecount=0
function diceAnimation(){
    if(dicecount>10) return;
    dicecount+=1
    var d=Math.floor(Math.random()*6)+1
    $("#dicebtn").attr("src","dice/"+String(d)+".png");
    setTimeout(diceAnimation,60)


}
function throwDice()
{   dicecount=0
    diceAnimation()
    var dice=Math.floor(Math.random()*6)+1


    setTimeout(function()
    {
            $("#dicebtn").attr("src","dice/"+String(dice)+".png");
            setTimeout(function(){afterDice(dice)},900)
    },660)
}
function movePlayer(dice,count,pos)
{
  if((pos+count)>finishPos){return true}
  if(count>dice){return false}
  var x=coordinates[pos+count].x
  var y=coordinates[pos+count].y
  playerimgs[thisturn].animate('left', (x+diff[thisturn][0]), {
    onChange: canvas.renderAll.bind(canvas),
    duration: 100,
    easing: fabric.util.ease.easeOutCubic
  });
  playerimgs[thisturn].animate('top',(y+diff[thisturn][1]),{
    onChange: canvas.renderAll.bind(canvas),
    duration: 100,
    easing: fabric.util.ease.easeOutCubic
  });
  setTimeout(function(){return movePlayer(dice,count+1,pos)},100)
}
function tpPlayer(pos)
{
  playerimgs[thisturn].set({opacity:1})
  var x=coordinates[pos].x
  var y=coordinates[pos].y
  playerimgs[thisturn].set({left:(x+diff[thisturn][0]),top:0})

  playerimgs[thisturn].animate('top',(y+diff[thisturn][1]),{
    onChange: canvas.renderAll.bind(canvas),
    duration: 800,
    easing: fabric.util.ease.easeOutBounce
  });

}
function levitatePlayer()
{
  playerimgs[thisturn].animate('top',0,{
    onChange: canvas.renderAll.bind(canvas),
    duration: 500,
    easing: fabric.util.ease.easeInCubic
  });
  setTimeout(function(){playerimgs[thisturn].set({opacity:0})},500)

}

function afterDice(dice)
{
    $("#dicebtn").hide()
    var p=players[thisturn]
    if(p.effects[0]>0) {dice-=2}
    if(p.effects[1]>0) {dice+=2}

    END=p.move(dice)
    if(END) {
      gameOver()
    }
    p.coolDown1()
    //obstacle

    p.coolDown2()

    //basicattack

    skillcount=0
    showSkillBtn()

}
function showTarget(targets)
{
  $("#skillcancel").show()
  for(var t of targets)
  {
    var tr=t.turn
    var x=playerimgs[tr].get('left')
    var y=playerimgs[tr].get('top')
    targetimgs[tr].set({left:x,top:y,opacity:1,scaleY:2})
    targetimgs[tr].animate('scaleY',0.16,{
      onChange: canvas.renderAll.bind(canvas),
      duration: 500,
      easing: fabric.util.ease.easeOutBounce
    });

  }

  confirm("choose target")

}
function resetTarget()
{
  for(var t of targetimgs)
  {
    t.set({opacity:0,top:0,left:0})
    t.animate('scaleY',0.16,{
      onChange: canvas.renderAll.bind(canvas),
      duration: 100,
      easing: fabric.util.ease.easeOutCubic
    });
  }
  $("#skillcancel").hide()
  showSkillBtn()
}
function showSkillBtn()
{

  if(skillcount===4 || players[thisturn].effects[3]>0)
  {       //silent or used skill 4 times

    hideSkillBtn()

    nextTurn()
  }
  else {
    $("#nextturn").show()
    $("#skillbtns button").show()
  }

}
function hideSkillBtn()
{
  $("#skillbtns button").hide()
  $("#nextturn").hide()
}
function chooseSkill1()   //Q
{

    getSkill(1)
    showSkillBtn()
}
function chooseSkill2()     //W
{
  if(players[thisturn].level>=2)
  {
      getSkill(2)
  }
  else
  {

  }
  showSkillBtn()
}
function chooseSkill3()      //R
{
  if(players[thisturn].level>=3)
  {
    getSkill(3)
  }
  else
  {

  }
  showSkillBtn()
}
function getSkill(s)
{

  var p=players[thisturn]
  skilldmg=p.initSkill(s)
  if(skilldmg===-1){     //no cool

    showSkillBtn()
  }
  else if(skilldmg===0){        //non-target
    skillcount+=1
    showSkillBtn()
  }
  else {
    skillcount+=1
    players[thisturn].chooseTarget(skilldmg.range,s)

  }
}
function targetLocked(target)
{   var p=players[thisturn]
    skilldmg.func(target)
    var died=p.hitOneTarget(target,skilldmg,p.turn,skilldmg.skill)
  //  skilldmg=-1

    resetTarget()

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
