function Spring(p1, p2, k, l, damp) {
    this.p1 = p1;
    this.p2 = p2;
    this.k = k;
    this.l = l;
	this.damp = damp;
}

Spring.prototype.update = function(dt, t) {

};

Spring.prototype.setDamp = function(damp) {
    this.damp = damp;
}

Spring.prototype.getDamp = function() {
    return this.damp;
}

Spring.prototype.draw = function(ctx) {
    ctx.lineWidth = 0.05;
    ctx.strokeStyle = "rgb(10, 10, 10)";
    ctx.beginPath();
    ctx.moveTo(this.p1.position.x, this.p1.position.y);
    ctx.lineTo(this.p2.position.x, this.p2.position.y);
    ctx.stroke();
};