/* ==========================================================================
   WE GROW FOR EDUCATIONAL PURPOSE - JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbarScroll();
  initHeroSlider();
  initMobileMenu();
});

/* --------------------------------------------------------------------------
   DARK & LIGHT THEME TOGGLE LOGIC
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  if (!toggleBtn) return;

  const icon = toggleBtn.querySelector('i');
  const savedTheme = localStorage.getItem('wegrow_theme') || 'light';

  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (icon) icon.className = 'fa-solid fa-moon';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    if (icon) icon.className = 'fa-solid fa-sun';
  }

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('wegrow_theme', 'dark');
      if (icon) icon.className = 'fa-solid fa-moon';
      showToast('Switched to Dark Mode');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('wegrow_theme', 'light');
      if (icon) icon.className = 'fa-solid fa-sun';
      showToast('Switched to Light Mode');
    }
  });
}


/* --------------------------------------------------------------------------
   NAVBAR SCROLL & ACTIVE LINK
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link detection
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   HERO IMAGE SLIDER ROTATION
   -------------------------------------------------------------------------- */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;

  if (slides.length === 0) return;

  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 4000);
}

/* --------------------------------------------------------------------------
   MOBILE MENU TOGGLE
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('menuToggle');
  const navLinks = document.querySelector('.nav-links');
  if (!toggleBtn || !navLinks) return;

  const icon = toggleBtn.querySelector('i');

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = navLinks.classList.toggle('mobile-active');
    if (icon) {
      icon.className = isActive ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }
  });

  // Automatically close mobile menu when a navigation item is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-active');
      if (icon) icon.className = 'fa-solid fa-bars';
    });
  });

  // Close menu when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('mobile-active');
      if (icon) icon.className = 'fa-solid fa-bars';
    }
  });
}

/* --------------------------------------------------------------------------
   COURSE CATALOG FILTER LOGIC
   -------------------------------------------------------------------------- */
function filterCourses(category) {
  const cards = document.querySelectorAll('.course-card');
  const tabBtns = document.querySelectorAll('.tab-btn');

  // Update active tab button style
  tabBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('onclick').includes(`'${category}'`)) {
      btn.classList.add('active');
    }
  });

  // Filter cards
  cards.forEach(card => {
    const cardCategory = card.getAttribute('data-category');
    if (category === 'all' || cardCategory.includes(category)) {
      card.style.display = 'flex';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, 50);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.display = 'none';
      }, 200);
    }
  });
}

/* --------------------------------------------------------------------------
   SYLLABUS DATA & MODAL RENDERER
   -------------------------------------------------------------------------- */
