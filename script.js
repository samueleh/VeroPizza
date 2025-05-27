var house1;
var house2;
var house3;
var frog;
var cars = []; // Array to store cars
var moveSpeed = 3;
var carSpeed = 5;
var wins = 15;
var bonus = 0;
var house1select = false;
var house2select = false;
var house3select = false;
var time = 500;
var bonusTime = 0;
var hurtAnimRunning = false;
var ClockRunning = false;
var YellowClockRunning = false;
var RedClockRunning = false;
var Deliveries = 0;
var Paused = false;
// 1 sec = 1 x 50
// timeSeconds = sec x 50

// Adding components to game
function startGame() {
  gameArea.context = gameArea.getContext("2d");
  // Run updateGameArea every 20ms
  gameArea.interval = setInterval(updateGameArea, 20);
  //Update Cash
  winsCounter.innerHTML = "Cash: " + wins;

  // Keyboard event listeners
  window.addEventListener("keydown", function (e) {
    gameArea.keys = gameArea.keys || [];
    gameArea.keys[e.keyCode] = e.type == "keydown";
  });

  window.addEventListener("keyup", function (e) {
    gameArea.keys[e.keyCode] = e.type == "keydown";
  });

  // New frog player
  frog = new component(60, 35, "frogger.png", 370, 450);
  house1 = new component(200, 100, "House.png", 50, 20);
  house2 = new component(200, 100, "House.png", 300, 20);
  house3 = new component(200, 100, "House.png", 550, 20);

  // Create cars in array
  for (var i = 0; i < 5; i++) {
    cars[i] = new component(
      70,
      40,
      "car.png",
      gameArea.width + Math.random() * 1000,
      100 * Math.floor(Math.random() * 6)
    );

    // Check if cars collide with existing cars
    for (var j = 0; j < cars.length; j++) {
      if (i != j) {
        while (cars[i].collides(cars[j])) {
          cars[i].x = gameArea.width + Math.random() * 1000;
          cars[i].y = 100 * Math.floor(Math.random() * 6);
        }
      }
    }
  }

  // Select houses and change their images
  var select = Math.floor(Math.random() * 3) + 1;
  switch (select) {
    case 1:
      house1.image.src = "HouseSelected.png";
      house1select = true;
      house2select = false;
      house3select = false;
      break;
    case 2:
      house2.image.src = "HouseSelected.png";
      house1select = false;
      house2select = true;
      house3select = false;
      break;
    case 3:
      house3.image.src = "HouseSelected.png";
      house1select = false;
      house2select = false;
      house3select = true;
      break;
  }
}

winsCounter.innerHTML = "Cash: " + wins;

function stopGame() {
  clearInterval(gameArea.interval);
}

function drawLanes(n) {
  // Draw roads
  gameArea.context.fillStyle = "#322f31";
  for (var x = 180; x <= 400; x += 100) {
    gameArea.context.fillRect(0, x, 800, 80);
  }

  // Draw lines in roads
  gameArea.context.fillStyle = "white";
  for (var x = 40; x <= 700; x += 160) {
    gameArea.context.fillRect(x, 220, 80, 5);
    gameArea.context.fillRect(x, 320, 80, 5);
    gameArea.context.fillRect(x, 420, 80, 5);
  }
}

// Setting up a new component
function component(width, height, img, x, y) {
  this.image = new Image();
  this.image.src = img;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;

  this.update = function () {
    gameArea.context.drawImage(
      this.image,
      this.x,
      this.y,
      this.width,
      this.height
    );
  };

  this.newPos = function () {
    this.x += this.speedX;
    this.y += this.speedY;
  };

  // Function to check collision
  this.collides = function (otherobj) {
    var myleft = this.x;
    var myright = this.x + this.width;
    var mytop = this.y;
    var mybottom = this.y + this.height;
    var otherleft = otherobj.x;
    var otherright = otherobj.x + otherobj.width;
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + otherobj.height;
    var crash = true;

    if (
      mybottom < othertop ||
      mytop > otherbottom ||
      myright < otherleft ||
      myleft > otherright
    ) {
      crash = false;
    }
    return crash;
  };
}

