const express = require('express')
const app = express()
const fs = require( 'fs' );
const fileName = 'data.json';
app.use(express.json())

app.get('/data', function (req, res) {
  fs.readFile(fileName, { encoding: 'utf8'}, (err, data) => {
    if (err) {
      if ( err.code === 'ENOENT' ) {
        return res.status(200).json({ success: true, data: [] });
      }
      return res.status(500).json({ success: false, error: err.message });
    }
  
    return res.status(200).json({ success: true, data: JSON.parse( data ) })
  });

})

app.post('/data', function (req, res, next) {
  fs.writeFile(fileName, JSON.stringify( req.body ), { encoding: 'utf8'}, (err, data) => {
    if (err) {
      console.log(JSON.stringify(err))
      return res.status(500).json({ success: false, error: err });
    }
  
    return res.status(200).json({ success: true })
  });

})

app.use(express.static('build'))
app.listen(3001)