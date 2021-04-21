/***********************************************************************************
 Mirror
  by Beidi Han

  Uses the p5.2DAdventure.js class 
	
***********************************************************************************/
//speed
var speedleft = 0;
var speedright = 0;
var speedup = 0;
var speeddown = 0;

// adventure manager global  
var adventureManager;

// p5.play
var playerSprite;
var playerAnimation;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

// indexes into the clickable array (constants)
const playGameIndex = 0;

var NPC = []; 
var Door = []; 
var Tool = [];
var playerSpriteH = 40;


var positionX;
var positionY;

var lordX;
var lordY;

// Dialogue
var textBox;
var dialogueVisible = false;
var enterTextVisible = false;
var currentDialogue = 'dialogue';
var currentEnterText = 'enterText';

var currentImg = [];
var counter = 0;

var currentMoney = '$100';

var currentToolVisible = false;
var currentTool;
// Allocate Adventure Manager with states table and interaction tables
function preload() {
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
  
//preload the NPC
  NPC[0] = loadAnimation('assets/avatars/point001.png', 'assets/avatars/point002.png');
  NPC[1] = loadAnimation('assets/avatars/cassie001.png', 'assets/avatars/cassie002.png');
  NPC[2] = loadImage('assets/avatars/john001.png');
  NPC[3] = loadAnimation('assets/avatars/west001.png', 'assets/avatars/west002.png');
  NPC[4] = loadAnimation('assets/avatars/elder001.png', 'assets/avatars/elder002.png');
  NPC[5] = loadAnimation('assets/avatars/prop001.png', 'assets/avatars/prop002.png');
  NPC[6] = loadAnimation('assets/avatars/citizen001.png', 'assets/avatars/citizen002.png');
  NPC[7] = loadAnimation('assets/avatars/citizen003.png', 'assets/avatars/citizen004.png');
  NPC[8] = loadAnimation('assets/avatars/east001.png', 'assets/avatars/east002.png');
  NPC[9] = loadAnimation('assets/avatars/soldier001.png', 'assets/avatars/soldier004.png');

 
//preload the image for the entrence
  Door[0] = loadImage('assets/Up.png');
  Door[1] = loadImage('assets/dweapon.png');
  Door[2] = loadImage('assets/darmor.png');
  Door[3] = loadImage('assets/dprop.png');
  Door[4] = loadImage('assets/drestaurant.png');
  Door[5] = loadImage('assets/door-s.png');
  Door[6] = loadImage('assets/Right.png');
  Door[7] = loadImage('assets/Down.png');
  Door[8] = loadImage('assets/Left.png');

//preload the tool logo
  Tool[0] = loadImage('assets/avatars/attack.png');
  Tool[1] = loadImage('assets/avatars/protect.png');

//textbox
  textBox = loadImage('assets/textbox.png');
}

// Setup the adventure manager
function setup() {
  createCanvas(1280, 720);

  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();

  // create a sprite and add the 3 animations
  playerSprite = createSprite(919, 189, 80, playerSpriteH);


  var playerSpriteMove = playerSprite.addAnimation('stop', 'assets/avatars/Sprite_01.png');
    playerSprite.addAnimation('left', 'assets/avatars/Sprite_05.png', 'assets/avatars/Sprite_08.png');
    playerSprite.addAnimation('right', 'assets/avatars/Sprite_09.png', 'assets/avatars/Sprite_12.png');
    playerSprite.addAnimation('up', 'assets/avatars/Sprite_13.png', 'assets/avatars/Sprite_16.png');
    playerSprite.addAnimation('down', 'assets/avatars/Sprite_01.png', 'assets/avatars/Sprite_04.png');
  

  // use this to track movement from toom to room in adventureManager.draw()
  adventureManager.setPlayerSprite(playerSprite);

  // this is optional but will manage turning visibility of buttons on/off
  // based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

    // This will load the images, go through state and interation tables, etc
  adventureManager.setup();

  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables(); 
}

// Adventure manager handles it all!
function draw() {
  // draws background rooms and handles movement from one to another
  adventureManager.draw();

  // draw the p5.clickables, in front of the mazes but behind the sprites 
  clickablesManager.draw();

  // No avatar for Splash screen or Instructions screen
  if( adventureManager.getStateName() !== "Splash" && 
      adventureManager.getStateName() !== "Instructions" ) {
    drawMoney(); 
  drawTool();
    // responds to keydowns
    moveSprite();

    // this is a function of p5.js, not of this sketch
    drawSprite(playerSprite);
  } 
  drawDialogueBox();
  drawEnterTextBox();
 

   drawDebugInfo(); //Debug for Mouse X and Y
}

