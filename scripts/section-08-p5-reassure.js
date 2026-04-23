export function initP5ReassureSection() {
    const p5Section = document.getElementById("section-08-p5-reassure");
    const p5Stage = document.getElementById("p5-reassure-stage");
    const p5Image = document.getElementById("p5-reassure-image");
    const p5ApproachHit = document.getElementById("p5-approach-hit");
  
    if (!p5Section || !p5Stage || !p5Image || !p5ApproachHit) {
      return;
    }
  
    const SCENE_1_SRC = "./assets/p5-reassure/scene-1.png";
    const SCENE_2_SRC = "./assets/p5-reassure/scene-2.png";
    const PHOTO_PIECE_SRC = "./assets/p5-reassure/photo-piece.png";
    const INTERIOR_FILTER_SRC = "./assets/shared/memory-pieces-interior-filter.png";
  
    let hoverCursor = null;
    let hoverCursorImage = null;
    let approachIndicator = null;
    let photoPieceImage = null;
    let filterImage = null;
    let hasApproached = false;
  
    function sleep(ms) {
      return new Promise(function (resolve) {
        window.setTimeout(resolve, ms);
      });
    }
  
    function preloadAssets() {
      const sources = [
        SCENE_1_SRC,
        SCENE_2_SRC,
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
      if (!p5Image.complete || !p5Image.naturalWidth || !p5Image.naturalHeight) {
        return null;
      }
  
      const stageWidth = p5Stage.clientWidth;
      const stageHeight = p5Stage.clientHeight;
      const renderedWidth = stageWidth;
      const renderedHeight = renderedWidth * (p5Image.naturalHeight / p5Image.naturalWidth);
  
      let imageTop = 0;
  
      if (renderedHeight > stageHeight) {
        p5Stage.classList.add("is-tall-image");
        imageTop = 0;
      } else {
        p5Stage.classList.remove("is-tall-image");
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
  
    function updatePhotoPiecePosition() {
        setElementPositionFromImageBox(photoPieceImage, 0.30, 0.80);
    }
  
    function ensureHoverCursor() {
      if (hoverCursor) {
        return hoverCursor;
      }
  
      hoverCursor = document.createElement("div");
      hoverCursor.className = "p5-hover-cursor";
  
      hoverCursorImage = document.createElement("img");
      hoverCursorImage.src = "./assets/shared/objects/mouse-icon-paw-dark-32.png";
      hoverCursorImage.alt = "";
  
      hoverCursor.appendChild(hoverCursorImage);
      p5Section.appendChild(hoverCursor);
  
      return hoverCursor;
    }
  
    function moveCursor(event) {
      const rect = p5Section.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
  
      ensureHoverCursor().style.transform = `translate3d(${x - 16}px, ${y - 16}px, 0)`;
    }
  
    function showCursor() {
      ensureHoverCursor().classList.add("is-visible");
      p5Section.classList.add("is-interactive");
    }
  
    function hideCursor() {
      if (hoverCursor) {
        hoverCursor.classList.remove("is-visible");
      }
      p5Section.classList.remove("is-interactive");
    }
  
    function ensureApproachIndicator() {
      if (approachIndicator) {
        return approachIndicator;
      }
  
      approachIndicator = document.createElement("div");
      approachIndicator.className = "ui-indicator p5-approach-indicator";
      approachIndicator.textContent = "Click to approach";
      p5Stage.appendChild(approachIndicator);
  
      return approachIndicator;
    }
  
    function showApproachIndicator() {
      ensureApproachIndicator().classList.add("is-visible");
    }
  
    function hideApproachIndicator() {
      if (approachIndicator) {
        approachIndicator.classList.remove("is-visible");
      }
    }
  
    function ensureFilterImage() {
      if (filterImage) {
        return filterImage;
      }
  
      filterImage = document.createElement("img");
      filterImage.className = "p5-reassure-filter";
      filterImage.src = INTERIOR_FILTER_SRC;
      filterImage.alt = "";
      filterImage.addEventListener("dragstart", preventImageDrag);
  
      p5Image.parentNode.appendChild(filterImage);
  
      return filterImage;
    }
  
    function updateFilterLayout() {
      const filter = ensureFilterImage();
      const imageBox = getImageBox();
  
      if (!filter || !imageBox) {
        return;
      }
  
      filter.style.left = `${imageBox.left}px`;
      filter.style.top = imageBox.height > p5Stage.clientHeight ? "0px" : "50%";
      filter.style.width = `${imageBox.width}px`;
      filter.style.height = "auto";
    }
  
    function ensurePhotoPieceImage() {
      if (photoPieceImage) {
        return photoPieceImage;
      }
  
      photoPieceImage = document.createElement("img");
      photoPieceImage.className = "p5-photo-piece";
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
  
        p5Section.classList.add("is-complete");
      });
  
      p5Image.parentNode.appendChild(photoPieceImage);
      return photoPieceImage;
    }
  
    async function setScene(src) {
      p5Image.src = src;
  
      await new Promise(function (resolve) {
        if (p5Image.complete) {
          resolve();
          return;
        }
  
        p5Image.addEventListener("load", resolve, { once: true });
      });
  
      updateLayoutForCurrentImage();
    }
  
    function updateLayoutForCurrentImage() {
      updateFilterLayout();
      updatePhotoPiecePosition();
    }
  
    async function handleApproachClick() {
      if (hasApproached) {
        return;
      }
  
      hasApproached = true;
      hideCursor();
      hideApproachIndicator();
      p5ApproachHit.classList.remove("is-active");
  
      await setScene(SCENE_2_SRC);
  
      const piece = ensurePhotoPieceImage();
      updatePhotoPiecePosition();
      piece.classList.add("is-visible");
    }
  
    async function resetSection() {
      hasApproached = false;
      hideCursor();
      hideApproachIndicator();
  
      await setScene(SCENE_1_SRC);
  
      ensureFilterImage();
      updateLayoutForCurrentImage();
  
      p5ApproachHit.classList.add("is-active");
  
      if (photoPieceImage) {
        photoPieceImage.classList.remove("is-visible");
      }
  
      showApproachIndicator();
    }
  
    async function revealP5ReassureSection() {
      await resetSection();
      p5Section.classList.remove("is-complete");
      p5Section.classList.add("is-visible");
    }
  
    p5Image.addEventListener("dragstart", preventImageDrag);
    p5ApproachHit.addEventListener("click", handleApproachClick);
  
    p5ApproachHit.addEventListener("mouseenter", function (event) {
      if (hasApproached) {
        return;
      }
  
      moveCursor(event);
      showCursor();
    });
  
    p5ApproachHit.addEventListener("mouseleave", function () {
      hideCursor();
    });
  
    p5ApproachHit.addEventListener("mousemove", moveCursor);
  
    document.addEventListener("showP5ReassureSection", function () {
      revealP5ReassureSection();
    });
  
    window.addEventListener("resize", function () {
      updateLayoutForCurrentImage();
    });
  
    preloadAssets();
  }