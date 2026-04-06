document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const items = document.querySelectorAll(".nav-links li");
  const indicator = document.querySelector(".nav-indicator");
  const navLinks = document.querySelector(".nav-links");
  const slider = document.querySelector(".mega-slider");
  const megaMenu = document.querySelector(".mega-menu");
  const header = document.querySelector("#header");

  // Mega menu hover
  if (items.length && indicator && navLinks && slider && megaMenu) {
    items.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        const index = parseInt(item.dataset.menu, 10);
        const itemRect = item.getBoundingClientRect();
        const navRect = navLinks.getBoundingClientRect();
        
        indicator.style.transition = 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), width 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease';
        indicator.style.width = `${itemRect.width}px`;
        indicator.style.transform = `translateX(${itemRect.left - navRect.left}px)`;
        indicator.style.opacity = '1';

        slider.style.transform = `translateX(-${index * 100}vw)`;
        megaMenu.classList.add("is-open");
      });
    });

    const closeMegaMenu = () => {
      megaMenu.classList.remove("is-open");
      indicator.style.opacity = '0';
    };
    if (header) header.addEventListener("mouseleave", closeMegaMenu);
    megaMenu.addEventListener("mouseleave", closeMegaMenu);
    megaMenu.addEventListener("mouseenter", () =>
      megaMenu.classList.add("is-open"),
    );

    // Close Mega Menu clicking outside
    document.addEventListener("click", (e) => {
      if (megaMenu.classList.contains("is-open")) {
        if (!megaMenu.contains(e.target) && !header.contains(e.target)) {
          closeMegaMenu();
        }
      }
    });

    // Mobile click wrapper to open
    items.forEach((item) => {
      item.addEventListener("click", (e) => {
        if (window.innerWidth <= 768) {
           e.preventDefault();
           const index = parseInt(item.dataset.menu, 10);
           slider.style.transform = `translateX(-${index * 100}vw)`;
           megaMenu.classList.add("is-open");
        }
      });
    });
  }

  // Flow buttons
  const mainBtn = document.querySelector(".flow-btn.main");
  const flowContainer = document.querySelector(".project-flow");
  if (mainBtn && flowContainer) {
    mainBtn.addEventListener("click", () => {
      mainBtn.classList.add("hidden");
      flowContainer.classList.add("active");
    });
  }

  const optionButtons = document.querySelectorAll(".flow-btn.opt");
  const projectSections = document.querySelectorAll(".project-detail");

  optionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.type;
      const targetId = `project-${type}`;

      projectSections.forEach((section) => {
        section.classList.remove("active");
      });

      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add("active");

        // Lazy-init the Innovation Lab when Experiences section is shown
        if (type === "experiences" && targetSection.dataset.labReady !== "true") {
          targetSection.dataset.labReady = "true";
          // Wait for CSS transition to finish before init (0.6s transition)
          setTimeout(() => {
            if (typeof window.initEmbeddedLab === "function") {
              window.initEmbeddedLab();
            }
          }, 650);
        }
      }
    });
  });
});

// ═══════════════════════════════════════════════════
//  MOBILE DRAWER — Navegación con burbujas + slide
// ═══════════════════════════════════════════════════

(function () {
  const hamburgerBtn  = document.getElementById("hamburgerBtn");
  const mobileDrawer  = document.getElementById("mobileDrawer");
  const drawerOverlay = document.getElementById("drawerOverlay");
  const bubbles       = document.querySelectorAll(".bubble");

  if (!hamburgerBtn || !mobileDrawer) return;

  let currentSection = 0;
  let isAnimating = false;

  function openDrawer() {
    mobileDrawer.classList.add("is-open");
    hamburgerBtn.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    mobileDrawer.classList.remove("is-open");
    hamburgerBtn.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(function() {
      if (currentSection !== 0) {
        var curr  = document.querySelector('.drawer-section[data-section="' + currentSection + '"]');
        var first = document.querySelector('.drawer-section[data-section="0"]');
        if (curr && first) {
          curr.classList.remove("active");
          curr.style.cssText = "";
          curr.scrollTop = 0;
          first.classList.add("active");
          first.style.cssText = "";
          bubbles.forEach(function(b) { b.classList.remove("active"); });
          var b0 = document.querySelector('.bubble[data-section="0"]');
          if (b0) b0.classList.add("active");
          currentSection = 0;
        }
      }
    }, 450);
  }

  hamburgerBtn.addEventListener("click", function() {
    mobileDrawer.classList.contains("is-open") ? closeDrawer() : openDrawer();
  });

  drawerOverlay.addEventListener("click", closeDrawer);

  document.querySelectorAll(".drawer-link").forEach(function(link) {
    link.addEventListener("click", function() { setTimeout(closeDrawer, 120); });
  });

  function switchSection(newIndex) {
    if (newIndex === currentSection || isAnimating) return;
    isAnimating = true;

    var goingDown = newIndex > currentSection;
    var currentEl = document.querySelector('.drawer-section[data-section="' + currentSection + '"]');
    var nextEl    = document.querySelector('.drawer-section[data-section="' + newIndex + '"]');

    if (!currentEl || !nextEl) { isAnimating = false; return; }

    nextEl.style.transition    = "none";
    nextEl.style.transform     = goingDown ? "translateY(100%)" : "translateY(-100%)";
    nextEl.style.opacity       = "0";
    nextEl.style.pointerEvents = "none";
    nextEl.classList.remove("active");
    void nextEl.offsetHeight;

    nextEl.style.transition    = "";
    currentEl.style.transition = "";

    currentEl.style.transform     = goingDown ? "translateY(-100%)" : "translateY(100%)";
    currentEl.style.opacity       = "0";
    currentEl.style.pointerEvents = "none";

    nextEl.style.transform     = "translateY(0)";
    nextEl.style.opacity       = "1";
    nextEl.style.pointerEvents = "auto";

    bubbles.forEach(function(b) { b.classList.remove("active"); });
    var activeBubble = document.querySelector('.bubble[data-section="' + newIndex + '"]');
    if (activeBubble) activeBubble.classList.add("active");

    setTimeout(function() {
      currentEl.classList.remove("active");
      currentEl.style.cssText = "";
      currentEl.scrollTop = 0;
      nextEl.classList.add("active");
      nextEl.style.cssText = "";
      currentSection = newIndex;
      isAnimating = false;
    }, 440);
  }

  bubbles.forEach(function(bubble) {
    bubble.addEventListener("click", function() {
      switchSection(parseInt(bubble.dataset.section, 10));
    });
  });

})();
// HASTA AQUI TODO ESTA CORRECTO
// Esto es codigo para web aplications
// mokup de telefono interactivo

const colorDots = document.querySelectorAll(".color-dot");
const phoneScreen = document.querySelector(".phone-screen");

if (colorDots.length && phoneScreen) {
  colorDots.forEach((dot) => {
    dot.style.setProperty("--c", dot.dataset.color);

    dot.addEventListener("click", () => {
      phoneScreen.style.background = dot.dataset.color;
    });
  });
}

// AQUI EMPIEZA BUSSINESS SOFTWARE// BUSINESS SOFTWARE – MODULAR REAL
const core = document.getElementById("softwareCore");
const buttons = document.querySelectorAll(".module-btn");

const modules = {
  sales: `
    <div class="software-module sales" data-module="sales">
      <h4>Sales</h4>
      <div class="metric">$124,500</div>
      <div class="line-chart">
        <span style="--v:40%"></span>
        <span style="--v:65%"></span>
        <span style="--v:55%"></span>
        <span style="--v:80%"></span>
        <span style="--v:95%"></span>
      </div>
    </div>
  `,

  security: `
    <div class="software-module security" data-module="security">
      <h4>Security</h4>
      <div class="security-bars">
        <div>
          <small>Encryption</small>
          <div class="bar"><span style="width:100%"></span></div>
        </div>
        <div>
          <small>System Health</small>
          <div class="bar"><span style="width:99%"></span></div>
        </div>
      </div>
    </div>
  `,

  analytics: `
    <div class="software-module analytics" data-module="analytics">
      <h4>Analytics</h4>
      <div class="radial">
        <div class="circle" style="--p:72%">
          <span>72%</span>
          <small>Engagement</small>
        </div>
      </div>
    </div>
  `,

  automation: `
    <div class="software-module automation" data-module="automation">
      <h4>Automation</h4>
      <div class="automation-flow">
        <span>Trigger</span>
        <span class="dot"></span>
        <span>Rule</span>
        <span class="dot"></span>
        <span>Action</span>
      </div>
    </div>
  `,

  inventory: `
    <div class="software-module inventory" data-module="inventory">
      <h4>Inventory</h4>
      <ul class="inventory-list">
        <li><span>Item A</span><strong>124</strong></li>
        <li><span>Item B</span><strong>58</strong></li>
        <li><span>Item C</span><strong>210</strong></li>
        <li><span>Item D</span><strong>50</strong></li>
        <li><span>Item E</span><strong>317</strong></li>
        <li><span>Item F</span><strong>594</strong></li>
      </ul>
    </div>
  `,
};

if (core && buttons.length) {
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.module;
      const existing = core.querySelector(`[data-module="${type}"]`);

      if (existing) {
        existing.style.opacity = "0";
        existing.style.transform = "translateY(20px) scale(.95)";
        setTimeout(() => existing.remove(), 300);
        btn.classList.remove("active");
      } else {
        core.insertAdjacentHTML("beforeend", modules[type]);
        btn.classList.add("active");
      }
    });
  });
}

