# Greylock Trust booking page

A one-page website where clients learn what a Greylock Trust session covers, pick a time in Calendly, and pay $200. Calendly charges the card through the company's Stripe account, so this site has no payment code and stores no client data.

## Changing the settings

Open `config.js`. It has three settings:

- `calendlyUrl`: the Calendly link for the onboarding event. While it is empty, the page asks people to email instead.
- `contactEmail`: the address shown to clients.
- `videoUrl`: an embed link for the intro video. Empty means the video section stays hidden.

Edit, save, commit and push. GitHub Pages updates the live site in about a minute.

## Files

- `index.html`: all the page text.
- `style.css`: the look. Body text is 20px on purpose, for older readers.
- `main.js`: fills in the calendar, email and video from `config.js`, and shows a thank-you note after a booking.
- `images/`: logo and two stock photos (from the original greylocktrust.com repository). Replace them with real photos of advisors when you have them.

## Hosting

Hosted on GitHub Pages from the `main` branch. To use greylocktrust.com instead of the github.io address, add the domain under Settings, then Pages, and update the domain's DNS records as GitHub describes there.

## Testing a booking

Calendly's Stripe connection has no test mode, so Stripe test cards won't work there. Instead, set the event price to $1, book a slot yourself with your own card, check the confirmation email and Zoom link, refund the $1 from the Stripe Dashboard, then set the price back to $200.
