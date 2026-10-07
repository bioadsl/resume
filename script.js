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
      if (profile.phone) {
        const waDigits = profile.phone.replace(/\D+/g, '');
        const waMsg = encodeURIComponent('Olá! Vi seu currículo/portfólio e gostaria de entrar em contato sobre oportunidades de QA / Testes.');
        const waUrl = 'https://wa.me/' + waDigits + '?text=' + waMsg;
        els.heroSocials.appendChild(createSocialLink(waUrl, profile.phone + ' · WhatsApp', ICONS.phone));
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

  /* ========================================================================
     ATS Resume Builder Module
     ======================================================================== */
  function initAtsBuilder() {
    const form = document.getElementById('atsForm');
    if (!form) return;

    const stepsContainer = document.getElementById('atsStepper');
    const stepperBtns = stepsContainer ? stepsContainer.querySelectorAll('.ats-step') : [];
    const panels = form.querySelectorAll('.ats-step__panel');
    const prevBtn = document.getElementById('atsPrevBtn');
    const nextBtn = document.getElementById('atsNextBtn');
    const printBtn = document.getElementById('atsPrintBtn');
    const fillDemoBtn = document.getElementById('atsFillDemoBtn');
    const clearBtn = document.getElementById('atsClearBtn');
    const addExpBtn = document.getElementById('atsAddExpBtn');
    const addEduBtn = document.getElementById('atsAddEduBtn');
    const addCertBtn = document.getElementById('atsAddCertBtn');
    const summaryCount = document.getElementById('summaryCount');

    const elsAts = {
      list: {
        exp: document.getElementById('atsExpList'),
        edu: document.getElementById('atsEduList'),
        cert: document.getElementById('atsCertList')
      },
      preview: {
        name: document.getElementById('cvName'),
        role: document.getElementById('cvRole'),
        contact: document.getElementById('cvContact'),
        summary: document.getElementById('cvSummary'),
        skills: document.getElementById('cvSkills'),
        exp: document.getElementById('cvExp'),
        edu: document.getElementById('cvEdu'),
        cert: document.getElementById('cvCerts')
      },
      score: {
        value: document.getElementById('atsScoreValue'),
        ring: document.querySelector('.ats-score__ring'),
        status: document.getElementById('atsScoreStatus'),
        desc: document.getElementById('atsScoreDesc'),
        list: document.getElementById('atsRulesList')
      }
    };

    const STORAGE_KEY = 'resume-ats-builder:v1';
    let state = {
      currentStep: 0,
      form: {},
      exp: [],
      edu: [],
      cert: []
    };

    // --------- Helpers ---------
    function escapeHtml(str) {
      if (str == null) return '';
      return String(str).replace(/[&<>"']/g, function (c) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
      });
    }

    function saveState() {
      try {
        const data = collectData(true);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (_) {}
    }

    function loadState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (_) {
        return null;
      }
    }

    function clearState() {
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    }

    function countChars(s) { return (s || '').length; }

    // --------- Step Navigation ---------
    function showStep(idx) {
      state.currentStep = Math.max(0, Math.min(stepperBtns.length - 1, idx));
      stepperBtns.forEach(function (b, i) {
        b.classList.toggle('active', i === state.currentStep);
        b.classList.toggle('done', i < state.currentStep);
        b.setAttribute('aria-selected', String(i === state.currentStep));
      });
      panels.forEach(function (p, i) {
        if (i === state.currentStep) {
          p.removeAttribute('hidden');
          p.scrollIntoView && p.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
          p.setAttribute('hidden', '');
        }
      });
      if (prevBtn) prevBtn.disabled = state.currentStep === 0;
      if (nextBtn) nextBtn.textContent = state.currentStep === stepperBtns.length - 1 ? 'Finalizar ✓' : 'Próximo →';
    }

    stepperBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const s = parseInt(btn.getAttribute('data-step') || '0', 10);
        showStep(s);
      });
    });

    if (prevBtn) prevBtn.addEventListener('click', function () { showStep(state.currentStep - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () {
      if (state.currentStep === stepperBtns.length - 1) {
        // Finalizar: rola para o preview e valida
        validateAll();
        window.scrollTo({ top: document.getElementById('ats-builder').offsetTop - 80, behavior: 'smooth' });
      } else {
        showStep(state.currentStep + 1);
      }
    });

    // --------- Dynamic lists: Experience / Education / Certifications ---------
    function renderExpList() {
      const root = elsAts.list.exp;
      if (!root) return;
      root.innerHTML = '';
      if (state.exp.length === 0) state.exp.push({ company: '', role: '', period: '', location: '', bullets: '' });
      state.exp.forEach(function (e, i) {
        const block = document.createElement('div');
        block.className = 'ats-nested';
        block.innerHTML =
          '<div class="ats-nested__header">' +
            '<div class="ats-nested__title">💼 Experiência #' + (i + 1) + '</div>' +
            (state.exp.length > 1 ? '<button type="button" class="ats-nested__remove" data-remove-exp="' + i + '">Remover</button>' : '') +
          '</div>' +
          '<div class="ats-nested__grid">' +
            '<label class="ats-field ats-field--full"><span>Empresa *</span><input data-exp="company" value="' + escapeHtml(e.company) + '" placeholder="Meta, Stefanini, Wipro..."></label>' +
            '<label class="ats-field"><span>Cargo *</span><input data-exp="role" value="' + escapeHtml(e.role) + '" placeholder="QA Automation Engineer"></label>' +
            '<label class="ats-field"><span>Período *</span><input data-exp="period" value="' + escapeHtml(e.period) + '" placeholder="Jan/2023 – Atual"></label>' +
            '<label class="ats-field ats-field--full"><span>Localização</span><input data-exp="location" value="' + escapeHtml(e.location) + '" placeholder="Brasília - DF · Remoto"></label>' +
            '<label class="ats-field ats-field--full"><span>Principais conquistas (1 por linha, verbos + dados)</span>' +
              '<textarea data-exp="bullets" rows="4" placeholder="• Reduzi o tempo de regressão em 60% com framework Python + Behave.&#10;• Liderava 3 QAs, integrei testes ao pipeline Jenkins.&#10;• Validei APIs REST com Postman/Newman/RestAssured.">' + escapeHtml(e.bullets) + '</textarea>' +
            '</label>' +
          '</div>';
        root.appendChild(block);
      });

      root.querySelectorAll('[data-remove-exp]').forEach(function (b) {
        b.addEventListener('click', function () {
          const idx = parseInt(b.getAttribute('data-remove-exp') || '0', 10);
          state.exp.splice(idx, 1);
          renderExpList();
          runAtsPipeline();
        });
      });

      root.querySelectorAll('[data-exp]').forEach(function (inp) {
        inp.addEventListener('input', function (ev) {
          const p = ev.target.closest('.ats-nested');
          const idx = Array.prototype.indexOf.call(root.children, p);
          if (idx === -1) return;
          const key = ev.target.getAttribute('data-exp');
          state.exp[idx][key] = ev.target.value;
          saveState();
          runAtsPipeline();
        });
      });
    }

    function renderEduList() {
      const root = elsAts.list.edu;
      if (!root) return;
      root.innerHTML = '';
      if (state.edu.length === 0) state.edu.push({ institution: '', course: '', period: '', extra: '' });
      state.edu.forEach(function (e, i) {
        const block = document.createElement('div');
        block.className = 'ats-nested';
        block.innerHTML =
          '<div class="ats-nested__header">' +
            '<div class="ats-nested__title">🎓 Formação #' + (i + 1) + '</div>' +
            (state.edu.length > 1 ? '<button type="button" class="ats-nested__remove" data-remove-edu="' + i + '">Remover</button>' : '') +
          '</div>' +
          '<div class="ats-nested__grid">' +
            '<label class="ats-field"><span>Instituição *</span><input data-edu="institution" value="' + escapeHtml(e.institution) + '" placeholder="Instituto Superior Fátima (ISF)"></label>' +
            '<label class="ats-field"><span>Curso *</span><input data-edu="course" value="' + escapeHtml(e.course) + '" placeholder="Graduação em Análise e Desenvolvimento de Sistemas"></label>' +
            '<label class="ats-field ats-field--full"><span>Período</span><input data-edu="period" value="' + escapeHtml(e.period) + '" placeholder="2012 – 2016 · Concluído"></label>' +
            '<label class="ats-field ats-field--full"><span>Formações / Cursos complementares</span>' +
              '<textarea data-edu="extra" rows="2" placeholder="Administrador de Redes Linux; Redes de Computadores (ETB); Web Design (Bit Company).">' + escapeHtml(e.extra) + '</textarea>' +
            '</label>' +
          '</div>';
        root.appendChild(block);
      });

      root.querySelectorAll('[data-remove-edu]').forEach(function (b) {
        b.addEventListener('click', function () {
          const idx = parseInt(b.getAttribute('data-remove-edu') || '0', 10);
          state.edu.splice(idx, 1);
          renderEduList();
          runAtsPipeline();
        });
      });

      root.querySelectorAll('[data-edu]').forEach(function (inp) {
        inp.addEventListener('input', function (ev) {
          const p = ev.target.closest('.ats-nested');
          const idx = Array.prototype.indexOf.call(root.children, p);
          if (idx === -1) return;
          const key = ev.target.getAttribute('data-edu');
          state.edu[idx][key] = ev.target.value;
          saveState();
          runAtsPipeline();
        });
      });
    }

    function renderCertList() {
      const root = elsAts.list.cert;
      if (!root) return;
      root.innerHTML = '';
      if (state.cert.length === 0) state.cert.push({ name: '', issuer: '', year: '' });
      state.cert.forEach(function (c, i) {
        const block = document.createElement('div');
        block.className = 'ats-nested';
        block.innerHTML =
          '<div class="ats-nested__header">' +
            '<div class="ats-nested__title">🏆 Certificação #' + (i + 1) + '</div>' +
            (state.cert.length > 1 ? '<button type="button" class="ats-nested__remove" data-remove-cert="' + i + '">Remover</button>' : '') +
          '</div>' +
          '<div class="ats-nested__grid">' +
            '<label class="ats-field"><span>Nome da certificação *</span><input data-cert="name" value="' + escapeHtml(c.name) + '" placeholder="ISTQB CTFL - Certified Tester Foundation Level"></label>' +
            '<label class="ats-field"><span>Emissor / Instituição</span><input data-cert="issuer" value="' + escapeHtml(c.issuer) + '" placeholder="BSTQB / ISACA"></label>' +
            '<label class="ats-field ats-field--full"><span>Ano obtenção</span><input data-cert="year" value="' + escapeHtml(c.year) + '" placeholder="2019"></label>' +
          '</div>';
        root.appendChild(block);
      });

      root.querySelectorAll('[data-remove-cert]').forEach(function (b) {
        b.addEventListener('click', function () {
          const idx = parseInt(b.getAttribute('data-remove-cert') || '0', 10);
          state.cert.splice(idx, 1);
          renderCertList();
          runAtsPipeline();
        });
      });

      root.querySelectorAll('[data-cert]').forEach(function (inp) {
        inp.addEventListener('input', function (ev) {
          const p = ev.target.closest('.ats-nested');
          const idx = Array.prototype.indexOf.call(root.children, p);
          if (idx === -1) return;
          const key = ev.target.getAttribute('data-cert');
          state.cert[idx][key] = ev.target.value;
          saveState();
          runAtsPipeline();
        });
      });
    }

    if (addExpBtn) addExpBtn.addEventListener('click', function () {
      state.exp.push({ company: '', role: '', period: '', location: '', bullets: '' });
      renderExpList();
      runAtsPipeline();
    });
    if (addEduBtn) addEduBtn.addEventListener('click', function () {
      state.edu.push({ institution: '', course: '', period: '', extra: '' });
      renderEduList();
      runAtsPipeline();
    });
    if (addCertBtn) addCertBtn.addEventListener('click', function () {
      state.cert.push({ name: '', issuer: '', year: '' });
      renderCertList();
      runAtsPipeline();
    });

    // --------- Collect data from form + dynamic lists ---------
    function collectData(silent) {
      const data = {
        form: {},
        exp: state.exp.map(function (x) { return Object.assign({}, x); }),
        edu: state.edu.map(function (x) { return Object.assign({}, x); }),
        cert: state.cert.map(function (x) { return Object.assign({}, x); })
      };
      const fields = ['fullName', 'role', 'email', 'phone', 'location', 'linkedin', 'portfolio', 'summary', 'skills', 'frameworks', 'tools'];
      fields.forEach(function (f) {
        const inp = form.querySelector('[name="' + f + '"]');
        if (inp) data.form[f] = inp.value || '';
      });
      return data;
    }

    function applyLoadedState(data) {
      if (!data) return;
      const fields = ['fullName', 'role', 'email', 'phone', 'location', 'linkedin', 'portfolio', 'summary', 'skills', 'frameworks', 'tools'];
      fields.forEach(function (f) {
        const inp = form.querySelector('[name="' + f + '"]');
        if (inp && data.form && data.form[f] != null) inp.value = data.form[f];
      });
      if (Array.isArray(data.exp) && data.exp.length) state.exp = data.exp;
      if (Array.isArray(data.edu) && data.edu.length) state.edu = data.edu;
      if (Array.isArray(data.cert) && data.cert.length) state.cert = data.cert;
      renderExpList();
      renderEduList();
      renderCertList();
      // Update summary counter
      const summaryEl = form.querySelector('[name="summary"]');
      if (summaryEl && summaryCount) summaryCount.textContent = countChars(summaryEl.value);
    }

    function fillDemoData() {
      const demo = {
        form: {
          fullName: 'Fabrício Duarte',
          role: 'QA Automation Engineer & Senior Test Analyst',
          email: 'fabricio.4135@gmail.com',
          phone: '(61) 98426-0515',
          location: 'Brasília - DF',
          linkedin: 'https://www.linkedin.com/in/fabr%C3%ADcio-duarte-5223062a/',
          portfolio: 'https://github.com/bioadsl',
          summary: 'Analista de Testes Sênior e QA Automation Engineer com mais de 10 anos de sólida experiência em engenharia de qualidade de software, com forte atuação em liderança técnica e automação de testes funcionais e não-funcionais. Especialista na criação de robustos Test Automation Frameworks (Selenium, Cypress, Playwright, Katalon, Robot) para Web e Mobile. Amplo domínio em validação de APIs REST/SOAP com Postman, Newman e RestAssured. Atuação em sistemas de alta complexidade e missão crítica (Financeiro, Segurança Pública, Telecomunicações). Profissional certificado ISTQB CTFL, cultura Shift-Left e metodologias ágeis Scrum/Kanban com integração contínua em pipelines Jenkins e GitLab CI.',
          skills: 'Java, Python, JavaScript, Ruby, SQL, COBOL, TypeScript, HTML, CSS',
          frameworks: 'Selenium WebDriver, Cypress, Playwright, Katalon Studio, Robot Framework, Cucumber, JUnit, Behave, Capybara, RestAssured, LeanFT',
          tools: 'Postman, Newman, Apidog, Swagger/OpenAPI, SoapUI, JMeter, Jenkins, Git, GitHub, GitLab CI, Jira, Redmine, TestLink, QASE, IBM RQM, Zephir, SonarQube, AWS, Docker, Scrum, Kanban, Shift-Left, ISTQB, Graylog, Mainframe'
        },
        exp: [
          {
            company: 'Meta', role: 'Analista de Qualidade de Software III (Sênior)', period: 'Dez/2025 – Atual', location: 'Remoto · Global',
            bullets: '• Otimizei a estabilidade e confiabilidade de plataformas globais conectando bilhões de usuários, por meio de frameworks de automação de testes de alta performance.\n• Garanti a integridade de contratos e regras de negócio em arquiteturas de microsserviços escaláveis, com validações rigorosas de APIs REST usando Postman, Newman e RestAssured.\n• Mitiguei riscos em produção via Data Validation em bancos Oracle, DB2, PostgreSQL e MySQL, criando cenários de teste complexos.'
          },
          {
            company: 'G4F (TSE / Trib. Eleitoral)', role: 'Analista de Qualidade de Software Sênior', period: 'Jun/2024 – Abr/2025', location: 'Brasília - DF',
            bullets: '• Assegurei a estabilidade em escala nacional de sistemas eleitorais e e-Título Android/iOS, sob tráfego massivo e alta criticidade.\n• Validei fluxos críticos de integridade biométrica e Liveness ativo/passivo, executando testes sobre a biblioteca GRIAULE.\n• Planejei e gerenciei testes nacionais de estresse, carga e performance em Apache JMeter, em cenários de eleições simuladas.\n• Desenvolvi ferramenta interna em Angular para geração de massas e consultas SQL estruturadas, reduzindo em 40% o tempo de preparação.\n• Diminuí falhas técnicas na esteira e assegurei conformidade ISO 27001 e LGPD, com Shift-Left desde suporte N1.'
          },
          {
            company: 'Snowman Labs', role: 'Analista de QA Sênior', period: 'Jan/2023 – Mai/2024', location: 'Brasília - DF',
            bullets: '• Liderei autonomamente a estratégia global de qualidade em fábrica ágil, estruturando planos, roteiros e suítes fim a fim no QASE.\n• Implementei framework de automação com Python + Behave (BDD/Gherkin), integrados ao CI/CD, acelerando detecção de defeitos diária.\n• Garanti paridade técnica e qualidade visual em Web/Mobile, isolando falhas front/back com Postman e Swagger.\n• Gerenciei ambientes de homologação em VMs e consultas avançadas em PostgreSQL para auditoria de dados.'
          },
          {
            company: 'Wipro (Projeto Telefônica VIVO)', role: 'Lead Test Analyst', period: 'Jan/2021 – Set/2022', location: 'Remoto',
            bullets: '• Liderei squads técnicos de engenharia de testes para o ecossistema crítico da VIVO, com estratégias de automação em Salesforce.\n• Implementei suítes robustas para validação sistêmica em Salesforce usando Java/JUnit/Cucumber e LeanFT.\n• Construí testes automatizados de API (REST) com RestAssured, elevando a confiabilidade das integrações de telecomunicações.\n• Automatizei esteiras build/test/deploy em Linux via SSH, gerindo ciclo DevOps via GitLab CI e Jenkins.'
          }
        ],
        edu: [
          {
            institution: 'Instituto Superior Fátima (ISF)',
            course: 'Graduação em Análise e Desenvolvimento de Sistemas',
            period: '2012 – 2016 · Concluído',
            extra: 'Administrador de Redes Linux (Sistemas Abertos); Redes de Computadores e Infraestrutura (ETB); Web Design e Mídias Digitais (Bit Company).'
          }
        ],
        cert: [
          { name: 'ISTQB CTFL - Certified Tester Foundation Level', issuer: 'BSTQB', year: '2015' },
          { name: 'Automação Web Avançada com Python, Selenium e Behave', issuer: 'Formação Técnica', year: '2023' },
          { name: 'Automação Multistack com Capybara, Cucumber e Ruby', issuer: 'Formação Técnica', year: '2022' },
          { name: 'Treinamento e Governança em LGPD', issuer: 'Compliance', year: '2024' }
        ]
      };
      applyLoadedState(demo);
      saveState();
      runAtsPipeline();
    }

    function clearAll() {
      if (!confirm('Tem certeza que deseja limpar todo o conteúdo do currículo?')) return;
      state.exp = []; state.edu = []; state.cert = [];
      form.reset();
      renderExpList(); renderEduList(); renderCertList();
      clearState();
      runAtsPipeline();
    }

    if (fillDemoBtn) fillDemoBtn.addEventListener('click', fillDemoData);
    if (clearBtn) clearBtn.addEventListener('click', clearAll);
    if (printBtn) printBtn.addEventListener('click', function () {
      // Exporta o currículo para PDF nativo via window.print + estilos @media print ATS
      window.setTimeout(function () {
        window.print();
      }, 60);
    });

    // --------- Live form events: input + preview update ---------
    form.addEventListener('input', function (ev) {
      saveState();
      // Summary counter
      if (ev.target && ev.target.name === 'summary' && summaryCount) {
        summaryCount.textContent = countChars(ev.target.value);
      }
      runAtsPipeline();
    });

    // --------- Render Live Preview (CV paper) ---------
    function renderPreview(data) {
      const f = data.form || {};
      const cv = elsAts.preview;

      const setText = function (el, v, emptyText) {
        if (!el) return;
        if (!v) { el.textContent = emptyText || ''; el.classList.add('cv__empty'); return; }
        el.classList.remove('cv__empty');
        el.textContent = v;
      };

      setText(cv.name, (f.fullName || '').trim() || 'NOME COMPLETO', 'NOME COMPLETO');
      setText(cv.role, (f.role || '').trim() || 'Cargo Profissional', 'Cargo Profissional');

      if (cv.contact) {
        const parts = [];
        if (f.email) parts.push(f.email);
        if (f.phone) parts.push(f.phone);
        if (f.location) parts.push(f.location);
        if (f.linkedin) parts.push('LinkedIn: ' + f.linkedin.replace(/^https?:\/\//, ''));
        if (f.portfolio) parts.push('Portfólio: ' + f.portfolio.replace(/^https?:\/\//, ''));
        cv.contact.innerHTML = parts.map(escapeHtml).join(' &nbsp;·&nbsp; ');
      }

      setText(cv.summary, f.summary);

      if (cv.skills) {
        const blocks = [f.skills, f.frameworks, f.tools].filter(function (x) { return x && x.trim(); });
        if (!blocks.length) { cv.skills.classList.add('cv__empty'); cv.skills.textContent = 'Java · Python · SQL · Selenium · Postman · Cypress · Jenkins · Scrum'; }
        else {
          cv.skills.classList.remove('cv__empty');
          cv.skills.textContent = blocks.map(function (b) {
            return b.split(/[,;]/).map(function (s) { return s.trim(); }).filter(Boolean).join(' · ');
          }).join('\n');
        }
      }

      // Experience
      if (cv.exp) {
        const has = data.exp && data.exp.some(function (e) { return e.company || e.role; });
        if (!has) { cv.exp.classList.add('cv__empty'); cv.exp.innerHTML = 'Exemplo:<br><strong>EMPRESA</strong> — Cargo · Jan/2023 – Atual · Cidade - UF<br>• Implementei framework de automação reduzindo tempo de regressão em 60%.'; }
        else {
          cv.exp.classList.remove('cv__empty');
          cv.exp.innerHTML = data.exp.map(function (e) {
            const bullets = (e.bullets || '')
              .split(/\r?\n/)
              .map(function (s) { return s.replace(/^[•\-\*\d\.\)\s]+/, '').trim(); })
              .filter(Boolean)
              .map(function (b) { return '<li>' + escapeHtml(b) + '</li>'; })
              .join('');
            const top = '<span class="cv-exp__company">' + escapeHtml(e.company || '—') + '</span>' +
                        '<span class="cv-exp__period">' + escapeHtml(e.period || '') + '</span>';
            return '<div class="cv-exp__item">' +
                     '<div class="cv-exp__top">' + top + '</div>' +
                     '<div class="cv-exp__position">' + escapeHtml(e.role || '') + '</div>' +
                     (e.location ? '<div class="cv-exp__loc">' + escapeHtml(e.location) + '</div>' : '') +
                     (bullets ? '<ul class="cv-exp__bullets">' + bullets + '</ul>' : '') +
                   '</div>';
          }).join('');
        }
      }

      // Education
      if (cv.edu) {
        const has = data.edu && data.edu.some(function (e) { return e.institution || e.course; });
        if (!has) { cv.edu.classList.add('cv__empty'); cv.edu.innerHTML = '<strong>INSTITUIÇÃO</strong> — Graduação em Análise e Desenvolvimento de Sistemas · 2015 – 2018'; }
        else {
          cv.edu.classList.remove('cv__empty');
          cv.edu.innerHTML = data.edu.map(function (e) {
            const title = '<strong>' + escapeHtml(e.institution || '—') + '</strong> — ' + escapeHtml(e.course || '');
            const extras = [e.period, e.extra].filter(Boolean).join(' · ');
            return '<div class="cv-edu__item">' + title + (extras ? '<div>' + escapeHtml(extras) + '</div>' : '') + '</div>';
          }).join('');
        }
      }

      // Certifications
      if (cv.cert) {
        const has = data.cert && data.cert.some(function (c) { return c.name; });
        if (!has) { cv.cert.classList.add('cv__empty'); cv.cert.textContent = 'ISTQB CTFL (BSTQB) · 2019 · COBIT 5 Foundation (ISACA) · 2021'; }
        else {
          cv.cert.classList.remove('cv__empty');
          cv.cert.innerHTML = data.cert.map(function (c) {
            const parts = [c.name, c.issuer, c.year].filter(Boolean).join(' · ');
            return '<div class="cv-cert__item"><strong>' + escapeHtml(c.name || '—') + '</strong>' + (c.issuer || c.year ? ' · ' + escapeHtml([c.issuer, c.year].filter(Boolean).join(', ')) : '') + '</div>';
          }).join('');
        }
      }
    }

    // --------- ATS Validator: 15 rules (Workday / SuccessFactors / Greenhouse) ---------
    function buildRules(data) {
      const f = data.form || {};
      const skillsFlat = [f.skills, f.frameworks, f.tools].join(' ').toLowerCase();
      const sumLower = (f.summary || '').toLowerCase();
      const exp = data.exp || [];
      const edu = data.edu || [];
      const cert = data.cert || [];

      const rules = [];

      const rule = function (pass, warn, title, hint, weight) {
        const status = pass ? 'pass' : (warn ? 'warn' : 'fail');
        rules.push({ status: status, title: title, hint: hint, weight: weight || 1 });
      };

      // 1. Nome completo
      rule(
        !!f.fullName && f.fullName.trim().split(/\s+/).length >= 2,
        false,
        'Nome completo detectável',
        'ATS extraem o nome na 1ª linha. Evite abreviações (ex: "Fabricio D.") — escreva nome + sobrenome.',
        2
      );

      // 2. Cargo profissional
      rule(
        !!f.role && f.role.trim().length >= 15,
        !!f.role,
        'Cargo profissional definido',
        'Use títulos compatíveis com anúncios: "QA Automation Engineer", "Senior Test Analyst", "SDET", "Analista de Testes Sênior".',
        2
      );

      // 3. E-mail profissional
      rule(
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email || '') && !/(hotmail|ig|yahoo|bol\.com\.br)/i.test(f.email),
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email || ''),
        'E-mail profissional válido',
        'Prefira Gmail, domínio próprio ou Outlook. Evite provedores desatualizados (Hotmail, Yahoo, Bol).',
        2
      );

      // 4. Telefone para contato
      rule(!!f.phone && f.phone.replace(/\D/g, '').length >= 11, !!f.phone, 'Telefone / WhatsApp presente', 'Número com DDD + 9 dígitos: scanners de IA extraem contato direto para triagem inicial.', 1);

      // 5. LinkedIn
      rule(
        /linkedin\.com\/in\/[^/\s]+/i.test(f.linkedin || ''),
        !!(f.linkedin && f.linkedin.includes('linkedin')),
        'LinkedIn com /in/ customizado',
        'Ajuste sua URL do LinkedIn para um perfil público padrão: linkedin.com/in/seu-nome.',
        1
      );

      // 6. Resumo size >= 250 chars
      rule(
        countChars(f.summary) >= 250,
        countChars(f.summary) >= 150,
        'Resumo profissional ≥ 250 caracteres',
        '3–5 frases: anos de XP, stack principal, domínio de atuação, 1–2 projetos de impacto. IA recrutadoras usam esse bloco para match.',
        3
      );

      // 7. Keywords de QA / Automation
      const requiredKws = ['selenium', 'cypress', 'playwright', 'api', 'jenkins', 'sql', 'cucumber', 'bdd', 'ci/cd', 'jira', 'scrum'];
      let matched = 0;
      requiredKws.forEach(function (k) { if (skillsFlat.indexOf(k) !== -1 || sumLower.indexOf(k) !== -1) matched++; });
      rule(matched >= 8, matched >= 5, 'Palavras-chave de QA: ' + matched + '/' + requiredKws.length,
        'Palavras do anúncio: Selenium, Cypress, Playwright, API, Jenkins, SQL, Cucumber/BDD, CI/CD, Jira, Scrum. Quanto mais match, maior rank no ATS.', 3);

      // 8. Skills section filled
      rule(
        countChars(f.skills) >= 80 && countChars(f.frameworks) >= 50,
        countChars(f.skills) >= 30,
        'Habilidades detalhadas',
        'Separe Linguagens, Frameworks de Automação e Ferramentas. ATS ranqueiam por frequência dessas keywords.',
        2
      );

      // 9. 3+ recent experience
      rule(exp.filter(function (e) { return e.company && e.role; }).length >= 3,
        exp.filter(function (e) { return e.company && e.role; }).length >= 2,
        'Mínimo 3 cargos recentes listados',
        'Experiências: empregabilidade. Evite gaps > 2 anos sem justificativa no resumo.',
        3
      );

      // 10. Bullets with numbers / metrics
      const hasMetrics = exp.some(function (e) { return /(\d+[.,]?\d*%\s|R\$|\+?\d+(?:\.\d+)?\s*(?:%|anos|meses|equipes|qas|usuários|casos|scripts|repositórios?|testes))/.test(e.bullets || ''); });
      rule(hasMetrics, false, 'Resultados mensuráveis (% / R$ / quantidade)',
        'Use verbos ação (Implementei, Lidei, Reduzi, Otimizei) + números: "redução de 60%", "liderava 3 QAs", "R$ 2M/ano economizados". IA prioriza impacto numérico.',
        3
      );

      // 11. Experience bullets per role >= 2
      const goodBullets = exp.filter(function (e) { return (e.bullets || '').split(/\r?\n/).filter(function (l) { return l.trim().length > 15; }).length >= 2; }).length;
      const minForPass = Math.max(2, Math.floor(exp.length * 0.7));
      rule(goodBullets >= minForPass, goodBullets >= 1,
        '≥ 2 bullets por cargo: ' + goodBullets + '/' + exp.length,
        'Evite "Realizei testes". Escreva: Contexto → Ação → Impacto (CAR).', 2);

      // 12. Education
      rule(edu.filter(function (e) { return e.institution && e.course; }).length >= 1,
        edu.some(function (e) { return e.institution || e.course; }),
        'Formação acadêmica registrada',
        'Sistemas Workday validam formação mínima para o cargo. Mantenha graduação completa + cursos complementares.', 2);

      // 13. Certifications presence
      rule(cert.filter(function (c) { return c.name; }).length >= 2,
        cert.some(function (c) { return c.name; }),
        'Certificações listadas (ex: ISTQB CTFL)',
        'Certificações diferenciam: ISTQB, AWS, Scrum, Cypress, Selenium. Diferencial em vagas de QA sênior.', 1);

      // 14. No special chars in critical fields (images/tables detection)
      const suspectChars = /[\u2700-\u27BF\u{1F000}-\u{1FAFF}\|“”‘’•●◆★☆✓✗]/u.test([f.fullName, f.role, f.email, f.phone, f.location].join(''));
      rule(!suspectChars, !suspectChars,
        'Sem caracteres especiais no topo do currículo',
        'Evite emojis, ícones, pipes e símbolos em nome/cargo/contato — Workday/Greenhouse quebram a extração.', 2);

      // 15. ATS-friendly filename + export PDF (button available when >=65pts is a proxy for preview being rich)
      rule(
        exp.length >= 2 && countChars(f.summary) >= 250 && matched >= 7,
        true,
        'Pronto para exportar em PDF',
        'Clique em "Exportar PDF ATS" (via impressão do navegador). Salve como "Nome-Sobrenome-QA-Automation-Engineer-2026.pdf" — NUNCA envie "curriculo-final-v3.pdf".',
        2
      );

      return rules;
    }

    function renderRules(rules) {
      const list = elsAts.score.list;
      if (!list) return;
      list.innerHTML = rules.map(function (r) {
        return '<li class="ats-rule ' + r.status + '">' +
                 '<span class="ats-rule__icon" aria-hidden="true"></span>' +
                 '<div><div class="ats-rule__title">' + escapeHtml(r.title) + '</div>' +
                 (r.hint ? '<div class="ats-rule__hint">' + escapeHtml(r.hint) + '</div>' : '') +
                 '</div></li>';
      }).join('');
    }

    function calcScore(rules) {
      let max = 0, have = 0;
      rules.forEach(function (r) {
        max += r.weight;
        if (r.status === 'pass') have += r.weight;
        else if (r.status === 'warn') have += Math.max(0, r.weight - 1);
      });
      if (max === 0) return 0;
      return Math.round((have / max) * 100);
    }

    function updateScore(score, rules) {
      const s = elsAts.score;
      if (s.value) s.value.textContent = String(score);
      const deg = Math.round((score / 100) * 360);
      if (s.ring) s.ring.style.setProperty('--score-deg', String(deg));

      let statusClass = 'fail', statusText = 'Compatibilidade baixa', desc = 'Ajuste os itens abaixo para aumentar sua pontuação. Currículos abaixo de 70 são comumente filtrados por Workday e IA recrutadoras.';
      if (score >= 85) { statusClass = 'pass'; statusText = 'Excelente! ATS-ready'; desc = 'Seu currículo está alinhado aos 15 padrões de Workday, SuccessFactors, Greenhouse e Lumesse. Pode exportar! 🎉'; }
      else if (score >= 65) { statusClass = 'warn'; statusText = 'Pontuação boa · pode melhorar'; desc = 'Quase lá! Foco em: resumo >250 chars + bullets com métricas (%) + keywords de QA.'; }

      if (s.status) { s.status.className = 'ats-score__status ' + statusClass; s.status.textContent = statusText; }
      if (s.desc) s.desc.textContent = desc;

      // Habilitar botão exportar
      if (printBtn) printBtn.disabled = score < 40;
    }

    function validateAll() {
      // Vai passo a passo marcando steps completos
      const data = collectData(true);
      const rules = buildRules(data);
      renderRules(rules);
      const score = calcScore(rules);
      updateScore(score, rules);
    }

    // --------- Pipeline: on every input → update preview + validator ---------
    function runAtsPipeline() {
      const data = collectData(true);
      renderPreview(data);
      const rules = buildRules(data);
      renderRules(rules);
      const score = calcScore(rules);
      updateScore(score, rules);
    }

    // --------- Init ---------
    const saved = loadState();
    if (saved) {
      applyLoadedState(saved);
    } else {
      // Inicializa arrays vazios
      state.exp = [{ company: '', role: '', period: '', location: '', bullets: '' }];
      state.edu = [{ institution: '', course: '', period: '', extra: '' }];
      state.cert = [{ name: '', issuer: '', year: '' }];
      renderExpList(); renderEduList(); renderCertList();
    }

    // Summary counter initial
    const summaryEl = form.querySelector('[name="summary"]');
    if (summaryEl && summaryCount) summaryCount.textContent = countChars(summaryEl.value);

    showStep(0);
    runAtsPipeline();
  }

  initAtsBuilder();

})();