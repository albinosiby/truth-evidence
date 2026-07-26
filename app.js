/* ==========================================================================
   TRUTH & EVIDENCE - JAVASCRIPT
   Core website functionality & category-based explorer (SECURE DOSSIER)
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // === 1. THEME MANAGEMENT (DARK MODE) ===
  const themeToggleBtn = document.querySelector('#themeToggle');
  
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('color-scheme', theme);
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const initTheme = () => {
    const savedTheme = localStorage.getItem('color-scheme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }
  };

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  
  initTheme();

  // === 2. MOBILE NAVIGATION DRAWER ===
  const menuBtn = document.querySelector('#menuBtn');
  const mobileNav = document.querySelector('#mobileNav');
  const mobileBackdrop = document.querySelector('#mobileBackdrop');
  const closeMobileNavBtn = document.querySelector('#closeMobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileNav = () => {
    mobileNav.classList.add('open');
    mobileBackdrop.classList.add('open');
  };

  const closeMobileNav = () => {
    mobileNav.classList.remove('open');
    mobileBackdrop.classList.remove('open');
  };

  if (menuBtn) menuBtn.addEventListener('click', openMobileNav);
  if (closeMobileNavBtn) closeMobileNavBtn.addEventListener('click', closeMobileNav);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileNav);
  mobileLinks.forEach(link => link.addEventListener('click', closeMobileNav));

  // === 3. TIMELINE SCROLL REVEAL ANIMATIONS ===
  const timelineObserverOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const timelineRevealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  };

  const timelineObserver = new IntersectionObserver(timelineRevealCallback, timelineObserverOptions);
  
  const timelineCards = document.querySelectorAll('.timeline-card');
  timelineCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
    timelineObserver.observe(card);
  });

  // === 4. CATEGORY DATABASE ===
  const proofDatabase = {
    'chat': {
      title: 'Chat Proof Archive',
      files: [
        {
          name: 'WhatsApp Conversation Screenshot #1',
          date: 'Aug 10, 2024',
          size: '410 KB',
          gitLink: './chats/chat_screenshot.png'
        },
        {
          name: 'WhatsApp Conversation Screenshot #2',
          date: 'Sep 05, 2024',
          size: '380 KB',
          gitLink: './chats/chat_screenshot_2.png'
        },
        {
          name: 'WhatsApp Conversation Screenshot #3',
          date: 'Sep 12, 2024',
          size: '450 KB',
          gitLink: './chats/chat_screenshot_3.png'
        }
      ]
    },
    'audio': {
      title: 'Audio Proof Archive',
      files: [
        {
          name: 'Audio Call Recording #1',
          date: 'Oct 20, 2024',
          size: '1.8 MB',
          gitLink: './audio/audio_record.mp3'
        },
        {
          name: 'Audio Call Recording #2',
          date: 'Oct 28, 2024',
          size: '1.5 MB',
          gitLink: './audio/audio_record_2.mp3'
        },
        {
          name: 'Audio Call Recording #3',
          date: 'Nov 02, 2024',
          size: '2.1 MB',
          gitLink: './audio/audio_record_3.mp3'
        }
      ]
    },
    'payment': {
      title: 'Payment Proof Archive',
      files: [
        {
          name: 'Payment Transaction Screenshot #1',
          date: 'Aug 14, 2024',
          size: '1.2 MB',
          gitLink: './receipts/payment_screenshot.png'
        },
        {
          name: 'Payment Transaction Screenshot #2',
          date: 'Sep 02, 2024',
          size: '890 KB',
          gitLink: './receipts/payment_screenshot_2.png'
        },
        {
          name: 'Payment Transaction Screenshot #3',
          date: 'Sep 18, 2024',
          size: '1.1 MB',
          gitLink: './receipts/payment_screenshot_3.png'
        }
      ]
    }
  };

  const modal = document.querySelector('#docModal');
  const modalCloseBtn = document.querySelector('#modalCloseBtn');
  const modalDownloadBtn = document.querySelector('#modalDownloadBtn');
  const modalBody = document.querySelector('#modalBody');
  const modalTitle = document.querySelector('#modalTitle');

  // Hide the original download button (no download buttons allowed in secure layout)
  if (modalDownloadBtn) {
    modalDownloadBtn.style.display = 'none';
  }

  // Render Category File Explorer List
  const renderCategoryExplorer = (categoryKey) => {
    if (!modalBody || !modalTitle) return;
    const cat = proofDatabase[categoryKey];
    if (!cat) return;

    modalTitle.textContent = cat.title;
    modalBody.innerHTML = '';

    const listContainer = document.createElement('div');
    listContainer.className = 'explorer-list';
    listContainer.style.display = 'flex';
    listContainer.style.flexDirection = 'column';
    listContainer.style.gap = '0.75rem';
    listContainer.style.padding = '0.5rem 0';

    cat.files.forEach(file => {
      const item = document.createElement('div');
      item.className = 'explorer-item';
      item.style.display = 'flex';
      item.style.justifyContent = 'space-between';
      item.style.alignItems = 'center';
      item.style.padding = '1rem';
      item.style.backgroundColor = 'var(--bg-secondary)';
      item.style.border = '1px solid var(--border-color)';
      item.style.borderRadius = 'var(--border-radius-sm)';
      item.style.gap = '1rem';

      let controlHTML = '';
      if (categoryKey === 'audio') {
        controlHTML = `
          <audio controls controlsList="nodownload" style="height: 38px; max-width: 220px;">
            <source src="${file.gitLink}" type="audio/mp3">
            Audio playback not supported.
          </audio>
        `;
      } else {
        controlHTML = `
          <button class="btn btn-primary" onclick="openSecureLightbox('${file.gitLink}', '${categoryKey}')" style="padding: 0.4rem 1rem; font-size: 0.85rem; border: none; border-radius: var(--border-radius-sm);">Open</button>
        `;
      }

      item.innerHTML = `
        <div style="flex-grow: 1;">
          <h4 style="margin: 0 0 0.25rem; font-size: 0.95rem; font-weight: 600; color: var(--text-primary); font-family: var(--font-display);">${file.name}</h4>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${file.date} &bull; ${file.size}</div>
        </div>
        <div>
          ${controlHTML}
        </div>
      `;
      listContainer.appendChild(item);
    });

    modalBody.appendChild(listContainer);
  };

  // Open Secure Image Lightbox Viewer inside the modal
  window.openSecureLightbox = (imgSrc, categoryKey) => {
    if (!modalBody) return;
    
    modalBody.innerHTML = '';
    
    const lightboxDiv = document.createElement('div');
    lightboxDiv.className = 'lightbox-view';
    lightboxDiv.style.textAlign = 'center';

    lightboxDiv.innerHTML = `
      <div style="text-align: left; margin-bottom: 1rem;">
        <button class="btn btn-secondary" onclick="goBackToExplorer('${categoryKey}')" style="padding: 0.4rem 1rem; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.5rem; border: 1px solid var(--border-color); background-color: var(--bg-primary); border-radius: var(--border-radius-sm); cursor: pointer;">
          <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to list
        </button>
      </div>
      <div class="secure-image-container">
        <img src="${imgSrc}" alt="Secure Proof Preview" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
        <div style="display: none; padding: 2rem; background-color: var(--bg-tertiary); border: 1px dashed var(--accent); border-radius: var(--border-radius-sm); text-align: left; max-width: 480px; margin: auto;">
          <h5 style="color: var(--accent); margin: 0 0 0.5rem; font-family: var(--font-display); font-weight: 700; text-transform: uppercase;">Proof Document File Missing</h5>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0; line-height: 1.5;">
            The proof screenshot file at <code>${imgSrc}</code> is currently not found. Please upload/commit your screenshot file inside your repository folders to load it here.
          </p>
        </div>
        <div class="secure-image-overlay">
          <div class="secure-image-watermark-text">TRUTH & EVIDENCE - CONFIDENTIAL</div>
        </div>
      </div>
    `;

    modalBody.appendChild(lightboxDiv);
  };

  window.goBackToExplorer = (categoryKey) => {
    renderCategoryExplorer(categoryKey);
  };

  window.openCategoryModal = (categoryKey) => {
    renderCategoryExplorer(categoryKey);
    if (modal) modal.showModal();
  };

  if (modalCloseBtn && modal) {
    modalCloseBtn.addEventListener('click', () => modal.close());
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      const dialogDimensions = modal.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        modal.close();
      }
    });
  }

  // === 5. STRICT SECURITY ENFORCEMENT ===
  // Block right-clicks page-wide
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Block dragging actions page-wide
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
  });

  // Block print / save hotkeys page-wide
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P' || e.key === 's' || e.key === 'S')) {
      e.preventDefault();
      alert('Action disabled for security and confidentiality reasons.');
    }
  });

  // === 6. FAQ ACCORDION HANDLERS ===
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer');
    
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });
      
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      }
    });
  });

  // === 7. CONTACT / AUDIT SUBMISSION FORM ===
  const contactForm = document.querySelector('#contactForm');
  const formFeedback = document.querySelector('#formFeedback');

  if (contactForm && formFeedback) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.querySelector('#contactName').value;
      const email = document.querySelector('#contactEmail').value;
      const message = document.querySelector('#contactMessage').value;
      
      if (!name || !email || !message) {
        alert('Please fill out all required fields.');
        return;
      }
      
      formFeedback.textContent = 'Thank you. Your statement and details have been logged securely. Our legal audit representatives will verify any details provided.';
      formFeedback.classList.add('success');
      formFeedback.style.display = 'block';
      
      contactForm.reset();
      
      setTimeout(() => {
        formFeedback.style.opacity = '0';
        formFeedback.style.transition = 'opacity 1s ease';
        setTimeout(() => {
          formFeedback.style.display = 'none';
          formFeedback.style.opacity = '1';
        }, 1000);
      }, 7000);
    });
  }
});
