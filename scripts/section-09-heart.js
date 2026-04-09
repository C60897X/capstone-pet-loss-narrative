export function initHeartSection() {
    const heartSection = document.getElementById("section-09-heart");
    const heartStage = document.getElementById("heart-stage");
    const heartBackgroundTrack = document.getElementById("heart-background-track");
    const heartPersonSequence = document.getElementById("heart-person-sequence");
    const heartCatSequence = document.getElementById("heart-cat-sequence");
    const heartWalkingPerson = document.getElementById("heart-walking-person");
    const heartAdvanceIndicator = document.getElementById("heart-advance-indicator");
  
    if (
      !heartSection ||
      !heartStage ||
      !heartBackgroundTrack ||
      !heartPersonSequence ||
      !heartCatSequence ||
      !heartWalkingPerson ||
      !heartAdvanceIndicator
    ) {
      return;
    }
  
    const BACKGROUND_SOURCES = [
      "./assets/heart/background-1.png",
      "./assets/heart/background-2.png"
    ];
  
    const PERSON_SEQUENCE_SOURCES = [
      "./assets/heart/person-1.png",
      "./assets/heart/person-2.png",
      "./assets/heart/person-3.png",
      "./assets/heart/person-4.png"
    ];
  
    const CAT_SOURCES = [
      "./assets/heart/cat-1.png",
      "./assets/heart/cat-2.png",
      "./assets/heart/cat-3.png",
      "./assets/heart/cat-4.png",
      "./assets/heart/cat-5.png",
      "./assets/heart/cat-6.png",
      "./assets/heart/cat-7.png",
      "./assets/heart/cat-8.png",
      "./assets/heart/cat-9.png"
    ];
  
    const WALKING_SOURCES = [
      "./assets/heart/person-walking-1.png",
      "./assets/heart/person-walking-2.png"
    ];
  
    const PERSON_STANDING_SRC = "./assets/heart/person-standing.png";
  
    let backgroundItemsCreated = false;
    let backgroundImagesReady = false;
    let backgroundOffsetX = 0;
    let backgroundMaxOffset = 0;
    let backgroundAnimationId = null;
    let walkingAnimationId = null;
    let walkingFrameIndex = 0;
    let sectionRunId = 0;
    let triggerPointElement = null;
    let hasReachedTriggerPoint = false;
  
    function sleep(ms) {
      return new Promise(function (resolve) {
        window.setTimeout(resolve, ms);
      });
    }
  
    function preloadAssets() {
      const sources = []
        .concat(BACKGROUND_SOURCES)
        .concat(PERSON_SEQUENCE_SOURCES)
        .concat(CAT_SOURCES)
        .concat(WALKING_SOURCES)
        .concat([PERSON_STANDING_SRC]);
  
      for (let i = 0; i < sources.length; i += 1) {
        const image = new Image();
        image.src = sources[i];
      }
    }
  
    function preventImageDrag(event) {
      event.preventDefault();
    }
  
    function hideAdvanceIndicator() {
      heartAdvanceIndicator.classList.remove("is-visible");
    }
  
    function showAdvanceIndicator() {
      heartAdvanceIndicator.classList.add("is-visible");
    }
  
    function createBackgroundItem(src, index) {
      const item = document.createElement("div");
      item.className = "heart-background-item";
  
      const image = document.createElement("img");
      image.className = "heart-background-image";
      image.src = src;
      image.alt = "";
      image.addEventListener("dragstart", preventImageDrag);
  
      item.appendChild(image);
  
      if (index === 0) {
        triggerPointElement = document.createElement("div");
        triggerPointElement.className = "heart-trigger-point";
        item.appendChild(triggerPointElement);
      }
  
      return item;
    }
  
    function ensureBackgroundImages() {
      if (backgroundItemsCreated) {
        return;
      }
  
      for (let i = 0; i < BACKGROUND_SOURCES.length; i += 1) {
        const item = createBackgroundItem(BACKGROUND_SOURCES[i], i);
        heartBackgroundTrack.appendChild(item);
      }
  
      backgroundItemsCreated = true;
    }
  
    async function waitForBackgroundImages() {
      const images = heartBackgroundTrack.querySelectorAll(".heart-background-image");
  
      const waits = [];
  
      for (let i = 0; i < images.length; i += 1) {
        const image = images[i];
  
        waits.push(
          new Promise(function (resolve) {
            if (image.complete && image.naturalWidth > 0) {
              resolve();
              return;
            }
  
            image.onload = function () {
              resolve();
            };
  
            image.onerror = function () {
              resolve();
            };
          })
        );
      }
  
      await Promise.all(waits);
      backgroundImagesReady = true;
    }
  
    function updateBackgroundMaxOffset() {
      const trackWidth = heartBackgroundTrack.scrollWidth;
      const viewportWidth = heartStage.clientWidth;
      const difference = trackWidth - viewportWidth;
  
      if (difference > 0) {
        backgroundMaxOffset = difference;
      } else {
        backgroundMaxOffset = 0;
      }
    }
  
    function resetBackgroundPosition() {
      backgroundOffsetX = 0;
      heartBackgroundTrack.style.transform = "translate3d(0px, 0, 0)";
      updateBackgroundMaxOffset();
    }
  
    function stopBackgroundMovement() {
      if (backgroundAnimationId !== null) {
        cancelAnimationFrame(backgroundAnimationId);
        backgroundAnimationId = null;
      }
    }
  
    function stopWalkingAnimation() {
      if (walkingAnimationId !== null) {
        window.clearInterval(walkingAnimationId);
        walkingAnimationId = null;
      }
    }
  
    function hidePersonSequence() {
      heartPersonSequence.classList.remove("is-visible");
    }
  
    function showPersonSequenceFrame(src) {
      heartPersonSequence.src = src;
      heartPersonSequence.classList.add("is-visible");
    }
  
    function hideCatSequence() {
      heartCatSequence.classList.remove("is-visible");
    }
  
    function showCatSequenceFrame(src) {
      heartCatSequence.src = src;
      heartCatSequence.classList.add("is-visible");
    }
  
    function hideWalkingPerson() {
      heartWalkingPerson.classList.remove("is-visible");
    }
  
    function showWalkingPersonFrame(src) {
      heartWalkingPerson.src = src;
      heartWalkingPerson.classList.add("is-visible");
    }
  
    function getWalkingPersonRightEdge() {
      return heartWalkingPerson.offsetLeft + heartWalkingPerson.offsetWidth;
    }
  
    function getTriggerPointViewportX() {
      if (!triggerPointElement) {
        return Infinity;
      }
  
      const triggerRect = triggerPointElement.getBoundingClientRect();
      return triggerRect.left;
    }
  
    function startWalkingAnimation() {
      stopWalkingAnimation();
      walkingFrameIndex = 0;
      showWalkingPersonFrame(WALKING_SOURCES[walkingFrameIndex]);
  
      walkingAnimationId = window.setInterval(function () {
        if (hasReachedTriggerPoint) {
          stopWalkingAnimation();
          return;
        }
  
        if (walkingFrameIndex === 0) {
          walkingFrameIndex = 1;
        } else {
          walkingFrameIndex = 0;
        }
  
        showWalkingPersonFrame(WALKING_SOURCES[walkingFrameIndex]);
      }, 700);
    }
  
    function stopAtTriggerPoint() {
      if (hasReachedTriggerPoint) {
        return;
      }
  
      hasReachedTriggerPoint = true;
      stopWalkingAnimation();
      stopBackgroundMovement();
      showWalkingPersonFrame(PERSON_STANDING_SRC);
      showAdvanceIndicator();
    }
  
    function checkTriggerEncounter() {
      if (hasReachedTriggerPoint) {
        return;
      }
  
      const personRightEdge = getWalkingPersonRightEdge();
      const triggerX = getTriggerPointViewportX();
  
      if (personRightEdge >= triggerX) {
        stopAtTriggerPoint();
      }
    }
  
    function startBackgroundMovement(runId) {
      stopBackgroundMovement();
  
      let lastTimestamp = null;
      const pixelsPerSecond = 28;
  
      function step(timestamp) {
        if (runId !== sectionRunId) {
          stopBackgroundMovement();
          return;
        }
  
        if (!heartSection.classList.contains("is-visible")) {
          stopBackgroundMovement();
          return;
        }
  
        if (hasReachedTriggerPoint) {
          stopBackgroundMovement();
          return;
        }
  
        if (lastTimestamp === null) {
          lastTimestamp = timestamp;
        }
  
        const deltaMs = timestamp - lastTimestamp;
        lastTimestamp = timestamp;
  
        if (backgroundOffsetX < backgroundMaxOffset) {
          backgroundOffsetX += pixelsPerSecond * (deltaMs / 1000);
  
          if (backgroundOffsetX > backgroundMaxOffset) {
            backgroundOffsetX = backgroundMaxOffset;
          }
  
          heartBackgroundTrack.style.transform = `translate3d(${-backgroundOffsetX}px, 0, 0)`;
        }
  
        checkTriggerEncounter();
  
        if (!hasReachedTriggerPoint && backgroundOffsetX < backgroundMaxOffset) {
          backgroundAnimationId = requestAnimationFrame(step);
        } else if (!hasReachedTriggerPoint && backgroundMaxOffset > 0) {
          backgroundAnimationId = requestAnimationFrame(step);
        } else {
          stopBackgroundMovement();
        }
      }
  
      backgroundAnimationId = requestAnimationFrame(step);
    }
  
    async function playPersonSequence(runId) {
      showPersonSequenceFrame(PERSON_SEQUENCE_SOURCES[0]);
      await sleep(2000);
      if (runId !== sectionRunId) return;
  
      showPersonSequenceFrame(PERSON_SEQUENCE_SOURCES[1]);
      await sleep(1000);
      if (runId !== sectionRunId) return;
  
      showPersonSequenceFrame(PERSON_SEQUENCE_SOURCES[2]);
      await sleep(1000);
      if (runId !== sectionRunId) return;
  
      showPersonSequenceFrame(PERSON_SEQUENCE_SOURCES[3]);
    }
  
    async function playCatSequence(runId) {
      showCatSequenceFrame(CAT_SOURCES[0]);
  
      for (let i = 1; i < CAT_SOURCES.length; i += 1) {
        await sleep(150);
        if (runId !== sectionRunId) return;
        showCatSequenceFrame(CAT_SOURCES[i]);
      }
  
      await sleep(150);
      if (runId !== sectionRunId) return;
      hideCatSequence();
    }
  
    async function runHeartSequence() {
      sectionRunId += 1;
      const runId = sectionRunId;
  
      hasReachedTriggerPoint = false;
      hideAdvanceIndicator();
      hidePersonSequence();
      hideCatSequence();
      hideWalkingPerson();
      stopWalkingAnimation();
      stopBackgroundMovement();
      resetBackgroundPosition();
  
      await playPersonSequence(runId);
      if (runId !== sectionRunId) return;
  
      await playCatSequence(runId);
      if (runId !== sectionRunId) return;
  
      await sleep(1000);
      if (runId !== sectionRunId) return;
  
      hidePersonSequence();
      showWalkingPersonFrame(WALKING_SOURCES[0]);
      startWalkingAnimation();
      startBackgroundMovement(runId);
    }
  
    async function revealHeartSection() {
      heartSection.classList.remove("is-complete");
      heartSection.classList.add("is-visible");
  
      ensureBackgroundImages();
  
      if (!backgroundImagesReady) {
        await waitForBackgroundImages();
      }
  
      await new Promise(function (resolve) {
        requestAnimationFrame(function () {
          requestAnimationFrame(resolve);
        });
      });
  
      resetBackgroundPosition();
      runHeartSequence();
    }
  
    window.addEventListener("resize", function () {
      updateBackgroundMaxOffset();
  
      if (backgroundOffsetX > backgroundMaxOffset) {
        backgroundOffsetX = backgroundMaxOffset;
        heartBackgroundTrack.style.transform = `translate3d(${-backgroundOffsetX}px, 0, 0)`;
      }
  
      checkTriggerEncounter();
    });
  
    heartPersonSequence.addEventListener("dragstart", preventImageDrag);
    heartCatSequence.addEventListener("dragstart", preventImageDrag);
    heartWalkingPerson.addEventListener("dragstart", preventImageDrag);
  
    document.addEventListener("showNextSectionFromFullPhoto", function () {
      revealHeartSection();
    });
  
    preloadAssets();
  }