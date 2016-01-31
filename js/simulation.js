function Simulation() {
	this.initCanvas();
	this.initParameters();
	this.initPendulum();
	this.setDt();

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
	var freq = this.parameters.freq.value();
	var ampl = this.parameters.ampl.value();
	var p1 = new Particle(-0.5 * lengthUpperLower, 0, mass);
	var p2 = new Particle(0.5 * lengthUpperLower, 0, mass);
	var p3 = new Particle(-0.5 * lengthUpperLower, lengthSides, mass);
	var p4 = new Particle(0.5 * lengthUpperLower, lengthSides, mass);
	var dp = new DrivenParticle(0, 0, freq, ampl, mass);

	var k = this.parameters.k.value();
	var damp = this.parameters.damp.value();
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
	this.parameters = {
		freq: new Slider(
			"Frequency", 80, 10, 500, 'left', this, function(freq) {
				this.initPendulum();
				this.pendulum.dp.freq = freq;
				this.steps = 0.0
				this.setDt();
			}
		),
		ampl: new Slider(
			"Amplitude", 0.1, 0.0, 0.8, 'left', this, function(ampl) {
				this.initPendulum();
				this.pendulum.dp.ampl = ampl;
				this.steps = 0.0
				this.setDt();
			}
		),
		damp: new Slider(
			"Dampening", 0.01, 0.0, 0.2, 'left', this, function(damp) {
				this.initPendulum();
				for (var i = 0; i < this.pendulum.springs.length; i++) {
					this.pendulum.springs[i].damp = damp;
				}
				this.steps = 0.0
				this.setDt();
			}
		),
		k: new Slider(
			"Spring constant", 1e5, 1e4, 1e6, 'left', this, function(k) {
				this.initPendulum();
				for (var i = 0; i < this.pendulum.springs.length; i++) {
					this.pendulum.springs[i].k = k;
				}
				this.steps = 0.0
				this.setDt();
			}
		),
		push: new Button(
			'Push pendulum', 'left', this, function() {
				this.pendulum.particles[2].addForce(new Vec2(1500, 0));
				this.pendulum.particles[3].addForce(new Vec2(1500, 0));
			}
		),
		reset: new Button(
			'Reset', 'left', this, function() {
				this.steps = 0.0
				this.initPendulum();
				this.setDt();
			}
		)
	};
};

Simulation.prototype.setDt = function() {
 	var frequencies = [];
 	for (var i = 0; i < this.pendulum.springs.length; i++) {
 		frequencies.push(this.pendulum.springs[i].getFrequency());
 	}
 	frequencies.push(this.pendulum.dp.freq);

 	var maxFreq = Math.max(...frequencies);
 	this.dt = (1 / 20) * 1 / maxFreq;
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

    this.ctx.font = "48px mono";
    this.ctx.fillText('t  = ' + this.t.toFixed(2) + ' s', 10, 50);
    this.ctx.fillText('dt = ' + this.dt.toExponential(2) + ' s', 10, 100);
};