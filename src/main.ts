// Vite turns this import into a production-safe URL. Keep it as a file so
// even this tiny example demonstrates a separately deployed asset.
// @deno-types="./asset-url.d.ts"
import flowerUrl from "./assets/flowerbutton.png?no-inline";

const app = document.querySelector<HTMLElement>("#app")!;
app.style.display = "flex";
app.style.flexDirection = "column";

const heading = document.createElement("h1");
heading.style.margin = "0 auto 0 auto";

heading.textContent = "Flower Flow";

const image = document.createElement("img");
image.src = flowerUrl;
image.alt = "A rose flower";
image.width = 150;
image.height = 150;

image.style.margin = "0 auto 0 auto";

image.style.cursor = "pointer";
image.draggable = false;

//text element showcasing players total number of petals
const currentPetals = document.createElement("p");
currentPetals.textContent = "0 petals";

currentPetals.style.margin = "0 auto 0 auto";

//text element showcasing players total number of passive petals
//passive petals == petals per second
const passivePetals = document.createElement("p");
passivePetals.textContent = "0 petals per seconds";

passivePetals.style.margin = "0 auto 0 auto";

// Container for the buttons
const buttonContainer = document.createElement("div");
buttonContainer.style.display = "flex";
buttonContainer.style.width = "100%";
buttonContainer.style.justifyContent = "center";

//buttons for upgrade
const upgrade = document.createElement("button");
upgrade.innerText = "6 petals";

const upgradePass = document.createElement("button");
upgradePass.innerText = "6 petals";

const autoclicker = document.createElement("button");
let autoClickers = 0; // how many the player owns

const upgradeCost = { "pruner": 6, "gardener": 6, "autoclicker": 20 };

//number added to mouse click on image
let clickBoost = 1;
const autoPower = 1;

//command pattern inspired by L07 to contain the passive boosters
interface passiveBoost {
  (base: number): number;
}
//define upgrades in here
const allPassives: passiveBoost[] = [];

app.append(
  heading,
  image,
  currentPetals,
  passivePetals,
  buttonContainer,
);

// Place new buttons inside here to have consistent styling and layout

buttonContainer.append(
  upgrade,
  upgradePass,
  autoclicker,
);

//number of petals
let petalCounter: number = 0;

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

let lastAuto = performance.now();

function autoClick(now: number) {
  // runs once per second whenever you own at least one
  if (autoClickers > 0 && now - lastAuto >= 1000) {
    petalCounter += autoPower;
    lastAuto = now;
  }
  requestAnimationFrame(autoClick);
}
requestAnimationFrame(autoClick);

//updating text
function updateText() {
  currentPetals.textContent = Math.floor(petalCounter) + " petals";
  upgrade.disabled = petalCounter < upgradeCost.gardener;
  upgradePass.disabled = petalCounter < upgradeCost.pruner;
  upgrade.textContent = upgradeCost.gardener + " petals";
  upgradePass.textContent = upgradeCost.pruner + " petals";
  autoclicker.textContent =
    `AutoPicker (${autoClickers}): ${upgradeCost.autoclicker} petals`;
  autoclicker.disabled = petalCounter < upgradeCost.autoclicker;
  requestAnimationFrame(updateText);
}
requestAnimationFrame(updateText);

image.addEventListener("click", () => {
  petalCounter += clickBoost;
  popFlower(); // flower animation
});

upgrade.addEventListener("click", () => {
  petalCounter -= upgradeCost.gardener;
  clickBoost++;
  upgradeCost.gardener = Math.ceil(upgradeCost.gardener * 1.2);
});

upgradePass.addEventListener("click", () => {
  petalCounter -= upgradeCost.pruner;
  allPassives.push((x) => x + 0.1);
  upgradeCost.pruner = Math.ceil(upgradeCost.pruner * 1.2);
});

autoclicker.addEventListener("click", () => {
  petalCounter -= upgradeCost.autoclicker;
  autoClickers++;
  upgradeCost.autoclicker = Math.ceil(upgradeCost.autoclicker * 1.2);
});
