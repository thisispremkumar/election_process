document.addEventListener('DOMContentLoaded', () => {
    // --- Data Sources ---
    
    const electionSteps = [
        {
            id: 1,
            title: "Check Requirements",
            date: "Anytime",
            icon: "fa-clipboard-check",
            description: "Before you can vote, you must meet the basic requirements. You must be a U.S. citizen, meet your state's residency requirements, and be 18 years old on or before Election Day.",
            detail1Title: "Citizenship",
            detail1Text: "Only U.S. citizens can vote in federal elections.",
            detail2Title: "Age",
            detail2Text: "You can often pre-register at 16 or 17, but you must be 18 to cast a ballot.",
            videoId: "P9VdyITyAEi" // Placeholder for Voting Requirements
        },
        {
            id: 2,
            title: "Register to Vote",
            date: "Weeks before Election Day",
            icon: "fa-id-card",
            description: "Every state except North Dakota requires you to register before you can vote. Deadlines vary by state, ranging from 30 days before the election to Election Day itself.",
            detail1Title: "How to Register",
            detail1Text: "You can register online, by mail, or in person at the DMV or local election office.",
            detail2Title: "Check Status",
            detail2Text: "Always verify your registration status well before the deadline, especially if you have moved.",
            videoId: "v=o1xX88R_PIM" // Placeholder for How to Register
        },
        {
            id: 3,
            title: "Research Candidates",
            date: "Ongoing",
            icon: "fa-magnifying-glass",
            description: "Learn about the candidates running for office and the ballot measures in your area. Look beyond the presidential race to local and state elections, which often impact your daily life more directly.",
            detail1Title: "Sample Ballots",
            detail1Text: "Look up your sample ballot online so you know exactly what you will be voting on.",
            detail2Title: "Non-Partisan Info",
            detail2Text: "Use resources like Vote411 or Ballotpedia to find unbiased information on candidates' stances.",
            videoId: "kO3aVvFqL4s" // Placeholder for Researching Candidates
        },
        {
            id: 4,
            title: "Choose Voting Method",
            date: "Weeks before Election",
            icon: "fa-envelope-open-text",
            description: "Decide how you want to cast your ballot. Most states offer several options: voting by mail (absentee), early voting in person, or voting on Election Day.",
            detail1Title: "Vote by Mail",
            detail1Text: "If you choose to vote by mail, request your ballot early and follow the instructions carefully.",
            detail2Title: "Early Voting",
            detail2Text: "Many states allow you to vote in person before Election Day, often with shorter lines.",
            videoId: "y1vA4J2D92k" // Placeholder for Voting Methods
        },
        {
            id: 5,
            title: "Cast Your Ballot",
            date: "Election Day (or before)",
            icon: "fa-person-booth",
            description: "Head to your polling place or drop off your mail-in ballot. If voting in person, be sure to bring any required identification.",
            detail1Title: "Polling Place",
            detail1Text: "Your specific polling location is assigned based on your address. Double-check it before you go.",
            detail2Title: "Voter ID",
            detail2Text: "Rules vary by state. Check if you need to bring a photo ID or other documentation.",
            videoId: "Wn_S-q7Lz00" // Placeholder for Casting Ballot
        },
        {
            id: 6,
            title: "Track Your Vote",
            date: "Post-Election",
            icon: "fa-truck-fast",
            description: "If you voted by mail or provisional ballot, many states offer online tools to track the status of your ballot to ensure it was received and counted.",
            detail1Title: "Curing Ballots",
            detail1Text: "If there's an issue with your signature, some states allow you to 'cure' or fix your ballot so it counts.",
            detail2Title: "Patience",
            detail2Text: "Official results take time to certify as election officials ensure every valid vote is counted accurately.",
            videoId: "8b78b0222f7" // Placeholder for Tracking Vote
        }
    ];

    const faqDatabase = [
        {
            keywords: ["register", "registration", "sign up"],
            answer: "To vote, you must be a US citizen, meet your state's residency requirements, and be 18 on or before Election Day. You can register online in most states, by mail, or in person at local election offices or DMVs. Check <strong>vote.gov</strong> for your specific state's rules and deadlines."
        },
        {
            keywords: ["electoral college", "college", "electoral", "270"],
            answer: "The Electoral College is a process where 538 'electors' vote for the President. Each state gets electors equal to its total number of Congress members (House + Senate). A candidate needs a majority of 270 electoral votes to win the presidency. It's possible to win the national popular vote but lose the Electoral College."
        },
        {
            keywords: ["primary", "caucus", "primaries"],
            answer: "Primaries and caucuses are how political parties choose their candidates for the general election. In a primary, you vote secretly on a ballot. In a caucus, people gather locally to discuss and openly vote for candidates. Winning these gives a candidate 'delegates' for the national convention."
        },
        {
            keywords: ["when", "date", "election day"],
            answer: "General Election Day in the United States is always held on the first Tuesday following the first Monday in November. However, many states offer early voting and mail-in voting which start weeks beforehand."
        },
        {
            keywords: ["mail", "absentee", "early"],
            answer: "Most states allow some form of early voting or voting by mail (absentee voting). The rules vary widely by state—some automatically mail ballots to all registered voters, while others require an 'excuse' to vote absentee. You should check your local election office website for specifics."
        },
        {
            keywords: ["hello", "hi", "hey"],
            answer: "Hello! I'm your Election Assistant. I can explain the timeline of a presidential election, help you understand the Electoral College, or answer questions about voter registration. What would you like to know?"
        }
    ];


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
            li.innerHTML = `
                <div class="step-number">${step.id}</div>
                <div class="step-title">${step.title}</div>
            `;
            li.addEventListener('click', () => selectStep(index));
            stepsList.appendChild(li);

            // Header Top Nav Links
            if (headerLinks) {
                const headerBtn = document.createElement('button');
                headerBtn.className = `header-step-btn ${index === currentStepIndex ? 'active' : ''}`;
                headerBtn.textContent = step.title;
                headerBtn.addEventListener('click', () => {
                    switchView('timeline');
                    selectStep(index);
                });
                headerLinks.appendChild(headerBtn);
            }
        });
        updateTimelineView();
    }

    // Render Content Card
    function renderContent(index) {
        const step = electionSteps[index];
        // Simple fade effect
        contentCard.style.opacity = 0;
        
        setTimeout(() => {
            contentCard.innerHTML = `
                <div class="content-header">
                    <div class="content-date">${step.date}</div>
                    <div class="step-icon"><i class="fa-solid ${step.icon} fa-2x" style="color: var(--primary);" aria-hidden="true"></i></div>
                </div>
                <h3 class="content-title">${step.title}</h3>
                
                ${step.videoId ? `
                <div class="video-container">
                    <iframe width="100%" height="250" src="https://www.youtube.com/embed/${step.videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>` : ''}

                <p class="content-body">${step.description}</p>
                <div class="content-details">
                    <div class="detail-box">
                        <h4><i class="fa-solid fa-circle-info" aria-hidden="true"></i> ${step.detail1Title}</h4>
                        <p>${step.detail1Text}</p>
                    </div>
                    <div class="detail-box">
                        <h4><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> ${step.detail2Title}</h4>
                        <p>${step.detail2Text}</p>
                    </div>
                </div>
            `;
            contentCard.style.transition = 'opacity 0.3s ease';
            contentCard.style.opacity = 1;
        }, 150);
    }

    function selectStep(index) {
        currentStepIndex = index;
        
        // Update active class in sidebar
        const items = document.querySelectorAll('.step-item');
        items.forEach((item, i) => {
            item.classList.toggle('active', i === currentStepIndex);
        });

        // Update active class in header nav
        const headerBtns = document.querySelectorAll('.header-step-btn');
        headerBtns.forEach((btn, i) => {
            btn.classList.toggle('active', i === currentStepIndex);
        });

        // Move list
        const yOffset = -(currentStepIndex * stepHeight) + (window.innerWidth > 900 ? 150 : 0);
        if(window.innerWidth > 900) {
            stepsList.style.transform = `translateY(${yOffset}px)`;
        } else {
             stepsList.style.transform = `translateX(0px)`; // Simplified for mobile
        }
        

        renderContent(currentStepIndex);
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

    function getBotResponse(input) {
        const lowerInput = input.toLowerCase();
        
        // Find matching answer
        const match = faqDatabase.find(faq => 
            faq.keywords.some(kw => lowerInput.includes(kw))
        );

        if (match) {
            return match.answer;
        } else {
            return "I'm not quite sure about that specific detail. You might want to check an official source like vote.gov or usa.gov for the most accurate information regarding your question. Is there something else about the general process I can help with?";
        }
    }

    async function handleSend() {
        const text = chatInput.value.trim();
        if (text === '') return;

        // User message
        addMessage(text, true);
        chatInput.value = '';

        // Add loading indicator
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
            document.getElementById(loadingId).remove();

            if (response.ok && data.answer) {
                addMessage(data.answer, false, true);
            } else {
                console.warn("API Error, falling back to local DB.", data.error);
                const fallbackResponse = getBotResponse(text);
                addMessage(fallbackResponse, false, false);
            }
        } catch (error) {
            console.error("Network Error:", error);
            // Remove loading
            const loader = document.getElementById(loadingId);
            if(loader) loader.remove();
            
            const fallbackResponse = getBotResponse(text);
            addMessage(fallbackResponse, false, false);
        }
    }

    sendBtn.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // Handle suggestion chips
    document.querySelectorAll('.query-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            const text = e.target.textContent;
            chatInput.value = text;
            handleSend();
        });
    });
});
