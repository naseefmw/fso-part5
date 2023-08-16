import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [title, setNewTitle] = useState('')
  const [author, setNewAuthor] = useState('')
  const [url, setNewUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (event) => {
    window.localStorage.clear()
    setUser(null)
  }
  const handleTitle = (event) => {
    setNewTitle(event.target.value)
  }
  const handleAuthor = (event) => {
    setNewAuthor(event.target.value)
  }
  const handleUrl = (event) => {
    setNewUrl(event.target.value)
  }

  const addBlog = () => {
    const blog = {
      title: title,
      author: author,
      url: url,
    }
    console.log(blog)
    blogService.create(blog).then()
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h1>log in to application</h1>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
  const blogList = () => (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      <form onSubmit={addBlog}>
        <h2>create new</h2>
        <p>
          title:
          <input value={title} onChange={handleTitle} />
        </p>
        <p>
          author:
          <input value={author} onChange={handleAuthor} />
        </p>
        <p>
          url:
          <input value={url} onChange={handleUrl} />
        </p>
        <button type="submit">create</button>
      </form>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  )

  return <div>{user === null ? loginForm() : blogList()}</div>
}

export default App
