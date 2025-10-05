const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 20,
    height: 30, // Adjusted for character proportions
    speed: 4,
    money: 1000,
    checkedIn: false,
    ticketType: null,
    animFrame: 0
};

// Airport Zones
const zones = {
    checkIn: { x: 0, y: 0, width: 350, height: 250, color: '#D4EFDF', name: 'Check-in' },
    security: { x: 350, y: 0, width: 450, height: 250, color: '#D6EAF8', name: 'Security' },
    foodCourt: { x: 0, y: 250, width: 800, height: 200, color: '#FADBD8', name: 'Food Court' },
    gates: { x: 0, y: 450, width: 800, height: 150, color: '#E5E7E9', name: 'Gates' }
};

const checkInCounters = [
    { x: 50, y: 80, width: 60, height: 40, color: 'green', name: 'Economy', cost: 0, interactionZone: { x: 40, y: 70, width: 80, height: 60 } },
    { x: 150, y: 80, width: 60, height: 40, color: 'orange', name: 'Business', cost: 200, interactionZone: { x: 140, y: 70, width: 80, height: 60 } },
    { x: 250, y: 80, width: 60, height: 40, color: 'purple', name: 'First Class', cost: 500, interactionZone: { x: 240, y: 70, width: 80, height: 60 } }
];

const shops = [
    { x: 100, y: 320, width: 120, height: 60, color: '#E74C3C', name: 'Burger King', interactionZone: { x: 90, y: 310, width: 140, height: 80 }, products: [ { name: 'Whopper', cost: 15 }, { name: 'Fries', cost: 8 } ] },
    { x: 580, y: 320, width: 120, height: 60, color: '#A93226', name: 'KFC', interactionZone: { x: 570, y: 310, width: 140, height: 80 }, products: [ { name: 'Bucket', cost: 25 }, { name: 'Twister', cost: 12 } ] }
];

const ui = {
    showInteractionPrompt: false,
    interactionTarget: null,
    interactionType: null, // 'check-in' or 'shop'
    showCheckInMenu: false,
    showShopMenu: false,
    menuMessage: '',
    securityMessage: ''
};

const checkInButton = { x: canvas.width / 2 - 50, y: canvas.height / 2 + 20, width: 100, height: 40 };

