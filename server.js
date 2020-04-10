const http = require('http');
const app = require('./app');

const server = http.createServer(app);

const port = process.env.PORT || 8001

server.listen(port, () => {
    console.log('Server Up and Running or port ' + port);
})