const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-nav]");
const progress = document.querySelector(".scroll-progress span");
const dialog = document.querySelector("[data-dialog]");
const dialogFrame = document.querySelector("[data-video-frame]");
const dialogTitle = document.querySelector("[data-dialog-title]");
const closeDialogButton = document.querySelector("[data-dialog-close]");

const closeMenu = (restoreFocus = false) => {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");

  if (restoreFocus) menuButton.focus();
};

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
  navigation.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);

  if (!isOpen) {
    requestAnimationFrame(() => navigation.querySelector("a")?.focus());
  }
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => closeMenu());
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("is-open")) {
    closeMenu(true);
  }
});

const desktopMedia = window.matchMedia("(min-width: 761px)");
desktopMedia.addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

const updateScrollUI = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
  progress.style.transform = `scaleX(${Math.min(Math.max(amount, 0), 1)})`;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px" },
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const openVideo = (button) => {
  dialogFrame.src = button.dataset.video;
  dialogTitle.textContent = button.dataset.videoTitle || "Projeto";
  dialog.classList.toggle("is-vertical", button.dataset.videoFormat === "vertical");
  document.body.classList.add("video-open");
  dialog.showModal();
};

const closeVideo = () => {
  if (dialog.open) dialog.close();
  dialogFrame.src = "";
  dialog.classList.remove("is-vertical");
  document.body.classList.remove("video-open");
};

// Galeria de projetos de Direct Response.
const directResponseButton = document.querySelector(".visual-direct .watch-button");
const directResponseLabel = document.querySelector(".visual-direct .visual-label");

