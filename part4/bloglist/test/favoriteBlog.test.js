const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
// const blogs = require('./blogs')

describe('favorite blog', () => {
  test('returns the blog with most likes', () => {
    const blogs = [
      { title: "Blog 1", likes: 5 },
      { title: "Blog 2", likes: 10 },
      { title: "Blog 3", likes: 15 }
    ]
    const result = listHelper.favoriteBlog(blogs)
    const expected = { title: "Blog 3", likes: 15 }
    assert.deepStrictEqual(result, expected)
  })

  test('returns null if no blogs', () => {
    const blogs = []
    const result = listHelper.favoriteBlog(blogs)
    assert.strictEqual(result, null)
  })

  test('returns any of the blogs if multiple have the most likes', () => {
    const blogs = [
      { title: "Blog 1", likes: 10 },
      { title: "Blog 2", likes: 10 },
      { title: "Blog 3", likes: 5 }
    ] 
    const result = listHelper.favoriteBlog(blogs)
    const expected = { title: "Blog 1", likes: 10 }
    assert.deepStrictEqual(result, expected)
  })

})