function drawTool(){
  if(currentToolVisible === true){
   
      image(currentTool, 60, 80, 50, 50);
      
    }
}

function drawMoney(){
  push();
  textSize(25);
  fill(255);
  text(currentMoney, 60, 50);
  pop();
 }

function drawDebugInfo() {
  push();
  fill(255);
  text("X: " + mouseX + "   Y: " + mouseY, 20, height - 20);
  pop();
}

// pass to adventure manager, this do the draw / undraw events
function keyPressed() {
  // toggle fullscreen mode
  //if( key === 'f') {
   // fs = fullscreen();
   // fullscreen(!fs);
   // return;
//}

  // dispatch key events for adventure manager to move from state to 
  // state or do special actions - this can be disabled for NPC conversations
  // or text entry   

  // dispatch to elsewhere
  adventureManager.keyPressed(key); 
}

function mouseReleased() {
  adventureManager.mouseReleased();
}

//-------------- YOUR SPRITE MOVEMENT CODE HERE  ---------------//
function moveSprite() {
  playerSprite.maxSpeed = 4;
  if(keyIsDown(68)){
    playerSprite.changeAnimation('right');
    playerSprite.velocity.x = 2 + speedright;
  } 
  else if(keyIsDown(65)){
    playerSprite.changeAnimation('left');
    playerSprite.velocity.x = -2 + speedleft;

  }
  else if(keyIsDown(83)){
    playerSprite.changeAnimation('down');
    playerSprite.velocity.y = 2 + speeddown;
  }
  else if(keyIsDown(87)){
    playerSprite.changeAnimation('up');
    playerSprite.velocity.y = -2 + speedup;
  } else{
    playerSprite.changeAnimation('stop');
    playerSprite.velocity.y = 0;
    playerSprite.velocity.x = 0;
  }
  if(keyIsDown(SHIFT)) {
    speeddown += 2;
    speedup -= 2;
    speedleft -= 2;
    speedright += 2;
  }else {
    speedleft = 0;
    speedright = 0;
    speedup = 0;
    speeddown = 0;
  }
}


//-------------- CLICKABLE CODE  ---------------//

function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
    clickables[i].onPress = clickableButtonPressed;
  }
}

// tint when mouse is over
clickableButtonHover = function () {
  this.color = "#AA33AA";
  this.noTint = false;
  this.tint = "#FF0000";
}

// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.color = "#AAAAAA";
}

clickableButtonPressed = function() {
  // these clickables are ones that change your state
  // so they route to the adventure manager to do this
  adventureManager.clickablePressed(this.name); 
}


function drawEnterTextBox() {
  if(enterTextVisible === true) {
    drawEnterText();
  }   
}

function drawEnterText() {
    push();
    textAlign(CENTER);
    fill(255);
    stroke(0);
    strokeWeight(1);
    textSize(13);
    text(currentEnterText, playerSprite.position.x, playerSprite.position.y - playerSpriteH);
    pop();
  }   

function drawDialogueBox() {
  if (dialogueVisible === true) {
    image(textBox, 380, 570);
    drawDialogueText();
  }
}

function drawDialogueText() {
  // currentImg
  
  // Dialogue
  push();
  textSize(15);
  fill(255);
  text(currentDialogue, 420, 600, 420, 600);
  pop();
 }
//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//


// Instructions screen has a backgrounnd image, loaded from the adventureStates table
// It is sublcassed from PNGRoom, which means all the loading, unloading and drawing of that
// class can be used. We call super() to call the super class's function as needed

class Dorm extends PNGRoom {
  preload() {
    this.door = createSprite(width/2 - 220, height - 40, 50, 50);
    this.door.addImage(Door[7]);

    this.book = createSprite(322, 522, 30, 30);
    this.book.addAnimation('point', NPC[0]);

    this.letter = createSprite(371, 523, 30, 30);
    this.letter.addAnimation('point', NPC[0]);

  }

