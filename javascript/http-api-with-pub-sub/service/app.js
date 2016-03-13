const util = require('util');
const express = require('express');
const app = express();

const hostname = '0.0.0.0';
const port = 3000;

app.get('/', (req, res) => {
      res.set('Content-Type', 'text/plain').send('How do World!');
});

app.listen(port, hostname, () => {
      util.log(`New Server running at http://${hostname}:${port}/`);
});


