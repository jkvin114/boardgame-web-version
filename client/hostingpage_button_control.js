
//플레이어 1명일시 못시작하게
var switch_player=$(".swap_player").toArray()
var switch_ai=$(".swap_ai").toArray()
var playercard=$(".connected").toArray()
var waitingcard=$(".waiting").toArray()
var playerkick=$(".kick_player")
var aicard=$(".aicard").toArray()
var addai=$(".addai").toArray()

sessionStorage.turn=0
sessionStorage.aiturn=[]
sessionStorage.status=null
var aiturn=[]
var myturn=0
var PNUM=1
var CNUM=0
var activeplayer=1
var card=['player_connected','none','none','none']

$("#renew").click(function(){
  getCard()
  $(".mainbtn").show()
  $("#renew").hide()

  //다음 클라이언트에 연결시 감지할 수 있게함
  sessionStorage.status="hosting"
})
$(".addai").click(function(){
  sessionStorage.status="hosting"
  var v=Number($(this).val())
  $(addai[v]).hide()
  $(aicard[v]).show()
  addAI(v)
  setCard(card)


  if(PNUM+CNUM===4){
    $("#team").attr("disabled",false)
  }
})
$(".kick").click(function(){
  var v=Number($(this).val())
  $(aicard[v]).hide()
  $(addai[v]).show()
  removeAI(v)
  $("#team").attr("disabled",true)
  setCard(card)
})
$(".kick_player").click(function(){
  var v=Number($(this).val())
  $(playercard[v]).hide()
  $(addai[v]).show()
  PNUM-=1
  card[v]='none'
  $("#team").attr("disabled",true)
  $(playerkick[v-1]).hide()
  setCard(card)
  kickPlayer(v)
})
$("#individual").click(function(){
  submitTeamSelection()
})


for(let i=0;i<switch_player.length;++i)
{
  $(switch_player[i]).click(function(){
    $(aicard[i+1]).hide()
    $(waitingcard[i+1]).show()
    removeAI(i+1)
    card[i+1]='player'

    $("#team").attr("disabled",true)
    setCard(card)
  })
}
for(let i=0;i<switch_ai.length;++i)
{
  $(switch_ai[i]).click(function(){
    $(waitingcard[i+1]).hide()
    $(aicard[i+1]).show()
    addAI(i+1)

    setCard(card)
  })
}

function addplayer(){
  for(let i=0;i<waitingcard.length;++i)
  {
    if(card[i]==='player')
    {
      card[i]='player_connected'
      PNUM+=1
      $(waitingcard[i]).hide()
      $(playercard[i]).show()
      break
    }
  }
  if(PNUM+CNUM===4){
    $("#team").attr("disabled",false)
  }

  updateCard(card)
  setCard(card)
}
function showGuest(guestnum){

  $(playerkick[guestnum-1]).show()
}

function updateCard(cards){
  for(let i=0;i<cards.length;++i)
  {
    switch(cards[i])
    {
      case "player_connected":
        $(playercard[i]).show()
      break;
      case "player":
        $(waitingcard[i]).show()
      break;
      case "ai":
        $(aicard[i]).show()
      break;
      case "none":
        $(aicard[i]).hide()
        $(playercard[i]).hide()
        $(waitingcard[i]).hide()
      break;
    }
  }

}
function addAI(turn){
  card[turn]='ai'
  CNUM+=1
  aiturn.push(turn)
  sessionStorage.aiturn=aiturn
}
function removeAI(turn){
  CNUM-=1
  card[turn]='none'
  aiturn.splice(aiturn.indexOf(turn),1)
  sessionStorage.aiturn=aiturn
}
function setTurn(turn)
{
  console.log("myturn"+turn)
  myturn=turn
  $(playercard[turn]).css("border","7px solid blue")
}
function startGame()
{
  window.location.href='/gamepage.html'
}
