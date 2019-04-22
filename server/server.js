var http=require("http")
var express=require("express")
var session = require('express-session');
var url=require("url")
var path=require("path")
var fs=require("fs")
var mysql=require('mysql')
var crypto=require('crypto')
var bodyParser = require('body-parser');


const Game=require("./Game.js")
const player=require('./Player.js')
var game=null

var con=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"r3e7sk",
  database: "Userinfo"
})
con.connect(function(e){
  if(e) throw e
  console.log("connected to mysql DB")
})

//  var strategy=new LocalStrategy(function(id,password,done){
//    con.query("SELECT * FROM table1 WHERE id=?",[id],function(e,result){
//      if(e) throw e
//      if(results.length===0){
//        return done('wrong id!')
//      }
//
//
//    })
//
//  })
// passport.use(strategy)
// passport.serializeUser(function(user,done){
//   done(null,user.id)
// })
// passport.deserializeUser(function(id,done){
//   User.findById(id,function(e,user){
//     done(e,user)
//   })
// })



var app=express()
var multiplayer=true
var hosting=0
var guestnum=0
var host=null
var teamplay=false
var cards=['player_connected','none','none','none']
var playerlist=[]
var ai=[]
var teams=['none','none','none','none']
const clientPath = `${__dirname}/../client`;
console.log(`Serving static from ${clientPath}`);
var firstpage = fs.readFileSync(__dirname+'/../client/firstpage.html', 'utf8')
var bodyparser = bodyParser.urlencoded({ extended: false })
app.use(express.static(clientPath));
app.use(errorHandler)
const server=http.createServer(app)
const io=require("socket.io")(server)
io.on('connect',function(socket){
  console.log("client connected")
  if(host===null){
    host=socket
    playerlist.push(socket.id)
  }


  socket.on('cardupdate',function(card){
    hosting=card.reduce(function(num,val){
      if(val==='player'){num +=1}
      return num
    },0)
    cards=card
    console.log(cards)
    io.emit('cardupdate',cards)

  })
  socket.on('requestcard',function(){
    io.emit('cardupdate',cards)
    socket.emit('setturn',guestnum)
    io.emit('showguest',guestnum)
    if(playerlist.indexOf(socket.id)===-1){
      playerlist.push(socket.id)
    }
  })
  socket.on('kick',function(turn){
    guestnum-=1
    io.to(playerlist[turn]).emit('kicked')
    playerlist.splice(turn,1)
  })
  socket.on('setai',function(aiturn){
    ai=aiturn
    io.emit('setai',aiturn)
  })
  socket.on('requestAIturn',function(a){
    socket.emit('setai',ai)
  })
  socket.on('setcheckbox',function(check_status){
    teams=check_status
    socket.broadcast.emit('sendcheckbox',check_status)
  })
  socket.on('startgame',function(a){

    io.emit('startgame',"")
    game=new Game(teamplay)
    for(let i=0;i<cards.length;++i)
    {
      if(cards[i]==="player_connected")
      {
        game.addPlayer(playerlist[i],teams[i],0,(i+1)+"P")
      }
      else if(cards[i]==="ai")
      {
        game.addAI(teams[i],0,(i+1)+"P(computer)")
      }
    }

  })


  socket.on('requestsetting',function(n){
    io.emit('initialsetting',game.players)
  })
  socket.on('startGame',function(n){
    let t=game.firstTurn()
    if(!t){
      console.log("connecting incomplete")
    }
    else{
      io.emit('nextturn',t)
    }


  })
  socket.on('pressdice',function(n){
    let dice=game.rollDice()
    io.emit('rolldice',dice)
  })
  socket.on('checkobstacle',function(n){
    game.checkObstacle()

  })
  socket.on('obscomplete',function(n){
    if(game.players[game.thisturn].AI){
      setTimeout(()=>goNextTurn(),300)

    }
    else{
      let status=game.skillCheck()
      io.emit('skillready',status)
    }

  })

  socket.on('getskill',function(s){
    let result=game.initSkill(s)
    socket.emit('targets',result)
  })
  socket.on('sendtarget',function(target){
    let status=game.useSkill(target)

    setTimeout(()=>socket.emit('skillused',status),500)
  })

  socket.on('gonextturn',function(n){
    goNextTurn()

  })

})

function goNextTurn(){
  let t=game.nextTurn()
  io.emit('nextturn',t)
  if(t.ai&&!t.stun){
    let dice=game.rollDice()
    setTimeout(()=>io.emit('rolldice',dice),500)
  }
}

