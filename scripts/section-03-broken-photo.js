export function initBrokenPhotoSection() {
    const brokenPhotoSection = document.getElementById("section-03-broken-photo");
    const brokenPhotoHeart = document.getElementById("broken-photo-heart");
    const brokenPhotoStage = document.getElementById("broken-photo-stage");
  
    if (!brokenPhotoSection || !brokenPhotoHeart || !brokenPhotoStage) {
      return;
    }
  
    const BROKEN_HEART_SRC = "./assets/broken-photo/heart-broken.png";
    const FULL_PHOTO_SRC = "./assets/broken-photo/full-photo.png";
    const FULL_PHOTO_HEART_SRC = "./assets/broken-photo/full-photo-heart.png";
    const EXIT_DARKEN_MS = 220;
  
    const pieceStates = {
      1: { collected: false },
      2: { collected: false },
      3: { collected: false },
      4: { collected: false },
      5: { collected: false }
    };
  
    const PIECE_CONFIGS = [
      {
        index: 1,
        unfixedSrc: "./assets/broken-photo/unfixed-photo-piece-1.png",
        fixedSrc: "./assets/broken-photo/fixed-photo-piece-1.png",
        interactionSrc: "./assets/broken-photo/piece-1-interaction.svg",
        pieceClass: "broken-photo-piece-1",
        alt: "Broken photo piece 1",
        openEvent: null
      },
      {
        index: 2,
        unfixedSrc: "./assets/broken-photo/unfixed-photo-piece-2.png",
        fixedSrc: "./assets/broken-photo/fixed-photo-piece-2.png",
        interactionSrc: "./assets/broken-photo/piece-2-interaction.svg",
        pieceClass: "broken-photo-piece-2",
        alt: "Broken photo piece 2",
        openEvent: "showP2CombingSection"
      },
      {
        index: 3,
        unfixedSrc: "./assets/broken-photo/unfixed-photo-piece-3.png",
        fixedSrc: "./assets/broken-photo/fixed-photo-piece-3.png",
        interactionSrc: "./assets/broken-photo/piece-3-interaction.svg",
        pieceClass: "broken-photo-piece-3",
        alt: "Broken photo piece 3",
        openEvent: "showP3AccompanySection"
      },
      {
        index: 4,
        unfixedSrc: "./assets/broken-photo/unfixed-photo-piece-4.png",
        fixedSrc: "./assets/broken-photo/fixed-photo-piece-4.png",
        interactionSrc: "./assets/broken-photo/piece-4-interaction.svg",
        pieceClass: "broken-photo-piece-4",
        alt: "Broken photo piece 4",
        openEvent: null
      },
      {
        index: 5,
        unfixedSrc: "./assets/broken-photo/unfixed-photo-piece-5.png",
        fixedSrc: "./assets/broken-photo/fixed-photo-piece-5.png",
        interactionSrc: "./assets/broken-photo/piece-5-interaction.svg",
        pieceClass: "broken-photo-piece-5",
        alt: "Broken photo piece 5",
        openEvent: null
      }
    ];
  
    let isVisible = false;
    let hasStartedSequence = false;
    let isLeaving = false;
    let brokenHeartImage = null;
    let piecesGroup = null;
    let pieceElements = [];
    let exitOverlay = null;
    let fullGroup = null;
  
    function sleep(ms) {
      return new Promise(function (resolve) {
        window.setTimeout(resolve, ms);
      });
    }
  
    async function fetchSvgMarkup(src) {
      const response = await fetch(src);
      return response.text();
    }
  
    function preloadAssets() {
      const imageSources = [brokenPhotoHeart.src, BROKEN_HEART_SRC, FULL_PHOTO_SRC, FULL_PHOTO_HEART_SRC];
  
      PIECE_CONFIGS.forEach(function (piece) {
        imageSources.push(piece.unfixedSrc);
        imageSources.push(piece.fixedSrc);
  
        if (piece.interactionSrc) {
          fetch(piece.interactionSrc).catch(function () {
            return null;
          });
        }
      });
  
      imageSources.forEach(function (src) {
        const image = new Image();
        image.src = src;
      });
    }
  
    function ensureExitOverlay() {
      if (exitOverlay) return exitOverlay;
  
      exitOverlay = document.createElement("div");
      exitOverlay.className = "broken-photo-exit-overlay";
      brokenPhotoStage.appendChild(exitOverlay);
  
      return exitOverlay;
    }
  
    function ensureBrokenHeartImage() {
      if (brokenHeartImage) return brokenHeartImage;
  
      brokenHeartImage = document.createElement("img");
      brokenHeartImage.className = "broken-photo-heart-broken";
      brokenHeartImage.src = BROKEN_HEART_SRC;
      brokenHeartImage.alt = "Broken heart";
      brokenPhotoHeart.parentNode.appendChild(brokenHeartImage);
  
      return brokenHeartImage;
    }
  
    function ensurePiecesGroup() {
      if (piecesGroup) return piecesGroup;
  
      piecesGroup = document.createElement("div");
      piecesGroup.className = "broken-photo-pieces-group";
      brokenPhotoStage.appendChild(piecesGroup);
  
      return piecesGroup;
    }
  
    function ensureFullGroup() {
        if (fullGroup) return fullGroup;
    
        fullGroup = document.createElement("div");
        fullGroup.className = "broken-photo-full-group";
    
        const fullPhoto = document.createElement("img");
        fullPhoto.className = "broken-photo-full-photo";
        fullPhoto.src = FULL_PHOTO_SRC;
        fullPhoto.alt = "Full photo";
    
        const heartLayer = document.createElement("div");
        heartLayer.className = "broken-photo-full-heart-layer";
    
        const fullHeart = document.createElement("img");
        fullHeart.className = "broken-photo-full-heart";
        fullHeart.src = FULL_PHOTO_HEART_SRC;
        fullHeart.alt = "Full photo heart";
    
        const heartHit = document.createElement("div");
        heartHit.className = "broken-photo-full-heart-hit";
    
        let idleCueTimer = null;
    
        function clearIdleCue() {
          heartLayer.classList.remove("has-idle-cue");
    
          if (idleCueTimer) {
            window.clearTimeout(idleCueTimer);
            idleCueTimer = null;
          }
        }
    
        function startIdleCueTimer() {
          clearIdleCue();
    
          idleCueTimer = window.setTimeout(function () {
            if (!heartLayer.classList.contains("is-hovering")) {
              heartLayer.classList.add("has-idle-cue");
            }
          }, 5000);
        }
    
        heartHit.addEventListener("mouseenter", function () {
          clearIdleCue();
          heartLayer.classList.add("is-hovering");
        });
    
        heartHit.addEventListener("mouseleave", function () {
          heartLayer.classList.remove("is-hovering");
          startIdleCueTimer();
        });
    
        heartHit.addEventListener("click", function () {
          clearIdleCue();
          document.dispatchEvent(new CustomEvent("showNextSectionFromFullPhoto"));
        });
    
        heartLayer.appendChild(fullHeart);
        heartLayer.appendChild(heartHit);
        fullGroup.appendChild(fullPhoto);
        fullGroup.appendChild(heartLayer);
        brokenPhotoStage.appendChild(fullGroup);
    
        fullGroup.startIdleCueTimer = startIdleCueTimer;
        fullGroup.clearIdleCue = clearIdleCue;
    
        return fullGroup;
    }
  
    function extractSvgTag(svgMarkup) {
      const container = document.createElement("div");
      container.innerHTML = svgMarkup.trim();
      return container.querySelector("svg");
    }
  
    function getVisualSourceForPiece(pieceConfig) {
      return pieceStates[pieceConfig.index].collected ? pieceConfig.fixedSrc : pieceConfig.unfixedSrc;
    }
  
    function syncPieceHitLayer(piece) {
      const visual = piece.querySelector(".broken-photo-piece-visual");
      const hitLayer = piece.querySelector(".broken-photo-piece-hit");
  
      if (!visual || !hitLayer) return;
  
      hitLayer.style.width = `${visual.offsetWidth}px`;
      hitLayer.style.height = `${visual.offsetHeight}px`;
    }
  
    async function createPieceElement(pieceConfig) {
      const piece = document.createElement("div");
      piece.className = `broken-photo-piece ${pieceConfig.pieceClass} is-interactive`;
  
      const visual = document.createElement("img");
      visual.className = "broken-photo-piece-visual";
      visual.src = getVisualSourceForPiece(pieceConfig);
      visual.alt = pieceConfig.alt;
      piece.appendChild(visual);
  
      const hitLayer = document.createElement("div");
      hitLayer.className = "broken-photo-piece-hit";
      piece.appendChild(hitLayer);
  
      try {
        const svgMarkup = await fetchSvgMarkup(pieceConfig.interactionSrc);
        const svgElement = extractSvgTag(svgMarkup);
  
        if (svgElement) {
          svgElement.setAttribute("preserveAspectRatio", "none");
          hitLayer.appendChild(svgElement);
        }
      } catch (error) {
        console.error(`Failed to load interaction SVG for ${pieceConfig.pieceClass}:`, error);
      }
  
      ensurePiecesGroup().appendChild(piece);
  
      if (visual.complete) {
        syncPieceHitLayer(piece);
      } else {
        visual.addEventListener("load", function () {
          syncPieceHitLayer(piece);
        });
      }
  
      return piece;
    }
  
    async function ensurePieceElements() {
      if (pieceElements.length > 0) return pieceElements;
  
      pieceElements = [];
  
      for (let i = 0; i < PIECE_CONFIGS.length; i += 1) {
        const piece = await createPieceElement(PIECE_CONFIGS[i]);
        pieceElements.push(piece);
      }
  
      return pieceElements;
    }
  
    function syncAllPieceHitLayers() {
      for (let i = 0; i < pieceElements.length; i += 1) {
        syncPieceHitLayer(pieceElements[i]);
      }
    }
  
    function refreshPieceVisuals() {
      for (let i = 0; i < pieceElements.length; i += 1) {
        const pieceConfig = PIECE_CONFIGS[i];
        const piece = pieceElements[i];
        const visual = piece.querySelector(".broken-photo-piece-visual");
  
        if (visual) {
          visual.src = getVisualSourceForPiece(pieceConfig);
        }
  
        if (pieceStates[pieceConfig.index].collected) {
          piece.classList.remove("is-active");
          piece.classList.remove("is-interactive");
        } else {
          piece.classList.add("is-interactive");
        }
      }
  
      requestAnimationFrame(function () {
        syncAllPieceHitLayers();
      });
    }
  
    function areAllPiecesCollected() {
      return Object.values(pieceStates).every(function (pieceState) {
        return pieceState.collected;
      });
    }
  
    async function showResolvedPhotoState() {
      ensureFullGroup();
      ensurePiecesGroup().classList.add("is-hidden");
  
      for (let i = 0; i < pieceElements.length; i += 1) {
        pieceElements[i].classList.remove("is-active");
      }
  
      await new Promise(function (resolve) {
        requestAnimationFrame(resolve);
      });
  
      fullGroup.classList.add("is-visible");

      if (typeof fullGroup.startIdleCueTimer === "function") {
        fullGroup.startIdleCueTimer();
      }
    }
  
    async function handleInteractivePieceClick(pieceConfig) {
      if (isLeaving) return;
      if (pieceStates[pieceConfig.index].collected) return;
  
      pieceStates[pieceConfig.index].collected = true;
      refreshPieceVisuals();
  
      if (pieceConfig.openEvent) {
        isLeaving = true;
  
        const overlay = ensureExitOverlay();
        overlay.classList.add("is-visible");
  
        await sleep(EXIT_DARKEN_MS);
  
        document.dispatchEvent(new CustomEvent(pieceConfig.openEvent));
  
        await new Promise(function (resolve) {
          requestAnimationFrame(function () {
            requestAnimationFrame(resolve);
          });
        });
  
        brokenPhotoSection.classList.add("is-complete");
        overlay.classList.remove("is-visible");
        return;
      }
  
      if (areAllPiecesCollected()) {
        await showResolvedPhotoState();
      }
    }
  
    function addInteractivePieceBehavior(piece, pieceConfig) {
      const interactiveShapes = piece.querySelectorAll(
        ".broken-photo-piece-hit svg path, .broken-photo-piece-hit svg polygon, .broken-photo-piece-hit svg rect, .broken-photo-piece-hit svg circle, .broken-photo-piece-hit svg ellipse"
      );
  
      if (interactiveShapes.length === 0) return;
  
      interactiveShapes.forEach(function (shape) {
        shape.addEventListener("mouseenter", function () {
          if (!pieceStates[pieceConfig.index].collected) {
            piece.classList.add("is-active");
          }
        });
  
        shape.addEventListener("mouseleave", function () {
          piece.classList.remove("is-active");
        });
  
        shape.addEventListener("click", function () {
          handleInteractivePieceClick(pieceConfig);
        });
      });
    }
  
    function showHubState() {
      const brokenHeart = ensureBrokenHeartImage();
  
      brokenPhotoHeart.classList.remove("is-visible");
      brokenPhotoHeart.classList.add("is-hidden");
      brokenHeart.classList.remove("is-visible");
      brokenHeart.classList.add("is-hidden");
  
      if (fullGroup) {
        fullGroup.classList.remove("is-visible");
  
        if (typeof fullGroup.clearIdleCue === "function") {
          fullGroup.clearIdleCue();
        }
      }
  
      ensurePiecesGroup().classList.remove("is-hidden");
      refreshPieceVisuals();
  
      for (let i = 0; i < pieceElements.length; i += 1) {
        pieceElements[i].classList.add("is-visible");
      }
  
      syncAllPieceHitLayers();
  
      if (areAllPiecesCollected()) {
        showResolvedPhotoState();
      }
    }
  
    async function runBrokenPhotoSequence() {
      if (hasStartedSequence) return;
  
      hasStartedSequence = true;
  
      brokenPhotoHeart.classList.add("is-visible");
      await sleep(950);
  
      const brokenHeart = ensureBrokenHeartImage();
      brokenPhotoHeart.classList.add("is-hidden");
      brokenHeart.classList.add("is-visible");
  
      await sleep(1000);
  
      const pieces = await ensurePieceElements();
      brokenHeart.classList.add("is-hidden");
  
      for (let i = 0; i < pieces.length; i += 1) {
        pieces[i].classList.add("is-visible");
      }
  
      syncAllPieceHitLayers();
  
      for (let i = 0; i < PIECE_CONFIGS.length; i += 1) {
        addInteractivePieceBehavior(pieces[i], PIECE_CONFIGS[i]);
      }
    }
  
    function revealBrokenPhotoSection() {
      if (isVisible) return;
  
      isVisible = true;
      isLeaving = false;
      brokenPhotoSection.classList.remove("is-complete");
      brokenPhotoSection.classList.add("is-visible");
      runBrokenPhotoSequence();
    }
  
    async function revealBrokenPhotoHub() {
      isVisible = true;
      isLeaving = false;
      brokenPhotoSection.classList.remove("is-complete");
      brokenPhotoSection.classList.add("is-visible");
  
      if (pieceElements.length === 0) {
        await ensurePieceElements();
  
        for (let i = 0; i < PIECE_CONFIGS.length; i += 1) {
          addInteractivePieceBehavior(pieceElements[i], PIECE_CONFIGS[i]);
        }
      }
  
      showHubState();
    }
  
    window.addEventListener("resize", function () {
      syncAllPieceHitLayers();
    });

    document.addEventListener("showBrokenPhotoSection", function () {
      revealBrokenPhotoSection();
    });
  
    document.addEventListener("returnToBrokenPhotoHub", function () {
      revealBrokenPhotoHub();
    });
  
    preloadAssets();
  }