  draw() {
    super.draw();

    drawSprite(this.door);
    if(playerSprite.overlap(this.door) && keyIsDown(83)){
      adventureManager.changeState("Village"); 
    playerSprite.position.x += 500;
    playerSprite.position.y -= 30;
    }

    drawSprite(this.book);
    if (playerSprite.overlap(this.book)) {
      enterTextVisible = true;
      currentEnterText = 'Press SPACE to read';
    }else{
      enterTextVisible = false;
    }
      
    if (playerSprite.overlap(this.book) && keyIsDown(32)) {
      dialogueVisible = true;
      currentDialogue = 'Still did not dig anything today...';
      this.book.remove();
    }

    drawSprite(this.letter);
    if (playerSprite.overlap(this.letter)) {
      enterTextVisible = true;
      currentEnterText = 'Press SPACE to read';
    }
      
    if (playerSprite.overlap(this.letter) && keyIsDown(32)) {
      dialogueVisible = true;
      currentDialogue = 'This is a letter from my brother...';
      this.letter.remove();
    }else if(mouseIsPressed){
      dialogueVisible = false;
      }
}
}

class Village extends PNGRoom {
  preload() {
    this.weapon = createSprite(630, 127, 24, 28);
    this.weapon.addImage(Door[1]);

    this.armor = createSprite(724, 127, 24, 28);
    this.armor.addImage(Door[2]);

    this.restaurant = createSprite(376, 127, 24, 28);
    this.restaurant.addImage(Door[4]);

    this.outdoor = createSprite(238, 165, 50, 50);
    this.outdoor.addImage(Door[8]);

    this.mayor = createSprite(608, 439, 20, 20);
    this.mayor.addImage(Door[5]);

    this.home = createSprite(918, 598, 20, 20);
    this.home.addImage(Door[5]);

    this.tim = createSprite(704, 566, 33, 50);
    this.tim.addAnimation('Tim', NPC[5]);

    this.john = createSprite(336, 355, 33, 50);
    this.john.addAnimation('john', NPC[2]);

  }

  draw() {
    super.draw();

//draw weapon store
    drawSprite(this.weapon);
    if(playerSprite.overlap(this.weapon) && keyIsDown(87)){
      adventureManager.changeState("Weapon");
      playerSprite.position.x -= 150;
      playerSprite.position.y += 450;
    }

//draw armor store
    drawSprite(this.armor);
    if(playerSprite.overlap(this.armor) && keyIsDown(87)){
      adventureManager.changeState("Armor");
      playerSprite.position.x += 150;
      playerSprite.position.y += 500;
    }

//draw restaurant
    drawSprite(this.restaurant);
    if(playerSprite.overlap(this.restaurant) && keyIsDown(87)){
      adventureManager.changeState("Restaurant");
      playerSprite.position.x += 528;
      playerSprite.position.y += 510;
}

//draw the exit
    drawSprite(this.outdoor);
    if(playerSprite.overlap(this.outdoor) && keyIsDown(65)){
      adventureManager.changeState("Fork");
      playerSprite.position.x += 730;
      playerSprite.position.y += 160;
}
//draw mayor house
    drawSprite(this.mayor);
    if(playerSprite.overlap(this.mayor) && keyIsDown(87)){
      adventureManager.changeState("Mayor");
      playerSprite.position.x += 30;
      playerSprite.position.y += 200;
}
//draw home
   drawSprite(this.home);
    if(playerSprite.overlap(this.home) && keyIsDown(87)){
      adventureManager.changeState("Room");
      playerSprite.position.x -= 500;
      playerSprite.position.y += 20;
}
//draw the npc tim
drawSprite(this.tim);
if (playerSprite.overlap(this.tim)) {
      enterTextVisible = true;
      currentEnterText = 'Press SPACE to talk';
    }else{
      enterTextVisible = false;
    }
      
    if (playerSprite.overlap(this.tim) && keyIsDown(32)) {
      dialogueVisible = true;
      currentDialogue = 'Good morning David! Lord seems to be looking for you, go and have a look';
    }
drawSprite(this.john);
if (playerSprite.overlap(this.john)) {
      enterTextVisible = true;
      currentEnterText = 'Press SPACE to talk';
    }
    
      
    if (playerSprite.overlap(this.john) && keyIsDown(32)) {
      dialogueVisible = true;
      currentDialogue = 'Good morning David! Hope there will be good news today';
    }else if(mouseIsPressed){
      dialogueVisible = false;
    }
}
}

class Weapon extends PNGRoom {
  preload(){
    this.door = createSprite(485, 667, 50, 50);
    this.door.addImage(Door[7]);

    this.npc = createSprite(601, 416, 33, 50);
    this.npc.addAnimation('npc', NPC[4]);

    this.buy = createSprite(451, 319, 30, 30);
    this.buy.addAnimation('buy', NPC[0]);

  }

