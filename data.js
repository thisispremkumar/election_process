const electionSteps = [
    {
        id: 1,
        title: "Check Eligibility",
        date: "Anytime",
        icon: "fa-clipboard-check",
        description: "To vote in India, you must be an Indian citizen, at least 18 years old on the qualifying date (usually Jan 1st of the year), and ordinarily resident of the polling area.",
        detail1Title: "Citizenship",
        detail1Text: "Only citizens of India have the right to vote in elections.",
        detail2Title: "NRIs",
        detail2Text: "Non-Resident Indians (NRIs) can register as overseas electors if they hold a valid Indian passport.",
        videoId: "" 
    },
    {
        id: 2,
        title: "Register to Vote (Form 6)",
        date: "Before Election Notification",
        icon: "fa-id-card",
        description: "You must register your name in the Electoral Roll. First-time voters need to fill out Form 6, which can be done online through the Voter Helpline App or the ECI portal.",
        detail1Title: "Voter Portal",
        detail1Text: "Visit voters.eci.gov.in to apply online.",
        detail2Title: "EPIC Card",
        detail2Text: "Once approved, you receive an Electors Photo Identity Card (EPIC), commonly known as a Voter ID.",
        videoId: "" 
    },
    {
        id: 3,
        title: "Verify Electoral Roll",
        date: "Weeks before Election",
        icon: "fa-magnifying-glass",
        description: "Having a Voter ID is not enough; your name MUST be on the voter list (Electoral Roll) at the polling booth. Always check your name online before the election.",
        detail1Title: "Search Online",
        detail1Text: "Use the 'Search in Electoral Roll' feature on the ECI website using your EPIC number.",
        detail2Title: "Booth Slips",
        detail2Text: "Booth Level Officers (BLOs) usually distribute voter information slips with your polling station details.",
        videoId: "" 
    },
    {
        id: 4,
        title: "Know Your Candidates",
        date: "Campaign Period",
        icon: "fa-user-tie",
        description: "The Election Commission provides the KYC (Know Your Candidate) app. You can view the criminal antecedents, assets, and educational qualifications of the candidates.",
        detail1Title: "KYC App",
        detail1Text: "Download the ECI KYC app to make an informed decision.",
        detail2Title: "Manifestos",
        detail2Text: "Read the manifestos of political parties to understand their promises and policies.",
        videoId: "" 
    },
    {
        id: 5,
        title: "Go to Polling Booth",
        date: "Election Day",
        icon: "fa-person-booth",
        description: "Go to your designated polling station. Keep your EPIC or one of the other 11 photo identity documents ready. <br><br><a href='https://www.google.com/maps/search/polling+booth+near+me' target='_blank' class='maps-link'><i class='fa-solid fa-location-dot'></i> Find Polling Booth on Google Maps</a>",
        detail1Title: "Verification",
        detail1Text: "The First Polling Officer will check your name in the voter list and verify your ID.",
        detail2Title: "Inking",
        detail2Text: "The Second Polling Officer will mark your left forefinger with indelible ink and give you a slip.",
        videoId: "" 
    },
    {
        id: 6,
        title: "Cast Your Vote (EVM & VVPAT)",
        date: "Election Day",
        icon: "fa-box-archive",
        description: "Proceed to the voting compartment. Press the blue button on the Electronic Voting Machine (EVM) next to the symbol of your chosen candidate.",
        detail1Title: "VVPAT Verification",
        detail1Text: "Look at the VVPAT machine window. A printed slip with your candidate's symbol will be visible for 7 seconds to verify your vote.",
        detail2Title: "NOTA",
        detail2Text: "If you don't prefer any candidate, you can press the NOTA (None of the Above) button at the bottom.",
        videoId: "" 
    }
];

const faqDatabase = [
    {
        keywords: ["register", "registration", "form 6", "voter id", "epic"],
        answer: "To register as a new voter, you need to fill out Form 6. You can do this online at voters.eci.gov.in or through the Voter Helpline App. Once approved, you will receive your EPIC (Voter ID) card. You will need proof of age and residence."
    },
    {
        keywords: ["evm", "machine", "how to vote", "button"],
        answer: "At the polling booth, you will vote using an Electronic Voting Machine (EVM). Simply press the blue button next to the name and symbol of the candidate you wish to vote for. A red light will glow, and you will hear a beep sound confirming your vote."
    },
    {
        keywords: ["vvpat", "slip", "verify"],
        answer: "VVPAT stands for Voter Verifiable Paper Audit Trail. After pressing the button on the EVM, look through the glass window of the VVPAT machine. A printed paper slip showing the serial number, name, and symbol of your chosen candidate will be visible for 7 seconds."
    },
    {
        keywords: ["nota", "none", "don't like"],
        answer: "NOTA stands for 'None of the Above'. It is the last button on the EVM. If you feel none of the candidates in your constituency are suitable, you can press the NOTA button to register your dissatisfaction."
    },
    {
        keywords: ["list", "roll", "electoral roll", "name missing"],
        answer: "You can only vote if your name is in the Electoral Roll of your constituency. You can check this by going to electoralsearch.eci.gov.in and searching using your EPIC (Voter ID) number, or your personal details."
    },
    {
        keywords: ["hello", "hi", "hey", "help"],
        answer: "Namaste! I'm your Indian Election Assistant. I can help you understand how to register for a Voter ID, check your name in the electoral roll, or how to use an EVM. What would you like to know?"
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { electionSteps, faqDatabase };
}
