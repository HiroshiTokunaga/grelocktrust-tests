# Greylock Trust booking page

A one-page website where clients book one of three Calendly events: a free 20-minute Welcome Session, the $200 Digital Safety Session, or a $200 gift session for a loved one. Calendly charges paid sessions through the company's Stripe account, so this site has no payment code and stores no client data.

## How the page is laid out

- Hero: "Protect myself" opens the booking section on the Welcome Session. "Protect a loved one" jumps to the gift section.
- Booking: a two-option switch between the Welcome Session (selected first) and the Digital Safety Session. Each shows its own steps and its own inline calendar.
- Gift: a card below the booking section. Its button opens the gift calendar in a pop-up.

## Changing the settings

Open `config.js`. It has three settings:

- `calendly`: the three Calendly event links (`welcome`, `full`, `gift`). If one is empty, that part of the page asks people to email instead.
- `contactEmail`: the address shown to clients.
- `videoUrl`: an embed link for the intro video. Empty shows a "coming soon" box.

Edit, save, commit and push. GitHub Pages updates the live site in about a minute.

## Files

- `index.html`: all the page text.
- `style.css`: the look. Body text is 20px on purpose, for older readers.
- `main.js`: fills in the calendar, email and video from `config.js`, and shows a thank-you note after a booking.
- `images/`: the logo and the landing photo (`hero.jpg`).

## Hosting

Hosted on GitHub Pages from the `main` branch. To use greylocktrust.com instead of the github.io address, add the domain under Settings, then Pages, and update the domain's DNS records as GitHub describes there.

## Testing a booking

Calendly's Stripe connection has no test mode, so Stripe test cards won't work there. Instead, set the event price to $1, book a slot yourself with your own card, check the confirmation email and Zoom link, refund the $1 from the Stripe Dashboard, then set the price back to $200.
