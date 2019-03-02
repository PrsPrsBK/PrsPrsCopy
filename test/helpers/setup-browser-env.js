import browserEnv from 'browser-env';
browserEnv(['window', 'document', 'navigator'], {
  url: 'http://www.example.com',
});
import browserFake from 'webextensions-api-fake';
global.browser = browserFake();
