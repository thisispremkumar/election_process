document.addEventListener('DOMContentLoaded', () => {
    // --- Data Sources ---
    
    const electionSteps = [
        {
            id: 1,
            title: "Requirements & Declaration",
            date: "Spring (Year Before)",
            icon: "fa-flag-usa",
            description: "To run for president, a candidate must be a natural-born U.S. citizen, at least 35 years old, and a resident of the U.S. for 14 years. Candidates officially announce their intention to run and form campaign committees.",
            detail1Title: "Filing",
            detail1Text: "Candidates must file with the Federal Election Commission (FEC) once they raise or spend more than $5,000.",
            detail2Title: "Campaigning",
            detail2Text: "Early campaigning involves raising money, building a team, and touring key states.",
            videoId: "b4XN-d8x18M" // Example YouTube video ID (How to run for president)
        },
        {
            id: 2,
            title: "Primaries & Caucuses",
            date: "Jan - June (Election Year)",
            icon: "fa-users",
            description: "States and political parties hold elections (primaries) or local gatherings (caucuses) to choose their preferred candidate. In a primary, voters cast secret ballots. In a caucus, voters gather to discuss and vote publicly.",
            detail1Title: "Delegates",
            detail1Text: "Candidates win 'delegates' based on the results of these state-level votes.",
            detail2Title: "Super Tuesday",
            detail2Text: "The day when the largest number of states hold their primaries and caucuses.",
            videoId: "_9cgxsCQh2A" // Example YouTube video ID (Primaries and Caucuses)
        },
        {
            id: 3,
            title: "National Conventions",
            date: "July - August",
            icon: "fa-bullhorn",
            description: "Parties hold national conventions to officially nominate their presidential and vice-presidential candidates. The delegates won during primaries/caucuses cast their official votes here.",
            detail1Title: "The Ticket",
            detail1Text: "The Presidential nominee officially announces their Vice Presidential running mate.",
            detail2Title: "Party Platform",
            detail2Text: "The party establishes and adopts its official stance on various political issues.",
            videoId: "wJ81n1N5s8s" // Example YouTube video ID (National Conventions)
        },
        {
            id: 4,
            title: "General Election Campaign",
            date: "Sept - November",
            icon: "fa-microphone-lines",
            description: "The nominated candidates campaign nationwide against each other. This period is marked by intense advertising, rallies, and televised debates between the presidential and vice-presidential candidates.",
            detail1Title: "Debates",
            detail1Text: "Usually three presidential debates and one vice-presidential debate are held.",
            detail2Title: "Swing States",
            detail2Text: "Campaigns focus heavily on 'battleground' states where the outcome is uncertain.",
            videoId: "p2e27X8bBEM" // Example YouTube video ID (Debates/Campaigning)
        },
        {
            id: 5,
            title: "Election Day",
            date: "First Tuesday after Nov 1",
            icon: "fa-check-to-slot",
            description: "Voters across the country cast their ballots. While they are voting for a presidential candidate, they are technically voting for a slate of 'electors' pledged to that candidate.",
            detail1Title: "Popular Vote",
            detail1Text: "The total number of individual votes cast for a candidate nationwide.",
            detail2Title: "Media Calls",
            detail2Text: "News outlets project winners based on exit polls and early returns, but official results take days.",
            videoId: "ok_VQ8I7g6I" // Example YouTube video ID (Electoral College / Election Day overview)
        },
        {
            id: 6,
            title: "Electoral College",
            date: "Mid-December",
            icon: "fa-building-columns",
            description: "The Electoral College officially elects the President. There are 538 total electoral votes; a candidate needs a majority (270) to win. The electors meet in their respective states to cast their official ballots.",
            detail1Title: "Winner-Take-All",
            detail1Text: "In 48 states and DC, the winner of the state's popular vote gets ALL its electoral votes.",
            detail2Title: "Certification",
            detail2Text: "Congress meets in early January to officially count and certify the electoral votes.",
            videoId: "W9H3gvnN468" // Example YouTube video ID (Electoral College explained)
        },
        {
            id: 7,
            title: "Inauguration",
            date: "January 20",
            icon: "fa-star",
            description: "The President-elect and Vice President-elect are officially sworn into office on the steps of the U.S. Capitol. The new President delivers an inaugural address outlining their vision for the term.",
            detail1Title: "The Oath",
            detail1Text: "Administered by the Chief Justice of the Supreme Court.",
            detail2Title: "Transition",
            detail2Text: "Power is officially transferred, and the new administration begins its work.",
            videoId: "6fG2j4G6J9Q" // Example YouTube video ID (Presidential Transition)
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
        electionSteps.forEach((step, index) => {
            const li = document.createElement('li');
            li.className = `step-item ${index === currentStepIndex ? 'active' : ''}`;
            li.innerHTML = `
                <div class="step-number">${step.id}</div>
                <div class="step-title">${step.title}</div>
            `;
            li.addEventListener('click', () => selectStep(index));
            stepsList.appendChild(li);
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
        
        // Update active class
        const items = document.querySelectorAll('.step-item');
        items.forEach((item, i) => {
            item.classList.toggle('active', i === currentStepIndex);
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
