const canvas = document.getElementById('vesmir');
const ctx = canvas.getContext('2d');

// Nastavení velikosti plátna na celé okno
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const cernaDira = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    sila: 0.5
};

class Castice {
    constructor() {
        this.reset();
    }

    reset() {
        // Vygeneruje částici náhodně na okraji
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.color = `hsl(${Math.random() * 60 + 180}, 100%, 70%)`; // Modré odstíny jako voda
    }

    aktualizuj() {
        let dx = cernaDira.x - this.x;
        let dy = cernaDira.y - this.y;
        let vzdalenost = Math.sqrt(dx * dx + dy * dy);

        // Gravitační zákon (tvá mechanika)
        // Čím blíž, tím větší tah
        if (vzdalenost > 10) {
            let tah = cernaDira.sila / vzdalenost;
            this.vx += dx * tah;
            this.vy += dy * tah;
        } else {
            // "Odtok" - když spadne do díry, zmizí a objeví se znovu (jako nový materiál)
            this.reset();
        }

        this.x += this.vx;
        this.y += this.vy;

        // Tření (aby to nelítalo nekonečně rychle - jako odpor vody)
        this.vx *= 0.98;
        this.vy *= 0.98;
    }

    vykresli() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Vytvoříme pole 200 částic (tvůj "materiál")
const castice = Array.from({ length: 200 }, () => new Castice());

function animuj() {
    // Černý poloprůhledný obdélník vytvoří efekt "šmouhy" (motion blur)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    castice.forEach(c => {
        c.aktualizuj();
        c.vykresli();
    });

    requestAnimationFrame(animuj); // Smyčka simulace
}

animuj();