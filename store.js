$(".storebtn").click(function(){
  $("#store").show(500,"swing")
  $(".overlay").show(0)
})
$("#storeclose").click(
  ()=>{$("#store").hide(500,"swing")
  $(".overlay").hide()
  }
)

$(".buymenu li:nth-child(1)").click(()=>selectBuy(1))
$(".buymenu li:nth-child(2)").click(()=>selectBuy(2))
$(".buymenu li:nth-child(3)").click(()=>selectBuy(3))
$(".buymenu li:nth-child(4)").click(()=>selectBuy(4))
$(".buymenu li:nth-child(5)").click(()=>selectBuy(5))
const list=$("#buy").children().toArray()
function selectBuy(n)
{
  $("#sell").hide()
  $("#home").hide()

  $(".shown").hide()
  $(".shown").removeClass("shown")
  $(list[n-1]).show()
  $(list[n-1]).addClass("shown")
}
function hidebuy()
{
    $(".shown").hide();
}
$(".sell").click(function(){
  $("#home").hide()
  hidebuy()
  $("#sell").show()
})
$(".home").click(function(){
  hidebuy()
  $("#sell").hide()
  $("#home").show()
})
