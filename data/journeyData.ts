export type GalleryCategory =
  | "first-year"
  | "second-year"
  | "sports"
  | "activities"
  | "parties"
  | "workshops"
  | "classmates"
  | "special-events"
  | "healthy-life";

export interface MemoryItem {
  id: string;
  title: string;
  caption: string;
  date: string;
  location: string;
  category: GalleryCategory;
  categoryLabel: string;
  imageSrc: string;
  videoSrc?: string;
  mediaType: "image" | "video";
  aspect: "landscape" | "portrait" | "square";
  featured?: boolean;
}

export interface JourneyMilestone {
  id: string;
  title: string;
  description: string;
  tag: string;
}

export interface JourneyStage {
  id: "year-1" | "year-2" | "my-future";
  stepNumber: string;
  title: string;
  shortTitle: string;
  period: string;
  tagline: string;
  summary: string;
  accentColor: string;
  glowColor: string;
  milestones: JourneyMilestone[];
  reflection: string;
}

export interface SkillGroup {
  id: string;
  title: string;
  subtitle: string;
  items: {
    name: string;
    stage: string;
    focus: string;
  }[];
}

export interface ProjectSlot {
  id: string;
  title: string;
  type: "Team Project" | "Personal Project" | "Capstone / Practice";
  phase: string;
  summary: string;
  role: string;
  techStack: string[];
  highlights: string[];
  imageSrc: string;
  githubUrl: string;
  liveUrl: string;
}

export const SITE_CONFIG = {
  brandTitle: "MY PNC JOURNEY",
  heroTitle: "MY PNC JOURNEY",
  heroSubtitle: "Two Years of Learning, Growing & Becoming a Software Engineer",
  centralMessage: "Two Years. Countless Memories. Endless Possibilities.",
  heroIntro:
    "Welcome to my interactive digital story documenting two transformative years at Passerelles Numériques Cambodia (PNC) — a place where around 25 students from provinces across Cambodia come together to learn IT, support each other like family, and build a brighter future.",
  closingNote:
    "My journey at PNC is not just about learning IT. It is about becoming a better person, building meaningful friendships, developing professional skills, and preparing myself to become a Software Engineer.",
  studentName: "[Your Full Name]",
  cohortLabel: "[PNC Batch / Academic Years]",
  hometown: "[Your Hometown Province], Cambodia",
  campus: "Passerelles Numériques Cambodia (PNC), Phnom Penh",
  cohortSizeNote: "Approx. 25 students from provinces across Cambodia",
  careerGoal: "Professional Software Engineer",
};

export const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  "first-year": "First-Year Memories",
  "second-year": "Second-Year Memories",
  sports: "Sports",
  activities: "Activities",
  parties: "Parties",
  workshops: "Workshops",
  classmates: "Classmates & Friends",
  "special-events": "Special School Events",
  "healthy-life": "Healthy Life",
};

