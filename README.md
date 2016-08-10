# felt-sass
A [Sass] plugin for [Felt].


Usage, in `felt.config.js`:

```js
const sass = require('felt-sass');
const post = require

module.exports = {
  handlers: {
    // your other handler(s) here
    '.scss': sass()
  }
};
```

You can post-process the resulting CSS with the `post` option, e.g.
to pass them through [postcss] and [cssnext]:

```js
const sass = require('felt-sass');
const postcss = require('felt-postcss');
const postcssImport = require('postcss-import');
const cssnext = require('postcss-cssnext');
const sass = require('felt-sass');

const post = postcss({
  plugins: [
    postcssImport(),
    cssnext()
  ],
  options: {
    map: { inline: false }
  }
});

module.exports = {
  handlers: {
    // your other handler(s) here
    '.scss': sass({
      post: post
    }),
    '.css': post
  }
};
```

[Sass]: http://sass-lang.com/
[Felt]: https://cognitom.github.io/felt/
[cssnext]: http://cssnext.io/
[postcss]: http://postcss.org/
