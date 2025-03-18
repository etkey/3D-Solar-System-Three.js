import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { getFresnelMat } from "./assets/shaders/getFresnelMat.js";

const canvas = document.querySelector("canvas");

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
renderer.domElement.style.top = "0px";

const fresnelMat = getFresnelMat();
const loader = new THREE.TextureLoader();
document.body.appendChild(renderer.domElement);

const sunCard = document.querySelector("#sun-card");
const moonCard = document.querySelector("#moon-card");
const mercuryCard = document.querySelector("#mercury-card");
const venusCard = document.querySelector("#venus-card");
const earthCard = document.querySelector("#earth-card");
const marsCard = document.querySelector("#mars-card");
const jupiterCard = document.querySelector("#jupiter-card");
const saturnCard = document.querySelector("#saturn-card");
const uranusCard = document.querySelector("#uranus-card");
const neptuneCard = document.querySelector("#neptune-card");

const cardPositions = {
    mercury: new THREE.Vector3(),
    venus: new THREE.Vector3(),
    earth: new THREE.Vector3(),
    mars: new THREE.Vector3(),
    jupiter: new THREE.Vector3(),
    saturn: new THREE.Vector3(),
    uranus: new THREE.Vector3(),
    neptune: new THREE.Vector3()
};

let followingPlanet = null;

let animationsEnabled = true;

const planetInfo = {
    mercury: {
        name: "Mercury",
        image: "assets/mercury/8k_mercury.jpg",
        diameter: "4,879 km",
        distanceFromSun: "57.9 million km",
        orbitalPeriod: "88 Earth days",
        temperature: "-180°C to 430°C",
        description: "Mercury is the smallest planet in our solar system and the closest to the Sun."
    },
    venus: {
        name: "Venus",
        image: "assets/venus/8k_venus_surface.jpg",
        diameter: "12,104 km",
        distanceFromSun: "108.2 million km",
        orbitalPeriod: "225 Earth days",
        temperature: "462°C",
        description: "Venus is often called Earth's sister planet due to their similar size, it is the hottest planet in our solar system."
    },
    earth: {
        name: "Earth",
        image: "assets/earth-assets/8k_earth_daymap.jpg",
        diameter: "12,742 km",
        distanceFromSun: "149.6 million km",
        orbitalPeriod: "365.25 days",
        temperature: "-88°C to 58°C",
        description: "Our home planet is the only known planet to harbor life."
    },
    mars: {
        name: "Mars",
        image: "assets/mars/8k_mars.jpg",
        diameter: "6,779 km",
        distanceFromSun: "227.9 million km",
        orbitalPeriod: "687 Earth days",
        temperature: "-140°C to 20°C",
        description: "Mars is called the Red Planet due to its reddish appearance."
    },
    jupiter: {
        name: "Jupiter",
        image: "assets/jupiter/8k_jupiter.jpg",
        diameter: "139,820 km",
        distanceFromSun: "778.5 million km",
        orbitalPeriod: "11.86 Earth years",
        temperature: "-110°C",
        description: "Jupiter is the largest planet in our solar system."
    },
    saturn: {
        name: "Saturn",
        image: "assets/saturn/8k_saturn.jpg",
        diameter: "116,460 km",
        distanceFromSun: "1.434 billion km",
        orbitalPeriod: "29.45 Earth years",
        temperature: "-140°C",
        description: "Saturn is known for its spectacular ring system."
    },
    uranus: {
        name: "Uranus",
        image: "assets/uranus/2k_uranus.jpg",
        diameter: "50,724 km",
        distanceFromSun: "2.871 billion km",
        orbitalPeriod: "84 Earth years",
        temperature: "-195°C",
        description: "Uranus is the coldest of the planets and rotates on its side."
    },
    neptune: {
        name: "Neptune",
        image: "assets/neptune/2k_neptune.jpg",
        diameter: "49,244 km",
        distanceFromSun: "4.495 billion km",
        orbitalPeriod: "164.81 Earth years",
        temperature: "-200°C",
        description: "Neptune is the windiest planet, with speeds reaching 2,100 km/h."
    },
    sun: {
        name: "Sun",
        image: "assets/sun/8k_sun.jpg",
        diameter: "1,392,700 km",
        distanceFromSun: "0 km",
        orbitalPeriod: "N/A",
        temperature: "5,500°C (surface)",
        description: "The Sun is the star at the center of our Solar System, providing light and energy."
    },
    moon: {
        name: "Moon",
        image: "assets/moon/8k_moon.jpg",
        diameter: "3,475 km",
        distanceFromSun: "384,400 km (from Earth)",
        orbitalPeriod: "27.3 Earth days",
        temperature: "-233°C to 123°C",
        description: "Earth's only natural satellite, the Moon is the fifth largest satellite in the Solar System."
    }
};

