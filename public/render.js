var typing = `boi pls pay attention at the road ahead of you so that you dont fail terribly at driving lorem ipsum dolor set the fitnessgram pacer test is a multistage aerobic capacity test that progressively gets more difficult as it continues to get more difficult   Chess is a relatively bad tactical turn based RPG developed by a bunch of monkeys Right away youwillll notice Chess has no storyline Instead all you notice is the White army and the Black army are fighting each other over a battlefield Note the a battlefield because Chess only has one story map As for the actual combat, its extremely dull Each unit can kill another with only one hit. This means units with a real good movement ability dominate the field ore on that bellow There arent even any combat animations or anything that happens in combat. One unit moves on its space and captures it, and the piece is removed from the game with no form of action or special effects. oh by the way this doesnot end but in fakent life remember to not text and drive at the same time`;
var typed = "";
var exhaust = []; //EXHAUST
var ytrans = 0;
var mp;
var keys = [];

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

var cahr, notu;
var road = {
  r1: null,
  r2: null,
  r3: null,
  r4: null,
};
function preload() {
  font = loadFont('assets/Agency-FB.ttf');
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  //createCanvas(800, 600);
  //noCursor();
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  imageMode(CENTER);
  strokeCap(PROJECT);
  cahr = loadImage("assets/cahr.png");
  notu = loadImage("assets/notu.png");
  road.r4 = loadImage("assets/r4.png");
}
function draw(){
  background(255, 255, 255);
  fill(0, 0, 0);
  noStroke();

  translate(width/2, height/2);
  scale(Math.min(1/(Math.abs(v)/4), 1));
  translate(-x, -y);

  //fill(173);

  //render the road
  for(let i = 0; i < gmap.length; i ++){
    for(let j = 0; j < gmap[i].length; j ++){
      let img;
      switch(gmap[i][j]){
        case "=":
          img = road.r4;
          break;
        default:
          continue;
      }
      if(img) image(img, j*500, i*500, 500, 500);
    }
  }
  noTint();

  for(var i = 0; i < exhaust.length; i ++){
    push();
    translate(exhaust[i].x, exhaust[i].y);
    rotate(exhaust[i].r+Math.PI/2);
    fill(0, exhaust[i].d*10);
    rect(0, 0, 10, 10);
    pop();
    if(!(exhaust[i].d--)) exhaust.splice(i, 1);
  }

  for(let i = 0; i < plyrs.length; i ++){
    push();
    translate(plyrs[i].x, plyrs[i].y);
    rotate(plyrs[i].r + Math.PI/2);
    image(notu, 0, 0, 100, 200);
    pop();
  }

  //r  = atan2(mouseY - 400, mouseX - 300);
  translate(x, y);
  rotate(r + Math.PI/2);
  //fill(0, 0, 0, 100);
  //rect(0, 0, 100, 100);
  image(cahr, 0, 0, 100, 200);
  x += Math.cos(r)*(v);
  y += Math.sin(r)*(v);
  //v = constrain(v+0.0005*100, 3, 25);
  exhaust.push(Object.assign({d: 20}, new xyr(x+Math.cos(r+Math.PI)*100, y+Math.sin(r+Math.PI)*100, r)));

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

  stroke(0);
  line(width/2, height/2, mouseX, height/2);
  line(mouseX, height/2, mouseX, mouseY);
  noStroke();
};

function mouseMoved() {
  let cx = 2*mouseX/width - 1;
  let cy = 2*mouseY/height - 1;
  console.log(cx+";"+cy);
  socket.emit("manual", {x: cx, y: -cy});
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
