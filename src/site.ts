export const site = {
  name: "Mahoney Consulting",
  eyebrow: "Strategy · Operations · Executive Advisory",
  headline: "Strategic Leadership to Build More Value.",
  description:
    "Fractional CEO & COO services for businesses ready to grow, scale and perform.",
  supporting: "Clarity to lead. Capability to deliver.",
  approachEyebrow: "The Mahoney Approach",
  approachHeadline: "Hands-On Leadership. Measurable Impact.",
  approachBody:
    "Practical, experienced executive partnership to navigate complexity, strengthen operations and deliver lasting outcomes. We combine strategic thinking with operational follow-through.",
  cta: "Schedule a Conversation",
  email: "ryan@mahoney.consulting",
  location: "Attard, Malta",
  bookingUrl: "",
  linkedinUrl: "",
  privacyUrl: "",
  termsUrl: "",
} as const;

export const nav = [
  { href: "#services", label: "Services" },
  { href: "#approach", label: "Approach" },
  { href: "#process", label: "How We Work" },
  { href: "#contact", label: "Contact" },
] as const;

export const services = [
  {
    title: "Fractional CEO",
    body: "Strategic direction and accountable executive leadership for businesses ready for their next stage.",
  },
  {
    title: "Fractional COO",
    body: "Operational leadership, scaling, and performance improvement with clear ownership.",
  },
  {
    title: "Strategy & Execution",
    body: "Turn ambition into outcomes with focus, discipline, and accountable follow-through.",
  },
  {
    title: "Growth & Value",
    body: "Build capacity, improve effectiveness, and create enduring enterprise value.",
  },
] as const;

export const steps = [
  {
    number: "01",
    label: "Understand",
    title: "Get aligned.",
    body: "Assess the business, priorities and constraints to define a credible direction.",
  },
  {
    number: "02",
    label: "Lead",
    title: "Move forward.",
    body: "Work alongside leadership teams to build ownership and make sound decisions.",
  },
  {
    number: "03",
    label: "Deliver",
    title: "Create value.",
    body: "Translate direction into measurable progress through focused execution.",
  },
] as const;

export function contactHref(subject = "Mahoney Consulting enquiry") {
  if (site.bookingUrl) return site.bookingUrl;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
}
