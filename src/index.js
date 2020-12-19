const express = require('express')
const path = require('path')

const app = express()                //new express application
const port = process.env.PORT || 3000

const  publicDirectoryPath = path.join(__dirname , '../public')

app.use(express.static(publicDirectoryPath))

 app.listen(port, () =>{
     console.log(`server is running on port ${port}`)
 })