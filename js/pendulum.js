function Pendulum(particles, dp, springs, constraints) {
	this.particles = particles;
	this.dp = dp;
	this.springs = springs;
	this.updateAccelerations();
}

Pendulum.prototype.update = function(dt, t) {
	// Calculate half-step velocities
	for (var i = 0; i < this.particles.length; i++) {
		var p = this.particles[i];
		p.velocity.add(Vec2.mult(p.acc, 0.5 * dt));
		p.position.add(Vec2.mult(p.velocity, dt));
	}

	// Update driven particle
	this.dp.update(t);

	// TODO: Stochastically enforce the constaints

	// Update accelerations
	this.updateAccelerations();

	// Calculate end-point velocities with the new accelerations
	for (i = 0; i < this.particles.length; i++) {
		var p = this.particles[i];
		p.velocity.add(Vec2.mult(p.acc, 0.5 * dt));
	}
};

Pendulum.prototype.updateAccelerations = function() {
	// Distribute spring forces
	for (var i = 0; i < this.springs.length; i++) {
		this.springs[i].exertForces();
	}

	for (i = 0; i < this.particles.length; i++) {
		var p = this.particles[i];
		p.force.y -= 981 * p.mass;
		// Newton's law
		p.acc.x = p.force.x / p.mass
		p.acc.y = p.force.y / p.mass
		// p.acc = Vec2.mult(p.force, p.mass);
		// Reset force to zero for next iteration.
		p.force.x = 0;
		p.force.y = 0;
	}
}

Pendulum.prototype.draw = function(ctx) {
	for (var i = 0; i < this.springs.length; i++) {
		this.springs[i].draw(ctx);
	}

	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].draw(ctx);
	}
	this.dp.draw(ctx);
};