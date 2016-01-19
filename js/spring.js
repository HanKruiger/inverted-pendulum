function Spring(p1, p2, k, l, damp) {
    this.p1 = p1;
    this.p2 = p2;
    this.k = k;
    this.l = l;
	this.damp = damp;
}

Spring.prototype.exertForces = function() {
    var dist = Vec2.sub(this.p2.position, this.p1.position).mag();
    var unitVec = Vec2.setMag(Vec2.sub(this.p2.position, this.p1.position), 1);

    // Hooke's law
    var springForce = Vec2.setMag(unitVec, this.k * (dist - this.l))
    if (this.p1 instanceof Particle) {
        this.p1.addForce(springForce);
    }
    if (this.p2 instanceof Particle) {
        this.p2.addForce(Vec2.mult(springForce, -1));
    }

    // Dampening based on relative velocity
    var vRelative = Vec2.sub(this.p2.velocity, this.p1.velocity);
    var dampeningForce = Vec2.mult(vRelative, this.damp);
    if (this.p1 instanceof Particle) {
        this.p1.addForce(dampeningForce);
    }
    if (this.p2 instanceof Particle) {
        this.p2.addForce(Vec2.mult(dampeningForce, -1));
    }
};

Spring.prototype.getFrequency = function() {
    // m1 = self.p1.mass
    // m2 = self.p2.mass
    // return np.sqrt(self.k * ((m1 + m2) / (2 * m1 * m2))) / (2.0 * np.pi)
    var m1 = this.p1.mass;
    var m2 = this.p2.mass;
    return Math.sqrt(this.k * ((m1 + m2) / (2 * m1 * m2))) / (2.0 * Math.PI);
}

Spring.prototype.draw = function(ctx) {
    ctx.lineWidth = 0.05;
    ctx.strokeStyle = "rgb(10, 10, 10)";
    ctx.beginPath();
    ctx.moveTo(this.p1.position.x, this.p1.position.y);
    ctx.lineTo(this.p2.position.x, this.p2.position.y);
    ctx.stroke();
};