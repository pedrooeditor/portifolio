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

document.querySelectorAll("[data-video]").forEach((button) => {
  button.addEventListener("click", () => openVideo(button));
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
