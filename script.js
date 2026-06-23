/* ==========================================================================
   THEME MANAGER & UTILITIES
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initScrollReveal();
  initHeroCanvas();
  initNEPARSimulator();
});

function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme') || 'dark';
  
  // Set initial theme
  document.documentElement.setAttribute('data-theme', storedTheme);
  updateThemeIcon(storedTheme);
  
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('theme-icon');
  if (theme === 'dark') {
    // Sun Icon
    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />';
  } else {
    // Moon Icon
    icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
  }
}

function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
  
  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('active');
    }
  });
}

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const navbar = document.querySelector('.navbar');
  
  const revealOnScroll = () => {
    // Navbar scroll background change
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Scroll progress bar
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      scrollProgress.style.width = `${progress}%`;
    }
    
    // Smooth reveal animations
    reveals.forEach(reveal => {
      const windowHeight = window.innerHeight;
      const revealTop = reveal.getBoundingClientRect().top;
      const revealPoint = 150;
      
      if (revealTop < windowHeight - revealPoint) {
        reveal.classList.add('active');
      }
    });
    
    // Active Navigation Highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };
  
  window.addEventListener('scroll', revealOnScroll);
  // Trigger once on load
  revealOnScroll();
}

/* ==========================================================================
   HERO INTERACTIVE CANVAS
   ========================================================================== */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let animationFrameId;
  
  let width = (canvas.width = canvas.offsetWidth);
  let height = (canvas.height = canvas.offsetHeight);
  
  // Read color dynamically from computed styles to match CSS theme
  function getPrimaryRGB() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent-primary-rgb').trim() || '189, 32, 38';
  }

  const particles = [];
  const properties = {
    particleRadius: 2.5,
    particleCount: 55,
    particleMaxVelocity: 0.4,
    lineLength: 140,
  };
  
  // Track window resizing
  window.addEventListener('resize', () => {
    width = (canvas.width = canvas.offsetWidth);
    height = (canvas.height = canvas.offsetHeight);
  });
  
  // Particle constructor
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.velocityX = (Math.random() * 2 - 1) * properties.particleMaxVelocity;
      this.velocityY = (Math.random() * 2 - 1) * properties.particleMaxVelocity;
    }
    
    position() {
      this.x + this.velocityX > width && this.velocityX > 0 || this.x + this.velocityX < 0 && this.velocityX < 0 ? this.velocityX = -this.velocityX : this.velocityX;
      this.y + this.velocityY > height && this.velocityY > 0 || this.y + this.velocityY < 0 && this.velocityY < 0 ? this.velocityY = -this.velocityY : this.velocityY;
      this.x += this.velocityX;
      this.y += this.velocityY;
    }
    
    reDraw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI * 2);
      ctx.closePath();
      const currentRGB = getPrimaryRGB();
      ctx.fillStyle = `rgba(${currentRGB}, 0.22)`;
      ctx.fill();
    }
  }
  
  // Draw lines between close particles
  function drawLines() {
    let x1, y1, x2, y2, length, opacity;
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const baseColor = getPrimaryRGB();
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        x1 = particles[i].x;
        y1 = particles[i].y;
        x2 = particles[j].x;
        y2 = particles[j].y;
        length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        
        if (length < properties.lineLength) {
          opacity = 1 - length / properties.lineLength;
          ctx.lineWidth = 0.8;
          ctx.strokeStyle = `rgba(${baseColor}, ${opacity * (currentTheme === 'light' ? 0.08 : 0.14)})`;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.closePath();
          ctx.stroke();
        }
      }
    }
  }
  
  // Loop execution
  function loop() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].position();
      particles[i].reDraw();
    }
    drawLines();
    animationFrameId = requestAnimationFrame(loop);
  }
  
  // Initialize particles
  for (let i = 0; i < properties.particleCount; i++) {
    particles.push(new Particle());
  }
  
  loop();
}

/* ==========================================================================
   INTERACTIVE NEPAR SIMULATOR
   ========================================================================== */