export const ABOUT_DATA = {
  introHeadline: "From a Cambodian Province to a Future in Software Engineering",
  whoIAm:
    "I am an IT student at Passerelles Numériques Cambodia (PNC) completing an intensive two-year journey in technology, communication, and life skills. Every day at PNC challenged me to think deeper, collaborate openly, and step out of my comfort zone.",
  backgroundAndHometown:
    "Growing up in [Your Hometown Province, Cambodia], coming to Phnom Penh for PNC marked one of the biggest turning points in my life. Leaving family behind brought moments of homesickness, yet arriving alongside roughly 25 fellow students from different provinces across Cambodia quickly turned strangers into lifelong friends.",
  personalityAndInterests:
    "Curiosity, persistence, and teamwork define how I approach both code and life. Outside writing software and debugging interfaces, I enjoy playing football with classmates, joining community activities, sharing meals after long study nights, and learning new digital tools.",
  values: [
    {
      title: "Growth",
      description:
        "Embracing unfamiliar challenges — from my first line of code to building full-stack applications.",
    },
    {
      title: "Friendship",
      description:
        "Standing together with classmates from provinces all across Cambodia through triumphs and tough deadlines.",
    },
    {
      title: "Teamwork",
      description:
        "Recognizing that the strongest software and happiest memories are built collaboratively.",
    },
    {
      title: "Gratitude",
      description:
        "Honoring the teachers, mentors, donors, and PNC staff who gave us the opportunity to dream bigger.",
    },
  ],
  whyIT:
    "I chose Information Technology because software has the power to solve real problems for communities and create opportunity regardless of where you start. Seeing logic transform into helpful digital tools inspired me to learn how systems work from the ground up.",
  whyPNC:
    "Passerelles Numériques Cambodia offered far more than technical classes — it provided holistic education, English training, life skills, healthcare support, and a nurturing community where students from diverse Cambodian provinces grow together with dignity and purpose.",
  careerAmbition:
    "My ultimate career goal is to become a skilled, dependable Software Engineer who designs clean, scalable, user-centered systems — and one day gives back to the next generation of Cambodian tech learners.",
  portraitImage: "/images/about/portrait.jpg",
  hometownImage: "/images/about/hometown-campus.jpg",
};

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: "year-1",
    stepNumber: "01",
    title: "Year 1 – The Beginning",
    shortTitle: "Year 1",
    period: "Foundation Year",
    tagline: "First steps, new friendships, and discovering the language of technology.",
    summary:
      "My first year at PNC was filled with curiosity, courage, and adaptation. Stepping into a classroom with ~25 peers from across Cambodia, I began learning programming fundamentals, English communication, and essential life skills.",
    accentColor: "#38BDF8",
    glowColor: "rgba(56, 189, 248, 0.25)",
    milestones: [
      {
        id: "y1-first-day",
        title: "First Day at PNC",
        description:
          "Arriving on campus with excitement and nervousness, carrying hopes from home and stepping into a brand-new learning environment.",
        tag: "Orientation",
      },
      {
        id: "y1-classmates",
        title: "Meeting Classmates & Teachers",
        description:
          "Getting to know around 25 fellow students from different provinces across Cambodia, guided by caring teachers and social support teams.",
        tag: "Community",
      },
      {
        id: "y1-fundamentals",
        title: "Learning Programming Fundamentals",
        description:
          "Writing my earliest programs, understanding algorithms, problem-solving logic, HTML/CSS foundations, and structured thinking.",
        tag: "Core IT",
      },
      {
        id: "y1-english",
        title: "English & Communication Development",
        description:
          "Building confidence to read technical documentation, speak in presentations, and communicate clearly in English.",
        tag: "Language",
      },
      {
        id: "y1-lifeskills",
        title: "Life Skills & Personal Growth",
        description:
          "Learning time management, self-reflection, responsibility, and living harmoniously in a supportive student community.",
        tag: "Personal Growth",
      },
      {
        id: "y1-memories",
        title: "First Experiences & Memories",
        description:
          "First group study sessions, campus events, shared laughter, and discovering that we were growing together as one cohort.",
        tag: "Memories",
      },
    ],
    reflection:
      "Year 1 taught me that everyone starts as a beginner — consistency and kindness turn uncertainty into confidence.",
  },
  {
    id: "year-2",
    stepNumber: "02",
    title: "Year 2 – Growing and Developing",
    shortTitle: "Year 2",
    period: "Specialization & Industry Readiness",
    tagline: "From foundational syntax to full-stack engineering, teamwork, and real-world readiness.",
    summary:
      "In Year 2, our learning accelerated into advanced IT concepts, full-stack web development, team software projects, company visits, workshops, and internship preparation — shaping us into young professionals.",
    accentColor: "#8B5CF6",
    glowColor: "rgba(139, 92, 246, 0.28)",
    milestones: [
      {
        id: "y2-advanced-it",
        title: "Advanced IT Learning",
        description:
          "Deepening software architecture understanding, databases, APIs, version control workflows, and engineering discipline.",
        tag: "Engineering",
      },
      {
        id: "y2-fullstack",
        title: "Full-Stack Web Development",
        description:
          "Connecting responsive modern frontends with backend logic, structured databases, and end-to-end user experiences.",
        tag: "Full-Stack",
      },
      {
        id: "y2-teamwork",
        title: "Teamwork & Software Projects",
        description:
          "Collaborating in agile-style student teams, splitting tasks with Git, reviewing code, and presenting live projects.",
        tag: "Collaboration",
      },
      {
        id: "y2-workshops",
        title: "Workshops & Company Visits",
        description:
          "Visiting tech workplaces, meeting industry professionals, and seeing how real software teams operate across Cambodia.",
        tag: "Industry Exposure",
      },
      {
        id: "y2-internship",
        title: "Internship Experience",
        description:
          "Preparing for and stepping into real workplace environments — applying classroom lessons to authentic engineering tasks.",
        tag: "Internship",
      },
      {
        id: "y2-career",
        title: "Professional & Career Development",
        description:
          "Sharpening interviews, technical communication, adaptability, and long-term habits for a career in software.",
        tag: "Career Prep",
      },
    ],
    reflection:
      "Year 2 transformed how I think — I stopped just completing assignments and started thinking like a Software Engineer.",
  },
  {
    id: "my-future",
    stepNumber: "03",
    title: "My Future – Becoming a Software Engineer",
    shortTitle: "My Future",
    period: "Beyond PNC",
    tagline: "Carrying two years of grit, friendship, and curiosity into the tech industry.",
    summary:
      "Graduating from PNC is not the finish line — it is the launchpad. With strong fundamentals and an unshakeable mindset of continuous learning, I am ready to build meaningful software and keep advancing.",
    accentColor: "#F59E0B",
    glowColor: "rgba(245, 158, 11, 0.24)",
    milestones: [
      {
        id: "future-goals",
        title: "My Professional Goals",
        description:
          "Grow into a reliable Full-Stack / Software Engineer contributing to impactful products, clean codebases, and collaborative teams.",
        tag: "Career Goal",
      },
      {
        id: "future-tech",
        title: "Technologies I Want to Master",
        description:
          "TypeScript, Next.js, React, Node.js, scalable backend architectures, cloud deployment, automated testing, and modern databases.",
        tag: "Tech Roadmap",
      },
      {
        id: "future-vision",
        title: "My Vision for the Future",
        description:
          "Support my family, keep uplifting Cambodian tech communities, and inspire future students who start where I once started.",
        tag: "Impact",
      },
    ],
    reflection:
      "Two Years. Countless Memories. Endless Possibilities — ready for the next chapter in software engineering.",
  },
];

