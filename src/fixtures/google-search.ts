import { SR_RESULT_ROW } from "./google-constants"

export interface GoogleSearchRow {
    title: string
    link: RegExp
}

export class GoogleSearch {

    open() {
        cy.visit('/')
    }

    enterSearchQuery(query: string) {
        cy.get('input[type="text"]').type(query)
    }

    search() {
        cy.get('input[name="btnK"]').first().click()
    }

    hasSearchRow(expectedRow: GoogleSearchRow) {
        cy.get(SR_RESULT_ROW).first().within( () => {
            cy.get('h3').should('contain.text', expectedRow.title)
            cy.get(SR_RESULT_ROW).get('a:first').should('have.attr', 'href').and('match', expectedRow.link)
        })
    }
}