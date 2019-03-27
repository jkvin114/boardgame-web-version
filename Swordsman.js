function Swordsman(turn,AI)
{
  player.call(this,turn,AI,0)
  this.onoff=[false,false,false]
  this.usedQ=false;
  this.projectile=new Projectile(0,this,6,30,1,function(){
    this.goto(this.pos-5,true)
    this.stun=true
  })
  this.initSkill=function(s)
  {
    var skillattr=-1  //-1 when can`t use skill, 0 when it`s not attack skill
    var skillto=-1
    var pdmg=0
    var i=this.turn

    if(this.cool(s))
    {
      switch(s)
      {
        case 1:
          if(this.usedQ){
              var f=function(skillto){this.cooltime[0]=2
                                this.usedQ=false}.bind(this)
              skillattr={"pdmg":Math.floor((20+this.AD)*0.5),"mdmg":0,"fdmg":0,"range":100,"skill":1,"func":f,"nontarget":false}

          }
          else {
            var f=function(skillto){this.cooltime[0]=0
                              this.usedQ=true}.bind(this)
            skillattr={"pdmg":Math.floor((20+this.AD)),"mdmg":0,"fdmg":0,"range":100,"skill":1,"func":f,"nontarget":false}
          }
        break
        case 2:

          this.projectile.setProj(30,0,0,2)
          var f=function(){this.cooltime[1]=3}.bind(this)
          skillattr={"proj":this.projectile,"nontarget":true,"func":f}
          break
        case 3:
          //skillto=this.chooseTarget()
          var f=function(skillto){this.cooltime[2]=2
                            this.goto(players[skillto].pos,false)}.bind(this)
          skillattr={"pdmg":Math.floor((30+this.AD)),"mdmg":0,"fdmg":0,"range":100,"skill":3,"func":f,"nontarget":false}
        break


      }
    }
    return skillattr

  }



}

Swordsman.prototype=Object.create(player.prototype)
