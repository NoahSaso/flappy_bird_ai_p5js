var birds = [];
var pipes = [];

var baseFrame = 0;

var difficultySpeed = 4; // how fast the environment (pipes + dead (stuck) birds) moves

var infoP;

var remainingAlive = BIRD_COUNT;

var highestScore = 0;
var currScore = 0;

var pipesRekt = 0;

var isAIPlaying = false;

var gameSpeedP;

function beginAI() {
  isAIPlaying = true;
  var newPop = [];
  for(var i = 0; i < BIRD_COUNT; i++){
    var json = trainedPop[i % trainedPop.length];
    newPop[i] = neataptic.Network.fromJSON(json);
  }
  neat.population = newPop;
  birds = [new Bird(neat.population[0])];
  pipes = [new Pipe()];
  baseFrame = frameCount - 1;
}

function infoPHTML() {
  return `Generation: ${neat.generation}<br>Highest Score: ${highestScore}<br>Current Score: ${currScore}<br>Pipes Rekt: ${pipesRekt}<br>Remaining Alive: ${remainingAlive}`;
}

function setup() {
  var canvas = createCanvas(800, 800);
  canvas.parent('sketch');
  rectMode(CENTER);
  initNeat();

  // drawGraph(network.graph(800, 800), '.draw');

  infoP = createP(infoPHTML());
  gameSpeedP = createP('Game Speed: ' + difficultySpeed);
  var difficultySpeedSlider = createSlider(1, 10, difficultySpeed);
  difficultySpeedSlider.changed(() => {
    difficultySpeed = difficultySpeedSlider.value();
    gameSpeedP.html('Game Speed: ' + difficultySpeed);
  });

  createButton('Save Current Population').mousePressed(saveCurrentPopulation);
  createButton('Watch Trained AI').mousePressed(beginAI);

  startEvaluation();
}

function draw() {
  background(51);

  remainingAlive = 0;
  var allHaveDied = true;
  for (var i = 0; i < birds.length; i++) {
    if (!birds[i].dead) {
      remainingAlive++;
      allHaveDied = false;
      currScore = birds[i].brain.score;
      if (currScore > highestScore) {
        highestScore = currScore;
      }
    }
  }

  infoP.html(infoPHTML());

  if (!isAIPlaying && allHaveDied) {
    endEvaluation();
    return;
  }

  for (var i = 0; i < pipes.length; i++) {
    pipes[i].update();
    pipes[i].show();
  }

  for (var i = 0; i < birds.length; i++) {
    birds[i].update();
    birds[i].show();
  }

  if ((frameCount - baseFrame) % Math.round(90.0 * 4.0 / difficultySpeed) == 0) {
    if (pipes.length == 3) {
      pipes.splice(0, 1);
      pipesRekt++;
    }
    pipes.push(new Pipe());
  }
}

