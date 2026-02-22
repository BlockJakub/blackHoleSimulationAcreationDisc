export class CosmicBody {
    constructor(canvas) { this.reset(canvas); }
    reset(canvas) {
        this.type = Math.floor(Math.random() * 4);
        this.angle = Math.random() * Math.PI * 2;
        this.dist = 600 + Math.random() * 900;
        this.speed = (0.0005 + Math.random() * 0.0015);
        this.size = this.type === 0 ? Math.random() * 3 + 1.5 : (this.type === 1 ? Math.random() * 1.2 + 0.3 : Math.random() * 2 + 0.7);
        this.pitch = (Math.random() - 0.5) * Math.PI * 0.8;
        if (this.type === 0) this.color = "#bbb";
        else if (this.type === 1) this.color = "#ffeedd";
        else if (this.type === 2) this.color = "#bdf";
        else this.color = "#aef6ff";
        this.opacity = this.type === 1 ? 0.18 + Math.random() * 0.18 : (this.type === 3 ? 0.13 + Math.random() * 0.13 : 1);
        this.fallSpeed = 0.04 + Math.random() * 0.07;
        this.falling = false;
    }
    update(canvas, holePos, viewOffset, createSpark) {
        if (!this.falling) {
            this.angle += this.speed * (600 / this.dist);
            this.dist -= 0.04 + 0.09 * (1 - this.dist / 900);
            if (this.dist < 180 && Math.random() < 0.01) this.falling = true;
        } else {
            this.dist -= this.fallSpeed;
            this.size *= 0.98;
        }
        if (this.dist < 60) {
            createSpark(
                holePos.x + Math.cos(this.angle) * this.dist,
                holePos.y + Math.sin(this.angle) * this.dist * Math.sin(this.pitch)
            );
            this.reset(canvas);
        }
    }
    draw(ctx, holePos, viewOffset) {
        let x = holePos.x + Math.cos(this.angle) * this.dist + viewOffset.x;
        let y = holePos.y + Math.sin(this.angle) * this.dist * Math.sin(this.pitch) + viewOffset.y;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
    }
}
