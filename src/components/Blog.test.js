import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import NewBlog from './NewBlog'

describe('<Blog />', () => {
  const blog = {
    title: 'A blog',
    author: 'Blogger',
    url: 'wwww',
    likes: 0,
  }

  test('renders blog title and author', () => {
    const { container } = render(<Blog blog={blog} />)
    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent('A blog Blogger')
  })

  test('at start url and likes are not rendered', () => {
    const { container } = render(<Blog blog={blog} />)
    const div = container.querySelector('.togglableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', async () => {
    const { container } = render(<Blog blog={blog} />)
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const div = container.querySelector('.togglableContent')
    expect(div).not.toHaveStyle('display: none')
  })

  test('clicking the button twice calls event handler twice', async () => {
    const mockHandler = jest.fn()
    render(<Blog blog={blog} updateBlog={mockHandler} />)
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })

  test('clicking the button twice calls event handler twice', async () => {
    const mockHandler = jest.fn()
    render(<Blog blog={blog} updateBlog={mockHandler} />)
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })

  test('<NewBlog /> calls on event handler with the right details', async () => {
    const createBlog = jest.fn()
    const user = userEvent.setup()
    render(<NewBlog createBlog={createBlog} />)

    const inputTitle = screen.getByPlaceholderText('title')
    const inputAuthor = screen.getByPlaceholderText('author')
    const inputUrl = screen.getByPlaceholderText('url')

    const sendButton = screen.getByText('create')

    await user.type(inputTitle, 'blog title')
    await user.type(inputAuthor, 'blogger')
    await user.type(inputUrl, 'www.blog.com')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('blog title')
    expect(createBlog.mock.calls[0][0].author).toBe('blogger')
    expect(createBlog.mock.calls[0][0].url).toBe('www.blog.com')
  })
})
