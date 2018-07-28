// Objective: This program/game is designed for players to learn the dangers of texting & driving and how multitasking is probably not a good idea.

var x = 0;
var y = 0;
var a = 0;
var v = 0;
var r = 0;
var coordinate = function(x, y, r){
  this.x = x;
  this.y = y;
  this.r = r;
};

var typing = `boi pls pay attention at the road ahead of you so that you dont fail terribly at driving lorem ipsum dolor set the fitnessgram pacer test is a multistage aerobic capacity test that progressively gets more difficult as it continues to get more difficult   Chess is a relatively bad tactical turn based RPG developed by a bunch of monkeys. Right away you'll notice Chess has no storyline. Instead, all you notice is the White army and the Black army are fighting each other over a battlefield. Note the a 'battlefield,' because Chess only has one story map. As for the actual combat, it's extremely dull. Each unit can kill another with only one hit. This means units with a real good movement ability dominate the field (more on that bellow). There aren't even any combat animations or anything that happens in combat. One unit moves on it's space and 'captures' it, and the piece is removed from the game with no form of action or special effects. oh by the way this doesn't end, but in real life, remember to not text and drive at the same time"`;
var typed = "";
var keys = [];
var locations = [];
var decay = []; // transitive array
var ytrans = 0;
var mp;

var keyPressed = function(){
  keys[keyCode] = true;
  if(keyCode === 8){
    typed = typed.split('').splice(0, typed.length-1).join('');
    ytrans = -25;
  }
  if(keyCode >= 32){
    if(typed[typed.length-1] === typing[typed.length-1]){
      var letter = String.fromCharCode(keyCode).toLowerCase();
      typed += keys[SHIFT] ? letter.toUpperCase() : letter;
      //typed += String.fromCharCode(key);
      ytrans = 25;
    }else{
      ytrans = 25;
    }
  }
};
var keyReleased = function(){
  keys[keyCode] = false;
};
var mousePressed = function(){
  mp = true;
};

var road = [new coordinate(0, 0, 0)];
// [min, max, angleIncrement]
var roadType = [[5, 15, 0], [5, 5, 0], [5, 5, 0], [5, 5, 18], [5, 5, -18], [8, 8, 22.5],  [8, 8, 22.5]];
var roadMode = 0;
var roadLeft = 10;
var roadSize = 150;
var updateRoad = function(){
  if(roadLeft--){
    var $i = road.length-1;
    var $r = road[$i].r + Math.PI/180*(roadType[roadMode][2]);
    var $x = road[$i].x + Math.cos($r) * roadSize;
    var $y = road[$i].y + Math.sin($r) * roadSize;
    road.push(new coordinate(
      $x, $y, $r
    ));
  }else{
    roadMode = ~~(Math.random() * roadType.length);
    roadLeft = roadType[roadMode][0] + ~~(Math.random() * (roadType[roadMode][1]-roadType[roadMode][0]));
  }
};

for(var i = 0; i < 12; i ++){
  updateRoad();
}

x = road[0].x;
y = road[0].y;
var ll = 1;

var dewae, cahr;
function setup() {
  //createCanvas(windowWidth, windowHeight);
  createCanvas(800, 600);
  //noCursor();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  imageMode(CENTER);
  strokeCap(PROJECT);
  dewae = loadImage("assets/dewae.png");
  cahr = loadImage("assets/cahr.png");
}
function draw(){
  background(255, 255, 255);
  fill(0, 0, 0);
  noStroke();

  translate(300, 400);
  scale(Math.min(1/(v/10), 3));
  translate(-x, -y);
  if(road.length > 5){
    if(dist(x, y, road[1].x, road[1].y) < roadSize){
      if(dist(x, y, road[2].x, road[2].y) > roadSize){
        updateRoad();
      }
      decay.push(Object.assign({d: 30}, road[0]));
      road.splice(0, 1);
      // score increment (called to extend the road)
      console.log(ll++);
    }
    if(dist(x, y, road[0].x, road[0].y) > roadSize&&frameCount>40){
      background(255,0, 0);
      noLoop();
    }
  }

  //fill(173);
  for(var i = 0; i < decay.length; i ++){
    push();
    translate(decay[i].x, decay[i].y);
    rotate(decay[i].r +Math.PI/2);
    tint(255, decay[i].d*10);
    image(dewae, 0, 0, 2*roadSize, 2*roadSize);
    pop();
    decay[i].x += (road[0].x - decay[i].x) / (30-v);
    decay[i].y += (road[0].y - decay[i].y) / (30-v);
    decay[i].r += (road[0].r - decay[i].r) / (30-v);
    if(!(decay[i].d--)){
      decay.splice(i, 1);
    }
  }
  for(var i = 0; i < road.length; i ++){
    push();
    translate(road[i].x, road[i].y);
    rotate(road[i].r +Math.PI/2);
    image(dewae, 0, 0, 2*roadSize, 2*roadSize);
    pop();
  }
  noTint();

  for(var i = 0; i < locations.length; i ++){
    push();
    translate(locations[i].x, locations[i].y);
    rotate(locations[i].r);
    fill(0, 0, 0, i/10);
    rect(0, 0, i, i);
    pop();
  }
  locations.splice(0, locations.length>100);

  r  = atan2(mouseY - 400, mouseX - 300);
  translate(x, y);
  rotate(r + Math.PI/2);
  //fill(0, 0, 0, 100);
  //rect(0, 0, 100, 100);
  image(cahr, 0, 0, 100, 200);
  y += Math.sin(r)*(v);
  x += Math.cos(r)*(v);
  v = constrain(v+0.0005*100, 3, 25);
  locations.push(new coordinate(x, y, atan2(mouseY - 400, mouseX - 300)));

  resetMatrix();

  textSize(25);
  fill(0, 0, 0, 50);
  rect(225, 127, 30, 120);
  translate(200+ytrans, 0);
  for(var i = typed.length-10; i < Math.min(typed.length+10, typing.length); i ++){
    fill(0, 0, 0, 30);
    rect((i-typed.length)*25+25, 100, 20, 50);
    fill(0);
    text(typing[i], (i-typed.length)*25+25, 100);
    fill(0, 0, 0, 30);
    rect((i-typed.length)*25+25, 155, 20, 50);
    fill(0);
    text(typed[i], (i-typed.length)*25+25, 155);
  }
  ytrans /= 1.2;
  resetMatrix();

  text(~~frameRate() + "fps", 45, 25);
  mp = false;
};


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