function initNEPARSimulator() {
  const canvas = document.getElementById('nepar-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Resize Canvas to fit container
  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Control Elements
  const propagationSlider = document.getElementById('sim-prop-rate');
  const mitigationSlider = document.getElementById('sim-mitig-rate');
  const densitySlider = document.getElementById('sim-density');
  
  const labelProp = document.getElementById('lbl-prop-rate');
  const labelMitig = document.getElementById('lbl-mitig-rate');
  const labelDensity = document.getElementById('lbl-density');
  
  const btnMitigate = document.getElementById('btn-sim-mitigate');
  const btnRandomRisk = document.getElementById('btn-sim-random');
  const btnReset = document.getElementById('btn-sim-reset');
  
  const valAvgRisk = document.getElementById('val-avg-risk');
  const valCascades = document.getElementById('val-cascades');
  const valMitigation = document.getElementById('val-mitig-rate');
  
  // Sim variables
  let propagationRate = parseFloat(propagationSlider.value);
  let mitigationStrength = parseFloat(mitigationSlider.value);
  let networkDensity = parseFloat(densitySlider.value);
  
  let cascadeCount = 0;
  let ripples = [];
  
  // Update sliders labels
  propagationSlider.addEventListener('input', (e) => {
    propagationRate = parseFloat(e.target.value);
    labelProp.textContent = propagationRate.toFixed(2);
  });
  
  mitigationSlider.addEventListener('input', (e) => {
    mitigationStrength = parseFloat(e.target.value);
    labelMitig.textContent = mitigationStrength.toFixed(2);
    valMitigation.textContent = Math.round(mitigationStrength * 100) + '%';
  });
  
  densitySlider.addEventListener('input', (e) => {
    networkDensity = parseFloat(e.target.value);
    labelDensity.textContent = networkDensity.toFixed(2);
    rebuildConnections();
  });
  
  // Psycho-social states representation nodes
  const nodeNames = [
    "Stress Level", "Workload", "Sleep Quality", "Anxiety",
    "Cognitive Load", "Isolation", "Physical Health", "Social Pressure"
  ];
  
  class SimulatorNode {
    constructor(id, name, x, y) {
      this.id = id;
      this.name = name;
      this.x = x;
      this.y = y;
      this.baseRadius = 14;
      this.radius = 14;
      this.risk = 0.0; // 0.0 (healthy) to 1.0 (critical risk)
      this.targetRisk = 0.0;
      this.pulsePhase = Math.random() * Math.PI;
      this.vx = (Math.random() * 0.4 - 0.2);
      this.vy = (Math.random() * 0.4 - 0.2);
    }
    
    update() {
      // Float slightly
      this.x += this.vx;
      this.y += this.vy;
      
      // Screen constraint bounds
      const margin = 50;
      if (this.x < margin || this.x > canvas.width - margin) this.vx *= -1;
      if (this.y < margin || this.y > canvas.height - margin) this.vy *= -1;
      
      // Update risk smoothly towards target
      if (this.risk < this.targetRisk) {
        this.risk += 0.015;
        if (this.risk > this.targetRisk) this.risk = this.targetRisk;
      } else if (this.risk > this.targetRisk) {
        this.risk -= 0.008 * (1 + mitigationStrength * 2);
        if (this.risk < 0.0) this.risk = 0.0;
      }
      
      this.pulsePhase += 0.04;
      this.radius = this.baseRadius + (this.risk * 5 * Math.sin(this.pulsePhase));
    }
    
    draw() {
      // Draw outer glowing indicator rings for active risks
      if (this.risk > 0.15) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * (1.2 + this.risk * 0.8), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(239, 68, 68, ${0.1 * this.risk})`;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * (1.8 + this.risk * 1.2), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(239, 68, 68, ${0.05 * this.risk * Math.abs(Math.sin(this.pulsePhase))})`;
        ctx.stroke();
      }
      
      // Draw node base circle
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      
      // Gradient fill based on health/risk state
      const grad = ctx.createRadialGradient(this.x, this.y, 2, this.x, this.y, this.radius);
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      
      if (this.risk < 0.05) {
        grad.addColorStop(0, isDark ? 'hsl(142, 70%, 65%)' : 'hsl(142, 60%, 45%)');
        grad.addColorStop(1, isDark ? 'hsl(142, 70%, 35%)' : 'hsl(142, 60%, 25%)');
      } else {
        // Linear interpolation color from healthy green (21, 128, 61) to risk red (239, 68, 68)
        grad.addColorStop(0, `rgba(239, 68, 68, ${this.risk * 0.85 + 0.15})`);
        const r = Math.round(this.risk * 239 + (1 - this.risk) * 21);
        const g = Math.round(this.risk * 68 + (1 - this.risk) * 128);
        const b = Math.round(this.risk * 68 + (1 - this.risk) * 61);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 1)`);
      }
      
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)';
      ctx.stroke();
      
      // Node Text Label
      ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 42, 0.85)';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(this.name, this.x, this.y - this.radius - 8);
      
      // Risk ratio text
      if (this.risk > 0.05) {
        ctx.fillStyle = '#fff';
        ctx.font = '9px monospace';
        ctx.fillText(Math.round(this.risk * 100) + '%', this.x, this.y + 3);
      }
    }
  }
  
  let nodes = [];
  let connections = [];
  
  function initNodes() {
    nodes = [];
    const w = canvas.width;
    const h = canvas.height;
    
    // Even circular spacing layout
    const count = nodeNames.length;
    const centerX = w / 2;
    const centerY = h / 2;
    const radius = Math.min(w, h) * 0.3;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      nodes.push(new SimulatorNode(i, nodeNames[i], x, y));
    }
    rebuildConnections();
  }
  
  function rebuildConnections() {
    connections = [];
    const length = nodes.length;
    for (let i = 0; i < length; i++) {
      for (let j = i + 1; j < length; j++) {
        const dist = Math.sqrt(Math.pow(nodes[j].x - nodes[i].x, 2) + Math.pow(nodes[j].y - nodes[i].y, 2));
        
        // Define correlations/edges based on density threshold
        const threshold = 180 + networkDensity * 120;
        if (dist < threshold) {
          // Connection strength represents inverse distance
          const weight = 0.2 + (1 - dist / threshold) * 0.8;
          connections.push({ from: nodes[i], to: nodes[j], weight: weight });
        }
      }
    }
  }
  
  // Core NEPAR Risk Cascade Algorithm
  function propagateRisk() {
    for (let conn of connections) {
      const nodeA = conn.from;
      const nodeB = conn.to;
      
      // Calculate delta risk flow based on active node state and connection weights
      if (nodeA.risk > 0.15 && nodeB.risk < nodeA.risk) {
        const flow = (nodeA.risk - nodeB.risk) * propagationRate * conn.weight * 0.005;
        if (flow > 0.002) {
          nodeB.targetRisk = Math.min(1.0, nodeB.targetRisk + flow);
          if (nodeB.risk < 0.1 && nodeB.targetRisk > 0.2) {
            cascadeCount++;
            valCascades.textContent = cascadeCount;
          }
        }
      }
      
      if (nodeB.risk > 0.15 && nodeA.risk < nodeB.risk) {
        const flow = (nodeB.risk - nodeA.risk) * propagationRate * conn.weight * 0.005;
        if (flow > 0.002) {
          nodeA.targetRisk = Math.min(1.0, nodeA.targetRisk + flow);
          if (nodeA.risk < 0.1 && nodeA.targetRisk > 0.2) {
            cascadeCount++;
            valCascades.textContent = cascadeCount;
          }
        }
      }
    }
  }
  
  // Interactive Click Handlers
  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Add ripple
    ripples.push({
      x: clickX,
      y: clickY,
      radius: 10,
      maxRadius: 80,
      opacity: 1.0
    });
    
    // Check if clicked a node
    for (let node of nodes) {
      const dist = Math.sqrt(Math.pow(node.x - clickX, 2) + Math.pow(node.y - clickY, 2));
      if (dist < node.radius + 15) {
        node.targetRisk = 1.0;
        node.risk = 1.0;
        cascadeCount++;
        valCascades.textContent = cascadeCount;
        break;
      }
    }
  });
  
  // Button Listeners
  btnMitigate.addEventListener('click', () => {
    // Force active state reduction
    nodes.forEach(node => {
      node.targetRisk = Math.max(0.0, node.targetRisk - 0.45);
    });
  });
  
  btnRandomRisk.addEventListener('click', () => {
    // Inject random risk source
    const randomIndex = Math.floor(Math.random() * nodes.length);
    nodes[randomIndex].targetRisk = 1.0;
    nodes[randomIndex].risk = 1.0;
    cascadeCount++;
    valCascades.textContent = cascadeCount;
  });
  
  btnReset.addEventListener('click', () => {
    nodes.forEach(node => {
      node.risk = 0.0;
      node.targetRisk = 0.0;
    });
    cascadeCount = 0;
    valCascades.textContent = '0';
    ripples = [];
  });
  
  // Main simulator loops
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update variables
    propagateRisk();
    
    let totalRisk = 0;
    
    // Draw Connections/Edges
    connections.forEach(conn => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.beginPath();
      ctx.moveTo(conn.from.x, conn.from.y);
      ctx.lineTo(conn.to.x, conn.to.y);
      
      const avgNodeRisk = (conn.from.risk + conn.to.risk) / 2;
      
      if (avgNodeRisk > 0.15) {
        // Red glowing link for propagating risk
        ctx.strokeStyle = `rgba(239, 68, 68, ${0.1 + avgNodeRisk * 0.45})`;
        ctx.lineWidth = 1 + conn.weight * 2 + avgNodeRisk * 2;
      } else {
        // Normal grey/blue link
        ctx.strokeStyle = isDark ? `rgba(255, 255, 255, ${conn.weight * 0.08})` : `rgba(0, 0, 0, ${conn.weight * 0.08})`;
        ctx.lineWidth = 1 + conn.weight * 1;
      }
      ctx.stroke();
      
      // Draw flowing particle pulse along connections when risk flows
      if (avgNodeRisk > 0.15 && Math.abs(conn.from.risk - conn.to.risk) > 0.08) {
        const source = conn.from.risk > conn.to.risk ? conn.from : conn.to;
        const target = conn.from.risk > conn.to.risk ? conn.to : conn.from;
        
        const speedFactor = 0.55 * propagationRate;
        const t = ((Date.now() / 1000 * speedFactor) + conn.weight) % 1.0;
        const px = source.x + (target.x - source.x) * t;
        const py = source.y + (target.y - source.y) * t;
        
        ctx.beginPath();
        ctx.arc(px, py, 3.5 + conn.weight * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(239, 68, 68, ${0.55 + avgNodeRisk * 0.45})`;
        ctx.fill();
      }
    });
    
    // Update and Draw Shockwave Ripples
    ripples = ripples.filter(ripple => {
      ripple.radius += 2.5;
      ripple.opacity = 1 - (ripple.radius / ripple.maxRadius);
      
      if (ripple.opacity > 0) {
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(239, 68, 68, ${ripple.opacity * 0.6})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        return true;
      }
      return false;
    });
    
    // Update & Draw Nodes
    nodes.forEach(node => {
      node.update();
      node.draw();
      totalRisk += node.risk;
    });
    
    // Update Stats Display
    const averageRisk = totalRisk / nodes.length;
    valAvgRisk.textContent = Math.round(averageRisk * 100) + '%';
    
    // Display status styling based on risk level
    if (averageRisk > 0.45) {
      valAvgRisk.className = "sim-stat-val risk";
    } else {
      valAvgRisk.className = "sim-stat-val";
    }
    
    requestAnimationFrame(loop);
  }
  
  initNodes();
  loop();
}