export const SPORTS_CONTENT = {
  intro:
    "Outside classrooms and coding labs, sports kept our cohort energized, united, and smiling. On the football pitch, provincial boundaries disappeared and we played as one team.",
  highlights: [
    {
      title: "Football Sessions & Weekend Matches",
      description:
        "Friendly matches after class where stress turned into energy, teamwork, and unforgettable goal celebrations.",
      badge: "Football",
    },
    {
      title: "Teamwork & Collaboration on the Pitch",
      description:
        "Communication, passing, trusting teammates, and supporting one another — the same mindset we brought into software projects.",
      badge: "Team Spirit",
    },
    {
      title: "Inter-Class & School Competitions",
      description:
        "Cheering from the sidelines, organizing jerseys, and giving our best effort together in school sports tournaments.",
      badge: "Competitions",
    },
    {
      title: "Memorable Moments with Friends",
      description:
        "Post-match water breaks, laughs after missed shots, and friendships forged under the afternoon sun.",
      badge: "Friendship",
    },
  ],
};

export const ACTIVITIES_CONTENT = {
  intro:
    "Life at PNC extended far beyond coding screens. School events, volunteering, community projects, and educational trips shaped us into active, compassionate citizens.",
  highlights: [
    {
      title: "School Events & Cultural Programs",
      description:
        "Preparing stages, supporting student initiatives, and celebrating Cambodian culture and PNC milestones together.",
      badge: "School Events",
    },
    {
      title: "Community Activities & Volunteering",
      description:
        "Giving back through cleanups, sharing knowledge, and supporting meaningful community outreach around campus.",
      badge: "Volunteering",
    },
    {
      title: "Educational Trips & Field Learning",
      description:
        "Exploring places outside the classroom together, broadening perspectives, and documenting new experiences.",
      badge: "Trips",
    },
    {
      title: "Team Building & Special Events",
      description:
        "Games, group challenges, and collaborative activities that brought all ~25 classmates closer together.",
      badge: "Teamwork",
    },
  ],
};

