function Bird(turn,AI)
{
  player.call(this,turn,AI,0)
  this.onoff=[false,false,false]

  this.choseSkill=function(skill,cool)
  {
    var skilldmg=-1  //-1 when can`t use skill, 0 when it`s not attack skill
    if(this.cool(s))
    {
      switch(s)
      {
        case 1:
        skilldmg=0
        break
        case 2:
        this.cooltime[s-1]=5
        this.duration[s-1]=3
        skilldmg=0
        break
        case 3:
        this.cooltime[s-1]=12
        this.duration[s-1]=8
        skilldmg=0
        break


      }
    }
    return skilldmg

  }



}

Bird.prototype=Object.create(player.prototype)
