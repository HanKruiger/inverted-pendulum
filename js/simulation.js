function Simulation() {
	this.initCanvas();
	this.initPendulum();
	this.setDt();
	this.initParameters();

	this.t = 0.0;
	this.steps = 0;
}

Simulation.prototype.initCanvas = function() {
	var canvas = $('#the_canvas').get(0);
	if (canvas.getContext) {
		this.ctx = canvas.getContext('2d');
		/* For resizing canvas. For reference,
		 * see http://stackoverflow.com/a/3078427 */
		this.ctx.canvas.width = 0.8 * window.innerWidth;

		// Prevents right-click context menu.
		$('body').on('contextmenu', '#the_canvas', function(e) {
			return false;
		});

		// Initialize camera to be centered on the world's origin
	    this.camera = new Vec2(0.5 * this.ctx.canvas.width, 0.7 * this.ctx.canvas.height);
	    this.zoom = 56;
	} else {
		console.error('Canvas not supported by browser.');
	}
};

Simulation.prototype.initPendulum = function() {
	var mass = 0.02;
	var lengthSides = 6.0;
	var lengthUpperLower = 0.8;
	var p1 = new Particle(-0.5 * lengthUpperLower, 0, mass);
	var p2 = new Particle(0.5 * lengthUpperLower, 0, mass);
	var p3 = new Particle(-0.4 * lengthUpperLower, lengthSides, mass);
	var p4 = new Particle(0.6 * lengthUpperLower, lengthSides, mass);
	var dp = new DrivenParticle(0, 0, 110, 0.3, mass);

	var k = 1e5;
	var damp = 0.1;
	var s1 = new Spring(p1, p2, k, lengthUpperLower, damp);
	var s2 = new Spring(p3, p4, k, lengthUpperLower, damp);
	var s3 = new Spring(p1, p3, k, lengthSides, damp);
	var s4 = new Spring(p2, p4, k, lengthSides, damp);

	var restLengthMiddleDown = p1.position.dist(dp.position);
	var restLengthMiddleUp = p3.position.dist(dp.position);

	var s5 = new Spring(dp, p1, k, restLengthMiddleDown, damp);
	var s6 = new Spring(dp, p2, k, restLengthMiddleDown, damp);
	var s7 = new Spring(dp, p3, k, restLengthMiddleUp, damp);
	var s8 = new Spring(dp, p4, k, restLengthMiddleUp, damp);

	var particles = [p1, p2, p3, p4];
	var springs = [s1, s2, s3, s4, s5, s6, s7, s8];
	var constraints = [];

	this.pendulum = new Pendulum(particles, dp, springs, constraints);
};

Simulation.prototype.initParameters = function() {
	this.parameters = [];
	this.parameters.push(new Slider(
		"Frequency", this.pendulum.dp.freq, 10, 500, 'left', this, function(freq) {
			this.steps = 0.0
			this.initPendulum();
			this.pendulum.dp.freq = freq;
			this.setDt();
		}
	));
	this.parameters.push(new Slider(
		"Amplitude", this.pendulum.dp.ampl, 0.0, 0.8, 'left', this, function(ampl) {
			this.pendulum.dp.ampl = ampl;
		}
	));
	this.parameters.push(new Slider(
		"Dampening", this.pendulum.springs[0].damp, 0.0, 0.2, 'left', this, function(damp) {
			for (var i = 0; i < this.pendulum.springs.length; i++) {
				this.pendulum.springs[i].damp = damp;
			}
		}
	));

	this.parameters.push(new Slider(
		"Spring constant", this.pendulum.springs[0].k, 1e4, 1e6, 'left', this, function(k) {
			this.steps = 0.0
			this.initPendulum();
			for (var i = 0; i < this.pendulum.springs.length; i++) {
				this.pendulum.springs[i].k = k;
			}
			this.setDt();
		}
	));

	this.parameters.push(new Button(
		'Push pendulum', 'left', this, function() {
			this.pendulum.particles[2].addForce(new Vec2(1500, 0));
			this.pendulum.particles[3].addForce(new Vec2(1500, 0));
		}
	));

	this.parameters.push(new Button(
		'Reset', 'left', this, function() {
			this.steps = 0.0
			this.initPendulum();
			this.setDt();
		}
	));
};

Simulation.prototype.setDt = function() {
 	var frequencies = [];
 	for (var i = 0; i < this.pendulum.springs.length; i++) {
 		frequencies.push(this.pendulum.springs[i].getFrequency());
 	}
 	frequencies.push(this.pendulum.dp.freq);

 	var maxFreq = Math.max(...frequencies);
 	console.log(maxFreq);
 	this.dt = (1 / 20) * 1 / maxFreq;
 	console.log('dt = ' + this.dt);
}

Simulation.prototype.step = function() {
	this.update();
    this.draw();
};

Simulation.prototype.update = function() {
	this.pendulum.update(this.dt, this.t)
	this.steps++;
	this.t = this.steps * this.dt;
};

Simulation.prototype.draw = function() {
	// Save the canvas
    this.ctx.save();

    // Clear canvas
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // Translate to the center of the canvas.
    this.ctx.translate(this.camera.x, this.camera.y);
    
    // Zoom in to see the pendulum.
    this.ctx.scale(this.zoom, this.zoom);
    
    // Mirror y-axis, so we have normal Cartesian coordinates.
    this.ctx.scale(1, -1);

    // Draw the world
    this.pendulum.draw(this.ctx);
    
    // Restore the canvas
    this.ctx.restore();

    this.ctx.font = "48px sans";
    this.ctx.fillText('t = ' + this.t.toFixed(2) + ' s', 10, 50);
};