export const PARTIES_CONTENT = {
  intro:
    "From surprise birthday cakes between study sessions to class celebrations and graduation memories, these joyous moments turned classmates into a second family.",
  highlights: [
    {
      title: "Birthday Celebrations",
      description:
        "Pooling together for birthday surprises, singing together, and making every student feel celebrated far from home.",
      badge: "Birthdays",
    },
    {
      title: "Class Parties & Shared Meals",
      description:
        "Celebrating finished exams and major project presentations with music, food, and laughter.",
      badge: "Class Parties",
    },
    {
      title: "Special Events & Cultural Celebrations",
      description:
        "Festive gatherings across the academic calendar where everyone dressed up and shared traditions from their home provinces.",
      badge: "Celebrations",
    },
    {
      title: "Graduation & Funny Unforgettable Moments",
      description:
        "Candid snapshots, inside jokes, group photos, and bittersweet milestones we will remember for years.",
      badge: "Unforgettable",
    },
  ],
};

export const HEALTHY_LIFE_CONTENT = {
  intro:
    "Becoming a strong software engineer requires more than technical skill — it takes physical health, balanced routines, mental resilience, and caring for one another.",
  highlights: [
    {
      title: "Health Awareness & Prevention",
      description:
        "Learning practical knowledge about nutrition, hygiene, sleep, and staying healthy during intensive study schedules.",
      badge: "Awareness",
    },
    {
      title: "Physical & Mental Well-Being",
      description:
        "Balancing long hours in front of laptops with exercise, stretching, fresh air, and open conversations when stress builds up.",
      badge: "Well-Being",
    },
    {
      title: "Daily Healthy Habits",
      description:
        "Building sustainable routines around hydration, morning movement, balanced meals, and screen-break discipline.",
      badge: "Healthy Habits",
    },
    {
      title: "School Health Support & Wellness",
      description:
        "Guided wellness sessions and caring support from PNC staff who look after students' overall growth.",
      badge: "Wellness Support",
    },
  ],
};

