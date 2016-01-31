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
		p.addGravity()
		// Newton's law
		p.acc = Vec2.mult(p.force, 1 / p.mass);
		// Reset force to zero for next iteration.
		p.force.mult(0);
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