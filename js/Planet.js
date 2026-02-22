export class Planet {
    constructor(orbiting = false, canvas, holePos) {
        this.radius = 32 + Math.random() * 40;
        this.color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 55%)`;
        this.moons = Array.from({ length: 3 }, (_, i) => new Moon(this, i));
        this.orbiting = orbiting;
        if (orbiting) {
            this.ellipseA = Math.max(canvas.width, canvas.height) * 0.36;
            this.ellipseB = Math.max(canvas.width, canvas.height) * 0.22;
            this.angle = Math.PI * (277 / 180);
            this.orbitSpeed = 0.0035;
        } else {
            const angle = Math.random() * 2 * Math.PI;
            const radius = (canvas.width * 0.35) * Math.sqrt(Math.random());
            this.x = holePos.x + radius * Math.cos(angle);
            this.y = holePos.y + radius * Math.sin(angle);
        }
    }
    update() {
        if (this.orbiting) {
            this.angle += this.orbitSpeed * (this.ellipseA / (this.ellipseA + this.ellipseB * Math.abs(Math.sin(this.angle))));
            this.x = holePos.x + Math.cos(this.angle) * this.ellipseA;
            this.y = holePos.y + Math.sin(this.angle) * this.ellipseB;
        }
        this.moons.forEach(m => m.update());
    }
    draw(ctx) {
        ctx.save();
        const grad = ctx.createRadialGradient(
            this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.1,
            this.x, this.y, this.radius
        );
        grad.addColorStop(0, '#fff');
        grad.addColorStop(0.25, this.color);
        grad.addColorStop(0.7, this.color);
        grad.addColorStop(1, '#222');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.shadowColor = '#222';
        ctx.shadowBlur = 24;
        ctx.fill();
        ctx.restore();
        this.moons.forEach(m => m.draw(ctx));
    }
}

class Moon {
    constructor(planet, idx) {
        this.planet = planet;
        this.idx = idx;
        this.angle = Math.random() * Math.PI * 2;
        this.orbitRadius = planet.radius + 18 + idx * 18 + Math.random() * 12;
        this.size = 7 + Math.random() * 7;
        this.speed = 0.008 + Math.random() * 0.008;
        this.color = `hsl(${Math.floor(Math.random() * 360)}, 80%, 70%)`;
    }
    update() {
        this.angle += this.speed;
    }
    draw(ctx) {
        const x = this.planet.x + Math.cos(this.angle) * this.orbitRadius;
        const y = this.planet.y + Math.sin(this.angle) * this.orbitRadius;
        ctx.save();
        const grad = ctx.createRadialGradient(
            x - this.size * 0.3, y - this.size * 0.3, this.size * 0.1,
            x, y, this.size
        );
        grad.addColorStop(0, '#fff');
        grad.addColorStop(0.25, this.color);
        grad.addColorStop(0.7, this.color);
        grad.addColorStop(1, '#222');
        ctx.beginPath();
        ctx.arc(x, y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.shadowColor = '#222';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
    }
}
