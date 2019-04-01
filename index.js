const { google: googleApi } = require('googleapis');
const customsearch = googleApi.customsearch('v1');
const { credential: googleCreadentials } = require('./credentials/google-search.js');
const downloadPdf = require('./src/download-pdf');
const readlineSync = require('readline-sync');

// Search pdf link in Google
async function searchPdfLinks(query, numLinks) {
    const response = await customsearch.cse.list({
        auth: googleCreadentials.googleKey,
        cx: googleCreadentials.googleCx,
        q: query,
        fileType: 'pdf',
        num: numLinks
    });

    const pdfLinks = response.data.items.map((item) => {
        return item.link;
    });

    return pdfLinks;
};

// Download pdf from pdf link
async function doPdfDownload(link) {
    const options = {
        directory: "./pdfs/",
        filename: ""
    };

    downloadPdf(link, options, function (resultOfDownload) {
        console.log([resultOfDownload, link]);
    });
};

async function start() {
    let query = readlineSync.question('Name of pdf to search: ');
    let qt = readlineSync.question('Quantity: ');

    if (query && qt) {
        let pdfLinks = await searchPdfLinks(query, qt);
        pdfLinks = pdfLinks.filter((link) => {
            if (link.endsWith('.pdf')) {
                return true;
            }
            return false;
        });
        for (const link of pdfLinks) {
            doPdfDownload(link);
        };
    } else {
        console.log('Invalid Entries')
    }
};

// Start Bot
start();