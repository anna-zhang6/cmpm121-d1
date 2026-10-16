// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
//@deno-types="./asset-url.d.ts"
import "./style.css";
import flowerUrl from "./assets/flowerbutton.png?no-inline";
import gloveUrl from "./assets/garderngloves.png?no-inline";
import scarecrowUrl from "./assets/scarecrow.png?no-inline";
import watercanUrl from "./assets/watercan.png?no-inline";
import sprinklerUrl from "./assets/sprinkler.png?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;

const heading = document.createElement("h1");

heading.textContent = "Flower Flow";

const image = document.createElement("img");
image.src = flowerUrl;
image.alt = "A rose flower";
image.width = 300;
image.height = 300;

image.draggable = false;

//text element showcasing players total number of petals
const currentPetals = document.createElement("p");
currentPetals.textContent = "0 petals";

//text element showcasing players total number of passive petals
//passive petals == petals per second
const passivePetals = document.createElement("p");
passivePetals.textContent = `0 petals per second`;

// Container for the buttons
const buttonContainer = document.createElement("div");

//button for the click-power upgrade
const upgrade = document.createElement("button");

//TODO make upgrades into data structure (inspired by Cassidy and Ray's pet dog game)
const upgradeList = {
  "gardengloves": gloveUrl,
  "scarecrow": scarecrowUrl,
  "watercan": watercanUrl,
  "sprinkler": sprinklerUrl,
  "gardner": 30,
};

//data structure for passive upgrades (increase petals per second)
interface PassiveUpgrade {
  name: string;
  cost: number; // base price
  passRate: number; // petals/second added by each copy owned
  clickRate: number; //extra petals when clicked
  owned: number;
  text: string;
  button?: HTMLButtonElement;
}

//defines upgrades + their properties
const passiveUpgrades: PassiveUpgrade[] = [
  {
    name: "Garden Gloves",
    cost: 3,
    passRate: 0,
    clickRate: 0.1,
    owned: 0,
    text: "To avoid the thorns.",
  },
  {
    name: "Scarecrow",
    cost: 10,
    passRate: 0.5,
    clickRate: 0,
    owned: 0,
    text: "Fly away birdie!",
  },
  {
    name: "Water Can",
    cost: 15,
    passRate: 0,
    clickRate: 0.4,
    owned: 0,
    text: "Help your flowers grow.",
  },
  {
    name: "Sprinkler",
    cost: 20,
    passRate: 0.1,
    clickRate: 0,
    owned: 0,
    text: "All the water eith none of the effort.",
  },
  {
    name: "Gardner",
    cost: 30,
    passRate: 1,
    clickRate: 0,
    owned: 0,
    text: "All the help you could ever need.",
  },
];

function getRate(): number {
  return passiveUpgrades.reduce((sum, u) => sum + u.owned * u.passRate, 0);
}

//number added to mouse click on image
let clickBoost = 1;

//makes style neater and easier to read
app.append(
  heading,
  image,
  currentPetals,
  passivePetals,
  buttonContainer,
);

buttonContainer.append(upgrade);

//number of petals
let petalCounter: number = 0;

//button creation for passive upgrades
for (const upgrade of passiveUpgrades) {
  const button = document.createElement("button");
  const icon = document.createElement("img");
  icon.src = watercanUrl;
  upgrade.button = button;
  button.appendChild(icon);
  // button.prepend(icon);
  button.addEventListener("click", () => {
    petalCounter -= upgrade.cost;
    upgrade.owned++;
    upgrade.cost = Math.ceil(upgrade.cost * 1.5);
  });
  buttonContainer.append(button);
}

// flower animation derived from setInterval earlier on
const duration = 300;

function popFlower() {
  const zero = document.timeline.currentTime as number;
  requestAnimationFrame(animate);

  function animate(timestamp: number) {
    const value = (timestamp - zero) / duration;
    if (value < 1) {
      image.style.transform = `scale(${1 - 0.2 * Math.sin(Math.PI * value)})`;
      requestAnimationFrame(animate);
    } else image.style.transform = "scale(1)";
  }
}

let lastFrame = performance.now();

function autoClick(now: number) {
  const dt = (now - lastFrame) / 1000; // seconds since last frame
  lastFrame = now;
  petalCounter += getRate() * dt;
  requestAnimationFrame(autoClick);
}
requestAnimationFrame(autoClick);

//updating text
function updateText() {
  currentPetals.textContent = Math.floor(petalCounter) + " petals";
  upgrade.disabled = petalCounter < upgradeList.gardner;
  upgrade.textContent =
    `Gardener (+${clickBoost}/click): ${upgradeList.gardner} petals`;

  for (const upgrd of passiveUpgrades) {
    upgrd.button!.textContent =
      `${upgrd.name} (${upgrd.owned}): ${upgrd.cost} petals`;
    upgrd.button!.disabled = petalCounter < upgrd.cost;
  }

  passivePetals.textContent = `${getRate().toFixed(1)} petals per second`;
  requestAnimationFrame(updateText);
}
requestAnimationFrame(updateText);

image.addEventListener("click", () => {
  petalCounter += clickBoost;
  popFlower(); // flower animation
});

upgrade.addEventListener("click", () => {
  petalCounter -= upgradeList.gardner;
  clickBoost++;
  upgradeList.gardner = Math.ceil(upgradeList.gardner * 1.2);
});