/* ==========================================================================
   COPY CONTACT TO CLIPBOARD
   ========================================================================== */
window.copyEmail = function() {
  const emailText = 'salihtutun@wustl.edu';
  navigator.clipboard.writeText(emailText).then(() => {
    const copyBtn = document.querySelector('.btn-copy');
    const originalText = copyBtn.innerHTML;
    
    copyBtn.innerHTML = `
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      Copied!
    `;
    
    setTimeout(() => {
      copyBtn.innerHTML = originalText;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}

/* ==========================================================================
   INTERACTIVE CITATION CONTROLS
   ========================================================================== */
window.toggleCitation = function(drawerId) {
  const drawer = document.getElementById(drawerId);
  if (!drawer) return;
  drawer.classList.toggle('active');
}

window.copyCitation = function(textId, buttonEl) {
  const preEl = document.getElementById(textId);
  if (!preEl) return;
  
  navigator.clipboard.writeText(preEl.textContent).then(() => {
    const originalText = buttonEl.innerHTML;
    buttonEl.innerHTML = 'Copied!';
    buttonEl.style.background = 'var(--accent-success)';
    buttonEl.style.borderColor = 'transparent';
    buttonEl.style.color = '#fff';
    
    setTimeout(() => {
      buttonEl.innerHTML = originalText;
      buttonEl.style.background = '';
      buttonEl.style.borderColor = '';
      buttonEl.style.color = '';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy citation: ', err);
  });
}
