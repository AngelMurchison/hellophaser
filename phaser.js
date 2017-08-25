var game = new Phaser.Game(800, 366, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
})
var score = 0
var scoreText

function preload() {
  game.load.image('sky', 'img/sky.png')
  game.load.image('ground', 'img/platform.png')
  game.load.image('star', 'img/star.png')
  game.load.spritesheet('dude', 'img/dude.png', 32, 48)
  // When 32, 48, you get full spritesheet. VIOLATION (yellow) in console.
  game.load.spritesheet('baddie', 'img/baddie.png', 32, 32)
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE)
  sky = game.add.sprite(0, 0, 'sky')
  // {player}
  player = game.add.sprite(400, game.world.height - 300, 'dude')
  game.physics.arcade.enable(player)
  player.body.bounce.y = 0.1
  player.body.gravity.y = 300
  player.body.collideWorldBounds = true
  // watch. (its sort of difficult to tell which frame is which.)
  player.animations.add('left', [0, 1, 2, 3], 10, true)
  player.animations.add('right', [5, 6, 7, 8], 10, true)

  // {baddie}
  baddie = game.add.sprite(32, game.world.height - 240, 'baddie')
  game.physics.arcade.enable(baddie)
  baddie.body.bounce.y = 0.2
  baddie.body.gravity.y = 301
  baddie.body.collideWorldBounds = true
  baddie.animations.add('left', [0, 1], 10, true)
  baddie.animations.add('right', [2, 3], 10, true)
  baddie.body.velocity.x = 100

  // [stars]
  stars = game.add.group()
  stars.enableBody = true
  for (var i = 0; i < 100; i++) {
    var star = stars.create(i * 15, 0, 'star')
    star.body.gravity.y = 10 + Math.random() * 6
    star.body.bounce.y = 0.6 + Math.random() * 0.2
  }

  // [platforms]
  platforms = game.add.group()
  platforms.enableBody = true
  var ground = platforms.create(0, game.world.height - 64, 'ground')
  var ledge01 = platforms.create(400, 200, 'ground')
  var ledge02 = platforms.create(-150, 175, 'ground')
  ground.scale.setTo(2, 2)
  ledge01.body.immovable = true
  ledge02.body.immovable = true
  ground.body.immovable = true
  scoreText = game.add.text(12, 12, 'Score: 0', {
    fontSize: '24px',
    fill: '#000'
  })
}

function update() {
  player.body.velocity.x = 0


  // {physics}
  game.physics.arcade.collide(player, platforms)
  game.physics.arcade.collide(baddie, platforms)
  game.physics.arcade.collide(stars, platforms)
  game.physics.arcade.overlap(
    player,
    stars,
    (player, star) => {
      star.kill()
      score += 10
      scoreText.text = 'Score: ' + score
    },
    null
  )
  game.physics.arcade.overlap(player, baddie, () => {
    player.kill()
    scoreText.text = 'Press space to try again!'
  })

  // {cursors}
  cursors = game.input.keyboard.createCursorKeys()
  if (cursors.up.isDown && player.body.touching.down) {
    player.body.velocity.y = -350
  }
  if (cursors.left.isDown) {
    player.body.velocity.x = -150
    player.animations.play('left')
  } else if (cursors.right.isDown) {
    player.body.velocity.x = 150
    player.animations.play('right')
  } else {
    player.animations.stop()
    player.frame = 4
  }

  // {baddie stuff}
  let spacebar = game.input.keyboard.addKey(32)
  if(spacebar.isDown && !player.alive){
      baddie.kill()
      preload()
      create()
    }
  
  if(baddie.body.blocked.right){
    baddie.body.velocity.x = -100
  }else if(baddie.body.blocked.left){
    baddie.body.velocity.x = 100
  }

}


window.onload = function (){
  let sideBar = document.querySelector('.sideBar')
  let showMenuButton = document.querySelector('#showButton')
  showMenuButton.addEventListener('click', () => {
    sideBar.classList.toggle('menu-show')
  })

   
}
