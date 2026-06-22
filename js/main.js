function initHamburger() {
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('nav-mobile-menu');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close menu when a link is clicked
  const links = mobileMenu.querySelectorAll('a');
  links.forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

function initCurtain() {
  const curtain = document.querySelector('.curtain');
  const toggleBtns = document.querySelectorAll('.toggle-btn');

  if (!curtain) return;

  // Detect page direction on load
  const currentChapter = document.documentElement.getAttribute('data-chapter');
  const direction = currentChapter === 'ireland' ? 'ind-to-ire' : 'ire-to-ind';

  // Dynamically inject boarding pass HTML
  curtain.innerHTML = `
    <div class="boarding-pass">
      <div class="boarding-header">
        <span class="pass-title">BOARDING PASS</span>
        <span class="flight-no">FLIGHT GB2025</span>
      </div>
      <div class="boarding-body">
        <div class="airport-code from">
          <span class="code">IND</span>
          <span class="city">India</span>
        </div>
        <div class="flight-path">
          <div class="dotted-line"></div>
          <div class="airplane-icon">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z" />
            </svg>
          </div>
        </div>
        <div class="airport-code to">
          <span class="code">IRE</span>
          <span class="city">Ireland</span>
        </div>
      </div>
      <div class="boarding-footer">
        <div class="passenger">
          <span class="label">PASSENGER</span>
          <span class="value">GAURAV BOOB</span>
        </div>
        <div class="gate">
          <span class="label">CLASS</span>
          <span class="value">FIRST</span>
        </div>
      </div>
    </div>
  `;

  // On page load, only perform entrance transition if we were switching chapters
  const isSwitching = sessionStorage.getItem('chapter-switching');
  if (isSwitching === 'true') {
    sessionStorage.removeItem('chapter-switching');
    const savedDirection = sessionStorage.getItem('switch-direction') || direction;
    sessionStorage.removeItem('switch-direction');

    curtain.classList.add(savedDirection);

    // Perform entrance transition by starting from covered state
    curtain.style.transition = 'none';
    curtain.classList.add('paused');

    // Force reflow
    curtain.offsetHeight;

    // Remove the temporary head style to re-enable transitions
    const tempStyle = document.getElementById('curtain-initial-style');
    if (tempStyle) tempStyle.remove();

    // Force reflow again
    curtain.offsetHeight;

    // Wait for a brief pause (600ms) before starting the slide down reveal
    setTimeout(() => {
      // Enable transition and slide down by removing paused and adding revealing
      curtain.style.transition = '';
      curtain.classList.remove('paused');
      curtain.classList.add('revealing');

      // Clean up classes after animation completes (2.4s transition)
      setTimeout(() => {
        curtain.style.transition = 'none';
        curtain.classList.remove('revealing');
        curtain.classList.remove(savedDirection);
        curtain.removeAttribute('data-target-chapter');

        // Force reflow to instantly place it at -100% (top)
        curtain.offsetHeight;
        curtain.style.transition = '';
      }, 2400);
    }, 600);
  } else {
    // If not switching, make sure the curtain starts off-screen and clean
    curtain.classList.remove('slide-down', 'revealing', 'paused', 'ind-to-ire', 'ire-to-ind');
    curtain.removeAttribute('data-target-chapter');
  }

  toggleBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const isActive = btn.classList.contains('active');
      if (isActive) return; // Do nothing if clicking active button

      const targetUrl = btn.dataset.target;

      // Determine click direction and set session storage
      const clickDirection = btn.id === 'btn-ireland' ? 'ind-to-ire' : 'ire-to-ind';
      const targetChapter = btn.id === 'btn-ireland' ? 'ireland' : 'india';

      sessionStorage.setItem('chapter-switching', 'true');
      sessionStorage.setItem('switch-direction', clickDirection);

      // Pre-set target chapter data attribute to color the curtain immediately without jump
      curtain.setAttribute('data-target-chapter', targetChapter);
      curtain.classList.add(clickDirection);

      // Reset curtain transition and slide down
      curtain.classList.remove('revealing');
      curtain.classList.add('slide-down');

      // Navigate after 2700ms (matching the 2.4s transition + 300ms pause)
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 2700);
    });
  });
}

function initTabs() {
  // Tab functionality no longer needed — using folder-based navigation
}

function initChapter() {
  const htmlElement = document.documentElement;
  const chapter = htmlElement.getAttribute('data-chapter');
  const indiaBtn = document.getElementById('btn-india');
  const irelandBtn = document.getElementById('btn-ireland');

  if (chapter === 'india' && indiaBtn) {
    indiaBtn.classList.add('active');
  } else if (chapter === 'ireland' && irelandBtn) {
    irelandBtn.classList.add('active');
  }
}

function initDarkMode() {
  const htmlElement = document.documentElement;
  htmlElement.setAttribute('data-theme', 'dark');
  localStorage.setItem('theme', 'dark');
}

function initNavScroll() {
  const hero = document.querySelector('.hero');
  const nav = document.querySelector('.site-nav');
  if (!hero || !nav) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        nav.classList.remove('nav-scrolled');
      } else {
        nav.classList.add('nav-scrolled');
      }
    },
    { threshold: 0.1 }
  );

  observer.observe(hero);
}

function initScrollReveals() {
  const elements = document.querySelectorAll('main h2, main p, .card, .timeline-item, main li');

  elements.forEach((el) => {
    // Avoid double revealing or styling elements that shouldn't be revealed
    if (el.closest('.hero') || el.closest('.site-nav') || el.closest('footer')) return;

    if (el.classList.contains('card') || el.classList.contains('timeline-item')) {
      el.classList.add('scroll-reveal');
    } else {
      // If it is inside a card or timeline-item, it is already animated by its parent container
      if (el.closest('.card') || el.closest('.timeline-item')) return;
      el.classList.add('scroll-reveal');
    }
  });

  // Group siblings to calculate stagger delays
  const parents = new Set();
  document.querySelectorAll('.scroll-reveal').forEach((el) => {
    parents.add(el.parentElement);
  });

  parents.forEach((parent) => {
    const reveals = parent.querySelectorAll(':scope > .scroll-reveal');
    reveals.forEach((el, index) => {
      el.style.setProperty('--reveal-delay', `${index * 60}ms`);
    });
  });

  // Set up IntersectionObserver
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.scroll-reveal').forEach((el) => {
    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHamburger();
  initCurtain();
  initTabs();
  initChapter();
  initDarkMode();
  initNavScroll();
  initScrollReveals();
});
