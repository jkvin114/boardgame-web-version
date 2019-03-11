function Bird(turn,AI)
{
  player.call(this,turn,AI,0)
}

Bird.prototype=Object.create(player.prototype)