const syllabusData = {
  'electrical-master': {
    title: 'Electrical Design Engineering Master Course',
    subtitle: 'ePLAN P8 2026 2D + EPLAN Pro Panel 3D + AutoCAD Electrical 2026 2D',
    duration: '3 Months (Classroom / Online)',
    prerequisites: 'Diploma / BE / B.Tech in EEE / ECE / E&I or Industry Practitioners',
    modules: [
      {
        heading: 'Module 1: Electrical Fundamentals & Motor Control Circuits',
        items: ['Understanding Single & 3-Phase Power Distribution', 'DOL (Direct On Line) Starter Design & Interlocks', 'Star-Delta Starter Schematics & Timer Configuration', 'Forward-Reverse Control Circuit Engineering', 'Overload Relays (OLR), Contactors & Protection Devices']
      },
      {
        heading: 'Module 2: ePLAN Electric P8 2026 2D Design',
        items: ['Creating Multi-line & Single-line Electrical Schematics', 'Automatic Cross-referencing of Relays & Contactors', 'PLC I/O Schematic Generation & Signal Tracking', 'Terminal Diagram & Cable Overview Report Generation', 'Bill of Materials (BOM) & Parts Database Management']
      },
      {
        heading: 'Module 3: EPLAN Pro Panel 3D 2026 Enclosure Layout',
        items: ['3D Control Panel Layout & Enclosure Selection', 'DIN Rail & Cable Duct Mounting & 3D Component Placement', '3D Wire Routing & Length Calculation', 'Drill Hole & Cable Gland Plate Engineering', 'Exporting Production Drawings & Thermal Calculation']
      },
      {
        heading: 'Module 4: AutoCAD 2026 2D Electrical Drafting',
        items: ['Ladder Diagrams & Schematic Symbols Library', '2D Panel Elevation Layouts & Dimensioning', 'Single Line Diagrams (SLD) for Industrial Plants']
      }
    ],
    outcomes: ['Electrical Control Panel Designer', 'ePLAN Specialist Engineer', 'Electrical CAD Draftsman', 'Automation Design Engineer']
  },
  'mechanical-master': {
    title: 'Mechanical Design Engineering Master Course',
    subtitle: 'SOLIDWORKS 3D + DS CATIA + PTC CREO Parametric',
    duration: '3 Months (Classroom / Online)',
    prerequisites: 'Diploma / BE / B.Tech in Mechanical / Automobile / Production',
    modules: [
      {
        heading: 'Module 1: 3D Parametric Part & Assembly Design',
        items: ['2D Sketching, Constraints & Dimensional Feature Modeling', 'Complex 3D Part Design (Shafts, Gears, Housings, Fasteners)', 'Bottom-Up & Top-Down Assembly Techniques', 'Interference Check & Explosion Animation View']
      },
      {
        heading: 'Module 2: Advanced Surface Design & Sheet Metal',
        items: ['Class-A Surface Modeling (CATIA Generative Shape Design)', 'Freeform Curves, Lofted Surfaces & Trimming', 'Sheet Metal Bends, Flanges, Punching & Unfolded Pattern', 'Tools, Jigs & Fixtures Design']
      },
      {
        heading: 'Module 3: Engineering Drawings & Motion Simulation',
        items: ['GD&T (Geometric Dimensioning & Tolerancing)', 'Bill of Materials (BOM) & Production Ballooning', 'Mechanism Kinematics & Stress Analysis (FEA Preview)']
      }
    ],
    outcomes: ['3D Mechanical Design Engineer', 'CAD Modeling Specialist', 'Automotive Surface Designer', 'Tooling & Fixture Designer']
  },
  'eplan-specialist': {
    title: 'ePLAN Electric P8 & 3D Pro Panel Specialist',
    subtitle: 'Advanced Control Cabinet & Schematics Engineering',
    duration: '6 Weeks (Classroom / Online)',
    prerequisites: 'Basic Electrical Knowledge',
    modules: [
      {
        heading: 'ePLAN P8 2026 Core Schematic Features',
        items: ['Macro Creation & PLC Schema Integration', 'Automatic Terminal & Cable Diagrams', 'PLC I/O Address Management & Import/Export']
      },
      {
        heading: 'EPLAN Pro Panel 3D Layout',
        items: ['Virtual 3D Cabinet Construction', '3D Routing & Collision Check', 'Production NC Machine Export Data']
      }
    ],
    outcomes: ['EPLAN Electrical Specialist', 'Control Panel Panel Builder']
  },
  'autocad-electrical': {
    title: 'AutoCAD Electrical 2026 Drafting Course',
    subtitle: '2D Schematic & Panel Elevation Drafting',
    duration: '1 Month',
    prerequisites: 'Basic Computer & Electrical Drafting Awareness',
    modules: [
      {
        heading: 'AutoCAD Electrical Toolset Training',
        items: ['Project Architecture & Schematic Drawing Setup', 'Wire Numbers & Signal Arrow Tagging', 'PLC Module Schematic Generation', '2D Panel Layout Footprints']
      }
    ],
    outcomes: ['AutoCAD Electrical Draftsman', 'Panel Layout Specialist']
  },
  'solidworks-specialist': {
    title: 'SOLIDWORKS 3D Design & Assembly',
    subtitle: 'Parametric Part & Machine Modeling',
    duration: '6 Weeks',
    prerequisites: 'Mechanical Engineering Background',
    modules: [
      {
        heading: 'SolidWorks Modules',
        items: ['Part Modeling & Extrusions/Revolves', 'Assembly Constraints & Mates', 'Production Drawing Views & GD&T', 'Sheet Metal & Weldments']
      }
    ],
    outcomes: ['SolidWorks CAD Modeler', 'Product Design Engineer']
  },
  'catia-creo-specialist': {
    title: 'CATIA & CREO Parametric 3D Specialist',
    subtitle: 'Surface, Automotive & Complex Machine Design',
    duration: '2 Months',
    prerequisites: 'Basic 3D CAD Knowledge',
    modules: [
      {
        heading: 'CATIA & CREO Design Suite',
        items: ['Part Design & Generative Shape Design (Surface)', 'Parametric Feature Tree & Relations in CREO', 'Automotive Body Component Design', 'Mechanism Kinematics & Simulation']
      }
    ],
    outcomes: ['CATIA Surface Modeler', 'CREO Design Engineer']
  }
};

