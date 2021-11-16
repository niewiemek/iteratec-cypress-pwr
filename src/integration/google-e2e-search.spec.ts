import { curry, isArguments } from "cypress/types/lodash"
import { COOKIE_CONSENT, ID_BUTTON_COOKIE_ACCEPT, ID_COOKIE_POPUP } from "src/fixtures/google-constants"
import { GoogleSearch } from "src/fixtures/google-search"

describe('Google Search', () => {

    const searchPage = new GoogleSearch()

    it('shows a cookie popup at first visit', () => {

        cy.visit('/')

        cy.get(ID_COOKIE_POPUP).should('be.visible')
        cy.getCookie(COOKIE_CONSENT).should('have.property', 'value').and('match', /PENDING.*/)

        cy.get(ID_BUTTON_COOKIE_ACCEPT).click()
        cy.getCookie(COOKIE_CONSENT).should('have.property', 'value').and('match', /YES.*/)
    })

    describe('cookies are accepted', () => {

        beforeEach(() => {
            cy.setCookie(COOKIE_CONSENT, 'YES+shp.gws-20211109-0-RC2.pl+FX+634')
        })

        it('contains Zero Emission information', () => {

            cy.visit('/')
            cy.get('a[href*="sustainability.google"').should('have.attr', 'href').and('match', /sustainability\.google/)
        })

        it('executes search queries', () => {

            searchPage.open()
            searchPage.enterSearchQuery('iteratec')
            searchPage.search()
            searchPage.hasSearchRow({ title: 'iteratec: Innowacyjna firma tworząca oprogramowanie', link: /www\.iteratec\.com.*pl/})            
        })

        it('mocks query execution', () => {

            // Given
            cy.intercept('GET', '/complete/search*', req => {
                req.reply({
                    statusCode: 200,
                    fixture: 'search-iteratec.json'
                })
            })
            cy.intercept('GET', '/complete/search?q=iteratec*').as('iteratec-query')
            
            // When
            searchPage.open()
            searchPage.enterSearchQuery('iteratec')

            // Then
            cy.wait('@iteratec-query')

            cy.get('ul[role="listbox"] > li')
            .should('have.length', 5)
        })
    })
})
