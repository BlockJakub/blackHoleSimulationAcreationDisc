export class Particle {
    constructor(canvas) {
        this.reset(canvas);
    }
    reset(canvas) {
        this.angle = Math.random() * Math.PI * 2;
        const minR = 70;
        const maxR = Math.max(canvas.width, canvas.height) * 0.48;
        this.dist = minR + (maxR - minR) * Math.sqrt(Math.random());
        let materialAmount = Math.random();
        this.height = (Math.random() - 0.5) * Math.max(canvas.height, canvas.width) * (0.12 + materialAmount * 0.18);
        this.fallSpeed = 0.12 + Math.random() * 0.18 + materialAmount * 0.18;
        this.falling = false;
        const colorVariants = [
            [120, 255, 255], [255, 220, 120], [255, 120, 200], [180, 255, 180],
            [255, 255, 255], [220, 220, 220], [200, 200, 180], [255, 245, 210]
        ];
        this.colorIdx = Math.floor(Math.random() * colorVariants.length);
        this.color = colorVariants[this.colorIdx];
        this.size = Math.random() * 2.5 + 0.3 + materialAmount * 2.2;
        this.speed = (0.006 + Math.random() * 0.01 + materialAmount * 0.008);
        this.opacity = 0.45 + Math.random() * 0.7;
    }
    update(canvas) {
        this.angle += this.speed * (160 / this.dist);
        this.dist -= 0.15;
        const minR = Math.max(canvas.width, canvas.height) * 0.45;
        const maxR = Math.max(canvas.width, canvas.height) * 0.5;
        if (this.dist < minR * 0.4) { this.reset(canvas); this.dist = maxR; }
        if (!this.falling) {
            this.angle += this.speed * (160 / this.dist);
            this.dist -= 0.10 + 0.08 * (1 - this.dist / (Math.max(canvas.width, canvas.height) * 0.5));
            if (this.dist < Math.max(canvas.width, canvas.height) * 0.18 && Math.random() < 0.04) {
                this.falling = true;
                this.fallTrail = 12 + Math.random() * 10;
                this.spaghettify = 1;
            }
        } else {
            this.dist -= this.fallSpeed * 2.1;
            this.height *= 0.91;
            this.size *= 1.04;
            this.opacity = Math.min(1, this.opacity * 1.09);
            this.fallTrail--;
            this.spaghettify *= 1.18;
        }
        if (this.dist < Math.max(canvas.width, canvas.height) * 0.06) {
            this.opacity *= 0.82;
            if (!this._resetTimeout) {
                // Spark effect placeholder
                this._resetTimeout = setTimeout(() => {
                    this._resetTimeout = null;
                    this.reset(canvas);
                }, 200 + Math.random() * 800);
            }
        }
    }
    draw(ctx, holePos, viewOffset, front = false) {
        const isBehind = Math.sin(this.angle) < 0;
        if (isBehind === !front) {
            let cos = Math.cos(this.angle);
            let x = holePos.x + cos * this.dist + viewOffset.x;
            let y = holePos.y + Math.sin(this.angle) * this.dist * 0.22 + this.height + viewOffset.y;
            const [r, g, b] = this.color;
            if (this.falling && this.fallTrail > 0) {
                for (let t = 0; t < 12; t++) {
                    let trailDist = this.dist + t * 13 * this.spaghettify;
                    let trailAlpha = Math.max(0, this.opacity * (0.16 - t * 0.012));
                    ctx.save();
                    ctx.translate(holePos.x + cos * trailDist + viewOffset.x, y);
                    ctx.rotate(this.angle);
                    ctx.beginPath();
                    ctx.ellipse(0, 0, this.size * (1.1 - t * 0.08) * this.spaghettify, this.size * 0.5, 0, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255,255,200,${trailAlpha})`;
                    ctx.shadowColor = '#fffbe0';
                    ctx.shadowBlur = 8;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    ctx.restore();
                }
                ctx.save();
                ctx.translate(x, y);
                ctx.rotate(this.angle);
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size * 1.5 * this.spaghettify, this.size * 0.7, 0, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,220,${Math.min(1, this.opacity * 1.2)})`;
                ctx.shadowColor = '#fffbe0';
                ctx.shadowBlur = 18;
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.restore();
            } else {
                ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, this.opacity * 1.5)})`;
                ctx.beginPath();
                ctx.arc(x, y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}
