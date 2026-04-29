"use strict";

/**
 * Global flag indicating if Google Maps API is loaded.
 * @type {boolean}
 */
window.googleMapsReady = false;

/**
 * Callback function for Google Maps API.
 */
window.initMap = function() {
    window.googleMapsReady = true;
    if (document.getElementById('map-container')) {
        renderMap();
    }
};

/**
 * Sample polling booth locations for Google Maps marker demo.
 * @type {Array<{lat: number, lng: number, name: string, address: string}>}
 */
const POLLING_BOOTH_LOCATIONS = [
    { lat: 28.6139, lng: 77.2090, name: 'Polling Booth #101 - India Gate', address: 'Rajpath, New Delhi, 110001' },
    { lat: 28.6129, lng: 77.2295, name: 'Polling Booth #102 - Pragati Maidan', address: 'Mathura Road, New Delhi, 110001' },
    { lat: 28.6353, lng: 77.2250, name: 'Polling Booth #103 - Civil Lines', address: 'Civil Lines, New Delhi, 110054' },
];

/**
 * Initializes and renders the Google Map with polling booth markers and InfoWindows.
 * Uses the Google Maps JavaScript API Places and Marker libraries.
 */
function renderMap() {
    if (window.googleMapsReady && window.google && window.google.maps) {
        const mapContainer = document.getElementById('map-container');
        if (mapContainer && !mapContainer.hasChildNodes()) {
            mapContainer.style.height = '350px';
            const center = { lat: 28.6139, lng: 77.2090 };
            const map = new google.maps.Map(mapContainer, {
                zoom: 13,
                center: center,
                mapTypeControl: true,
                streetViewControl: false,
                zoomControl: true,
                styles: [
                    { elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
                    { elementType: 'labels.text.fill', stylers: [{ color: '#cbd5e1' }] },
                    { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
                    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#334155' }] },
                    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#1e3a5f' }] },
                ]
            });

            const infoWindow = new google.maps.InfoWindow();

            POLLING_BOOTH_LOCATIONS.forEach((booth) => {
                const marker = new google.maps.Marker({
                    position: { lat: booth.lat, lng: booth.lng },
                    map: map,
                    title: booth.name,
                    animation: google.maps.Animation.DROP,
                });

                marker.addListener('click', () => {
                    infoWindow.setContent(
                        `<div style="color:#0f172a;font-family:Inter,sans-serif;padding:4px;">
                            <strong>${booth.name}</strong><br>
                            <span style="font-size:0.85em;">${booth.address}</span><br>
                            <a href="https://www.google.com/maps/dir/?api=1&destination=${booth.lat},${booth.lng}" 
                               target="_blank" rel="noopener noreferrer" 
                               style="color:#3b82f6;font-size:0.85em;">Get Directions (Google Maps)</a>
                        </div>`
                    );
                    infoWindow.open(map, marker);
                    if (typeof trackEvent === 'function') {
                        trackEvent('map_marker_click', { booth_name: booth.name });
                    }
                });
            });

            if (typeof trackEvent === 'function') {
                trackEvent('google_map_rendered', { location: 'polling_booth_step' });
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Data and Utils are loaded from data.js and utils.js ---

    // --- Navigation Logic ---
    const btnTimeline = document.getElementById('btn-timeline');
    const btnAssistant = document.getElementById('btn-assistant');
    const viewTimeline = document.getElementById('view-timeline');
    const viewAssistant = document.getElementById('view-assistant');

    /**
     * Switches the active view between the timeline and the assistant.
     * @param {string} viewId - The ID of the view to activate ('timeline' or 'assistant').
     */
    function switchView(viewId) {
        if (viewId === 'timeline') {
            btnTimeline.classList.add('active');
            btnTimeline.setAttribute('aria-pressed', 'true');
            btnAssistant.classList.remove('active');
            btnAssistant.setAttribute('aria-pressed', 'false');
            viewTimeline.classList.remove('hidden');
            viewAssistant.classList.add('hidden');
            setTimeout(() => viewTimeline.classList.add('active'), 50);
            viewAssistant.classList.remove('active');
        } else {
            btnAssistant.classList.add('active');
            btnAssistant.setAttribute('aria-pressed', 'true');
            btnTimeline.classList.remove('active');
            btnTimeline.setAttribute('aria-pressed', 'false');
            viewAssistant.classList.remove('hidden');
            viewTimeline.classList.add('hidden');
            setTimeout(() => viewAssistant.classList.add('active'), 50);
            viewTimeline.classList.remove('active');
        }
    }

    btnTimeline.addEventListener('click', () => {
        switchView('timeline');
        if (typeof trackEvent === 'function') trackEvent('view_switch', { view: 'timeline' });
    });
    btnAssistant.addEventListener('click', () => {
        switchView('assistant');
        if (typeof trackEvent === 'function') trackEvent('view_switch', { view: 'assistant' });
    });


    // --- Timeline Logic ---
    const stepsList = document.getElementById('timeline-steps');
    const contentCard = document.getElementById('step-content');
    let currentStepIndex = 0;
    const stepHeight = 85; // Height of step item + gap

    /**
     * Renders the timeline navigation steps using a DocumentFragment to minimize DOM repaints.
     */
    function renderTimeline() {
        stepsList.innerHTML = '';
        const headerLinks = document.getElementById('header-step-links');
        if (headerLinks) headerLinks.innerHTML = '';

        const stepsFragment = document.createDocumentFragment();
        const headerFragment = document.createDocumentFragment();

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
                } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    if (index < electionSteps.length - 1) {
                        selectStep(index + 1);
                        document.getElementById(`step-tab-${index + 1}`).focus();
                    }
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    if (index > 0) {
                        selectStep(index - 1);
                        document.getElementById(`step-tab-${index - 1}`).focus();
                    }
                }
            });
            stepsFragment.appendChild(li);

            // Header Quick Links
            if (headerLinks) {
                const navLink = document.createElement('button');
                navLink.className = 'header-step-btn';
                navLink.textContent = step.title;
                navLink.addEventListener('click', () => {
                    switchView('timeline');
                    selectStep(index);
                });
                headerFragment.appendChild(navLink);
            }
        });

        stepsList.appendChild(stepsFragment);
        if (headerLinks) headerLinks.appendChild(headerFragment);
    }

    /**
     * Renders the detailed content for a specific timeline step.
     * @param {number} index - The index of the step to render.
     */
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
                ${step.hasMap ? `<div id="map-container" class="map-container" style="margin-top: 1.5rem; border-radius: 12px; overflow: hidden; border: 1px solid var(--glass-border);"></div>` : ''}
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
            if (step.hasMap) {
                renderMap();
            }
        }, 50);
    }

    /**
     * Selects and displays a specific step in the timeline.
     * @param {number} index - The index of the step to display.
     */
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

        // Track step selection in Google Analytics 4
        if (typeof trackEvent === 'function') {
            trackEvent('timeline_step_view', {
                step_index: index + 1,
                step_name: electionSteps[index].title,
            });
        }
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

    /**
     * Handles swipe gestures for mobile timeline navigation.
     */
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

    const debouncedHandleGesture = typeof debounce === 'function' ? debounce(handleGesture, 100) : handleGesture;

    contentCard.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    }, { passive: true });

    contentCard.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        debouncedHandleGesture();
    }, { passive: true });

    // Initialize Timeline
    renderTimeline();
    selectStep(0);


    // --- Chatbot Logic ---
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');

    /**
     * Speaks the provided text using the Web Speech API.
     * @param {string} text - The text content to be spoken.
     */
    function speak(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.pitch = 1;
            
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('hi-IN'));
            if (preferredVoice) utterance.voice = preferredVoice;

            window.speechSynthesis.speak(utterance);
        }
    }

    /**
     * Adds a message block to the chat interface.
     * @param {string} text - The message text.
     * @param {boolean} [isUser=false] - Whether the message is from the user.
     * @param {boolean} [isMarkdown=false] - Whether to parse the text as markdown.
     */
    function addMessage(text, isUser = false, isMarkdown = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        
        const avatarIcon = isUser ? 'fa-user' : 'fa-robot';
        
        let contentHTML = `<p>${text}</p>`;
        if (isMarkdown && typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
            const rawMarkup = marked.parse(text);
            contentHTML = DOMPurify.sanitize(rawMarkup);
        } else if (isMarkdown) {
            contentHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
        }

        const speakBtnHTML = !isUser ? `<button class="speak-msg-btn" title="Listen" aria-label="Read out loud"><i class="fa-solid fa-volume-high"></i></button>` : '';

        msgDiv.innerHTML = `
            <div class="message-avatar"><i class="fa-solid ${avatarIcon}" aria-hidden="true"></i></div>
            <div class="message-content">
                ${contentHTML}
                ${speakBtnHTML}
            </div>
        `;
        
        if (!isUser) {
            const btn = msgDiv.querySelector('.speak-msg-btn');
            if (btn) btn.addEventListener('click', () => speak(text));
        }

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /**
     * Handles sending the user's message to the chat interface and fetching the AI response.
     */
    async function handleSend() {
        const text = chatInput.value.trim();
        if (text === '') return;

        // Track chat query in Google Analytics 4
        if (typeof trackEvent === 'function') {
            trackEvent('chat_query_sent', { query_length: text.length });
        }

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

    // Voice Search
    const voiceBtn = document.getElementById('voice-search-btn');
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new Recognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN'; // Explicitly requesting Indian English

        voiceBtn.addEventListener('click', () => {
            try {
                voiceBtn.classList.add('recording');
                recognition.start();
                if (typeof trackEvent === 'function') {
                    trackEvent('voice_search_started', { lang: recognition.lang });
                }
            } catch (e) {
                voiceBtn.classList.remove('recording');
                addMessage("Microphone access is currently busy or unavailable.", false);
            }
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            voiceBtn.classList.remove('recording');
            handleSend();
        };

        recognition.onerror = (event) => {
            voiceBtn.classList.remove('recording');
            if (event.error === 'language-not-supported') {
                recognition.lang = 'hi-IN'; // Fallback to Hindi
                addMessage("English locale not fully supported, falling back to Hindi (hi-IN). Please try speaking again.", false);
            } else if (event.error === 'not-allowed') {
                addMessage("Please allow microphone permissions to use Voice Search.", false);
            } else {
                addMessage("Could not process voice input. Please try again or type your query.", false);
            }
        };
        
        recognition.onend = () => {
            voiceBtn.classList.remove('recording');
        };
    } else {
        // Graceful fallback for unsupported browsers
        voiceBtn.addEventListener('click', () => {
            addMessage("Voice search is not supported by your browser. Please type your query in the input box.", false);
        });
    }

    // Suggested queries
    document.querySelectorAll('.query-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            chatInput.value = chip.textContent;
            handleSend();
        });
    });
});
