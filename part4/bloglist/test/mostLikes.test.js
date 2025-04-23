const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const blogs = require('./blogs')

describe('mostLikes', () => {
  test('returns the author with most likes', () => {
    const result = listHelper.mostLikes(blogs)
    const expected = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }
    assert.deepStrictEqual(result, expected)
  })

  test('returns null if no blogs', () => {
    const blogs = []
    const result = listHelper.mostLikes(blogs)
    assert.strictEqual(result, null)
  })
})