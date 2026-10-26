/* Greylock Trust booking page
   Reads config.js and fills in the calendar, contact email and video. */
(function () {
  'use strict';

  var cfg = window.GREYLOCK_CONFIG || {};
  var email = (cfg.contactEmail || '').trim();
  var calendly = (cfg.calendlyUrl || '').trim();
  var video = (cfg.videoUrl || '').trim();

  function mailLink(text) {
    var a = document.createElement('a');
    a.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Booking a Greylock Trust session');
    a.textContent = text || email;
    return a;
  }

  /* Contact email in the footer, help line and fallback message */
  var helpLine = document.getElementById('helpLine');
  if (email) {
    document.getElementById('footEmail').appendChild(mailLink());
    var helpEmail = document.getElementById('helpEmail');
    helpEmail.textContent = '';
    helpEmail.appendChild(mailLink('Write to us at ' + email));
    var fallbackText = document.getElementById('fallbackText');
    fallbackText.textContent = 'To book now, email ';
    fallbackText.appendChild(mailLink());
    fallbackText.appendChild(document.createTextNode(" and we'll find a time with you."));
  } else {
    helpLine.hidden = true;
  }

  /* Intro video, only when a link is set */
  if (video) {
    var frame = document.createElement('iframe');
    frame.src = video;
    frame.title = 'Introduction to Greylock Trust';
    frame.allow = 'fullscreen; picture-in-picture';
    frame.loading = 'lazy';
    document.getElementById('videoFrame').appendChild(frame);
    document.getElementById('video').hidden = false;
  }

  /* Calendly calendar, only when a link is set */
  if (calendly) {
    var sep = calendly.indexOf('?') === -1 ? '?' : '&';
    var url = calendly + sep + 'hide_gdpr_banner=1&primary_color=c3903c';

    var holder = document.getElementById('calendar');
    document.getElementById('calendarFallback').remove();
    var widget = document.createElement('div');
    widget.className = 'calendly-inline-widget';
    widget.setAttribute('data-url', url);
    holder.appendChild(widget);

    var s = document.createElement('script');
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.async = true;
    document.body.appendChild(s);
  }

  /* When Calendly reports a finished booking, show a plain thank-you under it */
  window.addEventListener('message', function (e) {
    if (e.origin !== 'https://calendly.com') return;
    if (e.data && e.data.event === 'calendly.event_scheduled') {
      var booked = document.getElementById('booked');
      booked.hidden = false;
    }
  });

  /* Clicking "Book a session" moves keyboard focus to the booking section too */
  document.querySelectorAll('a[href="#book"]').forEach(function (a) {
    a.addEventListener('click', function () {
      setTimeout(function () { document.getElementById('book').focus({ preventScroll: true }); }, 0);
    });
  });
})();