const moduleState = {
  sales: false,
  security: false,
  analytics: false,
  automation: false,
  inventory: false,
};

let demoRunning = false;
let userInteracted = false;

function toggleModule(type, force = null) {
  const isActive = force !== null ? force : !moduleState[type];
  const existing = core.querySelector(`[data-module="${type}"]`);

  if (isActive && !existing) {
    core.insertAdjacentHTML("beforeend", modules[type]);
    moduleState[type] = true;

    document
      .querySelector(`.module-btn[data-module="${type}"]`)
      ?.classList.add("active");
  } else if (!isActive && existing) {
    existing.remove();
    moduleState[type] = false;

    document
      .querySelector(`.module-btn[data-module="${type}"]`)
      ?.classList.remove("active");
  }
}

function startDemo() {
  demoRunning = true;

  const demoSequence = [
    "sales",
    "security",
    "analytics",
    "automation",
    "inventory",
  ];

  demoSequence.forEach((mod, i) => {
    setTimeout(() => {
      if (!demoRunning || userInteracted) return;
      toggleModule(mod, true);
    }, i * 900);
  });
}

if (core) {
  setTimeout(() => {
    if (!userInteracted) {
      startDemo();
    }
  }, 2500);

  document.querySelectorAll(".module-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      userInteracted = true;
      demoRunning = false;
      toggleModule(btn.dataset.module);
    });
  });
}

// AQUI COMIENZA EXPERIENCES DIGITALES
const codens = document.getElementById("codens");

function callCodens() {
  codens.classList.toggle("active");
}

// ESTO YA ES DE LOS OTROS INDEX
//
const startBtn = document.getElementById("startBuilder");
const showcase = document.querySelector(".websites-showcase");
const builderFlow = document.getElementById("builderFlow");
const slides = document.querySelectorAll(".question-slide");
const progressFill = document.getElementById("progressFill");
const stepIndicator = document.getElementById("stepIndicator");
const historyContainer = document.getElementById("selectionHistory");

let currentStep = 0;
const totalSteps = slides.length;
let projectData = new Array(totalSteps).fill(null);

// START FLOW
if (startBtn && showcase && builderFlow) {
  startBtn.addEventListener("click", () => {
    showcase.style.display = "none";
    builderFlow.classList.add("active");
    updateProgress();
  });
}// OPTIONS CLICK
document.querySelectorAll(".flow-option").forEach((option) => {
  option.addEventListener("click", (e) => {
    projectData[currentStep] = e.target.innerText;

    if (historyContainer) renderHistory();
    updateProgress();

    if (currentStep < totalSteps - 1) {
      nextStep();
    }
  });
});

// BACK BUTTONS
document.querySelectorAll(".back-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep > 0) {
      // Quitar slide actual
      if (slides[currentStep]) {
        slides[currentStep].classList.remove("active");
        slides[currentStep].classList.remove("exit-left");
      }

      // Limpiar respuesta actual
      projectData[currentStep] = null;

      currentStep--;

      // Limpiar posibles clases residuales
      if (slides[currentStep]) {
        slides[currentStep].classList.remove("exit-left");
        slides[currentStep].classList.add("active");
      }

      if (historyContainer) renderHistory();
      updateProgress();
    }
  });
});

function nextStep() {
  if (currentStep < totalSteps - 1 && slides[currentStep] && slides[currentStep+1]) {
    slides[currentStep].classList.add("exit-left");
    slides[currentStep].classList.remove("active");

    currentStep++;

    slides[currentStep].classList.remove("exit-left");
    slides[currentStep].classList.add("active");

    updateProgress();
  }
}

function updateProgress() {
  let progressPercent;

  // Si todas las preguntas están respondidas
  if (projectData.every((item) => item !== null)) {
    progressPercent = 100;
  } else {
    progressPercent = (currentStep / totalSteps) * 100;
  }

  if (progressFill) progressFill.style.width = progressPercent + "%";

  if (projectData.every((item) => item !== null)) {
    if (progressFill) progressFill.classList.add("complete");

    if (questionContainer) {
      questionContainer.style.opacity = "0";
      questionContainer.style.pointerEvents = "none";
    }

    if (builderComplete) builderComplete.classList.add("active");
  } else {
    if (progressFill) progressFill.classList.remove("complete");
    if (builderComplete) builderComplete.classList.remove("active");

    if (questionContainer) {
      questionContainer.style.opacity = "1";
      questionContainer.style.pointerEvents = "auto";
    }
  }

  if (stepIndicator) stepIndicator.innerText = `Step ${currentStep + 1} of ${totalSteps}`;
}

function renderHistory() {
  if (!historyContainer) return;
  historyContainer.innerHTML = "";
  projectData.forEach((item) => {
    if (item) {
      const span = document.createElement("span");
      span.classList.add("history-item");
      const shortText = item.split(" ")[0]; // First word only
      span.innerText = shortText;
      span.dataset.short = shortText;
      span.dataset.full = item;
      span.title = "Click to view full text";
      
      span.addEventListener("click", () => {
        const isCurrentlyExpanded = span.classList.contains("expanded");
        
        // Collapse all others first
        Array.from(historyContainer.children).forEach((child) => {
          if (child.classList.contains("expanded")) {
            child.classList.remove("expanded");
            child.innerText = child.dataset.short;
          }
        });

        // Toggle the clicked one
        if (!isCurrentlyExpanded) {
          span.classList.add("expanded");
          span.innerText = span.dataset.full;
        }
      });
      historyContainer.appendChild(span);
    }
  });
}

const builderComplete = document.getElementById("builderComplete");
const questionContainer = document.querySelector(".question-container");

const goToBuilderBtn = document.getElementById("goToBuilder");
const questionFlow = document.getElementById("builderFlow");
const visualBuilderPanelElement = document.getElementById("visualBuilder");

if (goToBuilderBtn) {
  goToBuilderBtn.addEventListener("click", () => {
    if (questionFlow) questionFlow.classList.remove("active");
    if (visualBuilderPanelElement) {
      visualBuilderPanelElement.style.display = "block";
      visualBuilderPanelElement.scrollIntoView({ behavior: "smooth" });
    }
  });
}

const previewArea = document.getElementById("previewArea");
let builderState = {
  menu: { type: "Top", size: "small" },
  style: { text: "on", icons: "on", iconSize: "medium" },
  effects: { hover: "none", slide: "off" },
  description: "",
};

// Builder description block
const builderOptions = document.querySelectorAll(".builder-option");
if (builderOptions.length && previewArea) {
  builderOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.section;
      const newSection = document.createElement("div");
      newSection.classList.add("preview-block");
      newSection.innerText = type + " Section";
      previewArea.appendChild(newSection);
    });
  });
}

// ─── DRAWER / DROPDOWN TOGGLE ─────────────────────────────────────────────
if (previewArea) {
  previewArea.addEventListener("click", (e) => {
    const btn = e.target.closest(".pv-burger");
    if (!btn) return;
    const mode = btn.closest(".preview-mode");
    if (!mode) return;

    if (btn.classList.contains("pv-burger-top")) {
      // Top: toggle dropdown panel
      mode.classList.toggle("dropdown-open");
    } else {
      // Left / Right: toggle drawer
      mode.classList.toggle("drawer-open");
    }
  });

  // Close on overlay click
  previewArea.addEventListener("click", (e) => {
    if (e.target.classList.contains("pv-drawer-overlay")) {
      const mode = e.target.closest(".preview-mode");
      if (mode) mode.classList.remove("drawer-open");
    }
  });
}

// ─── SLIDE INDICATOR (pill that glides between items) ─────────────────────
function initSlideIndicator(container) {
  if (!container) return;
  const items = Array.from(container.querySelectorAll(".pv-menu-item"));
  if (!items.length) return;

  // Create pill element
  let pill = container.querySelector(".slide-pill");
  if (!pill) {
    pill = document.createElement("div");
    pill.className = "slide-pill";
    pill.style.left = "0px";
    pill.style.top = "0px";
    pill.style.transformOrigin = "top left";
    container.appendChild(pill);
  }

  // Position pill over a specific item (no transition on first set)
  function setPill(item, animate) {
    const cr = container.getBoundingClientRect();
    const ir = item.getBoundingClientRect();
    const scrollX = container.scrollLeft || 0;
    const scrollY = container.scrollTop || 0;
    
    pill.style.transition = animate ? "transform 0.28s ease, width 0.28s ease, height 0.28s ease" : "none";
    pill.style.transform = `translate(${ir.left - cr.left + scrollX}px, ${ir.top - cr.top + scrollY}px)`;
    pill.style.width  = ir.width  + "px";
    pill.style.height = ir.height + "px";
  }

  // Always active on Home initially
  const firstActive = items.find(i => i.classList.contains("is-active")) || items[0];
  if (firstActive) {
    setPill(firstActive, false);
  }

  items.forEach(item => {
    item.addEventListener("mouseenter", () => setPill(item, true));
  });

  container.addEventListener("mouseleave", () => {
    if (firstActive) setPill(firstActive, true);
  });
}

