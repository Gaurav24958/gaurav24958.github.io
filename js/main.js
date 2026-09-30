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
  const elements = document.querySelectorAll('main h2, main p, .card, main li');

  elements.forEach((el) => {
    // Avoid double revealing or styling elements that shouldn't be revealed
    if (el.closest('.hero') || el.closest('.site-nav') || el.closest('footer')) return;

    if (el.classList.contains('card')) {
      el.classList.add('scroll-reveal');
    } else {
      // If it is inside a card or timeline entry, it is already animated by its parent container
      if (el.closest('.card') || el.closest('.timeline__entry')) return;
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

    // Desktop Slow Scroll Guide: strictly at the end of Chapter 3 scroll, before Chapter 4
    const betweenGuide = document.getElementById('college-scroll-guide');
    if (betweenGuide) {
      const currentRatio = scrollOffset / chapterHeight;
      // Appears only at the end of Chapter 3 scroll (2.70 to 2.98)
      // Not shown at the beginning (< 2.70) and disappears once reaching Chapter 4 (>= 2.98)
      if (currentRatio >= 2.70 && currentRatio < 2.98) {
        betweenGuide.classList.add('is-active');
      } else {
        betweenGuide.classList.remove('is-active');
      }
    }

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

function initLifeScrollGuidance() {
  // Mobile collage scroll hints (High School & College)
  const hints = document.querySelectorAll('.collage-scroll-hint');
  hints.forEach((hint) => {
    const parentColumn = hint.closest('.collage-column');
    if (!parentColumn) return;
    const grid = parentColumn.querySelector('.collage-grid-2, .collage-grid-3');
    if (!grid) return;

    // Tapping the hint smoothly scrolls to the next image
    hint.addEventListener('click', (e) => {
      e.stopPropagation();
      grid.scrollBy({ left: 220, behavior: 'smooth' });
    });

    // Fade out as user scrolls right, fade back in when scrolled back to start
    grid.addEventListener('scroll', () => {
      const isScrolledRight = grid.scrollLeft > 25;
      const isNearEnd = (grid.scrollWidth - grid.clientWidth - grid.scrollLeft) < 15;
      if (isScrolledRight || isNearEnd) {
        hint.classList.add('is-scrolled');
      } else {
        hint.classList.remove('is-scrolled');
      }
    }, { passive: true });
  });

  // Desktop guidance between Chapter 3 & 4: clicking gently scrolls into Chapter 4
  const collegeGuide = document.getElementById('college-scroll-guide');
  if (collegeGuide) {
    collegeGuide.addEventListener('click', () => {
      const container = document.querySelector('.life-scroll-container');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const containerTop = rect.top + window.scrollY;
      const chapterHeight = window.innerHeight;
      window.scrollTo({
        top: containerTop + (3.0 * chapterHeight),
        behavior: 'smooth'
      });
    });
  }
}

function initDynamicDurations() {
  const elements = document.querySelectorAll('.dynamic-duration');
  elements.forEach(el => {
    const startDateStr = el.getAttribute('data-start-date');
    if (!startDateStr) return;

    const startParts = startDateStr.split('-');
    const startYear = parseInt(startParts[0], 10);
    const startMonth = parseInt(startParts[1], 10) - 1;
    const startDate = new Date(startYear, startMonth, 1);

    let endDate;
    const endDateStr = el.getAttribute('data-end-date');
    if (endDateStr) {
      const endParts = endDateStr.split('-');
      endDate = new Date(parseInt(endParts[0], 10), parseInt(endParts[1], 10) - 1, 1);
    } else {
      endDate = new Date();
    }

    const totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth()) + 1;
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

function initTotalExperience() {
  const expEl = document.getElementById('total-exp-value');
  if (!expEl) return;

  // Job 1: Dragonfly (Jul 2024 – Dec 2024) -> 6 months
  const dflyStart = new Date(2024, 6, 1); // July 1
  const dflyEnd = new Date(2024, 11, 1); // December 1
  const dflyMonths = (dflyEnd.getFullYear() - dflyStart.getFullYear()) * 12 + (dflyEnd.getMonth() - dflyStart.getMonth()) + 1;

  // Job 2: FIS (Jan 2025 – Present)
  const fisStart = new Date(2025, 0, 1); // Jan 1
  const today = new Date();
  const fisMonths = (today.getFullYear() - fisStart.getFullYear()) * 12 + (today.getMonth() - fisStart.getMonth()) + 1;

  const totalMonths = dflyMonths + fisMonths;
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

  expEl.textContent = durationStr;
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

function initTimeline() {
  const sidebar = document.querySelector('.experience-sidebar');
  if (sidebar) {
    setTimeout(() => {
      sidebar.classList.add('is-visible');
    }, 150);
  }

  const entries = document.querySelectorAll('.timeline__entry');
  if (!entries.length) return;

  // Respect reduced-motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    entries.forEach(entry => entry.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((observations) => {
    observations.forEach((obs, i) => {
      if (obs.isIntersecting) {
        setTimeout(() => {
          obs.target.classList.add('is-visible');
        }, i * 80);
        observer.unobserve(obs.target);
      }
    });
  }, { threshold: 0.15 });

  entries.forEach(entry => observer.observe(entry));
}

/* ─── Projects Case Studies & Modal Overlays ─── */
const PROJECTS_DATA = {
  lipreading: {
    id: 'lipreading',
    badge: 'Research Project',
    tagList: ['Deep Learning', 'Computer Vision', 'Conv3D', 'BiLSTM', 'CTC Loss'],
    title: 'Lipreading for Indian Accent English',
    subtitle: 'Spatiotemporal Deep Learning Model for Visual Speech Recognition on Indian-accented English',
    defaultVideoUrl: 'https://drive.google.com/file/d/1Jhb-fGVjq1rEbbjmYf9vNLdnGRPH0ejI/preview',
    videoDriveUrl: 'https://drive.google.com/file/d/1Jhb-fGVjq1rEbbjmYf9vNLdnGRPH0ejI/view?usp=sharing',
    paperUrl: 'https://link.springer.com/chapter/10.1007/978-981-97-8591-9_30',
    githubUrl: 'https://github.com/Gaurav24958',
    stats: [
      { val: '4% CER', lbl: 'Character Error Rate', sub: '96% character prediction precision' },
      { val: '15% WER', lbl: 'Word Error Rate', sub: '85% word accuracy (beats human lipreaders)' },
      { val: '3.043', lbl: 'Validation Loss', sub: 'Low sequence-level CTC loss' },
      { val: '#1 Rank', lbl: "INC'24 Flagship", sub: 'Winner against 200+ teams' }
    ],
    overview: `
      <p>Lipreading — deciphering speech purely from visual mouth and lip dynamics — is a vital technology for hearing-impaired individuals, noisy industrial environments, and security surveillance where audio streams are corrupted or absent.</p>
      <p>While visual speech recognition has made strides on Western corpora (e.g., GRID and LRW), existing models fail significantly when evaluated on Indian-accented English. Indian English exhibits distinct phonetic coarticulation, unique visemes, rapid syllable cadences, and diverse facial features. This project created a novel spatiotemporal deep learning framework explicitly engineered to address Indian-accented speech dynamics.</p>
    `,
    pipeline: [
      {
        num: 'Step 01',
        tool: 'FFmpeg Utility',
        name: 'Format Conversion & Audio Stripping',
        desc: 'Converts raw multi-format video files into standard MP4 containers. The audio track is completely removed to force the pipeline to rely exclusively on visual speech cues.',
        why: 'Eliminates auditory leakage and reduces storage and compute overhead across thousands of video tensors.'
      },
      {
        num: 'Step 02',
        tool: 'Dlib Face Detector',
        name: 'Invariant Face Detection',
        desc: "Employs Dlib's facial detection framework to locate the speaker's face regardless of position, head tilt, or distance from the camera frame.",
        why: 'Anchors the pipeline to a rock-solid spatial reference point across varying speaker setups and environmental conditions.'
      },
      {
        num: 'Step 03',
        tool: 'Dlib 68-Point Model',
        name: 'Lip Landmark Point Extraction',
        desc: 'Extracts 68 facial landmark coordinates per frame, isolating key node points that delineate the outer lip boundary and inner mucosal opening.',
        why: 'Provides precise geometric coordinates of mouth deformations while discarding extraneous head, cheek, and eye motions.'
      },
      {
        num: 'Step 04',
        tool: 'OpenCV ROI Cropping',
        name: 'ROI Cropping & Uniform Resizing (140 × 46 px)',
        desc: 'Crops the Region of Interest (ROI) around the extracted lip landmark coordinates and resizes every frame uniformly to 140 × 46 pixels.',
        why: 'Removes background visual clutter, ensuring consistent dimensional tensors for convolutional filters without compute waste.'
      },
      {
        num: 'Step 05',
        tool: 'NumPy Tensor Math',
        name: 'Color Standardization & Pixel Normalization',
        desc: 'Standardizes RGB channels across all video frames to zero mean and unit variance (μ = 0, σ² = 1).',
        why: 'Neutralizes ambient room lighting shifts, shadows, and variations in skin tones across diverse Indian speakers.'
      },
      {
        num: 'Step 06',
        tool: 'VSDC & .align Files',
        name: 'Spatiotemporal Sequencing (75 Frames @ 25 fps)',
        desc: 'Packages 75 consecutive frames into unified tensor sequences (exact 3.0-second clips). Aligned frame-by-frame with word-level millisecond duration markers.',
        why: 'Preserves chronological syllable progression needed for recurrent sequence modeling and CTC loss alignment.'
      }
    ],
    architecture: [
      { name: 'Three 3D Convolutional Layers (Conv3D)', desc: 'Process 75 input frames through 3D convolutional kernels with ReLU activations and MaxPooling3D, extracting spatial mouth geometry and temporal motion vectors simultaneously across consecutive frames.' },
      { name: 'TimeDistributed Flatten', desc: 'Flattens spatial feature dimensions while preserving the exact chronological sequence order of the 75 frames for the subsequent recurrent stage.' },
      { name: 'Two Bidirectional LSTM Layers (BiLSTM)', desc: 'Capture forward and backward temporal relationships across phonemes/visemes, allowing the model to use subsequent context to disambiguate identical-looking mouth shapes (homophemes).' },
      { name: 'Dropout Regularization & Dense Softmax', desc: 'Interleaved dropout layers mitigate overfitting on speaker identities. The final dense layer produces character probability distributions across the alphabet plus a blank token.' },
      { name: 'Connectionist Temporal Classification (CTC) Loss', desc: 'Trains the sequence-to-sequence model without requiring tedious frame-by-frame character annotations, learning to automatically align variable-length visual utterances to text.' }
    ],
    datasetText: 'To address the lack of Indian-accented visual speech data, we synthesized a custom dataset of <strong>500 video clips</strong> recorded across 15+ Indian participants articulating 20+ distinct sentences derived from the GRID corpus. Each video was trimmed to exactly 3.0 seconds (75 frames at 25 fps) and synchronized on a frame-by-frame basis using VSDC Free Video Editor. The model was trained on 2,250 composite videos (custom Indian dataset + GRID dataset) for 100 epochs, reaching a validation loss of 3.043.',
    publicationsText: 'Published in Springer Conference: <em>"Leveraging Deep Learning for Lip Reading: A Comprehensive Analysis"</em> (<a href="https://link.springer.com/chapter/10.1007/978-981-97-8591-9_30" target="_blank" rel="noopener">view paper</a>). Research work on Indian Accent English is currently under peer review at Springer Journal (Signal, Image and Video Processing). Deployed as an interactive real-time Streamlit web app.'
  },

  'ireland-visa': {
    id: 'ireland-visa',
    badge: 'Production Web App',
    tagList: ['Node.js', 'Express', 'Cheerio', 'SheetJS', 'node-cron', 'Render'],
    title: '☘️ Ireland Visa Decisions Tracker',
    subtitle: 'Automated Web Scraper, In-Memory ODS Spreadsheet Parser & Instant Search Utility for Irish Visa Decisions',
    defaultVideoUrl: null,
    liveUrl: 'https://irelandvisadecision.onrender.com/',
    githubUrl: 'https://github.com/Gaurav24958/IrelandVisaDecision',
    stats: [
      { val: '11:00 AM', lbl: 'Daily Cron Sync', sub: 'Aligned with Embassy release' },
      { val: '2,400+', lbl: 'Records Parsed', sub: 'Per daily OpenDocument sheet' },
      { val: '0ms Lag', lbl: 'In-Memory Search', sub: 'Sub-millisecond query lookup' },
      { val: '24/7', lbl: 'Cloud Uptime', sub: 'Render keep-alive via UptimeRobot' }
    ],
    overview: `
      <p>Applicants awaiting Irish visa outcomes through the New Delhi Visa Office (NDVO) faced a frustrating daily routine: the embassy publishes decision lists as raw OpenDocument Spreadsheets (.ods) containing thousands of rows of application numbers. To check their status, applicants had to manually download large spreadsheet files, install compatible software, and search through thousands of rows every day.</p>
      <p><strong>Ireland Visa Decisions Tracker</strong> is an automated web utility built to eliminate this friction. It scrapes the Irish Embassy portal daily, downloads the latest <code>.ods</code> file directly in memory using dynamic regex heuristics, and serves a modern, glassmorphic dashboard where applicants can check their visa outcome (Approved, Refused, or Pending) in seconds using their 8-digit application number.</p>
    `,
    pipeline: [
      {
        num: 'Step 01',
        tool: 'Cheerio & Axios',
        name: 'Automated Embassy Portal Crawling',
        desc: 'Emulates desktop browser User-Agent headers to scrape the official Irish Embassy portal (Ireland.ie) daily, locating the newest _NDVO_Visa_Decisions.ods hyperlink while bypassing firewall blocks.',
        why: 'Eliminates the need for applicants to manually visit government pages and download raw files.'
      },
      {
        num: 'Step 02',
        tool: 'Node.js Buffers',
        name: 'In-Memory Binary Streaming',
        desc: 'Streams downloaded .ods spreadsheets straight into memory as binary buffers rather than saving intermediate files to disk.',
        why: 'Maximizes I/O throughput and prevents disk storage bloat on ephemeral cloud server containers.'
      },
      {
        num: 'Step 03',
        tool: 'SheetJS (xlsx)',
        name: 'Dynamic Header Discovery (Regex)',
        desc: 'Scans spreadsheet rows with regex patterns matching "Application Number" and "Decision" keys rather than relying on brittle fixed cell row indices.',
        why: 'Future-proofs the parser against random Irish government formatting shifts and newly added preamble rows.'
      },
      {
        num: 'Step 04',
        tool: 'Express.js API',
        name: 'Indexed JSON Cache & REST Endpoints',
        desc: 'Transforms parsed records into an indexed cache and exposes modular endpoints: /api/status, /api/search?q=..., and /api/sync for manual triggers.',
        why: 'Enables sub-millisecond case-insensitive query lookups without database bottlenecks.'
      },
      {
        num: 'Step 05',
        tool: 'node-cron + UptimeRobot',
        name: 'Scheduled Automation & Keep-Alive',
        desc: 'Runs an automated cron job every day at 11:00 AM IST (matching embassy release times). Configured with a 5-minute UptimeRobot heartbeat ping.',
        why: 'Bypasses Render free-tier container sleep constraints, ensuring 24/7 background cron reliability.'
      },
      {
        num: 'Step 06',
        tool: 'Vanilla JS & CSS',
        name: 'Glassmorphic UI & Client Validation',
        desc: 'Features strict 8-digit client-side input validation, animated Celtic clover state transitions, and responsive status alert cards.',
        why: 'Saves server bandwidth by preventing malformed requests and delivers an empathetic, stress-reducing user experience.'
      }
    ],
    architecture: [
      { name: 'Resilient Scraping & Parsing Engine', desc: 'Uses Cheerio and SheetJS (xlsx) with heuristic column mapping to ingest complex OpenDocument formats seamlessly.' },
      { name: 'Container Persistence Architecture', desc: 'Solved cloud container suspension via UptimeRobot automated polling, maintaining scheduled daily updates without dedicated infrastructure costs.' },
      { name: 'Lightweight REST Microservice', desc: 'Express.js backend serving both API consumers and the frontend single-page dashboard with zero heavy framework bloat.' },
      { name: 'Empathetic UX Design', desc: 'Instant status categorization (Approved in emerald green, Refused in alert red, Pending in informative amber) providing clarity for nervous visa applicants.' }
    ],
    datasetText: 'Monitors and indexes live decision files from the Embassy of Ireland New Delhi Visa Office (NDVO), parsing over 2,400+ application records on every embassy publishing release cycle.',
    publicationsText: 'Live in production and hosted on Render: <a href="https://irelandvisadecision.onrender.com/" target="_blank" rel="noopener">irelandvisadecision.onrender.com</a>. Source code available on <a href="https://github.com/Gaurav24958/IrelandVisaDecision" target="_blank" rel="noopener">GitHub</a>.'
  },

  'scientific-docs': {
    id: 'scientific-docs',
    badge: 'Hackathon Winner',
    tagList: ['RAG', 'LLM', 'Nougat Transformer', 'Gemini Pro', 'Vector Search'],
    title: 'Chat with Scientific Documents (PaperInsight)',
    subtitle: 'Visual Transformer Parsing & Multimodal Retrieval-Augmented Generation for Complex Academic Papers',
    defaultVideoUrl: null,
    githubUrl: 'https://github.com/Gaurav24958/PaperInsight',
    stats: [
      { val: '#1 Rank', lbl: "MINeD'24 Winner", sub: 'Binghamton & Nirma Hackathon (150+ teams)' },
      { val: '100%', lbl: 'Equation Fidelity', sub: 'Flawless LaTeX & table OCR extraction' },
      { val: 'Gemini', lbl: 'LLM Backbone', sub: 'Grounded Q&A with pinpoint citations' },
      { val: 'Multi-Doc', lbl: 'Corpus Support', sub: 'Cross-paper synthesis & comparative search' }
    ],
    overview: `
      <p>Academic research papers present severe challenges for standard Document Q&A and RAG applications. Conventional PDF parsers and OCR tools (like Tesseract) corrupt multi-column layout flows, transform dense mathematical formulas into meaningless ASCII strings, and scramble embedded scientific tables into unreadable blocks.</p>
      <p><strong>PaperInsight</strong> solved this critical information extraction bottleneck. We fine-tuned Meta's <strong>Nougat</strong> visual transformer model to convert page screenshots directly into semantically clean Markdown and LaTeX syntax, preserving equations, matrices, and tables with zero loss. Coupled with high-density vector retrieval and Gemini 1.0 Pro, researchers can converse intuitively with complex technical literature.</p>
    `,
    pipeline: [
      {
        num: 'Step 01',
        tool: 'Visual Renderer',
        name: 'High-Res Page Rasterization',
        desc: 'Renders multi-page PDF documents into high-DPI image representations to feed visual transformer attention mechanisms.',
        why: 'Prevents PDF font encoding corruption and preserves inline figure references.'
      },
      {
        num: 'Step 02',
        tool: 'Nougat Visual Transformer',
        name: 'Optical LaTeX & Markdown Parsing',
        desc: 'Fine-tuned vision transformer transcribes complex multi-column scientific layouts, mathematical symbols, and tables directly into structured Markdown and LaTeX.',
        why: 'Guarantees zero loss of semantic meaning in mathematical formulas, chemical equations, and tabular data.'
      },
      {
        num: 'Step 03',
        tool: 'Equation-Aware Splitter',
        name: 'Semantic Chunking & Embedding',
        desc: 'Splits parsed Markdown along natural section, proof, and theorem boundaries rather than arbitrary token character counts.',
        why: 'Keeps mathematical formulas and explanatory context unified within single vector embeddings.'
      },
      {
        num: 'Step 04',
        tool: 'Vector DB + BM25',
        name: 'Hybrid Dense-Sparse Retrieval',
        desc: 'Combines cosine semantic search with BM25 keyword matching to retrieve relevant paper excerpts, proofs, and references.',
        why: 'Ensures high recall for both broad thematic concepts and precise mathematical symbol searches.'
      },
      {
        num: 'Step 05',
        tool: 'Gemini 1.0 Pro',
        name: 'Grounded Synthesis & Citation',
        desc: 'Synthesizes clear, factual answers grounded strictly in retrieved context, providing exact page-level and theorem-level references.',
        why: 'Completely eliminates hallucinations and enables rapid verification for academic researchers.'
      }
    ],
    architecture: [
      { name: 'Nougat Vision Transformer', desc: 'End-to-end encoder-decoder transformer converting rasterized academic pages into semantically enriched Markdown and LaTeX strings.' },
      { name: 'Domain-Aware Section Chunking', desc: 'Preserves equation blocks, algorithm listings, and theorem declarations without tearing across chunk limits.' },
      { name: 'Dual Dense-Sparse Vector Retrieval', desc: 'Hybrid indexing matching semantic user intent while honoring precise technical symbols and author notations.' },
      { name: 'Gemini 1.0 Pro Orchestration', desc: 'Context-conditioned generative question answering with automatic footnote and reference anchor generation.' }
    ],
    datasetText: 'Evaluated across hundreds of multi-column IEEE, ACM, and arXiv research papers covering computer science, physics, and mathematics. Demonstrated 100% formula preservation compared to 42% symbol degradation with baseline PDF parsers.',
    publicationsText: 'Awarded <strong>1st Prize at MINeD Hackathon 2024</strong> (hosted jointly by Binghamton University & Nirma University) competing against 150+ international teams.'
  },

  'diabetic-retinopathy': {
    id: 'diabetic-retinopathy',
    badge: 'Clinical Research',
    tagList: ['Medical Imaging', 'YOLOv8x', 'CNN-LSTM', 'CLAHE', 'Computer Vision'],
    title: 'Diabetic Retinopathy Classification & Macular Edema Detection',
    subtitle: 'Automated Severity Grading and Macular Swelling Detection from Fundus Retinal Photography using Computer Vision',
    defaultVideoUrl: null,
    githubUrl: 'https://github.com/Gaurav24958',
    stats: [
      { val: '95%+', lbl: 'Classification Accuracy', sub: 'Multi-stage severity grading' },
      { val: 'Hospital', lbl: 'Clinical Validation', sub: 'Tested in real medical environments' },
      { val: 'YOLOv8x', lbl: 'Deep Architecture', sub: 'Fine-tuned lesion localization' },
      { val: 'Springer', lbl: 'Journal Publication', sub: 'Under consideration for publication' }
    ],
    overview: `
      <p>Diabetic Retinopathy (DR) is the primary cause of preventable blindness among working-age adults globally. Timely detection can prevent over 90% of severe vision loss, yet screening is severely bottlenecked by the shortage of trained ophthalmologists and specialized equipment in high-density or rural populations.</p>
      <p>In the Deep Learning Lab at SCTR's PICT, we developed an automated computer vision screening model capable of grading retinopathy into 5 distinct clinical severity levels (No DR, Mild, Moderate, Severe, Proliferative DR) while detecting retinal swelling (macular edema). By combining morphological preprocessing with deep convolutional and recurrent architectures, the system achieved over <strong>95% accuracy</strong> on sizable clinical datasets and was validated in hospital settings.</p>
    `,
    pipeline: [
      {
        num: 'Step 01',
        tool: 'OpenCV Processing',
        name: 'Illumination Correction & Glare Removal',
        desc: 'Applies Subtract Mean processing to correct non-uniform optical flash lighting and eliminate retinal reflection artifacts.',
        why: 'Standardizes illumination across fundus images taken on different hospital fundus camera hardware.'
      },
      {
        num: 'Step 02',
        tool: 'CLAHE Filter',
        name: 'Contrast Limited Adaptive Histogram Equalization',
        desc: 'Locally enhances contrast in discrete contextual image tiles without amplifying background sensor noise.',
        why: 'Makes faint microaneurysms, hemorrhages, and neovascular vessels sharply prominent for feature extraction.'
      },
      {
        num: 'Step 03',
        tool: 'Albumentations',
        name: 'Class-Balanced Augmentation',
        desc: 'Employs affine shearing, elastic deformations, and weighted sampling to counter extreme medical class imbalances.',
        why: 'Prevents model bias toward common healthy retinas, ensuring high sensitivity for rare, vision-critical Proliferative DR.'
      },
      {
        num: 'Step 04',
        tool: 'YOLOv8x + CNN',
        name: 'Multi-Scale Lesion Localization',
        desc: 'Fine-tuned YOLOv8x deep backbone detects microaneurysms, hard exudates, cotton-wool spots, and macular swelling.',
        why: 'Generates interpretable visual heatmaps that provide clinical justification to ophthalmologists.'
      },
      {
        num: 'Step 05',
        tool: 'LSTM Recurrent Units',
        name: 'Clinical Severity Grading',
        desc: 'Integrates spatial lesion patterns into an ordinal classifier predicting disease stage and macular edema risk.',
        why: 'Directly translates computer vision features into clinical triage priorities for hospital workflows.'
      }
    ],
    architecture: [
      { name: 'Morphological Preprocessing Engine', desc: 'Cascaded CLAHE and Subtract Mean filters accentuating subtle vascular anomalies.' },
      { name: 'Fine-Tuned YOLOv8x Feature Extractor', desc: 'Identifies microvascular lesions across multi-scale receptive fields with high spatial precision.' },
      { name: 'Hybrid CNN-LSTM Classifier', desc: 'Aggregates spatial feature hierarchies into calibrated probability distributions across five clinical DR stages.' },
      { name: 'Macular Edema Detector', desc: 'Specialized diagnostic head detecting fluid accumulation and swelling in the fovea.' }
    ],
    datasetText: 'Trained and validated on extensive clinical fundus photography datasets featuring thousands of anonymized retina examinations, cross-verified against ophthalmologist diagnostic ground truth.',
    publicationsText: 'Research paper titled <em>"Classification of Diabetic Retinopathy"</em> is currently under consideration for publication in a Springer Journal. Model tested and validated in real hospital environments.'
  }
};

function formatDriveEmbedUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.includes('/preview')) return trimmed;

  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) {
    return `https://drive.google.com/file/d/${fileMatch[1]}/preview`;
  }

  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
  }

  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) {
    return `https://drive.google.com/file/d/${trimmed}/preview`;
  }

  return trimmed;
}

