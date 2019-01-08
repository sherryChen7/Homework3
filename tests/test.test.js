
// test('Our first test', () => {
//     throw new Error('xxx')
// })

describe('absolute', () => {
    it('should return a positive number if input is positive', () => {
        const result = 1
        expect(result).toBe(1)
    })

    it('should return a positive number if input is negative', () => {
        const result = -1
        expect(result).toBe(-1)
    })

    it('should return a positive number if input is 0', () => {
        const result = 0
        expect(result).toBe(0)
    })
})

describe('greet', () => {
    it('string', () => {
        const result = 'ABCD'
        expect(result).toMatch(/ABC/)
        expect(result).toContain('ABC')
    })
})

describe('getCurrencies', () => {
    it('should supported', () => {
        const result = ['A', 'B']

        expect(result[0]).toBe('A')
    })
})

AAA {
    'id' = ''
}

describe('getObjects', () => {
    it('should Object', () => {
        const result = new Object;

        expect(result[0]).toBe('A')
        expect(result[0]).toBe('A')

    })
})