module.exports.changeHP=function(who,hp,maxhp,currhp,currmaxhp){
  io.emit('changehp',{
    turn:who,
    hp:hp,
    maxhp:maxhp,
    currhp:currhp,
    currmaxhp:currmaxhp
  })
}
module.exports.changeMoney=function(who,amt){
  io.emit('changemoney',{turn:who,amt:amt})
}
module.exports.giveEffect=function(who,effect,num){
  io.emit('effect',{turn:who,effect:effect,num:num})
}
module.exports.tp=function(who,pos){
  io.emit('teleport',{turn:who,pos:pos})
}





app.get('/mode_selection',function(req,res,next){
  var _url = req.url;
  var queryData = url.parse(_url, true).query;
  if(queryData.mode==='join'){
    if(hosting===0){
      res.end(firstpage)
      return
    }
    else{
      console.log("joined")
    }
  }


  if(queryData.mode==='join'){
    var html = fs.readFileSync(__dirname+'/../client/hostingpage_guest.html', 'utf8')
    guestnum+=1
    io.emit('addplayer',guestnum)

  }
  else{
    guestnum=0
    var html = fs.readFileSync(__dirname+'/../client/hostingpage_host.html', 'utf8')

  }
  res.end(html)
})

app.get('/check_players',function(req,res){
  var _url = req.url;
  var queryString=url.parse(_url, true).query
  var gamemode = queryString.gamemode;
  if(gamemode==='individual')
  {

  }
  else if(gamemode==='team'){
    teamplay=true
    var html = fs.readFileSync(__dirname+'/../client/teamselection.html', 'utf8')
  }
  else{     //for guests
    if(teamplay){
      var html = fs.readFileSync(__dirname+'/../client/teamselection.html', 'utf8')
      io.to(playerlist[queryString.turn]).emit('setturn_teamselection',queryString.turn)
    }
    else{

    }
  }
  res.end(html)
})

app.get('/login',function(req,res){
  var _url = req.url;
  var queryData = url.parse(_url, true).query;
  console.log(queryData)
  if(queryData.choice==='signin'){
    var html = fs.readFileSync(__dirname+'/../client/signin.html', 'utf8')
    res.end(html)
  }
  else if(queryData.choice==='signup'){
    var html = fs.readFileSync(__dirname+'/../client/signup.html', 'utf8')
    res.end(html)
  }


})

app.post('/signup',bodyparser,function(req,res){

  var html = fs.readFileSync(__dirname+'/../client/signup.html', 'utf8')
  if (!req.body) {
    res.end(html)
  }
  var id=req.body.id.toString()
  var pw=req.body.pw
  var pw2=req.body.pw2
  con.query("SELECT * FROM table1 WHERE id=?",[id],function(e,result){
    if(e){ throw e}
    console.log(result)
    if(result.length>0){
      //id duplicate
      console.log("id duplicate")
      res.end(html)
    }
    else if(pw!==pw2){
      console.log("password mismatch")
      res.end(html)
    }
    else
    {
      var hash=crypto.createHash('sha1')
      var salt=crypto.randomBytes(5).toString('hex')
      hash.update(pw+salt)
      var encryptedPW=hash.digest('hex')
      var d=new Date().toISOString().slice(0, 19).replace('T', ' ')
      con.query("INSERT INTO table1 (id,password,signUpDate,salt) values ('"+id+"','"+encryptedPW+"','"+d+"','"+salt+"')"
      ,function(e){
        if(e) throw e
      })
      res.writeHead(302,{Location:'/'})
      res.end()
    }
  })



})


app.post('/signin',bodyparser,function(req,res){
  var html = fs.readFileSync(__dirname+'/../client/signin.html', 'utf8')

  if (req.body===null) {
    res.end(html)
  }
  var id=req.body.id.toString()
  var pw=req.body.pw
  con.query("SELECT * FROM table1 WHERE id=?",[id],function(e,result){
       if(e) {throw e}
       if(result.length===0){
         console.log('wrong id!')
         res.end(html)
       }
       else{

         var hash=crypto.createHash('sha1')
         var salt=result[0].salt
         hash.update(pw+salt)
         var encryptedPW=hash.digest('hex')
         if(result[0].password===encryptedPW){
           console.log('logged in successfully')
           res.end(firstpage)
         }
         else{
           console.log("password mismatch")
           res.end(html)
         }



       }
     })

})
function errorHandler(err,req,res,next)
{
  res.send('error!!')
}

io.on('disconnect',function(socket){
  console.log("disconnected")

})

server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(8080, () => {
});
