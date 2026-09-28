export type Review = {
  id: string;
  name: string;
  date: string;
  iso: string;
  body: string;
};

export const REVIEWS: Review[] = [
  {
    id: "ren",
    name: "Ren",
    date: "1 Aug 2026",
    iso: "2026-08-01",
    body: "Evora is seriously good, and the team behind it knows exactly what they are doing.",
  },
  {
    id: "asx-jul-28",
    name: "ASX",
    date: "28 Jul 2026",
    iso: "2026-07-28",
    body: "Updates land quickly and it is clearly worth the subscription.",
  },
  {
    id: "asx-jul-23",
    name: "ASX",
    date: "23 Jul 2026",
    iso: "2026-07-23",
    body: "Renewed for another month without a second thought.",
  },
  {
    id: "marco",
    name: "Marco",
    date: "18 Jul 2026",
    iso: "2026-07-18",
    body: "Excellent authentication, and I was impressed enough to commission the team for a hypervisor project as well.",
  },
  {
    id: "asx-jul-14",
    name: "ASX",
    date: "14 Jul 2026",
    iso: "2026-07-14",
    body: "The authentication is exceptional. My advice is to pick it up sooner rather than later.",
  },
  {
    id: "cs38",
    name: "CS38",
    date: "26 Jun 2026",
    iso: "2026-06-26",
    body: "Quick to integrate. Any LLM can pick up Evorion and wire it in without hand-holding.",
  },
  {
    id: "asx-jun-24",
    name: "ASX",
    date: "24 Jun 2026",
    iso: "2026-06-24",
    body: "Outstanding authentication, backed by a team that is just as good.",
  },
  {
    id: "frokon",
    name: "Frokon",
    date: "31 May 2026",
    iso: "2026-05-31",
    body: "Set up in no time at all, and the panel is spotless.",
  },
  {
    id: "bru",
    name: "Bru",
    date: "6 May 2026",
    iso: "2026-05-06",
    body: "The website is exceptionally clean, the documentation is detailed, and the pricing is remarkable value for everything included.",
  },
  {
    id: "cs",
    name: "CS",
    date: "5 May 2026",
    iso: "2026-05-05",
    body: "Solid authentication, and the Python integration holds up just as well as the native one.",
  },
  {
    id: "mark",
    name: "Mark",
    date: "2 May 2026",
    iso: "2026-05-02",
    body: "The authentication is good enough that I would not consider moving to anything else.",
  },
  {
    id: "anonymous",
    name: "Anonymous",
    date: "1 May 2026",
    iso: "2026-05-01",
    body: "An SDK that is easy to work with, a well-designed panel, and documentation that answers the question you actually have.",
  },
  {
    id: "kei",
    name: "Kei",
    date: "27 Apr 2026",
    iso: "2026-04-27",
    body: "A clear step up from the other providers I have used, in more ways than one.",
  },
  {
    id: "monezy",
    name: "Monezy",
    date: "14 Apr 2026",
    iso: "2026-04-14",
    body: "Nothing but good things to say. Evora has been dependable since the day I integrated it.",
  },
  {
    id: "flytrap",
    name: "Flytrap",
    date: "21 Mar 2026",
    iso: "2026-03-21",
    body: "The authentication is rock solid, the implementation is clean, and it has worked exactly as advertised.",
  },
];

export const FEATURED_HOME_ID = "flytrap";

export function getReview(id: string): Review {
  const found = REVIEWS.find((r) => r.id === id);
  if (!found) throw new Error(`unknown review id: ${id}`);
  return found;
}

export function monogram(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}
