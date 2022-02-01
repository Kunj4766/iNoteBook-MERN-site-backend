const connectTomongo = require('./db');
var cors = require('cors')
const express = require('express')

connectTomongo();

const app = express()
const port = 4000

// Midware : to use req.body;

app.use(cors())
app.use(express.json())

//Available routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})