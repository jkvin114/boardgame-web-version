var sizes=[0.8,1,1.2,1.4,1.6,1.8]
var cursize=1

var canvas=new fabric.Canvas("board")
var PNUM=0;
var CNUM=0;
var isTeam=false;
var players=[];
var redteams=[]
var blueteams=[]
var playerimgs=[]
var targetimgs=[]
var obsimgs=[]
var obsimglist=document.getElementById("obswrapper").children
var hpindicator=$(".hpi").toArray()
var otherhpfrms=$(".otherhpfrm").toArray()
var otherhps=$(".otherhp").toArray()
var dmgindicator=[]
var moneyindicator=[]
var effectindicator=[]
var thisturn=0
var skilldmg=-1
var skillcount=0
var diff=[[4,7],[4,-7],[-17,7],[-17,-7]]
$("#dropdown a:nth-child(1)").click(
  function(){
    PNUM=1
    $("#Mainpage >h4").html("1 player")
  })
$("#dropdown a:nth-child(2)").click(
  function(){
    PNUM=2
    $("#Mainpage >h4").html("2 players")
  })
  $("#dropdown a:nth-child(3)").click(
    function(){
      PNUM=3
      $("#Mainpage >h4").html("3 players")
    })
  $("#dropdown a:nth-child(4)").click(
    function(){
      PNUM=4
      $("#Mainpage >h4").html("4 players")
    })
$('#individual').click(playIndividual)
$('#team').click(playTeam)
$("#submit").click(setup)
$(".confirm").click(startgame)
$("#dicebtn").click(throwDice)
$("#nextturn").click(nextTurn)
$("#skillcancel").click(resetTarget)
$("#skillbtns p:nth-child(1)").click(chooseSkill1)
$("#skillbtns p:nth-child(2)").click(chooseSkill2)
$("#skillbtns p:nth-child(3)").click(chooseSkill3)
$(".enlarge").click(function(){
    cursize+=1
   $("#board").css("transform","scale("+String(sizes[cursize])+")")

})
$(".shrink").click(function(){
   cursize=Math.max(0,cursize-=1)
  $("#board").css("transform","scale("+String(sizes[cursize])+")")

})
$(".addai").click(function(){
  var v=Number($(this).val())
  $("#IndividualSelectpage button:nth-child("+String(v)+")").hide()
  $("#IndividualSelectpage div:nth-child("+String(v+1)+")").show()
  CNUM+=1;

})


