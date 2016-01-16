function Pendulum(particles, springs, constraints) {
	this.particles = particles;
	this.springs = springs;
}

Pendulum.prototype.update = function(dt, t) {
	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].update(dt, t);
	}
};

Pendulum.prototype.draw = function(ctx) {
	for (var i = 0; i < this.springs.length; i++) {
		this.springs[i].draw(ctx);
	}

	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].draw(ctx);
	}
};