export const WORKSHOPS_CONTENT = {
  intro:
    "Workshops, guest speakers, and company visits bridged the gap between our classrooms and Cambodia's real-world technology industry.",
  highlights: [
    {
      title: "IT Workshops & Coding Bootcamps",
      description:
        "Hands-on technical sessions exploring modern frameworks, clean code practices, problem solving, and debugging.",
      badge: "Technical Training",
    },
    {
      title: "Soft Skills, Communication & Leadership",
      description:
        "Practicing public speaking, teamwork facilitation, empathy, feedback culture, and confident presentation skills.",
      badge: "Leadership",
    },
    {
      title: "Career Preparation & Mock Interviews",
      description:
        "Building CVs, practicing technical and behavioral interviews, and learning workplace expectations.",
      badge: "Career Readiness",
    },
    {
      title: "Company Visits & Guest Speakers",
      description:
        "Touring engineering offices, meeting alumni and software professionals, and hearing honest career advice firsthand.",
      badge: "Industry Connect",
    },
  ],
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "languages",
    title: "Programming Languages",
    subtitle: "Core logic and multi-paradigm coding foundations",
    items: [
      { name: "JavaScript", stage: "Year 1 → Year 2", focus: "DOM, async flows, modern ES6+" },
      { name: "TypeScript", stage: "Year 2", focus: "Type-safe applications & clean interfaces" },
      { name: "Python", stage: "Year 1", focus: "Algorithms, scripting & core programming logic" },
      { name: "PHP", stage: "Year 2", focus: "Server-side web application fundamentals" },
      { name: "HTML5 & CSS3", stage: "Year 1", focus: "Semantic markup, Flexbox, Grid & accessibility" },
    ],
  },
  {
    id: "frontend",
    title: "Frontend Development",
    subtitle: "Crafting responsive, engaging, modern interfaces",
    items: [
      { name: "React", stage: "Year 2", focus: "Reusable component architecture & state management" },
      { name: "Next.js", stage: "Year 2", focus: "App Router, TypeScript routing & performance" },
      { name: "Tailwind CSS", stage: "Year 2", focus: "Utility-first responsive design systems" },
      { name: "Vue.js / Bootstrap", stage: "Year 1 → Year 2", focus: "Structured UI components & rapid layouts" },
    ],
  },
  {
    id: "backend",
    title: "Backend & APIs",
    subtitle: "Building reliable server logic and data pipelines",
    items: [
      { name: "Node.js & Express", stage: "Year 2", focus: "RESTful APIs, routing & middleware" },
      { name: "Laravel / MVC", stage: "Year 2", focus: "Structured backend workflows & authentication" },
      { name: "REST API Integration", stage: "Year 2", focus: "JSON contracts, validation & error handling" },
    ],
  },
  {
    id: "database",
    title: "Database & Tools",
    subtitle: "Structured data modeling and team collaboration",
    items: [
      { name: "MySQL / SQL", stage: "Year 1 → Year 2", focus: "Schema design, joins & relational queries" },
      { name: "MongoDB", stage: "Year 2", focus: "Document-based storage & flexible schemas" },
      { name: "Git & GitHub", stage: "Year 1 → Year 2", focus: "Branching, pull requests & team collaboration" },
      { name: "Figma & Agile Basics", stage: "Year 1 → Year 2", focus: "Wireframing, sprint planning & task tracking" },
    ],
  },
];

export const DEVELOPMENT_PROGRESS = [
  {
    phase: "Early Year 1",
    title: "Curiosity & Foundations",
    summary: "First steps with logic puzzles, terminal basics, HTML/CSS layouts, and foundational Python/JavaScript.",
    progressPercent: 32,
  },
  {
    phase: "Late Year 1",
    title: "Interactive Web & Teamwork",
    summary: "Building responsive pages, relational database schemas, and collaborating with classmates using Git.",
    progressPercent: 58,
  },
  {
    phase: "Year 2 Core",
    title: "Full-Stack Engineering",
    summary: "Connecting frontend frameworks with backend APIs, authentication, MVC patterns, and team project sprints.",
    progressPercent: 84,
  },
  {
    phase: "Graduation & Beyond",
    title: "Software Engineer Readiness",
    summary: "TypeScript, Next.js, clean architecture, internship experience, and lifelong technical mastery.",
    progressPercent: 95,
  },
];

