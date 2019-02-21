module.exports = {
  verbose: false,
  ignoreFiles: [
    '*.log',
    'package.json',
    'package-lock.json',
    '.tern-project',
    'note/',
    'test/',
    'images/',
    '*/js2flowchart/',
    '*/*.js.svg',
    'jsconfig.json',
    'web-ext-config.js',
    'web-ext-artifacts/',
    'yarn.lock',
  ],
  build: {
    overwriteDest: true,
  },
};
