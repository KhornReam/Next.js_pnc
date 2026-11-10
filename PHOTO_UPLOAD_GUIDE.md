# Photo & Content Customization Guide — My PNC Journey

This project is **100% frontend** (no backend required). All text, milestones, links, and photo/video slots are managed in one file:

- [data/journeyData.ts](data/journeyData.ts)

## 1. Uploading Your Real Photos

Drop your `.jpg`, `.jpeg`, `.png`, or `.webp` photos directly into `public/images/` using these filenames (or update the `imageSrc` path inside `data/journeyData.ts` to match your own filenames):

- **About Me**
  - `public/images/about/portrait.jpg`
  - `public/images/about/hometown-campus.jpg`
- **Year 1 – The Beginning**
  - `public/images/year-1/first-day.jpg`
  - `public/images/year-1/coding-lab.jpg`
- **Year 2 – Growing and Developing**
  - `public/images/year-2/team-sprint.jpg`
  - `public/images/year-2/internship-moment.jpg`
- **Classmates & Friends**
  - `public/images/classmates/cohort-group.jpg`
  - `public/images/classmates/friends-moment.jpg`
- **Sports**
  - `public/images/sports/football-match.jpg`
  - `public/images/sports/competition-team.jpg`
- **Activities**
  - `public/images/activities/volunteering.jpg`
  - `public/images/activities/educational-trip.jpg`
- **Parties & Celebrations**
  - `public/images/parties/birthday-celebration.jpg`
  - `public/images/parties/class-party.jpg`
- **Healthy Life**
  - `public/images/healthy-life/wellness-session.jpg`
  - `public/images/healthy-life/active-routine.jpg`
- **Workshops & Training**
  - `public/images/workshops/tech-workshop.jpg`
  - `public/images/workshops/company-visit.jpg`
- **Special School Events**
  - `public/images/events/school-event.jpg`
  - `public/images/events/graduation-day.jpg`
- **IT Projects**
  - `public/images/projects/pnc-journey-preview.jpg`
  - `public/images/projects/team-project-1.jpg`
  - `public/images/projects/personal-project-1.jpg`

> **Tip:** Before copying files into `public/images/`, you can also click **"Preview Photo"** directly on any placeholder card in the browser to preview how your images look immediately!

## 2. Adding More Photos or Videos

Open `data/journeyData.ts` and add new items to `MEMORY_ITEMS`. For videos, set `mediaType: "video"` and `videoSrc: "/images/your-folder/video.mp4"`.

## 3. Customizing Your Story & Links

Edit these exports in `data/journeyData.ts`:
- `SITE_CONFIG` — your name, cohort/batch, hometown province
- `ABOUT_DATA` — personal background, values, why IT, why PNC
- `JOURNEY_STAGES` — Year 1, Year 2, and My Future milestones
- `PROJECT_SLOTS` — real team and personal software projects
- `CONTACT_DATA` — GitHub, LinkedIn, Email, Facebook, and Telegram links
