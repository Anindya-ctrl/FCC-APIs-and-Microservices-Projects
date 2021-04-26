const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const dns = require('dns');
const url = require('url');

const shortUrlInfo = [];
let short_url = 0;
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/shorturl', (req, res) => {
    const { url: original_url } = req.body;
    const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locato

    if(!urlPattern.test(original_url)) {
        return res.json({
            error: 'invalid url',
        });
    }

    const parsedUrl = url.parse(original_url);

    dns.lookup(parsedUrl.hostname, (err, addresses, family) => {
        if(err) {
            return res.json({
                error: 'An error occured.',
            });
            throw err;
        };

        short_url = shortUrlInfo.findIndex(info => info.original_url === original_url) === -1 ? Math.floor(Math.random() * 1000) : shortUrlInfo.find(info => info.original_url === original_url).short_url;
        shortUrlInfo.push({
            short_url: short_url.toString(),
            original_url,
        });

        return res.json({
            original_url,
            short_url,
        });
    });
});

app.get('/api/shorturl/:shorturl', (req, res) => {
    const { shorturl } = req.params;
    const targetInfo = shortUrlInfo.find(info => info.short_url === shorturl);

    if(targetInfo) {
        return res.redirect(targetInfo.original_url);
    }
    res.json({
        error: 'An error occurred.'
    });
});

app.listen(PORT, () => {
    console.log(`Started at port: ${ PORT }`)
});
