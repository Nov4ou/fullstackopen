const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

router.post('/reset', async (request, respones) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  respones.status(204).end()
})

module.exports = router