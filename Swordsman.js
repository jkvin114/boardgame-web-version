function Swordsman(turn,AI)
{
  player.call(this,turn,AI,0)
  this.onoff=[false,false,false]
  this.usedQ=false;
  this.initSkill=function(s)
  {
    var skilldmg=-1  //-1 when can`t use skill, 0 when it`s not attack skill
    var skillto=-1
    var pdmg=0
    if(this.cool(s))
    {
      switch(s)
      {
        case 1:
          if(this.usedQ){
            //skillto=this.chooseTarget()
            skillto=1
            if(skillto!==-1)
            {

              skilldmg={"pdmg":Math.floor((20+this.AD)*0.5),"mdmg":0,"fdmg":0,"target":[skillto]}
              this.cooltime[0]=0
              this.usedQ=false
            }
          }
          else {
            //skillto=this.chooseTarget()
            skillto=1
            if(skillto!==-1)
            {
              skilldmg={"pdmg":Math.floor((20+this.AD)),"mdmg":0,"fdmg":0,"target":[skillto]}
              this.cooltime[0]=0
              this.usedQ=true
            }
          }
        break
        case 2:
          this.cooltime[s-1]=0
          skilldmg=0
          break
        case 3:
          //skillto=this.chooseTarget()
          skillto=1
          if(skillto!==-1)
          {
            skilldmg={"pdmg":Math.floor(30+this.AD),"mdmg":0,"fdmg":0,"target":[skillto]}
            this.cooltime[2]=0
            this.goto(players[skillto].pos)
          }
        break


      }
    }
    return skilldmg

  }



}

Swordsman.prototype=Object.create(player.prototype)
