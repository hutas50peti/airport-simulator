const sceneElement = document.getElementById('scene');

const scenes = {
    start: {
        title: "Welcome to Airport Simulator!",
        text: "Your journey begins now. Are you ready?",
        button: "Start Game",
        nextScene: "checkIn",
        image: "images/start.png" // Placeholder path
    },
    checkIn: {
        title: "Check-in",
        text: "You need to check in for your flight. Please proceed to the check-in counter.",
        button: "Check In",
        nextScene: "security",
        image: "images/checkin.png" // Placeholder path
    },
    security: {
        title: "Security Check",
        text: "Please put your belongings in the tray and walk through the scanner.",
        button: "Go through Security",
        nextScene: "boarding",
        image: "images/security.png" // Placeholder path
    },
    boarding: {
        title: "Boarding",
        text: "Your flight is now boarding. Please have your boarding pass ready.",
        button: "Board the Plane",
        nextScene: "takeoff",
        image: "images/boarding.png" // Placeholder path
    },
    takeoff: {
        title: "Takeoff!",
        text: "You are on the plane. Enjoy your flight!",
        button: "Play Again",
        nextScene: "start",
        image: "images/takeoff.png" // Placeholder path
    }
};

function loadScene(sceneName) {
    const scene = scenes[sceneName];
    sceneElement.innerHTML = `
        <div class="image-placeholder-container">
            <img src="${scene.image}" alt="${scene.title}" class="scene-image" onerror="this.parentElement.innerHTML='<div class=\'image-placeholder\'>[${scene.title} image]</div>'; this.remove();">
        </div>
        <h1>${scene.title}</h1>
        <p>${scene.text}</p>
        <button onclick="loadScene('${scene.nextScene}')">${scene.button}</button>
    `;
}

// Initial scene
loadScene('start');