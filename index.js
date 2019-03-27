const { google: googleApi } = require('googleapis')
const customsearch = googleApi.customsearch('v1')
const { credential: googleCreadentials } = require('./credentials/google-search.js')

async function search(query) {
    const response = await customsearch.cse.list({
        auth: googleCreadentials.googleKey,
        cx: googleCreadentials.googleCx,
        q: query,
        fileType: 'pdf',
        num: 5
    })

    const pdfLinks = response.data.items.map((item) => {
        return item.link
    })

    return pdfLinks
}

async function start() {
    const pdfs = await search('Java Script');
    console.log(pdfs);
}

start();