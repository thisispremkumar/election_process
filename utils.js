"use strict";

/**
 * Cache object for storing previous FAQ responses.
 * @type {Object<string, string|null>}
 */
const faqCache = {};

/**
 * Finds a response from the FAQ database based on input keywords, utilizing an in-memory cache to optimize repetitive searches.
 * @param {string} input - The user's input string to search for.
 * @param {Array<{keywords: string[], answer: string}>} database - The FAQ database containing keywords and answers.
 * @returns {string|null} The matching answer or null if no match is found.
 */
function findFaqResponse(input, database) {
    if (!input || typeof input !== 'string') return null;
    
    const lowerInput = input.toLowerCase();
    
    // Return cached result if available
    if (faqCache[lowerInput] !== undefined) {
        return faqCache[lowerInput];
    }

    const match = database.find(faq => 
        faq.keywords.some(kw => lowerInput.includes(kw.toLowerCase()))
    );
    
    const result = match ? match.answer : null;
    faqCache[lowerInput] = result; // Cache the result
    return result;
}

/**
 * Creates a debounced function that delays invoking the provided function until after wait milliseconds have elapsed.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @returns {Function} The newly created debounced function.
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { findFaqResponse, debounce };
}
