import Togglable from './Togglable'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const addLikes = (event) => {
    event.preventDefault()
    updateBlog({
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    })
  }

  const handleDelete = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle} className="blog">
      {blog.title} {blog.author}
      <Togglable buttonLabel="view" cancelLabel="hide">
        <p id="url">{blog.url}</p>
        <p id="likes">
          likes {blog.likes} <button onClick={addLikes}>like</button>
        </p>
        <p>{blog.user ? blog.user.name : null}</p>
        {blog.user ? (
          blog.user.username === user ? (
            <button onClick={handleDelete}>remove</button>
          ) : null
        ) : null}
      </Togglable>
    </div>
  )
}

export default Blog
