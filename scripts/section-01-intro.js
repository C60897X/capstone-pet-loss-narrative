export function initIntroSection() {
  const introFrame = document.getElementById("intro-cat-frame");
  const introTextStage = document.getElementById("intro-text-stage");
  const catHitbox = document.getElementById("intro-cat-hitbox");
  const hoverCursor = document.getElementById("intro-hover-cursor");
  const memoryScenes = document.getElementById("intro-memory-scenes");
  const memoryTrack = document.getElementById("intro-memory-track");
  const memoryProgressFill = document.getElementById("intro-memory-progress-fill");
  const scrollIndicator = document.getElementById("intro-scroll-indicator");
  const photoButton = document.getElementById("intro-photo-button");
  const introTextLine1a = document.getElementById("intro-text-line-1a");
  const introTextLine1b = document.getElementById("intro-text-line-1b");
  const introTextLine2 = document.getElementById("intro-text-line-2");
  const memoryTextStage = document.getElementById("intro-memory-text-stage");
  const memoryTextElement = document.getElementById("intro-memory-text");
  const memoryTextGhost = document.getElementById("intro-memory-text-ghost");
  const memoryTextTyped = document.getElementById("intro-memory-text-typed");
  const memoryTextLineElement = memoryTextStage
    ? memoryTextStage.querySelector(".intro-memory-text-line")
    : null;
  const memoryImages = memoryTrack ? Array.from(memoryTrack.querySelectorAll(".intro-memory-image")) : [];
  const firstMemoryImage = memoryImages[0] || null;
  const lastMemoryImage = memoryImages[memoryImages.length - 1] || null;

  let memoryAgeElement = document.getElementById("intro-memory-age");

  const memoryTexts = [
    {
      line1: "Today, Coco joined our family.",
      line2: "Age: 10"
    },
    {
      line1: "Buying different types of food to see which she likes.",
      line2: "Age: 10"
    },
    {
      line1: "Coco, cleverly waiting for her food.",
      line2: "Age: 12"
    },
    {
      line1: "She meets me everyday at the door when I return from school.",
      line2: "Age: 15"
    },
    {
      line1: "Toy-playing.",
      line2: "Age: 18"
    },
    {
      line1: "We took Coco for family photography!",
      line2: "Age: 20"
    }
  ];

  const TRANSITION_SEQUENCE_FRAMES = [
    "./assets/intro/intro-transition-set-1-1.png",
    "./assets/intro/intro-transition-set-1-2.png",
    "./assets/intro/intro-transition-set-1-3.png",
    "./assets/intro/intro-transition-set-1-4.png",
    "./assets/intro/intro-transition-set-1-5.png",
    "./assets/intro/intro-transition-set-1-6.png",
    "./assets/intro/intro-transition-set-1-7.png"
  ];
  const FRAME_SEQUENCE_MS = 125;
  const CROSSFADE_MS = 160;

  if (
    !introFrame ||
    !introTextStage ||
    !catHitbox ||
    !hoverCursor ||
    !memoryScenes ||
    !memoryTrack ||
    !memoryProgressFill ||
    !scrollIndicator ||
    !photoButton ||
    !introTextLine1a ||
    !introTextLine1b ||
    !introTextLine2 ||
    !memoryTextStage ||
    !memoryTextElement ||
    !memoryTextGhost ||
    !memoryTextTyped ||
    !memoryTextLineElement ||
    !firstMemoryImage ||
    !lastMemoryImage ||
    memoryImages.length === 0
  ) {
    return;
  }

  if (!memoryAgeElement) {
    memoryAgeElement = document.createElement("div");
    memoryAgeElement.id = "intro-memory-age";
    memoryAgeElement.className = "intro-memory-age";
    memoryTextLineElement.insertAdjacentElement("afterend", memoryAgeElement);
  }

  let currentFrame = 1;
  let currentTrackX = 0;
  let targetTrackX = 0;
  let touchStartY = null;
  let rafId = null;
  let typingSequenceDone = false;
  let currentMemoryTextIndex = -1;
  let pendingMemoryTextIndex = -1;
  let memoryTextTransitioning = false;
  let currentMemoryIndex = 0;
  let memoryStepLocked = false;
  let accumulatedWheelDelta = 0;
  let accumulatedTouchDelta = 0;
  let isPhotoSequencePlaying = false;
  let hasStartedMemoryScroll = false;

  const WHEEL_STEP_THRESHOLD = 45;
  const TOUCH_STEP_THRESHOLD = 35;
  const STEP_EPSILON = 0.5;

  let transitionOverlay = null;
  let transitionLayerA = null;
  let transitionLayerB = null;
  let transitionImageA = null;
  let transitionImageB = null;
  let activeTransitionLayer = 0;

  function ensureTransitionOverlay() {
    if (transitionOverlay) return;

    transitionOverlay = document.createElement("div");
    transitionOverlay.className = "intro-transition-overlay";

    transitionLayerA = document.createElement("div");
    transitionLayerA.className = "intro-transition-overlay-layer is-visible";
    transitionImageA = document.createElement("img");
    transitionImageA.alt = "";
    transitionLayerA.appendChild(transitionImageA);

    transitionLayerB = document.createElement("div");
    transitionLayerB.className = "intro-transition-overlay-layer";
    transitionImageB = document.createElement("img");
    transitionImageB.alt = "";
    transitionLayerB.appendChild(transitionImageB);

    transitionOverlay.appendChild(transitionLayerA);
    transitionOverlay.appendChild(transitionLayerB);
    document.body.appendChild(transitionOverlay);

    activeTransitionLayer = 0;
  }

  function showTransitionOverlay() {
    ensureTransitionOverlay();
    transitionOverlay.classList.add("is-visible");
  }

  function hideTransitionOverlay() {
    if (!transitionOverlay) return;
    transitionOverlay.classList.remove("is-visible");
  }

  function getTransitionLayers() {
    if (activeTransitionLayer === 0) {
      return {
        currentLayer: transitionLayerA,
        currentImage: transitionImageA,
        nextLayer: transitionLayerB,
        nextImage: transitionImageB
      };
    }

    return {
      currentLayer: transitionLayerB,
      currentImage: transitionImageB,
      nextLayer: transitionLayerA,
      nextImage: transitionImageA
    };
  }

  async function crossfadeToFrame(framePath) {
    const layers = getTransitionLayers();
    layers.nextImage.src = framePath;

    await new Promise(function (resolve) {
      if (layers.nextImage.complete) {
        resolve();
        return;
      }

      layers.nextImage.onload = function () {
        resolve();
      };
      layers.nextImage.onerror = function () {
        resolve();
      };
    });

    layers.nextLayer.classList.add("is-visible");
    await sleep(CROSSFADE_MS);
    layers.currentLayer.classList.remove("is-visible");
    activeTransitionLayer = activeTransitionLayer === 0 ? 1 : 0;
  }

  function getTypedLayer(element) {
    return element.querySelector(".intro-text-typed");
  }

  function getGhostLayer(element) {
    return element.querySelector(".intro-text-ghost");
  }

  function sleep(ms) {
    return new Promise(function (resolve) {
      window.setTimeout(resolve, ms);
    });
  }

  function setTypingText(element, count) {
    const fullText = element.dataset.text || "";
    const typedLayer = getTypedLayer(element);

    if (!typedLayer) return;
    typedLayer.textContent = fullText.slice(0, count);
  }

  function setFullText(element, text) {
    const ghostLayer = getGhostLayer(element);
    const typedLayer = getTypedLayer(element);

    element.dataset.text = text;

    if (ghostLayer) {
      ghostLayer.textContent = text;
    }

    if (typedLayer) {
      typedLayer.textContent = text;
    }
  }

  async function typeElement(element, speed) {
    const fullText = element.dataset.text || "";
    const typedLayer = getTypedLayer(element);

    if (!typedLayer) return;

    typedLayer.textContent = "";

    for (let i = 1; i <= fullText.length; i += 1) {
      setTypingText(element, i);
      await sleep(speed);
    }
  }

  async function runIntroWritingSequence() {
    if (typingSequenceDone) return;

    await typeElement(introTextLine1a, 42);
    await sleep(160);
    await typeElement(introTextLine1b, 28);
    await sleep(220);
    await typeElement(introTextLine2, 24);

    typingSequenceDone = true;
  }

  function setMemoryTextValue(text) {
    memoryTextElement.dataset.text = text;
    memoryTextGhost.textContent = text;
    memoryTextTyped.textContent = text;
  }

  function setMemoryAgeValue(text) {
    if (!memoryAgeElement) return;
    memoryAgeElement.textContent = text;
  }

  async function typeMemoryText(text, speed) {
    setMemoryTextValue(text);
    memoryTextTyped.textContent = "";

    for (let i = 1; i <= text.length; i += 1) {
      memoryTextTyped.textContent = text.slice(0, i);
      await sleep(speed);
    }
  }

  async function showMemoryText(index) {
    if (index < 0 || index >= memoryTexts.length) return;
    if (memoryTextTransitioning) {
      pendingMemoryTextIndex = index;
      return;
    }
    if (index === currentMemoryTextIndex) return;

    memoryTextTransitioning = true;
    pendingMemoryTextIndex = -1;

    const nextText = memoryTexts[index];
    setMemoryAgeValue(nextText.line2);

    if (currentMemoryTextIndex !== -1) {
      memoryTextElement.classList.add("is-fading");
      await sleep(180);
    }

    memoryTextElement.classList.remove("is-fading");
    await typeMemoryText(nextText.line1, 22);
    currentMemoryTextIndex = index;
    memoryTextTransitioning = false;

    if (pendingMemoryTextIndex !== -1 && pendingMemoryTextIndex !== currentMemoryTextIndex) {
      const nextIndex = pendingMemoryTextIndex;
      pendingMemoryTextIndex = -1;
      showMemoryText(nextIndex);
    }
  }

  function resetMemoryText() {
    currentMemoryTextIndex = -1;
    pendingMemoryTextIndex = -1;
    memoryTextTransitioning = false;
    memoryTextElement.classList.remove("is-fading");
    setMemoryTextValue("");
    memoryTextTyped.textContent = "";
    setMemoryAgeValue("");
  }

  function showScrollIndicator() {
    scrollIndicator.classList.add("is-visible");
  }

  function hideScrollIndicator() {
    scrollIndicator.classList.remove("is-visible");
  }

  function revealProgressAfterFirstScroll() {
    if (hasStartedMemoryScroll) return;

    hasStartedMemoryScroll = true;
    hideScrollIndicator();
  }

  function getLocalPosition(event) {
    const frameRect = introFrame.getBoundingClientRect();
    return {
      x: event.clientX - frameRect.left,
      y: event.clientY - frameRect.top
    };
  }

  function moveCursor(event) {
    const pos = getLocalPosition(event);
    hoverCursor.style.transform = `translate3d(${pos.x - 16}px, ${pos.y - 16}px, 0)`;
  }

  function showCursor() {
    hoverCursor.classList.add("is-visible");
  }

  function hideCursor() {
    hoverCursor.classList.remove("is-visible");
  }

  function setPawCursor() {
    hoverCursor.classList.remove("is-enter");
  }

  function setEnterCursor() {
    hoverCursor.classList.add("is-enter");
  }

  function isInside(event, element) {
    const rect = element.getBoundingClientRect();
    return (
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom
    );
  }

  function switchToFrameTwo() {
    currentFrame = 2;
    setFullText(introTextLine1a, "This is Coco.");
    catHitbox.classList.add("is-hidden");
    introFrame.classList.add("is-frame-2");
    hideCursor();
  }

  function getImageCenterTrackX(index) {
    const image = memoryImages[index];
    const frameWidth = introFrame.clientWidth;
    const imageCenter = image.offsetLeft + image.offsetWidth / 2;
    return frameWidth / 2 - imageCenter;
  }

  function updateProgressBar() {
    const maxIndex = memoryImages.length - 1;
    const progress = maxIndex === 0 ? 1 : currentMemoryIndex / maxIndex;
    memoryProgressFill.style.width = `${progress * 100}%`;
  }

  function updatePhotoButtonVisibility() {
    if (currentFrame === 3 && currentMemoryIndex === memoryImages.length - 1 && !memoryStepLocked && !isPhotoSequencePlaying) {
      photoButton.classList.add("is-visible");
    } else {
      photoButton.classList.remove("is-visible");
    }
  }

  function renderMemoryTrack() {
    currentTrackX += (targetTrackX - currentTrackX) * 0.16;
    memoryTrack.style.transform = `translate3d(${currentTrackX}px, -50%, 0)`;

    if (Math.abs(targetTrackX - currentTrackX) > STEP_EPSILON) {
      rafId = requestAnimationFrame(renderMemoryTrack);
    } else {
      currentTrackX = targetTrackX;
      memoryTrack.style.transform = `translate3d(${currentTrackX}px, -50%, 0)`;
      rafId = null;
      memoryStepLocked = false;
      accumulatedWheelDelta = 0;
      accumulatedTouchDelta = 0;
      updatePhotoButtonVisibility();
      showMemoryText(currentMemoryIndex);
    }
  }

  function requestTrackRender() {
    if (rafId === null) {
      rafId = requestAnimationFrame(renderMemoryTrack);
    }
  }

  function moveToMemoryIndex(index) {
    const clampedIndex = Math.max(0, Math.min(index, memoryImages.length - 1));
    if (clampedIndex === currentMemoryIndex) return;
    if (memoryStepLocked || isPhotoSequencePlaying) return;

    if (currentMemoryIndex === 0 && clampedIndex > 0) {
      revealProgressAfterFirstScroll();
    }

    currentMemoryIndex = clampedIndex;
    targetTrackX = getImageCenterTrackX(currentMemoryIndex);
    memoryStepLocked = true;
    updateProgressBar();
    updatePhotoButtonVisibility();
    requestTrackRender();
  }

  function stepMemory(direction) {
    if (currentFrame !== 3) return;
    if (memoryStepLocked || isPhotoSequencePlaying) return;

    const nextIndex = currentMemoryIndex + direction;
    if (nextIndex < 0 || nextIndex >= memoryImages.length) return;

    moveToMemoryIndex(nextIndex);
  }

  function handleWheelStep(deltaY) {
    if (currentFrame !== 3) return;
    if (memoryStepLocked || isPhotoSequencePlaying) return;

    accumulatedWheelDelta += deltaY;

    if (Math.abs(accumulatedWheelDelta) < WHEEL_STEP_THRESHOLD) return;

    if (accumulatedWheelDelta > 0) {
      accumulatedWheelDelta = 0;
      stepMemory(1);
    } else {
      accumulatedWheelDelta = 0;
      stepMemory(-1);
    }
  }

  function handleTouchStep(deltaY) {
    if (currentFrame !== 3) return;
    if (memoryStepLocked || isPhotoSequencePlaying) return;

    accumulatedTouchDelta += deltaY;

    if (Math.abs(accumulatedTouchDelta) < TOUCH_STEP_THRESHOLD) return;

    if (accumulatedTouchDelta > 0) {
      accumulatedTouchDelta = 0;
      stepMemory(1);
    } else {
      accumulatedTouchDelta = 0;
      stepMemory(-1);
    }
  }

  async function playFullScreenTransition(framePaths) {
    ensureTransitionOverlay();
    showTransitionOverlay();

    transitionImageA.src = framePaths[0];
    transitionLayerA.classList.add("is-visible");
    transitionLayerB.classList.remove("is-visible");
    activeTransitionLayer = 0;

    await sleep(FRAME_SEQUENCE_MS);

    for (let i = 1; i < framePaths.length; i += 1) {
      await crossfadeToFrame(framePaths[i]);
      await sleep(Math.max(FRAME_SEQUENCE_MS - CROSSFADE_MS, 20));
    }
  }

  async function handlePhotoButtonClick() {
    if (currentFrame !== 3) return;
    if (currentMemoryIndex !== memoryImages.length - 1) return;
    if (memoryStepLocked || isPhotoSequencePlaying) return;

    isPhotoSequencePlaying = true;
    memoryStepLocked = true;
    updatePhotoButtonVisibility();

    await playFullScreenTransition(TRANSITION_SEQUENCE_FRAMES);

    document.dispatchEvent(new CustomEvent("showLandingSection"));

    await new Promise(function (resolve) {
      requestAnimationFrame(function () {
        requestAnimationFrame(resolve);
      });
    });

    memoryScenes.style.opacity = "0";
    memoryScenes.style.pointerEvents = "none";
    hideTransitionOverlay();

    isPhotoSequencePlaying = false;
  }

  function showMemoryScenes() {
    currentFrame = 3;
    hideCursor();
    introFrame.classList.remove("is-frame-2");
    introTextStage.classList.add("is-hidden");
    memoryScenes.classList.add("is-visible");
    memoryScenes.style.opacity = "";
    memoryScenes.style.pointerEvents = "";

    firstMemoryImage.classList.remove("is-faded-in");
    resetMemoryText();

    currentMemoryIndex = 0;
    targetTrackX = getImageCenterTrackX(0);
    currentTrackX = targetTrackX;
    memoryTrack.style.transform = `translate3d(${currentTrackX}px, -50%, 0)`;
    updateProgressBar();

    hasStartedMemoryScroll = false;
    showScrollIndicator();

    accumulatedWheelDelta = 0;
    accumulatedTouchDelta = 0;
    memoryStepLocked = true;
    isPhotoSequencePlaying = false;
    updatePhotoButtonVisibility();

    requestAnimationFrame(function () {
      firstMemoryImage.classList.add("is-faded-in");

      window.setTimeout(function () {
        if (currentFrame === 3) {
          memoryStepLocked = false;
          updatePhotoButtonVisibility();
          showMemoryText(0);
        }
      }, 760);
    });
  }

  photoButton.addEventListener("click", handlePhotoButtonClick);

  introFrame.addEventListener("mousemove", function (event) {
    if (currentFrame === 1) {
      if (isInside(event, catHitbox)) {
        moveCursor(event);
        setPawCursor();
        showCursor();
      } else {
        hideCursor();
      }
      return;
    }

    if (currentFrame === 2) {
      moveCursor(event);
      setEnterCursor();
      showCursor();
      return;
    }

    hideCursor();
  });

  introFrame.addEventListener("mouseleave", function () {
    hideCursor();
  });

  introFrame.addEventListener("click", function (event) {
    if (currentFrame === 1 && isInside(event, catHitbox)) {
      switchToFrameTwo();
      return;
    }

    if (currentFrame === 2) {
      showMemoryScenes();
    }
  });

  introFrame.addEventListener(
    "wheel",
    function (event) {
      if (currentFrame !== 3) return;

      event.preventDefault();
      handleWheelStep(event.deltaY);
    },
    { passive: false }
  );

  introFrame.addEventListener(
    "touchstart",
    function (event) {
      if (currentFrame !== 3) return;
      if (event.touches.length !== 1) return;

      touchStartY = event.touches[0].clientY;
      accumulatedTouchDelta = 0;
    },
    { passive: true }
  );

  introFrame.addEventListener(
    "touchmove",
    function (event) {
      if (currentFrame !== 3) return;
      if (event.touches.length !== 1 || touchStartY === null) return;

      const currentY = event.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      touchStartY = currentY;

      handleTouchStep(deltaY);
      event.preventDefault();
    },
    { passive: false }
  );

  introFrame.addEventListener("touchend", function () {
    touchStartY = null;
    accumulatedTouchDelta = 0;
  });

  window.addEventListener("resize", function () {
    if (currentFrame === 3) {
      targetTrackX = getImageCenterTrackX(currentMemoryIndex);
      currentTrackX = targetTrackX;
      memoryTrack.style.transform = `translate3d(${currentTrackX}px, -50%, 0)`;
      updateProgressBar();
      updatePhotoButtonVisibility();
    }
  });

  /* TEMP DEBUG JUMP BUTTONS — DELETE THIS WHOLE BLOCK LATER */
  {
    const debugJumpSection1Button = document.getElementById("debug-jump-section-1");
    const debugJumpSection2Button = document.getElementById("debug-jump-section-2");
    const debugJumpSection3Button = document.getElementById("debug-jump-section-3");

    function hideIntroUi() {
      currentFrame = 0;
      introTextStage.classList.add("is-hidden");
      memoryScenes.classList.remove("is-visible");
      memoryScenes.style.opacity = "0";
      memoryScenes.style.pointerEvents = "none";
      hideCursor();
      hideTransitionOverlay();
      hideScrollIndicator();
    }

    function resetToSectionOneStart() {
      currentFrame = 1;
      introFrame.classList.remove("is-frame-2");
      introTextStage.classList.remove("is-hidden");
      memoryScenes.classList.remove("is-visible");
      memoryScenes.style.opacity = "";
      memoryScenes.style.pointerEvents = "";
      catHitbox.classList.remove("is-hidden");
      setFullText(introTextLine1a, "This is");
      setTypingText(introTextLine1a, 0);
      setTypingText(introTextLine1b, 0);
      setTypingText(introTextLine2, 0);
      typingSequenceDone = false;
      resetMemoryText();
      currentMemoryIndex = 0;
      accumulatedWheelDelta = 0;
      accumulatedTouchDelta = 0;
      memoryStepLocked = false;
      isPhotoSequencePlaying = false;
      hasStartedMemoryScroll = false;
      updatePhotoButtonVisibility();
      hideScrollIndicator();
      hideCursor();
      hideTransitionOverlay();
      runIntroWritingSequence();
    }

    function jumpToSectionTwo() {
      hideIntroUi();
      document.dispatchEvent(new CustomEvent("showLandingSection"));
    }

    function jumpToSectionThree() {
      hideIntroUi();
      document.dispatchEvent(new CustomEvent("showBrokenPhotoSection"));
    }

    if (debugJumpSection1Button) {
      debugJumpSection1Button.addEventListener("click", function (event) {
        event.stopPropagation();
        resetToSectionOneStart();
      });
    }

    if (debugJumpSection2Button) {
      debugJumpSection2Button.addEventListener("click", function (event) {
        event.stopPropagation();
        jumpToSectionTwo();
      });
    }

    if (debugJumpSection3Button) {
      debugJumpSection3Button.addEventListener("click", function (event) {
        event.stopPropagation();
        jumpToSectionThree();
      });
    }

    const debugJumpSection9 = document.getElementById("debug-jump-section-9");

    if (debugJumpSection9) {
      debugJumpSection9.addEventListener("click", function () {
        document.dispatchEvent(new CustomEvent("showNextSectionFromFullPhoto"));
      });
    }
  }
  /* END TEMP DEBUG JUMP BLOCK */

  runIntroWritingSequence();
}