const planetFacts = {
    mercury: [
        "A year on Mercury lasts just 88 Earth days.",
        "One solar day on Mercury spans 176 Earth days.",
        "Mercury is the smallest planet in the Solar System.",
        "Mercury is the second densest planet.",
        "Mercury's surface has wrinkles.",
        "Mercury has a molten core.",
        "Mercury is not the hottest planet.",
        "Mercury is the most cratered planet in the Solar System.",
        "Only two spacecraft have visited Mercury.",
        "Mercury is named after the Roman messenger god."
    ],
    venus: [
        "A day on Venus is longer than a year.",
        "Venus rotates in the opposite direction of most planets.",
        "Venus is the second brightest object in the night sky.",
        "Venus has an atmospheric pressure 92 times greater than Earth's.",
        "Venus is often called Earth's sister planet.",
        "The same side of Venus always faces Earth when they are at their closest.",
        "Venus is also known as the Morning Star and the Evening Star.",
        "Venus is the hottest planet in the Solar System.",
        "A detailed study of Venus concluded in 2015.",
        "The Soviet Union sent the first mission to Venus."
    ],
    earth: [
        "The Earth's rotation is gradually slowing.",
        "Earth was once thought to be the center of the universe.",
        "Earth has a powerful magnetic field.",
        "Earth has only one natural satellite.",
        "Earth is the only planet not named after a god.",
        "Earth is the densest planet in the Solar System."
    ],
    mars: [
        "Mars and Earth have nearly the same land area.",
        "Mars has the tallest mountain in the solar system.",
        "Only 18 missions to Mars have succeeded.",
        "Mars experiences the largest dust storms in the solar system.",
        "On Mars, the Sun appears about half the size it does on Earth.",
        "Fragments of Mars have landed on Earth.",
        "Mars is named after the Roman god of war.",
        "There are indications of liquid water on Mars.",
        "Mars will eventually have a ring.",
        "Mars has blue sunsets."
    ],
    jupiter: [
        "Jupiter is the fourth brightest object in the solar system.",
        "The ancient Babylonians were the first to document Jupiter.",
        "Jupiter has the shortest day of any planet.",
        "Jupiter takes 11.8 Earth years to orbit the Sun.",
        "Jupiter's atmosphere has distinct cloud formations.",
        "The Great Red Spot is a massive storm.",
        "Jupiter's interior consists of rock, metal, and hydrogen compounds.",
        "Ganymede, Jupiter's largest moon, is the biggest in the solar system.",
        "Jupiter has a faint ring system.",
        "Eight spacecraft have visited Jupiter."
    ],
    saturn: [
        "Saturn is the most distant planet visible to the naked eye.",
        "Ancient civilizations knew of Saturn.",
        "Saturn is the flattest planet.",
        "Saturn takes 29.4 Earth years to complete one orbit around the Sun.",
        "Saturn's atmosphere is divided into bands of clouds.",
        "Saturn has storm systems similar to Jupiter's.",
        "Saturn is primarily composed of hydrogen.",
        "Saturn has the most extensive ring system in the solar system.",
        "Saturn has 150 moons and smaller moonlets.",
        "Titan is a unique moon with a dense, nitrogen-rich atmosphere."
    ],
    uranus: [
        "Uranus was officially discovered by Sir William Herschel in 1781.",
        "Uranus rotates once every 17 hours and 14 minutes.",
        "Uranus completes one orbit around the Sun every 84 Earth years.",
        "Uranus is classified as an 'ice giant'.",
        "Uranus experiences the coldest temperatures of any planet.",
        "Uranus has two sets of thin, dark-colored rings.",
        "Uranus' moons are named after literary characters.",
        "Only one spacecraft has visited Uranus."
    ],
    neptune: [
        "Neptune was not known to the ancients.",
        "Neptune rotates rapidly on its axis.",
        "Neptune is the smallest of the ice giants.",
        "Neptune's atmosphere is primarily hydrogen and helium.",
        "Neptune has a highly active climate.",
        "Neptune has a faint ring system.",
        "Neptune has 14 known moons.",
        "Only one spacecraft has visited Neptune."
    ],
    moon: [
        "The dark side of the moon is a myth. Both sides receive equal sunlight, but we only see one face from Earth due to its synchronized rotation.",
        "The Moon causes Earth's tides through gravitational pull, creating two bulges in Earth's oceans.",
        "The Moon is drifting away from Earth by approximately 3.8 cm each year.",
        "A person would weigh about one sixth (16.5%) of their Earth weight on the Moon due to weaker gravity.",
        "Only 12 people, all American men, have walked on the Moon, starting with Neil Armstrong in 1969.",
        "The Moon has no atmosphere, resulting in extreme temperature variations and no sound transmission.",
        "The Moon experiences quakes caused by Earth's gravitational pull.",
        "Luna 1, launched by the USSR in 1959, was the first spacecraft to reach the Moon.",
        "The Moon is the fifth largest natural satellite in the Solar System, with a diameter of 3,475 km.",
        "During the 1950s, the USA considered detonating a nuclear bomb on the Moon as part of Project A119."
    ],
    sun: [
        "One million Earths could fit inside the Sun. A hollow Sun would fit around 960,000 spherical Earths.",
        "The Sun contains 99.86% of the mass in the Solar System, about 330,000 times greater than Earth's mass.",
        "The Sun is an almost perfect sphere, with only a 10-kilometre difference between polar and equatorial diameters.",
        "The Sun will eventually consume the Earth when it becomes a red giant.",
        "After its red giant phase, the Sun will collapse to about Earth's size as a white dwarf.",
        "The temperature inside the Sun can reach 15 million degrees Celsius, while surface temperature is about 5,600°C.",
        "Light from the Sun takes eight minutes and 20 seconds to reach Earth.",
        "The Sun travels at 220 kilometres per second around the galactic centre.",
        "The distance between the Sun and Earth varies from 147 to 152 million kilometres throughout the year.",
        "At 4.6 billion years old, the Sun is middle-aged and is currently a Yellow Dwarf star.",
        "The Sun has a very strong magnetic field that causes solar flares and sunspots.",
        "The Sun generates solar wind, a stream of charged particles traveling at 450 km/s.",
        "'Sol' is the Latin word for Sun, which is where the word 'solar' comes from."
    ]
};

