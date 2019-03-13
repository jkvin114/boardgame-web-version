var sizes=[0.8,1,1.2,1.4,1.6,1.8]
var cursize=1
$('#individual').click(playIndividual)
$('#team').click(playTeam)
$("#submit").click(setup)
$(".confirm").click(startgame)
$("#dicebtn").click(throwDice)
$("#nextturn").click(nextTurn)
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

var thisturn=0
var skillcount=0
const Map={
  "coordinates":
  [
  {"x":138,"y":178},
  {"x":258,"y":178},
  {"x":378,"y":178},
  {"x":510,"y":178},
  {"x":647,"y":178},
  {"x":778,"y":178},
  {"x":967,"y":178}
  ],
  "finish":7
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
    var playerimgs=[]
    for(var i=0;i<PNUM;++i)
    {
      var p=new fabric.Image(document.getElementById("playerimg"),{
          left:(coordinates[0].x),top:(coordinates[0].y),width:300,height:400,
          lockMovementX: true, lockMovementY: true,
          hasControls: false,
          lockScalingX: true, lockScalingY:true,lockRotation: true,
          hoverCursor: "pointer"


      })
      canvas.add(p.scale(0.2))
      playerimgs.push(p)
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
  $("#dicebtn").show()
}

function throwDice()
{
    $("#dicebtn").hide()
    var p=players[thisturn]

    dice=1
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

    Skill(1)
    showSkillBtn()
}
function chooseSkill2()     //W
{
  if(players[thisturn].level>=2)
  {
      Skill(2)
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
    Skill(3)
  }
  else
  {

  }
  showSkillBtn()
}
function Skill(s)
{

  var p=players[thisturn]
  var skilldmg=p.initSkill(s)
  if(skilldmg===-1){     //no cool

    showSkillBtn()
  }
  else if(skilldmg===0){        //non-target
    skillcount+=1
    showSkillBtn()
  }
  else {
    skillcount+=1
    for(var j=0;j<skilldmg.target.length;++j)
    {
      //p.hitOneTarget(j,skilldmg,p.turn,s)
    }
  }


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
function runGame(players,team)
{
  var turn=0;
  var END=false
  while(!END)
    {
      var obs= -1;

      for(var p of players)
      {
        if(p.effects[2]<=0)
        {
          diceval=0
          throwDice()
          var dice=diceval
          if(p.effects[0]>0) {dice-=2}
          if(p.effects[0]>0) {dice+=2}
          confirm(dice)
          END=p.move(dice)
          if(END) {break;}
        }
        else {
        //  alert("stun")
        }

        p.coolDown1()

        //obstacle

        p.coolDown2()

        //skill
        for(var i=0;i<4;++i)
        {



          if(p.effects[3]>0){alert("silent!"); break;}

          var skill=0
          if(skill===2 && p.level<2){continue;}
          if(skill===3 && p.level<3){continue;}



          skilldmg=p.initSkill(skill)
          if(skilldmg===-1){continue;}
          if(skilldmg===0){
            continue
          }
          for(var j=0;j<skilldmg.target.length;++j)
          {
            p.hitOneTarget(j,skilldmg,p.turn,skill)
          }

        }
        p.coolDown3()

      }
      break;
    }

}
function endgame(){
  hideSkillBtn()
  $("#dicebtn").hide()
}
function gameOver(){}
