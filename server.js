const http = require('http');  
const port = 3000;  //ur port

const requestHandler = (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        console.log('Received data:', body);
        res.end('ok');
    });
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
    if (err) {
        return console.log('Something went wrong:', err);
    }
    console.log(`Server is listening on port ${port}`);
});