function getProjectVideoUrl(projectId, defaultUrl) {
  if (!defaultUrl) return '';
  const stored = localStorage.getItem(`project_video_${projectId}`);
  return formatDriveEmbedUrl(stored || defaultUrl);
}

function openProjectModal(projectId) {
  const data = PROJECTS_DATA[projectId];
  if (!data) return;

  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const hasVideo = Boolean(data.defaultVideoUrl);
  const videoSrc = hasVideo ? getProjectVideoUrl(projectId, data.defaultVideoUrl) : '';
  const videoDriveLink = data.videoDriveUrl || (hasVideo ? videoSrc.replace('/preview', '/view?usp=sharing') : '');
  const currentChapter = document.documentElement.getAttribute('data-chapter') || 'india';
  const dedicatedPageUrl = `/${currentChapter}/projects/${projectId}/`;

  modal.innerHTML = `
    <header class="project-modal__header">
      <div class="project-modal__header-left">
        <div class="project-modal__meta-top">
          <span class="project-card__badge">${data.badge}</span>
          ${data.tagList.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <h2 class="project-modal__title" id="modal-project-title">${data.title}</h2>
        <p class="project-modal__subtitle">${data.subtitle}</p>
      </div>
      <button type="button" class="project-modal__close" id="modal-close-btn" aria-label="Close dialog">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </header>

    <div class="project-modal__body">
      ${hasVideo ? `
      <!-- Demo Video -->
      <section class="project-section-block">
        <h3 class="project-section-block__title">Project Demo Video</h3>
        <div class="project-video-container">
          <div class="project-video-wrapper">
            <iframe class="project-video-iframe" 
                    id="modal-video-iframe"
                    src="${videoSrc}" 
                    title="${data.title} Demo Video"
                    allow="autoplay; fullscreen" 
                    allowfullscreen>
            </iframe>
          </div>
          <div class="project-video-caption">
            <div class="project-video-caption__left">
              <span class="project-video-caption__badge">▶</span>
              <span>Demo Video · Google Drive</span>
            </div>
            <div>
              <a href="${videoDriveLink}" target="_blank" rel="noopener" class="project-video-caption__link" id="modal-open-drive">
                Open in Drive ↗
              </a>
            </div>
          </div>
        </div>
      </section>
      ` : ''}

      <!-- Key Results -->
      <section class="project-section-block">
        <h3 class="project-section-block__title">Key Results & Achievements</h3>
        <div class="metric-stat-grid">
          ${data.stats.map(s => `
            <div class="metric-stat-card">
              <div class="metric-stat-card__val">${s.val}</div>
              <div class="metric-stat-card__lbl">${s.lbl}</div>
              <div class="metric-stat-card__sub">${s.sub}</div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Overview -->
      <section class="project-section-block">
        <h3 class="project-section-block__title">Executive Summary & Problem Statement</h3>
        <div class="project-prose">
          ${data.overview}
        </div>
      </section>

      <!-- Middle Processing Pipeline -->
      <section class="project-section-block">
        <h3 class="project-section-block__title">${projectId === 'lipreading' ? 'The Middle Processing Stage (Preprocessing Pipeline)' : 'Technical Architecture & Pipeline'}</h3>
        <div class="pipeline-grid">
          ${data.pipeline.map(step => `
            <div class="pipeline-step">
              <div class="pipeline-step__top">
                <span class="pipeline-step__num">${step.num}</span>
                <span class="pipeline-step__tool">${step.tool}</span>
              </div>
              <h4 class="pipeline-step__name">${step.name}</h4>
              <p class="pipeline-step__desc">${step.desc}</p>
              <div class="pipeline-step__why">
                <strong>Why it matters:</strong> ${step.why}
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Architecture -->
      <section class="project-section-block">
        <h3 class="project-section-block__title">Model Architecture Breakdown</h3>
        <ul class="arch-list">
          ${data.architecture.map(a => `
            <li class="arch-item">
              <span class="arch-item__dot"></span>
              <div>
                <strong>${a.name}:</strong> ${a.desc}
              </div>
            </li>
          `).join('')}
        </ul>
      </section>

      <!-- Dataset & Training -->
      <section class="project-section-block">
        <h3 class="project-section-block__title">Dataset & Training Methodology</h3>
        <div class="project-prose">
          <p>${data.datasetText}</p>
        </div>
      </section>

      <!-- Publications & External Links -->
      <section class="project-section-block">
        <h3 class="project-section-block__title">Recognition & Publications</h3>
        <div class="project-prose">
          <p>${data.publicationsText}</p>
        </div>

        <div class="project-actions">
          ${data.liveUrl ? `<a href="${data.liveUrl}" target="_blank" rel="noopener" class="btn-primary-action">🚀 Live Application ↗</a>` : ''}
          ${data.paperUrl ? `<a href="${data.paperUrl}" target="_blank" rel="noopener" class="btn-primary-action">📄 Springer Paper ↗</a>` : ''}
          ${data.githubUrl ? `<a href="${data.githubUrl}" target="_blank" rel="noopener" class="btn-secondary-action">💻 GitHub Code ↗</a>` : ''}
          <a href="${dedicatedPageUrl}" class="btn-secondary-action">
            Open Standalone Page ↗
          </a>
        </div>
      </section>
    </div>
  `;

  // Bind close button
  const closeBtn = modal.querySelector('#modal-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.close();
    });
  }

  // Open modal
  modal.showModal();
  document.body.classList.add('modal-open');

  // Focus close button for accessibility
  if (closeBtn) closeBtn.focus();
}

