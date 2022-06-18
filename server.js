const express = require("express");
const history = require("connect-history-api-fallback");
const path = require("path");
const app = express();

// Middleware used to allow reaching Vue-router routes via URI (instead of just via navigating the app)
// See: https://v3.router.vuejs.org/guide/essentials/history-mode.html
app.use(history());

// Serve static files from app build (in dist/ dir)
app.use(express.static(path.join(__dirname, "dist")));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server listening on port " + port));
