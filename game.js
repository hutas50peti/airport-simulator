const sceneElement = document.getElementById('scene');

const scenes = {
    start: {
        title: "Welcome to Airport Simulator!",
        text: "Your journey begins now. Are you ready?",
        button: "Start Game",
        nextScene: "checkIn",
        image: "images/start.png"
    },
    checkIn: {
        title: "Check-in",
        text: "You need to check in for your flight. Please proceed to the check-in counter.",
        button: "Check In",
        nextScene: "security",
        image: "images/checkin.png"
    },
    security: {
        title: "Security Check",
        text: "Please put your belongings in the tray and walk through the scanner.",
        button: "Go through Security",
        nextScene: "foodCourt",
        image: "images/security.png"
    },
    foodCourt: {
        title: "Food Court",
        text: "You are in the food court. What would you like to do?",
        buttons: [
            { text: "Go to Burger King", nextScene: "burgerKing" },
            { text: "Go to KFC", nextScene: "kfc" },
            { text: "Go to the gate", nextScene: "boarding" }
        ],
        image: "images/foodcourt.png"
    },
    burgerKing: {
        title: "Burger King",
        text: "You had a delicious Whopper. Now it's time to go to the gate.",
        button: "Go to the gate",
        nextScene: "boarding",
        image: "images/burgerking.png"
    },
    kfc: {
        title: "KFC",
        text: "You enjoyed some crispy fried chicken. Now it's time to go to the gate.",
        button: "Go to the gate",
        nextScene: "boarding",
        image: "images/kfc.png"
    },
    boarding: {
        title: "Boarding",
        text: "Your flight is now boarding. Please have your boarding pass ready.",
        button: "Board the Plane",
        nextScene: "takeoff",
        image: "images/boarding.png"
    },
    takeoff: {
        title: "Takeoff!",
        text: "You are on the plane. Enjoy your flight!",
        button: "Play Again",
        nextScene: "start",
        image: "images/takeoff.png"
    }
};

function loadScene(sceneName) {
    const scene = scenes[sceneName];
    let buttonsHTML = '';
    if (scene.buttons) {
        buttonsHTML = scene.buttons.map(button =>
            `<button onclick="loadScene('${button.nextScene}')">${button.text}</button>`
        ).join(' ');
    } else {
        buttonsHTML = `<button onclick="loadScene('${scene.nextScene}')">${scene.button}</button>`;
    }

    sceneElement.innerHTML = `
        <div class="image-placeholder-container">
            <img src="${scene.image}" alt="${scene.title}" class="scene-image" onerror="this.parentElement.innerHTML='<div class=\'image-placeholder\'>[${scene.title} image]</div>'; this.remove();">
        </div>
        <h1>${scene.title}</h1>
        <p>${scene.text}</p>
        ${buttonsHTML}
    `;
}

// Initial scene
loadScene('start');