function initProjectModals() {
  const modal = document.getElementById('project-modal');
  const projectCards = document.querySelectorAll('.project-card');

  if (modal) {
    const handleClose = () => {
      document.body.classList.remove('modal-open');
      const iframe = modal.querySelector('#modal-video-iframe');
      if (iframe) {
        iframe.src = '';
      }
    };

    modal.addEventListener('close', handleClose);
    modal.addEventListener('cancel', handleClose);

    // Fallback for light-dismiss on Safari / browsers without closedby support
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      modal.addEventListener('click', (event) => {
        if (event.target !== modal) return;
        const rect = modal.getBoundingClientRect();
        const isInside = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isInside && modal.open) {
          modal.close();
        }
      });
    }
  }

  // Bind click & keyboard handlers to each project card
  projectCards.forEach((card) => {
    const projectId = card.dataset.project;
    const href = card.dataset.href;

    card.addEventListener('click', (e) => {
      // If clicking directly on a child link (e.g. GitHub link in card footer)
      if (e.target.closest('.card-link')) {
        return; // Allow direct link to open
      }

      // Check viewport: On mobile (<= 768px), navigate to dedicated page
      if (window.innerWidth <= 768) {
        if (href) {
          window.location.href = href;
        }
        return;
      }

      // On desktop / tablet (> 768px), intercept and open overlay modal
      e.preventDefault();
      openProjectModal(projectId);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('.card-link')) return;
        e.preventDefault();
        card.click();
      }
    });
  });

  // Check URL hash for direct modal opening on desktop (e.g., #project-lipreading)
  if (window.innerWidth > 768 && window.location.hash.startsWith('#project-')) {
    const hashId = window.location.hash.replace('#project-', '');
    if (PROJECTS_DATA[hashId]) {
      setTimeout(() => {
        openProjectModal(hashId);
      }, 100);
    }
  }
}

