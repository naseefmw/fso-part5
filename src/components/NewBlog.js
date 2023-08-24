import { useState } from 'react'

const NewBlog = ({ createBlog }) => {
  const [title, setNewTitle] = useState('')
  const [author, setNewAuthor] = useState('')
  const [url, setNewUrl] = useState('')

  const addblog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <form onSubmit={addblog}>
      <h2>create new</h2>
      <p>
        title:
        <input
          placeholder="title"
          id="blog-title"
          value={title}
          onChange={(event) => setNewTitle(event.target.value)}
        />
      </p>
      <p>
        author:
        <input
          id="blog-author"
          placeholder="author"
          value={author}
          onChange={(event) => setNewAuthor(event.target.value)}
        />
      </p>
      <p>
        url:
        <input
          id="blog-url"
          placeholder="url"
          value={url}
          onChange={(event) => setNewUrl(event.target.value)}
        />
      </p>
      <button id="blog-add" type="submit">
        create
      </button>
    </form>
  )
}

export default NewBlog