function setupAllSlideIndicators() {
  if (!previewArea) return;
  previewArea.querySelectorAll(".pv-top-dropdown, .pv-drawer, .pv-bottom-menu")
    .forEach(initSlideIndicator);
}

// Run after DOM ready
setupAllSlideIndicators();


const structureBlocks = document.querySelectorAll(".structure-block");
const leftArrow = document.querySelector(".arrow.left");
const rightArrow = document.querySelector(".arrow.right");
const structureTitle = document.querySelector(".structure-header h3");

let currentStructureIndex = 0;
const structureTitles = ["Menu", "Style", "Effects"];

function resetBlock(block) {
  if (!block) return;
  const groups = block.querySelectorAll(".option-group");
  groups.forEach((group, index) => {
    group.style.display = "flex"; // All groups visible in new design
  });
}

function updateStructureView() {
  if (!structureBlocks.length || !structureTitle) return;
  structureBlocks.forEach((block, index) => {
    if (index === currentStructureIndex) {
      block.style.display = "flex";
      block.classList.add("active");
      resetBlock(block);
    } else {
      block.style.display = "none";
      block.classList.remove("active");
    }
  });

  structureTitle.innerText = structureTitles[currentStructureIndex];
  if (leftArrow) leftArrow.style.opacity = currentStructureIndex === 0 ? "0.3" : "1";
  if (rightArrow) rightArrow.style.opacity = currentStructureIndex === structureBlocks.length - 1 ? "0.3" : "1";
}

if (rightArrow) {
  rightArrow.addEventListener("click", () => {
    if (currentStructureIndex < structureBlocks.length - 1) {
      currentStructureIndex++;
      updateStructureView();
    }
  });
}

if (leftArrow) {
  leftArrow.addEventListener("click", () => {
    if (currentStructureIndex > 0) {
      currentStructureIndex--;
      updateStructureView();
    }
  });
}

// Apply classes to the ACTIVE preview-mode element (so CSS selectors like .preview-mode.menu-text-off work)
function applyClasses() {
  if (!previewArea) return;

  const allModes = previewArea.querySelectorAll(".preview-mode");
  const stateClasses = [
    "menu-size-small", "menu-size-medium", "menu-size-large",
    "menu-text-off", "menu-icons-off",
    "menu-icon-size-small", "menu-icon-size-medium", "menu-icon-size-large",
    "hover-none", "hover-underline", "hover-lift", "hover-glow",
    "slide-on"
  ];

  // Remove all state classes from all modes
  allModes.forEach(mode => {
    stateClasses.forEach(cls => mode.classList.remove(cls));
  });

  // Apply classes to ALL modes (so switching menu type keeps the style)
  const classes = [];
  if (builderState.menu.size) classes.push(`menu-size-${builderState.menu.size}`);
  if (builderState.style.text === "off") classes.push("menu-text-off");
  if (builderState.style.icons === "off") classes.push("menu-icons-off");
  if (builderState.style.iconSize) classes.push(`menu-icon-size-${builderState.style.iconSize}`);
  if (builderState.effects.hover) classes.push(`hover-${builderState.effects.hover}`);
  if (builderState.effects.slide === "on") classes.push("slide-on");

  allModes.forEach(mode => {
    classes.forEach(cls => mode.classList.add(cls));
  });
}

structureBlocks.forEach((block, blockIndex) => {
  const groups = block.querySelectorAll(".option-group");
  groups.forEach((group) => {
    const options = group.querySelectorAll(".mini-option");
    options.forEach((option) => {
      option.addEventListener("click", () => {
        // Only toggle exact group active state
        options.forEach((btn) => btn.classList.remove("active"));
        option.classList.add("active");

        const valueStr = option.innerText.trim();

        if (blockIndex === 0) { // MENU
          if (valueStr === "Top" || valueStr === "Left Sidebar" || valueStr === "Right Sidebar" || valueStr === "Bottom") {
             if (previewArea) {
               previewArea.querySelectorAll(".preview-mode").forEach(el => el.classList.remove("active"));
               if (valueStr === "Top") previewArea.querySelector(".preview-top").classList.add("active");
               if (valueStr === "Left Sidebar") previewArea.querySelector(".preview-left").classList.add("active");
               if (valueStr === "Right Sidebar") previewArea.querySelector(".preview-right").classList.add("active");
               if (valueStr === "Bottom") previewArea.querySelector(".preview-bottom").classList.add("active");
             }
             builderState.menu.type = valueStr;
          } else if (["Small", "Medium", "Large"].includes(valueStr)) { // Size
             builderState.menu.size = valueStr.toLowerCase();
          }
        } 
        else if (blockIndex === 1) { // STYLE
          // id is on .option-inline which is option's direct parent
          const groupId = option.parentElement ? option.parentElement.id : "";
          if (valueStr === "On" || valueStr === "Off") {
            if (groupId === "menuTextToggleGroup") {
              builderState.style.text = valueStr.toLowerCase();
            } else if (groupId === "menuIconsGroup") {
              builderState.style.icons = valueStr.toLowerCase();
            }
          } else if (["Small", "Medium", "Large"].includes(valueStr)) { // Icon Size
            builderState.style.iconSize = valueStr.toLowerCase();
          }
        }
        else if (blockIndex === 2) { // EFFECTS
          if (["None", "Underline", "Lift", "Glow"].includes(valueStr)) { // Hover Style
            builderState.effects.hover = valueStr.toLowerCase();
          } else if (valueStr === "On" || valueStr === "Off") { // Slide Indicator
            builderState.effects.slide = valueStr.toLowerCase();
          }
        }

        applyClasses();
        checkBuilderValidity();
      });
    });
  });
});

updateStructureView();

// Color Pickers logic
// Advanced Color Pickers logic (Hex + Alpha -> RGBA)
function hexToRgba(hex, alphaPercent) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  const a = (alphaPercent / 100).toFixed(2);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function setupAdvancedColorPicker(baseId, cssVariable, callback) {
  const swatcher = document.getElementById(baseId);
  const hexInput = document.getElementById(baseId + "Hex");
  const alphaSlider = document.getElementById(baseId + "Alpha");
  const alphaLabel = document.getElementById(baseId + "AlphaText");

  if (!swatcher || !hexInput || !alphaSlider || !alphaLabel) return;

  if (!swatcher || !hexInput || !alphaSlider || !previewArea) return;

  function updateColor() {
    try {
      let hex = hexInput.value.trim();
      if (!hex.startsWith("#")) hex = "#" + hex;
      
      // Fallback if completely invalid format
      if (!/^#[0-9A-Fa-f]{6}$/.test(hex) && !/^#[0-9A-Fa-f]{3}$/.test(hex)) {
        hex = swatcher.value;
      }

      const alphaVal = alphaSlider.value;
      if (alphaLabel) alphaLabel.textContent = alphaVal + "%";
      
      // Expand 3-char to 6-char hex for native swatcher
      let fullHex = hex;
      if (fullHex.length === 4) {
        fullHex = "#" + fullHex[1]+fullHex[1] + fullHex[2]+fullHex[2] + fullHex[3]+fullHex[3];
      }
      swatcher.value = fullHex;
      
      // Compute final RGBA
      const rgba = hexToRgba(fullHex, alphaVal);
      
      // Update Slider track visually
      if (alphaSlider) alphaSlider.style.background = `linear-gradient(to right, ${fullHex}40 0%, ${fullHex} ${alphaVal}%, rgba(255,255,255,0.05) ${alphaVal}%)`;
      
      // Update swatch wrapper background to visually show transparency
      if (swatcher.parentElement) swatcher.parentElement.style.background = `linear-gradient(${rgba}, ${rgba}), repeating-conic-gradient(#333 0% 25%, #111 0% 50%) 50% / 10px 10px`;
      
      if (previewArea) previewArea.style.setProperty(cssVariable, rgba);
      if (callback) callback(rgba);
      if (typeof checkBuilderValidity === 'function') checkBuilderValidity();
    } catch (err) {
      console.warn("Advanced color picker sync issue:", err);
    }
  }

  swatcher.addEventListener("input", (e) => {
    hexInput.value = e.target.value;
    updateColor();
  });

  hexInput.addEventListener("input", () => {
    const val = hexInput.value;
    if (val.length >= 4 && val.startsWith("#") && /^#[0-9A-Fa-f]{3,6}$/.test(val)) {
        updateColor();
    }
  });
  
  hexInput.addEventListener("blur", updateColor); 
  alphaSlider.addEventListener("input", updateColor);

  updateColor();
}

setupAdvancedColorPicker("menuBgColorPicker", "--menu-bg", (val) => builderState.menu.bgColor = val);
setupAdvancedColorPicker("menuLabelColorPicker", "--menu-color", (val) => builderState.style.textColor = val);
setupAdvancedColorPicker("menuIconColorPicker", "--icon-color", (val) => builderState.style.iconColor = val);
setupAdvancedColorPicker("menuHoverColorPicker", "--menu-hover-color", (val) => builderState.effects.hoverColor = val);


const doneBtn = document.getElementById("doneBtn");
const descriptionInput = document.getElementById("descriptionInput");

function checkBuilderValidity() {
  const hasDescription = descriptionInput ? descriptionInput.value.trim().length > 10 : false;
  
  if (doneBtn) {
    if (hasDescription || builderState.menu.type) {
      doneBtn.disabled = false;
      doneBtn.classList.add("enabled");
    } else {
      doneBtn.disabled = true;
      doneBtn.classList.remove("enabled");
    }
  }
}

