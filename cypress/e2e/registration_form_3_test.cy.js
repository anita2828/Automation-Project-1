beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

/*
BONUS TASK: add visual tests for registration form 3
Task list:
Create test suite for visual tests for registration form 3 (describe block)
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns:
        * list of cities changes depending on the choice of country
        * if city is already chosen and country is updated, then city choice should be removed
    * checkboxes, their content and links
    * email format
 */
describe('1. Visual tests for registration form 3', () => {
    it('Check radio buttons and its content', () => {
        cy.get('input[type="radio"]').should('have.length', 4)
        cy.get('input[type="radio"]').next().eq(0).should('have.text','Daily').should('not.be.checked')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','Weekly').should('not.be.checked')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','Monthly').should('not.be.checked')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','Never').should('not.be.checked')
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(3).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')

    })

    it('Check dropdown and dependencies between 2 dropdowns', () => {
    // Dropdown and dependencies between 2 dropdowns:
    // list of cities changes depending on the choice of country
        cy.get('#country').children().should('have.length', 4)
        cy.get('#country').find('option').then(options => {
            const actual = [...options].map(option => option.textContent.trim())
            expect(actual).to.deep.eq(['', 'Spain', 'Estonia', 'Austria'])
        })
        //Select a country to test availability of the cities
        cy.get('#country').select('Spain')
        cy.get('#city').should('be.enabled') // city list gets enabled
        cy.get('#city').find('option').then(options => {
            const actual = [...options].map(option => option.textContent.trim())
            expect(actual).to.deep.eq(['', 'Malaga', 'Madrid', 'Valencia', 'Corralejo'])
        })
        cy.get('#city').select('Valencia')
        //if city is already chosen and country is updated, then city choice changes (is not removed)
        cy.get('#country').select('Estonia')
        cy.get('#city').should('be.enabled')
    })

    it('Check checkboxes, their content and links', () => {
        cy.get('input[type="checkbox"]').should('have.length', 2)
        cy.get('input[type="checkbox"]').parent().should('contain', 'Accept our privacy policy')
        cy.get('input[type="checkbox"]').parent().get('a[href]').should('contain', 'Accept our cookie policy')
        //check both checkboxes at once
        cy.get('[type="checkbox"]').check()
        // check the link content and click it
        cy.get('button a').should('have.attr', 'href', 'cookiePolicy.html').click()
        // Check that opened URL is correct
        cy.url().should('contain', '/cookiePolicy.html')
        cy.go('back').url().should('contain', '/registration_form_3.html')
        

    })
      
    it('Check email format', () => {
        // check if email has valid format and is required
        cy.get('input[name="email"]').should('have.class', 'ng-valid-email').should('have.attr', 'required')
        // add valid email
        cy.get('input[name="email"]').type('valid@email.com')
        //clear valid email and add invalid email
        cy.get('input[name="email"]').clear().type('invalid')
        //error message
        cy.get('#emailAlert').should('contain', 'Invalid email address')
    })
})

/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + corresponding assertions
    * only mandatory fields are filled in + corresponding assertions
    * mandatory fields are absent + corresponding assertions (try using function)
    * add file functionlity(google yourself for solution!)
 */

describe('2. Functional tests for registration form 3', () => {
    it('Check the submission when all fields are filled', () => {
        cy.get('#name').type('Anita')
        cy.get('input[name="email"]').type('valid@email.com')
        cy.get('#country').select('Austria')
        cy.get('#city').children().should('have.length', 4)
        cy.get('#city').select('Salzburg')
        // Date picker
        cy.contains('Date of registration').next().type('2024-01-05').should('have.value', '2024-01-05')
        cy.get('input[type="radio"]').eq(2).check().should('be.checked')
        cy.get('#birthday').first().type('2000-01-05').should('have.value', '2000-01-05')
        cy.get('[type="checkbox"]').check() 
        // Call the postYourAdd function to have the Successful registration message
        //cy.window().then(window => {
        //    window.postYourAdd()
        //})
        //cy.get('#successFrame').should('exist').invoke('text').as('successMessage')
        //cy.get('@successMessage').should('contain', 'Successful registration')
        //Click on Submit and check the url on next page
        cy.get('input[type="submit"]').should('be.visible').click()
        cy.get('h1').should('have.text', 'Submission received')
        cy.url().should('contain', '/cypress/fixtures/upload_file.html?')
        //get back to your Registration form 3 page
        cy.go('back').url().should('contain', '/registration_form_3.html')

    })
    it('Check submission for mandatory fields using Function', () => {
        inputMandatoryData()
        //Click on Submit and check the url on next page
        cy.get('input[type="submit"]').should('be.visible').click()
        cy.get('h1').should('have.text', 'Submission received')
    })
    it('Check submission for mandatory email missing using Function', () => {
        inputMandatoryData()
        //clear email
        cy.get('input[name="email"]').clear()
        cy.get('#emailAlert').should('contain', 'Email is required')
        cy.get('input[type="submit"]').should('be.disabled')
    })
    it('Check submission for "add file" functionality', () => {
        inputMandatoryData()
        //load a file
        cy.get('[type="file"]').selectFile('cypress/screenshots/Cars drop-down.png', {force: true})
        cy.get('input[type="submit"]').should('be.visible').click()
        cy.get('h1').should('have.text', 'Submission received')

    })
})

//Function for mandatory fields
    function inputMandatoryData() {   
        cy.get('#name').type('Anita')
        cy.get('input[name="email"]').type('valid@email.com')
        cy.get('#country').select('Austria')
        cy.get('#city').select('Salzburg')
        cy.get('[type="checkbox"]').eq(0).check()
}
