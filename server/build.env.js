const fs = require('fs')

let Env = process.env.NODE_ENV

fs.writeFile('./api/env.js', 'export default "'+ Env +'";', { flag: 'w' }, (err) => {
  if (err) {
      console.error(err)
  } else {
      console.log('write file env.js success.')
  }
});
