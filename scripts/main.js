import { initIntroSection } from "./section-01-intro.js";
import { initLandingSection } from "./section-02-landing.js";
import { initBrokenPhotoSection } from "./section-03-broken-photo.js";
import { initP1WakeSection } from "./section-04-p1-wake.js";
import { initP2CombingSection } from "./section-05-p2-combing.js";
import { initP3AccompanySection } from "./section-06-p3-accompany.js";
import { initP4NailCuttingSection } from "./section-07-nail-cutting.js";
import { initP5ReassureSection } from "./section-08-p5-reassure.js";
import { initHeartSection } from "./section-09-heart.js";
import { initEndingSection } from "./section-10-ending.js";
import { initGlobalNavigation } from "./global-navigation.js";

initIntroSection();
initLandingSection();
initBrokenPhotoSection();
initP1WakeSection();
initP2CombingSection();
initP3AccompanySection();
initP4NailCuttingSection();
initP5ReassureSection();
initHeartSection();
initEndingSection();
initGlobalNavigation();

const backgroundMusic = document.getElementById("background-music");

function startBackgroundMusic() {
  if (!backgroundMusic) {
    return;
  }

  backgroundMusic.volume = 0.45;
  backgroundMusic.play().catch(function () {
    // autoplay may still be blocked until interaction
  });

  document.removeEventListener("click", startBackgroundMusic);
  document.removeEventListener("keydown", startBackgroundMusic);
}

document.addEventListener("click", startBackgroundMusic);
document.addEventListener("keydown", startBackgroundMusic);