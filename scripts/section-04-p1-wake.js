export function initP1WakeSection() {
    const p1Section = document.getElementById("section-04-p1-wake");
    const p1Stage = document.getElementById("p1-wake-stage");
    const p1Image = document.getElementById("p1-wake-image");
    const p1ClickHit = document.getElementById("p1-click-hit");
  
    if (!p1Section || !p1Stage || !p1Image || !p1ClickHit) {
      return;
    }
  
    const SCENE_1_SRC = "./assets/p1-wake/scene-1.png";
    const SCENE_2_SRC = "./assets/p1-wake/scene-2.png";
    const SCENE_3_SRC = "./assets/p1-wake/scene-3.png";
    const SCENE_4_SRC = "./assets/p1-wake/scene-4.png";
    const PHOTO_PIECE_SRC = "./assets/p1-wake/photo-piece.png";
    const INTERIOR_FILTER_SRC = "./assets/shared/memory-pieces-interior-filter.png";
  
    let clickIndicator = null;
    let hoverCursor = null;
    let hoverCursorImage = null;
    let photoPieceImage = null;
    let filterImage = null;
    let hasClickedCat = false;
    let isSequencePlaying = false;
  
    function sleep(ms) {
      return new Promise(function (resolve) {
        window.setTimeout(resolve, ms);
      });
    }
  
    function preloadAssets() {
      const sources = [
        SCENE_1_SRC,
        SCENE_2_SRC,
        SCENE_3_SRC,
        SCENE_4_SRC,
        PHOTO_PIECE_SRC,
        INTERIOR_FILTER_SRC,
        "./assets/shared/objects/mouse-icon-paw-dark-32.png"
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
      if (!p1Image.complete || !p1Image.naturalWidth || !p1Image.naturalHeight) {
        return null;
      }
  
      const stageWidth = p1Stage.clientWidth;
      const stageHeight = p1Stage.clientHeight;
      const renderedWidth = stageWidth;
      const renderedHeight = renderedWidth * (p1Image.naturalHeight / p1Image.naturalWidth);
  
      let imageTop = 0;
  
      if (renderedHeight > stageHeight) {
        p1Stage.classList.add("is-tall-image");
        imageTop = 0;
      } else {
        p1Stage.classList.remove("is-tall-image");
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
  
    function updateClickHitPosition() {
      setElementPositionFromImageBox(p1ClickHit, 0.30, 0.42);
    }
  
    function updatePhotoPiecePosition() {
        setElementPositionFromImageBox(photoPieceImage, 0.30, 0.50);
      }
  
    function updateFilterLayout() {
      const filter = ensureFilterImage();
      const imageBox = getImageBox();
  
      if (!filter || !imageBox) {
        return;
      }
  
      filter.style.left = `${imageBox.left}px`;
      filter.style.top = imageBox.height > p1Stage.clientHeight ? "0px" : "50%";
      filter.style.width = `${imageBox.width}px`;
      filter.style.height = "auto";
    }
  
    function updateLayoutForCurrentImage() {
      updateFilterLayout();
      updateClickHitPosition();
      updatePhotoPiecePosition();
    }
  
    function ensureHoverCursor() {
      if (hoverCursor) {
        return hoverCursor;
      }
  
      hoverCursor = document.createElement("div");
      hoverCursor.className = "p1-hover-cursor";
  
      hoverCursorImage = document.createElement("img");
      hoverCursorImage.src = "./assets/shared/objects/mouse-icon-paw-dark-32.png";
      hoverCursorImage.alt = "";
  
      hoverCursor.appendChild(hoverCursorImage);
      p1Section.appendChild(hoverCursor);
  
      return hoverCursor;
    }
  
    function moveCursor(event) {
      const rect = p1Section.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
  
      ensureHoverCursor().style.transform = `translate3d(${x - 16}px, ${y - 16}px, 0)`;
    }
  
    function showCursor() {
      ensureHoverCursor().classList.add("is-visible");
      p1Section.classList.add("is-interactive");
    }
  
    function hideCursor() {
      if (hoverCursor) {
        hoverCursor.classList.remove("is-visible");
      }
      p1Section.classList.remove("is-interactive");
    }
  
    function ensureClickIndicator() {
      if (clickIndicator) {
        return clickIndicator;
      }
  
      clickIndicator = document.createElement("div");
      clickIndicator.className = "ui-indicator p1-click-indicator";
      clickIndicator.textContent = "Click cat";
      p1Stage.appendChild(clickIndicator);
  
      return clickIndicator;
    }
  
    function showClickIndicator() {
      ensureClickIndicator().classList.add("is-visible");
    }
  
    function hideClickIndicator() {
      if (clickIndicator) {
        clickIndicator.classList.remove("is-visible");
      }
    }
  
    function ensureFilterImage() {
      if (filterImage) {
        return filterImage;
      }
  
      filterImage = document.createElement("img");
      filterImage.className = "p1-wake-filter";
      filterImage.src = INTERIOR_FILTER_SRC;
      filterImage.alt = "";
      filterImage.addEventListener("dragstart", preventImageDrag);
      p1Image.parentNode.appendChild(filterImage);
  
      return filterImage;
    }
  
    function ensurePhotoPieceImage() {
      if (photoPieceImage) {
        return photoPieceImage;
      }
  
      photoPieceImage = document.createElement("img");
      photoPieceImage.className = "p1-photo-piece";
      photoPieceImage.src = PHOTO_PIECE_SRC;
      photoPieceImage.alt = "Photo piece";
      photoPieceImage.addEventListener("dragstart", preventImageDrag);
  
      photoPieceImage.addEventListener("mouseenter", function (event) {
        moveCursor(event);
        showCursor();
      });
  
      photoPieceImage.addEventListener("mouseleave", function () {
        hideCursor();
      });
  
      photoPieceImage.addEventListener("mousemove", moveCursor);
  
      photoPieceImage.addEventListener("click", async function () {
        hideCursor();
        document.dispatchEvent(new Event("returnToBrokenPhotoHub"));
  
        await new Promise(function (resolve) {
          requestAnimationFrame(function () {
            requestAnimationFrame(resolve);
          });
        });
  
        p1Section.classList.add("is-complete");
      });
  
      p1Image.parentNode.appendChild(photoPieceImage);
      return photoPieceImage;
    }
  
    async function setScene(src) {
      p1Image.src = src;
  
      await new Promise(function (resolve) {
        if (p1Image.complete) {
          resolve();
          return;
        }
  
        p1Image.addEventListener("load", resolve, { once: true });
      });
  
      updateLayoutForCurrentImage();
    }
  
    async function handleCatClick() {
      if (hasClickedCat || isSequencePlaying) {
        return;
      }
  
      hasClickedCat = true;
      isSequencePlaying = true;
  
      hideCursor();
      hideClickIndicator();
      p1ClickHit.classList.add("is-hidden");
  
      await setScene(SCENE_2_SRC);
      await sleep(660);
      await setScene(SCENE_3_SRC);
      await sleep(220);
      await setScene(SCENE_4_SRC);
      
      const piece = ensurePhotoPieceImage();
      updatePhotoPiecePosition();
      piece.classList.add("is-visible");
  
      isSequencePlaying = false;
    }
  
    async function resetSection() {
      hasClickedCat = false;
      isSequencePlaying = false;
      hideCursor();
      hideClickIndicator();
  
      await setScene(SCENE_1_SRC);
  
      ensureFilterImage();
      ensurePhotoPieceImage();
      updateLayoutForCurrentImage();
  
      p1ClickHit.classList.remove("is-hidden");
      p1ClickHit.classList.add("is-visible");
  
      if (photoPieceImage) {
        photoPieceImage.classList.remove("is-visible");
      }
  
      showClickIndicator();
    }
  
    async function revealP1WakeSection() {
      await resetSection();
      p1Section.classList.remove("is-complete");
      p1Section.classList.add("is-visible");
    }
  
    p1Image.addEventListener("dragstart", preventImageDrag);
    p1ClickHit.addEventListener("click", handleCatClick);
  
    p1ClickHit.addEventListener("mouseenter", function (event) {
      if (hasClickedCat || isSequencePlaying) {
        return;
      }
  
      moveCursor(event);
      showCursor();
    });
  
    p1ClickHit.addEventListener("mouseleave", function () {
      hideCursor();
    });
  
    p1ClickHit.addEventListener("mousemove", moveCursor);
  
    document.addEventListener("showP1WakeSection", function () {
      revealP1WakeSection();
    });
  
    window.addEventListener("resize", function () {
      updateLayoutForCurrentImage();
    });
  
    preloadAssets();
  }