const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 20,
    height: 20,
    color: 'blue',
    speed: 4,
    money: 1000,
    checkedIn: false,
    ticketType: null
};

// Airport Zones
const zones = [
    { x: 0, y: 0, width: 350, height: 250, color: '#D4EFDF', name: 'Check-in' },
    { x: 350, y: 0, width: 450, height: 250, color: '#D6EAF8', name: 'Security' },
    { x: 0, y: 250, width: 800, height: 200, color: '#FADBD8', name: 'Food Court' },
    { x: 0, y: 450, width: 800, height: 150, color: '#E5E7E9', name: 'Gates' }
];

const checkInCounters = [
    { x: 50, y: 80, width: 60, height: 40, color: 'green', name: 'Economy', cost: 0, interactionZone: { x: 40, y: 70, width: 80, height: 60 } },
    { x: 150, y: 80, width: 60, height: 40, color: 'orange', name: 'Business', cost: 200, interactionZone: { x: 140, y: 70, width: 80, height: 60 } },
    { x: 250, y: 80, width: 60, height: 40, color: 'purple', name: 'First Class', cost: 500, interactionZone: { x: 240, y: 70, width: 80, height: 60 } }
];

const ui = {
    showInteractionPrompt: false,
    interactionTarget: null
};

// Keyboard input
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    e: false,
    E: false
};

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function update() {
    if (keys.ArrowUp && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys.ArrowDown && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }
    if (keys.ArrowLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }

    // Interaction logic
    ui.showInteractionPrompt = false;
    ui.interactionTarget = null;
    for (const counter of checkInCounters) {
        if (checkCollision(player, counter.interactionZone)) {
            ui.showInteractionPrompt = true;
            ui.interactionTarget = counter;
            break;
        }
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw zones
    zones.forEach(zone => {
        ctx.fillStyle = zone.color;
        ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(zone.name, zone.x + zone.width / 2, zone.y + zone.height / 2);
    });

    // Draw check-in counters
    checkInCounters.forEach(counter => {
        ctx.fillStyle = counter.color;
        ctx.fillRect(counter.x, counter.y, counter.width, counter.height);
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(counter.name, counter.x + counter.width / 2, counter.y + counter.height / 2 + 5);
    });

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Display current zone
    let currentZone = 'Walking';
    zones.forEach(zone => {
        if (checkCollision(player, zone)) {
            currentZone = zone.name;
        }
    });
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Current area: ${currentZone}`, 10, 20);
    ctx.fillText(`Money: $${player.money}`, 10, 40);
    ctx.fillText(`Ticket: ${player.ticketType || 'None'}`, 10, 60);

    // Draw interaction prompt
    if (ui.showInteractionPrompt) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(canvas.width / 2 - 150, canvas.height - 60, 300, 40);
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Press 'E' to check in at ${ui.interactionTarget.name}`, canvas.width / 2, canvas.height - 35);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Event Listeners
window.addEventListener('keydown', (e) => {
    if (e.key in keys) {
        keys[e.key] = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});

// Start game loop
gameLoop();