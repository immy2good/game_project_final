/*
The Game Project 7
*/
/* Global Variables */
var gameChar_x;
var gameChar_y;
var gameChar_world_x;
var floorPos_y;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var canyon;
var collectables;
var treePos_y;
var treePos_X;
var scrollPos;
var clouds;
var collectableTimer;
var game_score;
var flagpole;
var lives;
var platforms;

/* Setup Function */
function setup() {
  createCanvas(1500, 576);
  lives = 3; // Initialize lives properly
  startGame();
}

function startGame() {
  floorPos_y = (height * 3) / 4;
  gameChar_x = width / 2;
  gameChar_y = floorPos_y;

  scrollPos = 0; // Initialize scroll position

  isFalling = false;
  isLeft = false;
  isRight = false;
  isPlummeting = false;

  canyon = { x_pos: 1200, y_pos: floorPos_y, size_x: 100, size_y: 150 };

  collectables = [
    {
      x_pos: random(50, width - 50),
      y_pos: floorPos_y - random(0, 50),
      size: 40,
      isFound: false,
      reappearTime: 5000,
    },
    {
      x_pos: random(50, width - 50),
      y_pos: floorPos_y - random(0, 50),
      size: 40,
      isFound: false,
      reappearTime: 5000,
    },
    {
      x_pos: random(50, width - 50),
      y_pos: floorPos_y - random(0, 50),
      size: 40,
      isFound: false,
      reappearTime: 5000,
    },
  ];

  collectableTimer = null;

  treePos_X = [
    random(80, 150),
    random(250, 450),
    random(600, 850),
    random(1000, 1200),
    random(1300, 1500),
  ];
  treePos_y = floorPos_y;

  clouds = [
    { x_pos: 200, y_pos: random(50, 200) },
    { x_pos: 400, y_pos: random(50, 200) },
    { x_pos: 800, y_pos: random(50, 300) },
  ];

  platforms = [];
  platforms.push(createPlatforms(300, floorPos_y - 100, 200));
  platforms.push(createPlatforms(1000, floorPos_y - 100, 200));

  game_score = 0;

  flagpole = { isReached: false, x_pos: 2000 };
}

function draw() {
  background(100, 155, 255);
  noStroke();
  fill(0, 155, 0);
  rect(0, floorPos_y, width, height - floorPos_y); // draw ground

  fill(255);
  textSize(40); // Score display
  text(game_score, 50, 50);
  text("Lives: " + lives, 50, height - 50);

  push();
  translate(scrollPos, 0);

  drawSun();
  drawClouds();
  drawMountains();
  drawTree();

  // Create Platforms
  for (var i = 0; i < platforms.length; i++) {
    platforms[i].draw();
  }
  drawMultipleCollectables();
  drawFlag();
  checkFlagpole();
  drawCanyon(canyon);

  pop();

  drawGameChar();

  // Player Movement and Interaction
  if (isRight) {
    if (gameChar_x < width * 0.4) {
      gameChar_x += 5; // Move the character to the right
    } else {
      scrollPos -= 5; // Scroll the world when reaching screen edge
    }
  }

  if (isLeft) {
    if (gameChar_x > width * 0.4) {
      gameChar_x -= 5; // Move the character to the left
    } else {
      scrollPos += 5; // Scroll the world when reaching screen edge
    }
  }

  // Apply Gravity
  if (gameChar_y < floorPos_y) {
    var isContact = false;
    for (var i = 0; i < platforms.length; i++) {
      if (platforms[i].checkContact(gameChar_world_x, gameChar_y)) {
        isContact = true;
        gameChar_y = platforms[i].y;
        isFalling = false;
        break;
      }
    }
    if (!isContact) {
      gameChar_y += 2; // Gravity
      isFalling = true;
    }
  } else {
    isFalling = false;
  }

  if (isPlummeting) {
    gameChar_y += 10; // Plummeting effect
  }

  gameChar_world_x = gameChar_x - scrollPos;

  // Check if character falls off the screen
  if (gameChar_y > height) {
    if (lives > 0) {
      lives -= 1;
      startGame();
    } else {
      text("Game Over - Press Space to Restart", width / 2 - 150, height / 2);
      noLoop();
    }
  }
}

