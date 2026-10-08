(function () {
  'use strict';

  const STORAGE_KEYS = {
    THEME: 'portfolio-theme',
  };

  const ICONS = {
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`,
    github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`,
    email: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
    whatsapp: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 1 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
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
    els.languagesList = document.getElementById('languagesList');
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
    if (data.languages) renderLanguages(data.languages);
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
      if (profile.phone) {
        const waDigits = profile.phone.replace(/\D+/g, '');
        const waMsg = encodeURIComponent('Olá! Vi seu currículo/portfólio e gostaria de entrar em contato sobre oportunidades de QA / Testes.');
        const waUrl = 'https://wa.me/' + waDigits + '?text=' + waMsg;
        els.heroSocials.appendChild(createSocialLink(waUrl, profile.phone + ' · WhatsApp', ICONS.whatsapp));
      }
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
      const trimmed = about.summary.length > 155
        ? about.summary.substring(0, 155) + '...'
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
    const accordionIds = [];
    const firstOpenJob = 0;

    experience.forEach(function (job, idx) {
      const item = document.createElement('div');
      item.className = 'timeline__item';

      const jobId = 'exp-' + (idx + 1);
      const panelId = jobId + '-panel';
      const headerId = jobId + '-header';
      const initialOpen = idx === firstOpenJob;
      accordionIds.push(jobId);

      const highlights = job.highlights || [];
      const highlightsCount = highlights.length;
      const highlightsHtml = highlights.map(function (h) {
        return '<li>' + escapeHtml(h) + '</li>';
      }).join('');

      const summaryText = highlightsCount > 0
        ? highlightsCount + ' realizaç' + (highlightsCount === 1 ? 'ão' : 'ões') + ' de destaque'
        : 'Conteúdo do cargo';

      item.innerHTML =
        '<div class="timeline__dot"></div>' +
        '<div class="timeline__card timeline__card--accordion">' +
          '<span class="timeline__period">' + escapeHtml(job.period || '') + '</span>' +
          '<h3 class="timeline__company">' + escapeHtml(job.company || '') + '</h3>' +
          '<p class="timeline__position">' + escapeHtml(job.position || '') + '</p>' +
          (job.location ? '<p class="timeline__location">📍 ' + escapeHtml(job.location) + '</p>' : '') +
          '<div class="exp-accordion" data-exp-accordion data-accordion-id="' + escapeAttr(jobId) + '" data-sibling-group="experience-timeline">' +
            '<h4 class="exp-accordion__heading" style="margin-top:0.6rem;">' +
              '<button type="button" id="' + escapeAttr(headerId) + '" class="exp-accordion__trigger" ' +
                'aria-expanded="' + (initialOpen ? 'true' : 'false') + '" ' +
                'aria-controls="' + escapeAttr(panelId) + '" ' +
                'data-accordion-index="' + idx + '"' +
              '>' +
                '<span class="exp-accordion__trigger-left">' +
                  '<span class="exp-accordion__title">🔬 Realizações &amp; Entregáveis</span>' +
                  '<span class="exp-accordion__subtitle">• ' + escapeHtml(summaryText) + '</span>' +
                '</span>' +
                '<span class="exp-accordion__chev" aria-hidden="true">' +
                  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>' +
                '</span>' +
              '</button>' +
            '</h4>' +
            '<div id="' + escapeAttr(panelId) + '" ' +
              'class="exp-accordion__panel" ' +
              'role="region" ' +
              'aria-labelledby="' + escapeAttr(headerId) + '" ' +
              (initialOpen ? 'data-open' : '') +
              (initialOpen ? 'aria-hidden="false"' : 'aria-hidden="true"') +
            '>' +
              '<div class="exp-accordion__content">' +
                (highlightsCount > 0
                  ? '<ul class="timeline__highlights timeline__highlights--accordion">' + highlightsHtml + '</ul>'
                  : '<p class="timeline__empty">Nenhuma realização cadastrada para este cargo.</p>') +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';

      els.timeline.appendChild(item);
    });

    mountExperienceAccordions();
  }

  function mountExperienceAccordions() {
    const root = els.timeline;
    if (!root) return;

    const triggers = Array.prototype.slice.call(root.querySelectorAll('[data-exp-accordion] .exp-accordion__trigger'));
    if (triggers.length === 0) return;

    const isSingle = true;
    const ChevRotationOpen = 180;
    const ChevRotationClosed = 0;

    function setPanelOpen(trigger, panel, open, animate) {
      const expanded = String(open === true);
      trigger.setAttribute('aria-expanded', expanded);
      panel.setAttribute('aria-hidden', String(open !== true));

      const chev = trigger.querySelector('.exp-accordion__chev svg');
      if (chev) {
        chev.style.transition = animate ? 'transform 0.3s cubic-bezier(0.4,0,0.2,1)' : 'none';
        chev.style.transform = 'rotate(' + (open ? ChevRotationOpen : ChevRotationClosed) + 'deg)';
      }

      const content = panel.querySelector('.exp-accordion__content');
      if (!content) return;

      if (open) {
        panel.setAttribute('data-open', '');
        const h = content.scrollHeight;
        if (!animate) {
          panel.style.height = 'auto';
          panel.style.overflow = 'visible';
          requestAnimationFrame(function () { panel.style.height = ''; });
          return;
        }
        panel.style.overflow = 'hidden';
        panel.style.height = '0px';
        requestAnimationFrame(function () {
          const finalH = content.scrollHeight;
          panel.style.transition = 'height 0.32s cubic-bezier(0.4,0,0.2,1)';
          panel.style.height = finalH + 'px';
          const onEnd = function (e) {
            if (e && e.propertyName !== 'height') return;
            if (!panel.hasAttribute('data-open')) return;
            panel.style.transition = '';
            panel.style.height = 'auto';
            panel.style.overflow = 'visible';
            panel.removeEventListener('transitionend', onEnd);
          };
          panel.addEventListener('transitionend', onEnd, { once: true });
          setTimeout(function () {
            if (panel.hasAttribute('data-open') && panel.style.height !== 'auto') {
              onEnd();
            }
          }, 400);
        });
      } else {
        panel.removeAttribute('data-open');
        if (!animate) {
          panel.style.height = '';
          panel.style.overflow = '';
          panel.style.transition = '';
          return;
        }
        const h = content.scrollHeight;
        panel.style.overflow = 'hidden';
        panel.style.transition = '';
        panel.style.height = h + 'px';
        requestAnimationFrame(function () {
          panel.style.transition = 'height 0.3s cubic-bezier(0.4,0,0.2,1)';
          panel.style.height = '0px';
          const onEnd = function (e) {
            if (e && e.propertyName !== 'height') return;
            if (panel.hasAttribute('data-open')) return;
            panel.style.transition = '';
            panel.style.height = '';
            panel.style.overflow = '';
            panel.removeEventListener('transitionend', onEnd);
          };
          panel.addEventListener('transitionend', onEnd, { once: true });
          setTimeout(function () {
            if (!panel.hasAttribute('data-open') && panel.style.height !== '') {
              onEnd();
            }
          }, 400);
        });
      }
    }

    triggers.forEach(function (trigger, i) {
      const panelId = trigger.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;

      const initialOpen = trigger.getAttribute('aria-expanded') === 'true';
      if (initialOpen) {
        setPanelOpen(trigger, panel, true, false);
      } else {
        setPanelOpen(trigger, panel, false, false);
      }

      trigger.addEventListener('click', function () {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
        if (isSingle) {
          triggers.forEach(function (otherTrigger, j) {
            if (j === i) return;
            const otherPanel = document.getElementById(otherTrigger.getAttribute('aria-controls'));
            if (!otherPanel) return;
            const otherOpen = otherTrigger.getAttribute('aria-expanded') === 'true';
            if (otherOpen) setPanelOpen(otherTrigger, otherPanel, false, true);
          });
        }
        setPanelOpen(trigger, panel, !isOpen, true);
      });

      trigger.addEventListener('keydown', function (e) {
        const key = e.key;
        if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
          e.preventDefault();
          trigger.click();
          return;
        }
        if (isSingle && (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Home' || key === 'End')) {
          e.preventDefault();
          let nextIdx = i;
          if (key === 'ArrowDown') nextIdx = (i + 1) % triggers.length;
          else if (key === 'ArrowUp') nextIdx = (i - 1 + triggers.length) % triggers.length;
          else if (key === 'Home') nextIdx = 0;
          else if (key === 'End') nextIdx = triggers.length - 1;
          triggers[nextIdx].focus();
        }
      });
    });

    if ('ResizeObserver' in window) {
      triggers.forEach(function (trigger) {
        const panelId = trigger.getAttribute('aria-controls');
        const panel = panelId ? document.getElementById(panelId) : null;
        if (!panel) return;
        const content = panel.querySelector('.exp-accordion__content');
        if (!content) return;
        const ro = new ResizeObserver(function () {
          if (panel.hasAttribute('data-open') && panel.style.height === 'auto') {
            // já está auto, nada a fazer.
          }
        });
        ro.observe(content);
      });
    }
  }

  function renderProjects(projects) {
    if (!els.projectsGrid || !Array.isArray(projects)) return;
    els.projectsGrid.innerHTML = '';

    projects.forEach(function (proj) {
      const tagsHtml = (proj.tags || []).map(function (t) {
        return '<span class="project-tag">' + escapeHtml(t) + '</span>';
      }).join('');

      const badgesHtml = buildBadgesHtml(proj.badges || [], proj.github || '#');

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
          (badgesHtml ? '<div class="project-card__badges">' + badgesHtml + '</div>' : '') +
          '<div class="project-footer__actions">' +
            '<a class="btn btn--outline" href="' + escapeAttr(proj.github || '#') + '" target="_blank" rel="noopener noreferrer">' +
              ICONS.github.replace('<svg', '<svg width="15" height="15"') +
              ' Ver no GitHub' +
            '</a>' +
          '</div>' +
        '</div>';

      els.projectsGrid.appendChild(card);
    });
  }

  function buildBadgesHtml(badges, repoUrl) {
    if (!Array.isArray(badges) || badges.length === 0) return '';
    return badges.map(function (b) {
      const type = (b.type || '').toLowerCase();
      let url = '';
      let alt = '';
      if (type === 'github-actions' && b.repo) {
        const encRepo = encodeURIComponent(b.repo);
        const color = b.color || '10b981';
        const label = b.label ? encodeURIComponent(b.label) : 'CI%2FCD';
        url = 'https://img.shields.io/badge/' + label + '-ativo-%23' + color + '?logo=githubactions&logoColor=white&style=flat-square';
        alt = b.label || 'CI/CD GitHub Actions ativo';
      } else {
        const color = b.color || '6366f1';
        const label = b.label ? encodeURIComponent(b.label) : 'badge';
        url = 'https://img.shields.io/badge/' + label + '-%23' + color + '?style=flat-square';
        alt = b.label || 'badge';
      }
      const a = document.createElement('a');
      a.href = repoUrl + (repoUrl && repoUrl.endsWith('/') ? 'actions' : '/actions');
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'project-badge';
      a.title = alt;
      a.innerHTML = '<img src="' + url + '" alt="' + escapeAttr(alt) + '" loading="lazy" referrerpolicy="no-referrer" />';
      return a.outerHTML;
    }).join('');
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

  function renderLanguages(languages) {
    if (!els.languagesList || !Array.isArray(languages)) return;
    els.languagesList.innerHTML = '';

    languages.forEach(function (lang) {
      const item = document.createElement('div');
      item.className = 'list__item';
      item.innerHTML =
        '<div class="list__icon">' + (lang.icon || '🌐') + '</div>' +
        '<div class="list__content">' +
          '<h4>' + escapeHtml(lang.name || '') + (lang.level ? ' • ' + escapeHtml(lang.level) : '') + '</h4>' +
          (lang.description ? '<p>' + escapeHtml(lang.description) + '</p>' : '') +
        '</div>';
      els.languagesList.appendChild(item);
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