function createPlanetCard(planetId) {
    const info = planetInfo[planetId];
    if (!info) {
        console.error(`No information found for planet: ${planetId}`);
        return '';
    }
    
    return `
        <div class="card-header">
            <img src="${info.image}" alt="${info.name}" class="planet-image">
            <h3 class="planet-name">${info.name}</h3>
        </div>
        <div class="card-content">
            <p>Diameter: ${info.diameter}</p>
            <p>Distance from Sun: ${info.distanceFromSun}</p>
            <p>Orbital Period: ${info.orbitalPeriod}</p>
            <p>Temperature: ${info.temperature}</p>
            <p>${info.description}</p>
            <div class="facts-container">
                <p class="fact-text">${planetFacts[planetId] ? planetFacts[planetId][0] : ''}</p>
                <div class="fact-navigation">
                    <button class="prev-fact" disabled>←</button>
                    <span class="fact-counter">1/${planetFacts[planetId] ? planetFacts[planetId].length : '0'}</span>
                    <button class="next-fact">→</button>
                </div>
            </div>
        </div>
    `;
}

document.querySelectorAll('.planet-card').forEach(card => {
    const planetId = card.id.split('-')[0];
    if (planetId) {
        card.innerHTML = createPlanetCard(planetId);
        
        let currentFactIndex = 0;
        const facts = planetFacts[planetId] || [];
        
        const prevButton = card.querySelector('.prev-fact');
        const nextButton = card.querySelector('.next-fact');
        const factText = card.querySelector('.fact-text');
        const factCounter = card.querySelector('.fact-counter');
        
        if (prevButton && nextButton && factText && factCounter) {
            prevButton.addEventListener('click', (e) => {
                e.stopPropagation();
                currentFactIndex = Math.max(0, currentFactIndex - 1);
                updateFactDisplay();
            });
            
            nextButton.addEventListener('click', (e) => {
                e.stopPropagation();
                currentFactIndex = Math.min(facts.length - 1, currentFactIndex + 1);
                updateFactDisplay();
            });
            
            function updateFactDisplay() {
                factText.textContent = facts[currentFactIndex];
                factCounter.textContent = `${currentFactIndex + 1}/${facts.length}`;
                prevButton.disabled = currentFactIndex === 0;
                nextButton.disabled = currentFactIndex === facts.length - 1;
            }
        }
        
        card.addEventListener('click', (event) => {
            event.stopPropagation();
            
            document.querySelectorAll('.planet-card').forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('expanded');
                    if (card.classList.contains('expanded')) {
                        otherCard.style.opacity = '1';
                        otherCard.style.visibility = 'visible';
                    } else {
                        otherCard.style.opacity = '0';
                        otherCard.style.visibility = 'hidden';
                    }
                }
            });

            card.classList.toggle('expanded');
            
            const planetId = card.id.split("-")[0];
            
            if (followingPlanet === planetId) {
                followingPlanet = null;
                controls.enabled = true;
                controls.target.set(0, 0, 0);
                camera.position.set(15, 20, 50);
                animationsEnabled = true;
                document.querySelectorAll('.planet-card').forEach(card => {
                    card.style.opacity = '1';
                    card.style.visibility = 'visible';
                });
            } else {
                followingPlanet = planetId;
                animationsEnabled = false;
                
                let targetMesh, pivotObject;
                switch(planetId) {
                    case 'mercury': 
                        targetMesh = mercury.children[0];
                        pivotObject = mercuryPivot;
                        break;
                    case 'venus': 
                        targetMesh = venus.children[0];
                        pivotObject = venusPivot;
                        break;
                    case 'earth': 
                        targetMesh = earthMesh;
                        pivotObject = earthPivot;
                        break;
                    case 'mars': 
                        targetMesh = mars.children[0];
                        pivotObject = marsPivot;
                        break;
                    case 'jupiter': 
                        targetMesh = jupiter.children[0];
                        pivotObject = jupiterPivot;
                        break;
                    case 'saturn': 
                        targetMesh = saturn.children[0];
                        pivotObject = saturnPivot;
                        break;
                    case 'uranus': 
                        targetMesh = uranus.children[0];
                        pivotObject = uranusPivot;
                        break;
                    case 'neptune': 
                        targetMesh = neptune.children[0];
                        pivotObject = neptunePivot;
                        break;
                    case 'sun':
                        targetMesh = sunMesh;
                        pivotObject = sunGroup;
                        break;
                    case 'moon':
                        targetMesh = moonMesh;
                        pivotObject = moonPivot;
                        break;
                }
                
                if (targetMesh) {
                    const targetPosition = new THREE.Vector3();
                    targetMesh.getWorldPosition(targetPosition);
                    
                    const radius = targetMesh.geometry.parameters.radius || 1;
                    const cameraDistance = radius * 5;
                    
                    const cameraOffset = new THREE.Vector3(0, radius * 2, cameraDistance);
                    camera.position.copy(targetPosition).add(cameraOffset);
                    
                    controls.target.copy(targetPosition);
                    controls.enabled = true;
                }
            }
        });
    }
});

