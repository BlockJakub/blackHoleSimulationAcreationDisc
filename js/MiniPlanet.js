export class MiniPlanet {
    constructor(canvas, holePos) {
        this.x = holePos.x + (Math.random() - 0.5) * canvas.width * 0.8;
        this.y = holePos.y + (Math.random() - 0.5) * canvas.height * 0.8;
        this.radius = 12 + Math.random() * 18;
        this.color = `hsl(${Math.floor(Math.random() * 360)}, 60%, 60%)`;
        this.orbitObj = new OrbitObj(this);
    }
    update() {
        this.orbitObj.update();
    }
    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
        this.orbitObj.draw(ctx);
    }
}

class OrbitObj {
    constructor(miniPlanet) {
        this.miniPlanet = miniPlanet;
        this.angle = Math.random() * Math.PI * 2;
        this.orbitRadius = miniPlanet.radius + 10 + Math.random() * 10;
        this.size = 4 + Math.random() * 4;
        this.speed = 0.012 + Math.random() * 0.012;
        this.color = `hsl(${Math.floor(Math.random() * 360)}, 90%, 80%)`;
    }
    update() {
        this.angle += this.speed;
    }
    draw(ctx) {
        const x = this.miniPlanet.x + Math.cos(this.angle) * this.orbitRadius;
        const y = this.miniPlanet.y + Math.sin(this.angle) * this.orbitRadius;
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.restore();
    }
}
