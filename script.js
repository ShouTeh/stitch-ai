/* ==========================================
   SMK Student Developer Portfolio - JavaScript Logic
   Interactive CLI, Background Particles, Modals & Filters
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Background Particle Canvas Animation ---
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 20), 60);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? '#00f2fe' : '#8b5cf6',
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Draw grid lines subtly
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update and draw particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 120) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // --- 2. Navbar Scroll & Theme Toggle ---
  const navbar = document.getElementById('navbar');
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlighting based on scroll position
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        const id = sec.getAttribute('id');
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-active');
    });
  }

  // Dark/Light Theme Switching
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      
      if (themeIcon) {
        themeIcon.className = newTheme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      }
      showToast(`Switched to ${newTheme.toUpperCase()} theme mode!`);
    });
  }

  // --- 3. Skill Bar Observer Animation ---
  const skillBars = document.querySelectorAll('.skill-progress-bar');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const progress = bar.getAttribute('data-progress');
        bar.style.width = `${progress}%`;
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach(bar => skillObserver.observe(bar));

  // --- 4. Projects Category Filter ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- 5. Project Detail Modal Data & Event Handlers ---
  const projectData = {
    1: {
      type: 'Full-Stack Web App',
      title: 'SIKAD - Academic & Student Management System',
      desc: 'Built specifically for vocational high schools in Indonesia (SMK), SIKAD streamlines student attendance tracking, online grade reports, digital teacher signatures, and automated PDF export for parents.',
      img: './assets/sikad.jpg',
      highlights: [
        'Built with React 18, Vite, and Tailwind CSS glassmorphism UI components',
        'Backend powered by Express.js REST API with PostgreSQL and Prisma ORM',
        'Role-Based Access Control (RBAC) for Teachers, Students, and School Admins',
        'Generated PDF transcript reports with QR code authenticity verification'
      ],
      repo: 'https://github.com/prabubagas/sikad-academic-portal',
      demo: 'https://sikad-demo.smkn2surakarta.sch.id'
    },
    2: {
      type: 'E-Commerce & Service Portal',
      title: 'SMK-Hub Vocational Student Marketplace',
      desc: 'A digital marketplace empowering SMK students to list and sell their vocational projects (such as custom IoT hardware, CNC parts, web templates, and graphic design services) to industry clients.',
      img: './assets/smkhub.jpg',
      highlights: [
        'Next.js App Router with Server Components and SSR optimization',
        'Integrated Midtrans Payment Gateway for local Indonesian bank transfers & QRIS',
        'Student Seller Dashboard with live revenue charts and order status updates',
        'Automated digital file delivery for software templates and 3D design files'
      ],
      repo: 'https://github.com/prabubagas/smkhub-marketplace',
      demo: 'https://smkhub-market.vercel.app'
    },
    3: {
      type: 'IoT & Real-Time Telemetry',
      title: 'Smart Classroom Ambient & Energy Monitor',
      desc: 'An IoT solution for vocational school computer labs. Microcontroller sensors send temperature, AQI air quality, noise decibels, and room occupancy telemetry to a real-time web dashboard.',
      img: './assets/iot.jpg',
      highlights: [
        'ESP32 microcontroller firmware written in C++ with MQTT broker communication',
        'WebSockets server pushing live sensor updates to Chart.js gauges under 100ms latency',
        'Automated AC cooling relay trigger when room temperature exceeds 26°C',
        'Historical sensor logs saved in InfluxDB with CSV data export'
      ],
      repo: 'https://github.com/prabubagas/smart-classroom-iot',
      demo: 'https://iot-lab.smkn2surakarta.sch.id'
    },
    4: {
      type: 'EdTech & Code Platform',
      title: 'DevPulse SMK Code Snippets & Challenge Hub',
      desc: 'Online coding challenge platform built for SMK software engineering students featuring live syntax highlighting, automated unit test execution, and real-time school leaderboard.',
      img: './assets/devpulse.jpg',
      highlights: [
        'Integrated Monaco Code Editor (VS Code engine) with custom dark neon theme',
        'Docker containerized code execution sandbox supporting JS, Python, and C++',
        'Automated unit testing suite evaluating student algorithm time complexity',
        'Interactive code snippet snippet sharing with instant embed code'
      ],
      repo: 'https://github.com/prabubagas/devpulse-code-hub',
      demo: 'https://devpulse-smk.vercel.app'
    }
  };

  const modal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-img');
  const modalType = document.getElementById('modal-type');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalHighlights = document.getElementById('modal-highlights');
  const modalRepoLink = document.getElementById('modal-repo-link');
  const modalLiveLink = document.getElementById('modal-live-link');

  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pId = btn.getAttribute('data-project');
      const data = projectData[pId];

      if (data) {
        modalImg.src = data.img;
        modalType.textContent = data.type;
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;
        
        modalHighlights.innerHTML = data.highlights.map(h => `<li><i class="fa-solid fa-check" style="color: var(--accent-cyan); margin-right: 0.5rem;"></i>${h}</li>`).join('');
        modalRepoLink.href = data.repo;
        modalLiveLink.href = data.demo;

        modal.classList.add('active');
      }
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => modal.classList.remove('active'));
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  // --- 6. Interactive CLI Terminal Logic ---
  const terminalInput = document.getElementById('terminal-input');
  const terminalBody = document.getElementById('terminal-body');
  const chipBtns = document.querySelectorAll('.chip-btn');

  const cliCommands = {
    help: `⚡ Available Commands:<br>
          • <strong style="color: var(--accent-cyan)">about</strong> - Vocational background & education<br>
          • <strong style="color: var(--accent-cyan)">skills</strong> - Technical stack breakdown<br>
          • <strong style="color: var(--accent-cyan)">projects</strong> - Top repository overview<br>
          • <strong style="color: var(--accent-cyan)">lks</strong> - LKS SMK competition achievements<br>
          • <strong style="color: var(--accent-cyan)">contact</strong> - Email, WhatsApp, and GitHub<br>
          • <strong style="color: var(--accent-cyan)">clear</strong> - Clear console screen`,

    about: `<div style="color: var(--text-main);">
            🎓 <strong>Name:</strong> Prabu Bagas Pradipa<br>
            🏫 <strong>School:</strong> SMKN 2 Surakarta (Class of 2026)<br>
            📍 <strong>Location:</strong> Surakarta, Jawa Tengah<br>
            💻 <strong>Major:</strong> Rekayasa Perangkat Lunak (Software Engineering)<br>
            📜 <strong>Status:</strong> BNSP Certified Junior Web Developer<br>
            🎯 <strong>Focus:</strong> Full-Stack Web Development, Node.js APIs, and IoT Systems.
           </div>`,

    skills: `<div style="color: var(--text-main);">
            🛠️ <strong>Frontend:</strong> JavaScript ES6+, TypeScript, React.js, Next.js, HTML5/CSS3, Tailwind.<br>
            ⚙️ <strong>Backend:</strong> Node.js, Express, PHP Laravel, PostgreSQL, MySQL, Prisma ORM.<br>
            🌐 <strong>DevOps & Tools:</strong> Git/GitHub, Docker, Linux Shell, Postman, Vercel, ESP32 IoT.
            </div>`,

    projects: `<div style="color: var(--text-main);">
              📂 <strong>1. SIKAD Academic Portal</strong> (React, Node.js, PostgreSQL)<br>
              📂 <strong>2. SMK-Hub Marketplace</strong> (Next.js, Express, Midtrans)<br>
              📂 <strong>3. Smart Classroom IoT</strong> (ESP32, WebSockets, Chart.js)<br>
              📂 <strong>4. DevPulse Code Hub</strong> (TypeScript, Monaco Editor, Docker API)
             </div>`,

    lks: `<div style="color: var(--text-main);">
          🏆 <strong>1st Place - LKS SMK Web Technologies 2025 (Jawa Tengah / Surakarta)</strong><br>
          Module A: Client-Side Web Application (React & State Management)<br>
          Module B: Server-Side REST API Development & SQL Schema<br>
          Module C: Speed Coding & CSS Layout Challenge.
         </div>`,

    contact: `<div style="color: var(--text-main);">
              📧 <strong>Email:</strong> bagassprabu@gmail.com<br>
              💬 <strong>WhatsApp:</strong> +62 822-2708-1946<br>
              octocat <strong>GitHub:</strong> github.com/prabubagas
             </div>`
  };

  function executeCommand(cmd) {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    // Append prompt line
    const promptLine = document.createElement('div');
    promptLine.className = 'term-line';
    promptLine.innerHTML = `<span class="term-prompt">prabu@smk-dev</span>:<span class="term-path">~/portfolio</span>$ <span class="term-cmd">${escapeHTML(cmd)}</span>`;
    terminalBody.appendChild(promptLine);

    if (trimmed === 'clear') {
      terminalBody.innerHTML = '';
    } else if (cliCommands[trimmed]) {
      const outputLine = document.createElement('div');
      outputLine.className = 'term-line term-output';
      outputLine.innerHTML = cliCommands[trimmed];
      terminalBody.appendChild(outputLine);
    } else {
      const errLine = document.createElement('div');
      errLine.className = 'term-line term-output';
      errLine.style.color = '#ef4444';
      errLine.innerHTML = `zsh: command not found: ${escapeHTML(cmd)}. Type <strong style="color: var(--accent-cyan)">help</strong> for available commands.`;
      terminalBody.appendChild(errLine);
    }

    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = terminalInput.value;
        executeCommand(val);
        terminalInput.value = '';
      }
    });
  }

  chipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });

  // Utility to escape HTML
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  // --- 7. Contact Form Handler & Toast ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value;
      
      showToast(`Thank you, ${name}! Your message has been sent successfully. I'll get back to you soon.`, 'success');
      contactForm.reset();
    });
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="fa-solid fa-circle-check" style="color: var(--accent-emerald); font-size: 1.2rem;"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

});
