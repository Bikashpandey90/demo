const http = require("http");
const app = require("./src/config/express.config");
const port = process.env.PORT || 9005;

const httpServer = http.createServer(app)

httpServer.listen(port, (err) => {
    if (!err) {
        console.log(`Server is running on port ${port}`);
        console.log("Press CTRL+C to stop it");

    }
})
