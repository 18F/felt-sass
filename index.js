'use strict'
const co = require('co');
const fsp = require('fs-promise');
const path = require('path');
const sass = require('node-sass');

/** default config file name */
const defaultConfig = 'sass.config.js';

module.exports = function(config) {
  if (typeof config === 'string' || !config) {
    try {
      const root = process.cwd();
      const configFile = path.join(root, config || defaultConfig);
      config = require(configFile);
    } catch (e) {
      console.warn('No config file found for felt-sass!');
      config = {};
    }
  }
  return co.wrap(function* (from, to) {
    const options = Object.assign({}, config, {file: from});
    to = to.replace(/\.s[ac]ss$/, '.css');
    return yield new Promise((resolve, reject) => {
      sass.render(options, (error, result) => {
        if (error) {
          reject(error);
        } else {
          const write = fsp.writeFile(to, result.css)
            .catch(reject);
          if (typeof options.post === 'function') {
            write.then(() => {
              resolve(options.post(to, to));
            });
          } else {
            resolve(write);
          }
        }
      });
    });
  })
};
