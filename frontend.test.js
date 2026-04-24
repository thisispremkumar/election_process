const { findFaqResponse } = require('./utils');
const { faqDatabase } = require('./data');

describe('Frontend Logic - FAQ Matching', () => {
    
    it('should find response for keyword "register"', () => {
        const response = findFaqResponse('How do I register?', faqDatabase);
        expect(response).toContain('Form 6');
    });

    it('should find response for keyword "evm"', () => {
        const response = findFaqResponse('What is an EVM?', faqDatabase);
        expect(response).toContain('Electronic Voting Machine');
    });

    it('should find response for keyword "nota"', () => {
        const response = findFaqResponse('What is NOTA?', faqDatabase);
        expect(response).toContain('None of the Above');
    });

    it('should return null for unrelated questions', () => {
        const response = findFaqResponse('What is the weather?', faqDatabase);
        expect(response).toBeNull();
    });

    it('should be case insensitive', () => {
        const response = findFaqResponse('TELL ME ABOUT EPIC', faqDatabase);
        expect(response).not.toBeNull();
        expect(response).toContain('EPIC');
    });

    it('should find response for partial keyword matches', () => {
        const response = findFaqResponse('registration process', faqDatabase);
        expect(response).toContain('Form 6');
    });
});
