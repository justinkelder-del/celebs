const galleries = [
  {
    id: "portfolio-a",
    name: "Portfolio A",
    description: "A clean, modern collection with bright tones and an airy editorial feel.",
    cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "portfolio-b",
    name: "Portfolio B",
    description: "Warm, artistic imagery with a more intimate and story-driven tone.",
    cover: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516589091380-5d8e87df6999?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "portfolio-c",
    name: "Portfolio C",
    description: "Bold, cinematic images with deeper contrast and a dramatic mood.",
    cover: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1200&q=80"
    ]
  }
];

const defaultVotes = {
  "portfolio-a": 12,
  "portfolio-b": 18,
  "portfolio-c": 9
};

const VOTES_KEY = "portfolioVotesDemo";
const MY_VOTE_KEY = "portfolioMyVoteDemo";

let votes = loadVotes();
let myVote = localStorage.getItem(MY_VOTE_KEY) || null;
let selectedGallery = null;
let selectedImage = null;

const galleryGrid = document.getElementById("galleryGrid");
const totalVotesEl = document.getElementById("totalVotes");
const yourVotePill = document.getElementById("yourVotePill");

const modal = document.getElementById("galleryModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const closeModalBtn = document.getElementById("closeModal");
const modalMainImage = document.getElementById("modalMainImage");
const modalThumbGrid = document.getElementById("modalThumbGrid");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalVotes = document.getElementById("modalVotes");
const modalPercent = document.getElementById("modalPercent");
const modalProgress = document.getElementById("modalProgress");
const modalVoteButton = document.getElementById("modalVoteButton");

function loadVotes() {
  try {
    const saved = JSON.parse(localStorage.getItem(VOTES_KEY));
    if (saved && typeof saved === "object") {
      return { ...defaultVotes, ...saved };
    }
  } catch (err) {}
  return { ...defaultVotes };
}

function saveVotes() {
  localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
}

function getTotalVotes() {
  return Object.values(votes).reduce((sum, value) => sum + value, 0);
}

function getLeadingVoteCount() {
  return Math.max(...Object.values(votes));
}

function votePercent(galleryId) {
  const total = getTotalVotes();
  return total ? Math.round((votes[galleryId] / total) * 100) : 0;
}

function renderTopStats() {
  totalVotesEl.textContent = getTotalVotes();
  if (myVote) {
    const match = galleries.find((gallery) => gallery.id === myVote);
    yourVotePill.textContent = match ? `Your vote: ${match.name}` : "Vote recorded";
  } else {
    yourVotePill.textContent = "No vote yet";
  }
}

function renderCards() {
  const leading = getLeadingVoteCount();

  galleryGrid.innerHTML = galleries.map((gallery) => {
    const isLeading = votes[gallery.id] === leading;
    const voted = myVote === gallery.id;
    return `
      <article class="card">
        <div class="card-cover-wrap">
          <img
            src="${gallery.cover}"
            alt="${gallery.name}"
            class="card-cover"
            data-action="open-gallery"
            data-gallery-id="${gallery.id}"
          />
          ${isLeading ? '<div class="leading-badge">Leading</div>' : ""}
        </div>

        <div class="card-body">
          <div class="card-top">
            <div>
              <h3>${gallery.name}</h3>
              <p class="card-description">${gallery.description}</p>
            </div>
            <div class="photo-count">${gallery.images.length} photos</div>
          </div>

          <div class="preview-grid">
            ${gallery.images.slice(0, 3).map((image, index) => `
              <img
                src="${image}"
                alt="${gallery.name} preview ${index + 1}"
                data-action="open-image"
                data-gallery-id="${gallery.id}"
                data-image-src="${image}"
              />
            `).join("")}
          </div>

          <div class="vote-row">
            <span>${votes[gallery.id]} votes</span>
            <strong>${votePercent(gallery.id)}%</strong>
          </div>
          <div class="progress">
            <div class="progress-bar" style="width:${votePercent(gallery.id)}%"></div>
          </div>

          <div class="card-actions">
            <button class="secondary-btn" data-action="open-gallery" data-gallery-id="${gallery.id}">
              View gallery
            </button>
            <button class="primary-btn" data-action="vote" data-gallery-id="${gallery.id}">
              ${voted ? "Voted" : "Vote now"}
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function openModal(galleryId, imageSrc = null) {
  selectedGallery = galleries.find((gallery) => gallery.id === galleryId);
  if (!selectedGallery) return;

  selectedImage = imageSrc || selectedGallery.images[0];
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  renderModal();
}

function closeModal() {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  selectedGallery = null;
  selectedImage = null;
}

function renderModal() {
  if (!selectedGallery) return;

  modalTitle.textContent = selectedGallery.name;
  modalDescription.textContent = selectedGallery.description;
  modalMainImage.src = selectedImage;
  modalMainImage.alt = selectedGallery.name;
  modalVotes.textContent = votes[selectedGallery.id];
  modalPercent.textContent = `${votePercent(selectedGallery.id)}%`;
  modalProgress.style.width = `${votePercent(selectedGallery.id)}%`;
  modalVoteButton.textContent = myVote === selectedGallery.id
    ? "You voted for this portfolio"
    : `Vote for ${selectedGallery.name}`;

  modalThumbGrid.innerHTML = selectedGallery.images.map((image, index) => `
    <img
      src="${image}"
      alt="${selectedGallery.name} ${index + 1}"
      class="${image === selectedImage ? "active" : ""}"
      data-action="select-modal-image"
      data-image-src="${image}"
    />
  `).join("");
}

function submitVote(galleryId) {
  if (myVote === galleryId) return;

  if (myVote && votes[myVote] > 0) {
    votes[myVote] -= 1;
  }

  votes[galleryId] += 1;
  myVote = galleryId;

  localStorage.setItem(MY_VOTE_KEY, myVote);
  saveVotes();
  renderAll();

  if (selectedGallery) {
    selectedGallery = galleries.find((gallery) => gallery.id === galleryId) || selectedGallery;
    renderModal();
  }
}

function renderAll() {
  renderTopStats();
  renderCards();
}

galleryGrid.addEventListener("click", (event) => {
  const actionEl = event.target.closest("[data-action]");
  if (!actionEl) return;

  const action = actionEl.dataset.action;
  const galleryId = actionEl.dataset.galleryId;
  const imageSrc = actionEl.dataset.imageSrc;

  if (action === "open-gallery") {
    openModal(galleryId);
  }

  if (action === "open-image") {
    openModal(galleryId, imageSrc);
  }

  if (action === "vote") {
    submitVote(galleryId);
  }
});

modalThumbGrid.addEventListener("click", (event) => {
  const imageEl = event.target.closest("[data-action='select-modal-image']");
  if (!imageEl) return;

  selectedImage = imageEl.dataset.imageSrc;
  renderModal();
});

modalVoteButton.addEventListener("click", () => {
  if (selectedGallery) {
    submitVote(selectedGallery.id);
  }
});

modalBackdrop.addEventListener("click", closeModal);
closeModalBtn.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

renderAll();
