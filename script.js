$('#individual').click(playIndividual)
$('#team').click(playTeam)
$("#submit").click(setup)
$(".confirm").click(startgame)

var PNUM=0;
var CNUM=0;
var isTeam=false;
var players=[];
var redteams=[]
var blueteams=[]
function player(turn,AI)
{
    this.AI=AI
    this.turn=turn
    this.name=""
    this.character=0
    this.team=true   //true when readteam

}
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
        players.push(new player(i,false))
    }
}

function teamSelection()
{
    if(PNUM<4) {$("#Selectpage h2").html(4-PNUM+" Computers are added to make teams")}
    CNUM=4-PNUM
    for(var i=PNUM;i<4;++i)
    {
        players.push(new player(i,true))
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
   
}

function drawboard()
{
var ctx=document.getElementById("board").getContext('2d')

    var canvas=new fabric.Canvas("board")
    
    
    var board=new fabric.Image(document.getElementById("boardimg"),{
        left:0,top:0,
        lockMovementX: true, lockMovementY: true,
        hasControls: false,
        lockScalingX: true, lockScalingY:true,lockRotation: true,
        hoverCursor: "pointer"

    })
    canvas.setBackgroundImage(board.scale(0.6))
    
    var p=new fabric.Image(document.getElementById("playerimg"),{
        left:500,top:10,width:300,height:500,
        lockMovementX: true, lockMovementY: true,
        hasControls: false,
        lockScalingX: true, lockScalingY:true,lockRotation: true,
        hoverCursor: "pointer"

    })
    
    canvas.add(p.scale(0.2))

  
//    $("#boardside").append("<div id='testbtn'> TEST </div>").css({"cursor":"pointer","position":"absolute","top":"100px","right":"100px"})
//    
//    $("#testbtn").click(function(){
//         p.animate('left', "400");
//        p.animate("top","200",{ onChange: canvas.renderAll.bind(canvas),duration:500})
//    })
}






