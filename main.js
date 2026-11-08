/* Greylock Trust booking page
   Reads config.js and fills in the calendars, contact email and video. */
(function () {
  'use strict';

  var cfg = window.GREYLOCK_CONFIG || {};
  var links = cfg.calendly || {};
  var email = (cfg.contactEmail || '').trim();
  var video = (cfg.videoUrl || '').trim();

  function urlFor(kind) {
    var u = (links[kind] || '').trim();
    if (!u) return '';
    var sep = u.indexOf('?') === -1 ? '?' : '&';
    // Calendly look: white background, navy text and buttons.
    return u + sep + 'background_color=ffffff&text_color=1e3145&primary_color=1e3145';
  }

  function mailLink(text) {
    var a = document.createElement('a');
    a.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Booking a Greylock Trust session');
    a.textContent = text || email;
    return a;
  }

  /* Contact email in the footer and help lines */
  if (email) {
    document.getElementById('footEmail').appendChild(mailLink());
    document.querySelectorAll('.help-email').forEach(function (el) {
      var label = el.textContent;
      el.textContent = '';
      el.appendChild(mailLink(label + ' at ' + email));
    });
  } else {
    document.querySelectorAll('.help-line').forEach(function (el) { el.hidden = true; });
  }

  /* Intro video: replaces the "coming soon" placeholder once a link is set */
  if (video) {
    var frame = document.createElement('iframe');
    frame.src = video;
    frame.title = 'Introduction to Greylock Trust';
    frame.allow = 'fullscreen; picture-in-picture';
    frame.loading = 'lazy';
    document.getElementById('videoPlaceholder').remove();
    document.getElementById('videoFrame').appendChild(frame);
  }

  /* Calendars for the two self-booking sessions. This follows Calendly's own
     embed code: each calendar box carries its link in data-url BEFORE Calendly's
     script loads, and the script fills every box in automatically. */
  function buildCalendar(kind) {
    var holder = document.querySelector('[data-calendar="' + kind + '"]');
    var url = urlFor(kind);
    if (!url) {
      holder.innerHTML =
        '<div class="calendar-fallback"><p class="fallback-title">Online booking is opening soon.</p>' +
        '<p>To book now, please email us and we\'ll find a time with you.</p></div>';
      if (email) {
        var p = holder.querySelector('.calendar-fallback p:last-child');
        p.textContent = 'To book now, email ';
        p.appendChild(mailLink());
        p.appendChild(document.createTextNode(" and we'll find a time with you."));
      }
      return;
    }
    var widget = document.createElement('div');
    widget.className = 'calendly-inline-widget';
    widget.setAttribute('data-url', url);
    holder.appendChild(widget);
  }
  buildCalendar('welcome');
  buildCalendar('full');
  buildCalendar('gift');

  /* Calendly marks its calendars to load only when scrolled near. Load them
     right away instead, so they are ready by the time a visitor gets there. */
  if ('MutationObserver' in window) {
    new MutationObserver(function (changes) {
      changes.forEach(function (c) {
        c.addedNodes.forEach(function (n) {
          if (n.tagName === 'IFRAME' && n.getAttribute('loading') === 'lazy') {
            n.setAttribute('loading', 'eager');
            n.src = n.src;
          }
        });
      });
    }).observe(document.querySelector('main'), { childList: true, subtree: true });
  }

  /* Then load Calendly's script once; it fills in every calendar above */
  if (links.welcome || links.full || links.gift) {
    var s = document.createElement('script');
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.async = true;
    document.body.appendChild(s);
  }

  /* The switch between Welcome Session and Digital Safety Session */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.switch-option'));
  function choose(kind, focusTab) {
    tabs.forEach(function (tab) {
      var on = tab.getAttribute('data-session') === kind;
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
      tab.tabIndex = on ? 0 : -1;
      // The other calendar stays laid out off-screen (not display:none),
      // so Calendly can size it correctly before it is shown.
      var panel = document.getElementById(tab.getAttribute('aria-controls'));
      panel.classList.toggle('is-off', !on);
      panel.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (on && focusTab) tab.focus();
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { choose(tab.getAttribute('data-session')); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (next) { e.preventDefault(); choose(next.getAttribute('data-session'), true); }
    });
  });
  choose('welcome');

  /* Gift: if there is no gift link, show the email line instead of the refund note */
  if (!links.gift) {
    document.querySelector('.gift-fallback').hidden = false;
    document.querySelector('.gift-note').hidden = true;
  }

  /* When Calendly reports a finished booking, show a thank-you under the
     calendar it came from */
  window.addEventListener('message', function (e) {
    if (e.origin !== 'https://calendly.com') return;
    if (!(e.data && e.data.event === 'calendly.event_scheduled')) return;
    var fromGift = false;
    document.querySelectorAll('[data-calendar="gift"] iframe').forEach(function (f) {
      if (f.contentWindow === e.source) fromGift = true;
    });
    document.getElementById(fromGift ? 'giftBooked' : 'booked').hidden = false;
  });

  /* Hero buttons: "Protect myself" opens the Welcome Session; both move keyboard focus to their section */
  document.querySelectorAll('a[href="#book"], a[href="#gift"]').forEach(function (a) {
    a.addEventListener('click', function () {
      var kind = a.getAttribute('data-choose');
      if (kind) choose(kind);
      var target = document.querySelector(a.getAttribute('href'));
      setTimeout(function () { target.focus({ preventScroll: true }); }, 0);
    });
  });
})();
