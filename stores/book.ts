import {defineStore} from "pinia";

export const useBookStore = defineStore('bookStore', {
    state: () => ({
        quote: '',
        defaultQuote: 'Os livros são sonhos que seguramos em nossas mãos.'
    }),
    actions: {
        async resetQuoteToDefault() {
            this.quote = this.defaultQuote
        },
        async setHeaderQuote(quote?: string) {
            if (quote) {
                this.quote = quote
            } else {
                this.quote = this.defaultQuote
            }
        }
    }
})