// Key Pressed Function
function keyPressed() {
  if (keyCode == 65 || keyCode == 37) {
    // A or Left Arrow
    isLeft = true;
  }
  if (keyCode == 68 || keyCode == 39) {
    // D or Right Arrow
    isRight = true;
  }
  if (
    (keyCode == 87 || keyCode == 38 || key == " ") &&
    gameChar_y == floorPos_y
  ) {
    gameChar_y -= 100;
    isFalling = true;
  }
}

// Key Released Function
function keyReleased() {
  if (keyCode == 65 || keyCode == 37) {
    isLeft = false;
  }
  if (keyCode == 68 || keyCode == 39) {
    isRight = false;
  }
}

// Drawing and character animations
function drawGameChar() {
  noStroke();

  if (isLeft && isFalling) {
    //Jumping, turned left
    var skinColor = color(245, 222, 179); //Wheat
    var shirtColor = color(135, 206, 250); // LightSkyBlue
    var trouserColor = color(0, 0, 128); // Navy
    var shoesColor = color(169, 169, 169); // DarkGray
    //head
    fill(skinColor);
    rect(gameChar_x - 15, gameChar_y - 80 + 2, 30, 28);
    fill(128, 0, 0); //maroon
    rect(gameChar_x - 15, gameChar_y - 80 + 2, 30, 7); // hair
    //eyes whites
    fill(255);
    ellipse(gameChar_x - 7, gameChar_y - 65, 6, 4); // left
    // ellipse(gameChar_x+7, gameChar_y-65, 6,4); // right
    //eyes pupil
    fill(0);
    ellipse(gameChar_x - 7, gameChar_y - 65, 3, 3); // left
    // ellipse(gameChar_x+7, gameChar_y-65, 3,3);// right
    //Legs
    fill(trouserColor); // Navy
    rect(gameChar_x, gameChar_y - 28, 13, 40); // right side, left leg straight while jumping left
    rect(gameChar_x - 20, gameChar_y - 20, 20, 13); // left side , right left bent while jumping left
    //body
    fill(shirtColor); // LightSkyBlue
    rect(gameChar_x - 15, gameChar_y - 50, 30, 30);
    //arms
    fill(skinColor); // PeachPuff
    // rect(gameChar_x-20, gameChar_y-42, 10, 25); // left

    rect(gameChar_x - 25, gameChar_y - 42, 30, 10); // right
    //feet
    fill(shoesColor); // DarkGray
    rect(gameChar_x, gameChar_y, 13, 13); // right side, right foot/shoe while jumping
    rect(gameChar_x - 25, gameChar_y - 20, 8, 13); // left side, right foot/shoe bent while jumping
  }

  if (isRight && isFalling) {
    // Jumping Turned Right
    var skinColor = color(245, 222, 179); //Wheat
    var shirtColor = color(135, 206, 250); // LightSkyBlue
    var trouserColor = color(0, 0, 128); // Navy
    var shoesColor = color(169, 169, 169); // DarkGray
    //head
    fill(skinColor);
    rect(gameChar_x - 15, gameChar_y - 80 + 2, 30, 28);
    fill(128, 0, 0); //maroon
    rect(gameChar_x - 15, gameChar_y - 80 + 2, 30, 7); // hair
    //eyes whites
    fill(255);
    // ellipse(gameChar_x-7, gameChar_y-65, 6,4); // left
    ellipse(gameChar_x + 7, gameChar_y - 65, 6, 4); // right
    //eyes pupil
    fill(0);
    // ellipse(gameChar_x-7, gameChar_y-65, 3,3); // left
    ellipse(gameChar_x + 7, gameChar_y - 65, 3, 3); // right
    //Legs
    fill(trouserColor); // Navy
    rect(gameChar_x - 13, gameChar_y - 28, 13, 40); // left side , right leg straight while jumping right
    rect(gameChar_x, gameChar_y - 20, 22, 13); // right side , left leg up while jumping right
    //body
    fill(shirtColor); // LightSkyBlue
    rect(gameChar_x - 15, gameChar_y - 50, 30, 30);
    //arms
    fill(skinColor); // PeachPuff
    // rect(gameChar_x-20, gameChar_y-42, 10, 25); // left
    // rect(gameChar_x-5, gameChar_y-42, 10, 25); // right
    rect(gameChar_x - 5, gameChar_y - 42, 30, 10); // Right arm pointing right

    //feet
    fill(shoesColor); // DarkGray
    rect(gameChar_x - 13, gameChar_y, 13, 12); // left side, right foot/shoe while jumping
    rect(gameChar_x + 17, gameChar_y - 20, 8, 13); // right side, left left foot/shoe while jumping

    //End Facing Right
  }

  if (isLeft) {
    //Walking, turned left
    var skinColor = color(245, 222, 179); //Wheat
    var shirtColor = color(135, 206, 250); // LightSkyBlue
    var trouserColor = color(0, 0, 128); // Navy
    var shoesColor = color(169, 169, 169); // DarkGray
    //head
    fill(skinColor);
    rect(gameChar_x - 15, gameChar_y - 80 + 2, 30, 28);
    fill(128, 0, 0); //maroon
    rect(gameChar_x - 15, gameChar_y - 80 + 2, 30, 7); // hair
    //eyes whites
    fill(255);
    ellipse(gameChar_x - 7, gameChar_y - 65, 6, 4); // left
    // ellipse(gameChar_x+7, gameChar_y-65, 6,4); // right
    //eyes pupil
    fill(0);
    ellipse(gameChar_x - 7, gameChar_y - 65, 3, 3); // left
    // ellipse(gameChar_x+7, gameChar_y-65, 3,3);// right
    //Legs
    fill(trouserColor); // Navy
    rect(gameChar_x - 13, gameChar_y - 28, 26, 40);
    //body
    fill(shirtColor); // LightSkyBlue
    rect(gameChar_x - 15, gameChar_y - 50, 30, 30);
    //arms
    fill(skinColor); // PeachPuff
    // rect(gameChar_x-20, gameChar_y-42, 10, 25); // left side - right arm
    rect(gameChar_x - 25, gameChar_y - 42, 30, 10); // right side - left arm pointing left

    // rect(gameChar_x-5, gameChar_y-42, 10, 25); // right side - left arm pointing down
    //feet
    fill(shoesColor); // DarkGray
    rect(gameChar_x - 13, gameChar_y, 26, 12);
  }
  if (isRight) {
    // Walking Turned Right
    var skinColor = color(245, 222, 179); //Wheat
    var shirtColor = color(135, 206, 250); // LightSkyBlue
    var trouserColor = color(0, 0, 128); // Navy
    var shoesColor = color(169, 169, 169); // DarkGray

    //head
    fill(skinColor);
    rect(gameChar_x - 15, gameChar_y - 80 + 2, 30, 28);
    fill(128, 0, 0); //maroon
    rect(gameChar_x - 15, gameChar_y - 80 + 2, 30, 7); // hair
    //eyes whites
    fill(255);
    // ellipse(gameChar_x-7, gameChar_y-65, 6,4); // left
    ellipse(gameChar_x + 7, gameChar_y - 65, 6, 4); // right
    //eyes pupil
    fill(0);
    // ellipse(gameChar_x-7, gameChar_y-65, 3,3); // left
    ellipse(gameChar_x + 7, gameChar_y - 65, 3, 3); // right

    //Legs
    fill(trouserColor); // Navy
    rect(gameChar_x - 13, gameChar_y - 28, 26, 40);
    //body
    fill(shirtColor); // LightSkyBlue
    rect(gameChar_x - 15, gameChar_y - 50, 30, 30);
    //arms
    fill(skinColor); // PeachPuff
    // rect(gameChar_x-20, gameChar_y-42, 10, 25); // left
    // rect(gameChar_x-5, gameChar_y-42, 10, 25); // right
    // rect(gameChar_x-25, gameChar_y-42, 30, 10); // right side - left arm point left
    rect(gameChar_x - 5, gameChar_y - 42, 30, 10); // Right arm pointing right

    //feet
    fill(shoesColor); // DarkGray
    rect(gameChar_x - 13, gameChar_y, 26, 12);

    //End Facing Right
  }

  if (isFalling || isPlummeting) {
    // Character Facing Front - jumping
    if (!isLeft && !isRight) {
      //Standing, facing frontwards
      var skinColor = color(245, 222, 179); //Wheat
      var shirtColor = color(135, 206, 250); // LightSkyBlue
      var trouserColor = color(0, 0, 128); // Navy
      var shoesColor = color(169, 169, 169); // DarkGray
      //head
      fill(skinColor);
      rect(gameChar_x - 15, gameChar_y - 80 + 2, 30, 28);
      fill(128, 0, 0); //maroon
      rect(gameChar_x - 15, gameChar_y - 80 + 2, 30, 7); // hair
      //eyes whites
      fill(255);
      ellipse(gameChar_x - 7, gameChar_y - 65, 6, 4);
      ellipse(gameChar_x + 7, gameChar_y - 65, 6, 4);
      //eyes pupil
      fill(0);
      ellipse(gameChar_x - 7, gameChar_y - 65, 3, 3);
      ellipse(gameChar_x + 7, gameChar_y - 65, 3, 3);
      //arms
      fill(skinColor); // PeachPuff
      // rect(gameChar_x-20, gameChar_y-42, 10, 25); // left hands down
      rect(gameChar_x - 30, gameChar_y - 50, 15, 13); // left arm out jumping
      // rect(gameChar_x+10, gameChar_y-42, 10, 25); // right
      rect(gameChar_x + 15, gameChar_y - 50, 15, 13); // Right arm pointing right
      //body
      fill(shirtColor); // LightSkyBlue
      rect(gameChar_x - 15, gameChar_y - 50, 30, 30); // body while jumping / shirt
      rect(gameChar_x + 15, gameChar_y - 50, 5, 13); // Left arm sleeve jumping
      rect(gameChar_x - 20, gameChar_y - 50, 5, 13); // Right arm sleeve jumping

      //Legs
      fill(trouserColor); // Navy
      rect(gameChar_x - 15, gameChar_y - 28, 30, 40);

      //feet
      fill(shoesColor); // DarkGray
      rect(gameChar_x - 15, gameChar_y, 30, 12);
    }
  } else {
    // Character Facing Front
    if (!isLeft && !isRight) {
      //Standing, facing frontwards
      var skinColor = color(245, 222, 179); //Wheat
      var shirtColor = color(135, 206, 250); // LightSkyBlue
      var trouserColor = color(0, 0, 128); // Navy
      var shoesColor = color(169, 169, 169); // DarkGray
      //head
      fill(skinColor);
      rect(gameChar_x - 15, gameChar_y - 80 + 2, 30, 28);
      fill(128, 0, 0); //maroon
      rect(gameChar_x - 15, gameChar_y - 80 + 2, 30, 7); // hair
      //eyes whites
      fill(255);
      ellipse(gameChar_x - 7, gameChar_y - 65, 6, 4);
      ellipse(gameChar_x + 7, gameChar_y - 65, 6, 4);
      //eyes pupil
      fill(0);
      ellipse(gameChar_x - 7, gameChar_y - 65, 3, 3);
      ellipse(gameChar_x + 7, gameChar_y - 65, 3, 3);
      //body
      fill(shirtColor); // LightSkyBlue
      rect(gameChar_x - 20, gameChar_y - 50, 40, 30);
      //Legs
      fill(trouserColor); // Navy
      rect(gameChar_x - 15, gameChar_y - 28, 30, 40);
      //arms
      fill(skinColor); // PeachPuff
      rect(gameChar_x - 20, gameChar_y - 42, 10, 25); // left hands down
      // rect(gameChar_x-30, gameChar_y-50, 15, 13); // left arm out jumping
      rect(gameChar_x + 10, gameChar_y - 42, 10, 25); // right
      // rect(gameChar_x+15, gameChar_y-50, 15, 13); // Right arm pointing right

      //feet
      fill(shoesColor); // DarkGray
      rect(gameChar_x - 15, gameChar_y, 30, 12);
    }
  }
}
function drawMountains() {
  let mountainHeight = 15;
  let baseWidth = 50;
  let startX = width / 4;
  let startY = floorPos_y;

  for (var i = 0; i < 3; i++) {
    let y = startY;
    let x1 = startX + scrollPos / 10 + (mountainHeight - i) * baseWidth;
    let x2 =
      startX + scrollPos / 6 + ((mountainHeight + i - 10) * baseWidth) / 4;

    fill(240);
    triangle(x1, y, x2, y, (x1 + x2) / 2, y - 350);
    fill(100);
    triangle(x1 + 20, y, x2, y, (x1 + x2) / 2, y - 300);
  }
}

