// The 3-month plan (12 Nov 2026 → review on Fri 12 Feb 2027).
// Used by the seed script to fill the database.

export const START_DATE = "2026-11-12";
export const REVIEW_DATE = "2027-02-12";
export const GYM_DAYS = [1, 2, 4, 5]; // Mon, Tue, Thu, Fri

export const PLAN: { title: string; target: string; weeks: string[][] }[] = [
  {
    title: "Start the engine",
    target: "40+ applications · ANAPEC registered · French intro ready · first freelance talk",
    weeks: [
      [
        "Send NIXEL the message about his friends' 2 projects",
        "Register with ANAPEC (Idmaj)",
        "Write and record your 2-minute French intro",
        "List 30 target companies (YouCode-linked first)",
      ],
      [
        "15+ applications",
        "Message Mehdi (Rentdari): job or freelance",
        "New CV title: Product developer, backend + design",
        "First weekly post: your story",
      ],
      [
        "15+ applications",
        "Choose one open-source project (Java or TypeScript)",
        "Prepare the 10 classic interview questions in French",
      ],
      [
        "15+ applications",
        "Visit OFPPT: evening Bac+2 Développement Digital (Marrakesh? age limit?)",
        "First open-source contribution (even a small fix)",
      ],
      [
        "15+ applications",
        "Monthly review: count applications, replies, interviews",
        "Adjust your CV or message if replies are zero",
      ],
    ],
  },
  {
    title: "Go deeper",
    target: "100+ applications in total · 1 freelance project delivered or in progress · portfolio with design",
    weeks: [
      ["15+ applications", "Portfolio page: your best 3 projects, well designed"],
      ["15+ applications", "Freelance project: start or deliver", "One mock interview in French"],
      ["15+ applications (holiday week: keep it light)", "Second open-source contribution"],
      ["15+ applications", "Follow up all applications older than 2 weeks", "Monthly review"],
    ],
  },
  {
    title: "Results",
    target: "Interviews, an offer or freelance income · clear numbers for the review",
    weeks: [
      ["15+ applications", "Second freelance project or a new portfolio feature"],
      ["15+ applications", "Read the GSoC organisation list when it is published; pick one"],
      ["15+ applications", "Draft a GSoC proposal outline with your chosen project"],
      ["15+ applications", "Prepare your review: all numbers in one place"],
      ["Review day, Friday 12 February: look at the numbers and decide the next 3 months"],
    ],
  },
];
