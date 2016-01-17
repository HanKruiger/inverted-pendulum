function Pendulum(particles, springs, constraints) {
	this.particles = particles;
	this.springs = springs;
	this.updateAccelerations();
}

Pendulum.prototype.update = function(dt, t) {
	// Calculate half-step velocities
	for (var i = 0; i < this.particles.length; i++) {
		var p = this.particles[i];
		if (p instanceof Particle) {
			p.velocity.add(Vec2.mult(p.acc, 0.5 * dt));
			p.position.add(Vec2.mult(p.velocity, dt));
		} else if (p instanceof DrivenParticle) {
			p.update(t);
		}
	}

	// TODO: Stochastically enforce the constaints

	// Update accelerations
	this.updateAccelerations();

	// Calculate end-point velocities with the new accelerations
	for (i = 0; i < this.particles.length; i++) {
		var p = this.particles[i];
		if (p instanceof Particle) {
			p.velocity.add(Vec2.mult(p.acc, 0.5 * dt));
		}
	}
};

Pendulum.prototype.updateAccelerations = function() {
	// Distribute spring forces
	for (var i = 0; i < this.springs.length; i++) {
		this.springs[i].exertForce();
	}

	for (i = 0; i < this.particles.length; i++) {
		var p = this.particles[i];
		if (p instanceof Particle) {
			// console.log('Before: ' + p.force.y);
			p.addGravity();
			// console.log('After: ' + p.force.y);
			// Newton's law
			p.acc = Vec2.mult(p.force, p.mass);
			// Reset force to zero for next iteration.
			p.force.mult(0);
		}
	}
}

Pendulum.prototype.draw = function(ctx) {
	for (var i = 0; i < this.springs.length; i++) {
		this.springs[i].draw(ctx);
	}

	for (var i = 0; i < this.particles.length; i++) {
		this.particles[i].draw(ctx);
	}
};