  draw(){
    super.draw();
//draw the door to village
    drawSprite(this.door);
    if(playerSprite.overlap(this.door) && keyIsDown(83)){
      adventureManager.changeState("Village");
      playerSprite.position.x += 150;
      playerSprite.position.y -= 460;
  }
  drawSprite(this.npc);
    if (playerSprite.overlap(this.npc)) {
      dialogueVisible = true;
      currentDialogue = 'Welcome to the largest tool store in the Western Kingdom, where you can find all the tools you want';
    }else{
      dialogueVisible = false;
    }

 drawSprite(this.buy);
  if (playerSprite.overlap(this.buy)) {
      enterTextVisible = true;
      currentEnterText = 'Press ENTER to purchase';  
    }else{
      enterTextVisible = false;
    }
   if (playerSprite.overlap(this.buy) && keyIsDown(ENTER)) {
      if(currentMoney === '$100'){
      currentMoney = '$0';
      currentToolVisible = true;
      currentTool = Tool[0];
      } else if(currentMoney === '$0'){
      dialogueVisible = false;
      this.buy.remove();
      }
  }
  }
}

class Armor extends PNGRoom {
  preload() {
    this.door = createSprite(875, 702, 50, 50);
    this.door.addImage(Door[7]);

    this.npc = createSprite(781, 411, 33, 50);
    this.npc.addAnimation('npc',NPC[4]);

    this.buy = createSprite(591, 400, 30, 30);
    this.buy.addAnimation('buy', NPC[0]);
  }

  draw(){
    super.draw();
//draw the door to village
    drawSprite(this.door);
    if(playerSprite.overlap(this.door) && keyIsDown(83)){
      adventureManager.changeState("Village");
      playerSprite.position.x -= 150;
      playerSprite.position.y -= 520;
  }
//draw npc
drawSprite(this.npc);
    if (playerSprite.overlap(this.npc)) {
      dialogueVisible = true;
      currentDialogue = 'Welcome!';
    }else{
      dialogueVisible = false;
    }
//draw the goods
drawSprite(this.buy);
  if (playerSprite.overlap(this.buy)) {
      enterTextVisible = true;
      currentEnterText = 'Press ENTER to purchase';  
    }else{
      enterTextVisible = false;
    }
   if (playerSprite.overlap(this.buy) && keyIsDown(ENTER)) {
      if(currentMoney === '$100'){
      currentMoney = '$0';
      currentToolVisible = true;
      currentTool = Tool[1];
      } 
      else if(currentMoney === '$0'){
      dialogueVisible = false;
      this.buy.remove();
        }
      }
  }
    }


class Restaurant extends PNGRoom {
  preload() {
    this.door = createSprite(903, 710, 50, 50);
    this.door.addImage(Door[7]);

    this.npc = createSprite(941, 253, 33, 50);
    this.npc.addAnimation('npc', NPC[1]);
  }

  draw(){
    super.draw();
//draw the door to village
    drawSprite(this.door);
    if(playerSprite.overlap(this.door) && keyIsDown(83)){
      adventureManager.changeState("Village");
      playerSprite.position.x -= 530;
      playerSprite.position.y -= 550;
  }
//draw npc
 drawSprite(this.npc);
  if (playerSprite.overlap(this.npc)) {
      enterTextVisible = true;
      currentEnterText = 'Press SPACE to talk';
    }else{
      enterTextVisible = false;
    }
  if (playerSprite.overlap(this.npc) && keyIsDown(32)) {
    dialogueVisible = true;
      counter = 1;
    }else if(mouseIsPressed){
    counter += 1;} 
    else if(counter == 1){
      frameRate(8);
  currentDialogue = 'Cassie: Isnt this our adventurer?';
    }
else if(counter == 2){
  frameRate(8);
      currentDialogue = 'Cassie: Come here, sit down and eat something';      
}else if(counter == 3){
  frameRate(8);
  currentDialogue = '...';
}
else if(counter == 4){
  frameRate(8);
  currentDialogue = 'Cassie: Whats going on? This is not an expression that an adventurer should have!';
}
else if(counter == 5){
  frameRate(10);
   currentDialogue = 'David: This is the third year since our brother lost contact, and now I have to embark on the same path';
}
else if(counter == 6){
  frameRate(10);
   currentDialogue = 'Cassie: ...';
}
else if(counter == 7){
  frameRate(8);
   currentDialogue = 'David: I will be back after I got enough money, definitely! !';
}
else if(counter == 8){
  frameRate(80);
   dialogueVisible = false;
}
}
}

