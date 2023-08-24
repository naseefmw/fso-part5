describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Naseef',
      username: 'nf123',
      password: 'nfpw123',
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
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

      cy.contains('A new blog')
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
        cy.contains('another blog cypress').parent().contains('view').click()
        cy.contains('likes 0')
        cy.contains('another blog cypress').parent().contains('like').click()
        cy.contains('likes 1')
      })
    })
  })
})
