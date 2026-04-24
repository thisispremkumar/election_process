document.addEventListener('DOMContentLoaded', () => {
    // --- Data and Utils are loaded from data.js and utils.js ---

    // --- Navigation Logic ---
    const btnTimeline = document.getElementById('btn-timeline');
    const btnAssistant = document.getElementById('btn-assistant');
    const viewTimeline = document.getElementById('view-timeline');
    const viewAssistant = document.getElementById('view-assistant');

    function switchView(viewId) {
        if (viewId === 'timeline') {
            btnTimeline.classList.add('active');
            btnAssistant.classList.remove('active');
            viewTimeline.classList.remove('hidden');
            viewAssistant.classList.add('hidden');
            setTimeout(() => viewTimeline.classList.add('active'), 50);
            viewAssistant.classList.remove('active');
        } else {
            btnAssistant.classList.add('active');
            btnTimeline.classList.remove('active');
            viewAssistant.classList.remove('hidden');
            viewTimeline.classList.add('hidden');
            setTimeout(() => viewAssistant.classList.add('active'), 50);
            viewTimeline.classList.remove('active');
        }
    }

    btnTimeline.addEventListener('click', () => switchView('timeline'));
    btnAssistant.addEventListener('click', () => switchView('assistant'));


    // --- Timeline Logic ---
    const stepsList = document.getElementById('timeline-steps');
    const contentCard = document.getElementById('step-content');
    let currentStepIndex = 0;
    const stepHeight = 85; // Height of step item + gap

    // Render Timeline Steps
    function renderTimeline() {
        stepsList.innerHTML = '';
        const headerLinks = document.getElementById('header-step-links');
        if (headerLinks) headerLinks.innerHTML = '';

        electionSteps.forEach((step, index) => {
            // Main Timeline Sidebar
            const li = document.createElement('li');
            li.className = `step-item ${index === currentStepIndex ? 'active' : ''}`;
            li.setAttribute('role', 'tab');
            li.setAttribute('aria-selected', index === currentStepIndex);
            li.setAttribute('aria-controls', 'step-content');
            li.id = `step-tab-${index}`;
            li.tabIndex = 0;
            
            li.innerHTML = `
                <div class="step-dot"></div>
                <div class="step-info">
                    <span class="step-date">${step.date}</span>
                    <h3 class="step-title-small">${step.title}</h3>
                </div>
            `;
            
            li.addEventListener('click', () => selectStep(index));
            li.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectStep(index);
                }
            });
            stepsList.appendChild(li);

            // Header Quick Links
            if (headerLinks) {
                const navLink = document.createElement('button');
                navLink.className = 'header-step-btn';
                navLink.textContent = step.title;
                navLink.addEventListener('click', () => {
                    switchView('timeline');
                    selectStep(index);
                });
                headerLinks.appendChild(navLink);
            }
        });
    }

    function renderContent(index) {
        const step = electionSteps[index];
        contentCard.innerHTML = `
            <div class="card-header">
                <div class="step-badge">Step ${index + 1}</div>
                <div class="step-icon"><i class="fa-solid ${step.icon}"></i></div>
                <div class="card-titles">
                    <span class="card-date">${step.date}</span>
                    <h2>${step.title}</h2>
                </div>
            </div>
            
            <div class="card-body">
                <p class="step-description">${step.description}</p>
                
                <div class="step-details">
                    <div class="detail-box">
                        <h4>${step.detail1Title}</h4>
                        <p>${step.detail1Text}</p>
                    </div>
                    <div class="detail-box">
                        <h4>${step.detail2Title}</h4>
                        <p>${step.detail2Text}</p>
                    </div>
                </div>

                ${step.videoId ? `
                <div class="video-container">
                    <iframe 
                        src="https://www.youtube.com/embed/${step.videoId}" 
                        title="Election Step Video" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowfullscreen>
                    </iframe>
                </div>` : ''}
            </div>

            <div class="card-footer">
                <p>Learn more about ${step.title.toLowerCase()} on the official ECI website.</p>
            </div>
        `;

        // Apply animations
        const cardBody = contentCard.querySelector('.card-body');
        cardBody.style.opacity = '0';
        cardBody.style.transform = 'translateY(20px)';
        setTimeout(() => {
            cardBody.style.transition = 'all 0.5s ease';
            cardBody.style.opacity = '1';
            cardBody.style.transform = 'translateY(0)';
        }, 50);
    }

    function selectStep(index) {
        currentStepIndex = index;
        
        // Update sidebar UI
        const allSteps = stepsList.querySelectorAll('.step-item');
        allSteps.forEach((step, idx) => {
            if (idx === index) {
                step.classList.add('active');
                step.setAttribute('aria-selected', 'true');
            } else {
                step.classList.remove('active');
                step.setAttribute('aria-selected', 'false');
            }
        });

        // Scroll sidebar to keep active step in view
        const targetOffset = index * stepHeight;
        stepsList.parentElement.scrollTo({
            top: targetOffset - 100,
            behavior: 'smooth'
        });

        renderContent(index);
    }

    // Arrow controls
    document.querySelector('.prev-arrow').addEventListener('click', () => {
        if (currentStepIndex > 0) selectStep(currentStepIndex - 1);
    });

    document.querySelector('.next-arrow').addEventListener('click', () => {
        if (currentStepIndex < electionSteps.length - 1) selectStep(currentStepIndex + 1);
    });

    // Swipe functionality for Timeline Card
    let touchstartX = 0;
    let touchendX = 0;

    function handleGesture() {
        if (touchendX < touchstartX - 50) {
            // Swiped left, go to next
            if (currentStepIndex < electionSteps.length - 1) selectStep(currentStepIndex + 1);
        }
        
        if (touchendX > touchstartX + 50) {
            // Swiped right, go to previous
            if (currentStepIndex > 0) selectStep(currentStepIndex - 1);
        }
    }

    contentCard.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    });

    contentCard.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        handleGesture();
    });

    // Initialize Timeline
    renderTimeline();
    selectStep(0);


    // --- Chatbot Logic ---
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');

    function addMessage(text, isUser = false, isMarkdown = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        const avatarIcon = isUser ? 'fa-user' : 'fa-robot';
        
        let contentHTML = `<p>${text}</p>`;
        if (isMarkdown && typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
            const rawMarkup = marked.parse(text);
            contentHTML = DOMPurify.sanitize(rawMarkup);
        } else if (isMarkdown) {
            // Fallback if libraries are not loaded
            contentHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
        }

        msgDiv.innerHTML = `
            <div class="message-avatar"><i class="fa-solid ${avatarIcon}" aria-hidden="true"></i></div>
            <div class="message-content">
                ${contentHTML}
            </div>
        `;
        
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function handleSend() {
        const text = chatInput.value.trim();
        if (text === '') return;

        // User message
        addMessage(text, true);
        chatInput.value = '';

        // 1. Check local FAQ database first (Instant response)
        const localAnswer = findFaqResponse(text, faqDatabase);
        if (localAnswer) {
            setTimeout(() => {
                addMessage(localAnswer, false);
            }, 600);
            return;
        }

        // 2. Add loading indicator for AI
        const loadingId = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message ai-message';
        loadingDiv.id = loadingId;
        loadingDiv.innerHTML = `
            <div class="message-avatar"><i class="fa-solid fa-robot" aria-hidden="true"></i></div>
            <div class="message-content"><p><i class="fa-solid fa-circle-notch fa-spin"></i> Thinking...</p></div>
        `;
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            
            // Remove loading
            const loader = document.getElementById(loadingId);
            if (loader) loader.remove();

            if (data.answer) {
                addMessage(data.answer, false, true);
            } else {
                addMessage("I'm sorry, I couldn't process that. Please try again.", false);
            }
        } catch (error) {
            console.error("Chat error:", error);
            const loader = document.getElementById(loadingId);
            if (loader) loader.remove();
            addMessage("Connection error. Please check your internet and try again.", false);
        }
    }

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // Suggested queries
    document.querySelectorAll('.query-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            chatInput.value = chip.textContent;
            handleSend();
        });
    });
});
