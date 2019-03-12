var sizes=[0.8,1,1.2,1.4,1.6,1.8]
var cursize=1
$('#individual').click(playIndividual)
$('#team').click(playTeam)
$("#submit").click(setup)
$(".confirm").click(startgame)
$(".enlarge").click(function(){
    cursize+=1

   $("#board").css("transform","scale("+String(sizes[cursize])+")")

})
$(".shrink").click(function(){
   cursize=Math.max(0,cursize-=1)
  $("#board").css("transform","scale("+String(sizes[cursize])+")")

})

var canvas=new fabric.Canvas("board")
var PNUM=0;
var CNUM=0;
var isTeam=false;
var players=[];
var redteams=[]
var blueteams=[]

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
        players.push(new Bird(i,false))
    }
}

function teamSelection()
{
    if(PNUM<4) {$("#Selectpage h2").html(4-PNUM+" Computers are added to make teams")}
    CNUM=4-PNUM
    for(var i=PNUM;i<4;++i)
    {
        players.push(new Bird(i,true))
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
    //runGame(players,redteams,blueteams,isTeam)

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

    var p=new fabric.Image(document.getElementById("playerimg"),{
        left:500,top:10,width:300,height:500,
        lockMovementX: true, lockMovementY: true,
        hasControls: false,
        lockScalingX: true, lockScalingY:true,lockRotation: true,
        hoverCursor: "pointer"

    })

    canvas.add(p.scale(0.2))

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
function runGame(players,red,blue,team)
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
          var dice=Math.floor(Math.random()*6)+1;
          if(p.effects[0]>0) {dice-=2}
          if(p.effects[0]>0) {dice+=2}
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
          var skill=0
          if(p.effects[3]>0){alert("no skill!"); break;}
          if(skill===2 && p.level<2){continue;}
          if(skill===3 && p.level<3){continue;}


        }
        p.coolDown3()
        break;
      }
    }

}
