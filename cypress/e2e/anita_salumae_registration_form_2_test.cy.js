beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_2.html')
})

/*
Assignement 4: add content to the following tests
*/

describe('Section 1: Functional tests', () => {
    it('User can use only same both first and validation passwords', ()=>{
        // Add test steps for filling in only mandatory fields
        cy.get('#username').type('AS')
        cy.get('#email').type('valid@email.com')
        cy.get('input[name="name"]').type('Ani')
        cy.get('#lastName').type('Ta')
        cy.get('[data-testid="phoneNumberTestId"]').type('567567567')
        cy.get('#password').type('Tervist')
        cy.get('#confirm').type('Tervist123')
        //clicking somewhere after passwords' input:
        cy.get('h2').contains('Password').click() 
        cy.get('.submit_button').should('not.be.enabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('.error_message').should('be.visible').should('contain', 'Passwords do not match!')
        // Change the test, so the passwords would match:
        cy.get('#confirm').clear().type('Tervist')
        cy.get('h2').contains('Password').click()
        cy.get('#password_error_message').should('not.be.visible')
        cy.get('.submit_button').should('be.enabled')
    })
    
    it('User can submit form with all fields added', ()=>{
        // Add test steps for filling in ALL fields:
        cy.get('#username').type('AS')
        cy.get('#email').type('anjuuta@gmail.com')
        cy.get('input[name="name"]').type('Anita')
        cy.get('#lastName').type('Salumae')
        cy.get('[data-testid="phoneNumberTestId"]').type('567567567')
        cy.get('input[type="radio"]').check('JavaScript') 
        //checkbox: check 2):
        cy.get('input[type="checkbox"]').check(['Bike', 'Car']).should('be.checked') 
        cy.get ('#cars').select('audi')
        cy.get('#animal').select('hippo')
        cy.get('#password').type('Tervist')
        cy.get('#confirm').type('Tervist')
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.enabled').click()
        cy.get('#success_message').should('be.visible').should('contain', 'User successfully submitted registration')
    })

    it('User can submit form with valid data and only mandatory fields added', ()=>{
        // Add test steps for filling in ONLY mandatory fields with function:
        inputMandatoryData()
        cy.get('.submit_button').should('be.enabled').click()
        cy.get('#success_message').should('be.visible').should('contain', 'User successfully submitted registration')
    })

    it('User cannot submit form with a mandatory email field missing', ()=>{    
        inputMandatoryData()
        // Scroll back to email input field to leave it empty
        cy.get('#email').scrollIntoView()
        cy.get('#email').clear()
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.disabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('#input_error_message').should('be.visible').should('contain', 'Mandatory input field is not valid or empty!')
        // Assert that email has tooltip with error message:
        cy.get('#email').should('have.attr', 'title').should('contain', 'Input field')
       
})

/*
Assignement 5: create more visual tests
*/

describe('Section 2: Visual tests', () => {
    it('Check that logo is correct and has correct size', () => {
        cy.log('Will check logo source and size')
        cy.get('img').should('have.attr', 'src').should('include', 'cerebrum_hub_logo')
        // get element and check its parameter height:
        cy.get('img').invoke('height').should('be.lessThan', 178)
            .and('be.greaterThan', 100)   
    })

    it('My test for second picture', () => {
        cy.get('[data-cy="cypress_logo"]').should('have.attr', 'src').should('include', 'cypress_logo.png')
        //check the height: 87 < height < 116
        cy.get('[data-cy="cypress_logo"]').invoke('height').should('be.lessThan', 116)
            .and('be.greaterThan', 87)
        //check the width: 115 < width < 117
        cy.get('[data-cy="cypress_logo"]').invoke('width').should('be.lessThan', 117)
            .and('be.greaterThan', 115)
    })

    it('Check navigation part', () => {
        cy.get('nav').children().should('have.length', 2)
        // Get navigation element, find siblings that contains h1 and check if it has Registration form in string
        cy.get('nav').siblings('h1').should('have.text', 'Registration form number 2')
        // Get navigation element, find id, check the link content and click it
        cy.get('nav').children().eq(0).should('be.visible')
            .and('have.attr', 'href', 'registration_form_1.html')
            .click()
        // Check that currently opened URL is correct
        cy.url().should('contain', '/registration_form_1.html')
        // Go back to previous page
        cy.go('back')
        cy.log('Back again in registration form 2')
    })

    it('Check the link to the Registration form 3', () => {
        cy.get('nav').siblings('h1').should('have.text', 'Registration form number 2')
        cy.get('nav').children().eq(1).should('be.visible')
            .and('have.attr', 'href', 'registration_form_3.html')
            .click()
        cy.url().should('contain', '/registration_form_3.html')
        cy.go('back')
        cy.log('Back again in registration form 2')
    })
    
    it('Check that radio button list is correct', () => {
        // Array of found elements with given selector has 4 elements in total:
        cy.get('input[type="radio"]').should('have.length', 4)
        // Verify labels of the radio buttons:
        cy.get('input[type="radio"]').next().eq(0).should('have.text','HTML')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','CSS')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','JavaScript')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','PHP')
        //Verify default state of radio buttons:
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
        cy.get('input[type="radio"]').eq(1).should('not.be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
        cy.get('input[type="radio"]').eq(3).should('not.be.checked')
        // Selecting one will remove selection from the other radio button:
        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    })

    it('Check that checkboxes list is correct', () => {
        // Array of found elements with given selector has 3 elements in total:   
        cy.get('[class="checkbox vehicles"]').should('have.length', 3)
        // Verify labels of the checkboxes:
        cy.get('[class="checkbox vehicles"]').next().eq(0).should('have.text','I have a bike')
        cy.get('[class="checkbox vehicles"]').next().eq(1).should('have.text','I have a car')
        cy.get('[class="checkbox vehicles"]').next().eq(2).should('have.text','I have a boat')
        // Verify default state of checkboxes - unchecked:
        cy.get('[class="checkbox vehicles"]').eq(0).should('not.be.checked')
        cy.get('[class="checkbox vehicles"]').eq(1).should('not.be.checked')
        cy.get('[class="checkbox vehicles"]').eq(2).should('not.be.checked')
        // Selecting checkboxes - try marking the first checkbox as checked and assert its state:
        cy.get('[class="checkbox vehicles"]').eq(0).check().should('be.checked')
        cy.get('[class="checkbox vehicles"]').eq(1).check().should('be.checked')
        //first checkbox is still checked:
        cy.get('[class="checkbox vehicles"]').eq(0).should('be.checked')
    })

    it('Car dropdown is correct', () => {
        // Here is just an example how to explicitely create screenshot from the code
        // Select second element and create screenshot for this area or full page
        //cy.get('#cars').select(1).screenshot('Cars drop-down')
        //cy.screenshot('Full page screenshot')

        // Here are given different solutions how to get the length of array of elements in Cars dropdown:
        cy.get('#cars').children().should('have.length', 4)
        cy.get('#cars').find('option').should('have.length', 4)
        
        // Check  that first element in the dropdown has text Volvo:
        cy.get('#cars').find('option').eq(0).should('have.text', 'Volvo')
        
        // Advanced level how to check the content of the Cars dropdown:
        cy.get('#cars').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['volvo', 'saab', 'opel', 'audi'])
        })
    })

    it('Animal dropdown is correct', () => {
        cy.get('#animal').children().should('have.length', 6)
        // Verify all values in the dropdown (mouse => Horse (it is a bug))
        cy.get('#animal').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['dog', 'cat', 'snake', 'hippo', 'cow', 'mouse'])
        })
    })
})

function inputMandatoryData() {
    cy.get('input[data-testid="user"]').type('username')
    cy.get('#email').type('validemail@yeap.com')
    cy.get('[data-cy="name"]').type('John')
    cy.get('#lastName').type('Doe')
    cy.get('[data-testid="phoneNumberTestId"]').type('10203040')
    cy.get('#password').type('MyPass')
    cy.get('#confirm').type('MyPass')
    cy.get('h2').contains('Password').click()
}
})