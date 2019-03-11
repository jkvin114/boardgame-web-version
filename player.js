function zero(val)
{
  if(val<0){return 0;}
  else {return val;}
}
function upperlimit(val,lim)
{
  if(val>lim){return lim}
  else{return val}

}
function decrement(val)
{
  return zero(val-1)
}


function player(turn,AI,char)
{
    this.AI=AI
    this.turn=turn
    this.name=""
    this.char=char
    this.team=true   //true when readteam
    this.location=0
    this.lastloc=0
    this.level=0;
    this.money=0;
    this.kill=0
    this.death=0;
    this.assist=0;

    this.invulnerable=false;
    this.HP=200;
    this.MaxHP=0;
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
    this.effects=[0,0,2,0,0,0,0,0]
      //0.slow 1.speed 2.stun 3.silent 4. shield  5.poison  6.radi  7.annuity 8.slave
    this.skilleffects=[[0,-1],[0,-1]]
    //0.blind,skill user`s turn   1.mushroom[dur,skill user`s turn]


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
    }
    this.move=function(dice)
    {
      this.lastloc=this.location
      this.location+=dice;

      return false
    }

    this.goto=function(location)
    {
      this.lastloc=this.location
      this.location=location;

    }
    this.isBehindOf=function(other)
    {
      return this.location<other.location
    }
    this.resetCooltime=function()
    {
      this.cooltime=[0,0,0]
    }


    this.changeMoney=function(m,manner)
    {
      switch(manner)
      {
        case 0://money earned
        case 1://money spend
        case 2://money taken

      }
      this.money+=m

    }
    this.changehealth=function(hp,maxhp)
    {
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
      if(m>0)
      {


      }
      else {

      }

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
    this.giveDamage=function(damage,skillfrom)
    {
      if(this.invulnerable){return false}
      var died=false;

      if(this.effects[6]>0){damage*=2;}
      if(damage<=1&&skfrom<0){damage=1;}

      damage-=this.shield
      if(damage<=0) {
        this.changeshield(damage);
        damage=0;
      }

      this.changehealth(-1*damage,0)



    }











}
