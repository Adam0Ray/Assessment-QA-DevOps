const {shuffleArray} = require('./utils')

describe('shuffleArray should', () => {
    test('shuffleArray returns a value in array', () => expect(shuffleArray(['hello','hi'])).toContain('hi'))

    test('shuffleArray returns a shuffled array', () => expect(shuffleArray(['hello','hi','a','b','c'])).not.toBe(['hello','hi','a','b','c']))

})