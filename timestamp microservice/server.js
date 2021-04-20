const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'views')));

app.get('/api/:date?', (req, res) => {
    const { date } = req.params;

    // SET OUTPUT DEPENDING ON FORMAT
    const output = /^[0-9]+$/.test(date) ? new Date(parseInt(date)) : new Date(date);
    
    // GET unix AND utc TIME
    const unix = output.getTime();
    const utc = output.toUTCString();

    // CHECK IF A DATE EXISTS IN THE URL
    if(!date) {
        return res.json({
            'unix': new Date().getTime(),
            'utc': `${ new Date().toUTCString() }`,
        });
    }
    // CHECK VALIDITY
    if(isNaN(unix) && utc === 'Invalid Date') {
        return res.json({
            'error' : 'Invalid Date', 
        });
    }

    // SEND OUTPUT JSON IF EVERYTHING PASSES
    res.json({
        'unix': output.getTime(),
        'utc': `${ output.toUTCString() }`,
    });
});

app.listen(PORT, () => {
    console.log(`Started at port: ${ PORT }`)
});
