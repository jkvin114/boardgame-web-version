function Swordsman(turn,AI)
{
  player.call(this,turn,AI,0)
  this.onoff=[false,false,false]
  this.usedQ=false;
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
              var f=function(skillto){players[i].cooltime[0]=0
                                players[i].usedQ=false}
              skillattr={"pdmg":Math.floor((20+this.AD)*0.5),"mdmg":0,"fdmg":0,"range":100,"skill":1,"func":f}

          }
          else {
            var f=function(skillto){players[i].cooltime[0]=0
                              players[i].usedQ=true}
            skillattr={"pdmg":Math.floor((20+this.AD)),"mdmg":0,"fdmg":0,"range":100,"skill":1,"func":f}
          }
        break
        case 2:
          this.cooltime[s-1]=0
          skillattr=0
          break
        case 3:
          //skillto=this.chooseTarget()
          var f=function(skillto){players[i].cooltime[2]=0
                            players[i].goto(players[skillto].pos)}
          skillattr={"pdmg":Math.floor((30+this.AD)),"mdmg":0,"fdmg":0,"range":100,"skill":3,"func":f}
        break


      }
    }
    return skillattr

  }



}

Swordsman.prototype=Object.create(player.prototype)
