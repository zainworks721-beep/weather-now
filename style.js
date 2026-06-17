const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
const count = 110; // Aap dots kam ya zyada karne ke liye isko badal sakte hain

// Canvas ko screen ke size ka rakhna
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Particle ki property setting
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.2 + 0.2; // Dots ka size (0.5px se 3px tak - ekdum barik aur sundar)
        this.speedX = Math.random() * 0.5 - 0.25; // Bahut harki speed X axis par
        this.speedY = Math.random() * 0.5 - 0.25; // Bahut halki speed Y axis par
    }

    // Dot draw karne ke liye
    draw() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Pure white dots thodi transparency ke sath
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    // Dot ko dheere-dheere move karne ke liye
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Agar dot screen se bahar jaye toh doosri taraf se andar aa jaye
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }
}

// Dots create karna
function init() {
    particlesArray = [];
    for (let i = 0; i < count; i++) {
        particlesArray.push(new Particle());
    }
}

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    
    requestAnimationFrame(animate);
}

init();
animate();