/* ==========================================================================
   TRUTH & EVIDENCE - JAVASCRIPT
   Core website functionality & category-based explorer (SECURE DOSSIER)
   ========================================================================= */

// === CUSTOM FILENAMES CONFIGURATION ===
// (Optional fallback) If directory listing is disabled on your production server,
// you can list your custom file names here to ensure they load.
const customFilesConfig = {
  'chat': [],
  'audio': [],
  'payment': []
};

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

  // === 4. CATEGORY DATABASE AND DYNAMIC INDEX SCANNER ===
  const proofDatabase = {
    'chat': { title: 'Chat Proof Folder', files: [] },
    'audio': { title: 'Audio Proof Folder', files: [] },
    'payment': { title: 'Payment Proof Folder', files: [] }
  };

  // Fallbacks to show naming instructions if folders are empty
  const defaultFallbacks = {
    'chat': [
      { name: 'chat_screenshot.png (Missing)', gitLink: './chats/chat_screenshot.png', isPlaceholder: true }
    ],
    'audio': [
      { name: 'audio_record.mp3 (Missing)', gitLink: './audio/audio_record.mp3', isPlaceholder: true }
    ],
    'payment': [
      { name: 'payment_screenshot.png (Missing)', gitLink: './receipts/payment_screenshot.png', isPlaceholder: true }
    ]
  };

  // Detect and load committed repository files dynamically
  const detectAndLoadFiles = async () => {
    const categories = {
      'chat': {
        folder: './chats/',
        prefix: './chats/chat_screenshot',
        extensions: ['png', 'jpg', 'jpeg'],
        files: []
      },
      'audio': {
        folder: './audio/',
        prefix: './audio/audio_record',
        extensions: ['mp3', 'wav'],
        files: []
      },
      'payment': {
        folder: './receipts/',
        prefix: './receipts/payment_screenshot',
        extensions: ['png', 'jpg', 'jpeg', 'pdf'],
        files: []
      }
    };

    const checkFileExists = async (url) => {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
      } catch (e) {
        return false;
      }
    };

    // Scrapes the web server folder directory listing if indexing is enabled
    const scrapeDirectoryIndex = async (folderUrl, extensions) => {
      try {
        const res = await fetch(folderUrl);
        if (!res.ok) return [];
        
        const contentType = res.headers.get('content-type') || '';
        if (!contentType.includes('text/html')) return []; // Server did not return HTML list

        const html = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'));
        
        const filesFound = [];
        links.forEach(link => {
          const href = link.getAttribute('href');
          if (!href) return;
          
          const filename = decodeURIComponent(href);
          const ext = filename.split('.').pop().toLowerCase();
          
          if (extensions.includes(ext) && !filename.includes('/') && filename !== '..' && filename !== '.') {
            filesFound.push({
              name: filename,
              gitLink: `${folderUrl}${href}`
            });
          }
        });
        return filesFound;
      } catch (e) {
        return [];
      }
    };

    for (const key of Object.keys(categories)) {
      const cat = categories[key];
      
      // Step A: Attempt folder HTML index scraping (ideal for http-server, local dev)
      let foundFiles = await scrapeDirectoryIndex(cat.folder, cat.extensions);
      
      // Step B: Fallback to loop scanner if scraping fails or returns nothing
      if (foundFiles.length === 0) {
        // 1. Check custom configurations
        const customList = customFilesConfig[key] || [];
        for (const customName of customList) {
          const url = `${cat.folder}${customName}`;
          const exists = await checkFileExists(url);
          if (exists) {
            foundFiles.push({ name: customName, gitLink: url });
          }
        }

        // 2. Check direct baseline file (e.g. chat_screenshot.png)
        for (const ext of cat.extensions) {
          const url = `${cat.prefix}.${ext}`;
          const exists = await checkFileExists(url);
          if (exists) {
            const filename = url.substring(url.lastIndexOf('/') + 1);
            if (!foundFiles.some(f => f.gitLink === url)) {
              foundFiles.push({ name: filename, gitLink: url });
            }
            break;
          }
        }

        // 3. Scan numbered files sequentially (up to 30 files per folder)
        let consecutiveMissing = 0;
        for (let i = 1; i <= 30; i++) {
          let foundForIndex = false;
          for (const ext of cat.extensions) {
            const url = `${cat.prefix}_${i}.${ext}`;
            const exists = await checkFileExists(url);
            if (exists) {
              const filename = url.substring(url.lastIndexOf('/') + 1);
              if (!foundFiles.some(f => f.gitLink === url)) {
                foundFiles.push({ name: filename, gitLink: url });
              }
              foundForIndex = true;
              consecutiveMissing = 0;
              break;
            }
          }
          if (!foundForIndex) {
            consecutiveMissing++;
            if (consecutiveMissing >= 3) {
              break;
            }
          }
        }
      }

      cat.files = foundFiles;
    }

    // Apply scanned files to database
    Object.keys(categories).forEach(key => {
      if (categories[key].files.length > 0) {
        proofDatabase[key].files = categories[key].files;
      } else {
        proofDatabase[key].files = defaultFallbacks[key];
      }
    });

    // Update the Category Grid Card badge subtexts
    Object.keys(proofDatabase).forEach(key => {
      const card = document.querySelector(`.archive-card[data-category="${key}"]`);
      if (card) {
        const fileCountSpan = card.querySelector('.archive-meta span:last-child');
        if (fileCountSpan) {
          const files = proofDatabase[key].files;
          const isPlaceholder = files.length > 0 && files[0].isPlaceholder;
          if (isPlaceholder) {
            fileCountSpan.textContent = 'Folder Empty';
            fileCountSpan.style.color = 'var(--text-muted)';
          } else {
            fileCountSpan.textContent = `${files.length} File${files.length > 1 ? 's' : ''}`;
            fileCountSpan.style.color = 'var(--accent)';
          }
        }
      }
    });
  };

  // Run dynamic autodetect scan on start
  detectAndLoadFiles();

  // === 5. EXPLORER & VIEWER WINDOWS ===
  const modal = document.querySelector('#docModal');
  const modalCloseBtn = document.querySelector('#modalCloseBtn');
  const modalDownloadBtn = document.querySelector('#modalDownloadBtn');
  const modalBody = document.querySelector('#modalBody');
  const modalTitle = document.querySelector('#modalTitle');

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
      if (file.isPlaceholder) {
        controlHTML = `
          <span style="font-size: 0.8rem; color: var(--text-muted); font-style: italic;">Awaiting File</span>
        `;
      } else if (categoryKey === 'audio') {
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
          <h4 style="margin: 0; font-size: 0.95rem; font-weight: 500; color: var(--text-primary); font-family: var(--font-body);">${file.name}</h4>
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
            The proof screenshot file at <code>${imgSrc}</code> is currently not found. Please upload your screenshot file inside your repository folders to load it here.
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

  // === 6. STRICT SECURITY ENFORCEMENT ===
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
});