function drawTree() {
  for (var i = 0; i < treePos_X.length; i++) {
    fill(120, 100, 19); // Brown color for trunk
    rect(treePos_X[i] - 16 + scrollPos, treePos_y - 100, 30, 100);

    fill(34, 139, 34); // Green color for leaves
    ellipse(treePos_X[i] + scrollPos, treePos_y - 70, 150, 60);
    ellipse(treePos_X[i] + scrollPos, treePos_y - 110, 120, 70);
    ellipse(treePos_X[i] + scrollPos, treePos_y - 140, 80, 50);
  }
}

function drawClouds() {
  for (var i = 0; i < clouds.length; i++) {
    fill(255);
    ellipse(clouds[i].x_pos + scrollPos / 20, clouds[i].y_pos, 55, 55);
    ellipse(clouds[i].x_pos + 25 + scrollPos / 20, clouds[i].y_pos, 55, 75);
    ellipse(clouds[i].x_pos + 45 + scrollPos / 20, clouds[i].y_pos, 55, 55);
  }
}

function drawSun() {
  fill("gold");
  ellipse(150, floorPos_y - 300, 75, 75); // Draw the sun
}

function drawCanyon(t_canyon) {
  fill(0);
  rect(
    t_canyon.x_pos + scrollPos,
    t_canyon.y_pos,
    t_canyon.size_x,
    t_canyon.size_y
  );
  checkPlummetting();
}

