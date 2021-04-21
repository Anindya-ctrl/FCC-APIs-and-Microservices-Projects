const express = require('express');
const app = express();
const os = require('os');

const PORT = process.env.PORT || 3000;

app.use(express.static('views'));

app.get('/api/whoami', (req, res) => {
    const ipaddress = os.networkInterfaces().lo[0].address;
    const language = req.headers['accept-language'];
    const software = req.headers['user-agent'];

    res.json({
        ipaddress,
        language,
        software,
    });

});

app.listen(PORT, () => {
    console.log(`Server started at port: ${ PORT }`);
});
