var canvas=null
const sizes=[0.5,0.6,0.8,1,1.2,1.4,1.6,1.8]
var cursize=3
var dmgindicator=[]
var moneyindicator=[]
var effectindicator=[]
var activetiles=[]
var playerimgs=[]
var targetimgs=[]
var skilldmg=-1
var skillcount=0
var godhandtarget=-1
const diff=[[6,7],[4,-7],[-15,7],[-17,-7]]
var tiles=[]
var tilehover=null
var obsimglist=null
var tilelist=null
var shadow=null
$(document).ready(function(e){

  console.log("board")
  obsimglist=document.getElementById("obswrapper").children
  tilelist=document.getElementById("tilewrapper").children
  shadow=new fabric.Image(document.getElementById("shadow"),{
      left:0,top:0,
      lockMovementX: true, lockMovementY: true,visible:false,
      hasControls: false,hasBorders:false,evented:false,
      lockScalingX: true, lockScalingY:true,lockRotation: true,
  })

  canvas=new fabric.Canvas("board")
  $(".zoomin").click(function(){
      cursize=Math.min(sizes.length-1,cursize+=1)
      canvas.setZoom(sizes[cursize])
    // $("#board").css("transform","scale("+String(sizes[cursize])+")")
      canvas.setWidth(1320*sizes[cursize])
      canvas.setHeight(720*sizes[cursize])
  })

  $(".zoomout").click(function(){
     cursize=Math.max(0,cursize-=1)
     canvas.setZoom(sizes[cursize])
  //  $("#board").css("transform","scale("+String(sizes[cursize])+")")
  canvas.setWidth(1320*sizes[cursize])
  canvas.setHeight(720*sizes[cursize])

  })

//  sethpframe()
})
// canvas.on('mouse:move', function(opt) {
//   if(this.isDragging)
//   {
//     var e = opt.e;
//     this.viewportTransform[4] += e.clientX - this.lastPosX;
//     this.viewportTransform[5] += e.clientY - this.lastPosY;
//     this.requestRenderAll();
//     this.lastPosX = e.clientX;
//     this.lastPosY = e.clientY;
//   }
//
// });

function playersToFront()
{
  for(var p of playerimgs)
  {
    p.bringToFront()
  }
  canvas.renderAll()
}
function chooseTile(index)
{
  let tile=0
  if(index>0&&index<16)
  {
    tile=index%2
  }
  else if(index>16&&index<38)
  {
    tile=2+(index%3)
  }
  else if(index>38&&index<54)
  {
    tile=5+(index%2)
  }
  else if(index>=54&&index<72)
  {
    tile=7
  }
  else if(index>72)
  {
    tile=8+(index%2)
  }
  return tile
}

function drawboard()
{

    canvas.selection=false

    var board=new fabric.Image(document.getElementById("boardimg"),{
        left:0,top:0,
        lockMovementX: true, lockMovementY: true,
        hasControls: false,
        lockScalingX: true, lockScalingY:true,lockRotation: true,
        hoverCursor: "pointer"
    })
    canvas.setBackgroundImage(board)
    canvas.setZoom(1.2)
    for(let i=0;i<finishPos;++i)
    {
      let index=coordinates[i].obs
    //  let index=num;
      if(index===-1||index===0){
        tiles.push(null)
        continue
      }         //-1,0

      let img=obsimglist.item(index)

      let o=new fabric.Image(img,{
        originX: 'center',
        originY: 'center'
      })
      let tile=tilelist.item(chooseTile(i))

      let t=new fabric.Image(tile,{
        originX: 'center',
        originY: 'center'
      })
      o.scale(0.3)
      let group=new fabric.Group([t,o],{evented:false,
      })
      lockFabricObject(group)
      canvas.add(group)
      tiles.push(group)
      group.sendToBack()

    }
     canvas.add(shadow)
     shadow.bringForward()
     showObjects()
}