function checkPlummetting() {
  // Adjust the plummeting logic to ensure it triggers as soon as the character reaches the canyon's edge
  if (
    gameChar_world_x > canyon.x_pos &&
    gameChar_world_x < canyon.x_pos + canyon.size_x &&
    gameChar_y >= floorPos_y - 1 // Ensures the character is on the ground
  ) {
    isPlummeting = true;
  }

  if (isPlummeting) {
    gameChar_y += 10; // Character falls faster when plummeting
  }
}

function drawCollectable(t_collectable) {
  if (!t_collectable.isFound) {
    noFill();
    strokeWeight(6);
    stroke(220, 185, 0);
    ellipse(
      t_collectable.x_pos + scrollPos,
      t_collectable.y_pos - 20,
      t_collectable.size,
      t_collectable.size
    );
    fill(255, 0, 255);
    stroke(255);
    strokeWeight(1);
    quad(
      t_collectable.x_pos - 5 + scrollPos,
      t_collectable.y_pos - t_collectable.size,
      t_collectable.x_pos - 10 + scrollPos,
      t_collectable.y_pos - (t_collectable.size + 15),
      t_collectable.x_pos + 10 + scrollPos,
      t_collectable.y_pos - (t_collectable.size + 15),
      t_collectable.x_pos + 5 + scrollPos,
      t_collectable.y_pos - t_collectable.size
    );
  }
}

