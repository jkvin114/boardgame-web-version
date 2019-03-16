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
var dmgindicator=null
var thisturn=0
var skilldmg=-1
var skillcount=0
var diff=[[7,7],[7,-7],[-7,7],[-7,-7]]
const Map={
  "coordinates":
  [
    {x:46,y:41},
    {x:110,y:52},
    {x:163,y:44},
    {x:212,y:65},
    {x:268,y:70},
    {x:324,y:82},
    {x:354,y:131},
    {x:340,y:188},
    {x:286,y:199},
    {x:228,y:190},
    {x:180,y:163},
    {x:129,y:172},
    {x:74,y:198},
    {x:50,y:252},
    {x:104,y:284},
    {x:157,y:300},
    {x:217,y:311},
    {x:280,y:333},
    {x:335,y:335},
    {x:356,y:406},
    {x:323,y:457},
    {x:272,y:448},
    {x:167,y:407},
    {x:108,y:389},
    {x:57,y:397},
    {x:31,y:453},
    {x:37,y:505},
    {x:50,y:555},
    {x:107,y:566},
    {x:159,y:588},
    {x:212,y:545},
    {x:269,y:532},
    {x:322,y:537},
    {x:431,y:561},
    {x:478,y:568},
    {x:533,y:553},
    {x:596,y:532},
    {x:658,y:514},
    {x:682,y:457},
    {x:623,y:434},
    {x:570,y:427},
    {x:468,y:467},
    {x:434,y:429},
    {x:410,y:379},
    {x:430,y:327},
    {x:482,y:316},
    {x:531,y:332},
    {x:583,y:350},
    {x:636,y:345},
    {x:691,y:322},
    {x:714,y:271},
    {x:732,y:217},
    {x:676,y:183},
    {x:624,y:172},
    {x:566,y:199},
    {x:515,y:210},
    {x:463,y:195},
    {x:435,y:139},
    {x:448,y:87},
    {x:503,y:57},
    {x:502,y:58},
    {x:553,y:78},
    {x:607,y:96},
    {x:662,y:77},
    {x:716,y:51},
    {x:825,y:84},
    {x:876,y:106},
    {x:921,y:88},
    {x:987,y:62},
    {x:1018,y:119},
    {x:1042,y:173},
    {x:1018,y:222},
    {x:965,y:209},
    {x:919,y:194},
    {x:860,y:210},
    {x:813,y:223},
    {x:789,y:276},
    {x:837,y:300},
    {x:891,y:291},
    {x:946,y:281},
    {x:995,y:294},
    {x:1047,y:315},
    {x:1041,y:364},
    {x:980,y:376},
    {x:929,y:375},
    {x:875,y:368},
    {x:824,y:361},
    {x:773,y:377},
    {x:750,y:432},
    {x:801,y:456},
    {x:854,y:440},
    {x:907,y:449},
    {x:961,y:461},
    {x:1007,y:484},
    {x:1035,y:530},
    {x:982,y:563},
    {x:931,y:547},
    {x:876,y:538},
    {x:824,y:538},
    {x:750,y:546}
  ],
  "finish":101
  "muststop":[16,38,71,101]
  "respawn":[0,16,38,53,71]
}


const coordinates=Map.coordinates         //2d array of each position on board
const finishPos=101           //num of finish position
const muststop=Map.muststop
const respawn=Map.respawn



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

      canvas.add(p.scale(0.13))
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
          p.on('selected', function() {
            targetLocked(0)
          });
            break;
          case 1:
          p.on('selected', function() {
            targetLocked(1)
          });
            break;
          case 2:
          p.on('selected', function() {
            targetLocked(2)
          });
            break;
          case 3:
          p.on('mousedown', function() {
            targetLocked(3)
          });
            break;

        }


          canvas.add(p.scale(0.1))
          targetimgs.push(p)

    }
    dmgindicator = new fabric.Text("", {
    fontSize: 40,fill:'#D81B60',
    opacity:1,fontWeight: 'bold',
    width:500,height:500,
    lockMovementX: true, lockMovementY: true,
    hasControls: false,
    lockScalingX: true, lockScalingY:true,lockRotation: true,
    originX: 'center',
    originY: 'center',
    top:100,left:100
});
  canvas.add(dmgindicator)
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
  players[thisturn].hpframenum=0

  var j=0;
  for(var i=0;i<players.length;++i)
  {

    if(i!==thisturn)
    {
      players[i].hpframenum=j+1
      $(otherhpfrms[j]).css("width",String((players[i].MaxHP*0.9))+"px")
      $(otherhps[j]).css("width",String(players[i].HP*0.9)+"px")
      j+=1;
    }


  }
  players[thisturn].invulnerable=false

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
    targetimgs[tr].set({left:x,top:y,opacity:1,scaleY:2,hasBorders:true})
    targetimgs[tr].animate('scaleY',0.1,{
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
    t.set({opacity:0,top:600,left:1100,hasBorders:false}  )
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
function animateHP(target,hp,maxhp,change)
{
  if(target===thisturn)
  {
    $("#mainhpframe").css("width",String(players[target].MaxHP)+"px")
    $("#mainhp").css("width",String(players[target].HP)+"px")

  }
  else{
    var frameindex=players[target].hpframenum-1
    $(otherhpfrms[frameindex]).animate({
      "width":String((maxhp*0.9))+"px"
    },500,function(){})

    $(otherhps[frameindex]).animate({
      "width":String(hp*0.9)+"px"
    },500,function(){})



  }
  var x=playerimgs[target].get('left')
  var y=playerimgs[target].get('top')
  dmgindicator.set({top:(y),left:x,opacity:1})
  if(change<0){
    dmgindicator.set({fill:'#ff0000'})
    dmgindicator.set('text',String(change))

  }
  else
  {
    dmgindicator.set('fill','#00ff14')
    dmgindicator.set('text',('+'+String(change)))
  }
  dmgindicator.animate('opacity',0,{
    onChange: canvas.renderAll.bind(canvas),
    duration: 2000,
    easing: fabric.util.ease.easeOutCubic
  });
  dmgindicator.animate('top',(y-50),{
    onChange: canvas.renderAll.bind(canvas),
    duration: 2000,
    easing: fabric.util.ease.easeOutCubic
  });



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