class Mayor extends PNGRoom {

  preload() {
    this.door = createSprite(638, 710, 50, 50);
    this.door.addImage(Door[7]);

    this.lord = createSprite(640, 419, 33, 50);
    this.lord.addAnimation('Lord', NPC[3]);

  }

  draw(){
    super.draw();
//draw the door to village
    drawSprite(this.door);
    if(playerSprite.overlap(this.door) && keyIsDown(83)){
      adventureManager.changeState("Village");
      playerSprite.position.x -= 30;
      playerSprite.position.y -= 240;
  }
//draw the lord
  drawSprite(this.lord);
  if (playerSprite.overlap(this.lord)) {
      enterTextVisible = true;
      currentEnterText = 'Press SPACE to talk';
    }else{
      enterTextVisible = false;
    }
  if (playerSprite.overlap(this.lord) && keyIsDown(32)) {
    dialogueVisible = true;
      counter = 1;
    }else if(mouseIsPressed){
    counter += 1;} 
    else if(counter == 1){
      frameRate(8);
  currentDialogue = 'Lord: I heard that you plan to set off to the east?';
    }
else if(counter == 2){
  frameRate(8);
      currentDialogue = 'David: Yes, dear Lord';      
}else if(counter == 3){
  frameRate(8);
  currentDialogue = '...';
}
else if(counter == 4){
  frameRate(8);
  currentDialogue = 'Lord: If you are determined, I won’t persuade you anymore. Be careful on the way';
}
else if(counter == 5){
  frameRate(8);
   currentDialogue = 'Lord: Sorry about my useless. Im afraid that our city will never have a bright future. .';
}
else if(counter == 6){
  frameRate(8);
   currentDialogue = 'Lord: Although the journey is difficult, if you can successfully reach the east, it must be a opportunity for you...';
}
else if(counter == 7){
  frameRate(8);
   currentDialogue = 'Lord: It’s just that the young people in our city going to the East rarely return news. If you can, I hope you can see how these people are doing in the East.';
}
else if(counter == 8){
  frameRate(8);
   currentDialogue = 'David: I will...';
}
else if(counter == 9){
  frameRate(80);
   dialogueVisible = false;
}

}
}

class Fork extends PNGRoom {
  preload() {
//back to village
    this.door = createSprite(1023, 320, 50, 50);
    this.door.addImage(Door[6]);
//go to maze
    this.maze = createSprite(530, 700, 50, 50);
    this.maze.addImage(Door[7]);
  }

  draw(){
    super.draw();
//draw the door to village
    drawSprite(this.door);
    if(playerSprite.overlap(this.door) && keyIsDown(68)){
      adventureManager.changeState("Village");
      playerSprite.position.x -= 720;
      playerSprite.position.y -= 160;
  }
//draw the door to maze
  drawSprite(this.maze);
  if(playerSprite.overlap(this.maze) && keyIsDown(83)){
      adventureManager.changeState("DM");
      playerSprite.position.x += 370;
      playerSprite.position.y -= 600;
}
}
}

class Wmine extends PNGRoom {
  preload() {
    this.npc = createSprite(656, 418, 33, 50);
    this.npc.addAnimation('npc', NPC[2]);
}
  draw(){
    super.draw();

    drawSprite(this.npc);
    if (playerSprite.overlap(this.npc)) {
      dialogueVisible = true;
      currentDialogue = 'Another day when nothing has been mined... When will there be good news...';
    }else{
      dialogueVisible = false;
    }


}
}

class DM extends PNGRoom {
  preload() {
//back to fork
    this.fork = createSprite(896, 30, 50, 50);
    this.fork.addImage(Door[0]);
//go to next maze
    this.maze = createSprite(276, 340, 50, 50);
    this.maze.addImage(Door[8]);
  }

  draw(){
    super.draw();
//draw the door to fork
    drawSprite(this.fork);
    if(playerSprite.overlap(this.fork) && keyIsDown(87)){
      adventureManager.changeState("Fork");
      playerSprite.position.x -= 370;
      playerSprite.position.y += 640;
  }
//draw the door to maze
  drawSprite(this.maze);
  if(playerSprite.overlap(this.maze) && keyIsDown(65)){
      adventureManager.changeState("FM");
      playerSprite.position.x += 330;
      playerSprite.position.y -= 300;
}
}
}