function checkCollectable(t_collectable) {
  if (
    !t_collectable.isFound &&
    dist(
      gameChar_world_x,
      gameChar_y,
      t_collectable.x_pos,
      t_collectable.y_pos
    ) < 50
  ) {
    t_collectable.isFound = true;
    game_score += 1;
    t_collectable.collectableTimer = millis();
  }

  if (
    t_collectable.isFound &&
    millis() - t_collectable.collectableTimer >= t_collectable.reappearTime
  ) {
    t_collectable.isFound = false; // Reappear collectable
    t_collectable.collectableTimer = null; // Reset timer
  }
}

function drawMultipleCollectables() {
  for (var i = 0; i < collectables.length; i++) {
    drawCollectable(collectables[i]);
    checkCollectable(collectables[i]);
  }
}

function drawFlag() {
  stroke(255, 255, 0);
  strokeWeight(3);
  line(
    flagpole.x_pos + scrollPos,
    floorPos_y - 150,
    flagpole.x_pos + scrollPos,
    floorPos_y
  );
  if (flagpole.isReached) {
    noStroke();
    fill(255, 0, 0);
    rect(flagpole.x_pos + scrollPos, floorPos_y - 150, 40, 30);
  } else {
    noStroke();
    fill(255, 0, 0);
    rect(flagpole.x_pos + scrollPos, floorPos_y - 30, 40, 30);
  }
}

function checkFlagpole() {
  if (gameChar_world_x + 30 >= flagpole.x_pos) {
    flagpole.isReached = true;
  }
}

function createPlatforms(x, y, length) {
  var p = {
    x: x,
    y: y,
    length: length,
    draw: function () {
      // Adjust the platform's drawing position by adding scrollPos
      fill(255, 0, 255);
      rect(this.x, this.y, this.length, 20);
    },
    checkContact: function (gc_x, gc_y) {
      // Use gameChar_world_x to check if the character is aligned with the platform
      if (gc_x > this.x && gc_x < this.x + this.length) {
        var d = this.y - gc_y;
        if (d >= 0 && d < 5) {
          return true;
        }
      }
      return false;
    },
  };
  return p;
}