function updateGameArea() {
  // Check for collision
  for (var j = 0; j < cars.length; j++) {
    if (frog.collides(cars[j])) {
      stopGame();
      wins = wins - 5;
      if (wins < 1) {
        msg.innerHTML = "Gameover!";
        msg.winsCounter = "Bankrupt!";
      } else {
        startGame();
        winsCounter.innerHTML = "Cash: " + wins;
        HurtAnim();
        return;
      }
    }
  }
  // Disable buttons if player does not have enough cash
  CheckButtons();
  // Create timer
  time--;
  var trueTime = Math.ceil(time / 50);
  var GameTimer = trueTime + bonusTime;
  timeDisplay.innerHTML = "Time: " + GameTimer;
  // Check if time > 6 to change clock gif
  if (GameTimer > 6) {
    if (ClockRunning == false) {
      clock.src = "ClockAnim..gif";
      ClockRunning = true;
    }
  }
  // Check if time < 6 to change clock gif
  if (GameTimer < 6) {
    if (YellowClockRunning == false) {
      clock.src = "YellowClockAnim.gif";
      YellowClockRunning = true;
    }
  }
  // Check if time < 3 to change clock gif
  if (GameTimer < 3) {
    if (RedClockRunning == false) {
      clock.src = "RedClockAnim.gif";
      RedClockRunning = true;
    }
  }
  // Check if time runs out
  if (GameTimer < 1) {
    LoseCash();
    clock.src = "ClockAnim..gif";
    YellowClockRunning = false;
    RedClockRunning = false;
  }
  // Check if the player is colliding with houses
  if (frog.collides(house1)) {
    if (house1select === true) {
      SelectedHouseCollide();
    } else if (house1select == false) {
      frog.y = frog.y + 5;
    }
  }

  if (frog.collides(house2)) {
    if (house2select === true) {
      SelectedHouseCollide();
    } else if (house2select == false) {
      frog.y = frog.y + 5;
    }
  }

  if (frog.collides(house3)) {
    if (house3select === true) {
      SelectedHouseCollide();
    } else if (house3select == false) {
      frog.y = frog.y + 5;
    }
  }

  // Borders
  if (frog.y < 120) {
    frog.y = 120;
  }
  if (frog.x < -10) {
    frog.x = -10;
  }
  if (frog.y > 455) {
    frog.y = 455;
  }
  if (frog.x > 760) {
    frog.x = 760;
  }

  // Refreshing components
  gameArea.context.clearRect(0, 0, gameArea.width, gameArea.height);
  drawLanes();
  frog.speedX = 0;
  frog.speedY = 0;

  // Checking arrow keys for frog movements
  if (gameArea.keys && (gameArea.keys[37] || gameArea.keys[65])) {
    frog.speedX = -moveSpeed;
  }
  if (gameArea.keys && (gameArea.keys[39] || gameArea.keys[68])) {
    frog.speedX = moveSpeed;
  }
  if (gameArea.keys && (gameArea.keys[38] || gameArea.keys[87])) {
    frog.speedY = -moveSpeed;
  }
  if (gameArea.keys && (gameArea.keys[40] || gameArea.keys[83])) {
    frog.speedY = moveSpeed;
  }

  // Add cashing for demonstration
  if (gameArea.keys && gameArea.keys[27]) {
    wins++;
    winsCounter.innerHTML = "Cash: " + wins;
  }

  for (j = 0; j < cars.length; j++) {
    // Checking if cars have reached the end
    if (cars[j].x < 0 || cars[j].y < 170) {
      cars[j].x = 800 + Math.random() * 1000;
      cars[j].y = 100 * Math.floor(Math.random() * 6);
    } else {
      cars[j].x -= carSpeed;
    }
    cars[j].update();
  }
  // Update components and make them visible on canvas
  frog.newPos();
  frog.update();
  house1.update();
  house2.update();
  house3.update();
}
// Play flashing animation after getting hurt
function HurtAnim() {
  if (hurtAnimRunning == false) {
    hurtAnimRunning = true;
    let intervalId = setInterval(function () {
      if (frog.image.src.includes("froggerHurt.png")) {
        frog.image.src = "frogger.png";
      } else {
        frog.image.src = "froggerHurt.png";
      }
    }, 150);
    setTimeout(function () {
      clearInterval(intervalId);
      frog.image.src = "frogger.png";
      hurtAnimRunning = false;
    }, 2000);
  }
}