// Sound assets
const sounds = {
    purchase: 'sounds/purchase.mp3',
    checkIn: 'sounds/checkin.mp3',
    error: 'sounds/error.mp3'
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
    if (!rect1 || !rect2) return false;
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function playSound(soundName) {
    const sound = new Audio(sounds[soundName]);
    sound.play();
}

function handleCheckIn() {
    const counter = ui.interactionTarget;
    if (player.checkedIn) {
        ui.menuMessage = 'You have already checked in!';
        playSound('error');
    } else if (player.money < counter.cost) {
        ui.menuMessage = 'Not enough money!';
        playSound('error');
    } else {
        player.money -= counter.cost;
        player.checkedIn = true;
        player.ticketType = counter.name;
        ui.menuMessage = `Successfully checked in for ${counter.name}!`;
        playSound('checkIn');
    }
    setTimeout(() => { ui.showCheckInMenu = false; ui.menuMessage = ''; }, 2000);
}

function handlePurchase(product) {
    if (player.money < product.cost) {
        ui.menuMessage = 'Not enough money!';
        playSound('error');
    } else {
        player.money -= product.cost;
        ui.menuMessage = `You bought a ${product.name}!`;
        playSound('purchase');
    }
    setTimeout(() => { ui.menuMessage = ''; }, 1500);
}

function update() {
    if (ui.showCheckInMenu || ui.showShopMenu) return; // Freeze player when menu is open

    const prevX = player.x;
    const prevY = player.y;

    const isMoving = keys.ArrowUp || keys.ArrowDown || keys.ArrowLeft || keys.ArrowRight;

    if (isMoving) {
        player.animFrame++;
    }

    if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
    if (keys.ArrowDown && player.y < canvas.height - player.height) player.y += player.speed;
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
    if (keys.ArrowRight && player.x < canvas.width - player.width) player.x += player.speed;

    // Security check
    if (checkCollision(player, zones.security) && !player.checkedIn) {
        player.x = prevX;
        player.y = prevY;
        ui.securityMessage = 'You must check in first!';
        setTimeout(() => { ui.securityMessage = ''; }, 2000);
    }

    // Interaction logic
    ui.showInteractionPrompt = false;
    ui.interactionTarget = null;
    ui.interactionType = null;
    for (const counter of checkInCounters) {
        if (checkCollision(player, counter.interactionZone)) {
            ui.showInteractionPrompt = true;
            ui.interactionTarget = counter;
            ui.interactionType = 'check-in';
            break;
        }
    }
    if (!ui.showInteractionPrompt) {
        for (const shop of shops) {
            if (checkCollision(player, shop.interactionZone)) {
                ui.showInteractionPrompt = true;
                ui.interactionTarget = shop;
                ui.interactionType = 'shop';
                break;
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw zones
    for (const key in zones) {
        const zone = zones[key];
        ctx.fillStyle = zone.color;
        ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(zone.name, zone.x + zone.width / 2, zone.y + zone.height / 2);
    }

    // Draw check-in counters and shops
    checkInCounters.forEach(counter => {
        ctx.fillStyle = counter.color;
        ctx.fillRect(counter.x, counter.y, counter.width, counter.height);
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(counter.name, counter.x + counter.width / 2, counter.y + counter.height / 2 + 5);
    });
    shops.forEach(shop => {
        ctx.fillStyle = shop.color;
        ctx.fillRect(shop.x, shop.y, shop.width, shop.height);
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(shop.name, shop.x + shop.width / 2, shop.y + shop.height / 2 + 5);
    });

    // Draw player
    const bob = Math.sin(player.animFrame / 6) * 2; // Calculate bobbing effect
    const drawY = player.y + bob;
    // Body
    ctx.fillStyle = 'blue'; // Shirt color
    ctx.fillRect(player.x, drawY + 10, player.width, player.height - 10);
    // Head
    ctx.fillStyle = '#FADBD8'; // Skin tone
    ctx.fillRect(player.x, drawY, player.width, 12);

    // Display UI text
    let currentZone = 'Walking';
    for (const key in zones) {
        const zone = zones[key];
        if (checkCollision(player, zone)) {
            currentZone = zone.name;
            break;
        }
    }
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Current area: ${currentZone}`, 10, 20);
    ctx.fillText(`Money: $${player.money}`, 10, 40);
    ctx.fillText(`Ticket: ${player.ticketType || 'None'}`, 10, 60);
    
    // Draw security message
    if (ui.securityMessage) {
        ctx.fillStyle = 'red';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(ui.securityMessage, canvas.width / 2, 20);
    }

    // Draw interaction prompt or menu
    if (ui.showCheckInMenu) {
        // Draw menu background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(canvas.width / 2 - 200, canvas.height / 2 - 100, 400, 200);

        // Draw menu text
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${ui.interactionTarget.name} Check-in`, canvas.width / 2, canvas.height / 2 - 60);
        ctx.font = '18px Arial';
        ctx.fillText(`Cost: $${ui.interactionTarget.cost}`, canvas.width / 2, canvas.height / 2 - 20);

        // Draw button
        ctx.fillStyle = 'green';
        ctx.fillRect(checkInButton.x, checkInButton.y, checkInButton.width, checkInButton.height);
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('Check-in', canvas.width / 2, canvas.height / 2 + 45);

        // Draw message
        if (ui.menuMessage) {
            ctx.fillStyle = 'yellow';
            ctx.font = '16px Arial';
            ctx.fillText(ui.menuMessage, canvas.width / 2, canvas.height / 2 + 80);
        }
    } else if (ui.showShopMenu) {
        const shop = ui.interactionTarget;
        // Draw menu background and text
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(canvas.width / 2 - 200, canvas.height / 2 - 100, 400, 200);
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(shop.name, canvas.width / 2, canvas.height / 2 - 60);

        // Draw products
        shop.products.forEach((product, index) => {
            const yPos = canvas.height / 2 - 20 + (index * 40);
            ctx.font = '18px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(`${product.name} - $${product.cost}`, canvas.width / 2 - 150, yPos);
            // Draw buy button
            const button = { x: canvas.width / 2 + 80, y: yPos - 20, width: 60, height: 30 };
            ctx.fillStyle = '#2ECC71';
            ctx.fillRect(button.x, button.y, button.width, button.height);
            ctx.fillStyle = 'white';
            ctx.fillText('Buy', button.x + 15, yPos);
        });

        if (ui.menuMessage) {
            ctx.fillStyle = 'yellow';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(ui.menuMessage, canvas.width / 2, canvas.height / 2 + 80);
        }

    } else if (ui.showInteractionPrompt) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(canvas.width / 2 - 150, canvas.height - 60, 300, 40);
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Press 'E' to interact with ${ui.interactionTarget.name}`, canvas.width / 2, canvas.height - 35);
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
        if ((e.key === 'e' || e.key === 'E') && ui.showInteractionPrompt) {
            if (ui.interactionType === 'check-in') {
                ui.showCheckInMenu = true;
            } else if (ui.interactionType === 'shop') {
                ui.showShopMenu = true;
            }
        }
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key in keys) {
        keys[e.key] = false;
    }
});

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    if (ui.showCheckInMenu) {
        if (checkCollision(mouse, checkInButton)) {
            handleCheckIn();
        }
    } else if (ui.showShopMenu) {
        const shop = ui.interactionTarget;
        shop.products.forEach((product, index) => {
            const yPos = canvas.height / 2 - 20 + (index * 40);
            const button = { x: canvas.width / 2 + 80, y: yPos - 20, width: 60, height: 30 };
            if (checkCollision(mouse, button)) {
                handlePurchase(product);
            }
        });
    }
});

// Start game loop
gameLoop();