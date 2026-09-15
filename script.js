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

const galleryStyles = document.createElement("style");
galleryStyles.textContent = `
  .project-gallery-dialog {
    width: min(920px, calc(100vw - 32px));
    max-height: min(760px, calc(100vh - 32px));
    margin: auto;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: #0b0d0b;
    color: var(--ink);
    box-shadow: 0 32px 100px rgba(0, 0, 0, 0.65);
  }

  .project-gallery-dialog::backdrop {
    background: rgba(0, 0, 0, 0.82);
    backdrop-filter: blur(10px);
  }

  .project-gallery-panel {
    padding: clamp(22px, 4vw, 40px);
    background:
      radial-gradient(circle at 12% 0%, rgba(185, 255, 63, 0.12), transparent 34%),
      linear-gradient(145deg, rgba(255, 255, 255, 0.025), transparent 45%),
      #0b0d0b;
  }

  .project-gallery-topbar {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 28px;
  }

  .project-gallery-kicker {
    margin: 0 0 8px;
    color: var(--accent);
    font-size: 0.68rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  .project-gallery-topbar h2 {
    margin: 0;
    font-family: var(--display);
    font-size: clamp(1.8rem, 4vw, 3.2rem);
    font-weight: 600;
    letter-spacing: -0.05em;
    text-transform: uppercase;
  }

  .project-gallery-close {
    min-height: 42px;
    padding: 0 14px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.04);
    color: var(--ink);
    font: inherit;
    cursor: pointer;
  }

  .project-gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .project-gallery-item {
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

  .project-gallery-item:hover,
  .project-gallery-item:focus-visible {
    transform: translateY(-3px);
    border-color: rgba(185, 255, 63, 0.5);
    background:
      linear-gradient(180deg, rgba(185, 255, 63, 0.12), rgba(255, 255, 255, 0.02)),
      #111411;
    outline: none;
  }

  .project-gallery-number {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 1px solid rgba(185, 255, 63, 0.35);
    color: var(--accent);
    font-family: var(--display);
    font-size: 0.9rem;
  }

  .project-gallery-copy {
    display: grid;
    gap: 5px;
  }

  .project-gallery-copy small {
    color: var(--muted);
    font-size: 0.66rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .project-gallery-copy strong {
    font-family: var(--display);
    font-size: clamp(1.1rem, 2vw, 1.45rem);
    font-weight: 600;
    letter-spacing: -0.04em;
    text-transform: uppercase;
  }

  .project-gallery-play {
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
    .project-gallery-grid {
      grid-template-columns: 1fr;
    }

    .project-gallery-item {
      min-height: 110px;
    }
  }

  @media (max-width: 520px) {
    .project-gallery-dialog {
      width: calc(100vw - 20px);
      max-height: calc(100vh - 20px);
    }

    .project-gallery-panel {
      padding: 18px;
    }

    .project-gallery-topbar {
      gap: 12px;
    }

    .project-gallery-close {
      min-width: 84px;
    }

    .project-gallery-item {
      grid-template-columns: auto 1fr auto;
      padding: 15px;
    }
  }
`;
document.head.appendChild(galleryStyles);

const setupProjectGallery = ({
  visualSelector,
  categoryName,
  labelText,
  titleText,
  typeText,
  videos,
}) => {
  const visual = document.querySelector(visualSelector);
  if (!visual) return;

  const card = visual.closest(".work-card");
  const trigger = visual.querySelector(".watch-button");
  const visualLabel = visual.querySelector(".visual-label");
  const cardTitle = card?.querySelector(".work-content h3");
  const workType = card?.querySelector(".work-type");

  if (!trigger) return;

  trigger.removeAttribute("data-video");
  trigger.removeAttribute("data-video-title");
  trigger.removeAttribute("data-video-format");
  trigger.setAttribute("aria-label", `Ver projetos de ${categoryName}`);
  trigger.innerHTML = '<span aria-hidden="true">▶</span> Ver projetos';

  if (visualLabel) visualLabel.textContent = labelText;
  if (cardTitle && titleText) cardTitle.textContent = titleText;
  if (workType && typeText) workType.textContent = typeText;

  const idBase = categoryName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const galleryDialog = document.createElement("dialog");
  galleryDialog.className = "project-gallery-dialog";
  galleryDialog.setAttribute("aria-labelledby", `${idBase}-gallery-title`);
  galleryDialog.innerHTML = `
    <div class="project-gallery-panel">
      <div class="project-gallery-topbar">
        <div>
          <p class="project-gallery-kicker">${categoryName}</p>
          <h2 id="${idBase}-gallery-title">Escolha um projeto</h2>
        </div>
        <button class="project-gallery-close" type="button" aria-label="Fechar galeria">Fechar ×</button>
      </div>
      <div class="project-gallery-grid" aria-label="Projetos de ${categoryName}"></div>
    </div>
  `;

  const galleryGrid = galleryDialog.querySelector(".project-gallery-grid");
  const galleryClose = galleryDialog.querySelector(".project-gallery-close");

  videos.forEach((video, index) => {
    const projectButton = document.createElement("button");
    projectButton.type = "button";
    projectButton.className = "project-gallery-item";
    projectButton.dataset.video = video.url;
    projectButton.dataset.videoTitle = `${categoryName} — ${video.label}`;
    projectButton.dataset.videoFormat = video.format || "vertical";
    projectButton.setAttribute("aria-label", `Assistir ${categoryName} — ${video.label}`);
    projectButton.innerHTML = `
      <span class="project-gallery-number">0${index + 1}</span>
      <span class="project-gallery-copy">
        <small>Projeto</small>
        <strong>${video.label}</strong>
      </span>
      <span class="project-gallery-play" aria-hidden="true">▶</span>
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

  trigger.addEventListener("click", () => galleryDialog.showModal());
  galleryClose.addEventListener("click", closeGallery);
  galleryDialog.addEventListener("click", (event) => {
    if (event.target === galleryDialog) closeGallery();
  });
  galleryDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeGallery();
  });
};

setupProjectGallery({
  visualSelector: ".visual-direct",
  categoryName: "Direct Response",
  labelText: "Direct response · 3 projetos",
  videos: [
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
  ],
});

setupProjectGallery({
  visualSelector: ".visual-short",
  categoryName: "Vídeos Virais",
  labelText: "Vídeos virais · 2 projetos",
  titleText: "Vídeos Virais",
  typeText: "TikTok · Instagram Reels · Conteúdo viral",
  videos: [
    {
      label: "Exemplo 1",
      url: "https://drive.google.com/file/d/1lnN0hxlTaZSnCNyowxlRyDjuaMGOc7Da/preview",
    },
    {
      label: "Exemplo 2",
      url: "https://drive.google.com/file/d/1nKhoR1OHOccjVoXP0njX10uVatjhTVdz/preview",
    },
  ],
});

document.querySelectorAll("[data-video]").forEach((button) => {
  if (!button.classList.contains("project-gallery-item")) {
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
