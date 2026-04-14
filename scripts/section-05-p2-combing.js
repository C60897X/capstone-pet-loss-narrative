export function initP2CombingSection() {
    const p2CombingSection = document.getElementById("section-05-p2-combing");
    const p2CombingImage = document.getElementById("p2-combing-image");
    const p2DragZone = document.getElementById("p2-drag-zone");
  
    if (!p2CombingSection || !p2CombingImage || !p2DragZone) {
      return;
    }
  
    const BEFORE_COMB_SRC = "./assets/p2-combing/before-comb-cat.png";
    const COMBING_CAT_SRC = "./assets/p2-combing/combing-cat.png";
    const COMB_SRC = "./assets/p2-combing/comb.png";
    const PHOTO_PIECE_SRC = "./assets/p2-combing/photo-piece.png";
  
    let isVisible = false;
    let interactionStarted = false;
    let interactionComplete = false;
    let isDragging = false;
    let dragDistance = 0;
    let lastPointerX = 0;
    let dragIndicator = null;
    let combImage = null;
    let darkenOverlay = null;
    let photoPieceImage = null;
  
    function sleep(ms) {
      return new Promise(function (resolve) {
        window.setTimeout(resolve, ms);
      });
    }
  
    function preloadAssets() {
      const sources = [p2CombingImage.src, p2DragZone.src, COMB_SRC, COMBING_CAT_SRC, PHOTO_PIECE_SRC];
      sources.forEach(function (src) {
        const image = new Image();
        image.src = src;
      });
    }
  
    function preventImageDrag(event) {
      event.preventDefault();
    }
  
    function ensureDragIndicator() {
      if (dragIndicator) return dragIndicator;
      dragIndicator = document.createElement("div");
      dragIndicator.id = "p2-drag-indicator";
      dragIndicator.className = "ui-indicator p2-drag-indicator";
      dragIndicator.textContent = "Drag to pet";
      p2CombingImage.parentNode.appendChild(dragIndicator);
      return dragIndicator;
    }
  
    function updateIndicatorText(text) {
      const indicator = ensureDragIndicator();
      indicator.textContent = text;
      return indicator;
    }
  
    function ensureCombImage() {
      if (combImage) return combImage;
      combImage = document.createElement("img");
      combImage.id = "p2-comb";
      combImage.className = "p2-comb";
      combImage.src = COMB_SRC;
      combImage.alt = "Comb";
      p2CombingImage.parentNode.appendChild(combImage);
      combImage.addEventListener("dragstart", preventImageDrag);
      return combImage;
    }
  
    function ensureDarkenOverlay() {
      if (darkenOverlay) return darkenOverlay;
      darkenOverlay = document.createElement("div");
      darkenOverlay.className = "p2-darken-overlay";
      p2CombingImage.parentNode.appendChild(darkenOverlay);
      return darkenOverlay;
    }
  
    function ensurePhotoPieceImage() {
      if (photoPieceImage) return photoPieceImage;
  
      photoPieceImage = document.createElement("img");
      photoPieceImage.className = "p2-photo-piece";
      photoPieceImage.src = PHOTO_PIECE_SRC;
      photoPieceImage.alt = "Photo piece";
      p2CombingImage.parentNode.appendChild(photoPieceImage);
  
      photoPieceImage.addEventListener("dragstart", preventImageDrag);
  
      photoPieceImage.addEventListener("mouseenter", function () {
        const indicator = updateIndicatorText("Retrieve the photo piece");
        indicator.classList.add("is-visible");
      });
  
      photoPieceImage.addEventListener("mouseleave", function () {
        if (dragIndicator) {
          dragIndicator.classList.remove("is-visible");
        }
      });
  
      photoPieceImage.addEventListener("click", async function () {
        document.dispatchEvent(new Event("returnToBrokenPhotoHub"));
  
        await new Promise(function (resolve) {
          requestAnimationFrame(function () {
            requestAnimationFrame(resolve);
          });
        });
  
        p2CombingSection.classList.add("is-complete");
      });
  
      return photoPieceImage;
    }
  
    async function showInteractionUi() {
      if (interactionStarted) return;
      interactionStarted = true;
      await sleep(450);
      p2DragZone.classList.add("is-visible");
      updateIndicatorText("Drag to pet").classList.add("is-visible");
    }
  
    async function completeDragInteraction() {
      if (interactionComplete) return;
  
      interactionComplete = true;
      isDragging = false;
      p2DragZone.classList.add("is-hidden");
  
      if (dragIndicator) {
        dragIndicator.classList.remove("is-visible");
      }
  
      p2CombingImage.src = COMBING_CAT_SRC;
  
      const comb = ensureCombImage();
      comb.classList.remove("is-hidden");
      comb.classList.add("is-visible");
      await sleep(120);
      comb.classList.add("is-animating");
  
      await new Promise(function (resolve) {
        comb.addEventListener("animationend", resolve, { once: true });
      });
  
      comb.classList.add("is-hidden");
  
      ensureDarkenOverlay().classList.add("is-visible");
      ensurePhotoPieceImage().classList.add("is-visible");
    }
  
    function handlePointerDown(event) {
      if (interactionComplete) return;
      isDragging = true;
      lastPointerX = event.clientX;
    }
  
    function handlePointerMove(event) {
      if (!isDragging || interactionComplete) return;
  
      const deltaX = event.clientX - lastPointerX;
      lastPointerX = event.clientX;
  
      if (deltaX > 0) {
        dragDistance += deltaX;
      }
  
      if (dragDistance >= 100) {
        completeDragInteraction();
      }
    }
  
    function handlePointerUp() {
      isDragging = false;
    }

    function resetP2CombingUI() {
      if (dragIndicator) {
        dragIndicator.classList.remove("is-visible");
      }
    
      if (combImage) {
        combImage.classList.remove("is-visible");
        combImage.classList.remove("is-animating");
        combImage.classList.add("is-hidden");
      }
    
      if (darkenOverlay) {
        darkenOverlay.classList.remove("is-visible");
      }
    
      if (photoPieceImage) {
        photoPieceImage.classList.remove("is-visible");
      }
    
      p2DragZone.classList.remove("is-hidden");
      p2DragZone.classList.remove("is-visible");
    }
  
    function revealP2CombingSection() {
        resetP2CombingUI();
        isVisible = true;
        interactionStarted = false;
        interactionComplete = false;
        isDragging = false;
        dragDistance = 0;
        p2CombingImage.src = BEFORE_COMB_SRC;
        p2CombingSection.classList.remove("is-complete");
        p2CombingSection.classList.add("is-visible");
        showInteractionUi();
      }
  
    p2CombingImage.addEventListener("dragstart", preventImageDrag);
    p2DragZone.addEventListener("dragstart", preventImageDrag);
    p2DragZone.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  
    document.addEventListener("showP2CombingSection", function () {
      revealP2CombingSection();
    });

    document.addEventListener("replayLandingFromHome", function () {
      resetP2CombingUI();
    });
  
    preloadAssets();
  }