const style = document.createElement('style');
style.textContent = `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    canvas {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .planet-card {
        position: absolute;
        pointer-events: auto;
        z-index: 1000;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        overflow: hidden;
        opacity: 1;
        visibility: visible;
        transition: opacity 0.3s ease, visibility 0.3s ease, width 0.3s ease;
    }

    .planet-card .card-header {
        display: flex;
        align-items: center;
        padding: 10px;
        gap: 10px;
    }

    .planet-card .planet-image {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        object-fit: cover;
    }

    .planet-card .planet-name {
        margin: 0;
        font-size: 1.2em;
        color: white;
    }

    .planet-card .card-content {
        display: none;
        padding: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .planet-card.expanded {
        width: 300px;
    }

    .planet-card.expanded .card-content {
        display: block;
    }

    .planet-card:hover {
        background: rgba(0, 0, 0, 0.9);
    }

    .loading-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background:#101012;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        transition: opacity 1s ease-in-out;
    }

    .loading-content {
        text-align: center;
        color: white;
    }

    .loading-spinner {
        width: 300px;
        height: 300px;
        background: url('assets/loading-screen/solarsystem.gif') no-repeat center center;
        background-size: contain;
        margin-bottom: 20px;
    }

    .loading-text {
        font-size: 24px;
        margin-top: 20px;
        font-family: Arial, sans-serif;
    }

    .loading-progress {
        width: 300px;
        height: 4px;
        background: #333;
        margin-top: 20px;
        border-radius: 2px;
        overflow: hidden;
    }

    .loading-progress-bar {
        width: 0%;
        height: 100%;
        background: #fff;
        transition: width 0.3s ease;
    }

    .facts-container {
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .fact-text {
        margin: 10px 0;
        font-style: italic;
        color: #ddd;
    }

    .fact-navigation {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-top: 10px;
    }

    .fact-navigation button {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.3s;
    }

    .fact-navigation button:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.2);
    }

    .fact-navigation button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .fact-counter {
        color: #999;
        font-size: 0.9em;
    }
`;
document.head.appendChild(style);

