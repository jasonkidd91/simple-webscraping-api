// Import express
let express = require('express');
// Initialise the app
let app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Import routes
let apiRoutes = require("./routes/api-routes");

// Setup server port
var port = process.env.PORT || 3000;

// Send message for default URL
// app.get('/', (req, res) => res.send('Hello World with Express'));

// Use Api routes in the App
app.use('', apiRoutes);
// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running RestHub on port " + port);
});