$("#FINISH").click(endgame)
// 0 상점 1,2,3 돈 4덫 5강도 6포탑 7지뢰 8 칼 9열매
// 10수면제 11물약 12마법성 13 거미줄
//  14도박 15도둑 16눈덩이 17흡혈 18소매 19소환 20위치교환 21
//  신손 22 연금 23날강도 24대피소 25방어막
//   26대전자 27살인법 28 독거미줄 29 썩은감자 30폭탄 31핵폭탄 32 방사능
//    33납치 34노예 35수용소 36 태풍 37카지노 38사형재판
const Map={
  "coordinates":
  [
    // {x:46,y:41,obs:-1,money:0},
    // {x:110,y:52,obs:1,money:1},
    // {x:163,y:44,obs:1,money:2},
    // {x:212,y:65,obs:2,money:5},
    // {x:268,y:70,obs:4,money:0},
    // {x:324,y:82,obs:3,money:10},
    // {x:354,y:131,obs:4,money:0},
    // {x:340,y:188,obs:9,money:0},
    // {x:286,y:199,obs:4,money:0},
    {x:46,y:41,obs:-1,money:0},
    {x:110,y:52,obs:13,money:1},
    {x:163,y:44,obs:7,money:2},
    {x:212,y:65,obs:7,money:5},
    {x:268,y:70,obs:13,money:0},
    {x:324,y:82,obs:7,money:10},
    {x:354,y:131,obs:13,money:0},
    {x:340,y:188,obs:13,money:0},
    {x:286,y:199,obs:13,money:0},

    {x:238,y:190,obs:1,money:2},
    {x:180,y:163,obs:3,money:7},
    {x:129,y:172,obs:1,money:1},
    {x:74,y:198,obs:5,money:0},
    {x:50,y:252,obs:4,money:0},
    {x:104,y:284,obs:2,money:5},
    {x:157,y:300,obs:3,money:8},
    {x:217,y:311,obs:0,money:0},
    {x:280,y:333,obs:15,money:0},
    {x:335,y:355,obs:5,money:0},
    {x:356,y:406,obs:3,money:8},
    {x:323,y:457,obs:1,money:2},
    {x:272,y:448,obs:2,money:5},
    {x:218,y:422,obs:2,money:6},
    {x:167,y:407,obs:7,money:0},
    {x:108,y:389,obs:9,money:0},
    {x:57,y:397,obs:8,money:0},
    {x:31,y:453,obs:2,money:6},
    {x:37,y:505,obs:1,money:3},
    {x:50,y:555,obs:8,money:0},
    {x:107,y:566,obs:3,money:7},
    {x:159,y:555,obs:2,money:6},
    {x:212,y:545,obs:1,money:2},
    {x:269,y:532,obs:13,money:0},
    {x:322,y:537,obs:1,money:1},
    {x:376,y:541,obs:5,money:0},
    {x:431,y:561,obs:18,money:0},
    {x:478,y:568,obs:17,money:0},
    {x:533,y:553,obs:3,money:9},
    {x:596,y:532,obs:0,money:0},
    {x:658,y:514,obs:16,money:0},
    {x:682,y:457,obs:2,money:4},
    {x:623,y:434,obs:11,money:0},
    {x:570,y:427,obs:12,money:0},
    {x:520,y:452,obs:17,money:0},
    {x:468,y:467,obs:2,money:5},
    {x:414,y:429,obs:13,money:0},
    {x:410,y:379,obs:21,money:0},
    {x:430,y:327,obs:12,money:0},
    {x:482,y:316,obs:18,money:0},
    {x:531,y:332,obs:2,money:5},
    {x:583,y:350,obs:16,money:0},
    {x:636,y:345,obs:20,money:0},
    {x:691,y:322,obs:19,money:0},
    {x:714,y:271,obs:1,money:2},
    {x:732,y:217,obs:3,money:8},
    {x:676,y:183,obs:11,money:0},
    {x:624,y:172,obs:12,money:0}, //casino begin
    {x:566,y:199,obs:14,money:0},
    {x:515,y:210,obs:22,money:0},
    {x:463,y:195,obs:3,money:8},
    {x:435,y:139,obs:3,money:9},
    {x:448,y:87,obs:3,money:10},
    {x:503,y:57,obs:2,money:6},
    {x:502,y:58,obs:3,money:9},
    {x:553,y:78,obs:3,money:8},
    {x:607,y:96,obs:14,money:0},
    {x:662,y:77,obs:22,money:0},
    {x:716,y:51,obs:2,money:6},
    {x:769,y:67,obs:2,money:5},
    {x:825,y:84,obs:3,money:7},
    {x:876,y:106,obs:2,money:4},
    {x:921,y:88,obs:12,money:0},
    {x:987,y:62,obs:0,money:0},
    {x:1018,y:119,obs:18,money:0},
    {x:1042,y:173,obs:21,money:0},
    {x:1018,y:222,obs:10,money:0},
    {x:965,y:209,obs:30,money:0},
    {x:919,y:194,obs:28,money:0},
    {x:860,y:210,obs:26,money:0},
    {x:813,y:223,obs:12,money:0},
    {x:789,y:276,obs:29,money:0},
    {x:837,y:300,obs:10,money:0},
    {x:891,y:291,obs:27,money:0},
    {x:946,y:281,obs:29,money:0},
    {x:995,y:294,obs:23,money:0},
    {x:1047,y:315,obs:24,money:0},
    {x:1035,y:363,obs:25,money:0},
    {x:980,y:376,obs:21,money:0},
    {x:929,y:375,obs:34,money:0},
    {x:875,y:368,obs:11,money:0},
    {x:824,y:361,obs:3,money:10},
    {x:773,y:377,obs:26,money:0},
    {x:750,y:432,obs:28,money:0},
    {x:801,y:456,obs:23,money:0},
    {x:854,y:440,obs:32,money:0},
    {x:907,y:449,obs:27,money:0},
    {x:961,y:461,obs:31,money:0},
    {x:1007,y:484,obs:20,money:0},
    {x:1035,y:530,obs:19,money:0},
    {x:982,y:563,obs:35,money:0},
    {x:931,y:547,obs:33,money:0},
    {x:876,y:538,obs:23,money:0},
    {x:824,y:538,obs:37,money:0},
    {x:750,y:546,obs:-1,money:0}
  ],
  "finish":104,
  "muststop":[16,38,71,101],
  "respawn":[0,16,38,53,71]
}


