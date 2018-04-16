// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  env: {
    browser: false,
    node: true,
    es6: true
  },
  extends: 'airbnb-base', 
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'indent': ['error', 4],
    'no-console': 0,
    'linebreak-style': 0,
    'no-alert': 0,
    'semi': 0
  },
  globals: {
    App: true,
    Page: true,
    wx: true,
    getApp: true,
    getPage: true
  }
}
