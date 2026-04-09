export function initP3AccompanySection() {
    const p3AccompanySection = document.getElementById("section-06-p3-accompany");
    const p3AccompanyImage = document.getElementById("p3-accompany-image");
    const p3TimeHit = document.getElementById("p3-time-hit");
  
    if (!p3AccompanySection || !p3AccompanyImage || !p3TimeHit) {
      return;
    }
  
    const SCENE_3PM_SRC = "./assets/p3-accompany/3pm-scene.png";
    const SCENE_4PM_SRC = "./assets/p3-accompany/4pm-scene.png";
    const SCENE_5PM_1_SRC = "./assets/p3-accompany/5pm-scene-1.png";
    const SCENE_5PM_2_SRC = "./assets/p3-accompany/5pm-scene-2.png";
    const SCENE_5PM_3_SRC = "./assets/p3-accompany/5pm-scene-3.png";
    const SCENE_5PM_4_SRC = "./assets/p3-accompany/5pm-scene-4.png";
    const PHOTO_PIECE_SRC = "./assets/p3-accompany/photo-piece.png";
  
    let currentStep = 0;
    let isAnimating = false;
    let clockIndicator = null;
    let photoPieceImage = null;
  
    function sleep(ms) {
      return new Promise(function (resolve) {
        window.setTimeout(resolve, ms);
      });
    }
  
    function preloadAssets() {
      const sources = [
        SCENE_3PM_SRC,
        SCENE_4PM_SRC,
        SCENE_5PM_1_SRC,
        SCENE_5PM_2_SRC,
        SCENE_5PM_3_SRC,
        SCENE_5PM_4_SRC,
        PHOTO_PIECE_SRC
      ];
  
      for (let i = 0; i < sources.length; i += 1) {
        const image = new Image();
        image.src = sources[i];
      }
    }
  
    function preventImageDrag(event) {
      event.preventDefault();
    }
  
    function ensureClockIndicator() {
      if (clockIndicator) {
        return clockIndicator;
      }
  
      clockIndicator = document.createElement("div");
      clockIndicator.id = "p3-clock-indicator";
      clockIndicator.className = "ui-indicator p3-clock-indicator";
      clockIndicator.textContent = "Use clock to advance time";
      p3AccompanyImage.parentNode.appendChild(clockIndicator);
  
      return clockIndicator;
    }
  
    function showClockIndicator(text) {
      const indicator = ensureClockIndicator();
      indicator.textContent = text;
      indicator.classList.add("is-visible");
    }
  
    function hideClockIndicator() {
      if (clockIndicator) {
        clockIndicator.classList.remove("is-visible");
      }
    }
  
    function ensurePhotoPieceImage() {
      if (photoPieceImage) {
        return photoPieceImage;
      }
  
      photoPieceImage = document.createElement("img");
      photoPieceImage.className = "p3-photo-piece";
      photoPieceImage.src = PHOTO_PIECE_SRC;
      photoPieceImage.alt = "Photo piece";
  
      p3AccompanyImage.parentNode.appendChild(photoPieceImage);
  
      photoPieceImage.addEventListener("dragstart", preventImageDrag);
  
      photoPieceImage.addEventListener("mouseenter", function () {
        showClockIndicator("Retrieve the photo piece");
      });
  
      photoPieceImage.addEventListener("mouseleave", function () {
        hideClockIndicator();
      });
  
      photoPieceImage.addEventListener("click", async function () {
        document.dispatchEvent(new Event("returnToBrokenPhotoHub"));
  
        await new Promise(function (resolve) {
          requestAnimationFrame(function () {
            requestAnimationFrame(resolve);
          });
        });
  
        p3AccompanySection.classList.add("is-complete");
      });
  
      return photoPieceImage;
    }
  
    function showTimeHit() {
      p3TimeHit.classList.remove("is-hidden");
      p3TimeHit.classList.add("is-visible");
    }
  
    function hideTimeHit() {
      p3TimeHit.classList.remove("is-visible");
      p3TimeHit.classList.add("is-hidden");
    }
  
    async function playFivePmAnimation() {
      if (isAnimating) {
        return;
      }
  
      isAnimating = true;
  
      hideTimeHit();
      hideClockIndicator();
  
      p3AccompanyImage.src = SCENE_5PM_1_SRC;
      await sleep(650);
  
      p3AccompanyImage.src = SCENE_5PM_2_SRC;
      await sleep(650);
  
      p3AccompanyImage.src = SCENE_5PM_3_SRC;
      await sleep(650);
  
      p3AccompanyImage.src = SCENE_5PM_4_SRC;
      await sleep(550);
  
      ensurePhotoPieceImage().classList.add("is-visible");
    }
  
    async function handleTimeClick() {
      if (isAnimating) {
        return;
      }
  
      if (currentStep === 0) {
        currentStep = 1;
        p3AccompanyImage.src = SCENE_4PM_SRC;
        return;
      }
  
      if (currentStep === 1) {
        currentStep = 2;
        await playFivePmAnimation();
      }
    }
  
    function resetSection() {
      currentStep = 0;
      isAnimating = false;
  
      p3AccompanyImage.src = SCENE_3PM_SRC;
  
      showTimeHit();
      showClockIndicator("Use clock to advance time");
  
      if (photoPieceImage) {
        photoPieceImage.classList.remove("is-visible");
      }
    }
  
    function revealP3AccompanySection() {
      resetSection();
      p3AccompanySection.classList.remove("is-complete");
      p3AccompanySection.classList.add("is-visible");
    }
  
    p3AccompanyImage.addEventListener("dragstart", preventImageDrag);
    p3TimeHit.addEventListener("click", handleTimeClick);
  
    document.addEventListener("showP3AccompanySection", function () {
      revealP3AccompanySection();
    });
  
    preloadAssets();
  }