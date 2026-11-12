// The 3-month plan (12 Nov 2026 → review on Fri 12 Feb 2027).
// Used by the seed script to fill the database.
// To change a task, edit it here and run `npm run db:seed` again.
// Add new tasks at the END of a week: tasks are matched by their position.

export const START_DATE = "2026-11-12";
export const REVIEW_DATE = "2027-02-12";
export const GYM_DAYS = [1, 2, 4, 5]; // Mon, Tue, Thu, Fri

export const PLAN: { title: string; target: string; weeks: string[][] }[] = [
  {
    title: "Start the engine",
    target: "40+ applications · ANAPEC registered · French intro ready · first freelance talk · solid core Java",
    weeks: [
      [
        "Send NIXEL the message about his friends' 2 projects",
        "Register with ANAPEC (Idmaj)",
        "Write and record your 2-minute French intro",
        "List 30 target companies (YouCode-linked first)",
        "Learn: Java OOP, Collections (HashMap inside), Streams + Optional; explain each in French",
        "LinkedIn: new title (Full-Stack Developer | Java · Spring Boot · Angular) + Open to Work",
      ],
      [
        "15+ applications",
        "Message Mehdi (Rentdari): job or freelance",
        "New CV title: Full-Stack Developer, Java · Spring Boot · Angular",
        "First weekly post: your story",
        "Learn: Spring Boot dependency injection, beans, @Transactional",
        "Learn: JPA relations, lazy vs eager, the N+1 problem",
      ],
      [
        "15+ applications",
        "Choose one open-source project (Java or TypeScript)",
        "Prepare the 10 classic interview questions in French",
        "Learn: Spring Security with JWT (filters, roles)",
      ],
      [
        "15+ applications",
        "Visit OFPPT: evening Bac+2 Développement Digital (Marrakesh? age limit?)",
        "First open-source contribution (even a small fix)",
        "Learn: tests with JUnit 5, Mockito, Testcontainers",
      ],
      [
        "15+ applications",
        "Monthly review: count applications, replies, interviews",
        "Adjust your CV or message if replies are zero",
        "Learn: SQL joins, indexes, reading EXPLAIN",
      ],
    ],
  },
  {
    title: "Go deeper",
    target: "100+ applications in total · 1 freelance project delivered or in progress · portfolio with design · confident Spring interviews",
    weeks: [
      [
        "15+ applications",
        "Portfolio page: your best 3 projects, well designed",
        "Learn: exceptions, generics, Java records; global error handling in Spring",
      ],
      [
        "15+ applications",
        "Freelance project: start or deliver",
        "One mock interview in French",
        "Learn: design patterns in Spring (Builder, Strategy, Factory)",
      ],
      [
        "15+ applications (holiday week: keep it light)",
        "Second open-source contribution",
        "Learn: review your 3 weakest Java/Spring topics",
      ],
      [
        "15+ applications",
        "Follow up all applications older than 2 weeks",
        "Monthly review",
        "Learn: Java concurrency basics (threads, ExecutorService, CompletableFuture)",
      ],
    ],
  },
  {
    title: "Results",
    target: "Interviews, an offer or freelance income · a Spring Boot app deployed · clear numbers for the review",
    weeks: [
      [
        "15+ applications",
        "Second freelance project or a new portfolio feature",
        "Learn: Docker for Spring Boot (multi-stage build, docker compose with Postgres)",
      ],
      [
        "15+ applications",
        "Read the GSoC organisation list when it is published; pick one",
        "Learn: deploy a Spring Boot app on one cloud provider",
      ],
      [
        "15+ applications",
        "Draft a GSoC proposal outline with your chosen project",
        "Learn: system design basics (caching, queues, pagination)",
      ],
      [
        "15+ applications",
        "Prepare your review: all numbers in one place",
        "One mock technical interview (Java + Spring) in French",
      ],
      ["Review day, Friday 12 February: look at the numbers and decide the next 3 months"],
    ],
  },
];
