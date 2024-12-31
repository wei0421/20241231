let player1, player2;
let bullets1 = [];
let bullets2 = [];
let bgImg;
let player1Life = 100;
let player2Life = 100;
let player1Images = {};
let player2Images = {};
let bulletImage;
let bulletImageLeft;
let gameOver = false;
let winner = "";
let groundHeight;

function preload() {
  bgImg = loadImage('picture/bg.jpg');

  player1Images.idle = loadImage('picture/4.png');
  player1Images.walkLeft = loadImage('picture/6.png');
  player1Images.walkRight = loadImage('picture/5.png');
  player1Images.jump = loadImage('picture/13.png');

  player2Images.idle = loadImage('picture/22.png');
  player2Images.walkLeft = loadImage('picture/24.png');
  player2Images.walkRight = loadImage('picture/0.png');
  player2Images.jump = loadImage('picture/23.png');

  bulletImage = loadImage('picture/25.png');
  bulletImageLeft = loadImage('picture/26.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  groundHeight = height - 150;
  player1 = new Player(100, groundHeight, player1Images, 1);
  player2 = new Player(width - 300, groundHeight, player2Images, 2);
  createRestartButton();
}

function draw() {
  background(bgImg);

  textSize(24);
  fill(0, 0, 255)
  text("Player 1 Life: " + player1Life, 10, 30);
  fill(255, 0, 0);
  text("Player 2 Life: " + player2Life, width - 200, 30);

  textSize(32);
  fill(255);
  text("淡江教科快打大賽", width / 2 - 100, height / 2 - 200);

  textSize(20);
  fill(255);
  text("使用 WASD 移動 Player 1，方向鍵移動 Player 2，F 和空格鍵分別射擊", width / 2 - 250, height - 50);

  player1.update();
  player1.display();

  player2.update();
  player2.display();

  for (let i = bullets1.length - 1; i >= 0; i--) {
    bullets1[i].update();
    bullets1[i].display();
    if (bullets1[i].offScreen()) {
      bullets1.splice(i, 1);
    } else if (bullets1[i].hits(player2)) {
      player2Life -= 20;
      bullets1.splice(i, 1);
    }
  }

  for (let i = bullets2.length - 1; i >= 0; i--) {
    bullets2[i].update();
    bullets2[i].display();
    if (bullets2[i].offScreen()) {
      bullets2.splice(i, 1);
    } else if (bullets2[i].hits(player1)) {
      player1Life -= 20;
      bullets2.splice(i, 1);
    }
  }

  if (player1Life <= 0 || player2Life <= 0) {
    gameOver = true;
    winner = player1Life > 0 ? "Player 1" : "Player 2";
    noLoop();
    displayWinner();
  }
}

function keyPressed() {
  if (key === 'w') {
    player1.moveUp();
  }
  if (key === 'a') {
    player1.moveLeft();
  }
  if (key === 'd') {
    player1.moveRight();
  }
  if (key === 'f') {
    bullets1.push(new Bullet(player1.x + player1.width / 2, player1.y + player1.height / 2, player1.direction));
  }

  if (keyCode === UP_ARROW) {
    player2.moveUp();
  }
  if (keyCode === LEFT_ARROW) {
    player2.moveLeft();
  }
  if (keyCode === RIGHT_ARROW) {
    player2.moveRight();
  }
  if (keyCode === 32) {
    bullets2.push(new Bullet(player2.x + player2.width / 2, player2.y + player2.height / 2, player2.direction));
  }
}

function keyReleased() {
  if (key === 'a' || key === 'd') {
    player1.stop();
  }
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    player2.stop();
  }
}

function createRestartButton() {
  let restartButton = createButton('Restart');
  restartButton.position(width / 2 - 50, height / 2 + 100);
  restartButton.size(100, 50);
  restartButton.mousePressed(restartGame);
  restartButton.hide();
}

function restartGame() {
  player1Life = 100;
  player2Life = 100;
  gameOver = false;
  winner = "";
  bullets1 = [];
  bullets2 = [];
  player1.x = 100;
  player1.y = groundHeight;
  player2.x = width - 300;
  player2.y = groundHeight;
  loop();
  select('button').hide();
}

function displayWinner() {
  textSize(64);
  fill(255, 255, 224);
  text(winner + " Wins!", width / 2 - 180, height / 2);
  select('button').show();
}

class Player {
  constructor(x, y, images, id) {
    this.x = x;
    this.y = y;
    this.images = images;
    this.id = id;
    this.velX = 0;
    this.velY = 0;
    this.direction = 1;
    this.onGround = false;
    this.isJumping = false;
    this.width = 200;
    this.height = 200;
    this.currentImage = images.idle;
  }

  update() {
    if (!this.onGround) {
      this.velY += 0.5;
    }

    this.x += this.velX;
    this.y += this.velY;

    if (this.y >= groundHeight) {
      this.y = groundHeight;
      this.onGround = true;
    } else {
      this.onGround = false;
    }

    this.x = constrain(this.x, 0, width - this.width);
    this.y = constrain(this.y, 0, height - this.height);
  }

  display() {
    image(this.currentImage, this.x, this.y, this.width, this.height);
  }

  moveUp() {
    if (this.onGround) {
      this.velY = -15;
      this.currentImage = this.images.jump;
    }
  }

  moveLeft() {
    this.velX = -5;
    this.direction = -1;
    this.currentImage = this.images.walkLeft;
  }

  moveRight() {
    this.velX = 5;
    this.direction = 1;
    this.currentImage = this.images.walkRight;
  }

  stop() {
    this.velX = 0;
    this.currentImage = this.images.idle;
  }
}

class Bullet {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.velX = direction * 12;
  }

  update() {
    this.x += this.velX;
  }

  display() {
    if (this.direction > 0) {
      image(bulletImage, this.x, this.y, 50, 50);
    } else {
      image(bulletImageLeft, this.x, this.y, 50, 50);
    }
  }

  offScreen() {
    return this.x < 0 || this.x > width;
  }

  hits(player) {
    let hitbox = { x: player.x + 40, y: player.y + 40, w: player.width - 80, h: player.height - 40 };
    return this.x > hitbox.x && this.x < hitbox.x + hitbox.w && this.y > hitbox.y && this.y < hitbox.y + hitbox.h;
  }
}