const coordinates=Map.coordinates         //2d array of each position on board
const finishPos=Map.finish           //num of finish position
const muststop=Map.muststop
const respawn=Map.respawn



function playIndividual()
{

    $('#IndividualSelectpage').fadeIn(1000)
    $("#Mainpage").hide()
    for(var i=0;i<PNUM;++i)
    {
      $("#IndividualSelectpage div:nth-child("+String(i+1)+")").show()
    }
    for(var i=3;i>=PNUM;--i)
    {
      $("#IndividualSelectpage button:nth-child("+String((2*i)+5)+")").css("display","block")
    }
    addPlayer()
}
function playTeam()
{

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
    $('#TeamCheckpage').css("display","grid")
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
        if(redteams[i].AI) {$("#redteam").append("<h2> (Computer)"+(redteams[i].turn+1) +"P </h2>")}
        else {$("#redteam").append("<h2>"+(redteams[i].turn+1) +"P </h2>")}
    }
    for(var i=0;i<blueteams.length;++i)
    {
        if(blueteams[i].AI) {$("#blueteam").append("<h2> (Computer)"+(blueteams[i].turn+1) +"P </h2>")}
        else {$("#blueteam").append("<h2>"+(blueteams[i].turn+1) +"P </h2>")}
    }
$("#blueteam > h2").css("margin","100px")
$("#redteam > h2").css("margin","100px")
}
function startgame()
{
  if(PNUM+CNUM<=1){
    alert("add more players")
    return;
  }

    if(!isTeam)
    {
      for(var i=PNUM;i<PNUM+CNUM;++i)
      {
          players.push(new Swordsman(i,true))
      }
    }

    if(players.length>=3){
      $(otherhpfrms[1]).show()
      $(hpindicator[2]).show()
    }
    if(players.length===4){
      $(otherhpfrms[2]).show()
      $(hpindicator[3]).show()
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
    for(var i=0;i<finishPos-1;++i)
    {
      var num=coordinates[i].obs
      var index=num;
      if(num===-1){index=0}         //-1,0

      var img=obsimglist.item(index)
      //$(obsimglist[index])

      var o=new fabric.Image(img,{

        lockMovementX: true,lockMovementY: true,
        hasControls: false,hasBorders:false,evented:false,
        lockScalingX: true,lockScalingY:true,lockRotation: true,
        originX: 'center',
        originY: 'center'
      })
      o.scale(0.3)
      canvas.add(o)
      obsimgs.push(o)
    }
    showObjects()

}

function showObjects()
{
    for(var i=0;i<obsimgs.length;++i)
    {
      obsimgs[i].set({top:(coordinates[i].y),left:(coordinates[i].x)})
    }

    canvas.renderAll()

    for(var i=0;i<players.length;++i)
    {
      var p=new fabric.Image(document.getElementById("playerimg"),{
          left:(coordinates[0].x+diff[i][0]),top:(coordinates[0].y+diff[i][1]),width:300,height:400,
          lockMovementX: true, lockMovementY: true,
          hasControls: false,hasBorders:false,evented:false,
          lockScalingX: true, lockScalingY:true,lockRotation: true,
          originX: 'center',
          originY: 'center'


      })

      canvas.add(p.scale(0.13))
      playerimgs.push(p)
    }
    for(var i=0;i<players.length;++i)
    {
      var p=new fabric.Image(document.getElementById("targetimg"),
        {opacity:0,
          width:500,height:500,
          lockMovementX: true, lockMovementY: true,
          hasControls: false,hasBorders:true,visible:false,
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
          p.on('selected', function() {
            targetLocked(3)
          });
            break;

        }


          canvas.add(p.scale(0.1))
          targetimgs.push(p)

          var d = new fabric.Text("", {
          fontSize: 40,fill:'#D81B60',
          opacity:1,fontWeight: 'bold',
          width:500,height:500,
          lockMovementX: true, lockMovementY: true,
          hasControls: false,
          evented:false,
          lockScalingX: true, lockScalingY:true,lockRotation: true,
          originX: 'center',
          originY: 'center',
          top:100,left:100
          });
          canvas.add(d)
          dmgindicator.push(d)


          m = new fabric.Text("", {
          fontSize: 40,fill:'orange',
          opacity:1,fontWeight: 'bold',
          width:500,height:500,
          lockMovementX: true, lockMovementY: true,
          hasControls: false,
          evented:false,
          lockScalingX: true, lockScalingY:true,lockRotation: true,
          originX: 'center',
          originY: 'center',
          top:100,left:100
          });
          canvas.add(m)
          moneyindicator.push(m)


    }

    for(var i=0;i<3;++i)
    {
        e = new fabric.Text("", {
        fontSize: 50,fill:'purple',
        opacity:1,fontWeight: 'bold',
        width:500,height:500,
        lockMovementX: true, lockMovementY: true,
        hasControls: false,
        evented:false,
        lockScalingX: true, lockScalingY:true,lockRotation: true,
        originX: 'center',
        originY: 'center',
        top:100,left:100
        });
        canvas.add(e)
        effectindicator.push(e)
    }



}
function nextTurn()
{
  console.log(players.length)
  hideSkillBtn()
  players[thisturn].coolDown3()

  thisturn+=1
  thisturn%=players.length

  showDiceBtn()
}


function showDiceBtn()
{

  $("#mainhpframe").css("width",String(players[thisturn].MaxHP*1.5)+"px")
  $("#mainhp").css("width",String(players[thisturn].HP*1.5)+"px")
  players[thisturn].hpframenum=0
  $("#uiside > div > h1").html(String(thisturn+1)+"P`s turn")
  $(hpindicator[0]).html(String(thisturn+1)+"P "+String(players[thisturn].MaxHP)+"/"+String(players[thisturn].HP))


  var j=0;
  for(var i=0;i<players.length;++i)
  {

    if(i!==thisturn)
    {
      players[i].hpframenum=j+1
      $(otherhpfrms[j]).css("width",String((players[i].MaxHP*1.3))+"px")
      $(otherhps[j]).css("width",String(players[i].HP*1.3)+"px")
      $(hpindicator[j+1]).html(String(players[i].turn+1)+"P "+String(players[i].MaxHP)+"/"+String(players[i].HP))
      j+=1;
    }


  }
  players[thisturn].invulnerable=false
  if(players[thisturn].effects[2]===0)
  {
    $("#dicebtn").attr("src","dice/1.png");
    $("#dicebtn").show()
  }
  else
  {
    manageStun()
  }

}
function manageStun()
{
  $("#dicebtn").attr("src","dice/stun.png");
  $("#dicebtn").show()
  setTimeout(function(){
      $("#dicebtn").hide()
      var p=players[thisturn]
      p.coolDown1()
      p.obstacle(0)
      p.coolDown2()

      //basicattack
      skillcount=0
      showSkillBtn()

  },1000)
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
{
  if(players[thisturn].effects[2]>0){return}
  canvas.renderAll()
  dicecount=0
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
function tpPlayer(target,pos)
{
  playerimgs[target].set({opacity:1})
  var x=coordinates[pos].x
  var y=coordinates[pos].y
  playerimgs[target].set({left:(x+diff[target][0]),top:0})

  playerimgs[target].animate('top',(y+diff[target][1]),{
    onChange: canvas.renderAll.bind(canvas),
    duration: 800,
    easing: fabric.util.ease.easeOutBounce
  });

}
function levitatePlayer(target)
{
  playerimgs[target].animate('top',0,{
    onChange: canvas.renderAll.bind(canvas),
    duration: 500,
    easing: fabric.util.ease.easeInCubic
  });
  setTimeout(function(){playerimgs[target].set({opacity:0})},500)
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


    setTimeout(function()
    {
      p.obstacle(0)
      p.coolDown2()

      //basicattack
      skillcount=0
      showSkillBtn()
    },dice*100)




}
function showTarget(targets)
{
  $("#skillcancel").show()
  for(var t of targets)
  {
    var tr=t.turn
    var x=playerimgs[tr].get('left')
    var y=playerimgs[tr].get('top')
    targetimgs[tr].set({left:x,top:y,opacity:1,scaleY:2,visible:true})
    targetimgs[tr].animate('scaleY',0.1,{
      onChange: canvas.renderAll.bind(canvas),
      duration: 500,
      easing: fabric.util.ease.easeOutBounce
    });

  }


}
function resetTarget()
{
  for(var t of targetimgs)
  {
    t.set({hasBorders:false,visible:false} )
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
  $("#nextturn").show()
//  if(skillcount===4 || players[thisturn].effects[3]>0)
  if(players[thisturn].effects[3]>0)
  {       //silent or used skill 4 times
    $("#noskill").show()
  }
  else {

    $("#skillbtns p").show()
  }

}
function hideSkillBtn()
{
  $("#skillbtns p").hide()
  $("#nextturn").hide()
  $("#noskill").hide()
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
    $("#mainhpframe").css("width",String(players[target].MaxHP*1.5)+"px")
    $("#mainhp").css("width",String(players[target].HP*1.5)+"px")
    $(hpindicator[0]).html(String(target+1)+"P "+String(players[target].MaxHP)+"/"+String(players[target].HP))
  }
  else{
    var frameindex=players[target].hpframenum-1
    $(otherhpfrms[frameindex]).animate({
      "width":String((maxhp*1.3))+"px"
    },300,function(){})

    $(otherhps[frameindex]).animate({
      "width":String(hp*1.3)+"px"
    },300,function(){})
    $(hpindicator[frameindex+1]).html(String(target+1)+"P "+String(players[target].MaxHP)+"/"+String(players[target].HP))


  }
  var x=playerimgs[target].get('left')
  var y=playerimgs[target].get('top')
  dmgindicator[target].set({top:(y),left:x,opacity:1})
  if(change<0){
    dmgindicator[target].set({fill:'#ff0000'})
    dmgindicator[target].set('text',String(change))

  }
  else
  {
    dmgindicator[target].set('fill','#00ff14')
    dmgindicator[target].set('text',('+'+String(change)))
  }
  dmgindicator[target].animate('opacity',0,{
    onChange: canvas.renderAll.bind(canvas),
    duration: 3000,
    easing: fabric.util.ease.easeOutCubic
  });
  dmgindicator[target].animate('top',(y-50),{
    onChange: canvas.renderAll.bind(canvas),
    duration: 3000,
    easing: fabric.util.ease.easeOutCubic
  });
}
function indicateMoney(target,money){
  var x=playerimgs[target].get('left')
  var y=playerimgs[target].get('top')
  moneyindicator[target].set({top:(y),left:x,opacity:1})


  if(money<0){
    moneyindicator[target].set({fill:'purple'})
    moneyindicator[target].set('text',String(money)+" gold")

  }
  else
  {
    moneyindicator[target].set('fill','orange')
    moneyindicator[target].set('text',('+'+String(money)+" gold"))
  }
  moneyindicator[target].animate('opacity',0,{
    onChange: canvas.renderAll.bind(canvas),
    duration: 3000,
    easing: fabric.util.ease.easeOutCubic
  });
  moneyindicator[target].animate('top',(y-50),{
    onChange: canvas.renderAll.bind(canvas),
    duration: 3000,
    easing: fabric.util.ease.easeOutCubic
  });

}
function indicateEffect(target,effect,num)
{
  var x=playerimgs[target].get('left')
  var y=playerimgs[target].get('top')
  var e=""
  switch(effect)
  {
    case 0:
      e="SLOW!"
      effectindicator[num].set({fill:'blue'})
    break;
    case 1:
      e="SPEED!"
      effectindicator[num].set({fill:'blue'})
    break;
    case 2:
      e="STUN!"
      effectindicator[num].set({fill:'purple'})
    break;
    case 3:
      e="SILENT!"
      effectindicator[num].set({fill:'purple'})
    break;
    case 4:
      e="SHIELD!"
      effectindicator[num].set({fill:'green'})
    break;
    case 5:
      e="POISON!"
      effectindicator[num].set({fill:'green'})
    break;
    case 6:
      e="RADIATION!"
      effectindicator[num].set({fill:'green'})
    break;
    case 7:
      e="ANNUITY!"
      effectindicator[num].set({fill:'green'})
    break;
    case 8:
      e="SLAVED!"
      effectindicator[num].set({fill:'red'})
    break;

  }




  effectindicator[num].set({top:(y-50-(num*50)),left:(x-50),opacity:1})
  effectindicator[num].set('text',e)

  effectindicator[num].animate('opacity',0,{
    onChange: canvas.renderAll.bind(canvas),
    duration: 3000,
    easing: fabric.util.ease.easeOutCubic
  });
  effectindicator[num].animate('top','-=50',{
    onChange: canvas.renderAll.bind(canvas),
    duration: 3000,
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
