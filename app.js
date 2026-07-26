/* ==========================================================================
   TRUTH & EVIDENCE - JAVASCRIPT
   Core website functionality & interactive handlers
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // === 1. THEME MANAGEMENT (DARK MODE) ===
  const themeToggleBtn = document.querySelector('#themeToggle');
  
  // Set active theme state in DOM
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('color-scheme', theme);
  };

  // Toggle theme handler (two-state: system setting vs opposite setting)
  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Initialize Theme based on localStorage or preferences
  const initTheme = () => {
    const savedTheme = localStorage.getItem('color-scheme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }
  };

  // Listen for system theme preference changes
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
  // Intersection Observer to handle reveal-on-scroll for timeline cards
  const timelineObserverOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const timelineRevealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target); // Reveal once
      }
    });
  };

  const timelineObserver = new IntersectionObserver(timelineRevealCallback, timelineObserverOptions);
  
  const timelineCards = document.querySelectorAll('.timeline-card');
  timelineCards.forEach(card => {
    // Initial states set via JS so that print & non-JS fallback layouts are clean
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
    timelineObserver.observe(card);
  });

  // === 4. EVIDENCE DATABASE & MODAL VIEW PATHWAY ===
  const docDatabase = {
    'bank-transfer-1': {
      title: 'Initial Security Transfer Receipt',
      category: 'Bank Transactions',
      date: 'Aug 14, 2024',
      size: '1.2 MB',
      type: 'PDF / Image Preview',
      desc: 'IMPS transaction confirmation receipt representing the first tranche of college admission reservation deposits.',
      mockupType: 'bank',
      bankName: 'METROPOLIS MUTUAL BANK',
      refNo: 'TXN8892019927A',
      from: 'Student Family Account (Acct ending in *4910)',
      to: 'Intermediary Direct Account (Acct ending in *8372)',
      amount: '$4,200.00',
      status: 'SUCCESSFUL / SETTLED',
      notes: 'This transfer represents the initial advance requested to secure college credits transfer allocation slots. No official university receipt was ever provided in return.'
    },
    'bank-transfer-2': {
      title: 'Tuition Fee Advance Statement',
      category: 'Bank Transactions',
      date: 'Sep 02, 2024',
      size: '890 KB',
      type: 'PDF / Bank Statement',
      desc: 'Detailed bank statement showing the second payment transaction specifically marked for "Admission fee installment".',
      mockupType: 'bank',
      bankName: 'METROPOLIS MUTUAL BANK',
      refNo: 'TXN9027816281B',
      from: 'Student Family Account (Acct ending in *4910)',
      to: 'Intermediary Direct Account (Acct ending in *8372)',
      amount: '$3,500.00',
      status: 'SUCCESSFUL / SETTLED',
      notes: 'Transfer executed following the intermediary\'s urgent notice that university billing registration slots were closing. Intermediary verbally claimed this went directly to accounting, which was later falsified.'
    },
    'whatsapp-chat-1': {
      title: 'Admission Assurance Chat Logs',
      category: 'WhatsApp Chats',
      date: 'Aug 10, 2024',
      size: '410 KB',
      type: 'Chat Transcript',
      desc: 'Conversation transcript documenting assurances that the credit transfers are approved and registration is fully secured.',
      mockupType: 'whatsapp',
      messages: [
        { sender: 'Intermediary', time: '11:15 AM', text: 'Good morning. I spoke directly with the Registrar and the Dean this morning. The credit transfers for both students are 100% approved. I just need to process the deposit paperwork.', type: 'received' },
        { sender: 'Student Parent', time: '11:22 AM', text: 'Thank you so much! That is such a relief to hear. When do we get the official letters? We need to inform their current college.', type: 'sent' },
        { sender: 'Intermediary', time: '11:26 AM', text: 'Do not worry about the letters. They will be generated in 2-3 days once the reservation fee is credited. Please execute the initial bank transfer today so I can hand over the cashier receipt.', type: 'received' },
        { sender: 'Student Parent', time: '11:30 AM', text: 'I am initiating the transfer of $4,200 now. Sending receipt shortly.', type: 'sent' }
      ],
      notes: 'Shows early direct claims of having spoken to university deans and registrar representatives. Under subsequent investigation, the Registrar confirmed no such request was ever submitted.'
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
        { sender: 'Intermediary', time: '04:12 PM', text: 'The admission files are finalized. The students must discontinue attending classes at their current college immediately. If they continue registered there, the database will block their fresh registration due to dual enrollment codes.', type: 'received' },
        { sender: 'Student', time: '04:18 PM', text: 'Are you sure we should stop going? We haven\'t received the formal admission slips or student IDs yet.', type: 'sent' },
        { sender: 'Intermediary', time: '04:22 PM', text: 'Yes, absolutely sure. The enrollment window starts next week. If you don\'t withdraw now, it will delay the transfer of credit transcripts. Trust me, I\'ve handled this many times.', type: 'received' },
        { sender: 'Student', time: '04:30 PM', text: 'Okay, we will submit the withdrawal letters tomorrow.', type: 'sent' }
      ],
      notes: 'This instruction directly led to the students terminating their enrollment at their active accredited college, resulting in academic loss.'
    },
    'whatsapp-chat-3': {
      title: 'Delay Excuse Chat Logs',
      category: 'WhatsApp Chats',
      date: 'Oct 15, 2024',
      size: '520 KB',
      type: 'Chat Transcript',
      desc: 'Conversation transcript showing repeated excuse messages, server outages claims, and false updates.',
      mockupType: 'whatsapp',
      messages: [
        { sender: 'Student Parent', time: '09:00 AM', text: 'It has been over a month since the classes started and the kids have no portal login, no classes, and no ID. What is going on?', type: 'sent' },
        { sender: 'Intermediary', time: '10:15 AM', text: 'There is a major server upgrade happening at the university\'s ERP database. The IT department is manually importing student registers. Rest assured, your registration is safe.', type: 'received' },
        { sender: 'Student Parent', time: '10:20 AM', text: 'We need concrete proof. Can we go meet the administration office together?', type: 'sent' },
        { sender: 'Intermediary', time: '10:30 AM', text: 'No, please do not bypass me. The administration does not handle custom transfer protocols. If you go directly, it might complicate the file. I am on it, will call you this evening.', type: 'received' }
      ],
      notes: 'Demonstrates gatekeeping behavior to prevent direct contact with the university under the pretext of custom admission workflows.'
    },
    'university-response-1': {
      title: 'Registrar Inquiry Response',
      category: 'University Responses',
      date: 'Nov 12, 2024',
      size: '640 KB',
      type: 'Official Letter',
      desc: 'Official written response from the University Admissions Registrar confirming that no application, file, or tuition fee was ever received for the students.',
      mockupType: 'letter',
      logoText: 'STATE UNIVERSITY OF SCIENCE',
      refNo: 'REG/2024/7781-INF',
      dateStr: 'November 12, 2024',
      to: 'Student Guardian Representatives\nMetropolis Area Council',
      subject: 'RE: ENROLLMENT STATUS INQUIRY - TRANSCRIPT VERIFICATION',
      body: 'Dear Guardians, we write in response to your formal query dated November 08, 2024, regarding the enrollment status and academic registration credentials of students. Following a comprehensive audit of our Student Information System database, our records indicate that no applications for admission, requests for transfer of credits, or associated registration fee payments have been submitted, scheduled, or received under the names of the aforementioned individuals. The university does not utilize third-party independent intermediaries for student enrollment management or credit ledger adjustments.',
      signText: 'Office of the Registrar\nState University of Science Admissions Board',
      notes: 'The definitive proof verifying that the admission process was completely fraudulent and never initiated.'
    },
    'call-records-1': {
      title: 'Chronological Call Log Record',
      category: 'Call Records',
      date: 'Oct-Nov 2024',
      size: '310 KB',
      type: 'Call Summary log',
      desc: 'Aggregated phone call log documentation showcasing 70+ outbound calls with repeated unanswered lines and brief deflection calls.',
      mockupType: 'letter',
      logoText: 'COMMUNICATIONS NETWORK LOGS',
      refNo: 'MOB/SIM-AUDIT/8812',
      dateStr: 'November 30, 2024',
      to: 'To Whom It May Concern',
      subject: 'OUTBOUND CELLULAR CALL AUDIT RECORDS SUMMARY',
      body: 'Log summary records matching SIM profile audits for Student Guardian: Outbound calls to number (+555-0199) from October 01 to November 10 total 76 attempts. Successful connect rate: 12%. Average duration of successful calls: 42 seconds (deflection messages stating "I will call back in 10 minutes"). Remaining 88% of attempts: No answer, busy tone, or immediately routed to voicemail services.',
      signText: 'Verified SIM Metadata Audit Service',
      notes: 'Illustrates the systemic evasion tactics used to avoid answering direct questions once payment was made.'
    },
    'legal-notice-1': {
      title: 'Formal Legal Consult Letter',
      category: 'Legal Documents',
      date: 'Dec 18, 2024',
      size: '1.5 MB',
      type: 'Legal Document',
      desc: 'First legal draft notification and consultation notes issued by the legal counsel advising on the path forward.',
      mockupType: 'letter',
      logoText: 'JUSTICE & ASSOCIATES LLP',
      refNo: 'JUS/2024/CR-992',
      dateStr: 'December 18, 2024',
      to: 'Intermediary Representative / Family Acquaintance',
      subject: 'NOTICE OF FORMAL DEMAND FOR RESTITUTION AND DISCLOSURE',
      body: 'We represent the families of the students. You are hereby notified that a total sum of $7,700 was transferred to you under the contract for educational advisory representation services. Insofar as no service, academic ledger entry, or enrollment confirmation has been generated, and state universities have certified no records exist, we demand full restitution of the transferred funds within 14 days of this notice, failing which civil and criminal statutory remedies for grand larceny and false pretenses will be pursued.',
      signText: 'Managing Partner\nJustice & Associates LLP',
      notes: 'Formal legal action taken following absolute failure to recover funds or obtain enrollment records.'
    }
  };

  const modal = document.querySelector('#docModal');
  const modalCloseBtn = document.querySelector('#modalCloseBtn');
  const modalDownloadBtn = document.querySelector('#modalDownloadBtn');
  const modalBody = document.querySelector('#modalBody');
  const modalTitle = document.querySelector('#modalTitle');

  // Load and render document mockup inside modal
  const openDocumentModal = (docId) => {
    if (!modal || !modalBody || !modalTitle) return;
    const doc = docDatabase[docId];
    if (!doc) return;

    modalTitle.textContent = doc.title;
    
    // Clear and build mockup content
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
            <div class="bank-detail-item">
              <div class="bank-detail-label">Category Code</div>
              <div class="bank-detail-val">ED-TRANSFER / RESERVATION</div>
            </div>
          </div>
          <div class="bank-amount-box">
            <div class="bank-amount-label">AMOUNT TRANSFERRED</div>
            <div class="bank-amount-val">${doc.amount}</div>
          </div>
          <div style="font-size:0.7rem; color:#868e96; text-align:center; border-top:1px solid #e9ecef; padding-top:0.75rem;">
            This is an automatically generated electronic proof of transfer. Document ID verification match confirmed.
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
            <svg style="width:20px; height:20px; fill:currentColor;" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.156 5.156 0 11.439 0c3.042.001 5.902 1.183 8.053 3.336 2.15 2.152 3.33 5.011 3.327 8.053-.003 6.289-5.156 11.446-11.44 11.446-.002 0-.003 0-.005 0-2.002-.001-3.968-.521-5.717-1.507L0 24zm6.208-3.864c1.644.975 3.313 1.488 5.17 1.489 5.378 0 9.756-4.378 9.759-9.759.002-2.607-1.012-5.059-2.859-6.906C16.439 3.113 13.99 2.099 11.385 2.1c-5.382 0-9.76 4.378-9.763 9.76-.001 1.942.508 3.84 1.47 5.517l-.973 3.553 3.638-.954z"/></svg>
            WhatsApp Messenger Transcript
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
            OFFICIAL<br>REGISTRATION<br>RECORD
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
    
    // Configure download action simulation
    if (modalDownloadBtn) {
      modalDownloadBtn.onclick = () => {
        alert(`Downloading ${doc.title} (${doc.size}) as a secure PDF record.`);
      };
    }
    
    modal.showModal();
  };

  // Bind close modal handlers
  if (modalCloseBtn && modal) {
    modalCloseBtn.addEventListener('click', () => modal.close());
  }

  // Light dismiss option: clicking backdrop of native dialog closes it
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

  // Bind triggers to any click elements that open evidence modals
  window.triggerEvidenceModal = (docId) => {
    openDocumentModal(docId);
  };

  // === 5. FILTERING AND SEARCHING ===
  
  // 5a. Evidence Section Filtering
  const filterButtons = document.querySelectorAll('.evidence-filters .filter-btn');
  const evidenceCards = document.querySelectorAll('.evidence-grid .evidence-card');

  const filterEvidence = (category) => {
    evidenceCards.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      if (category === 'all' || cardCat === category) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const filterValue = e.target.getAttribute('data-filter');
      filterEvidence(filterValue);
    });
  });

  // 5b. Document Archive Search and Categorization
  const archiveSearch = document.querySelector('#archiveSearch');
  const archiveCards = document.querySelectorAll('.archive-grid .archive-card');

  const filterArchive = () => {
    const query = archiveSearch ? archiveSearch.value.toLowerCase().trim() : '';
    
    archiveCards.forEach(card => {
      const title = card.querySelector('.archive-title').textContent.toLowerCase();
      const desc = card.querySelector('.archive-desc').textContent.toLowerCase();
      const meta = card.querySelector('.archive-meta').textContent.toLowerCase();
      
      const matchesSearch = title.includes(query) || desc.includes(query) || meta.includes(query);
      
      if (matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  if (archiveSearch) {
    archiveSearch.addEventListener('input', filterArchive);
  }

  // === 6. FAQ ACCORDION HANDLERS ===
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer');
    
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close other opened FAQs
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });
      
      if (!isActive) {
        item.classList.add('active');
        // Calculate content height dynamically for smooth sliding animation
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
      
      // Collect values (for demonstration / audit logic)
      const name = document.querySelector('#contactName').value;
      const email = document.querySelector('#contactEmail').value;
      const message = document.querySelector('#contactMessage').value;
      
      // Basic validation
      if (!name || !email || !message) {
        alert('Please fill out all required fields.');
        return;
      }
      
      // Simulate submission endpoint
      formFeedback.textContent = 'Thank you. Your statement and details have been logged securely. Our legal audit representatives will verify any details provided.';
      formFeedback.classList.add('success');
      formFeedback.style.display = 'block';
      
      // Reset form
      contactForm.reset();
      
      // Fade out success message after 7 seconds
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
