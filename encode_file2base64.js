'use strict';

const fs = require('fs');

fs.readFile('./docs/images/aframesample-file.png', (err, data) => {
  if (err) throw err;
  let encodedData = data.toString('base64');
  console.log(encodedData);
});
