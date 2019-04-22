const Map=require('./map.js')
const server=require("./server.js")
const coordinates=Map.coordinates         //2d array of each position on board
const finishPos=Map.finish           //finish position
const muststop=Map.muststop
const respawn=Map.respawn


function upperlimit(val,lim)
{
  if(val>lim){return lim}
  else{return val}

}


var decrement= (val) => Math.max(val-1,0)
var distance=(p1,p2) => Math.abs(p1.pos-p2.pos)


function isAttackableCoordinate(c)
{
  if(coordinates[c].obs===-1||coordinates[c].obs===0)
  {
    return false
  }
  return true
}

//turn:number=>player[]



class player
{
    //turn:number,team:number,ai:boolean,char:str,name:str
    constructor(turn,team,ai,char,name)
    {
      this.players=null
      this.AI=ai
      this.turn=turn
      this.name=name
      this.char=char
      this.team=team   //0:readteam  1:blue
      this.pos=0
      this.lastpos=0
      this.dead=false
      this.level=3;
      this.money=0;
      this.kill=0
      this.death=0;
      this.assist=0;
      this.invulnerable=false;
      this.nextdmg=0;
      this.adamage=0;

      this.HP=150;
      this.MaxHP=150;
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
      this.stun=false
      this.effects=[0,0,0,0,0,0,0,0,0]
        //0.slow 1.speed 2.stun 3.silent 4. shield  5.poison  6.radi  7.annuity 8.slave

      //this.skilleffects=[[0,-1],[0,-1]]
      //0.blind,skill user`s turn   1.mushroom[dur,skill user`s turn]
      this.stats=[0,0,0,0,0,0,0]
      //0.damagetaken  1.damagedealt  2.healamt  3.moneyearned  4.moneyspent   5.moneytaken
      this.damagedby=[0,0,0,0]
      //for eath player, turns left to be count as assist(maximum 3)
    }
    getOpponents(turn)
    {
      return this.players.filter((a) => turn!==a.turn&&!a.dead)
    }

    isValidOpponent(other)  //true if it is itself or same team , false if individual game or in different team
    {
      if(other.invulnerable) {return false}
      if(this===other) {return false}
      if(this.team==='none') {return true}
      if(this.team!==other.team) {return true}
      return false
    }

    cool(s)
    {

      if(this.cooltime[s-1]>0&&!this.onoff[s-1])
      {
        return false
      }
      return true
    }

    coolDown1()
    {
      this.effects=this.effects.map(decrement)
      this.cooltime=this.cooltime.map(decrement)
      if(this.effects[5]>0){this.giveDamage(30,-1)}
      if(this.effects[7]>0){this.giveMoney(20)}
      if(this.effects[8]>0){this.giveDamage(80,-1)}
    }
    coolDown2()
    {

      if(this.effects[2]===0){
        this.stun=false}
      this.duration=this.duration.map(decrement)

    }
    coolDown3()
    {
    //  this.skilleffects=this.skilleffects.map(function(x){return [decrement(x[0]),x[1]]})

      this.damagedby=this.damagedby.map(decrement)
    }
    checkMuststop(dice)
    {
      for(let m of muststop)
      {
        if(this.pos<m&&this.pos+dice>m)
          return m-this.pos
      }
      return dice
    }

    move(di)
    {
      //this.giveAdmg()

      this.lastpos=this.pos
      this.pos+=di;
    }

    goto(pos,ignoreObstacle)
    {
      console.log("goto"+pos)
      //this.giveAdmg()
      this.effects[2]=0
      this.stun=false
      if(pos<0){pos=0}
      if(pos>=finishPos){gameOver()}
      var t=this.turn;
      server.tp(t,pos)

      if(!ignoreObstacle)
      {setTimeout(() => {
        //this.checkProjectile()
        this.obstacle(1)
        },1200
      )}
      this.lastpos=this.pos
      this.pos=pos;
    }
    isBehindOf(other)
    {
      return this.pos<other.pos
    }
    resetCooltime(list)
    {
      for(var i of list)
      {
        this.cooltime[i]=0
      }
    }

