function findFaqResponse(input, database) {
    const lowerInput = input.toLowerCase();
    const match = database.find(faq => 
        faq.keywords.some(kw => lowerInput.includes(kw.toLowerCase()))
    );
    return match ? match.answer : null;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { findFaqResponse };
}
