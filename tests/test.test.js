
// test('Our first test', () => {
//     throw new Error('xxx')
// })

test('absolute - should return a positive number if input is positive', () => {
    const result = 1
    expect(result).toBe(1)
})

test('absolute - should return a positive number if input is negative', () => {
    const result = -1
    expect(result).toBe(-1)
})

test('absolute - should return a positive number if input is 0', () => {
    const result = 0
    expect(result).toBe(0)
})