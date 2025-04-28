const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { log } = require('console')

const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialblogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    assert.ok(blog.hasOwnProperty('id'))
  })
})

test('a vaild blog can be added', async () => {
  const newBlog = {
    title: 'CASPP',
    author: 'Xinghang Chen',
    url: 'https://nov4ou.github.io',
    likes: 777,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const title = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, helper.initialblogs.length + 1)
  assert(title.includes('CASPP'))
})

after(async () => {
  await mongoose.connection.close()
})