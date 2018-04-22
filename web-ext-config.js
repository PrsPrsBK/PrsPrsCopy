module.exports = {
  verbose: false,
  ignoreFiles: [
    '*.log',
    'package.json',
    'package-lock.json',
    '.tern-project',
    'note/',
    'test/',
    '*/js2flowchart/',
    'web-ext-config.js',
    'web-ext-artifacts/',
  ],
  build: {
    overwriteDest: true,
  },
};
