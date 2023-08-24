describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Naseef',
      username: 'nf123',
      password: 'nfpw123',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    const user2 = {
      name: 'Stranger',
      username: 'str1',
      password: 'str123',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
    cy.visit('')
  })

  it('Login form is shown', function () {
    cy.contains('log in to application')
    cy.contains('login')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('nf123')
      cy.get('#password').type('nfpw123')
      cy.get('#login-button').click()
      cy.contains('Naseef logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('nf123')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()
      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'Naseef logged in')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'nf123', password: 'nfpw123' })
    })

    it('A blog can be created', function () {
      cy.contains('new blog').click()
      cy.get('#blog-title').type('A new blog')
      cy.get('#blog-author').type('blogger')
      cy.get('#blog-url').type('www.blog.com')
      cy.get('#blog-add').click()

      cy.contains('A new blog blogger')
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'another blog cypress',
          author: 'me',
          url: 'www.blog.com',
        })
      })

      it('user can like a blog', function () {
        cy.contains('view').click()
        cy.contains('likes 0')
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('user who created the blog can delete it', function () {
        cy.contains('another blog cypress').contains('view').click()
        cy.contains('another blog cypress').contains('remove').click()

        cy.get('html').should('not.contain', 'another blog cypress')
      })
    })

    describe('when multiple blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'blog2',
          author: 'me',
          url: 'www.blog.com',
          likes: 2,
        })
        cy.createBlog({
          title: 'blog3',
          author: 'me',
          url: 'www.blog.com',
          likes: 3,
        })
        cy.createBlog({
          title: 'blog1',
          author: 'me',
          url: 'www.blog.com',
          likes: 1,
        })
      })

      it('blogs are sorted by likes', function () {
        cy.get('.blog').eq(0).should('contain', 'blog3')
        cy.get('.blog').eq(1).should('contain', 'blog2')
        cy.get('.blog').eq(2).should('contain', 'blog1')
      })
    })
  })

  describe('When there are multiple users', function () {
    this.beforeEach(function () {
      cy.login({ username: 'str1', password: 'str123' })
      cy.createBlog({
        title: 'blog by other user',
        author: 'notme',
        url: 'www.blog.com',
      })
      cy.contains('logout').click()
      cy.login({ username: 'nf123', password: 'nfpw123' })
      cy.createBlog({
        title: 'another blog cypress',
        author: 'me',
        url: 'www.blog.com',
      })
    })

    it('user cannot see remove button on other users blog', function () {
      cy.contains('blog by other user').contains('view').click()
      cy.should('not.contain', 'remove')
    })

    it('user can see remove button on their blogs', function () {
      cy.contains('another blog cypress').contains('view').click()
      cy.contains('remove')
    })
  })
})
