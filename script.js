const player = document.querySelector("#player");
const sceneImage = document.querySelector("#sceneImage");
const sceneName = document.querySelector("#sceneName");
const playbackMessage = document.querySelector("#playbackMessage");
const sceneButtons = document.querySelectorAll(".scene-button");
let currentScene = null;

const scenes = [
  {
    start: 0,
    name: "Traffic",
    image: "images/vietnammorning.jpg",
    alt: "The morning streets of Vietnam, filled with cars and honking",
  },
  {
    start: 19,
    name: "Playground",
    image: "images/vietnamesekids.jpg",
    alt: "Vietnamese children hanging around in the courtyard",
  },
  {
    start: 47,
    name: "Tea time",
    image: "images/vietnameseuncles.jpg",
    alt: "Vietnamese uncles talking, laughing together over tea",
  },
  {
    start: 69,
    name: "Market",
    image: "images/vietnamesemarket.jpg",
    alt: "Women talking at a bustling Vietnamese market",
  },
];

function sceneAt(time) {
  return scenes.reduce(
    (currentScene, scene) => (time >= scene.start ? scene : currentScene),
    scenes[0],
  );
}

function showScene(scene) {
  if (currentScene?.start === scene.start) {
    return;
  }

  currentScene = scene;
  sceneImage.classList.remove("scene-enter");
  sceneImage.src = scene.image;
  sceneImage.alt = scene.alt;
  sceneName.textContent = scene.name;
  void sceneImage.offsetWidth;
  sceneImage.classList.add("scene-enter");

  sceneButtons.forEach((button) => {
    const isCurrentScene = Number(button.dataset.time) === scene.start;
    button.classList.toggle("is-active", isCurrentScene);
    button.setAttribute("aria-pressed", String(isCurrentScene));
  });
}

function syncSceneToPlayback() {
  showScene(sceneAt(player.currentTime));
}

player.addEventListener("play", syncSceneToPlayback);
player.addEventListener("playing", () => {
  playbackMessage.textContent = "Listening to the sounds of Vietnam.";
});
player.addEventListener("timeupdate", syncSceneToPlayback);
player.addEventListener("ended", () => {
  playbackMessage.textContent = "The morning soundscape has ended.";
});
player.addEventListener("error", () => {
  playbackMessage.textContent =
    "The audio could not be loaded. Check that the sound file is available.";
});

sceneButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    player.currentTime = Number(button.dataset.time);
    syncSceneToPlayback();

    try {
      await player.play();
    } catch {
      playbackMessage.textContent =
        "Playback could not start. Try pressing play on the audio controls.";
    }
  });
});