$("document").ready(function(){

var animate = window.requestAnimateFrame = function (callback) {
  window.setTimeout(callback, 1000/30);
};

var canvas = document.createElement("canvas");
var width = 800;
var height = 400;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

window.onload  = function() {
  //animate();
  context.fillStyle = "#5c94fc";
  context.fillRect(0, 0, 800, 400);
  context.fillStyle = "black";
  context.fillRect(0, 380, 800, 20);
  render(step);
  console.log("Animating");

  ion.sound({
    sounds: [
      {name: "die"},
      {name: "jump"},
      {name: "stomp"},
      {name: "worldclear"},
      {name: "mariotheme"}
    ],
    volume: 1.0,
    path: "./ion/sounds/",
    preload: true
  });
  ion.sound.play("mariotheme");
};

var render = function () {
    context.fillStyle = "#5c94fc";
    mario.update();
    //context.fillRect(0, 0, width, height);
};

function Italian() {
  this.x = 30;
  this.y = 1;
  this.score = 0;
  this.lives = 3;
  //RIGHT is 1
  //LEFT is 2
  this.direction = 1;
}

Italian.prototype.update = function() {
  var imgStanding = document.getElementById("marioStanding");
  var imgJumping = document.getElementById("marioJumping");
  var imgStandingLeft = document.getElementById("marioStandingLeft");
  var imgJumpingLeft = document.getElementById("marioJumpingLeft");
  var gameOver = document.getElementById("gameOver");
  var mariogameover = document.getElementById("mariogameover");
  var img;
  $("#lives").html(this.lives + " x");
  $("#score").html(mario.score + "/500 Points");

  if (this.score >= 500) {
    var tardis = new Tardis();
  }
  if (this.lives <= 0) {
    console.log("Game Over!");
    this.lives = 0;
    context.drawImage(gameOver, 250, 10);
    ion.sound.play("worldclear");
  }
  context.fillStyle = "#5c94fc";
  context.fillRect(this.x, this.y, 30, 30); // context.drawImage(imgNothing, this.x, this.y);
  if ((this.y >= 350) && (this.direction === 1)){
    this.y = 350;
    img = imgStanding;
  } else if ((this.y >= 350) && (this.direction === 2)) {
    this.y = 350;
    img = imgStandingLeft;
  } else if ((this.y < 350) && (this.direction === 1)) {
    this.y += 1;
    img = imgJumping;
  } else if ((this.y < 350) && (this.direction === 2)) {
    this.y += 1;
    img = imgJumpingLeft;
  }
  context.drawImage(img,this.x,this.y);
};

Italian.prototype.move = function (ev) {
  //move the italian
  context.fillRect(this.x, this.y, 30, 30);
  if (this.y < 30) {
    this.y = 30;
  } else {
  this.y -= 50;
  ion.sound.play("jump");
  }
};

Italian.prototype.moveLeft = function(ev) {
  this.direction = 2;
  if (this.x > 30) {
    context.fillRect(this.x, this.y, 30, 30);
    this.x -= 10;
  }
};

Italian.prototype.moveRight = function(ev) {
  this.direction = 1;
  if (this.x < 770) {
    context.fillRect(this.x, this.y, 30, 30);
    this.x += 10;
  }
};

function Tardis() {
  this.x = (Math.floor(Math.random() * 700) + 50);
  this.y = (Math.floor(Math.random() * 300) + 50);
  this.x = 750;
  this.y = 326;
}
Tardis.prototype.update = function() {
  if (mario.score < 500) {
    return;
  }
  var tardis = document.getElementById("tardis");
  var levelcleared = document.getElementById("levelcleared");
  context.drawImage(tardis,this.x,this.y);
  if (((mario.x) > (this.x -1)) && ((mario.y) > (this.y))) {
    console.log("Level Cleared!!!");
    context.drawImage(levelcleared, 200, 150);
    setTimeout(function() {
      $("body").empty();
      $("body").append('<img src="./Images/win.gif"/>');
    }, 3000);
    //Include Level Cleared
    ion.sound.play("worldclear");
  }
};

function Enemy() {
  this.x = 750;
  this.y = 50;
}

Enemy.prototype.update = function() {
  var bullet = document.getElementById("bullet");
  if (this.x < 5) {
    context.fillRect(this.x, this.y, 33, 30);
    // console.log("Bullets re-creating?");
    this.x = 800;
    var that = this;
    // setTimeout(function() {that.move(); }, 500);
    // setTimeout(function() {bullet.move(); }, 750);
    setTimeout(function() {bullet1.move(); }, 1500);
    setTimeout(function() {bullet2.move(); }, 2500);
    setTimeout(function() {bullet3.move(); }, 3500);
    setTimeout(function() {bullet4.move(); }, 4000);

    return;
  }
  context.fillRect(this.x, this.y, 33, 30);
  this.x -= 5;
  context.drawImage(bullet, this.x, this.y);
  //Test Mario's range against the left side of the bullet
  if (((mario.x + 30) === (this.x)) && ((mario.y > this.y) && (mario.y < (this.y + 30)))) {
    ion.sound.play("die");
    mario.lives -= 1;
    console.log("Hit bullet from front");
  }
  //Italian hits bullet from bottom
  if(((mario.x) < (this.x + 30)) && (mario.x + 30) > (this.x) && ((mario.y) === (this.y + 30))) {
    ion.sound.play("die");
    mario.lives -= 1;
    console.log("Hit bullet from bottom");
  }
  //Italian hits bullet from top
  if (((mario.x) > (this.x)) && ((mario.x + 30) < (this.x + 33)) && ((mario.y) > (this.y)) && ((mario.y + 30) < (this.y + 30)))  {
    console.log("Mario is on the bullet");
  }
};

Enemy.prototype.move = function() {
  context.fillRect(this.x, this.y, 33, 30);
  //Create generation point for the new bullet
  this.x = 850;
  this.y = (Math.floor(Math.random() * 350));
};

function Koopa() {
  this.x = 750;
  this.y = 355;
  this.alive = true;
}
Koopa.prototype.update = function() {
  //Koopa is 20 x 25
  var koopa = document.getElementById("koopa");
  if ((this.x < 5) || (this.alive === false)) {
    context.fillRect(this.x, this.y, 20, 25);
    setTimeout(function() { koopa1.move(); }, 6000);
    setTimeout(function() { koopa2.move(); }, 3500);
    return;
  }
  if (this.alive === false) {
    return;
  }
  context.fillRect(this.x, this.y, 20, 25);
  this.x -= 2;
  context.drawImage(koopa, this.x, this.y);
  if (((mario.x + 30) === this.x) && ((mario.y + 5) === this.y)) {
      console.log("Hit Koopa!");
      mario.lives -= 1;
      ion.sound.play("die");
  }
  if (((mario.x + 30) > this.x) && ((mario.y + 30) === this.y)) {
      console.log("Koopa Die!");
      ion.sound.play("stomp");
      mario.score += 100;

      console.log(mario.score);
      context.fillRect(this.x, this.y, 30, 25);
      //!!TESTER!!
      context.drawImage(koopashell, this.x, this.y);

      context.fillRect(this.x, this.y, 30, 25);
      this.alive = false;
  }
};

Koopa.prototype.move = function() {
  context.fillRect(this.x, this.y, 20, 25);
  //Create generation point for the new bullet
  // this.y = (Math.floor(Math.random() * 350));
  // this.x = 800;
  this.alive = true;
  this.x = 830;
};

Koopa.prototype.dead = function() {
  var koopashell = document.getElementById("koopashell");
  if (this.alive === true) {
    return;
  }
  if (this.x < -20) {
    return;
  }
  // if (koopaCounter < 100) {
    context.fillRect(this.x, this.y, 30, 22);
    this.x -= 10;
    context.drawImage(koopashell, this.x, this.y);
};
function Cloud() {
  this.x = 750;
  this.y = Math.floor(Math.random() * 100);
}

Cloud.prototype.update = function() {
  //Cloud impage 50x21
  var cloud = document.getElementById("cloud");
  if (this.x < 5) {
    context.fillRect(this.x, this.y, 50, 21);
    that = this;
    setTimeout(function() { that.move(); }, 200);
    return;
  }
  context.fillRect(this.x, this.y, 50, 21);
  this.x -= 1;
  context.drawImage(cloud, this.x, this.y);

};
Cloud.prototype.move = function() {
  this.x = 850;
};

function Rocks() {
  this.x = 625;
  this.y = 338;
}

Rocks.prototype.update = function() {
  //Rocks impage 60x42
  var rocks = document.getElementById("rocks");
  if (this.x < 5) {
    context.fillRect(this.x, this.y, 60, 42);
    that = this;
    setTimeout(function() { that.move(); }, 200);
    return;
  }
  context.fillRect(this.x, this.y, 60, 42);
  this.x -= 1;
  context.drawImage(rocks, this.x, this.y);
};

var update = function () {
    cloud.update();
    rocks.update();
    mario.update();
    bullet1.update();
    bullet2.update();
    bullet3.update();
    bullet4.update();
    koopa1.update();
    koopa1.dead();
    koopa2.update();
    tardis.update();
    // bullet.update();
    // koopa2.dead():
    // player.update();
    // computer.update(ball);
    // ball.update(player.paddle, computer.paddle);
};

var step = function () {
    update();
    render();
    animate(step);
};


//Initiate Other Brothers' Game
var mario = new Italian();
var bullet1 = new Enemy();
var bullet2 = new Enemy();
var bullet3 = new Enemy();
var bullet4 = new Enemy();
var koopa1 = new Koopa();
var koopa2 = new Koopa();
var cloud = new Cloud();
var rocks = new Rocks();
var tardis = new Tardis();


// setTimeout(function() { var bullet1 = new Enemy();}, 50);
// setTimeout(function() { var bullet2 = new Enemy();}, 750);
// setTimeout(function() { var bullet2 = new Enemy();}, 1500);
// setTimeout(function() { var bullet3 = new Enemy();}, 2250);
// var bullet = new Enemy();
// bullet1.move();
// bullet2.move();
// bullet3.move();
// bullet4.move();
// koopa.move();


// document.body.appendChild(canvas);
$("#theField").append(canvas);
animate(step);


// $("document").ready(function() {
  $(document).keydown(function(ev) {
    if (mario.lives <= 0) {
      return;
    }
    var acceptableKeys = [32, 66, 37, 39];
    if (!acceptableKeys.includes(ev.keyCode)) {
      return;
    }
    ev.preventDefault();
    switch(ev.keyCode) {
      case 32:
        mario.move();
        break;
      case 66:
        bullet.move();
        break;
      case 37:
        mario.moveLeft();
        break;
      case 39:
        mario.moveRight();
        break;
      case 77:
        var koopa1 = new Koopa();
    }
  });
});
