import browserEnv from 'browser-env';
browserEnv(['window', 'document', 'navigator'], {
  url: 'http://www.example.com/foo/#!/foo.html#tomorrow?query=foo&next=bar',
});
global.URL = window.URL;
import browserFake from 'webextensions-api-fake';
global.browser = browserFake();