if (descriptionInput) {
  descriptionInput.addEventListener("input", () => {
    builderState.description = descriptionInput.value.trim();
    checkBuilderValidity();
  });
}

const requestForm = document.getElementById("requestForm");
const visualBuilderPanel = document.getElementById("visualBuilder");

if (doneBtn) {
  doneBtn.addEventListener("click", () => {
    if (doneBtn.disabled) return;
    if (visualBuilderPanel) visualBuilderPanel.style.display = "none";
    if (requestForm) requestForm.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const isAdult = document.getElementById("isAdult");
const acceptTerms = document.getElementById("acceptTerms");
const submitBtn = document.getElementById("submitBtn");

function validateForm() {
  if (!submitBtn) return;
  const emailValid = userEmail ? userEmail.value.trim().length > 2 : false;
  const nameValid = userName ? userName.value.trim().length > 1 : false;
  const termsAccepted = acceptTerms ? acceptTerms.checked : false;

  if (emailValid && nameValid && termsAccepted) {
    submitBtn.disabled = false;
    submitBtn.classList.add("active");
  } else {
    submitBtn.disabled = true;
    submitBtn.classList.remove("active");
  }
}

if (userName && userEmail && acceptTerms) {
  [userName, userEmail, acceptTerms].forEach((el) => {
    if (el) {
      el.addEventListener("input", validateForm);
      el.addEventListener("change", validateForm);
    }
  });
}

const successScreen = document.getElementById("successScreen");

if (submitBtn) {
  submitBtn.addEventListener("click", () => {
    if (submitBtn.disabled) return;
    if (requestForm) requestForm.style.display = "none";
    if (successScreen) successScreen.style.display = "block";
    console.log("FINAL DATA:", {
      builderState,
      name: userName ? userName.value : "",
      email: userEmail ? userEmail.value : "",
    });
  });
}

// Mouse tracking for slide indicator
if (previewArea) {
  const menus = previewArea.querySelectorAll('.pv-menu, .pv-drawer, .pv-bottom-menu');
  menus.forEach(menu => {
    menu.addEventListener('mousemove', (e) => {
      // Only do it if slide is on
      if(previewArea.classList.contains('slide-on')) {
         const rect = menu.getBoundingClientRect();
         // If inside a drawer, track vertical primarily. If bottom / top track horizontal.
         const x = e.clientX - rect.left;
         const y = e.clientY - rect.top;
         menu.style.setProperty('--mouse-x', `${x}px`);
         menu.style.setProperty('--mouse-y', `${y}px`);
      }
    });
  });
}


// BUILDER MOBILE TABS
const builderTabs = document.querySelectorAll(".builder-mobile-tabs .tab-btn");
const builderWorkspaceArea = document.querySelector(".builder-workspace");

if (builderTabs.length && builderWorkspaceArea) {
  builderTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      builderTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      
      if (tab.dataset.tab === "preview") {
        builderWorkspaceArea.classList.add("show-preview");
      } else {
        builderWorkspaceArea.classList.remove("show-preview");
      }
    });
  });
}

// =========================================
// SCROLL REVEAL OBSERVER
// =========================================
function initScrollReveal() {
  const cards = document.querySelectorAll(".project-card, .card");
  
  if (!cards.length) return;

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -50px 0px", // El efecto empieza un poco antes de llegar al fondo de la pantalla
    threshold: 0.1 // Requiere que al menos el 10% de la card sea visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Agregamos la clase que dispara el fade-in y el brillo de neón en CSS
        entry.target.classList.add("visible");
        // Dejamos de observar la tarjeta para que la animación solo ocurra una vez
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  cards.forEach(card => {
    observer.observe(card);
  });
}

// Iniciar al cargar o después de inicializar otros scripts
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initScrollReveal);
} else {
  initScrollReveal();
}

// --- HAMBURGER MENU LOGIC ---
const hamburgerBtns = document.querySelectorAll(".nav-hamburger");
const g_megaMenu = document.querySelector(".mega-menu");

hamburgerBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    if (g_megaMenu) {
      g_megaMenu.classList.toggle("is-open");
    }
  });
});

// --- BUILDER NOTICE LOGIC ---
const builderNotice = document.getElementById("builderNotice");
const closeNoticeBtn = document.getElementById("closeNoticeBtn");
const goToBuilderBtn2 = document.getElementById("goToBuilder"); // We capture this again to add the modal listener

if (goToBuilderBtn2 && builderNotice) {
  goToBuilderBtn2.addEventListener("click", () => {
    // Show modal shortly after scrolling to builder so it feels right
    setTimeout(() => {
      builderNotice.classList.add("show");
    }, 500);
  });
}

if (closeNoticeBtn && builderNotice) {
  closeNoticeBtn.addEventListener("click", () => {
    builderNotice.classList.remove("show");
  });
}

/* =========================================
   CONTACT MODAL & SECRET LOGIN LOGIC
   ========================================= */
const contactModal = document.getElementById('contactModal');
const closeModal = document.getElementById('closeModal');
const flipContainer = document.getElementById('contactFlipContainer');

// Function to handle opening modal
function openContactModal(e) {
  e.preventDefault();
  if (contactModal) {
    contactModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
    if (flipContainer) flipContainer.classList.remove('flipped');
    clickCounter = 0; // Reset secret
  }
}

// Attach to all contact-btn elements AND mobile icon button
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.contact-btn, .contact-btn-mobile');
  if (btn) {
    openContactModal(e);
  }
});

if (closeModal) {
  closeModal.addEventListener('click', () => {
    contactModal.classList.remove('active');
    document.body.style.overflow = '';
  });
}

