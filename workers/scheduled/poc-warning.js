const path = require('path');
const fs = require('fs');

const workersDir = path.join(__dirname, 'workers');

fs.readdirSync(workersDir).forEach(file => {
  if (file.endsWith('.js')) {
    require(path.join(workersDir, file));
  }
});