const loadingScreen = document.createElement('div');
loadingScreen.className = 'loading-screen';
loadingScreen.innerHTML = `
    <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-progress">
            <div class="loading-progress-bar"></div>
        </div>
    </div>
`;
document.body.appendChild(loadingScreen);

let totalAssets = 0;
let loadedAssets = 0;

const loadTexture = (url) => {
    totalAssets++;
    return new Promise((resolve) => {
        loader.load(url, (texture) => {
            loadedAssets++;
            updateLoadingProgress();
            resolve(texture);
        });
    });
};

const updateLoadingProgress = () => {
    const progress = (loadedAssets / totalAssets) * 100;
    const progressBar = document.querySelector('.loading-progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }
    
    if (loadedAssets === totalAssets) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
            }, 1000);
        }, 500);
    }
};

async function initApp() {
    const loadingGif = new Image();
    loadingGif.src = 'assets/loading-screen/solarsystem.gif';
    
    await new Promise((resolve) => {
        loadingGif.onload = () => {
            const spinner = document.querySelector('.loading-spinner');
            if (spinner) {
                spinner.style.backgroundImage = `url('${loadingGif.src}')`;
            }
            resolve();
        };
    });

    const textures = await Promise.all([
        loadTexture("assets/ESO_-_Milky_Way1.jpg"),
        loadTexture("assets/earth-assets/8k_earth_daymap.jpg"),
        loadTexture("assets/earth-assets/8k_earth_clouds.jpg"),
        loadTexture("assets/earth-assets/8k_earth_nightmap.jpg"),
        loadTexture("assets/earth-assets/8k_earth_specular_map.png"),
        loadTexture("assets/moon/8k_moon.jpg"),
        loadTexture("assets/mercury/8k_mercury.jpg"),
        loadTexture("assets/venus/8k_venus_surface.jpg"),
        loadTexture("assets/venus/4k_venus_atmosphere.jpg"),
        loadTexture("assets/mars/8k_mars.jpg"),
        loadTexture("assets/jupiter/8k_jupiter.jpg"),
        loadTexture("assets/saturn/8k_saturn.jpg"),
        loadTexture("assets/saturn/saturn_ring.png"),
        loadTexture("assets/uranus/2k_uranus.jpg"),
        loadTexture("assets/neptune/2k_neptune.jpg"),
        loadTexture("assets/sun/8k_sun.jpg")
    ]);
}

