function DrivenParticle(x, y, freq, ampl, mass) {
	this.position = new Vec2(x, y);
    this.velocity = new Vec2(0, 0);
    this.radius = 0.1;
    this.freq = freq;
    this.ampl = ampl;
    this.mass = mass;
    this.y_0 = y;
}

DrivenParticle.prototype.update = function(t) {
    this.position.y = this.y_0 + this.ampl * Math.cos(2 * Math.PI * this.freq * t);
    this.velocity.y = -this.ampl * 2 * Math.PI * this.freq * Math.sin(2 * Math.PI * this.freq * t);
};

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