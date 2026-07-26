/* ==========================================================================
   TRUTH & EVIDENCE - JAVASCRIPT
   Core website functionality & interactive handlers (CONDENSED & STREAMLINED)
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

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('color-scheme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

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

  // === 4. STREAMLINED EVIDENCE DATABASE & MODAL VIEW ===
  const docDatabase = {
    'bank-transfer-1': {
      title: 'Initial Security Deposit Receipt',
      category: 'Bank Transactions',
      date: 'Aug 14, 2024',
      size: '1.2 MB',
      type: 'PDF Preview',
      desc: 'IMPS bank transfer confirmation representing the initial security deposit for college credit transfer.',
      mockupType: 'bank',
      bankName: 'METROPOLIS MUTUAL BANK',
      refNo: 'TXN8892019927A',
      from: 'Student Family Account (Acct ending in *4910)',
      to: 'Intermediary Account (Acct ending in *8372)',
      amount: '$1,200.00',
      status: 'SUCCESSFUL / SETTLED',
      notes: 'This transfer represents the initial advance requested to secure credit transfer allocations. No official university receipt was ever provided in return.'
    },
    'whatsapp-chat-2': {
      title: 'Instruction to Discontinue Studies',
      category: 'WhatsApp Chats',
      date: 'Sep 05, 2024',
      size: '380 KB',
      type: 'Chat Transcript',
      desc: 'Critical WhatsApp messages advising students to discontinue attending classes at their previous college immediately.',
      mockupType: 'whatsapp',
      messages: [
        { sender: 'Intermediary', time: '04:12 PM', text: 'The admission files are finalized. The students must discontinue attending classes at their current college immediately. If they continue registered there, the database will block their fresh registration.', type: 'received' },
        { sender: 'Student', time: '04:18 PM', text: 'Are you sure we should stop going? We haven\'t received the formal admission slips yet.', type: 'sent' },
        { sender: 'Intermediary', time: '04:22 PM', text: 'Yes, absolutely sure. The enrollment window starts next week. If you don\'t withdraw now, it will delay the credit transcript transfer.', type: 'received' },
        { sender: 'Student', time: '04:30 PM', text: 'Okay, we will submit the withdrawal letters tomorrow.', type: 'sent' }
      ],
      notes: 'This instruction directly led to the students terminating their enrollment at their active college, resulting in academic loss.'
    },
    'university-response-1': {
      title: 'Registrar Inquiry Response',
      category: 'University Responses',
      date: 'Nov 12, 2024',
      size: '640 KB',
      type: 'Official Letter',
      desc: 'Official response from the University Admissions Registrar confirming that no application or tuition fee was ever received.',
      mockupType: 'letter',
      logoText: 'STATE UNIVERSITY OF SCIENCE',
      refNo: 'REG/2024/7781-INF',
      dateStr: 'November 12, 2024',
      to: 'Student Guardian Representatives\nMetropolis Area Council',
      subject: 'RE: ENROLLMENT STATUS INQUIRY',
      body: 'Dear Guardians, we write in response to your query regarding the enrollment status of the students. Following a search of our database, our records indicate that no applications for admission, requests for credit transfer, or associated fee payments have been submitted under the names of the aforementioned individuals. The university does not utilize third-party intermediaries for student enrollment management.',
      signText: 'Office of the Registrar\nState University of Science Admissions Board',
      notes: 'Official proof verifying that the admission process was never initiated by the intermediary.'
    }
  };

  const modal = document.querySelector('#docModal');
  const modalCloseBtn = document.querySelector('#modalCloseBtn');
  const modalDownloadBtn = document.querySelector('#modalDownloadBtn');
  const modalBody = document.querySelector('#modalBody');
  const modalTitle = document.querySelector('#modalTitle');

  const openDocumentModal = (docId) => {
    if (!modal || !modalBody || !modalTitle) return;
    const doc = docDatabase[docId];
    if (!doc) return;

    modalTitle.textContent = doc.title;
    modalBody.innerHTML = '';
    
    const docViewerDiv = document.createElement('div');
    docViewerDiv.className = 'doc-viewer';
    
    let mockupHTML = '';
    
    if (doc.mockupType === 'bank') {
      mockupHTML = `
        <div class="doc-mockup doc-bank-transaction">
          <div class="bank-header">
            <div>
              <div class="bank-name">${doc.bankName}</div>
              <div style="font-size:0.75rem; color:#868e96;">ELECTRONIC TRANSACTION VOUCHER</div>
            </div>
            <div class="bank-title">TRANSFER CONFIRMATION</div>
          </div>
          <div class="bank-details-grid">
            <div class="bank-detail-item">
              <div class="bank-detail-label">Transaction Reference</div>
              <div class="bank-detail-val">${doc.refNo}</div>
            </div>
            <div class="bank-detail-item">
              <div class="bank-detail-label">Value Date</div>
              <div class="bank-detail-val">${doc.date}</div>
            </div>
            <div class="bank-detail-item">
              <div class="bank-detail-label">Debited From</div>
              <div class="bank-detail-val">${doc.from}</div>
            </div>
            <div class="bank-detail-item">
              <div class="bank-detail-label">Beneficiary Account</div>
              <div class="bank-detail-val">${doc.to}</div>
            </div>
            <div class="bank-detail-item">
              <div class="bank-detail-label">Transaction Status</div>
              <div class="bank-detail-val" style="color:#2b8a3e; font-weight:700;">${doc.status}</div>
            </div>
          </div>
          <div class="bank-amount-box">
            <div class="bank-amount-label">AMOUNT TRANSFERRED</div>
            <div class="bank-amount-val">${doc.amount}</div>
          </div>
        </div>
      `;
    } else if (doc.mockupType === 'whatsapp') {
      const chatMessages = doc.messages.map(m => `
        <div class="chat-bubble ${m.type}">
          <div class="chat-bubble-sender">${m.sender}</div>
          <div>${m.text}</div>
          <span class="chat-bubble-time">${m.time}</span>
        </div>
      `).join('');
      
      mockupHTML = `
        <div class="doc-mockup" style="background-color: #f0f2f5; padding: 1.5rem;">
          <div style="background-color:#008069; color:#ffffff; padding:0.75rem 1rem; border-radius: var(--border-radius-sm); margin-bottom:1rem; font-family:var(--font-display); font-weight:600; display:flex; align-items:center; gap:0.5rem;">
            WhatsApp Transcript
          </div>
          <div class="doc-whatsapp-chat">
            ${chatMessages}
          </div>
        </div>
      `;
    } else if (doc.mockupType === 'letter') {
      mockupHTML = `
        <div class="doc-mockup doc-official-letter">
          <div class="letter-header">
            <div class="letter-logo-text">${doc.logoText}</div>
            <div class="letter-meta">
              <div>Ref: ${doc.refNo}</div>
              <div>Date: ${doc.dateStr}</div>
            </div>
          </div>
          <div class="letter-to">
            <strong>TO:</strong><br>
            ${doc.to.replace('\n', '<br>')}
          </div>
          <div class="letter-subject">
            <strong>SUBJECT:</strong> ${doc.subject}
          </div>
          <div class="letter-body">
            ${doc.body}
          </div>
          <div class="letter-sign">
            <strong>Sincerely,</strong><br>
            <span style="font-family: 'Outfit'; font-size:0.85rem; font-style:italic;">${doc.signText.split('\n')[0]}</span><br>
            <span style="font-size:0.75rem; color:#6c757d;">${doc.signText.split('\n')[1]}</span>
          </div>
          <div class="letter-stamp">
            OFFICIAL<br>REGISTRAR RECORD
          </div>
        </div>
      `;
    }

    docViewerDiv.innerHTML = `
      ${mockupHTML}
      <div class="doc-notes">
        <h5>Verified Incident Context</h5>
        <p>${doc.notes}</p>
      </div>
    `;
    
    modalBody.appendChild(docViewerDiv);
    
    if (modalDownloadBtn) {
      modalDownloadBtn.onclick = () => {
        alert(`Downloading ${doc.title} (${doc.size}) as a secure PDF.`);
      };
    }
    
    modal.showModal();
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

  window.triggerEvidenceModal = (docId) => {
    openDocumentModal(docId);
  };

  // === 5. UNIFIED ARCHIVE FILTERING AND SEARCHING ===
  const archiveSearch = document.querySelector('#archiveSearch');
  const filterButtons = document.querySelectorAll('.archive-filters .filter-btn');
  const archiveCards = document.querySelectorAll('.archive-grid .archive-card');

  let activeCategory = 'all';
  let searchQuery = '';

  const filterAndSearchArchive = () => {
    archiveCards.forEach(card => {
      const title = card.querySelector('.archive-title').textContent.toLowerCase();
      const desc = card.querySelector('.archive-desc').textContent.toLowerCase();
      const meta = card.querySelector('.archive-meta').textContent.toLowerCase();
      const cardCat = card.getAttribute('data-category');

      const matchesSearch = title.includes(searchQuery) || desc.includes(searchQuery) || meta.includes(searchQuery);
      const matchesCategory = activeCategory === 'all' || cardCat === activeCategory;

      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  if (archiveSearch) {
    archiveSearch.addEventListener('input', () => {
      searchQuery = archiveSearch.value.toLowerCase().trim();
      filterAndSearchArchive();
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeCategory = e.target.getAttribute('data-filter');
      filterAndSearchArchive();
    });
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