function openSyllabusModal(courseKey) {
  const data = syllabusData[courseKey];
  if (!data) return;

  const contentDiv = document.getElementById('syllabusContent');
  
  let modulesHTML = '';
  data.modules.forEach(mod => {
    let itemsHTML = mod.items.map(item => `<li><i class="fa-solid fa-check-double text-gradient-green" style="margin-right: 8px;"></i>${item}</li>`).join('');
    modulesHTML += `
      <div style="margin-bottom: 1.25rem; background: rgba(255,255,255,0.03); padding: 1.2rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
        <h4 style="font-family: var(--font-heading); color: var(--primary); font-size: 1.05rem; margin-bottom: 0.6rem;">${mod.heading}</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.9rem; color: var(--text-muted);">
          ${itemsHTML}
        </ul>
      </div>
    `;
  });

  let outcomesHTML = data.outcomes.map(out => `<span style="background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); color: var(--primary); padding: 0.3rem 0.8rem; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 600;">${out}</span>`).join(' ');

  contentDiv.innerHTML = `
    <span class="section-tag" style="margin-bottom: 0.5rem;"><i class="fa-solid fa-book-bookmark"></i> Syllabus & Curriculum</span>
    <h3 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 700; margin-bottom: 0.4rem;" class="text-gradient-green">${data.title}</h3>
    <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1rem;">${data.subtitle}</p>

    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; font-size: 0.85rem; color: var(--text-main); background: rgba(255,255,255,0.04); padding: 0.8rem 1rem; border-radius: var(--radius-sm);">
      <div><i class="fa-regular fa-clock" style="color: var(--accent-gold);"></i> <strong>Duration:</strong> ${data.duration}</div>
      <div><i class="fa-solid fa-user-graduate" style="color: var(--primary);"></i> <strong>Eligibility:</strong> ${data.prerequisites}</div>
    </div>

    <h4 style="font-family: var(--font-heading); font-size: 1.1rem; margin-bottom: 0.75rem;">Course Modules & Hands-on Training:</h4>
    ${modulesHTML}

    <div style="margin-top: 1.5rem;">
      <h4 style="font-family: var(--font-heading); font-size: 1.05rem; margin-bottom: 0.6rem;">Career & Job Roles Unlocked:</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">${outcomesHTML}</div>
    </div>

    <div style="margin-top: 2rem; display: flex; gap: 1rem;">
      <button class="btn btn-primary" style="flex: 1;" onclick="closeModal('syllabusModal'); openEnrollModal('${data.title}')">
        <i class="fa-solid fa-graduation-cap"></i> Enroll In This Course
      </button>
    </div>
  `;

  document.getElementById('syllabusModal').classList.add('active');
}

/* --------------------------------------------------------------------------
   ENROLLMENT MODAL TRIGGER
   -------------------------------------------------------------------------- */
function openEnrollModal(courseTitle) {
  document.getElementById('modalSelectedCourse').value = courseTitle || 'General Course Inquiry';
  document.getElementById('enrollModal').classList.add('active');
}

/* --------------------------------------------------------------------------
   LIGHTBOX MODAL FOR CAD SHOWCASE
   -------------------------------------------------------------------------- */
function openLightbox(imageSrc, title) {
  document.getElementById('lightboxImg').src = imageSrc;
  document.getElementById('lightboxTitle').textContent = title;
  document.getElementById('lightboxModal').classList.add('active');
}

/* --------------------------------------------------------------------------
   GENERIC MODAL CLOSE
   -------------------------------------------------------------------------- */
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// Close modals when clicking outside card
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
    }
  });
});

/* --------------------------------------------------------------------------
   CONTACT & ENROLLMENT FORM SUBMISSION HANDLERS (FORMSPREE INTEGRATION)
   -------------------------------------------------------------------------- */
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xdekgkep';

async function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = document.getElementById('contactSubmitBtn');
  const originalBtnText = submitBtn.innerHTML;

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

  try {
    const formData = new FormData(form);
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      showToast('Thank you! Your course inquiry has been sent to WE GROW Academy.');
      form.reset();
    } else {
      const data = await response.json();
      if (data && data.errors) {
        showToast('Error: ' + data.errors.map(err => err.message).join(', '));
      } else {
        showToast('Oops! There was a problem submitting your inquiry.');
      }
    }
  } catch (error) {
    showToast('Network error! Please check your connection or call +91 7708282147.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}

async function handleModalEnrollSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = document.getElementById('modalSubmitBtn');
  const originalBtnText = submitBtn.innerHTML;

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Reserving Seat...';

  try {
    const formData = new FormData(form);
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      closeModal('enrollModal');
      showToast('Seat Reservation Application Submitted Successfully!');
      form.reset();
    } else {
      showToast('Oops! Problem submitting seat reservation.');
    }
  } catch (error) {
    showToast('Network error! Please check your connection or call +91 7708282147.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }
}

/* --------------------------------------------------------------------------
   DYNAMIC TOAST NOTIFICATION
   -------------------------------------------------------------------------- */
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMessage');
  toastMsg.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}