function initWishlistItems() {
  const wishlistItems = document.querySelectorAll('.wishlist-item');
  if (!wishlistItems.length) return;

  wishlistItems.forEach(item => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'checkbox');
    const isCompleted = item.classList.contains('is-completed') || item.classList.contains('checked');
    item.setAttribute('aria-checked', isCompleted ? 'true' : 'false');

    const toggle = () => {
      const completed = item.classList.toggle('is-completed');
      item.classList.toggle('checked', completed);
      item.setAttribute('aria-checked', completed ? 'true' : 'false');
      const checkbox = item.querySelector('.checkbox-custom');
      if (checkbox) {
        checkbox.classList.toggle('is-checked', completed);
        if (completed && !checkbox.querySelector('svg')) {
          checkbox.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;
        } else if (!completed) {
          checkbox.innerHTML = '';
        }
      }
    };

    item.addEventListener('click', toggle);
    item.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggle();
      }
    });
  });
}

function initHeroVideo() {
  const heroVideo = document.querySelector('.hero-video');
  if (!heroVideo) return;

  // Force DOM properties required by iOS Safari / WebKit for autoplay
  heroVideo.muted = true;
  heroVideo.defaultMuted = true;
  heroVideo.playsInline = true;
  heroVideo.setAttribute('playsinline', '');
  heroVideo.setAttribute('webkit-playsinline', '');

  const startPlayback = () => {
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked by iOS Low Power Mode or Safari policy.
        // Start playback on first interaction (tap, touch, scroll)
        const unlock = () => {
          heroVideo.play().catch(() => {});
          ['touchstart', 'touchend', 'click', 'scroll'].forEach((evt) => {
            window.removeEventListener(evt, unlock);
          });
        };
        ['touchstart', 'touchend', 'click', 'scroll'].forEach((evt) => {
          window.addEventListener(evt, unlock, { once: true, passive: true });
        });
      });
    }
  };

  startPlayback();

  // Resume when returning from another tab or app
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && heroVideo.paused) {
      startPlayback();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initHamburger();
  initCurtain();
  initHeroVideo();
  initTabs();
  initChapter();
  initDarkMode();
  initNavScroll();
  initScrollReveals();
  initLifePage();
  initLifePageMobile();
  initLifeIrelandLink();
  initLifeNavbarScroll();
  initLifeScrollGuidance();
  initTypingAnimation();
  initDynamicDurations();
  initTotalExperience();
  initJourneyTransitions();
  initTimeline();
  initProjectModals();
  initWishlistItems();
});

