====================
PrsPrsCopy
====================

This add-on is utility for copy url or texts in active web page, specified in templates.
This is Currently published to AMO: 
`PrsPrsCopy <https://addons.mozilla.org/ja/firefox/addon/prsprscopy/>`__ ,
or `Chrome Web Store <https://chrome.google.com/webstore/detail/prsprscopy/hghdhiodkbbogfnbhknleobjjpadlmcc>`__


What it does
====================

Copy Utility only for text. 
When no range selected on page, Alt-c copy with template composed of url, title, or so. 
Also, you can copy from Toolbar icon. You can edit templates in options page.

For each 'Alt-c' key, copy text to clipboard. Text is constructed with one of the templates for URL-matched website.
And after Alt-c key, choice of template is shift to next. Next Alt-c means 'copying with other template and shift'.
Toolbar icon tell 'copy is fired' by color-flipping, and 'next index of template' by number in badged text.
Also, clicking toolbar icon shows the list of template, and clicking template-name button go 'start copying'.

  
.. image:: ./images/2018-09-06_ss01.jpg

Settings. There are site, and each site may have some templates.
Alt-c key starts 'copy' and shift to next template for the site.
  
.. image:: ./images/2018-09-06_ss02.jpg

Tool has site-specialized spec. Currenly only for twitter.com.
username, datetime, and you can copy from 1-level nested QuotedTweet.
  
.. image:: ./images/2018-09-06_ss03.jpg

From toolbar icon, templates for the site are shown.
And you can do copy by simply clicking button.


Known Issue
====================


Release Notes
====================

0.9.6
--------------------

fix: When text exists after quoted-tweet's URL, it will be dropped.