    changemoney(m,type)
    {
      if(m===0){return}

      switch(type)
      {
        case 0://money earned
          this.stats[3]+=m
          server.changeMoney(this.turn,m)
        //  indicateMoney(this.turn,m)
        break;
        case 1://money spend
          this.stats[4]+=(-1*m)
        break;
        case 2://money taken
          this.stats[5]+=(-1*m)
          server.changeMoney(this.turn,m)
        break;

      }
      this.money+=m
    }
    changehealth(hp,maxhp)
    { if(hp>0){this.stats[1]+=hp}
      else {this.stats[0]+=(-1*hp)}
      this.MaxHP+=maxhp
      this.HP=Math.min(this.HP+hp,this.MaxHP)
      server.changeHP(this.turn,hp,maxhp,this.HP,this.MaxHP)

    //  animateHP(this.turn,this.HP,this.MaxHP,hp)
    }
    changeshield(shield)
    {
      this.shield+=shield
    }
    giveAdmg()
    {
      if(this.nextdmg!==0)
      {
        this.giveDamage(this.nextdmg,-1)
        this.nextdmg=0
      }
    }
    obstacle(rec)
    {
      var obs=coordinates[this.pos].obs
      var others=this.getOpponents(this.turn)


      if(this.stun){return 'stun'}
    //  if(obs===-1){return 'finish'}
      if(obs===0){
        //this.store()
        this.effects[3]=1
        return 'store'
      }

      if(obs===1||obs===2||obs===3)
      {
        let money=coordinates[this.pos].money*10
        this.giveMoney(money)
        return;
      }
      switch(obs)
      {
        case 4:
        this.giveDamage(10,-1)
        break
        case 5:
        this.takeMoney(30)
        break;
        case 7:
        this.nextdmg=20
        break
        case 8:
        this.giveDamage(20,-1)
        break
        case 9:
        this.heal(50)
        break
        case 10:
        this.giveEffect('silent',1,0)
        break;
        case 11:
        this.resetCooltime([0,1,2])
        break;
        case 12:
        this.adamage=30;
        break
        case 13:
        this.giveEffect('stun',1,0)
        break
        case 14:
        var d=Math.floor(Math.random()*6)+1
        this.giveMoney(d*10)
        break;
        case 15:
        this.thief()
        break;
        case 16:
        this.giveEffect('slow',1,0)
        this.giveDamage(20,-1)
        break;
        case 17:
          this.giveDamage(20*others.length,-1)
          for(var o of others)
          {
            o.heal(20);
          }
          break;
        case 18:
          this.takeMoney(30*others.length,-1)
          for(var o of others)
          {
            o.giveMoney(30);
          }
          break;
        case 19:
          for(var o of others)
          {
            o.goto(this.pos,true);
          }
          break
        case 20:
          let target=this.nearestplayer()
          let pos=this.pos
          this.goto(target.pos,true)
          target.goto(pos,true)
          break
        case 21:
          //showTarget(others,true)
        break
        case 22:
        this.giveEffect('annuity',99999,0)
        break;
        case 23:
        this.takeMoney(30)
        this.giveDamage(30,-1)
        break;
        case 24:
        this.giveEffect('shield',99999,0)
        this.heal(70)
        break;
        case 25:
        this.giveEffect('shield',99999,0)
        break;
        case 26:
        this.nextdmg=70
        break;
        case 27:
        this.giveDamage(100,-1)
        break;
        case 28:
        this.giveEffect('stun',1,0)
        this.giveEffect('slow',2,1)
        break;
        case 29:
        this.giveEffect('poison',99999,0)
        break;
        case 30:
        this.giveDamage(Math.floor(this.HP/3))
        break;
        case 31:
        this.giveDamage(Math.floor((this.MaxHP-this.HP)/2))
        break;
        case 32:
        this.giveEffect('radi',2,0)
        break;
        case 33:
        var kidnap=confirm("Yes for 2 turn stun \n Cancel for HP -150")
        if(kidnap==true){this.giveEffect('stun',2,0)}
        else{this.giveDamage(150,-1)}
        break;
        case 34:
        this.giveEffect('slave',99999,0)
        break;
        case 35:
        this.giveEffect('stun',3,0)
        this.giveEffect('speed',4,1)
        break;
        case 36:
          this.goto(this.lastpos,false)
        break;


      }


      return 0
    }
    thief(){
      // TODO:
    }
    nearestplayer()
    {
      var dist=200
      var target=null;
      for(var p of this.players)
      {
        if(p!==this&&distance(this,p)<dist)
        {
          target=p
          dist=distance(this,p)
        }
      }
      return target;
    }

    giveEffect(e,dur,num)
    {

      var effectstring=['slow','speed','stun','silent','shield','poison','radi','annuity','slave']
      var effect=effectstring.indexOf(e);

      this.effects[effect]=dur
      console.log('stun')
      if(effect===2){this.stun=true}
      server.giveEffect(this.turn,effect,num)

      //indicateEffect(this.turn,effect,num)


    }

