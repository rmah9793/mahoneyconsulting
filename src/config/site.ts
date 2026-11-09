// Edit these before publishing. Empty values show a clear "coming soon" state instead of a fake link.
export type Office = {
  city: string;
  country: string;
  /** IANA time zone, e.g. "Europe/London" */
  timeZone: string;
  /** Shown with a scramble effect in the menu, e.g. "51.5072° N, 0.1276° W" */
  coords: string;
};

export const site = {
  name: "Mahoney Consulting",
  // TODO: add your real calendar link (e.g. Calendly)
  bookingUrl: "",
  // TODO: add your real email address
  email: "",
  // TODO: add your LinkedIn URL
  linkedinUrl: "",
  privacyUrl: "#", // TODO
  termsUrl: "#", // TODO
  // TODO: add a short film (mp4 URL) to switch on the "Watch the film" player in the hero.
  filmUrl: "",
  // TODO: add your real locations to switch on the live clocks in the menu and footer.
  offices: [] as Office[],
};

export const contactHref = () =>
  site.bookingUrl || (site.email ? `mailto:${site.email}` : "#contact");
