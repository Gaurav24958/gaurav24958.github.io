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

function initLifePage() {
  if (window.innerWidth <= 768) return;

  const track = document.querySelector('.life-track');
  if (!track) return;

  const container = document.querySelector('.life-scroll-container');
  const panels = document.querySelectorAll('.chapter-panel');
  const nav = document.getElementById('life-nav');
  const navDot = document.getElementById('nav-dot');
  const labelLeft = document.getElementById('nav-label-left');
  const labelRight = document.getElementById('nav-label-right');

  if (!container || panels.length === 0 || !nav || !navDot || !labelLeft || !labelRight) return;

  const chapters = [
    { name: 'Childhood' },
    { name: 'High School' },
    { name: 'College' },
    { name: 'Work' },
    { name: 'Ireland' }
  ];

  // State
  let targetX = 0;
  let currentX = 0;
  let dotLeft = 0;
  let displayedChapterIndex = 0;
  let isTransitioning = false;

  // Set initial labels
  labelLeft.textContent = chapters[0].name;
  labelRight.textContent = chapters[1].name;

  // Mobile Intersection Observer for scroll reveals
  const mobileObserver = new IntersectionObserver((entries) => {
    if (window.innerWidth <= 768) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-active');
        }
      });
    }
  }, {
    threshold: 0.15
  });

  panels.forEach(panel => {
    mobileObserver.observe(panel);
  });

  // Main scroll loop
  function updateScroll() {
    if (window.innerWidth <= 768) {
      // Mobile cleanup
      track.style.transform = '';
      nav.style.opacity = '';
      requestAnimationFrame(updateScroll);
      return;
    }

    const rect = container.getBoundingClientRect();
    const scrollTop = window.scrollY;

    // Absolute position of the container top
    const containerTop = rect.top + scrollTop;
    const scrollRange = rect.height - window.innerHeight;
    const scrollOffset = scrollTop - containerTop;

    // Calculate progress (0 to 1)
    let progress = scrollOffset / scrollRange;
    progress = Math.max(0, Math.min(1, progress));

    // Show/hide navigation based on scroll offset (hide during intro section and when footer is visible)
    if (scrollOffset < 0 || progress >= 0.99) {
      nav.style.opacity = '0';
      nav.style.pointerEvents = 'none';
    } else {
      nav.style.opacity = '1';
      nav.style.pointerEvents = 'auto';
    }

    // Calculate target translation (translates left by 400vw)
    const maxTranslate = (panels.length - 1) * window.innerWidth;
    targetX = -progress * maxTranslate;

    // Lerp translation
    currentX += (targetX - currentX) * 0.08;
    track.style.transform = `translateX(${currentX}px)`;

    // Calculate current chapter index
    const chapterHeight = window.innerHeight;
    const currentIdx = Math.max(0, Math.min(panels.length - 1, Math.floor(scrollOffset / chapterHeight)));

    // Trigger blur transition if chapter index changes
    if (currentIdx !== displayedChapterIndex && !isTransitioning) {
      isTransitioning = true;
      const labelsWrapper = nav.querySelector('.life-nav-labels');
      if (labelsWrapper) {
        labelsWrapper.classList.add('is-blurring');
      }

      setTimeout(() => {
        displayedChapterIndex = currentIdx;

        // Update labels
        labelLeft.textContent = chapters[displayedChapterIndex].name;
        labelRight.textContent = displayedChapterIndex < chapters.length - 1 ? chapters[displayedChapterIndex + 1].name : '';

        // Unblur labels
        if (labelsWrapper) {
          labelsWrapper.classList.remove('is-blurring');
        }

        setTimeout(() => {
          isTransitioning = false;
        }, 250);
      }, 250);
    }

    // Lerp dot position smoothly across the entire range
    const targetDotProgress = progress * 100;
    dotLeft += (targetDotProgress - dotLeft) * 0.1;
    nav.style.setProperty('--dot-progress', `${dotLeft}%`);

    // Trigger entrance animation for panels when they enter the viewport
    panels.forEach((panel, idx) => {
      const panelRect = panel.getBoundingClientRect();
      if (panelRect.left < window.innerWidth * 0.8 && panelRect.right > window.innerWidth * 0.2) {
        panel.classList.add('is-active');
      }
    });

    requestAnimationFrame(updateScroll);
  }

  // Start loop
  requestAnimationFrame(updateScroll);
}

