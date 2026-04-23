export function initGlobalNavigation() {
    const homeButton = document.getElementById("home-button");
  
    if (!homeButton) {
      return;
    }
  
    const sectionIds = [
      "section-01-intro",
      "section-02-landing",
      "section-03-broken-photo",
      "section-05-p2-combing",
      "section-06-p3-accompany",
      "section-07-nail-cutting",
      "section-09-heart",
      "section-10-ending"
    ];
  
    function hideSection(section) {
      if (!section) {
        return;
      }
  
      section.classList.remove("is-visible");
      section.classList.remove("is-enter-ready");
      section.classList.remove("is-about-open");
      section.classList.remove("is-fading");
  
      section.style.opacity = "";
      section.style.pointerEvents = "";
      section.style.visibility = "";
    }
  
    function hideAllSectionsExceptLanding() {
      for (let i = 0; i < sectionIds.length; i += 1) {
        const section = document.getElementById(sectionIds[i]);
  
        if (!section) {
          continue;
        }
  
        if (section.id === "section-02-landing") {
          continue;
        }
  
        hideSection(section);
      }
    }
  
    homeButton.addEventListener("click", function () {
      hideAllSectionsExceptLanding();
      document.dispatchEvent(new CustomEvent("replayLandingFromHome"));
    });
  }