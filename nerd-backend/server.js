const express = require("express");
const app = express();
app.use(require('cors')());
const PORT = process.env.PORT || 3001;


app.listen(process.env.PORT || PORT, () => {
    console.log(`Listening on port: ${PORT}`)
})