// Function so the player can buy the speed upgrade
function BuySpeed() {
  if (wins > 20) {
    moveSpeed = moveSpeed + 1;
    wins = wins - 20;
    if (Paused == false) {
      stopGame();
      startGame();
    }
    winsCounter.innerHTML = "Cash: " + wins;
    CheckButtons();
  } else {
  }
}

// Fuction so the player can buy the bonus cash upgrade
function BuyBonus() {
  if (wins > 30) {
    bonus = bonus + 1;
    wins = wins - 30;
    if (Paused == false) {
      stopGame();
      startGame();
    }
    winsCounter.innerHTML = "Cash: " + wins;
    CheckButtons();
  } else {
  }
}

// Function so the player can buy the extra time upgrade
function BuyTime() {
  if (wins > 25) {
    bonusTime = bonusTime + 5;
    wins = wins - 25;
    if (Paused == false) {
      stopGame();
      startGame();
    }
    winsCounter.innerHTML = "Cash: " + wins;
    time = 500;
    CheckButtons();
  } else {
  }

  ClockRunning = false;
  YellowClockRunning = false;
  RedClockRunning = false;
}

// Function when player gets hit by car or runs out of time
function LoseCash() {
  stopGame();
  wins = wins - 5;
  if (wins < 1) {
    msg.innerHTML = "Gameover!";
    msg.winsCounter = "Bankrupt!";
    time = 0;
  } else {
    startGame();
    winsCounter.innerHTML = "Cash: " + wins;
    HurtAnim();
    time = 500;
  }
}

// Function for the selected house to give wins
function SelectedHouseCollide() {
  var totalCash = bonus + 5;
  stopGame();
  WinMessage.innerHTML = "+" + totalCash + " cash!";
  setTimeout(function () {
    WinMessage.innerHTML = "";
  }, 2000);
  wins = wins + 5 + bonus;

  if (carSpeed < 20) {
    carSpeed++;
  }
  Deliveries++;
  winsCounter.innerHTML = "Cash: " + wins;
  deliveriesCounter.innerHTML = "Deliveries: " + Deliveries;

  time = 500;
  RedClockRunning = false;
  YellowClockRunning = false;
  ClockRunning = false;
  startGame();
}

// Function to make start button work by switching screens
function StartButton() {
  var startDiv = document.getElementById("startScreen");
  var gameDiv = document.getElementById("mainScreen");
  startGame();
  gameDiv.style.display = "block";
  startDiv.style.display = "none";
  gameAudio.play();
}

// Function to Pause game
function PauseGame() {
  if (Paused == false) {
    stopGame();
    Paused = true;
    PauseButton.innerHTML = "▷";
    PauseButton.style.paddingBottom = "0px";
  } else if (Paused == true) {
    startGame();
    Paused = false;
    PauseButton.innerHTML = "⏸";
    PauseButton.style.paddingBottom = "7px";
  }
}

// Function to restart game
function RestartGame() {
  location.reload();
}

// Function to check buttons even in paused
function CheckButtons() {
  if (wins < 21 || moveSpeed > 6) {
    speedButton.disabled = true;
  } else {
    speedButton.disabled = false;
  }

  if (wins < 31) {
    bonusButton.disabled = true;
  } else {
    bonusButton.disabled = false;
  }

  if (wins < 26) {
    timeButton.disabled = true;
  } else {
    timeButton.disabled = false;
  }
}