function initLifePageMobile() {
  if (window.innerWidth > 768) return;

  const container = document.querySelector('.life-scroll-container');
  const panels = document.querySelectorAll('.chapter-panel');
  if (!container || panels.length === 0) return;

  const chapters = [
    { name: 'Childhood' },
    { name: 'High School' },
    { name: 'College' },
    { name: 'Work' },
    { name: 'Ireland' }
  ];

  // Set height for scrolling
  const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 70;
  container.style.height = `${(window.innerHeight - navHeight) * (panels.length + 1) + navHeight}px`;

  // Inject horizontal mobile progress bar dynamically
  if (!document.querySelector('.life-nav-mobile')) {
    const mobileNavHTML = `
      <div class="life-nav-mobile" aria-hidden="true">
        <div class="life-nav-mobile-labels">
          <span class="life-nav-mobile-label left" id="nav-label-left-mobile">Childhood</span>
          <span class="life-nav-mobile-label right" id="nav-label-right-mobile">High School</span>
        </div>
        <div class="life-nav-mobile__track">
          <div class="life-nav-mobile-dot" id="nav-dot-mobile"></div>
        </div>
      </div>
    `;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = mobileNavHTML.trim();
    document.body.appendChild(tempDiv.firstChild);
  }

  const navMobile = document.querySelector('.life-nav-mobile');

  let activeIndex = -1;

  // Set initial panel states
  panels.forEach((panel, i) => {
    if (i === 0) {
      panel.classList.add('is-active');
      panel.classList.remove('is-above', 'is-below');
    } else {
      panel.classList.add('is-below');
      panel.classList.remove('is-active', 'is-above');
    }
  });

  function handleMobileScroll() {
    if (window.innerWidth > 768) return;

    const scrollTop = window.scrollY;
    const rect = container.getBoundingClientRect();
    const scrollOffset = navHeight - rect.top;
    const panelScrollHeight = window.innerHeight - navHeight;
    const scrollRange = rect.height - (window.innerHeight - navHeight);

    let progress = scrollOffset / scrollRange;
    progress = Math.max(0, Math.min(1, progress));

    const chapterIndex = Math.max(0, Math.min(panels.length - 1, Math.floor(scrollOffset / panelScrollHeight)));

    if (chapterIndex !== activeIndex) {
      panels.forEach((panel, i) => {
        if (i < chapterIndex) {
          panel.classList.add('is-above');
          panel.classList.remove('is-active', 'is-below');
        } else if (i === chapterIndex) {
          panel.classList.add('is-active');
          panel.classList.remove('is-above', 'is-below');
        } else {
          panel.classList.add('is-below');
          panel.classList.remove('is-active', 'is-above');
        }
      });

      // Update mobile labels
      const labelLeftMobile = document.getElementById('nav-label-left-mobile');
      const labelRightMobile = document.getElementById('nav-label-right-mobile');
      if (labelLeftMobile && labelRightMobile) {
        const labelsWrapperMobile = document.querySelector('.life-nav-mobile-labels');
        if (labelsWrapperMobile) {
          labelsWrapperMobile.classList.add('is-blurring');
        }

        setTimeout(() => {
          labelLeftMobile.textContent = chapters[chapterIndex].name;
          labelRightMobile.textContent = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1].name : '';

          if (labelsWrapperMobile) {
            labelsWrapperMobile.classList.remove('is-blurring');
          }
        }, 200);
      }

      activeIndex = chapterIndex;
    }

    // Update dot position
    if (navMobile) {
      const dotProgress = progress * 100;
      navMobile.style.setProperty('--dot-progress-mobile', `${dotProgress}%`);
    }

    // Show/hide navigation based on boundaries
    if (navMobile) {
      if (scrollOffset < 0 || progress >= 0.99) {
        navMobile.style.opacity = '0';
        navMobile.style.pointerEvents = 'none';
      } else {
        navMobile.style.opacity = '1';
        navMobile.style.pointerEvents = 'auto';
      }
    }
  }

  // Listen to scroll events
  window.addEventListener('scroll', handleMobileScroll, { passive: true });

  // Call initially to set correct state
  handleMobileScroll();
}

function initTypingAnimation() {
  const typedSpan = document.getElementById('typed-text');
  if (!typedSpan) return;

  const words = [
    'Full-Stack Developer.',
    'Curious Optimist.',
    'Problem Solver.'
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;
  let erasingDelay = 50;
  let newWordDelay = 2000;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typedSpan.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = erasingDelay;
    } else {
      typedSpan.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingDelay = newWordDelay;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingDelay = 500;
    }

    setTimeout(type, typingDelay);
  }

  setTimeout(type, 1000);
}

function initLifeIrelandLink() {
  const journeyLink = document.getElementById('take-to-ireland-journey');
  if (journeyLink) {
    journeyLink.addEventListener('click', (e) => {
      e.preventDefault();
      const btnIreland = document.getElementById('btn-ireland');
      if (btnIreland) {
        btnIreland.click();
      } else {
        window.location.href = '/ireland/';
      }
    });
  }
}

function initLifeNavbarScroll() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  const handleScroll = () => {
    if (window.scrollY > 10) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Call initially
}

function initDynamicDurations() {
  const elements = document.querySelectorAll('.dynamic-duration');
  elements.forEach(el => {
    const startDateStr = el.getAttribute('data-start-date');
    if (!startDateStr) return;
    // Use 'YYYY-MM-DD' format (e.g., '2025-01-01' -> parsed in local timezone if formatted correctly)
    // To prevent timezone offsets from shifting the month, we can parse manually or use new Date(year, monthIndex)
    const parts = startDateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed month
    const startDate = new Date(year, month, 1);
    const endDate = new Date();
    
    const totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    
    let durationStr = "";
    if (years > 0) {
      durationStr += `${years} yr${years > 1 ? 's' : ''}`;
    }
    if (months > 0) {
      if (durationStr) durationStr += " ";
      durationStr += `${months} mos`;
    }
    if (!durationStr) {
      durationStr = "0 mos";
    }
    
    el.textContent = durationStr;
  });
}

function initJourneyTransitions() {
  const link = document.querySelector('.journey-back-link a');
  const curtain = document.querySelector('.curtain');
  if (!link || !curtain) return;

  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetUrl = link.getAttribute('href');

    const clickDirection = 'ire-to-ind';
    const targetChapter = 'india';

    sessionStorage.setItem('chapter-switching', 'true');
    sessionStorage.setItem('switch-direction', clickDirection);

    // Trigger curtain transition
    curtain.setAttribute('data-target-chapter', targetChapter);
    curtain.classList.add(clickDirection);
    curtain.classList.remove('revealing');
    curtain.classList.add('slide-down');

    setTimeout(() => {
      window.location.href = targetUrl;
    }, 2700);
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
  initLifePage();
  initLifePageMobile();
  initLifeIrelandLink();
  initLifeNavbarScroll();
  initTypingAnimation();
  initDynamicDurations();
  initJourneyTransitions();
});
