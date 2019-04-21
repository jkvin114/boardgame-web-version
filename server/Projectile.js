var createImg=function(size)
{
  let imglist=[]
  for(let i=0;i<size;++i)
  {
    let l=new fabric.Image(document.getElementById("tileselect"),{
        left:0,top:0,
        lockMovementX: true, lockMovementY: true,visible:false,
        hasControls: false,hasBorders:false,
        lockScalingX: true, lockScalingY:true,lockRotation: true,
        originX: 'center',
        originY: 'center'
      })
      imglist.push(l)
      canvas.add(l)
  }
  return imglist
}

function Projectile(id,owner,size,skillrange,skill,func)
{
  this.id=id
  this.owner=owner
  this.size=size;
  this.skillrange=skillrange;
  this.skill=skill
  this.action=func;
  this.owneraction=function(){}
  this.damage={"pdmg":0,"mdmg":0,"fdmg":0}
  this.pos=-1
  this.activated=false
  this.scope=[]
  this.dur=0
  this.img=createImg(this.size)




  this.setProj=function(pdmg,mdmg,fdmg,dur)
  {
    this.dur=dur
    this.damage.pdmg=pdmg;
    this.damage.mdmg=mdmg;
    this.damage.fdmg=fdmg;
  }
  this.placeProj=function(pos)
  {
    this.pos=pos
    this.activated=true
    canvas.bringToFront(this.img[0])
    let c=0
    let i=0;
    while(i<this.size&&c<finishPos)
    {
      if(isAttackableCoordinate(pos+c))
      {
        this.img[i].set({left:coordinates[pos+c].x,top:coordinates[pos+c].y,visible:true,evented:true})
        this.scope.push(pos+c)
        i+=1
      }
      c+=1
    }
    canvas.renderAll()
  }
  this.reset=function()
  {
    this.pos=-1
    this.scope=[]
    this.activated=false
    for(let i of this.img)
    {
      i.set({visible:false,evented:false})
    }
    this.damage.pdmg=0;
    this.damage.mdmg=0;
    this.damage.fdmg=0;
    this.dur=0

  }
  this.projCooldown=function()
  {
    if(this.dur===1)
    {
      this.reset()
    }
    this.dur=decrement(this.dur)
  }



}
