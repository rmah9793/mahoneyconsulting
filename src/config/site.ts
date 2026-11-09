// Edit these before publishing. Empty values show a clear "coming soon" state instead of a fake link.
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
};

export const contactHref = () =>
  site.bookingUrl || (site.email ? `mailto:${site.email}` : "#contact");