class FM extends PNGRoom {
  preload() {
//back to dm
    this.dm = createSprite(624, 10, 50, 50);
    this.dm.addImage(Door[0]);
//upleft1
    this.u1 = createSprite(270, 126, 50, 50);
    this.u1.addImage(Door[8]);
//upleft2
    this.u2 = createSprite(270, 214, 50, 50);
    this.u2.addImage(Door[8]);
//middleleft
    this.ml = createSprite(270, 346, 50, 50);
    this.ml.addImage(Door[8]);
//bottomleft1
    this.b1 = createSprite(270, 546, 50, 50);
    this.b1.addImage(Door[8]);
//bottomleft2
    this.b2 = createSprite(270, 649, 50, 50);
    this.b2.addImage(Door[8]);
//upright
    this.ur = createSprite(1000, 133, 50, 50);
    this.ur.addImage(Door[6]);
//middleright
    this.mr = createSprite(1000, 542, 50, 50);
    this.mr.addImage(Door[6]);
//exit
    this.exit = createSprite(1000, 643, 50, 50);
    this.exit.addImage(Door[6]);
//bottom
    this.bottom = createSprite(489, 717, 50, 50);
    this.bottom.addImage(Door[7]);
  }

  draw(){
    super.draw();
//draw the door to dm
    drawSprite(this.dm);
    if(playerSprite.overlap(this.dm) && keyIsDown(87)){
      adventureManager.changeState("DM");
      playerSprite.position.x -= 300;
      playerSprite.position.y += 340;
  }
//upleft1
  drawSprite(this.u1);
  if(playerSprite.overlap(this.u1) && keyIsDown(65)){
      playerSprite.position.x += 20;
      playerSprite.position.y += 520;
}
//upleft2
drawSprite(this.u2);
  if(playerSprite.overlap(this.u2) && keyIsDown(65)){
      playerSprite.position.x += 700;
      playerSprite.position.y -= 90;
}
//middleleft
drawSprite(this.ml);
  if(playerSprite.overlap(this.ml) && keyIsDown(65)){
      playerSprite.position.x += 20;
      playerSprite.position.y += 200;
}
//bottomleft1
drawSprite(this.b1);
  if(playerSprite.overlap(this.b1) && keyIsDown(65)){
      playerSprite.position.x += 20;
      playerSprite.position.y -= 200;
}
//bottomleft2
drawSprite(this.b2);
  if(playerSprite.overlap(this.b2) && keyIsDown(65)){
      playerSprite.position.x += 20;
      playerSprite.position.y -= 520;
}
//upright
drawSprite(this.ur);
  if(playerSprite.overlap(this.ur) && keyIsDown(68)){
      playerSprite.position.x -= 700;
      playerSprite.position.y += 90;
}
//middleright
drawSprite(this.mr);
  if(playerSprite.overlap(this.mr) && keyIsDown(68)){
      playerSprite.position.x -= 510;
      playerSprite.position.y += 150;
}
//bottom
drawSprite(this.bottom);
  if(playerSprite.overlap(this.bottom) && keyIsDown(83)){
      playerSprite.position.x += 510;
      playerSprite.position.y -= 150;
}
//exit
drawSprite(this.exit);
  if(playerSprite.overlap(this.exit) && keyIsDown(68)){
      adventureManager.changeState("Evillage");
      playerSprite.position.x -= 730;
      playerSprite.position.y -= 280;
}
}
}


class Evillage extends PNGRoom {
  preload() {
//back to fork
    this.fm = createSprite(224, 366, 50, 50);
    this.fm.addImage(Door[8]);
//go to Forest
    this.forest = createSprite(1047, 368, 50, 50);
    this.forest.addImage(Door[6]);

    this.npc1 = createSprite(437, 329, 33, 50);
    this.npc1.addAnimation('npc', NPC[6]);

    this.npc2 = createSprite(388, 345, 33, 50);
    this.npc2.addAnimation('npc', NPC[7]);

    this.prop = createSprite(724, 157, 24, 28);
    this.prop.addImage(Door[3]);
  }

