export function initHeartSection() {
  const heartSection = document.getElementById("section-09-heart");
  const heartBackgroundTrack = document.getElementById("heart-background-track");
  const heartPersonSequence = document.getElementById("heart-person-sequence");
  const heartCatSequence = document.getElementById("heart-cat-sequence");
  const heartWalkingPerson = document.getElementById("heart-walking-person");
  const heartAdvanceIndicator = document.getElementById("heart-advance-indicator");
  const heartToolbar = document.getElementById("heart-toolbar");
  const heartPiece1 = document.getElementById("heart-toolbar-piece-1");
  const heartPiece2 = document.getElementById("heart-toolbar-piece-2");
  const heartPiece3 = document.getElementById("heart-toolbar-piece-3");

  if (
    !heartSection ||
    !heartBackgroundTrack ||
    !heartPersonSequence ||
    !heartCatSequence ||
    !heartWalkingPerson ||
    !heartAdvanceIndicator ||
    !heartToolbar ||
    !heartPiece1 ||
    !heartPiece2 ||
    !heartPiece3
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

  const TEXT_STAGE_1_BEFORE = "I thought remembering it made it heavier.";
  const TEXT_STAGE_1_AFTER = "But now I’m glad I remember all the good memories.";
  const TEXT_STAGE_2_BEFORE = "I tried not to think about it.";
  const TEXT_STAGE_2_AFTER = "But forgetting is not easy.\nNor does forgetting make it easier.";
  const TEXT_STAGE_3_BEFORE = "It felt like you were getting further away.";
  const TEXT_STAGE_3_AFTER = "But remembering brings you closer again.";

  const BACKGROUND_2_OVERLAY_SRC = "./assets/heart/background-2-overlay.png";
  const BACKGROUND_2_2_OVERLAY_SRC = "./assets/heart/background-2-2-overlay.png";
  const BACKGROUND_2_3_OVERLAY_SRC = "./assets/heart/background-2-3-overlay.png";

  const BACKGROUND_2_P1_SEQUENCE = [
    "./assets/heart/background-2-p1-1.png",
    "./assets/heart/background-2-p1-2.png",
    "./assets/heart/background-2-p1-3.png",
    "./assets/heart/background-2-p1-4.png"
  ];

  const BACKGROUND_2_P2_SEQUENCE = [
    "./assets/heart/background-2-p2-1.png",
    "./assets/heart/background-2-p2-2.png",
    "./assets/heart/background-2-p2-3.png",
    "./assets/heart/background-2-p2-4.png"
  ];

  const BACKGROUND_2_P3_SEQUENCE = [
    "./assets/heart/background-2-p3-1.png",
    "./assets/heart/background-2-p3-2.png",
    "./assets/heart/background-2-p3-3.png",
    "./assets/heart/background-2-p3-4.png"
  ];

  const BACKGROUND_2_STAGE_2 = "./assets/heart/background-2-2.png";
  const BACKGROUND_2_STAGE_3 = "./assets/heart/background-2-3.png";
  const BACKGROUND_2_STAGE_4 = "./assets/heart/background-2-4.png";

  let backgroundItemsCreated = false;
  let backgroundImagesReady = false;
  let backgroundOffsetX = 0;
  let backgroundMaxOffset = 0;
  let backgroundAnimationId = null;
  let walkingAnimationId = null;
  let walkingFrameIndex = 0;
  let sectionRunId = 0;

  let backgroundTwoImage = null;
  let overlayStage1 = null;
  let overlayStage2 = null;
  let overlayStage3 = null;

  let triggerStage1 = null;
  let triggerStage2 = null;
  let triggerStage3 = null;

  let dropZoneStage1 = null;
  let dropZoneStage2 = null;
  let dropZoneStage3 = null;

  let thoughtStage1Before = null;
  let thoughtStage1BeforeTyped = null;

  let thoughtStage1After = null;
  let thoughtStage1AfterTyped = null;

  let thoughtStage2Before = null;
  let thoughtStage2BeforeTyped = null;

  let thoughtStage2After = null;
  let thoughtStage2AfterTyped = null;

  let thoughtStage3Before = null;
  let thoughtStage3BeforeTyped = null;

  let thoughtStage3After = null;
  let thoughtStage3AfterTyped = null;

  let currentWalkStage = 1;
  let hasReachedTriggerPoint = false;

  let hasStartedText1Before = false;
  let hasStartedText1After = false;
  let hasStartedText2Before = false;
  let hasStartedText2After = false;
  let hasStartedText3Before = false;
  let hasStartedText3After = false;

  let pieceOnePlaced = false;
  let pieceTwoPlaced = false;
  let pieceThreePlaced = false;

  let currentPersonLeft = 240;
  const PERSON_START_LEFT = 240;

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
      .concat([
        PERSON_STANDING_SRC,
        "./assets/heart/drag-photo-piece-1.png",
        "./assets/heart/drag-photo-piece-2.png",
        "./assets/heart/drag-photo-piece-3.png",
        BACKGROUND_2_OVERLAY_SRC,
        BACKGROUND_2_2_OVERLAY_SRC,
        BACKGROUND_2_3_OVERLAY_SRC,
        BACKGROUND_2_STAGE_2,
        BACKGROUND_2_STAGE_3,
        BACKGROUND_2_STAGE_4
      ])
      .concat(BACKGROUND_2_P1_SEQUENCE)
      .concat(BACKGROUND_2_P2_SEQUENCE)
      .concat(BACKGROUND_2_P3_SEQUENCE);

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

  function hideToolbar() {
    heartToolbar.classList.remove("is-visible");
  }

  function showToolbar() {
    heartToolbar.classList.add("is-visible");
  }

  function hideToolbarIfDone() {
    if (pieceOnePlaced && pieceTwoPlaced && pieceThreePlaced) {
      hideToolbar();
    }
  }

  function createTypedText(className, text, parent) {
    const wrapper = document.createElement("div");
    wrapper.className = `${className} is-hidden`;
    wrapper.dataset.text = text;

    const ghost = document.createElement("span");
    ghost.className = `${className}-ghost`;
    ghost.textContent = text;

    const typed = document.createElement("span");
    typed.className = `${className}-typed`;
    typed.textContent = "";

    wrapper.appendChild(ghost);
    wrapper.appendChild(typed);
    parent.appendChild(wrapper);

    return { wrapper, typed };
  }

  function hideText(element) {
    if (element) {
      element.classList.add("is-hidden");
    }
  }

  function showText(element) {
    if (element) {
      element.classList.remove("is-hidden");
    }
  }

  async function typeText(wrapper, typedElement, runId) {
    if (!wrapper || !typedElement) {
      return;
    }

    const fullText = wrapper.dataset.text || "";
    typedElement.textContent = "";

    for (let i = 1; i <= fullText.length; i += 1) {
      if (runId !== sectionRunId) {
        return;
      }

      typedElement.textContent = fullText.slice(0, i);
      await sleep(22);
    }
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

    if (index === 1) {
      backgroundTwoImage = image;

      overlayStage1 = document.createElement("img");
      overlayStage1.className = "heart-background-overlay is-hidden";
      overlayStage1.src = BACKGROUND_2_OVERLAY_SRC;
      overlayStage1.alt = "";
      overlayStage1.addEventListener("dragstart", preventImageDrag);
      item.appendChild(overlayStage1);

      overlayStage2 = document.createElement("img");
      overlayStage2.className = "heart-background-overlay-second is-hidden";
      overlayStage2.src = BACKGROUND_2_2_OVERLAY_SRC;
      overlayStage2.alt = "";
      overlayStage2.addEventListener("dragstart", preventImageDrag);
      item.appendChild(overlayStage2);

      overlayStage3 = document.createElement("img");
      overlayStage3.className = "heart-background-overlay-third is-hidden";
      overlayStage3.src = BACKGROUND_2_3_OVERLAY_SRC;
      overlayStage3.alt = "";
      overlayStage3.addEventListener("dragstart", preventImageDrag);
      item.appendChild(overlayStage3);

      triggerStage1 = document.createElement("div");
      triggerStage1.className = "heart-trigger-point heart-trigger-point-stage-1";
      item.appendChild(triggerStage1);

      triggerStage2 = document.createElement("div");
      triggerStage2.className = "heart-trigger-point heart-trigger-point-stage-2";
      item.appendChild(triggerStage2);

      triggerStage3 = document.createElement("div");
      triggerStage3.className = "heart-trigger-point heart-trigger-point-stage-3";
      item.appendChild(triggerStage3);

      dropZoneStage1 = document.createElement("div");
      dropZoneStage1.className = "heart-drop-zone heart-drop-zone-stage-1";
      item.appendChild(dropZoneStage1);

      dropZoneStage2 = document.createElement("div");
      dropZoneStage2.className = "heart-drop-zone heart-drop-zone-stage-2";
      item.appendChild(dropZoneStage2);

      dropZoneStage3 = document.createElement("div");
      dropZoneStage3.className = "heart-drop-zone heart-drop-zone-stage-3";
      item.appendChild(dropZoneStage3);

      const text1Before = createTypedText("heart-thought", TEXT_STAGE_1_BEFORE, item);
      thoughtStage1Before = text1Before.wrapper;
      thoughtStage1BeforeTyped = text1Before.typed;

      const text1After = createTypedText("heart-thought-second", TEXT_STAGE_1_AFTER, item);
      thoughtStage1After = text1After.wrapper;
      thoughtStage1AfterTyped = text1After.typed;

      const text2Before = createTypedText("heart-thought-third", TEXT_STAGE_2_BEFORE, item);
      thoughtStage2Before = text2Before.wrapper;
      thoughtStage2BeforeTyped = text2Before.typed;

      const text2After = createTypedText("heart-thought-fourth", TEXT_STAGE_2_AFTER, item);
      thoughtStage2After = text2After.wrapper;
      thoughtStage2AfterTyped = text2After.typed;

      const text3Before = createTypedText("heart-thought-fifth", TEXT_STAGE_3_BEFORE, item);
      thoughtStage3Before = text3Before.wrapper;
      thoughtStage3BeforeTyped = text3Before.typed;

      const text3After = createTypedText("heart-thought-sixth", TEXT_STAGE_3_AFTER, item);
      thoughtStage3After = text3After.wrapper;
      thoughtStage3AfterTyped = text3After.typed;
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
    const images = heartBackgroundTrack.querySelectorAll(
      ".heart-background-image, .heart-background-overlay, .heart-background-overlay-second, .heart-background-overlay-third"
    );

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
    const viewportWidth = heartSection.clientWidth;
    const difference = trackWidth - viewportWidth;

    if (difference > 0) {
      backgroundMaxOffset = difference;
    } else {
      backgroundMaxOffset = 0;
    }
  }

  function setWalkingPersonLeft(leftValue) {
    currentPersonLeft = leftValue;
    heartWalkingPerson.style.left = `${leftValue}px`;
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

  function showWalkingPersonFrame(src) {
    heartWalkingPerson.src = src;
    heartWalkingPerson.classList.add("is-visible");
  }

  function getWalkingPersonRightEdge() {
    return heartWalkingPerson.getBoundingClientRect().right;
  }

  function getWalkingPersonLeftEdge() {
    return heartWalkingPerson.getBoundingClientRect().left;
  }

  function getActiveTrigger() {
    if (currentWalkStage === 1) {
      return triggerStage1;
    }

    if (currentWalkStage === 2) {
      return triggerStage2;
    }

    return triggerStage3;
  }

  function getDropZoneForPiece(pieceId) {
    if (pieceId === "heart-toolbar-piece-1") {
      return dropZoneStage1;
    }

    if (pieceId === "heart-toolbar-piece-2") {
      return dropZoneStage2;
    }

    if (pieceId === "heart-toolbar-piece-3") {
      return dropZoneStage3;
    }

    return null;
  }

  function getTriggerPointViewportX() {
    const trigger = getActiveTrigger();

    if (!trigger) {
      return Infinity;
    }

    return trigger.getBoundingClientRect().left;
  }

  function getDistanceToTrigger() {
    return getTriggerPointViewportX() - getWalkingPersonRightEdge();
  }

  async function startStage1BeforeText(runId) {
    if (hasStartedText1Before) {
      return;
    }

    hasStartedText1Before = true;
    showText(thoughtStage1Before);
    await typeText(thoughtStage1Before, thoughtStage1BeforeTyped, runId);

    if (runId === sectionRunId) {
      overlayStage1.classList.remove("is-hidden");
    }
  }

  async function startStage1AfterText(runId) {
    if (hasStartedText1After) {
      return;
    }

    hasStartedText1After = true;
    showText(thoughtStage1After);
    await typeText(thoughtStage1After, thoughtStage1AfterTyped, runId);

    if (runId === sectionRunId) {
      continueToSecondWalkStage();
    }
  }

  async function startStage2BeforeText(runId) {
    if (hasStartedText2Before) {
      return;
    }

    hasStartedText2Before = true;
    showText(thoughtStage2Before);
    await typeText(thoughtStage2Before, thoughtStage2BeforeTyped, runId);

    if (runId === sectionRunId) {
      overlayStage2.classList.remove("is-hidden");
    }
  }

  async function startStage2AfterText(runId) {
    if (hasStartedText2After) {
      return;
    }

    hasStartedText2After = true;
    showText(thoughtStage2After);
    await typeText(thoughtStage2After, thoughtStage2AfterTyped, runId);

    if (runId === sectionRunId) {
      continueToThirdWalkStage();
    }
  }

  async function startStage3BeforeText(runId) {
    if (hasStartedText3Before) {
      return;
    }

    hasStartedText3Before = true;
    showText(thoughtStage3Before);
    await typeText(thoughtStage3Before, thoughtStage3BeforeTyped, runId);

    if (runId === sectionRunId) {
      overlayStage3.classList.remove("is-hidden");
    }
  }

  async function startStage3AfterText(runId) {
    if (hasStartedText3After) {
      return;
    }

    hasStartedText3After = true;
    showText(thoughtStage3After);
    await typeText(thoughtStage3After, thoughtStage3AfterTyped, runId);

    if (runId === sectionRunId) {
      startExitWalkStage();
    }
  }

  function maybeStartTextNearTrigger(runId) {
    const distance = getDistanceToTrigger();

    if (distance > 90) {
      return;
    }

    if (currentWalkStage === 1) {
      startStage1BeforeText(runId);
      return;
    }

    if (currentWalkStage === 2) {
      startStage2BeforeText(runId);
      return;
    }

    if (currentWalkStage === 3) {
      startStage3BeforeText(runId);
    }
  }

  function startWalkingAnimation() {
    stopWalkingAnimation();
    walkingFrameIndex = 0;
    showWalkingPersonFrame(WALKING_SOURCES[walkingFrameIndex]);

    walkingAnimationId = window.setInterval(function () {
      if (hasReachedTriggerPoint && currentWalkStage !== 4) {
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
    showToolbar();
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
    let currentSpeed = 0;
    const targetSpeed = 72;
    const acceleration = 22;

    function step(timestamp) {
      if (runId !== sectionRunId) {
        stopBackgroundMovement();
        return;
      }

      if (!heartSection.classList.contains("is-visible")) {
        stopBackgroundMovement();
        return;
      }

      if (hasReachedTriggerPoint && currentWalkStage !== 4) {
        stopBackgroundMovement();
        return;
      }

      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }

      const deltaMs = timestamp - lastTimestamp;
      const deltaSeconds = deltaMs / 1000;
      lastTimestamp = timestamp;

      if (currentSpeed < targetSpeed) {
        currentSpeed += acceleration * deltaSeconds;
        if (currentSpeed > targetSpeed) {
          currentSpeed = targetSpeed;
        }
      }

      if (currentWalkStage === 4) {
        setWalkingPersonLeft(currentPersonLeft + currentSpeed * deltaSeconds);

        const personLeftEdge = getWalkingPersonLeftEdge();
        if (personLeftEdge >= heartSection.clientWidth) {
          stopBackgroundMovement();
          stopWalkingAnimation();
          heartWalkingPerson.classList.remove("is-visible");
          return;
        }

        backgroundAnimationId = requestAnimationFrame(step);
        return;
      }

      if (backgroundOffsetX < backgroundMaxOffset) {
        backgroundOffsetX += currentSpeed * deltaSeconds;

        if (backgroundOffsetX > backgroundMaxOffset) {
          backgroundOffsetX = backgroundMaxOffset;
        }

        heartBackgroundTrack.style.transform = `translate3d(${-backgroundOffsetX}px, 0, 0)`;
      } else if (currentWalkStage === 3) {
        setWalkingPersonLeft(currentPersonLeft + currentSpeed * deltaSeconds);
      }

      maybeStartTextNearTrigger(runId);
      checkTriggerEncounter();

      if (!hasReachedTriggerPoint && (backgroundMaxOffset > 0 || currentWalkStage === 3)) {
        backgroundAnimationId = requestAnimationFrame(step);
      } else {
        stopBackgroundMovement();
      }
    }

    backgroundAnimationId = requestAnimationFrame(step);
  }

  async function playFrameSequence(imageElement, frameSources, finalSource, runId) {
    for (let i = 0; i < frameSources.length; i += 1) {
      if (runId !== sectionRunId) {
        return;
      }

      imageElement.src = frameSources[i];
      await sleep(220);
    }

    if (runId !== sectionRunId) {
      return;
    }

    imageElement.src = finalSource;
  }

  function continueToSecondWalkStage() {
    currentWalkStage = 2;
    hasReachedTriggerPoint = false;
    hideAdvanceIndicator();
    setWalkingPersonLeft(PERSON_START_LEFT);
    showWalkingPersonFrame(WALKING_SOURCES[0]);
    startWalkingAnimation();
    startBackgroundMovement(sectionRunId);
  }

  function continueToThirdWalkStage() {
    currentWalkStage = 3;
    hasReachedTriggerPoint = false;
    hideAdvanceIndicator();
    setWalkingPersonLeft(PERSON_START_LEFT);
    showWalkingPersonFrame(WALKING_SOURCES[0]);
    startWalkingAnimation();
    startBackgroundMovement(sectionRunId);
  }

  function startExitWalkStage() {
    currentWalkStage = 4;
    hasReachedTriggerPoint = false;
    hideAdvanceIndicator();
    showWalkingPersonFrame(WALKING_SOURCES[0]);
    startWalkingAnimation();
    startBackgroundMovement(sectionRunId);
  }

  async function handlePieceOneSuccess() {
    if (pieceOnePlaced) {
      return;
    }

    pieceOnePlaced = true;
    heartPiece1.classList.add("is-hidden");
    hideText(thoughtStage1Before);
    overlayStage1.classList.add("is-hidden");

    const runId = sectionRunId;
    await playFrameSequence(backgroundTwoImage, BACKGROUND_2_P1_SEQUENCE, BACKGROUND_2_STAGE_2, runId);

    if (runId === sectionRunId) {
      startStage1AfterText(runId);
    }
  }

  async function handlePieceTwoSuccess() {
    if (pieceTwoPlaced) {
      return;
    }

    pieceTwoPlaced = true;
    heartPiece2.classList.add("is-hidden");
    hideText(thoughtStage2Before);
    overlayStage2.classList.add("is-hidden");

    const runId = sectionRunId;
    await playFrameSequence(backgroundTwoImage, BACKGROUND_2_P2_SEQUENCE, BACKGROUND_2_STAGE_3, runId);

    if (runId === sectionRunId) {
      startStage2AfterText(runId);
    }
  }

  async function handlePieceThreeSuccess() {
    if (pieceThreePlaced) {
      return;
    }

    pieceThreePlaced = true;
    heartPiece3.classList.add("is-hidden");
    hideText(thoughtStage3Before);
    overlayStage3.classList.add("is-hidden");
    hideToolbarIfDone();

    const runId = sectionRunId;
    await playFrameSequence(backgroundTwoImage, BACKGROUND_2_P3_SEQUENCE, BACKGROUND_2_STAGE_4, runId);

    if (runId === sectionRunId) {
      startStage3AfterText(runId);
    }
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

  function resetToolbarPiece(piece) {
    piece.style.left = "0px";
    piece.style.top = "0px";
    piece.classList.remove("is-dragging");
  }

  function isPieceInsideDropZone(piece, pieceId) {
    const dropZone = getDropZoneForPiece(pieceId);

    if (!dropZone) {
      return false;
    }

    const pieceRect = piece.getBoundingClientRect();
    const dropRect = dropZone.getBoundingClientRect();

    const pieceCenterX = pieceRect.left + pieceRect.width / 2;
    const pieceCenterY = pieceRect.top + pieceRect.height / 2;

    return (
      pieceCenterX >= dropRect.left &&
      pieceCenterX <= dropRect.right &&
      pieceCenterY >= dropRect.top &&
      pieceCenterY <= dropRect.bottom
    );
  }

  function addDragBehavior(piece) {
    let isDragging = false;
    let startPointerX = 0;
    let startPointerY = 0;
    let startLeft = 0;
    let startTop = 0;

    piece.addEventListener("dragstart", preventImageDrag);

    piece.addEventListener("pointerdown", function (event) {
      if (!heartToolbar.classList.contains("is-visible")) {
        return;
      }

      if (piece.classList.contains("is-hidden")) {
        return;
      }

      isDragging = true;
      startPointerX = event.clientX;
      startPointerY = event.clientY;
      startLeft = parseFloat(piece.style.left || "0");
      startTop = parseFloat(piece.style.top || "0");

      piece.classList.add("is-dragging");
      piece.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    piece.addEventListener("pointermove", function (event) {
      if (!isDragging) {
        return;
      }

      const deltaX = event.clientX - startPointerX;
      const deltaY = event.clientY - startPointerY;

      piece.style.left = `${startLeft + deltaX}px`;
      piece.style.top = `${startTop + deltaY}px`;
    });

    piece.addEventListener("pointerup", function (event) {
      if (!isDragging) {
        return;
      }

      isDragging = false;
      piece.classList.remove("is-dragging");
      piece.releasePointerCapture(event.pointerId);

      if (piece.id === "heart-toolbar-piece-1") {
        if (currentWalkStage === 1 && isPieceInsideDropZone(piece, piece.id)) {
          handlePieceOneSuccess();
        } else {
          resetToolbarPiece(piece);
        }
        return;
      }

      if (piece.id === "heart-toolbar-piece-2") {
        if (currentWalkStage === 2 && isPieceInsideDropZone(piece, piece.id)) {
          handlePieceTwoSuccess();
        } else {
          resetToolbarPiece(piece);
        }
        return;
      }

      if (piece.id === "heart-toolbar-piece-3") {
        if (currentWalkStage === 3 && isPieceInsideDropZone(piece, piece.id)) {
          handlePieceThreeSuccess();
        } else {
          resetToolbarPiece(piece);
        }
      }
    });

    piece.addEventListener("pointercancel", function (event) {
      if (!isDragging) {
        return;
      }

      isDragging = false;
      piece.classList.remove("is-dragging");
      piece.releasePointerCapture(event.pointerId);
      resetToolbarPiece(piece);
    });
  }

  function resetAllText() {
    hasStartedText1Before = false;
    hasStartedText1After = false;
    hasStartedText2Before = false;
    hasStartedText2After = false;
    hasStartedText3Before = false;
    hasStartedText3After = false;

    thoughtStage1BeforeTyped.textContent = "";
    thoughtStage1AfterTyped.textContent = "";
    thoughtStage2BeforeTyped.textContent = "";
    thoughtStage2AfterTyped.textContent = "";
    thoughtStage3BeforeTyped.textContent = "";
    thoughtStage3AfterTyped.textContent = "";

    hideText(thoughtStage1Before);
    hideText(thoughtStage1After);
    hideText(thoughtStage2Before);
    hideText(thoughtStage2After);
    hideText(thoughtStage3Before);
    hideText(thoughtStage3After);
  }

  async function runHeartSequence() {
    sectionRunId += 1;
    const runId = sectionRunId;

    currentWalkStage = 1;
    hasReachedTriggerPoint = false;
    pieceOnePlaced = false;
    pieceTwoPlaced = false;
    pieceThreePlaced = false;

    hideAdvanceIndicator();
    hideToolbar();
    hidePersonSequence();
    hideCatSequence();

    stopWalkingAnimation();
    stopBackgroundMovement();
    resetBackgroundPosition();
    setWalkingPersonLeft(PERSON_START_LEFT);
    resetAllText();

    overlayStage1.classList.add("is-hidden");
    overlayStage2.classList.add("is-hidden");
    overlayStage3.classList.add("is-hidden");

    resetToolbarPiece(heartPiece1);
    resetToolbarPiece(heartPiece2);
    resetToolbarPiece(heartPiece3);

    heartPiece1.classList.remove("is-hidden");
    heartPiece2.classList.remove("is-hidden");
    heartPiece3.classList.remove("is-hidden");

    backgroundTwoImage.src = BACKGROUND_SOURCES[1];

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

  addDragBehavior(heartPiece1);
  addDragBehavior(heartPiece2);
  addDragBehavior(heartPiece3);

  document.addEventListener("showNextSectionFromFullPhoto", function () {
    revealHeartSection();
  });

  preloadAssets();
}