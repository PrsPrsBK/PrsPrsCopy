module.exports = {
  verbose: false,
  ignoreFiles: [
    '*.log',
    'package.json',
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
