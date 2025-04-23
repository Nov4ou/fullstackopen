const blog = require("../models/blog")
const blogs = require("../test/blogs")
const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0)
    return null

  return blogs.reduce((max, blog) => {
    return blog.likes > max.likes ? blog : max
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0)
    return null

  const authorCount = _.countBy(blogs, 'author')

  const mostBlogsAuthor = _.maxBy(Object.entries(authorCount), ([author, count]) => count)

  return {
    author: mostBlogsAuthor[0],
    blogs: mostBlogsAuthor[1]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0)
    return null

  const authorLikes = _.mapValues(_.groupBy(blogs, 'author'), (blogs) => {
    return _.sumBy(blogs, 'likes')
  })

  const mostLikesAuthor = _.maxBy(Object.entries(authorLikes), ([author, likes]) => likes)

  return {
    author: mostLikesAuthor[0],
    likes: mostLikesAuthor[1]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}