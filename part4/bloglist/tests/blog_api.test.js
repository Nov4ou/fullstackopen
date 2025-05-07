const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')

const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('Blog API tests', () => {
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

  test('likes property defaults to 0 if not provided', async () => {
    const newBlog = {
      title: 'No Likes Blog',
      author: 'Xinghang Chen',
      url: 'https://www.nov4ou.top/posts/arp-spoofing-experiment/',
      // likes is omitted to test the default value
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)

    const allBlogs = await api.get('/api/blogs')
    assert.strictEqual(allBlogs.body.length, helper.initialblogs.length + 1)
  })

  test('creating a blog with missing title or url returns 400', async () => {
    const newBlogMissingTitle = {
      author: 'Xinghang Chen',
      url: 'https://nov4ou.github.io',
    }

    const newBlogMissingUrl = {
      title: 'Blog without URL',
      author: 'Xinghang Chen',
    }

    await api
      .post('/api/blogs')
      .send(newBlogMissingTitle)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/blogs')
      .send(newBlogMissingUrl)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('delete a blog post', async () => {
    const initialBlog = {
      title: 'Sample Blog',
      author: 'Xinghang Chen',
      url: 'https://example.com',
      likes: 0
    }

    const createdBlog = await api
      .post('/api/blogs')
      .send(initialBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    await api
      .delete(`/api/blogs/${createdBlog.body.id}`)
      .expect(204)

    await api
      .get(`/api/blogs/${createdBlog.body.id}`)
      .expect(404)
  })

  test('modify a blog post', async () => {
    const blogToModify = await Blog.findOne({})

    const updatedBlog = {
      likes: 999
    }

    const response = await api
      .put(`/api/blogs/${blogToModify.id}`)
      .send(updatedBlog)
      .expect(200)

    assert.strictEqual(response.body.likes, 999)

    const modifiedBlog = await Blog.findById(blogToModify.id)
    assert.strictEqual(modifiedBlog.likes, 999)
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'name',
      password: 'passwd'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.match(result.body.error, /username or password missing/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'username',
      name: 'name'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.match(result.body.error, /username or password missing/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if username is shorter than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'us',
      name: 'name',
      password: 'passwd'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.match(result.body.error, /username and password must be at least 3 characters long/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if username is shorter than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'username',
      name: 'name',
      password: 'pa'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.match(result.body.error, /username and password must be at least 3 characters long/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if username already exists', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'root',
      password: 'sekret'
    }

    const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    assert.match(result.body.error, /expected `username` to be unique/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})