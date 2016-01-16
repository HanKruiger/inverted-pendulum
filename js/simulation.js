function Simulation() {
	this.initCanvas();
	this.parameters = [];
	this.initPendulum();

	this.t = 0.0;
	this.dt = 0.001;

	var fps = 60;
    var me = this;
    /* Schedule the main loop to be called fps times per second, using the 
     * Simulation's this context. */
    setInterval(function() { me.mainLoop.call(me); }, 1000 / fps);
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
	    this.camera = new Vec2(0.5 * this.ctx.canvas.width, 0.5 * this.ctx.canvas.height);
	    this.zoom = 32;
	    this.rotation = Math.PI;
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
	var p3 = new Particle(-0.5 * lengthUpperLower, lengthSides, mass);
	var p4 = new Particle(0.5 * lengthUpperLower, lengthSides, mass);
	var p5 = new DrivenParticle(0, 0, 80, 0.1);

	var k = 100000;
	var damp = 0.01;
	var s1 = new Spring(p1, p2, k, lengthUpperLower, damp);
	var s2 = new Spring(p3, p4, k, lengthUpperLower, damp);
	var s3 = new Spring(p1, p3, k, lengthSides, damp);
	var s4 = new Spring(p2, p4, k, lengthSides, damp);

	restLengthMiddleDown = p1.position.dist(p5.position);
	restLengthMiddleUp = p3.position.dist(p5.position);

	var s5 = new Spring(p5, p1, k, restLengthMiddleDown, damp);
	var s6 = new Spring(p5, p2, k, restLengthMiddleDown, damp);
	var s7 = new Spring(p5, p3, k, restLengthMiddleUp, damp);
	var s8 = new Spring(p5, p4, k, restLengthMiddleUp, damp);

	this.parameters.push(new Slider(
		"Frequency", p5.getFreq(), 30, 500, 'left', p5, p5.setFreq
	));
	this.parameters.push(new Slider(
		"Amplitude", p5.getAmpl(), 0.0, 0.8, 'left', p5, p5.setAmpl
	));

	var particles = [p1, p2, p3, p4, p5];
	var springs = [s1, s2, s3, s4, s5, s6, s7, s8];
	var constraints = [];
	this.pendulum = new Pendulum(particles, springs, constraints);
};

Simulation.prototype.mainLoop = function() {
	this.update();
    this.draw();
};

Simulation.prototype.update = function() {
	this.pendulum.update(this.dt, this.t)
	this.t += this.dt;
};

Simulation.prototype.draw = function() {
	// Save the canvas
    this.ctx.save();

    // Clear canvas
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // Translate to the center of the canvas.
    this.ctx.translate(this.camera.x, this.camera.y);
    this.ctx.rotate(this.rotation);
    this.ctx.scale(this.zoom, this.zoom);

    // Draw the world
    this.pendulum.draw(this.ctx);
    
    // Restore the canvas
    this.ctx.restore();
};