initApp();

function createPlanet({
    name,
    size,
    textureUrl,
    position = [0, 0, 0],
    atmosphereTextureUrl = null,
    atmosphereScale = 1.005,
    materialOptions = {},
    rings = false
}) {
    const planetGroup = new THREE.Group();
    planetGroup.name = name;

    const geometry = new THREE.IcosahedronGeometry(size, 15);
    const material = new THREE.MeshStandardMaterial({
        map: loader.load(textureUrl),
        ...materialOptions,
    });
    const planetMesh = new THREE.Mesh(geometry, material);
    planetGroup.add(planetMesh);

    if (atmosphereTextureUrl) {
        const atmosphereMaterial = new THREE.MeshStandardMaterial({
            map: loader.load(atmosphereTextureUrl),
        });
        const atmosphereMesh = new THREE.Mesh(geometry, atmosphereMaterial);
        atmosphereMesh.scale.setScalar(atmosphereScale);
        planetGroup.add(atmosphereMesh);
    }

    if (rings && name === "Saturn") {
        const ringGeometry = new THREE.RingGeometry(size * 1.2, size * 2.2, 64);
        const ringMaterial = new THREE.MeshPhongMaterial({
            map: loader.load("assets/saturn/saturn_ring.png"),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.9,
            color: 0xffffff,
            emissive: 0xffffff,
            emissiveIntensity: 0.1,
            shininess: 50
        });
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
        ringMesh.rotation.x = Math.PI / 2;
        ringMesh.rotation.z = -0.2;

        planetGroup.add(ringMesh);
    }

    planetGroup.position.set(...position);

    return planetGroup;
}

const earthOrbitSpeed = 0.0025;
const moonOrbitSpeed = earthOrbitSpeed * 13.37;
const earthRotationSpeed = 0.002;

const orbitalSpeedMultipliers = {
    mercury: 1.6,
    venus: 1.17,
    earth: 1.0,
    mars: 0.81,
    jupiter: 0.45,
    saturn: 0.336,
    uranus: 0.236,
    neptune: 0.19,
};

const rotationSpeedMultipliers = {
    mercury: 0.017, // 58.6 gün
    venus: -0.004, // -243 gün (eksi işareti ters yönde döndüğünü gösterir)
    earth: 1.0, // 24 saat
    mars: 0.973, // 24.6 saat
    jupiter: 2.4, // 10 saat
    saturn: 2.3, // 10.7 saat
    uranus: -1.4, // -17.2 saat (ters yönde)
    neptune: 1.5, // 16 saat
    sun: 0.037 // 27 gün
};

const scene = new THREE.Scene();

loader.load("assets/ESO_-_Milky_Way1.jpg", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
});

const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 10000);
camera.position.set(15, 20, 50);
camera.lookAt(15, 0, 0);

const earthGroup = new THREE.Group();
earthGroup.rotation.z = (-23.4 * Math.PI) / 180;
earthGroup.position.set(117.4, 0, 0);

const earthPivot = new THREE.Object3D();
earthPivot.add(earthGroup);
scene.add(earthPivot);

const moonGeo = new THREE.IcosahedronGeometry(0.273, 15);
const moonMat = new THREE.MeshBasicMaterial({
    map: loader.load("assets/moon/8k_moon.jpg"),
});
const moonMesh = new THREE.Mesh(moonGeo, moonMat);

const moonPivot = new THREE.Object3D();
earthGroup.add(moonPivot);
moonPivot.add(moonMesh);
moonMesh.position.set(3, 3, 0);

const earthGeo = new THREE.IcosahedronGeometry(1.0, 12);

const mat = new THREE.MeshStandardMaterial({
    map: loader.load("assets/earth-assets/8k_earth_daymap.jpg"),
});

const cloudMat = new THREE.MeshStandardMaterial({
    map: loader.load("assets/earth-assets/8k_earth_clouds.jpg"),
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
});

