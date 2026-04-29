const { findFaqResponse, debounce } = require('./utils');
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

    it('should return null for missing inputs', () => {
        expect(findFaqResponse('', faqDatabase)).toBeNull();
        expect(findFaqResponse(null, faqDatabase)).toBeNull();
        expect(findFaqResponse(123, faqDatabase)).toBeNull();
    });

    it('should return null for empty database lookups', () => {
        expect(findFaqResponse('evm', [])).toBeNull();
    });

    it('should return cached response on identical subsequent query', () => {
        const first = findFaqResponse('What is an EVM?', faqDatabase);
        const second = findFaqResponse('What is an EVM?', faqDatabase);
        expect(first).toBe(second);
        expect(second).toContain('Electronic Voting Machine');
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

describe('Utils - Debounce', () => {
    jest.useFakeTimers();

    it('should debounce function execution', () => {
        const mockFunc = jest.fn();
        const debouncedFunc = debounce(mockFunc, 100);

        debouncedFunc('test');
        debouncedFunc('test');
        debouncedFunc('test');

        expect(mockFunc).not.toHaveBeenCalled();

        jest.advanceTimersByTime(50);
        expect(mockFunc).not.toHaveBeenCalled();

        jest.advanceTimersByTime(50);
        expect(mockFunc).toHaveBeenCalledTimes(1);
        expect(mockFunc).toHaveBeenCalledWith('test');
    });
});
