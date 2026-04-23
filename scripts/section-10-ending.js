export function initEndingSection() {
    const endingSection = document.getElementById("section-10-ending");
    const endingStage = document.getElementById("ending-stage");
    const endingSceneBase = document.getElementById("ending-scene-base");
    const endingBackgroundImage = document.getElementById("ending-background-image");
    const endingDetectZone = document.getElementById("ending-detect-zone");
    const endingPerson = document.getElementById("ending-person");
    const endingTransitionVeil = document.getElementById("ending-transition-veil");
    const endingDetectZoneSecond = document.getElementById("ending-detect-zone-second");
  
    if (
        !endingSection ||
        !endingStage ||
        !endingSceneBase ||
        !endingBackgroundImage ||
        !endingDetectZone ||
        !endingPerson ||
        !endingTransitionVeil
      ) {
        return;
      }
  
    const BOX_SIDEVIEW_SRC = "./assets/ending/box-sideview.png";
    const BOX_COLORED_1_SRC = "./assets/ending/box-colored-1.png";
    const BOX_COLORED_2_SRC = "./assets/ending/box-colored-2.png";
    const BOX_COLORED_3_SRC = "./assets/ending/box-colored-3.png";
    const BOX_COLORED_OPEN_SRC = "./assets/ending/box-colored-open.png";
    const WALKING_1_SRC = "./assets/heart/person-walking-1.png";
    const WALKING_2_SRC = "./assets/heart/person-walking-2.png";
    const STANDING_SRC = "./assets/heart/person-standing.png";
  
    const PERSON_WIDTH = 240;
    const PERSON_HEIGHT = 480;
    const PERSON_BOTTOM_OFFSET = 60;
    const WALK_FRAME_MS = 700;
    const WALK_SPEED = 72;
  
    let hoverCursor = null;
    let hoverCursorImage = null;
    let walkingFrameTimer = null;
    let walkingAnimationId = null;
    let currentWalkingFrame = 0;
    let personLeft = -PERSON_WIDTH;
    let hasStoppedAtZone = false;
    let isRevealRunning = false;
    let secondDragStarted = false;
    let secondDragDistance = 0;
    let secondLastPointerX = 0;
    let secondSequenceDone = false;
    let dragIndicator = null;
  
    function sleep(ms) {
      return new Promise(function (resolve) {
        window.setTimeout(resolve, ms);
      });
    }
  
    function preloadAssets() {
      const sources = [
        BOX_SIDEVIEW_SRC,
        BOX_COLORED_1_SRC,
        BOX_COLORED_2_SRC,
        BOX_COLORED_3_SRC,
        BOX_COLORED_OPEN_SRC,
        WALKING_1_SRC,
        WALKING_2_SRC,
        STANDING_SRC,
        "./assets/shared/objects/mouse-icon-paw-dark-32.png",
        "./assets/shared/objects/mouse-icon-paw-dark-drag.png"
      ];
  
      for (let i = 0; i < sources.length; i += 1) {
        const image = new Image();
        image.src = sources[i];
      }
    }
  
    function preventImageDrag(event) {
      event.preventDefault();
    }
  
    function getImageBox() {
      if (
        !endingBackgroundImage.complete ||
        !endingBackgroundImage.naturalWidth ||
        !endingBackgroundImage.naturalHeight
      ) {
        return null;
      }
  
      const stageWidth = endingStage.clientWidth;
      const stageHeight = endingStage.clientHeight;
      const renderedWidth = stageWidth;
      const renderedHeight = renderedWidth * (
        endingBackgroundImage.naturalHeight / endingBackgroundImage.naturalWidth
      );
  
      let imageTop = 0;
  
      if (renderedHeight > stageHeight) {
        endingStage.classList.add("is-tall-image");
        imageTop = 0;
      } else {
        endingStage.classList.remove("is-tall-image");
        imageTop = (stageHeight - renderedHeight) / 2;
      }
  
      return {
        left: 0,
        top: imageTop,
        width: renderedWidth,
        height: renderedHeight
      };
    }
  
    function setElementPositionFromImageBox(element, leftPercent, topPercent) {
      const imageBox = getImageBox();
  
      if (!imageBox || !element) {
        return;
      }
  
      const x = imageBox.left + (imageBox.width * leftPercent);
      const y = imageBox.top + (imageBox.height * topPercent);
  
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
    }
  
    function updateSceneBaseLayout() {
      const imageBox = getImageBox();
  
      if (!imageBox) {
        return;
      }
  
      endingSceneBase.style.left = `${imageBox.left}px`;
      endingSceneBase.style.top = `${imageBox.top}px`;
      endingSceneBase.style.width = `${imageBox.width}px`;
      endingSceneBase.style.height = `${imageBox.height}px`;
    }
  
    function updateDetectZonePosition() {
      setElementPositionFromImageBox(endingDetectZone, 0.55, 0.76);
    }
  
    function updateSecondDetectZonePosition() {
        setElementPositionFromImageBox(endingDetectZoneSecond, 0.49, 0.46);
      }
  
    function updatePersonVerticalPosition() {
      const imageBox = getImageBox();
  
      if (!imageBox) {
        return;
      }
  
      const top = imageBox.top + imageBox.height - PERSON_BOTTOM_OFFSET - PERSON_HEIGHT - 50;
      endingPerson.style.top = `${top}px`;
    }
  
    function updatePersonPosition() {
      endingPerson.style.left = `${personLeft}px`;
    }
  
    function updateLayoutForCurrentScene() {
      updateSceneBaseLayout();
      updateDetectZonePosition();
      updateSecondDetectZonePosition();
      updatePersonVerticalPosition();
      updatePersonPosition();
    }

    function ensureDragIndicator() {
        if (dragIndicator) {
          return dragIndicator;
        }
      
        dragIndicator = document.createElement("div");
        dragIndicator.className = "ui-indicator ending-drag-indicator";
        dragIndicator.textContent = "Drag tape away";
        endingStage.appendChild(dragIndicator);
      
        return dragIndicator;
      }
      
      function showDragIndicator() {
        ensureDragIndicator().classList.add("is-visible");
      }
      
      function hideDragIndicator() {
        if (dragIndicator) {
          dragIndicator.classList.remove("is-visible");
        }
      }
  
    function ensureHoverCursor() {
      if (hoverCursor) {
        return hoverCursor;
      }
  
      hoverCursor = document.createElement("div");
      hoverCursor.className = "ending-hover-cursor";
  
      hoverCursorImage = document.createElement("img");
      hoverCursorImage.src = "./assets/shared/objects/mouse-icon-paw-dark-32.png";
      hoverCursorImage.alt = "";
  
      hoverCursor.appendChild(hoverCursorImage);
      endingSection.appendChild(hoverCursor);
  
      return hoverCursor;
    }
  
    function moveCursor(event) {
      const rect = endingSection.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
  
      ensureHoverCursor().style.transform = `translate3d(${x - 16}px, ${y - 16}px, 0)`;
    }
  
    function setClickCursorIcon() {
      ensureHoverCursor();
      hoverCursorImage.src = "./assets/shared/objects/mouse-icon-paw-dark-32.png";
    }
  
    function setDragCursorIcon() {
      ensureHoverCursor();
      hoverCursorImage.src = "./assets/shared/objects/mouse-icon-paw-dark-drag.png";
    }
  
    function showCursor() {
      ensureHoverCursor().classList.add("is-visible");
      endingSection.classList.add("is-interactive");
    }
  
    function hideCursor() {
      if (hoverCursor) {
        hoverCursor.classList.remove("is-visible");
      }
      endingSection.classList.remove("is-interactive");
    }
  
    function stopWalkingFrameLoop() {
      if (walkingFrameTimer !== null) {
        window.clearInterval(walkingFrameTimer);
        walkingFrameTimer = null;
      }
    }
  
    function stopWalkingMotion() {
      if (walkingAnimationId !== null) {
        cancelAnimationFrame(walkingAnimationId);
        walkingAnimationId = null;
      }
    }
  
    function startWalkingFrameLoop() {
      stopWalkingFrameLoop();
      currentWalkingFrame = 0;
      endingPerson.src = WALKING_1_SRC;
  
      walkingFrameTimer = window.setInterval(function () {
        currentWalkingFrame = currentWalkingFrame === 0 ? 1 : 0;
        endingPerson.src = currentWalkingFrame === 0 ? WALKING_1_SRC : WALKING_2_SRC;
      }, WALK_FRAME_MS);
    }
  
    function getPersonRightEdge() {
      const rect = endingPerson.getBoundingClientRect();
      return rect.right;
    }
  
    function getDetectZoneLeftEdge() {
      const rect = endingDetectZone.getBoundingClientRect();
      return rect.left;
    }
  
    function stopPersonAtZone() {
      if (hasStoppedAtZone) {
        return;
      }
  
      hasStoppedAtZone = true;
      stopWalkingMotion();
      stopWalkingFrameLoop();
      endingPerson.src = STANDING_SRC;
      endingDetectZone.classList.add("is-active");
    }
  
    function startWalkingIn() {
      stopWalkingMotion();
      stopWalkingFrameLoop();
  
      personLeft = -PERSON_WIDTH;
      updatePersonPosition();
      endingPerson.src = WALKING_1_SRC;
      endingPerson.classList.add("is-visible");
      startWalkingFrameLoop();
  
      let lastTimestamp = null;
  
      function step(timestamp) {
        if (!endingSection.classList.contains("is-visible")) {
          stopWalkingMotion();
          return;
        }
  
        if (hasStoppedAtZone) {
          stopWalkingMotion();
          return;
        }
  
        if (lastTimestamp === null) {
          lastTimestamp = timestamp;
        }
  
        const deltaSeconds = (timestamp - lastTimestamp) / 1000;
        lastTimestamp = timestamp;
  
        personLeft += WALK_SPEED * deltaSeconds;
        updatePersonPosition();
  
        if (getPersonRightEdge() >= getDetectZoneLeftEdge()) {
          stopPersonAtZone();
          return;
        }
  
        walkingAnimationId = requestAnimationFrame(step);
      }
  
      walkingAnimationId = requestAnimationFrame(step);
    }
  
    async function setScene(src) {
      endingBackgroundImage.src = src;
  
      await new Promise(function (resolve) {
        if (endingBackgroundImage.complete) {
          resolve();
          return;
        }
  
        endingBackgroundImage.addEventListener("load", resolve, { once: true });
      });
  
      updateLayoutForCurrentScene();
    }
  
    async function playColoringTransition() {
      endingTransitionVeil.classList.add("is-dark");
      await sleep(160);
      await setScene(BOX_COLORED_1_SRC);
      await sleep(80);
      endingTransitionVeil.classList.remove("is-dark");
      await sleep(180);
    }
  
    async function playOpenSequence() {
      await setScene(BOX_COLORED_2_SRC);
      await sleep(240);
  
      await setScene(BOX_COLORED_3_SRC);
      await sleep(240);
  
      await setScene(BOX_COLORED_OPEN_SRC);
    }
  
    async function handleDetectZoneClick() {
      if (!hasStoppedAtZone) {
        return;
      }
  
      hideCursor();
      endingPerson.classList.remove("is-visible");
      endingDetectZone.classList.remove("is-active");
      await playColoringTransition();
      endingDetectZoneSecond.classList.add("is-active");
      showDragIndicator();
    }
  
    async function handleSecondDragSuccess() {
      if (secondSequenceDone) {
        return;
      }
      
      secondSequenceDone = true;
      secondDragStarted = false;
      hideCursor();
      hideDragIndicator();
      endingDetectZoneSecond.classList.remove("is-active");
      await playOpenSequence();
    }
  
    async function resetSection() {
      hasStoppedAtZone = false;
      secondDragStarted = false;
      secondDragDistance = 0;
      secondSequenceDone = false;
      hideCursor();
      hideDragIndicator();
      stopWalkingMotion();
      stopWalkingFrameLoop();
      endingDetectZone.classList.remove("is-active");
      endingDetectZoneSecond.classList.remove("is-active");
      endingPerson.classList.remove("is-visible");
      personLeft = -PERSON_WIDTH;
  
      await setScene(BOX_SIDEVIEW_SRC);
      updateLayoutForCurrentScene();
    }
  
    async function playRevealTransition() {
      endingTransitionVeil.classList.add("is-dark");
      await sleep(160);
      endingTransitionVeil.classList.remove("is-dark");
      await sleep(220);
    }
  
    async function revealEndingSection() {
      if (isRevealRunning) {
        return;
      }
  
      isRevealRunning = true;
      endingSection.classList.remove("is-complete");
      endingSection.classList.add("is-visible");
  
      await resetSection();
      await playRevealTransition();
      startWalkingIn();
  
      isRevealRunning = false;
    }
  
    endingBackgroundImage.addEventListener("dragstart", preventImageDrag);
    endingPerson.addEventListener("dragstart", preventImageDrag);
  
    endingDetectZone.addEventListener("click", handleDetectZoneClick);
  
    endingDetectZone.addEventListener("mouseenter", function (event) {
      if (!hasStoppedAtZone) {
        return;
      }
  
      setClickCursorIcon();
      moveCursor(event);
      showCursor();
    });
  
    endingDetectZone.addEventListener("mouseleave", function () {
      hideCursor();
    });
  
    endingDetectZone.addEventListener("mousemove", function (event) {
      if (!hasStoppedAtZone) {
        return;
      }
  
      setClickCursorIcon();
      moveCursor(event);
    });
  
    endingDetectZoneSecond.addEventListener("pointerdown", function (event) {
      if (!endingDetectZoneSecond.classList.contains("is-active")) {
        return;
      }
  
      secondDragStarted = true;
      secondDragDistance = 0;
      secondLastPointerX = event.clientX;
      hideCursor();
    });
  
    endingDetectZoneSecond.addEventListener("pointermove", function (event) {
      if (!endingDetectZoneSecond.classList.contains("is-active")) {
        return;
      }
  
      if (!secondDragStarted) {
        setDragCursorIcon();
        moveCursor(event);
        showCursor();
        return;
      }
  
      const deltaX = event.clientX - secondLastPointerX;
      secondLastPointerX = event.clientX;
  
      if (deltaX > 0) {
        secondDragDistance += deltaX;
      }
  
      if (secondDragDistance >= 70) {
        handleSecondDragSuccess();
      }
    });
  
    endingDetectZoneSecond.addEventListener("pointerup", function () {
      secondDragStarted = false;
    });
  
    endingDetectZoneSecond.addEventListener("pointercancel", function () {
      secondDragStarted = false;
      hideCursor();
    });
  
    endingDetectZoneSecond.addEventListener("mouseenter", function (event) {
      if (!endingDetectZoneSecond.classList.contains("is-active")) {
        return;
      }
  
      setDragCursorIcon();
      moveCursor(event);
      showCursor();
    });
  
    endingDetectZoneSecond.addEventListener("mouseleave", function () {
      hideCursor();
    });
  
    document.addEventListener("showEndingSection", function () {
      revealEndingSection();
    });
  
    window.addEventListener("resize", function () {
      updateLayoutForCurrentScene();
    });
  
    preloadAssets();
  }