function showObjects()
{

    for(let i=0;i<tiles.length;++i)
    {
      if(tiles[i]===null) {continue}
      tiles[i].set({top:(coordinates[i].y),left:(coordinates[i].x)})
    }

    canvas.renderAll()

    for(let i=0;i<game.S;++i)
    {
      let img=document.getElementById("playerimg"+(i+1))


      let p=new fabric.Image(img,{
          left:(coordinates[0].x+diff[i][0]),top:(coordinates[0].y+diff[i][1]),evented:false,
      })
      lockFabricObject(p)
      canvas.add(p.scale(0.1))
      p.bringToFront();
      playerimgs.push(p)
    }
    for(let i=0;i<game.S;++i)
    {
      let p=new fabric.Image(document.getElementById("targetimg"),
        {opacity:0,
          width:500,height:500,
          visible:false,
          hoverCursor: "pointer",
        })
        lockFabricObject(p)


        canvas.add(p.scale(0.1))
        targetimgs.push(p)
        p.bringToFront();

        let d = new fabric.Text("", {
        fontSize: 40,fill:'#D81B60',
        opacity:1,fontWeight: 'bold',
        width:500,height:500,
        evented:false,
        top:100,left:100,
        fontFamily:'Bangers'
        });
        lockFabricObject(d)
        canvas.add(d)
        d.bringToFront();
        dmgindicator.push(d)


        let m = new fabric.Text("", {
        fontSize: 40,fill:'orange',
        opacity:1,fontWeight: 'bold',
        width:500,height:500,
        evented:false,
        top:100,left:100,
        fontFamily:'Bangers'
        });
        lockFabricObject(m)
        canvas.add(m)
        m.bringToFront();
        moneyindicator.push(m)


    }

    for(let i=0;i<3;++i)
    {
        e = new fabric.Text("", {
        fontSize: 50,fill:'purple',
        opacity:1,fontWeight: 'bold',
        width:500,height:500,evented:false,
        top:100,left:100,
        fontFamily:'Bangers'
        });
        lockFabricObject(e)
        canvas.add(e)
        canvas.moveTo(e, 1);
        effectindicator.push(e)
    }
   var alarm = new fabric.Text("1P is slain by 2P", {
    fontSize: 100,fill:'black',
    opacity:1,fontWeight: 'bold',
    width:500,height:500,evented:false,visible:false,
    fontFamily:'Bangers'
    });
    lockFabricObject(alarm)
    alarm.set({top:150,left:500})
    canvas.add(alarm)


}
function lockFabricObject(obj){
  obj.set({lockMovementX: true, lockMovementY: true,
  hasControls: false,hasBorders:false,
  lockScalingX: true, lockScalingY:true,lockRotation: true,
  originX: 'center',
  originY: 'center',})
}
function alarm(text)
{

}