if (directResponseButton) {
  const directResponseVideos = [
    {
      label: "Exemplo 1",
      url: "https://drive.google.com/file/d/148SFeFxIAvX_X8O5AFnuVjlRBqtF28JW/preview",
    },
    {
      label: "Exemplo 2",
      url: "https://drive.google.com/file/d/13O1-hU_z1ESGwfoZ3IwS5oFvoNVwlmpc/preview",
    },
    {
      label: "Exemplo 3",
      url: "https://drive.google.com/file/d/1Ij5vQo45FUrQx9N_AJqnzk_bUQlFqJy0/preview",
    },
  ];

  directResponseButton.removeAttribute("data-video");
  directResponseButton.removeAttribute("data-video-title");
  directResponseButton.removeAttribute("data-video-format");
  directResponseButton.setAttribute("aria-label", "Ver projetos de Direct Response");
  directResponseButton.innerHTML = '<span aria-hidden="true">▶</span> Ver projetos';
  if (directResponseLabel) directResponseLabel.textContent = "Direct response · 3 projetos";

  const galleryDialog = document.createElement("dialog");
  galleryDialog.className = "direct-response-gallery-dialog";
  galleryDialog.setAttribute("aria-labelledby", "direct-response-gallery-title");
  galleryDialog.innerHTML = `
    <div class="direct-response-gallery-panel">
      <div class="direct-response-gallery-topbar">
        <div>
          <p class="direct-response-gallery-kicker">Direct Response</p>
          <h2 id="direct-response-gallery-title">Escolha um projeto</h2>
        </div>
        <button class="direct-response-gallery-close" type="button" aria-label="Fechar galeria">Fechar ×</button>
      </div>
      <div class="direct-response-gallery-grid" aria-label="Projetos de Direct Response"></div>
    </div>
  `;

  const galleryGrid = galleryDialog.querySelector(".direct-response-gallery-grid");
  const galleryClose = galleryDialog.querySelector(".direct-response-gallery-close");

  directResponseVideos.forEach((video, index) => {
    const projectButton = document.createElement("button");
    projectButton.type = "button";
    projectButton.className = "direct-response-gallery-item";
    projectButton.dataset.video = video.url;
    projectButton.dataset.videoTitle = `Direct Response — ${video.label}`;
    projectButton.dataset.videoFormat = "vertical";
    projectButton.setAttribute("aria-label", `Assistir Direct Response — ${video.label}`);
    projectButton.innerHTML = `
      <span class="direct-response-gallery-number">0${index + 1}</span>
      <span class="direct-response-gallery-copy">
        <small>Projeto</small>
        <strong>${video.label}</strong>
      </span>
      <span class="direct-response-gallery-play" aria-hidden="true">▶</span>
    `;

    projectButton.addEventListener("click", () => {
      galleryDialog.close();
      requestAnimationFrame(() => openVideo(projectButton));
    });

    galleryGrid.appendChild(projectButton);
  });

  document.body.appendChild(galleryDialog);

  const closeGallery = () => {
    if (galleryDialog.open) galleryDialog.close();
  };

  directResponseButton.addEventListener("click", () => galleryDialog.showModal());
  galleryClose.addEventListener("click", closeGallery);
  galleryDialog.addEventListener("click", (event) => {
    if (event.target === galleryDialog) closeGallery();
  });
  galleryDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeGallery();
  });

  const directResponseStyles = document.createElement("style");
  directResponseStyles.textContent = `
    .direct-response-gallery-dialog {
      width: min(920px, calc(100vw - 32px));
      max-height: min(760px, calc(100vh - 32px));
      margin: auto;
      padding: 0;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: #0b0d0b;
      color: var(--ink);
      box-shadow: 0 32px 100px rgba(0, 0, 0, 0.65);
    }

    .direct-response-gallery-dialog::backdrop {
      background: rgba(0, 0, 0, 0.82);
      backdrop-filter: blur(10px);
    }

    .direct-response-gallery-panel {
      padding: clamp(22px, 4vw, 40px);
      background:
        radial-gradient(circle at 12% 0%, rgba(185, 255, 63, 0.12), transparent 34%),
        linear-gradient(145deg, rgba(255, 255, 255, 0.025), transparent 45%),
        #0b0d0b;
    }

    .direct-response-gallery-topbar {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 28px;
    }

    .direct-response-gallery-kicker {
      margin: 0 0 8px;
      color: var(--accent);
      font-size: 0.68rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .direct-response-gallery-topbar h2 {
      margin: 0;
      font-family: var(--display);
      font-size: clamp(1.8rem, 4vw, 3.2rem);
      font-weight: 600;
      letter-spacing: -0.05em;
      text-transform: uppercase;
    }

    .direct-response-gallery-close {
      min-height: 42px;
      padding: 0 14px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(255, 255, 255, 0.04);
      color: var(--ink);
      font: inherit;
      cursor: pointer;
    }

    .direct-response-gallery-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
    }

    .direct-response-gallery-item {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 16px;
      min-height: 150px;
      padding: 18px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.015)),
        #111411;
      color: var(--ink);
      text-align: left;
      cursor: pointer;
      transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
    }

    .direct-response-gallery-item:hover,
    .direct-response-gallery-item:focus-visible {
      transform: translateY(-3px);
      border-color: rgba(185, 255, 63, 0.5);
      background:
        linear-gradient(180deg, rgba(185, 255, 63, 0.12), rgba(255, 255, 255, 0.02)),
        #111411;
      outline: none;
    }

    .direct-response-gallery-number {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border: 1px solid rgba(185, 255, 63, 0.35);
      color: var(--accent);
      font-family: var(--display);
      font-size: 0.9rem;
    }

    .direct-response-gallery-copy {
      display: grid;
      gap: 5px;
    }

    .direct-response-gallery-copy small {
      color: var(--muted);
      font-size: 0.66rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    .direct-response-gallery-copy strong {
      font-family: var(--display);
      font-size: clamp(1.1rem, 2vw, 1.45rem);
      font-weight: 600;
      letter-spacing: -0.04em;
      text-transform: uppercase;
    }

    .direct-response-gallery-play {
      display: grid;
      place-items: center;
      width: 38px;
      height: 38px;
      border-radius: 999px;
      background: var(--accent);
      color: #080908;
      font-size: 0.78rem;
    }

    @media (max-width: 760px) {
      .direct-response-gallery-grid {
        grid-template-columns: 1fr;
      }

      .direct-response-gallery-item {
        min-height: 110px;
      }
    }

    @media (max-width: 520px) {
      .direct-response-gallery-dialog {
        width: calc(100vw - 20px);
        max-height: calc(100vh - 20px);
      }

      .direct-response-gallery-panel {
        padding: 18px;
      }

      .direct-response-gallery-topbar {
        gap: 12px;
      }

      .direct-response-gallery-close {
        min-width: 84px;
      }

      .direct-response-gallery-item {
        grid-template-columns: auto 1fr auto;
        padding: 15px;
      }
    }
  `;
  document.head.appendChild(directResponseStyles);
}

document.querySelectorAll("[data-video]").forEach((button) => {
  if (!button.classList.contains("direct-response-gallery-item")) {
    button.addEventListener("click", () => openVideo(button));
  }
});

closeDialogButton.addEventListener("click", closeVideo);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeVideo();
});
dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeVideo();
});

// Dificulta o salvamento casual a partir do player incorporado. A proteção
// principal continua sendo a permissão de download configurada no Google Drive.
dialog.addEventListener("contextmenu", (event) => event.preventDefault());
dialog.addEventListener("dragstart", (event) => event.preventDefault());

document.querySelector("[data-year]").textContent = new Date().getFullYear();