export const PROJECT_SLOTS: ProjectSlot[] = [
  {
    id: "proj-pnc-journey",
    title: "My PNC Journey — 3D Storytelling Experience",
    type: "Personal Project",
    phase: "Year 2 / Capstone Showcase",
    summary:
      "An interactive 3D digital storytelling website preserving two years of memories, growth, and engineering ambitions at PNC using Next.js, TypeScript, Tailwind CSS, Framer Motion, and Three.js.",
    role: "Designer & Frontend Engineer",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Three.js", "Framer Motion"],
    highlights: [
      "Interactive 3D hero scene and 3-stage 3D journey timeline",
      "Filterable memory gallery with keyboard-accessible lightbox",
      "Mobile-optimized animations and zero-backend frontend architecture",
    ],
    imageSrc: "/images/projects/pnc-journey-preview.jpg",
    githubUrl: "https://github.com/your-username",
    liveUrl: "",
  },
  {
    id: "proj-team-slot-1",
    title: "[Editable Team Project 1 — Add Your Real Project Title]",
    type: "Team Project",
    phase: "Year 2 Full-Stack Sprint",
    summary:
      "Replace this placeholder with your real PNC team software project — describe the real problem your team solved, what you built together, and what you learned from collaborating with your classmates.",
    role: "[Your Role, e.g. Frontend / Full-Stack Developer]",
    techStack: ["React / Vue", "Node.js / Laravel", "MySQL", "GitHub"],
    highlights: [
      "[Key feature or architecture milestone you contributed]",
      "[Collaboration highlight with your PNC project teammates]",
    ],
    imageSrc: "/images/projects/team-project-1.jpg",
    githubUrl: "https://github.com/your-username",
    liveUrl: "",
  },
  {
    id: "proj-personal-slot-2",
    title: "[Editable Personal Project — Add Your Real Project Title]",
    type: "Personal Project",
    phase: "Year 1 / Year 2 Practice",
    summary:
      "Use this slot to showcase a real personal application or academic assignment you built during Year 1 or Year 2 at PNC, along with a screenshot uploaded to public/images/projects/.",
    role: "Sole Developer",
    techStack: ["JavaScript", "HTML/CSS", "API / Database"],
    highlights: [
      "[Problem solved or core technical achievement]",
      "[What this project taught you on your path to Software Engineering]",
    ],
    imageSrc: "/images/projects/personal-project-1.jpg",
    githubUrl: "https://github.com/your-username",
    liveUrl: "",
  },
];

export const CONTACT_DATA = {
  headline: "Let’s Connect & Build Something Meaningful",
  subtext:
    "Whether you are a recruiter, mentor, fellow PNC alumni, or software engineer, I would love to connect, share my journey, and collaborate on future opportunities.",
  email: "your.email@example.com",
  github: {
    handle: "@your-github-handle",
    url: "https://github.com/your-username",
  },
  linkedin: {
    handle: "in/your-linkedin-profile",
    url: "https://linkedin.com/in/your-profile",
  },
  socials: [
    {
      name: "Facebook",
      handle: "[Your Facebook Name]",
      url: "https://facebook.com",
    },
    {
      name: "Telegram",
      handle: "@your_telegram",
      url: "https://t.me",
    },
  ],
};

/**
 * Editable Photo & Video Memory Slots
 * ----------------------------------
 * Upload your actual photos into `public/images/...` matching the paths below
 * (or add new entries directly to this array). Missing files automatically
 * render an intentional glassmorphic upload-ready placeholder card until your photo is added!
 */