function movePlayer(dice,count,pos,turn)
{
  if((pos+count)>finishPos){
    moveComplete(true)
    return;
  }
  if(count>dice){
    moveComplete(false)
    return;
  }
  var x=coordinates[pos+count].x
  var y=coordinates[pos+count].y
  playerimgs[turn].animate('left', (x+diff[turn][0]), {
    onChange: canvas.renderAll.bind(canvas),
    duration: 100,
    easing: fabric.util.ease.easeOutCubic
  });
  playerimgs[turn].animate('top',(y+diff[turn][1]),{
    onChange: canvas.renderAll.bind(canvas),
    duration: 100,
    easing: fabric.util.ease.easeOutCubic
  });

  setTimeout(function(){movePlayer(dice,count+1,pos,turn)},100)
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



  function animateHP(target,hp,maxhp,change)
  {
      let ui=game.turn2ui(target)
      $(hpframe[ui]).animate({
        "width":String((maxhp*2))+"px"
      },300,function(){})

      $(hpspan[ui]).animate({
        "width":String(hp*2)+"px"
      },300,function(){})
      let name=$(names[ui]).html().split(" ")[0]
      $(names[ui]).html(name+" "+String(hp)+"/"+String(maxhp))

    var x=playerimgs[target].get('left')
    var y=playerimgs[target].get('top')
    dmgindicator[target].set({top:(y),left:x,opacity:1}).bringToFront()
    if(change<0){
      dmgindicator[target].set({fill:'#ff0000'})
      dmgindicator[target].set('text',String(change))
      if(change>-50){
        dmgindicator[target].set('fontSize',50)
      }
      else if(change>-300)
      {
        dmgindicator[target].set('fontSize',60)
      }
      else
      {
        dmgindicator[target].set('fontSize',85)
      }
    }
    else
    {
      dmgindicator[target].set('fill','green')
      dmgindicator[target].set('text',('+'+String(change)))
      dmgindicator[target].set('fontSize',50)
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
    moneyindicator[target].set({top:(y),left:x,opacity:1}).bringToFront()
    moneyindicator[target].set('fontSize',40)
    if(money<0)
    {
      moneyindicator[target].set({fill:'purple'})
      moneyindicator[target].set('text',String(money)+" gold")

    }
    else
    {
      moneyindicator[target].set('fill','orange')
      moneyindicator[target].set('text',('+'+String(money)+" gold"))
      if(money>50)
      {
        moneyindicator[target].set('fontSize',50)
      }
      if(money>90)
      {
        moneyindicator[target].set('fontSize',70)
      }
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
    console.log(effect)
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




    effectindicator[num].set({top:(y-50-(num*50)),left:(x-50),opacity:1}).bringToFront()
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

  function showTarget(targets,godhand)
  {
    disableSkillBtn()
    //if(!godhand) {
    $("#skillcancel").show()
    canvas.discardActiveObject()
    for(let tr of targets)
    {
      var x=playerimgs[tr].get('left')
      var y=playerimgs[tr].get('top')
      var tL= () => targetLocked(tr,godhand)
      targetimgs[tr].on('selected',tL);
      targetimgs[tr].set({left:(x+10),top:y,opacity:1,scaleY:2,visible:true})
      targetimgs[tr].animate('scaleY',0.1,{
        onChange: canvas.renderAll.bind(canvas),
        duration: 500,
        easing: fabric.util.ease.easeOutBounce
      });

    }


  }
  function resetTarget()
  {
    for(let t of targetimgs)
    {
      t.set({hasBorders:false,visible:false} )
      t.off()
      t.animate('scaleY',0.16,{
        onChange: canvas.renderAll.bind(canvas),
        duration: 100,
        easing: fabric.util.ease.easeOutCubic
      });

    }
    $("#skillcancel").hide()
  }

  function liftTile(index,godhand)
  {
    if(tiles[index]===null||index>=tiles.length||index<0) {return}
    activetiles.push(index)


    var select= () => tileSelected(index,godhand)
    tiles[index].on('selected',select)
    // var hover= function(){
    //   tilehover.set({left:coordinates[index].x,top:coordinates[index].y,visible:true})
    //   console.log(index)
    //   canvas.renderAll()
    // }
    // var dehover= function(){
    //   tilehover.set({visible:false})
    //   canvas.renderAll()
    // }

  //  tiles[index].on('mouse:over',hover)
    //tiles[index].on('mouse:out',dehover)
    tiles[index].set({hoverCursor:"pointer",evented:true})

    tiles[index].bringToFront()

    tiles[index].animate('top','-=10',{
      onChange: canvas.renderAll.bind(canvas),
      duration: 1000,
      easing: fabric.util.ease.easeOutCubic
    });


  }
  function tileSelected(index,godhand)
  {
    if(tiles[index]===null||index>=tiles.length||index<0) {return}

    tileReset()
    if(godhand){
      godhandtarget.goto(index,true)
      godhandtarget=-1
    }
    else{
      skilldmg.proj.placeProj(index)
      skilldmg.func()
    }
    showSkillBtn()
  }
  function tileReset()
  {
    $("#projectilecancel").hide()
    canvas.discardActiveObject()
    playersToFront()
    for(var t of activetiles)
    {
      tiles[t].off()
      tiles[t].sendToBack()
      tiles[t].set({hoverCursor:"defalut",evented:false})
      tiles[t].animate('top','+=10',{
        onChange: canvas.renderAll.bind(canvas),
        duration: 1000,
        easing: fabric.util.ease.easeOutCubic
      });
    }
    shadow.set({visible:false})
    shadow.sendToBack()
    canvas.renderAll()
    activetiles=[]
  }