    giveMoney(m)
    {
      this.changemoney(m,0)
    }
    takeMoney(m)
    {
      this.changemoney(-1*m,2)
    }
    heal(h)
    {
      this.changehealth(h,0)

    }
    addMaxHP(m)
    {
      this.changehealth(m,m)
    }
    regen()
    {
      this.changehealth(this.regen,0)
    }
    absorb()
    {
      this.changehealth(this.absorb,0)
    }
    addShield(s)
    {
      this.changeshield(s)
    }
    addKill()
    {
      this.kill+=1
      this.changemoney(70,0)
    }
    giveDamage(damage,skillfrom)
    {
      if(this.invulnerable||damage===0){return false}
      var died=false;

      if(this.effects[6]>0){damage*=2;}
      if(damage<=1&&skillfrom<0){damage=1;}

      if(skillfrom>=0) {this.damagedby[skillfrom]=3}


      damage-=this.shield
      if(damage<=0) {
        this.changeshield(damage);
        damage=0;
      }

      this.changehealth(-1*damage,0)

      if(this.HP<=0)
      {
        this.die()
        if(skillfrom>=0)
        {
          this.players[skillfrom].addKill()
          var assists=this.assist()
        }
        return true
      }
      return false


    }
    die()
    {
      this.HP=0
      this.dead=true

      this.death+=1
      died=true

      this.effects.map(function(x){return 0;})
      this.duration.map(function(x){return 0;})
      this.invulnerable=true
      this.stun=false
      this.effects[3]=1
      this.pos=this.respawnPoint()
    //  playerDie(this.turn)
    }


    respawnPoint()
    {
      for(let i=respawn.length-1;i>=0;--i)
      {
        if(this.pos>=respawn[i]){return respawn[i]}
      }
    }


    respawn()
    {
      this.changehealth(this.MaxHP,0)
      this.dead=false
      playerRespawn(this.turn)
    }


    mergeDamage(Pdamage,Mdamage,arP,MP)
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
  assist()
    {
      var assists=[]
      for(let i=0;i<this.damagedby.lengh;++i)
      {
        if(this.damagedby[i]>0&&this.turn!=this.damagedby[i])
        {
          this.players[i].assist+=1
          this.players[i].changemoney(50,0)
          assists.push(this.players[i])
        }
      }
      return assists
    }
    basicAttack()
    {

      var range=0
      for(var p of this.players)
      {
        if(Math.abs(this.pos-p.pos)<=range&&!this.isValidOpponent(p))
        var died=this.hitBasicAttack(p)
        if(!died&&p.skilleffects[0][0]===0&&p.pos===this.pos&&p.turn!==this.turn)
        {
          p.hitBasicAttack(this)
        }
      }

    }
    hitBasicAttack(target)
    {
      var died=false;
      var totaldamage=target.mergeDamage(this.AD+10,0,this.arP,0)
      if(this.skilleffects[0][0]===0)
      {
        died=target.giveDamage(totaldamage,this.turn)

      }
      return died
    }
    avaliableTarget(range,skill)
    {
      var targets=[]

      for(let p of this.players){

        if(Math.abs(this.pos-p.pos)<=range&&this.isValidOpponent(p))
        {targets.push(p.turn)}

      }

      if(targets.length===0)
      {return 'notarget'}
      console.log(targets)
      return targets
      //target choosing
    }
    hitOneTarget(skillto,skilldmg)
    {
      //adamage
      let skill=skilldmg.skill
      this.stats[1]+=(skilldmg.pdmg+skilldmg.mdmg+skilldmg.fdmg)
      let died=this.players[skillto].skillHit(skilldmg,this.turn,skill)


    }
    skillHit(skilldmg,skillfrom,skill)
    {
      if(this.effects[4]>0)
      {
        this.effects[4]=0
        return false
      }
      var totaldamage=this.mergeDamage(skilldmg.pdmg,skilldmg.mdmg,this.players[skillfrom].arP,this.players[skillfrom].MP)
      totaldamage+=skilldmg.fdmg
      return this.giveDamage(totaldamage,skillfrom)

    }
    checkProjectile()
    {
      if(this.invulnerable){return;}
      let other=this.getOpponents(this.turn)
      for(let o of other)
      {
        if(o.projectile.activated&&o.projectile.scope.indexOf(this.pos)!==-1)
        {
          this.skillHit(o.projectile.damage,this.turn,o.projectile.skill)
          if(!this.dead){
            o.projectile.action.bind(this)()
          }
          o.projectile.reset()
        }
      }

    }


}

module.exports.player=player