  draw(){
    super.draw();
//draw the door to fm
    drawSprite(this.fm);
    if(playerSprite.overlap(this.fm) && keyIsDown(65)){
      adventureManager.changeState("FM");
      playerSprite.position.x += 730;
      playerSprite.position.y += 280;
  }
//draw the door to forest
  drawSprite(this.forest);
  if(playerSprite.overlap(this.forest) && keyIsDown(68)){
      adventureManager.changeState("Forest");
      playerSprite.position.x -= 656;
      playerSprite.position.y += 255;
}
//draw npc1
drawSprite(this.npc1);
    if (playerSprite.overlap(this.npc1)) {
      dialogueVisible = true;
      currentDialogue = 'I have to go and inform lord of this news.';
    }else{
      dialogueVisible = false;
    }
//draw npc2
drawSprite(this.npc2);
    if (playerSprite.overlap(this.npc2)) {
      dialogueVisible = true;
      currentDialogue = 'OMG, someone came out of the Forest Maze alive!!! Are you coming from the west too?';
    }

//draw prop store
    drawSprite(this.prop);
    if(playerSprite.overlap(this.prop) && keyIsDown(87)){
      adventureManager.changeState("Prop");
      playerSprite.position.x -= 80;
      playerSprite.position.y += 530;
  }
}
}

class Prop extends PNGRoom {
  preload() {
    this.door = createSprite(638, 710, 50, 50);
    this.door.addImage(Door[7]);

    this.npc = createSprite(728, 196, 33, 50);
    this.npc.addAnimation('npc', NPC[5]); 

    this.buy = createSprite(512, 286, 30, 30);
    this.buy.addAnimation('buy', NPC[0]);
  }

  draw(){
    super.draw();
//draw the door to village
    drawSprite(this.door);
    if(playerSprite.overlap(this.door) && keyIsDown(83)){
      adventureManager.changeState("Evillage");
      playerSprite.position.x += 80;
      playerSprite.position.y -= 480;
  }

//draw the npc
    drawSprite(this.npc);

//draw the goods
    drawSprite(this.buy);
    if(playerSprite.overlap(this.buy)){
       enterTextVisible = true;
       currentEnterText = 'Press ENTER to check the price';
    }else{
      enterTextVisible = false;
    }
    if (playerSprite.overlap(this.buy) && keyIsDown(ENTER)) {
      dialogueVisible = true;
      currentDialogue = 'Tomato $800   Sorry, you dont have enough money to pay for it';
    }else if(mouseIsPressed){
      dialogueVisible = false;
    }
}
}

class Forest extends PNGRoom {
  preload() {
//back to evillage
    this.back = createSprite(348, 628, 50, 50);
    this.back.addImage(Door[8]);

this.mine = createSprite(627, 700, 50, 50);
this.mine.addImage(Door[7]);
  }

  draw(){
    super.draw();
//draw the door to evillage
    drawSprite(this.back);
    if(playerSprite.overlap(this.back) && keyIsDown(65)){
      adventureManager.changeState("Evillage");
      playerSprite.position.x += 656;
      playerSprite.position.y -= 255;
  }

drawSprite(this.mine);
    if(playerSprite.overlap(this.mine) && keyIsDown(83)){
      dialogueVisible = true;
      currentDialogue = 'Mines, no idlers are allowed to enter. Are you sure you want to enter?. Press ENTER to enter';
  }else if(keyIsDown(ENTER)){
     dialogueVisible = false;
  }
  if(playerSprite.overlap(this.mine) && keyIsDown(ENTER)){
      adventureManager.changeState("Emine");
      playerSprite.position.y -= 630;
  }
}
}
  


class Emine extends PNGRoom{
  preload(){
    this.npc = createSprite(678, 432, 33, 50);
    this.npc.addImage('john', NPC[2]);

    this.lord = createSprite(612, 188, 33, 50);
    this.lord.addAnimation('lord', NPC[8]);

    this.soldier = createSprite(642, 160, 33, 50);
    this.soldier.addAnimation('enemy', NPC[9]);    
  }