if (contactModal) {
  contactModal.addEventListener('click', (e) => {
    // If they click exactly the overlay background, close it
    if (e.target === contactModal) {
      contactModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// ========== SECRET TRIGGER: 4 CLICKS ON EMAIL ==========
let clickCounter = 0;
let clickTimeout;
const secretEmailBtn = document.getElementById('secretEmailBtn');

if (secretEmailBtn && flipContainer) {
  secretEmailBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Always prevent default mailto initially
    
    clickCounter++;
    clearTimeout(clickTimeout);
    
    // Evaluate clicks after a 400ms pause
    clickTimeout = setTimeout(() => {
      // If they clicked less than 4 times and paused, it was a real email attempt
      if (clickCounter > 0 && clickCounter < 4) {
        window.location.href = secretEmailBtn.getAttribute('href');
      }
      clickCounter = 0; // reset
    }, 400);
    
    // If they hit 4 rapidly
    if (clickCounter >= 4) {
      clearTimeout(clickTimeout); // cancel the mailto execution
      clickCounter = 0;
      flipContainer.classList.add('flipped');
    }
  });
}

// ==========================================
// WEB APPLICATIONS MODULE SELECTOR
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    
    const btnSelectFeatures = document.getElementById('btnSelectFeatures');
    const btnBackView = document.getElementById('btnBackView');
    const appView1 = document.getElementById('appView1');
    const appView2 = document.getElementById('appView2');
    const featureCards = document.querySelectorAll('.feature-card');

    if (btnSelectFeatures && appView1 && appView2) {
        // Adelante
        btnSelectFeatures.addEventListener('click', () => {
            appView1.classList.remove('active');
            setTimeout(() => {
                appView1.style.display = 'none';
                appView2.style.display = 'flex';
                // Trigger reflow for animation
                void appView2.offsetWidth; 
                appView2.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 500); // match css transition fading out if had one, else instantly toggles display
        });
        
        // Atr�s
        if (btnBackView) {
            btnBackView.addEventListener('click', () => {
                appView2.classList.remove('active');
                setTimeout(() => {
                    appView2.style.display = 'none';
                    appView1.style.display = 'flex';
                    void appView1.offsetWidth;
                    appView1.classList.add('active');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 500);
            });
        }
    }

    const btnRequestArchitecture = document.getElementById('btnRequestArchitecture');
    if (btnRequestArchitecture && appView2) {
        btnRequestArchitecture.addEventListener('click', () => {
            const reqForm = document.getElementById('requestForm');
            if (reqForm) {
                appView2.classList.remove('active');
                setTimeout(() => {
                    appView2.style.display = 'none';
                    reqForm.style.display = 'flex';
                    reqForm.classList.add('active');
                    // Collapse apps-showcase top padding to match Websites/Software spacing
                    const showcase = document.querySelector('.apps-showcase');
                    if (showcase) showcase.style.paddingTop = '0';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 500);
            }
        });
    }

    // Back button inside the form — restore showcase padding
    const backToBuilderBtn = document.getElementById('backToBuilder');
    if (backToBuilderBtn) {
        backToBuilderBtn.addEventListener('click', () => {
            const reqForm = document.getElementById('requestForm');
            const showcase = document.querySelector('.apps-showcase');
            if (reqForm) { reqForm.style.display = 'none'; reqForm.classList.remove('active'); }
            if (showcase) showcase.style.paddingTop = '';
            if (appView2) {
                appView2.style.display = 'flex';
                void appView2.offsetWidth;
                appView2.classList.add('active');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Toggle card selection
    featureCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('selected');
        });
    });

});

/* ============================================================
   PHONE COLOR CUSTOMIZER — index.html Web Apps panel
   ============================================================ */
(function initPhoneColorizer() {
  var phone = document.getElementById('phoneMockup');
  var glow  = document.getElementById('phoneGlow');
  var dots  = document.querySelectorAll('.color-dot');
  if (!phone || !dots.length) return;

  var themes = [
    { accent: '#00AEEF', glow: '0 28px 72px rgba(0,174,239,0.38)' },
    { accent: '#7C3AED', glow: '0 28px 72px rgba(124,58,237,0.38)' },
    { accent: '#16A34A', glow: '0 28px 72px rgba(22,163,74,0.38)'  },
    { accent: '#F59E0B', glow: '0 28px 72px rgba(245,158,11,0.38)' }
  ];

  var current = 0;
  var cycleTimer;

  function applyTheme(idx) {
    current = idx;
    phone.style.setProperty('--app-accent', themes[idx].accent);
    if (glow) glow.style.boxShadow = themes[idx].glow;
    dots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
  }

  function startCycle() {
    clearInterval(cycleTimer);
    cycleTimer = setInterval(function() {
      applyTheme((current + 1) % themes.length);
    }, 3000);
  }

  dots.forEach(function(dot, idx) {
    dot.addEventListener('click', function() {
      applyTheme(idx);
      startCycle();
    });
  });

  applyTheme(0);
  startCycle();
})();

/* ============================================================
   BUSINESS SOFTWARE PAGE — Interactive Logic (Migrated for Index)
   ============================================================ */
// Clock
function bsUpdateClock() {
  const now = new Date();
  const t = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const c1 = document.getElementById('bsClock');
  const c2 = document.getElementById('bsClock2');
  if (c1) c1.textContent = t;
  if (c2) c2.textContent = t;
}
bsUpdateClock();
setInterval(bsUpdateClock, 10000);

// Module Content Data
const bsModules = {
  dashboard: `
    <div class="bs-module-header">
      <h3>Dashboard</h3>
      <span class="bs-module-tag">Live Overview</span>
    </div>
    <div class="bs-kpis">
      <div class="bs-kpi">
        <span class="bs-kpi-label">Monthly Revenue</span>
        <span class="bs-kpi-value cyan">$128,400</span>
        <span class="bs-kpi-delta up">+12.4%</span>
      </div>
      <div class="bs-kpi">
        <span class="bs-kpi-label">Active Projects</span>
        <span class="bs-kpi-value gold">14</span>
        <span class="bs-kpi-delta up">+3 this month</span>
      </div>
      <div class="bs-kpi">
        <span class="bs-kpi-label">Overdue Tasks</span>
        <span class="bs-kpi-value red">2</span>
        <span class="bs-kpi-delta down">Review needed</span>
      </div>
      <div class="bs-kpi">
        <span class="bs-kpi-label">Total Clients</span>
        <span class="bs-kpi-value">38</span>
        <span class="bs-kpi-delta up">+5 this quarter</span>
      </div>
    </div>
    <div class="bs-mini-table">
      <div class="bs-table-header">
        <span>Recent Activity</span><span class="bs-table-time">Today</span>
      </div>
      <div class="bs-table-row"><span>Acme Corp · Invoice #1042 sent</span><span class="dim">09:14</span></div>
      <div class="bs-table-row"><span>Project "Storefront v2" — Status → QA</span><span class="dim">11:30</span></div>
      <div class="bs-table-row"><span>New client onboarded: Zenith Labs</span><span class="dim">13:05</span></div>
      <div class="bs-table-row"><span>Automated report sent to team leads</span><span class="dim">14:00</span></div>
    </div>`,

  projects: `
    <div class="bs-module-header">
      <h3>Projects</h3>
      <span class="bs-module-tag">14 Active</span>
    </div>
    <div class="bs-table-full">
      <div class="bs-table-head-row">
        <span>Project Name</span><span>Client</span><span>Status</span><span>ETA</span>
      </div>
      <div class="bs-table-row"><span>Storefront v2</span><span class="dim">Acme Corp</span><span class="tag-qa">QA</span><span class="dim">Apr 10</span></div>
      <div class="bs-table-row"><span>Internal CRM</span><span class="dim">Zenith Labs</span><span class="tag-dev">DEV</span><span class="dim">Apr 22</span></div>
      <div class="bs-table-row"><span>Partner Portal</span><span class="dim">BluePeak</span><span class="tag-design">DESIGN</span><span class="dim">May 01</span></div>
      <div class="bs-table-row"><span>API Gateway v3</span><span class="dim">Internal</span><span class="tag-dev">DEV</span><span class="dim">Apr 18</span></div>
      <div class="bs-table-row"><span>Dashboard Redesign</span><span class="dim">Orion Media</span><span class="tag-review">REVIEW</span><span class="dim">Apr 15</span></div>
      <div class="bs-table-row"><span>Mobile Sync Module</span><span class="dim">TechVault</span><span class="tag-qa">QA</span><span class="dim">Apr 12</span></div>
    </div>`,

  clients: `
    <div class="bs-module-header">
      <h3>Clients</h3>
      <span class="bs-module-tag">38 Registered</span>
    </div>
    <div class="bs-table-full">
      <div class="bs-table-head-row">
        <span>Company</span><span>Industry</span><span>Plan</span><span>Status</span>
      </div>
      <div class="bs-table-row"><span>Acme Corp</span><span class="dim">Retail</span><span class="dim">Enterprise</span><span class="tag-active">ACTIVE</span></div>
      <div class="bs-table-row"><span>Zenith Labs</span><span class="dim">Biotech</span><span class="dim">Pro</span><span class="tag-active">ACTIVE</span></div>
      <div class="bs-table-row"><span>BluePeak</span><span class="dim">Finance</span><span class="dim">Enterprise</span><span class="tag-active">ACTIVE</span></div>
      <div class="bs-table-row"><span>Orion Media</span><span class="dim">Marketing</span><span class="dim">Starter</span><span class="tag-overdue">OVERDUE</span></div>
      <div class="bs-table-row"><span>TechVault</span><span class="dim">SaaS</span><span class="dim">Pro</span><span class="tag-active">ACTIVE</span></div>
      <div class="bs-table-row"><span>NorthEdge</span><span class="dim">Logistics</span><span class="dim">Starter</span><span class="tag-trial">TRIAL</span></div>
    </div>`,

  billing: `
    <div class="bs-module-header">
      <h3>Billing</h3>
      <span class="bs-module-tag">6 Open Invoices</span>
    </div>
    <div class="bs-table-full">
      <div class="bs-table-head-row">
        <span>Invoice</span><span>Client</span><span>Amount</span><span>Status</span>
      </div>
      <div class="bs-table-row"><span>#1042</span><span class="dim">Acme Corp</span><span class="cyan">$12,400</span><span class="tag-sent">SENT</span></div>
      <div class="bs-table-row"><span>#1041</span><span class="dim">Zenith Labs</span><span class="cyan">$8,900</span><span class="tag-paid">PAID</span></div>
      <div class="bs-table-row"><span>#1040</span><span class="dim">BluePeak</span><span class="cyan">$21,000</span><span class="tag-paid">PAID</span></div>
      <div class="bs-table-row"><span>#1039</span><span class="dim">Orion Media</span><span class="red">$3,200</span><span class="tag-overdue">OVERDUE</span></div>
      <div class="bs-table-row"><span>#1038</span><span class="dim">TechVault</span><span class="cyan">$6,700</span><span class="tag-sent">SENT</span></div>
      <div class="bs-table-row"><span>#1037</span><span class="dim">NorthEdge</span><span class="cyan">$1,500</span><span class="tag-draft">DRAFT</span></div>
    </div>`,

  reports: `
    <div class="bs-module-header">
      <h3>Reports</h3>
      <span class="bs-module-tag">Q1 2025</span>
    </div>
    <div class="bs-bar-chart">
      <div class="bs-chart-label">Revenue by Month</div>
      <div class="bs-bars">
        <div class="bs-bar-row"><span class="bs-bar-month">Jan</span><div class="bs-bar-track"><div class="bs-bar-fill" style="width:72%"><span>$79k</span></div></div></div>
        <div class="bs-bar-row"><span class="bs-bar-month">Feb</span><div class="bs-bar-track"><div class="bs-bar-fill" style="width:85%"><span>$95k</span></div></div></div>
        <div class="bs-bar-row"><span class="bs-bar-month">Mar</span><div class="bs-bar-track"><div class="bs-bar-fill" style="width:100%"><span>$128k</span></div></div></div>
      </div>
    </div>
    <div class="bs-mini-table" style="margin-top:16px">
      <div class="bs-table-header"><span>Top Performing Modules</span></div>
      <div class="bs-table-row"><span>Billing Automation</span><span class="cyan">↑ 34%</span></div>
      <div class="bs-table-row"><span>Client Onboarding</span><span class="cyan">↑ 21%</span></div>
      <div class="bs-table-row"><span>Project Tracking</span><span class="cyan">↑ 18%</span></div>
    </div>`
};

// Detect touch device and update hint text
const bsIsTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
const bsHintEl = document.getElementById('bsHintText');
if (bsIsTouch && bsHintEl) bsHintEl.textContent = '↑ Double-tap to launch';

// Double-tap handler for mobile (touchend)
let bsLastTap = 0;
const bsErpIcon = document.getElementById('bsLaunchErp');
if (bsErpIcon) {
  // Desktop: dblclick
  bsErpIcon.addEventListener('dblclick', function() {
    bsOpenApp();
  });
  // Mobile: double-tap via touchend
  bsErpIcon.addEventListener('touchend', function(e) {
    const now = Date.now();
    const gap = now - bsLastTap;
    bsLastTap = now;
    if (gap < 400 && gap > 0) {
      e.preventDefault(); // prevent zoom
      bsOpenApp();
    }
  }, { passive: false });
}

// Open App Window
function bsOpenApp() {
  const desktop = document.getElementById('bsDesktop');
  const appWin = document.getElementById('bsAppWindow');
  const taskbarApp = document.getElementById('bsTaskbarApp');
  if(!desktop) return;
  desktop.style.animation = 'bsLaunch 0.4s ease forwards';
  setTimeout(() => {
    desktop.style.display = 'none';
    appWin.style.display = 'flex';
    appWin.style.animation = 'bsAppIn 0.4s ease forwards';
    if (taskbarApp) taskbarApp.style.display = 'inline-flex';
    bsLoadModuleByKey('dashboard');
  }, 380);
}

// Close App Window
function bsCloseApp() {
  const desktop = document.getElementById('bsDesktop');
  const appWin = document.getElementById('bsAppWindow');
  appWin.style.display = 'none';
  desktop.style.display = 'flex';
  desktop.style.animation = 'bsFadeIn 0.3s ease forwards';
}

// Load Module
function bsLoadModule(btn) {
  const context = btn.closest('.bs-app-window'); // make sure we search in the same laptop
  if(context) {
    context.querySelectorAll('.bs-nav-item').forEach(b => b.classList.remove('active'));
  } else {
    document.querySelectorAll('.bs-nav-item').forEach(b => b.classList.remove('active'));
  }
  btn.classList.add('active');
  const key = btn.getAttribute('data-module');
  bsLoadModuleByKey(key);
}

function bsLoadModuleByKey(key) {
  const contents = document.querySelectorAll('#bsContent, .bs-content'); // match any content area
  contents.forEach(content => {
    content.style.opacity = '0';
    setTimeout(() => {
      content.innerHTML = bsModules[key] || '';
      content.style.opacity = '1';
      content.style.transition = 'opacity 0.25s ease';
      // Animate bars if reports
      if (key === 'reports') {
        setTimeout(() => {
          content.querySelectorAll('.bs-bar-fill').forEach(b => {
            const w = b.style.width;
            b.style.width = '0';
            setTimeout(() => { b.style.width = w; b.style.transition = 'width 0.8s ease'; }, 50);
          });
        }, 100);
      }
    }, 150);
  });
}

/* ============================================================
   VIRTUAL OS EXPERIENCE — Business Software (Subpage)
   ============================================================ */
(function initVirtualOS() {
  const scene = document.getElementById('bsOsScene');
  if (!scene) return; // Only runs on businesssoftware.html

  const btnPower    = document.getElementById('bsPowerBtn');
  const stateOff    = document.getElementById('bsOsOffState');
  const stateBoot   = document.getElementById('bsOsBootState');
  const stateDesk   = document.getElementById('bsOsDesktopState');
  const bootText    = document.getElementById('bsBootText');
  const tabs        = document.querySelectorAll('.os-tab');
  const moduleGrid  = document.getElementById('osModulesGrid');
  const tabTitle    = document.getElementById('osTabTitle');
  const tabDesc     = document.getElementById('osTabDesc');
  const selCount    = document.getElementById('selCount');
  const btnGenerate = document.getElementById('bsGenerateBtn');
  const osConfigApp = document.getElementById('osConfigApp');
  const osCompiler  = document.getElementById('osCompiler');
  const osGenApp    = document.getElementById('osGeneratedApp');
  const osGenSidebar= document.getElementById('osGenSidebar');
  const btnExport   = document.getElementById('bsExportBtn');
  const btnRun      = document.getElementById('bsRunBtn');
  const btnBackGen  = document.getElementById('bsBackToGenBtn');
  const exportSection = document.getElementById('bsExportSection');
  const descInput   = document.getElementById('bsDescInput');
  const modCount    = document.getElementById('bsConfigModuleCount');
  const modNamesList = document.getElementById('bsModNamesList');
  
  const sceneParentOriginal = scene ? scene.parentElement : null;
  const sceneSiblingOriginal = scene ? scene.nextSibling : null;

  /* ── Module Data ── */
  const osData = {
    ops: {
      title: 'Operations (ERP)',
      desc: 'Sistemas centrales para gestionar operaciones y recursos.',
      modules: [
        { id:'inv',  name:'Inventario',       icon:'📦', desc:'Control de stock en tiempo real.' },
        { id:'hr',   name:'RRHH & Nómina',    icon:'👥', desc:'Gestión de empleados y salarios.' },
        { id:'ast',  name:'Activos',           icon:'🖥️', desc:'Ciclo de vida de equipos y hardware.' },
        { id:'ord',  name:'Órdenes',           icon:'🔄', desc:'Flujo de pedidos y entregas.' }
      ]
    },
    crm: {
      title: 'Relación con Clientes (CRM)',
      desc: 'Convierte leads, gestiona clientes y controla ventas.',
      modules: [
        { id:'pipe', name:'Pipeline de Ventas',icon:'📊', desc:'Tablero Kanban de etapas.' },
        { id:'port', name:'Portal de Clientes',icon:'🔐', desc:'Área privada para que tus clientes consulten.' },
        { id:'tkt',  name:'Tickets de Soporte',icon:'🎫', desc:'Mesa de ayuda multicanal.' },
        { id:'blng', name:'Facturación Auto.',  icon:'💳', desc:'Facturas recurrentes y pasarelas de pago.' }
      ]
    },
    data: {
      title: 'Datos & Analytics',
      desc: 'Transforma tus datos operativos en decisiones.',
      modules: [
        { id:'dsh', name:'Dashboards en Vivo', icon:'📈', desc:'Widgets para KPIs en tiempo real.' },
        { id:'fin', name:'Predictor Financiero',icon:'🔮', desc:'Flujo de caja basado en historial.' },
        { id:'rep', name:'Reportes PDF/Excel',  icon:'📄', desc:'Exportaciones automáticas por email.' }
      ]
    },
    auto: {
      title: 'Hub de Automatización',
      desc: 'Conecta tu software con el mundo exterior.',
      modules: [
        { id:'api', name:'API Sync Externas', icon:'🔗', desc:'Conecta con Salesforce, Slack, Google.' },
        { id:'ntf', name:'Notificaciones IA',  icon:'🔔', desc:'SMS/Email basados en eventos.' },
        { id:'wrk', name:'Motor de Flujos',    icon:'⚙️', desc:'Lógica if-then-else para tu equipo.' }
      ]
    }
  };

  let selectedModules = new Set();
  let currentTab = 'ops';

  /* ── 1. POWER ON ── */
  if (btnPower) {
    btnPower.addEventListener('click', () => {
      if (scene) {
        document.body.appendChild(scene);
        scene.classList.add('is-fullscreen');
      }
      stateOff.style.display = 'none';
      stateBoot.style.display = 'block';

      const bootLines = [
        'CodensFlow OS v2.1 booting...',
        'Kernel modules loaded .............. [OK]',
        'Virtual filesystem mounted ......... [OK]',
        'Secure channel established ......... [OK]',
        'Launching Configurator ............. [OK]'
      ];
      let i = 0;
      if (bootText) bootText.innerHTML = '';
      const interval = setInterval(() => {
        if (i < bootLines.length) {
          if (bootText) bootText.innerHTML += bootLines[i] + '<br>';
          i++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            stateBoot.style.display = 'none';
            stateDesk.style.display = 'flex';
            renderTab(currentTab);
          }, 500);
        }
      }, 380);
    });
  }

  /* ── 2. TAB RENDERING ── */
  function renderTab(key) {
    const data = osData[key];
    if (!data) return;
    if (tabTitle) tabTitle.textContent = data.title;
    if (tabDesc)  tabDesc.textContent  = data.desc;
    if (!moduleGrid) return;
    moduleGrid.innerHTML = '';
    data.modules.forEach(mod => {
      const div = document.createElement('div');
      div.className = 'os-module-toggle' + (selectedModules.has(mod.id) ? ' selected' : '');
      div.innerHTML = `<span class="mod-icon">${mod.icon}</span><strong>${mod.name}</strong><span>${mod.desc}</span>`;
      div.addEventListener('click', () => {
        selectedModules.has(mod.id) ? selectedModules.delete(mod.id) : selectedModules.add(mod.id);
        div.classList.toggle('selected', selectedModules.has(mod.id));
        updateCount();
      });
      moduleGrid.appendChild(div);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.dataset.tab;
      renderTab(currentTab);
    });
  });

  function updateCount() {
    const n = selectedModules.size;
    if (selCount) selCount.textContent = n;
    if (btnGenerate) btnGenerate.disabled = n === 0;
  }

  /* ── 3. GENERATE → COMPILE ANIMATION → EXECUTE ── */
  if (btnGenerate) {
    btnGenerate.addEventListener('click', () => {
      const allMods = Object.values(osData).flatMap(v => v.modules);
      const selected = Array.from(selectedModules).map(id => allMods.find(m => m.id === id)).filter(Boolean);

      // Show compiler overlay
      if (osCompiler) {
        osCompiler.style.display = 'flex';
        // Clear and show install progress
        osCompiler.innerHTML = '';
        const spinnerWrap = document.createElement('div');
        spinnerWrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:20px;width:100%;max-width:440px;';
        spinnerWrap.innerHTML = `<div style="font-family:'JetBrains Mono',monospace;color:#00AEEF;font-size:0.95rem;letter-spacing:1px;margin-bottom:4px;">Instalando módulos...</div>`;
        const list = document.createElement('div');
        list.style.cssText = 'width:100%;display:flex;flex-direction:column;gap:10px;';
        spinnerWrap.appendChild(list);
        osCompiler.appendChild(spinnerWrap);

        // Animate each module installing sequentially: Pop grey -> Wait -> Turn green -> Repeat
        const installModulesAsync = async () => {
          for (let idx = 0; idx < selected.length; idx++) {
            const mod = selected[idx];
            
            // Wait slightly before showing next module fetching
            await new Promise(resolve => setTimeout(resolve, 500));

            const row = document.createElement('div');
            row.className = 'install-row-item';
            row.style.cssText = 'display:flex;align-items:center;gap:12px;font-family:"JetBrains Mono",monospace;font-size:0.88rem;color:rgba(255,255,255,0.4);transition:color 0.3s;';
            row.innerHTML = `<span style="width:20px;height:20px;border:2px solid rgba(0,174,239,0.2);border-radius:50%;flex-shrink:0;" class="inst-check-${idx}"></span><span>${mod.icon} Installing ${mod.name}...</span>`;
            list.appendChild(row);

            // Halt the loop for 500ms to simulate installation processing
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mark visually and semantically as installed
            row.style.color = '#00ff66';
            row.classList.add('module-installed-flag'); 
            const check = row.querySelector(`.inst-check-${idx}`);
            if(check) check.outerHTML = `<span style="width:20px;height:20px;flex-shrink:0;color:#00ff66;font-size:1rem;display:flex;align-items:center;justify-content:center;">✓</span>`;
          }

          // Loop naturally guarantees ALL modules finish before this line executes
          // Add completion flag class explicitly
          osCompiler.classList.add('all-modules-installed-flag');

          spinnerWrap.innerHTML += `
            <div style="margin-top:20px;text-align:center;">
              <div style="color:#00ff66;font-family:'JetBrains Mono',monospace;font-size:0.95rem;font-weight:bold;">✓ ${selected.length} módulos registrados e instalados</div>
            </div>`;
            
          await new Promise(resolve => setTimeout(resolve, 1500));

          // Switch from compiler overlay to generated app
          if (osCompiler) osCompiler.style.display = 'none';
          if (osConfigApp) osConfigApp.style.display = 'none';
          if (osGenApp) osGenApp.style.display = 'flex';
          
          // Populate generated app sidebar and export list
          const bsConfigModuleCount = document.getElementById('bsConfigModuleCount');
          const modNamesList = document.getElementById('bsModNamesList');
          
          if (osGenSidebar) osGenSidebar.innerHTML = '';
          if (modNamesList) modNamesList.innerHTML = '';

          selected.forEach(mod => {
            // Sidebar item
            if (osGenSidebar) {
              const item = document.createElement('div');
              item.className = 'os-gen-nav-item';
              item.innerHTML = `<span>${mod.icon}</span>${mod.name}`;
              osGenSidebar.appendChild(item);
            }
            // Export list item (for step 4)
            if (modNamesList) {
              let expItem = document.createElement('div');
              expItem.innerText = "- " + mod.name;
              modNamesList.appendChild(expItem);
            }
          });
          
          if (bsConfigModuleCount) {
             bsConfigModuleCount.innerText = selected.length + (selected.length === 1 ? ' módulo seleccionado' : ' módulos seleccionados');
          }

          const stepEl = document.querySelector('.os-steps');
          if (stepEl) stepEl.textContent = 'Step 2: Architecture Active';
        };

        // Fire async process
        installModulesAsync();
      }
    });
  }

  /* ── 3.5 EXECUTE SOFTWARE ── */
  const osRunScreen = document.getElementById('osRunScreen');
  const simLoaderOverlay = document.getElementById('simLoaderOverlay');
  const simAppFrame = document.getElementById('simAppFrame');
  const simInteractiveSidebar = document.getElementById('simInteractiveSidebar');
  const simInteractiveContent = document.getElementById('simInteractiveContent');
  const simHamburgerBtn = document.getElementById('simHamburgerBtn');
  const simOffTopBtn = document.getElementById('simOffTopBtn');

  if (btnRun) {
    btnRun.addEventListener('click', () => {
      if (osGenApp) osGenApp.style.display = 'none';
      if (osRunScreen) osRunScreen.style.display = 'flex';
      
      // Reset simulator views
      if (simLoaderOverlay) simLoaderOverlay.style.display = 'flex';
      if (simAppFrame) simAppFrame.style.display = 'none';
      if (simInteractiveSidebar) simInteractiveSidebar.innerHTML = '';
      if (simInteractiveContent) simInteractiveContent.innerHTML = '';

      // Populate sidebar icons
      const allMods = Object.values(osData).flatMap(v => v.modules);
      const selected = Array.from(selectedModules).map(id => allMods.find(m => m.id === id)).filter(Boolean);

      selected.forEach((mod, idx) => {
        const btn = document.createElement('button');
        btn.className = 'sim-icon-btn' + (idx === 0 ? ' active' : '');
        btn.title = mod.name;
        btn.innerHTML = mod.icon;
        
        btn.addEventListener('click', () => {
          // Remove active from all
          const siblings = simInteractiveSidebar.querySelectorAll('.sim-icon-btn');
          siblings.forEach(s => s.classList.remove('active'));
          btn.classList.add('active');
          
          // Render content
          renderSimContent(mod);
          
          // Close mobile sidebar if open
          if (simInteractiveSidebar.classList.contains('open')) {
            simInteractiveSidebar.classList.remove('open');
          }
        });
        
        if (simInteractiveSidebar) simInteractiveSidebar.appendChild(btn);
      });

      // Simulate loading time
      setTimeout(() => {
        if (simLoaderOverlay) simLoaderOverlay.style.display = 'none';
        if (simAppFrame) simAppFrame.style.display = 'flex';
        
        // Render first module automatically
        if (selected.length > 0) {
          renderSimContent(selected[0]);
        }
      }, 1500);

    });
  }

  function renderSimContent(mod) {
    if (!simInteractiveContent) return;
    simInteractiveContent.style.transition = 'opacity 0.2s';
    simInteractiveContent.style.opacity = 0;
    
    setTimeout(() => {
      simInteractiveContent.innerHTML = '';
      const m1 = Math.floor(Math.random() * 80) + 20;
      const m2 = Math.floor(Math.random() * 900) + 100;

      let customContent = '';

      // UNIQUE MODULE DASHBOARDS
      switch(mod.id) {
        case 'inv': // Inventory
          customContent = `
            <div class="mockup-grid">
              <div class="mockup-card" style="height:auto;">
                <span style="color:#888; font-size:0.85rem;">Total SKUs</span>
                <span style="color:#00ff66; font-size:1.8rem; font-weight:700; margin-top:5px;">2,450</span>
              </div>
              <div class="mockup-card" style="height:auto;">
                <span style="color:#888; font-size:0.85rem;">Low Stock Alerts</span>
                <span style="color:#ffcc00; font-size:1.8rem; font-weight:700; margin-top:5px;">12 Items</span>
              </div>
            </div>
            <div style="padding:0 30px 30px;">
              <table style="width:100%; text-align:left; border-collapse:collapse; color:rgba(255,255,255,0.8); font-size:0.9rem;">
                <tr style="border-bottom:1px solid rgba(255,255,255,0.1); color:#888;">
                  <th style="padding:10px 0;">Item Code</th><th style="padding:10px 0;">Stock</th><th style="padding:10px 0;">Status</th>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:10px 0;">LAP-MAC-01</td><td>45 units</td><td style="color:#00ff66;">In Stock</td>
                </tr>
                <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
                  <td style="padding:10px 0;">MON-4K-27</td><td>2 units</td><td style="color:#ffcc00;">Reorder</td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">KEY-MECH-99</td><td>0 units</td><td style="color:#ff4d4d;">Out of Stock</td>
                </tr>
              </table>
            </div>`;
          break;
          
        case 'pipe': // Pipeline CRM
          customContent = `
            <div style="display:flex; gap:15px; padding:30px; overflow-x:auto;">
              <div style="flex:1; min-width:200px; background:rgba(255,255,255,0.02); padding:15px; border-radius:8px;">
                <h4 style="color:#888; margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;">Leads (${m1})</h4>
                <div style="background:#131825; padding:10px; border-radius:6px; margin-bottom:10px; border-left:3px solid #00AEEF;">TechCorp Inc.</div>
                <div style="background:#131825; padding:10px; border-radius:6px; border-left:3px solid #00AEEF;">Global Net.</div>
              </div>
              <div style="flex:1; min-width:200px; background:rgba(255,255,255,0.02); padding:15px; border-radius:8px;">
                <h4 style="color:#888; margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;">In Negotiation</h4>
                <div style="background:#131825; padding:10px; border-radius:6px; border-left:3px solid #ffcc00;">Alpha Studios</div>
              </div>
              <div style="flex:1; min-width:200px; background:rgba(255,255,255,0.02); padding:15px; border-radius:8px;">
                <h4 style="color:#888; margin-bottom:15px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;">Closed Won</h4>
                <div style="background:#131825; padding:10px; border-radius:6px; border-left:3px solid #00ff66;">Omega LLC ($12k)</div>
              </div>
            </div>`;
          break;

        case 'hr': // RRHH
          customContent = `
            <div class="mockup-grid">
              <div class="mockup-card">
                <span style="color:#888; font-size:0.85rem;">Active Employees</span>
                <span style="color:#00AEEF; font-size:1.8rem; font-weight:700; margin-top:10px;">142</span>
              </div>
              <div class="mockup-card">
                <span style="color:#888; font-size:0.85rem;">Next Payroll</span>
                <span style="color:#fff; font-size:1.8rem; font-weight:700; margin-top:10px;">Oct 15</span>
              </div>
            </div>
            <div class="mockup-list">
              <div class="mockup-list-item" style="align-items:center;">
                <div style="display:flex; gap:15px; align-items:center;">
                  <div style="width:35px; height:35px; border-radius:50%; background:#00AEEF; color:#000; display:flex; align-items:center; justify-content:center; font-weight:bold;">JD</div>
                  <div><h5 style="margin:0; color:#fff;">John Doe</h5><span style="color:#888; font-size:0.8rem;">Engineering</span></div>
                </div>
                <span style="color:#00ff66; border:1px solid #00ff66; padding:4px 10px; border-radius:12px; font-size:0.75rem;">Active</span>
              </div>
              <div class="mockup-list-item" style="align-items:center;">
                <div style="display:flex; gap:15px; align-items:center;">
                  <div style="width:35px; height:35px; border-radius:50%; background:#c6a84f; color:#000; display:flex; align-items:center; justify-content:center; font-weight:bold;">AS</div>
                  <div><h5 style="margin:0; color:#fff;">Ana Smith</h5><span style="color:#888; font-size:0.8rem;">Marketing</span></div>
                </div>
                <span style="color:#ffcc00; border:1px solid #ffcc00; padding:4px 10px; border-radius:12px; font-size:0.75rem;">On Leave</span>
              </div>
            </div>`;
          break;
          
        case 'dsh': // Data & Analytics
        case 'fin':
          customContent = `
            <div style="padding: 30px;">
              <h4 style="color:#fff; margin-bottom: 20px;">Revenue vs Expenses</h4>
              <div style="height:150px; border-bottom:1px solid rgba(255,255,255,0.2); border-left:1px solid rgba(255,255,255,0.2); display:flex; align-items:flex-end; gap:10px; padding:10px;">
                <div style="width:30px; height:40%; background:#00AEEF; border-radius:3px 3px 0 0;"></div>
                <div style="width:30px; height:60%; background:#00AEEF; border-radius:3px 3px 0 0;"></div>
                <div style="width:30px; height:80%; background:#00ff66; border-radius:3px 3px 0 0;"></div>
                <div style="width:30px; height:30%; background:#ff4d4d; border-radius:3px 3px 0 0; margin-left:30px;"></div>
                <div style="width:30px; height:85%; background:#00ff66; border-radius:3px 3px 0 0;"></div>
              </div>
              <div class="mockup-grid" style="padding:20px 0 0 0;">
                <div class="mockup-card" style="height:auto; padding:15px;"><span style="color:#888; font-size:0.8rem;">Net Profit</span><span style="color:#00ff66; font-size:1.4rem;">+$45,200</span></div>
                <div class="mockup-card" style="height:auto; padding:15px;"><span style="color:#888; font-size:0.8rem;">Burn Rate</span><span style="color:#ff4d4d; font-size:1.4rem;">$12k /mo</span></div>
              </div>
            </div>`;
          break;

        default: // Generic Layout for unmapped modules
          customContent = `
            <div class="mockup-grid">
              <div class="mockup-card">
                <span style="color:#888; font-size:0.85rem;">Active Instances</span>
                <span style="color:#00AEEF; font-size:1.8rem; font-weight:700; margin-top:10px;">${m1}</span>
              </div>
              <div class="mockup-card">
                <span style="color:#888; font-size:0.85rem;">Processed Operations</span>
                <span style="color:#00ff66; font-size:1.8rem; font-weight:700; margin-top:10px;">${m2}</span>
              </div>
            </div>
            <div class="mockup-list">
              <span style="color:#fff; font-size:1.1rem; margin-bottom:15px; display:inline-block;">Recent Activities</span>
              <div class="mockup-list-item">
                <span style="color:rgba(255,255,255,0.7); font-size:0.9rem;">Sync operation completed</span>
                <span style="color:#00ff66; font-size:0.8rem;">Just now</span>
              </div>
              <div class="mockup-list-item">
                <span style="color:rgba(255,255,255,0.7); font-size:0.9rem;">Service health check passed</span>
                <span style="color:#c6a84f; font-size:0.8rem;">5 mins ago</span>
              </div>
            </div>`;
          break;
      }

      // Re-assemble final HTML
      simInteractiveContent.innerHTML = `
        <div class="mockup-module-header">
          <h2>${mod.icon} ${mod.name} Workspace</h2>
          <p>${mod.desc} Interface Demo.</p>
        </div>
        ${customContent}
      `;

      simInteractiveContent.style.opacity = 1;
    }, 200);
  }

  // Bind off buttons
  const exitSim = () => {
    if (osRunScreen) osRunScreen.style.display = 'none';
    if (osGenApp) osGenApp.style.display = 'flex';
  };
  
  if (btnBackGen) btnBackGen.addEventListener('click', exitSim);
  if (simOffTopBtn) simOffTopBtn.addEventListener('click', exitSim);

  // Hamburger Mobile Logic
  if (simHamburgerBtn && simInteractiveSidebar) {
    simHamburgerBtn.addEventListener('click', () => {
      simInteractiveSidebar.classList.toggle('open');
    });
  }

  /* ── 4. EXPORT → EXIT FULLSCREEN → SHOW EXPORT SECTION ── */
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      // Exit fullscreen
      if (scene) {
        scene.classList.remove('is-fullscreen');
        if (sceneParentOriginal) {
          sceneParentOriginal.insertBefore(scene, sceneSiblingOriginal);
        }
      }

      // Populate modNamesList instead of textarea
      const allMods = Object.values(osData).flatMap(v => v.modules);
      const names = Array.from(selectedModules).map(id => allMods.find(m => m.id === id)?.name).filter(Boolean);

      if (modNamesList) {
        modNamesList.innerHTML = names.map(n => '• ' + n).join('<br>');
      }
      if (modCount) modCount.textContent = names.length + ' módulos seleccionados';

      // 1. Show Gear Animation flowing downwards
      const exportGear = document.getElementById('exportGear');
      if (exportGear) {
        // Añadirle el texto ".config" gráficamente
        exportGear.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="#c6a84f" stroke-width="2" style="width:30px;height:30px;margin-bottom:5px;">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <span style="color:#c6a84f;font-weight:bold;font-family:'JetBrains Mono',monospace;font-size:0.75rem;">.config</span>
        `;
        exportGear.style.flexDirection = 'column';
        exportGear.style.display = 'flex';
        // Reset animation forcefully
        exportGear.style.animation = 'none';
        void exportGear.offsetWidth; 
        exportGear.style.animation = 'exportFly 1.2s ease-in forwards';

        // Hide completely after animation ends so it doesn't show on next power-on
        const hideGear = () => {
          exportGear.style.display = 'none';
          exportGear.style.animation = 'none';
          exportGear.removeEventListener('animationend', hideGear);
        };
        exportGear.addEventListener('animationend', hideGear);
        // Fallback: force hide after 1.5s in case animationend doesn't fire
        setTimeout(() => { exportGear.style.display = 'none'; }, 1500);
      }

      // 2. Wait for animation to finish before showing the form section
      setTimeout(() => {
        if (exportSection) {
          exportSection.style.display = 'block';
          exportSection.style.animation = 'fadeInUp 0.5s ease forwards';
          setTimeout(() => {
            exportSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }

        // Reset OS state internally after it's in the form
        setTimeout(() => {
          selectedModules.clear();
          updateCount();
          if (stateDesk)   stateDesk.style.display   = 'none';
          if (stateOff)    stateOff.style.display     = 'flex';
          if (osConfigApp) osConfigApp.style.display  = 'grid';
          if (osGenApp)    osGenApp.style.display     = 'none';
          if (osCompiler)  osCompiler.style.display   = 'none';
          if (osRunScreen) osRunScreen.style.display  = 'none';
          const stepEl = document.querySelector('.os-steps');
          if (stepEl) stepEl.textContent = 'Step 1: Configure Features';
          const opsTab = document.querySelector('.os-tab[data-tab="ops"]');
          if (opsTab) { tabs.forEach(t => t.classList.remove('active')); opsTab.classList.add('active'); }
          renderTab('ops');
        }, 500);

      }, 1100); // Trigger right when animation reaches 120% down
    });
  }

})();