const glowMesh = new THREE.Mesh(earthGeo, fresnelMat);

const earthNightMat = new THREE.MeshBasicMaterial({
    map: loader.load("assets/earth-assets/8k_earth_nightmap.jpg"),
    blending: THREE.AdditiveBlending,
});

const earthSpecularMat = new THREE.MeshBasicMaterial({
    map: loader.load("assets/earth-assets/8k_earth_specular_map.png"),
    transparent: true,
    blending: THREE.AdditiveBlending,
});

const earthMesh = new THREE.Mesh(earthGeo, mat);
const earthCloudMesh = new THREE.Mesh(earthGeo, cloudMat);
const earthNightMesh = new THREE.Mesh(earthGeo, earthNightMat);
const earthSpecularMesh = new THREE.Mesh(earthGeo, earthSpecularMat);

earthGroup.add(earthMesh);
earthGroup.add(earthNightMesh);
earthCloudMesh.scale.setScalar(1.008);
earthGroup.add(earthCloudMesh);
earthGroup.add(earthSpecularMesh);
glowMesh.scale.setScalar(1.005);
earthGroup.add(glowMesh);

const mercury = createPlanet({
    name: "Mercury",
    size: 0.383,
    textureUrl: "assets/mercury/8k_mercury.jpg",
    position: [45.46, 0, 0],
});
const mercuryPivot = new THREE.Object3D();
mercuryPivot.add(mercury);
scene.add(mercuryPivot);

const venus = createPlanet({
    name: "Venus",
    size: 0.949,
    textureUrl: "assets/venus/8k_venus_surface.jpg",
    position: [84.93, 0, 0],
    atmosphereTextureUrl: "assets/venus/4k_venus_atmosphere.jpg",
    atmosphereScale: 1.005,
});
const venusPivot = new THREE.Object3D();
venusPivot.add(venus);
scene.add(venusPivot);

const mars = createPlanet({
    name: "Mars",
    size: 0.532,
    textureUrl: "assets/mars/8k_mars.jpg",
    position: [178.9, 0, 0],
});
const marsPivot = new THREE.Object3D();
marsPivot.add(mars);
scene.add(marsPivot);

const jupiter = createPlanet({
    name: "Jupiter",
    size: 10.97,
    textureUrl: "assets/jupiter/8k_jupiter.jpg",
    position: [611.1, 0, 0],
});
const jupiterPivot = new THREE.Object3D();
jupiterPivot.add(jupiter);
scene.add(jupiterPivot);

const saturn = createPlanet({
    name: "Saturn",
    size: 9.144,
    textureUrl: "assets/saturn/8k_saturn.jpg",
    position: [1125, 0, 0],
    rings: true
});

const saturnPivot = new THREE.Object3D();
saturnPivot.add(saturn);
scene.add(saturnPivot);

const uranus = createPlanet({
    name: "Uranus",
    size: 3.981,
    textureUrl: "assets/uranus/2k_uranus.jpg",
    position: [2258, 0, 0],
});
const uranusPivot = new THREE.Object3D();
uranusPivot.add(uranus);
scene.add(uranusPivot);

const neptune = createPlanet({
    name: "Neptune",
    size: 3.866,
    textureUrl: "assets/neptune/2k_neptune.jpg",
    position: [3535, 0, 0],
});
const neptunePivot = new THREE.Object3D();
neptunePivot.add(neptune);
scene.add(neptunePivot);

const sunMaterial = new THREE.MeshBasicMaterial({
    map: loader.load("assets/sun/8k_sun.jpg"),
});
const sunGeometry = new THREE.IcosahedronGeometry(11.537, 15);
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
const sunGroup = new THREE.Group();
const sunGlowMesh = new THREE.Mesh(sunGeometry, fresnelMat);
sunGroup.add(sunMesh);
sunGroup.add(sunGlowMesh);

const sunLight = new THREE.PointLight(0xffffff, 2, 0, 0);
sunGroup.add(sunLight);
scene.add(sunGroup);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;
controls.zoomSpeed = 0.5;
controls.enablePan = true;
controls.panSpeed = 0.5;
controls.autoRotate = false;