  draw(){
    super.draw();

    drawSprite(this.npc);
    if (playerSprite.overlap(this.npc)) {
      enterTextVisible = true;
      currentEnterText = 'Press SPACE to talk';
    }else{
      enterTextVisible = false;
    }
  if (playerSprite.overlap(this.npc) && keyIsDown(32)) {
    dialogueVisible = true;
      counter = 1;
    }else if(mouseIsPressed){
    counter += 1;} 
    else if(counter == 1){
      frameRate(8);
  currentDialogue = 'David: John? ! !';
    }
else if(counter == 2){
  frameRate(8);
      currentDialogue = 'David: John! Its really you! You are still alive!';      
}else if(counter == 3){
  frameRate(8);
  currentDialogue = 'John: Why are you in the East? Are you here alone?';
}
else if(counter == 4){
  frameRate(8);
  currentDialogue = 'David: I chose to leave the west and come here by myself. I think maybe I can find a new job here.';
}
else if(counter == 5){
  frameRate(8);
   currentDialogue = 'David: It has been three years since you left from the west. Why have you not contacted us for the past three years?';
}
else if(counter == 6){
  frameRate(8);
   currentDialogue = 'John: I...I cant leave here. I signed a work contract. I have to work here for ten years before I can leave.';
}
else if(counter == 7){
  frameRate(8);
   currentDialogue = 'David: Ten years! ? What kind of job requires you to sign such a demanding contract?';
}
else if(counter == 8){
  frameRate(8);
   currentDialogue = 'Lord of East: Oh, my brave adventurer, I have been looking for you for a long time, so you are here!';
   drawSprite(this.lord);
}
else if(counter == 9){
  frameRate(8);
   currentDialogue = 'Lord of East: Have you decided yet?';
}
else if(counter == 10){
  frameRate(8);
   currentDialogue = 'Lord of East: Did you decide to stay here and let me arrange a job for you, or go back?';
}
else if(counter == 11){
  frameRate(80);
   currentDialogue = 'Press T to stay in east/ F to back to west';
}

if(keyIsDown(84)){
  currentDialogue = 'Lord of East: Smart choice!';
}
if(keyIsDown(70)){
  currentDialogue = 'Lord of East: Another chance for you to make the decision. We will be waiting you to make the right decision.';
   }

  }
}


class OC extends PNGRoom {
  preload() {
//the door to Castle
    this.enter = createSprite(640, 400, 20, 20);
    this.enter.addImage(Door[5]);

  }

  draw(){
    super.draw();
//draw the door to Castle
    drawSprite(this.enter);
    if(playerSprite.overlap(this.enter) && keyIsDown(87)){
      adventureManager.changeState("Castle");
      playerSprite.position.y += 250;
  }
}
}

class Castle extends PNGRoom {
  preload() {
//back to OC
    this.exit = createSprite(640, 700, 20, 20);
    this.exit.addImage(Door[7]);

    this.lord = createSprite(639, 224, 33, 50);
    this.lord.addAnimation('npc', NPC[8]);

  }

  draw(){
    super.draw();
//draw the door to exit
    drawSprite(this.exit);
    if(playerSprite.overlap(this.exit) && keyIsDown(83)){
      adventureManager.changeState("OC");
      playerSprite.position.y -= 250;
  }
//draw the npc
drawSprite(this.lord);
  if (playerSprite.overlap(this.lord)) {
      enterTextVisible = true;
      currentEnterText = 'Press SPACE to talk';
    }else{
      enterTextVisible = false;
    }
  if (playerSprite.overlap(this.lord) && keyIsDown(32)) {
    dialogueVisible = true;
      counter = 1;
    }else if(mouseIsPressed){
    counter += 1;} 
    else if(counter == 1){
      frameRate(8);
  currentDialogue = 'Lord of East: Young adventurer! I cant believe that you can go through the difficult maze!';
    }
else if(counter == 2){
  frameRate(8);
      currentDialogue = 'David: Thank you for your affirmation, Lord.';      
}else if(counter == 3){
  frameRate(8);
  currentDialogue = 'Lord of East: You can come to our city so smoothly, all this is the arrangement of fate.';
}
else if(counter == 4){
  frameRate(8);
  currentDialogue = 'Lord of East: I know what you want, I can arrange work for you, and you will be paid $1000 every week.';
}
else if(counter == 5){
  frameRate(8);
   currentDialogue = 'David: !?! $1000, is this true? In this way, you can get about $4000 in one month, which is really a lot of money...';
}
else if(counter == 6){
  frameRate(8);
   currentDialogue = 'Lord of East: Be confident young people, you deserve it.';
}
else if(counter == 7){
  frameRate(8);
   currentDialogue = 'Lord of East: If there are no problems, lets sign the contract.';
}
else if(counter == 8){
  frameRate(8);
   currentDialogue = 'David: Sorry, please wait a moment, I want to think about it again. This is really a surprise, I havent gotten over for a while.';
}
else if(counter == 9){
  frameRate(8);
   currentDialogue = 'Lord of East: In that case, you can think about it again and come here to find me after you decide.';
}
else if(counter == 10){
  frameRate(80);
   dialogueVisible = false;
}
}
}
