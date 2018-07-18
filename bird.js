function Bird(genome) {
  this.y = height / 2;
  this.x = 64;
  this.size = 30;

  this.gravity = 0.5;
  this.lift = -10;
  // starting velocity
  this.velocity = this.lift;

  this.brain = genome;
  this.brain.score = 0;

  this.dead = false;

  // show bird (square)
  this.show = function() {
    fill(255);
    rect(this.x, this.y, this.size, this.size);
  }

  // update physics and check if dead
  this.update = function () {

    if (this.dead) {
      this.x -= difficultySpeed;
      return;
    }

    var input = this.detect();
    var output = this.brain.activate(input);

    var shouldJump = (output[0] > 1 ? 1 : (output[0] < 0 ? 0 : output[0])) == 1;
    if (shouldJump) {
      this.velocity = this.lift;
    }

    this.velocity += this.gravity;
    // this.velocity *= 0.9;
    this.y += this.velocity;

    // reset if hit
    for (var i = 0; i < pipes.length; i++) {
      let pipe = pipes[i];
      if (pipe.hits(this) || this.y - this.size / 2 < 0 || this.y + this.size / 2 > height) {
        if (isAIPlaying) {
          // reset
          this.y = height / 2;
          this.velocity = this.lift;
          this.brain.score = 0;
          pipes = [new Pipe()];
          baseFrame = frameCount - 1;
        } else {
          this.dead = true;
          return;
        }
      }
    }

    // add to brain score so neural network algorithm can later decide how good this bird was
    this.brain.score += 1;

  }

  // inputs: distance from top, distance from bottom, horizontal distance from center of next pipe opening, vertical center of next pipe opening, vertical velocity (5)

  this.detect = function () {
    // left to right, so first one should which matches should be correct next pipe
    let nextPipe;
    for (var i = 0; i < pipes.length; i++) {
      let pipe = pipes[i];
      if (pipe.x >= this.x) {
        nextPipe = pipe;
        break;
      }
    }

    var inputs = [
      this.y, // distance from top
      height - this.y, // distance from bottom
      nextPipe.x - this.x, // horizontal distance from center of next pipe
      (nextPipe.top + nextPipe.spacing / 2), // vertical center of next pipe
      this.velocity // vertical velocity
    ];
    return inputs;
  }

}
