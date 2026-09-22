/* ==========================================================================
   WE GROW FOR EDUCATIONAL PURPOSE - JAVASCRIPT LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initNavbarScroll();
  initHeroSlider();
  initMobileMenu();
  // Prevent tel: telephone links from opening on desktop view (> 992px)
  document.addEventListener('click', (e) => {
    const telLink = e.target.closest('a[href^="tel:"]');
    if (telLink && window.innerWidth > 992) {
      e.preventDefault();
      showToast('Call functionality is available on mobile and tablet devices.');
    }
  });
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
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link detection (only on pages with multiple main sections)
    if (sections.length > 2) {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute('id');
        }
      });

      if (current) {
        navLinks.forEach(link => {
          const href = link.getAttribute('href') || '';
          if (href === `#${current}` || href === `./index.html#${current}`) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      }
    }
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
  'eplan-2d': {
    title: 'Eplan P8 2026 (2D Electrical Schematics)',
    subtitle: 'Industrial Schematic Engineering & Auto-Documentation',
    duration: '1 Month (Online / Offline)',
    schedule: 'Online: Weekdays 7:00 PM - 8:00 PM (Flexible) | Offline: Sat & Sun (Flexible)',
    prerequisites: 'Basic Electrical Knowledge',
    modules: [
      {
        heading: 'Eplan P8 2026 Core Schematic Curriculum',
        items: ['Multi-line & Single-line Circuit Schematics', 'Automatic Contact Cross-referencing & PLC Schema', 'Cable Overview Reports, Terminal Diagrams & BOM Export']
      }
    ],
    outcomes: ['ePLAN Electrical Engineer', 'Schematics Design Engineer']
  },
  'eplan-3d': {
    title: 'Eplan P8 3D 2026 (EPLAN Pro Panel 3D)',
    subtitle: '3D Control Cabinet Construction & Wire Routing',
    duration: '1 Month (Online / Offline)',
    schedule: 'Online: Weekdays 7:00 PM - 8:00 PM (Flexible) | Offline: Sat & Sun (Flexible)',
    prerequisites: 'Basic Electrical CAD Awareness',
    modules: [
      {
        heading: 'EPLAN Pro Panel 3D Cabinet Design',
        items: ['3D Cabinet Placement & Component Mounting', 'Virtual 3D Wire Routing & Length Calculation', 'Collision Checks & Drill Hole Export for NC Machines']
      }
    ],
    outcomes: ['3D Panel Builder Engineer', 'Cabinet Layout Specialist']
  },
  'autocad-electrical': {
    title: 'AutoCAD Electrical 2D 2026 Drafting',
    subtitle: 'Industrial 2D Electrical Schematic & Panel Elevation',
    duration: '1 Month (Online / Offline)',
    schedule: 'Online: Weekdays 7:00 PM - 8:00 PM (Flexible) | Offline: Sat & Sun (Flexible)',
    prerequisites: 'Basic Computer & Electrical Drafting Awareness',
    modules: [
      {
        heading: 'AutoCAD Electrical 2D 2026 Toolset',
        items: ['Project Architecture & Schematic Drawing Setup', 'Wire Numbers & Signal Arrow Tagging', 'PLC Module Schematic Generation & 2D Panel Layout Footprints']
      }
    ],
    outcomes: ['AutoCAD Electrical Draftsman', 'Control Panel Layout Draftsman']
  },
  'autocad-mechanical': {
    title: 'AutoCAD Mechanical 2D 2026 Drafting',
    subtitle: 'Precision Mechanical Drafting & Standard Machine Components',
    duration: '1 Month (Online / Offline)',
    schedule: 'Online: Weekdays 7:00 PM - 8:00 PM (Flexible) | Offline: Sat & Sun (Flexible)',
    prerequisites: 'Basic Engineering Drawing Awareness',
    modules: [
      {
        heading: 'AutoCAD Mechanical 2D 2026 Curriculum',
        items: ['Mechanical Drafting Tools & Layer Management', 'Standard Machinery Parts Library (Screws, Gears, Bearings)', 'Dimensioning, Limits, Fits & Surface Finish Symbols']
      }
    ],
    outcomes: ['AutoCAD Mechanical Draftsman', 'Mechanical Detailer']
  },
  'creo-3d': {
    title: 'Creo 3D (PTC Creo Parametric 3D)',
    subtitle: 'Parametric Part, Assembly & Surface Modeling',
    duration: '1 Month (Online / Offline)',
    schedule: 'Online: Weekdays 7:00 PM - 8:00 PM (Flexible) | Offline: Sat & Sun (Flexible)',
    prerequisites: 'Basic Mechanical Design Background',
    modules: [
      {
        heading: 'PTC Creo 3D Modules',
        items: ['Parametric Feature Tree & Relations', 'Complex Part Design & Machine Assemblies', 'Exploded Animation & Production Drawing Views']
      }
    ],
    outcomes: ['Creo Design Engineer', 'Parametric CAD Modeler']
  },
  'catia-3d': {
    title: 'Catia 3D (DS CATIA 3D & Surface Design)',
    subtitle: 'Automotive Body Component & Class-A Surface Modeling',
    duration: '1 Month (Online / Offline)',
    schedule: 'Online: Weekdays 7:00 PM - 8:00 PM (Flexible) | Offline: Sat & Sun (Flexible)',
    prerequisites: 'Basic 3D CAD Knowledge',
    modules: [
      {
        heading: 'DS CATIA V5/V6 Design Suite',
        items: ['Part Design & Generative Shape Design (Surface)', 'Automotive Body Component Modeling', 'Kinematic Mechanism Simulation']
      }
    ],
    outcomes: ['CATIA Surface Modeler', 'Automotive Design Engineer']
  },
  'solidworks-3d': {
    title: 'SolidWorks 3D Design & Assembly',
    subtitle: 'Parametric 3D Machine & Sheet Metal Modeling',
    duration: '1 Month (Online / Offline)',
    schedule: 'Online: Weekdays 7:00 PM - 8:00 PM (Flexible) | Offline: Sat & Sun (Flexible)',
    prerequisites: 'Mechanical Engineering Background',
    modules: [
      {
        heading: 'SolidWorks 3D Modules',
        items: ['Part Modeling, Extrusions & Revolves', 'Assembly Mates & Constraints', 'Production Drawings, Sheet Metal & Weldments']
      }
    ],
    outcomes: ['SolidWorks CAD Modeler', 'Product Design Engineer']
  },
  'inventor-3d': {
    title: 'Inventor 3D (Autodesk Inventor 3D)',
    subtitle: '3D Mechanical Machine & Tooling Design',
    duration: '1 Month (Online / Offline)',
    schedule: 'Online: Weekdays 7:00 PM - 8:00 PM (Flexible) | Offline: Sat & Sun (Flexible)',
    prerequisites: 'Basic Mechanical Drafting Background',
    modules: [
      {
        heading: 'Autodesk Inventor 3D Curriculum',
        items: ['Parametric 3D Part & Assembly Modeling', 'Frame Generator & Sheet Metal Design', 'Stress Analysis & Presentation Animations']
      }
    ],
    outcomes: ['Autodesk Inventor Specialist', 'Machine Design Engineer']
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

    <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem; font-size: 0.85rem; color: var(--text-main); background: rgba(255,255,255,0.04); padding: 0.8rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
      <div><i class="fa-regular fa-clock" style="color: var(--accent-gold); margin-right: 6px;"></i> <strong>Duration:</strong> ${data.duration}</div>
      <div><i class="fa-solid fa-calendar-check" style="color: var(--primary); margin-right: 6px;"></i> <strong>Batch Timings:</strong> ${data.schedule}</div>
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