function updateCardPosition(mesh, card, positionVector) {
    if (mesh && card) {
        mesh.getWorldPosition(positionVector);
        positionVector.project(camera);
        
        const widthHalf = window.innerWidth / 2;
        const heightHalf = window.innerHeight / 2;
        let x = (positionVector.x * widthHalf) + widthHalf;
        let y = -(positionVector.y * heightHalf) + heightHalf;
        
        const isMobile = window.innerHeight > window.innerWidth;
        
        if (card.classList.contains('expanded')) {
            if (isMobile) {
                x = widthHalf;
                y = heightHalf + 120;
            } else {
                x += 150;
            }
        }
        
        card.style.left = `${x}px`;
        card.style.top = `${y}px`;
    }
}

function animate() {
    requestAnimationFrame(animate);

    if (sunMesh) updateCardPosition(sunMesh, sunCard, new THREE.Vector3());
    if (moonMesh) updateCardPosition(moonMesh, moonCard, new THREE.Vector3());
    
    if (mercury) updateCardPosition(mercury.children[0], mercuryCard, cardPositions.mercury);
    if (venus) updateCardPosition(venus.children[0], venusCard, cardPositions.venus);
    if (earthMesh) updateCardPosition(earthGroup.children[0], earthCard, cardPositions.earth);
    if (mars) updateCardPosition(mars.children[0], marsCard, cardPositions.mars);
    if (jupiter) updateCardPosition(jupiter.children[0], jupiterCard, cardPositions.jupiter);
    if (saturn) updateCardPosition(saturn.children[0], saturnCard, cardPositions.saturn);
    if (uranus) updateCardPosition(uranus.children[0], uranusCard, cardPositions.uranus);
    if (neptune) updateCardPosition(neptune.children[0], neptuneCard, cardPositions.neptune);

    mercury.children[0].rotation.y += earthRotationSpeed * rotationSpeedMultipliers.mercury;
    venus.children[0].rotation.y += earthRotationSpeed * rotationSpeedMultipliers.venus;
    earthGroup.rotation.y += earthRotationSpeed * rotationSpeedMultipliers.earth;
    mars.children[0].rotation.y += earthRotationSpeed * rotationSpeedMultipliers.mars;
    jupiter.children[0].rotation.y += earthRotationSpeed * rotationSpeedMultipliers.jupiter;
    saturn.children[0].rotation.y += earthRotationSpeed * rotationSpeedMultipliers.saturn;
    uranus.children[0].rotation.y += earthRotationSpeed * rotationSpeedMultipliers.uranus;
    neptune.children[0].rotation.y += earthRotationSpeed * rotationSpeedMultipliers.neptune;
    sunMesh.rotation.y += earthRotationSpeed * rotationSpeedMultipliers.sun;

    earthCloudMesh.rotation.y += earthRotationSpeed * rotationSpeedMultipliers.earth * 1.05;

    if (animationsEnabled) {
        mercuryPivot.rotation.y += earthOrbitSpeed * orbitalSpeedMultipliers.mercury;
        venusPivot.rotation.y += earthOrbitSpeed * orbitalSpeedMultipliers.venus;
        earthPivot.rotation.y += earthOrbitSpeed * orbitalSpeedMultipliers.earth;
        marsPivot.rotation.y += earthOrbitSpeed * orbitalSpeedMultipliers.mars;
        jupiterPivot.rotation.y += earthOrbitSpeed * orbitalSpeedMultipliers.jupiter;
        saturnPivot.rotation.y += earthOrbitSpeed * orbitalSpeedMultipliers.saturn;
        uranusPivot.rotation.y += earthOrbitSpeed * orbitalSpeedMultipliers.uranus;
        neptunePivot.rotation.y += earthOrbitSpeed * orbitalSpeedMultipliers.neptune;
        moonPivot.rotation.y += moonOrbitSpeed;
    }

    if (moonMesh) {
        moonMesh.rotation.y += earthRotationSpeed;
    }

    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
});

animate();
