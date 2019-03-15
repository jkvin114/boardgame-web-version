
function upperlimit(val,lim)
{
  if(val>lim){return lim}
  else{return val}

}
function decrement(val)
{
  return Math.max(val-1,0)
}



function player(turn,AI,char)
{
    this.AI=AI
    this.turn=turn
    this.name=""
    this.char=char
    this.team=true   //true when readteam
    this.pos=0
    this.lastpos=0
    this.level=3;
    this.money=0;
    this.kill=0
    this.death=0;
    this.assist=0;

    this.invulnerable=false;
    this.HP=200;
    this.MaxHP=200;
    this.AD=0;
    this.AP=0;
    this.AR=0;
    this.MR=0;
    this.arP=0
    this.MP=0;
    this.regen=0;
    this.absorb=0;
    this.shield=0;
    this.cooltime=[0,0,0]
    this.duration=[0,0,0]
    this.effects=[0,0,0,0,0,0,0,0]
      //0.slow 1.speed 2.stun 3.silent 4. shield  5.poison  6.radi  7.annuity 8.slave
    this.skilleffects=[[0,-1],[0,-1]]
    //0.blind,skill user`s turn   1.mushroom[dur,skill user`s turn]
    this.stats=[0,0,0,0,0,0,0]
    //0.damagetaken  1.damagedealt  2.healamt  3.moneyearned  4.moneyspent   5.moneytaken
    this.damagedby=[0,0,0,0]
    //for eath player, turns left to be count as assist(maximum 3)
    this.isSameTeam=function(other)  //true if it is itself or same team , false if individual game or in different team
    {
      if(this===other) {return true}
      if(!isTeam) {return false}
      if(this.team!==other.team) {return false}
      return true

    }

    this.cool=function(s)
    {
      if(this.cooltime[s-1]>0&&!this.onoff[s-1])
      {
        alert("no cool")
        return false
      }
      return true
    }

    this.coolDown1=function()
    {
      this.effects=this.effects.map(decrement)
      this.cooltime=this.cooltime.map(decrement)


    }
    this.coolDown2=function()
    {
      this.duration=this.duration.map(decrement)

    }
    this.coolDown3=function()
    {
      this.skilleffects=this.skilleffects.map(function(x){return [decrement(x[0]),x[1]]})
      this.damagedby=this.damagedby.map(decrement)
    }


    this.move=function(di)
    {
      var end=movePlayer(di,1,this.pos)
      if(end||this.pos+1>=finishPos) {return true}

      this.lastpos=this.pos
      this.pos+=di;
      return false
    }

    this.goto=function(pos)
    {
      if(pos>finishPos){gameOver()}
      levitatePlayer()

      setTimeout(function(){tpPlayer(pos)},700)

      this.lastpos=this.pos
      this.pos=pos;
    }
    this.isBehindOf=function(other)
    {
      return this.pos<other.pos
    }
    this.resetCooltime=function()
    {
      this.cooltime=[0,0,0]
    }

    this.changemoney=function(m,type)
    {
      switch(type)
      {
        case 0://money earned
          this.stats[3]+=m
        break;
        case 1://money spend
          this.stats[4]+=(-1*m)
        break;
        case 2://money taken
          this.stats[5]+=(-1*m)
        break;

      }
      this.money+=m

    }
    this.changehealth=function(hp,maxhp)
    { if(hp>0){this.stats[1]+=hp}
      else {this.stats[0]+=(-1*hp)}
      this.MaxHP+=maxhp
      this.HP=Math.min(this.HP+hp,this.MaxHP)

    }
    this.changeshield=function(shield)
    {
      this.shield+=shield
    }
    this.giveMoney=function(m)
    {
      this.changemoney(m,0)
    }
    this.takeMoney=function(m)
    {
      this.changemoney(-1*m,2)
    }
    this.heal=function(h)
    {
      this.changehealth(h,0)

    }
    this.addMaxHP=function(m)
    {
      this.changehealth(m,m)
    }
    this.regen=function()
    {
      this.changehealth(this.regen,0)
    }
    this.absorb=function()
    {
      this.changehealth(this.absorb,0)
    }
    this.addShield=function(s)
    {
      this.changeshield(s)
    }
    this.addKill=function()
    {
      this.kill+=1
      this.changemoney(70,0)
    }
    this.giveDamage=function(damage,skillfrom)
    {
      if(this.invulnerable){return false}
      var died=false;

      if(this.effects[6]>0){damage*=2;}
      if(damage<=1&&skfrom<0){damage=1;}

      this.damagedby[skillfrom]=3


      damage-=this.shield
      if(damage<=0) {
        this.changeshield(damage);
        damage=0;
      }

      this.changehealth(-1*damage,0)

      if(this.HP<=0)
      {
        this.changehealth(this.MaxHP,0)
        this.death+=1
        died=true

        this.effects.map(function(x){return 0;})
        this.duration.map(function(x){return 0;})
        this.invulnerable=true
        players[skillfrom].addKill()
        var assists=this.assist()
      }
      return died


    }
    this.mergeDamage=function(Pdamage,Mdamage,arP,MP)
    {
      var totaldamage = 0
      if (arP <= this.AR)  // arP<=AR
      {
          if( Pdamage - (this.AR - arP) > 0)
            {totaldamage += (Pdamage - (this.AR - arP))}
      }
      else { totaldamage += Pdamage}    //arP<=AR

      if (MP <= this.MR)
      {
          if (Mdamage - (this.MR - MP) > 0)
              {totaldamage += (Mdamage - (this.MR - MP))}
      }
      else {totaldamage += Mdamage}

      return totaldamage;

    }
    this.assist=function()
    {
      var assists=[]
      for(var i=0;i<this.damagedby.lengh;++i)
      {
        if(this.damagedby[i]>0&&this.turn!=this.damagedby[i])
        {
          players[i].assist+=1
          players[i].changemoney(50,0)
          assists.push(players[i])
        }
      }
      return assists
    }
    this.basicAttack=function()
    {

      var range=0
      for(var p of players)
      {
        if(Math.abs(this.pos-p.pos)<=range&&this.isSameTeam(p))
        var died=this.hitBasicAttack(p)
        if(!died&&p.skilleffects[0][0]===0&&p.pos===this.pos&&p.turn!==this.turn)
        {
          p.hitBasicAttack(this)
        }
      }

    }
    this.hitBasicAttack=function(target)
    {
      var died=false;
      var totaldamage=target.mergeDamage(this.AD+10,0,this.arP,0)
      if(this.skilleffects[0][0]===0)
      {
        died=target.giveDamage(totaldamage,this.turn)

      }
      return died
    }
    this.chooseTarget=function(range,skill)
    {
      var targets=[]
      for(var p of players){

        if(Math.abs(this.pos-p.pos)<=range&&!this.isSameTeam(p))
          {targets.push(p)}

      }
      if(targets.length===0)
      {return -1}

      showTarget(targets)
      //target choosing
    }
    this.hitOneTarget=function(skillto,skilldmg,skillfrom,skill)
    {
      //adamage
      this.stats[1]+=(skilldmg.pdmg+skilldmg.mdmg+skilldmg.fdmg)
      died=players[skillto].skillHit(skilldmg,skillfrom,skill)


    }
    this.skillHit=function(skilldmg,skillfrom,skill)
    {
      if(this.effects[4]>0)
      {
        this.effects[4]=0
        return false
      }
      var totaldamage=this.mergeDamage(skilldmg.pdmg,skilldmg.mdmg,players[skillfrom].arP,players[skillfrom].MP)
      totaldamage+=skilldmg.fdmg
      return this.giveDamage(totaldamage,skillfrom)

    }


}
