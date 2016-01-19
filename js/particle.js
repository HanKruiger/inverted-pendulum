function Particle(x, y, mass) {
    this.position = new Vec2(x, y);
    this.velocity = new Vec2(0, 0);
    this.acc = new Vec2(0, 0);
	this.force = new Vec2(0, 0);
    this.mass = mass;

    // For drawing
    this.radius = 0.1;
}

Particle.prototype.addForce = function(force) {
    this.force.add(force);
}

Particle.prototype.addGravity = function() {
    this.force.y -= 981 * this.mass;
}

Particle.prototype.draw = function(ctx) {
	ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.lineWidth = 0.05;
    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.strokeStyle = "rgb(10, 10, 10)";
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
};