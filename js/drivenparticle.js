function DrivenParticle(x, y, freq, ampl) {
	this.position = new Vec2(x, y);
    this.radius = 0.1;
    this.freq = freq;
    this.ampl = ampl;
    this.y_0 = y;
}

DrivenParticle.prototype.update = function(dt, t) {
    this.position.y = this.y_0 + this.ampl * Math.cos(2 * Math.PI * this.freq * t);
};

DrivenParticle.prototype.setFreq = function(freq) {
    this.freq = freq;
}

DrivenParticle.prototype.getFreq = function() {
    return this.freq;
}

DrivenParticle.prototype.setAmpl = function(ampl) {
    this.ampl = ampl;
}

DrivenParticle.prototype.getAmpl = function() {
    return this.ampl;
}

DrivenParticle.prototype.draw = function(ctx) {
	ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.lineWidth = 0.05;
    ctx.fillStyle = "rgb(200, 50, 50)";
    ctx.strokeStyle = "rgb(10, 10, 10)";
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI*2, true);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
};