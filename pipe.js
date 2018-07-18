function Pipe() {
  this.spacing = 250;
  this.top = random(height / 4, 2 / 3 * height);
  this.bottom = this.top + this.spacing;
  this.w = 80;
  this.x = width + this.w / 2;

  this.hits = function(bird) {
    if ((bird.y - bird.size / 2 < this.top || bird.y + bird.size / 2 > this.bottom) &&
      (bird.x + bird.size / 2 > this.x - this.w / 2 && bird.x - bird.size / 2 < this.x + this.w / 2)) {
      return true;
    }
    return false;
  }

  this.show = function() {
    fill(200);
    rect(this.x, this.top / 2, this.w, this.top);
    rect(this.x, (this.bottom + height) / 2, this.w, height - this.bottom);
  }

  this.update = function() {
    this.x -= difficultySpeed;
  }
}