export const MEMORY_ITEMS: MemoryItem[] = [
  {
    id: "mem-y1-first-day",
    title: "First Day Stepping Into PNC",
    caption:
      "[Add your real caption] Remembering the excitement and curiosity of arriving on campus for Year 1.",
    date: "[Year 1 – Month / Date]",
    location: "PNC Campus, Phnom Penh",
    category: "first-year",
    categoryLabel: CATEGORY_LABELS["first-year"],
    imageSrc: "/images/year-1/first-day.jpg",
    mediaType: "image",
    aspect: "landscape",
    featured: true,
  },
  {
    id: "mem-y1-classroom",
    title: "First Coding Labs & Study Nights",
    caption:
      "[Add your real caption] Learning programming fundamentals side by side in the computer lab.",
    date: "[Year 1 – Month / Date]",
    location: "PNC IT Lab",
    category: "first-year",
    categoryLabel: CATEGORY_LABELS["first-year"],
    imageSrc: "/images/year-1/coding-lab.jpg",
    mediaType: "image",
    aspect: "square",
  },
  {
    id: "mem-classmates-cohort",
    title: "Our Cohort Across Cambodia",
    caption:
      "[Add your real caption] Together with classmates from provinces across Cambodia — growing like family.",
    date: "[Cohort Year]",
    location: "PNC Campus",
    category: "classmates",
    categoryLabel: CATEGORY_LABELS["classmates"],
    imageSrc: "/images/classmates/cohort-group.jpg",
    mediaType: "image",
    aspect: "landscape",
    featured: true,
  },
  {
    id: "mem-classmates-friends",
    title: "Between Classes & Campus Smiles",
    caption:
      "[Add your real caption] Candid memories with close friends who made every day brighter.",
    date: "[Month / Year]",
    location: "PNC Courtyard",
    category: "classmates",
    categoryLabel: CATEGORY_LABELS["classmates"],
    imageSrc: "/images/classmates/friends-moment.jpg",
    mediaType: "image",
    aspect: "portrait",
  },
  {
    id: "mem-y2-team-project",
    title: "Year 2 Full-Stack Team Sprint",
    caption:
      "[Add your real caption] Collaborating on architecture, code reviews, and project demos in Year 2.",
    date: "[Year 2 – Month / Date]",
    location: "PNC Project Room",
    category: "second-year",
    categoryLabel: CATEGORY_LABELS["second-year"],
    imageSrc: "/images/year-2/team-sprint.jpg",
    mediaType: "image",
    aspect: "landscape",
    featured: true,
  },
  {
    id: "mem-y2-internship",
    title: "Year 2 Internship & Career Step",
    caption:
      "[Add your real caption] Stepping toward professional Software Engineering through real-world experience.",
    date: "[Year 2 – Month / Date]",
    location: "[Company / Phnom Penh]",
    category: "second-year",
    categoryLabel: CATEGORY_LABELS["second-year"],
    imageSrc: "/images/year-2/internship-moment.jpg",
    mediaType: "image",
    aspect: "square",
  },
  {
    id: "mem-sports-football",
    title: "Afternoon Football Match",
    caption:
      "[Add your real caption] Teamwork, energy, and cheering with classmates on the football pitch.",
    date: "[Month / Year]",
    location: "Football Pitch",
    category: "sports",
    categoryLabel: CATEGORY_LABELS["sports"],
    imageSrc: "/images/sports/football-match.jpg",
    mediaType: "image",
    aspect: "landscape",
    featured: true,
  },
  {
    id: "mem-sports-tournament",
    title: "Sports Competition Spirit",
    caption:
      "[Add your real caption] Giving our best together during school sports competitions.",
    date: "[Month / Year]",
    location: "Sports Ground",
    category: "sports",
    categoryLabel: CATEGORY_LABELS["sports"],
    imageSrc: "/images/sports/competition-team.jpg",
    mediaType: "image",
    aspect: "square",
  },
  {
    id: "mem-activities-volunteering",
    title: "Community & Volunteering Day",
    caption:
      "[Add your real caption] Contributing together to meaningful school and community outreach.",
    date: "[Month / Year]",
    location: "Community Activity",
    category: "activities",
    categoryLabel: CATEGORY_LABELS["activities"],
    imageSrc: "/images/activities/volunteering.jpg",
    mediaType: "image",
    aspect: "landscape",
  },
  {
    id: "mem-activities-trip",
    title: "Educational Field Trip",
    caption:
      "[Add your real caption] Learning outside the classroom and exploring together as a class.",
    date: "[Month / Year]",
    location: "[Trip Location]",
    category: "activities",
    categoryLabel: CATEGORY_LABELS["activities"],
    imageSrc: "/images/activities/educational-trip.jpg",
    mediaType: "image",
    aspect: "portrait",
  },
  {
    id: "mem-parties-birthday",
    title: "Class Birthday Surprise",
    caption:
      "[Add your real caption] Celebrating birthdays together and sharing heartfelt laughs.",
    date: "[Month / Year]",
    location: "PNC Campus",
    category: "parties",
    categoryLabel: CATEGORY_LABELS["parties"],
    imageSrc: "/images/parties/birthday-celebration.jpg",
    mediaType: "image",
    aspect: "square",
  },
  {
    id: "mem-parties-graduation",
    title: "Class Celebration & Unforgettable Night",
    caption:
      "[Add your real caption] Honoring hard work, shared memories, and joyful celebrations.",
    date: "[Month / Year]",
    location: "Celebration Venue",
    category: "parties",
    categoryLabel: CATEGORY_LABELS["parties"],
    imageSrc: "/images/parties/class-party.jpg",
    mediaType: "image",
    aspect: "landscape",
    featured: true,
  },
  {
    id: "mem-workshops-coding",
    title: "Technical Workshop & Coding Training",
    caption:
      "[Add your real caption] Hands-on practice during an IT and software engineering workshop.",
    date: "[Month / Year]",
    location: "PNC Workshop Hall",
    category: "workshops",
    categoryLabel: CATEGORY_LABELS["workshops"],
    imageSrc: "/images/workshops/tech-workshop.jpg",
    mediaType: "image",
    aspect: "landscape",
  },
  {
    id: "mem-workshops-company-visit",
    title: "Company Visit & Guest Speakers",
    caption:
      "[Add your real caption] Learning directly from software industry engineers and mentors.",
    date: "[Month / Year]",
    location: "[Tech Company, Phnom Penh]",
    category: "workshops",
    categoryLabel: CATEGORY_LABELS["workshops"],
    imageSrc: "/images/workshops/company-visit.jpg",
    mediaType: "image",
    aspect: "square",
  },
  {
    id: "mem-events-special",
    title: "Special School Event",
    caption:
      "[Add your real caption] A proud school-wide milestone bringing students, teachers, and guests together.",
    date: "[Month / Year]",
    location: "PNC Main Hall",
    category: "special-events",
    categoryLabel: CATEGORY_LABELS["special-events"],
    imageSrc: "/images/events/school-event.jpg",
    mediaType: "image",
    aspect: "landscape",
    featured: true,
  },
  {
    id: "mem-events-graduation",
    title: "Graduation Milestone",
    caption:
      "[Add your real caption] Two years of determination honored on stage with classmates and mentors.",
    date: "[Graduation Date]",
    location: "Graduation Ceremony",
    category: "special-events",
    categoryLabel: CATEGORY_LABELS["special-events"],
    imageSrc: "/images/events/graduation-day.jpg",
    mediaType: "image",
    aspect: "portrait",
  },
  {
    id: "mem-healthy-wellness",
    title: "Healthy Habits & Wellness Session",
    caption:
      "[Add your real caption] Caring for physical health and mental well-being alongside our studies.",
    date: "[Month / Year]",
    location: "PNC Campus",
    category: "healthy-life",
    categoryLabel: CATEGORY_LABELS["healthy-life"],
    imageSrc: "/images/healthy-life/wellness-session.jpg",
    mediaType: "image",
    aspect: "landscape",
  },
  {
    id: "mem-healthy-morning",
    title: "Active Morning & Balanced Routine",
    caption:
      "[Add your real caption] Staying energized, active, and mindful during busy academic terms.",
    date: "[Month / Year]",
    location: "Campus / Park",
    category: "healthy-life",
    categoryLabel: CATEGORY_LABELS["healthy-life"],
    imageSrc: "/images/healthy-life/active-routine.jpg",
    mediaType: "image",
    aspect: "square",
  },
];
