(function () {
  'use strict';

  const STORAGE_KEYS = {
    THEME: 'portfolio-theme',
  };

  const ICONS = {
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,
    github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
    email: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
  };

  const els = {};

  function init() {
    cacheElements();
    initTheme();
    initThemeToggle();
    initMobileMenu();
    initScrollEffects();
    initBackToTop();
    loadAndRenderData();
    initFadeInAnimations();
  }

  function cacheElements() {
    els.header = document.querySelector('.header');
    els.heroName = document.getElementById('heroName');
    els.heroTitle = document.getElementById('heroTitle');
    els.heroLocation = document.getElementById('heroLocation');
    els.heroSocials = document.getElementById('heroSocials');
    els.downloadCv = document.getElementById('downloadCv');
    els.aboutSummary = document.getElementById('aboutSummary');
    els.aboutSummaryText = document.getElementById('aboutSummaryText');
    els.skillsGrid = document.getElementById('skillsGrid');
    els.timeline = document.getElementById('timeline');
    els.projectsGrid = document.getElementById('projectsGrid');
    els.educationList = document.getElementById('educationList');
    els.certificationsList = document.getElementById('certificationsList');
    els.footerText = document.getElementById('footerText');
    els.repoLink = document.getElementById('repoLink');
    els.themeToggle = document.getElementById('themeToggle');
    els.menuToggle = document.getElementById('menuToggle');
    els.navLinks = document.querySelector('.nav__links');
    els.backToTop = document.getElementById('backToTop');
  }

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    }
  }

  function initThemeToggle() {
    if (!els.themeToggle) return;
    els.themeToggle.addEventListener('click', toggleTheme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEYS.THEME, next);
  }

  function initMobileMenu() {
    if (!els.menuToggle || !els.navLinks) return;

    els.menuToggle.addEventListener('click', function () {
      const isOpen = els.navLinks.classList.toggle('open');
      els.menuToggle.classList.toggle('open', isOpen);
      els.menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    els.navLinks.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        els.navLinks.classList.remove('open');
        els.menuToggle.classList.remove('open');
        els.menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function initScrollEffects() {
    const onScroll = function () {
      if (window.scrollY > 12) {
        els.header && els.header.classList.add('scrolled');
      } else {
        els.header && els.header.classList.remove('scrolled');
      }

      updateActiveNavLink();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 120;

    sections.forEach(function (section) {
      const id = section.getAttribute('id');
      const link = document.querySelector('.nav__link[href="#' + id + '"]');
      if (!link) return;

      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav__link').forEach(function (l) {
          l.classList.remove('active');
        });
        link.classList.add('active');
      }
    });
  }

  function initBackToTop() {
    if (!els.backToTop) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        els.backToTop.classList.add('visible');
      } else {
        els.backToTop.classList.remove('visible');
      }
    }, { passive: true });

    els.backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initFadeInAnimations() {
    const targets = document.querySelectorAll(
      '.about__card, .skill-card, .timeline__item, .project-card, .list__item, .section__header'
    );

    targets.forEach(function (el) {
      el.classList.add('fade-in');
    });

    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    );

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  function loadAndRenderData() {
    fetch('./data.json', { cache: 'no-cache' })
      .then(function (res) {
        if (!res.ok) {
          throw new Error('Falha ao carregar data.json (' + res.status + ')');
        }
        return res.json();
      })
      .then(renderData)
      .catch(function (err) {
        console.error('[Portfolio] Erro ao carregar dados:', err);
        renderFallbackData();
      });
  }

  function renderData(data) {
    if (data.profile) renderProfile(data.profile);
    if (data.about) renderAbout(data.about);
    if (data.skills) renderSkills(data.skills);
    if (data.experience) renderExperience(data.experience);
    if (data.projects) renderProjects(data.projects);
    if (data.education) renderEducation(data.education);
    if (data.certifications) renderCertifications(data.certifications);
    if (data.footer) renderFooter(data.footer, data.profile);
  }

  function renderProfile(profile) {
    if (els.heroName && profile.name) els.heroName.textContent = profile.name;
    if (els.heroTitle && profile.title) els.heroTitle.textContent = profile.title;
    if (els.heroLocation && profile.location) els.heroLocation.innerHTML = '📍 ' + profile.location;
    if (els.downloadCv && profile.cvUrl) els.downloadCv.setAttribute('href', profile.cvUrl);

    if (els.heroSocials) {
      els.heroSocials.innerHTML = '';
      if (profile.linkedin) els.heroSocials.appendChild(createSocialLink(profile.linkedin, 'LinkedIn', ICONS.linkedin));
      if (profile.github) els.heroSocials.appendChild(createSocialLink(profile.github, 'GitHub', ICONS.github));
      if (profile.email) els.heroSocials.appendChild(createSocialLink('mailto:' + profile.email, profile.email, ICONS.email));
      if (profile.phone) els.heroSocials.appendChild(createSocialLink('tel:' + profile.phone.replace(/\s/g, ''), profile.phone, ICONS.phone));
    }
  }

  function createSocialLink(href, label, iconSvg) {
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    a.setAttribute('class', 'social-link');
    a.innerHTML = iconSvg + '<span>' + label + '</span>';
    return a;
  }

  function renderAbout(about) {
    if (els.aboutSummary) {
      els.aboutSummary.textContent = 'Cultura Shift-Left & Qualidade Contínua';
    }
    if (els.aboutSummaryText && about.summary) {
      const trimmed = about.summary.length > 140
        ? about.summary.substring(0, 140) + '...'
        : about.summary;
      els.aboutSummaryText.textContent = trimmed;
    }
  }

  function renderSkills(skills) {
    if (!els.skillsGrid || !Array.isArray(skills.categories)) return;
    els.skillsGrid.innerHTML = '';

    skills.categories.forEach(function (cat) {
      const card = document.createElement('div');
      card.className = 'skill-card';

      const itemsHtml = (cat.items || []).map(function (item) {
        return '<span class="skill-tag">' + escapeHtml(item) + '</span>';
      }).join('');

      card.innerHTML =
        '<div class="skill-card__header">' +
          '<div class="skill-card__icon">' + (cat.icon || '⚙️') + '</div>' +
          '<h3 class="skill-card__name">' + escapeHtml(cat.name) + '</h3>' +
        '</div>' +
        '<div class="skill-card__items">' + itemsHtml + '</div>';

      els.skillsGrid.appendChild(card);
    });
  }

  function renderExperience(experience) {
    if (!els.timeline || !Array.isArray(experience)) return;
    els.timeline.innerHTML = '';

    experience.forEach(function (job) {
      const item = document.createElement('div');
      item.className = 'timeline__item';

      const highlightsHtml = (job.highlights || []).map(function (h) {
        return '<li>' + escapeHtml(h) + '</li>';
      }).join('');

      item.innerHTML =
        '<div class="timeline__dot"></div>' +
        '<div class="timeline__card">' +
          '<span class="timeline__period">' + escapeHtml(job.period || '') + '</span>' +
          '<h3 class="timeline__company">' + escapeHtml(job.company || '') + '</h3>' +
          '<p class="timeline__position">' + escapeHtml(job.position || '') + '</p>' +
          (job.location ? '<p class="timeline__location">📍 ' + escapeHtml(job.location) + '</p>' : '') +
          '<ul class="timeline__highlights">' + highlightsHtml + '</ul>' +
        '</div>';

      els.timeline.appendChild(item);
    });
  }

  function renderProjects(projects) {
    if (!els.projectsGrid || !Array.isArray(projects)) return;
    els.projectsGrid.innerHTML = '';

    projects.forEach(function (proj) {
      const tagsHtml = (proj.tags || []).map(function (t) {
        return '<span class="project-tag">' + escapeHtml(t) + '</span>';
      }).join('');

      const card = document.createElement('article');
      card.className = 'project-card';

      card.innerHTML =
        '<div class="project-card__header">' +
          '<div class="project-card__icon">' + (proj.icon || '📦') + '</div>' +
          '<h3 class="project-card__title">' + escapeHtml(proj.title || '') + '</h3>' +
        '</div>' +
        '<p class="project-card__description">' + escapeHtml(proj.description || '') + '</p>' +
        '<div class="project-card__tags">' + tagsHtml + '</div>' +
        '<div class="project-card__footer">' +
          '<a class="btn btn--outline" href="' + escapeAttr(proj.github || '#') + '" target="_blank" rel="noopener noreferrer">' +
            ICONS.github.replace('<svg', '<svg width="15" height="15"') +
            ' Ver no GitHub' +
          '</a>' +
        '</div>';

      els.projectsGrid.appendChild(card);
    });
  }

  function renderEducation(education) {
    if (!els.educationList || !Array.isArray(education)) return;
    els.educationList.innerHTML = '';

    education.forEach(function (edu) {
      const item = document.createElement('div');
      item.className = 'list__item';
      item.innerHTML =
        '<div class="list__icon">' + (edu.icon || '🎓') + '</div>' +
        '<div class="list__content">' +
          '<h4>' + escapeHtml(edu.degree || '') + '</h4>' +
          '<p>' + escapeHtml(edu.institution || '') + (edu.period ? ' • ' + escapeHtml(edu.period) : '') + '</p>' +
        '</div>';
      els.educationList.appendChild(item);
    });
  }

  function renderCertifications(certifications) {
    if (!els.certificationsList || !Array.isArray(certifications)) return;
    els.certificationsList.innerHTML = '';

    certifications.forEach(function (cert) {
      const item = document.createElement('div');
      item.className = 'list__item';
      item.innerHTML =
        '<div class="list__icon">' + (cert.icon || '🏆') + '</div>' +
        '<div class="list__content">' +
          '<h4>' + escapeHtml(cert.name || '') + '</h4>' +
          (cert.issuer ? '<p>' + escapeHtml(cert.issuer) + '</p>' : '') +
        '</div>';
      els.certificationsList.appendChild(item);
    });
  }

  function renderFooter(footer, profile) {
    if (els.footerText) {
      const year = footer.year || new Date().getFullYear();
      const name = (profile && profile.name) ? escapeHtml(profile.name) : 'Fabrício Duarte';
      els.footerText.innerHTML = '© ' + year + ' ' + name + ' — Todos os direitos reservados.';
    }
    if (els.repoLink && footer.portfolioRepo) {
      els.repoLink.setAttribute('href', footer.portfolioRepo);
    }
  }

  function renderFallbackData() {
    console.warn('[Portfolio] Usando dados de fallback.');
    if (els.heroName) els.heroName.textContent = 'Fabrício Duarte';
    if (els.heroTitle) els.heroTitle.textContent = 'QA Automation Engineer & Senior Test Analyst';
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeAttr(str) {
    return escapeHtml(str);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();