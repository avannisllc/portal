/// <reference types="cypress" />

context('Actions', () => {


  // https://on.cypress.io/interacting-with-elements

   it('navigate to login and attempt login', () => {
      cy.visit('http://portal.avannis.com/')
      // https://on.cypress.io/type
      // cy.get('.login').click()
      // .type('fake@email.com').should('have.value', 'fake@email.com')
      cy.get('input[name="USERNAME"]')
         .type('cypress.avannis')
      
      cy.get('input[name="password"]')
         .type('avannis@test101')
      
      cy.contains('Sign in').click()

      cy.contains('Unsubscribe')
      // // .type() with special character sequences
      // .type('{leftarrow}{rightarrow}{uparrow}{downarrow}')
      // .type('{del}{selectall}{backspace}')

      // // .type() with key modifiers
      // .type('{alt}{option}') //these are equivalent
      // .type('{ctrl}{control}') //these are equivalent
      // .type('{meta}{command}{cmd}') //these are equivalent
      // .type('{shift}')

      // // Delay each keypress by 0.1 sec
      // .type('slow.typing@email.com', { delay: 100 })
      // .should('have.value', 'slow.typing@email.com')

      // cy.get('.action-disabled')
      // // Ignore error checking prior to type
      // // like whether the input is visible or disabled
      // .type('disabled error checking', { force: true })
      // .should('have.value', 'disabled error checking')
   })
})
