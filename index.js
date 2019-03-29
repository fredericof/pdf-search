const { google: googleApi } = require('googleapis');
const customsearch = googleApi.customsearch('v1');
const { credential: googleCreadentials } = require('./credentials/google-search.js');
const downloadPdf = require('download-pdf');

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

    downloadPdf(link, options, function (err) {
        if (err) throw err
        console.log("Download finished")
    });
};

async function start() {
    let pdfLinks = await searchPdfLinks('Clean Code', 5);
    pdfLinks = pdfLinks.filter((link) => {
        if (link.endsWith('.pdf')) {
            return true;
        }
        return false;
    });
    console.log(pdfLinks)
    for (const link of pdfLinks) {
        await doPdfDownload(link);
    };
};

// Start Bot
start().catch(err => {
    console.log("Deu erro")
});