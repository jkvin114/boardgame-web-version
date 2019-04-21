//const player=require("./Player.js")
const swordsman=require("./Swordsman.js")

class Game
{
  constructor(isteam)
  {
    this.players=[]
    this.clients=[]
    this.totalturn=0;
    this.isTeam=isteam
    this.PNUM=0
    this.CNUM=0
    this.totalnum=0
    this.thisturn=0
    this.skilldmg=-1
    this.skillcount=0
    this.godhandtarget=-1
    this.clientsReady=0

  }

  //client:Socket(),team:number,char:str,name:str
  addPlayer(client,team,char,name)
  {
    let p=new swordsman(this.totalnum,team,false,char,name)
    this.players.push(p)
    this.PNUM+=1
    this.totalnum+=1
    this.clients.push(client)
  }

  //team:number,char:str,name:str
  addAI(team,char,name)
  {
    this.players.push(new swordsman(this.totalnum,team,true,char,name))
    this.CNUM+=1
    this.totalnum+=1
    this.clients.push("ai")
  }

  //()=>{turn:number,stun:boolean}
  firstTurn(){
    for(let p of this.players){
      p.players=this.players
    }

    let p=this.players[0]

           //if this is first turn ever
    this.clientsReady+=1
    if(this.clientsReady!==this.PNUM){
      return false;
    }
    return {
      turn:p.turn,
      stun:p.stun,
      ai:p.AI
    }


  }

  nextTurn()
  {
    let p=this.players[this.thisturn]

    p.coolDown3()
    this.thisturn+=1
    this.totalturn+=1
    this.thisturn%=this.totalnum

    p=this.players[this.thisturn]
    p.coolDown1()
    p.invulnerable=false
    if(p.dead)
    {
    //  p.respawn()
    }
    return {
      turn:p.turn,
      stun:p.stun,
      ai:p.AI
    }
  }

  //()=> {dice:number,actualdice:number,currpos:number,turn:number}
  rollDice()
  {

    let p=this.players[this.thisturn]
    if(p.stun){return 'stun'}
    let d=Math.floor(Math.random()*6)+1
    let dice=d
    if(p.effects[0]>0) {dice-=2}
    if(p.effects[1]>0) {dice+=2}
    dice=p.checkMuststop(dice)
    let currpos=p.pos;
    p.move(dice)
    return {
      dice:d,
      actualdice:dice,
      currpos:currpos,
      turn:this.thisturn
    }
  }
  checkObstacle()
  {

    let p=this.players[this.thisturn]

    let result=p.obstacle(0)
    if(result==='store'){

    }
    p.coolDown2()


  }

  //()=>{turn:number,silent:number,cooltime:number[],duration:number[]}
  skillCheck(){
    let p=this.players[this.thisturn]
    return this.getSkillStatus()

  }

  initSkill(skill){
    let p=this.players[this.thisturn]
    let skilldmg=p.initSkill(Number(skill))
    if(skilldmg===-1){return 'nocool'}
    let targets=p.avaliableTarget(skilldmg.range,skilldmg.skill)
    if(targets==='notarget'){return 'notarget'}

    this.skilldmg=skilldmg
    return targets

  }
  useSkill(target){
    let p=this.players[this.thisturn]
    this.skilldmg.onSkillUse(target)

    p.hitOneTarget(target,this.skilldmg)
    return this.getSkillStatus()

  }
  getSkillStatus(){
    let p=this.players[this.thisturn]
    return {
      turn:this.thisturn,
      silent:p.effects[3],
      cooltime:p.cooltime,
      duration:p.duration,
      level:p.level
    }
  }










}

module.exports=Game
