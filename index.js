'use strict'
const co = require('co');
const fsp = require('fs-promise');
const path = require('path');
const sass = require('node-sass');

/** default config file name */
const defaultConfig = 'sass.config.js';

module.exports = function(config) {
  const root = process.cwd();
  var baseConfig;
  const configFile = (typeof config === 'string')
    ? config
    : defaultConfig;
  try {
    // console.warn('Loading config from:', configFile);
    baseConfig = require(path.join(root, configFile));
    console.warn('Loaded Sass config from:', configFile);
  } catch (e) {
    console.warn('No config file found for felt-sass in:', configFile);
  }
  if (baseConfig) {
    config = Object.assign(baseConfig, config);
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
