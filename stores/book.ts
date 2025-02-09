import {defineStore} from "pinia";

export const useBookStore = defineStore('bookStore', {
    state: () => ({
        quote: '',
        dominantColor: '',
        defaultDominantColor: '#6c4a4a',
        defaultQuote: 'Os livros são sonhos que seguramos em nossas mãos.'
    }),
    actions: {
    }
})