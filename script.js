const header = document.querySelector('.header');
const navToggleBtn = document.querySelector('.nav-toggle-btn');
const navbar = document.querySelector('.navbar');
const backTopBtn = document.querySelector('.back-top-btn');
const uploadBtn = document.getElementById('uploadTriggerBtn');
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const previewImage = document.getElementById('previewImage');
const defaultText = document.getElementById('defaultText');

// Data
const plants = [
  { name: "Holy Basil (Tulsi)", image: "images/tulsi.jpeg", description: "The 'Queen of Herbs' known for its adaptogenic properties and stress relief.", properties: ["Adaptogen", "Immunity", "Stress Relief"] },
  { name: "Ashwagandha", image: "images/ashwagandha.jpeg", description: "Ancient rejuvenating herb that helps combat stress and boost energy.", properties: ["Adaptogen", "Energy", "Anti-stress"] },
  { name: "Turmeric (Haldi)", image: "images/turmeric.jpeg", description: "Powerful anti-inflammatory with numerous health benefits.", properties: ["Anti-inflammatory", "Antioxidant", "Digestive"] },
  { name: "Neem", image: "images/neem.jpeg", description: "Purifying herb with antibacterial and blood-purifying properties.", properties: ["Antibacterial", "Skin Health", "Detox"] },
  { name: "Brahmi", image: "images/brahmi.jpeg", description: "Cognitive enhancer that improves memory and brain function.", properties: ["Brain Health", "Memory", "Nervous System"] },
  { name: "Amla", image: "images/amla.jpeg", description: "Rich in Vitamin C and powerful antioxidant properties.", properties: ["Immunity", "Anti-aging", "Digestive"] }
];

const remedies = [
  { name: "Tulsi Tea", description: "Immunity-boosting herbal tea made with holy basil leaves.", benefits: ["Stress relief", "Respiratory health", "Immunity booster"] },
  { name: "Ashwagandha Powder", description: "Adaptogenic powder to combat stress and improve energy.", benefits: ["Stress reduction", "Energy boost", "Hormonal balance"] },
  { name: "Turmeric Milk", description: "Golden milk with anti-inflammatory properties.", benefits: ["Joint pain relief", "Immunity", "Digestive health"] }
];

function renderPlants() {
  const plantsGrid = document.querySelector('.plants-grid');
  plantsGrid.innerHTML = '';
  plants.forEach(plant => {
    const plantCard = document.createElement('div');
    plantCard.className = 'plant-card';
    plantCard.innerHTML = `
      <div class="plant-img"><img src="${plant.image}" alt="${plant.name}" loading="lazy"></div>
      <div class="plant-content">
        <h3 class="plant-name">${plant.name}</h3>
        <p class="plant-desc">${plant.description}</p>
        <div class="plant-properties">
          ${plant.properties.map(p => `<span class="property">${p}</span>`).join('')}
        </div>
      </div>
    `;
    plantsGrid.appendChild(plantCard);
  });
}

function renderRemedies() {
  const remediesGrid = document.querySelector('.remedies-grid');
  remediesGrid.innerHTML = '';
  remedies.forEach(remedy => {
    const remedyCard = document.createElement('div');
    remedyCard.className = 'remedy-card';
    remedyCard.innerHTML = `
      <div class="remedy-content">
        <h3 class="remedy-name">${remedy.name}</h3>
        <p class="remedy-desc">${remedy.description}</p>
        <div class="plant-properties">
          ${remedy.benefits.map(b => `<span class="property">${b}</span>`).join('')}
        </div>
      </div>
    `;
    remediesGrid.appendChild(remedyCard);
  });
}

function toggleNavbar() {
  navbar.classList.toggle('active');
  navToggleBtn.classList.toggle('active');
  document.body.classList.toggle('no-scroll');
}

function headerScroll() {
  const scrolled = window.scrollY > 10;
  header.classList.toggle('active', scrolled);
  backTopBtn.classList.toggle('active', scrolled);
}

function isUserLoggedIn() {
  return localStorage.getItem('userLoggedIn') === 'true';
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.match('image.*')) return showToast('Please select a valid image.');
  if (file.size > 5 * 1024 * 1024) return showToast('Image must be less than 5MB');

  const reader = new FileReader();
  reader.onload = e => {
    previewImage.src = e.target.result;
    previewImage.style.display = 'block';
    defaultText.style.display = 'none';
    localStorage.setItem('uploadedImage', e.target.result);
  };
  reader.onerror = () => {
    showToast('Error loading file');
    resetImageUpload();
  };
  reader.readAsDataURL(file);
}

function resetImageUpload() {
  previewImage.style.display = 'none';
  defaultText.style.display = 'block';
  previewImage.src = '';
  imageUpload.value = '';
}

function loadSavedImage() {
  const savedImage = localStorage.getItem('uploadedImage');
  if (isUserLoggedIn() && savedImage) {
    previewImage.src = savedImage;
    previewImage.style.display = 'block';
    defaultText.style.display = 'none';
  } else {
    resetImageUpload();
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }, 10);
}

function setupEventListeners() {
  navToggleBtn.addEventListener('click', toggleNavbar);
  window.addEventListener('scroll', headerScroll);
  document.querySelectorAll('.navbar-link').forEach(link => link.addEventListener('click', toggleNavbar));
  backTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  document.querySelector('.close-popup').addEventListener('click', () => {
    document.getElementById('loginPopup').style.display = 'none';
  });

  document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    localStorage.setItem('userLoggedIn', 'true');
    document.getElementById('loginPopup').style.display = 'none';
    alert('Login successful!');
  });

  document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    localStorage.setItem('userLoggedIn', 'true');
    document.getElementById('loginPopup').style.display = 'none';
    alert('Registration successful!');
  });

  document.getElementById('showRegister').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
  });

  document.getElementById('showLogin').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
  });

  if (uploadBtn) {
    uploadBtn.addEventListener('click', function () {
      if (!isUserLoggedIn()) {
        document.getElementById('loginPopup').style.display = 'flex';
      } else {
        imageUpload.click();
      }
    });
  }

  if (imageUpload) {
    imageUpload.addEventListener('change', handleImageUpload);
  }
}

// Clear login + image on refresh
window.addEventListener('beforeunload', function () {
  localStorage.removeItem('userLoggedIn');
  localStorage.removeItem('uploadedImage');
});


document.addEventListener('DOMContentLoaded', () => {
  renderPlants();
  renderRemedies();
  loadSavedImage();
  setupEventListeners();
});
