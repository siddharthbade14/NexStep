# NexStep — AI-Powered Career Guidance for Indian College Students 🚀

> **"Verified skills. Real roadmaps. Your dream job — mapped."**

NexStep is a responsive career-guidance and placement platform tailored for Indian engineering students (Tier 1, 2, and 3 state universities). It eliminates guesswork by performing **real semantic curriculum-gap analysis** against industry roles, offering **hands-on sandboxed coding verification**, sequencing **curated free learning milestones with re-check quizzes**, rendering an **interactive milestone roadmap**, and matching verified student profiles directly to **high-growth Indian tech internships**.

---

## 🎨 Visual Design Direction & Aesthetics

- **Primary Brand Gradient**: Deep Navy to Teal (`#1F4E5F` → `#2C6E8F`) for hero banners, navigation headers, primary actions, and certified roadmap milestones.
- **Accent Color**: Warm Amber/Gold (`#F4B942` / hover `#EFA92E`) for key CTAs (*"Verify Skill"*, *"See My Roadmap"*), active progress states, and achievement highlights.
- **Surface & Depth**: Subtle dot grid pattern, 12–16px rounded corners (`rounded-2xl` / `rounded-xl`), soft layered drop shadows, and clean glassmorphism accents.
- **Typography**: Modern **Inter** sans-serif font family paired with **JetBrains Mono** for coding challenges.
- **Micro-Interactions**: Smooth 200ms ease transitions, interactive card hover-lifts, animated circular readiness indicators, and celebration confetti on verified milestones.
- **Mobile-First Responsiveness**: Collapsible navigation drawer, responsive flex/grid layouts, and 44px+ touch targets optimized for mobile browsers.

---

## 🏗️ Architecture & Tech Stack

```
c:/SIH-Project/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI entrypoint, CORS, lifespan model pre-warming
│   │   ├── config.py                   # App configuration & Judge0 environment
│   │   ├── db/
│   │   │   ├── session.py              # SQLite engine, schema initialization & demo seeding
│   │   ├── data/
│   │   │   ├── curricula.json          # B.Tech CSE & ECE semester-wise syllabi
│   │   │   ├── roles.json              # Software Developer, Data Analyst, Embedded Systems Engineer
│   │   │   ├── challenges.json         # Interactive coding tasks, starter code, test assertions
│   │   │   ├── resources.json          # Curated free learning guides & 3-question quizzes
│   │   │   └── internships.json        # 12 Indian tech internships (Swiggy, Zerodha, CRED, etc.)
│   │   ├── services/
│   │   │   ├── similarity.py           # sentence-transformers all-MiniLM-L6-v2 semantic matcher
│   │   │   └── code_runner.py          # Sandboxed Python test runner & Judge0 API integration
│   │   └── routers/
│   │       ├── onboarding.py           # Metadata, student profiling & registration
│   │       ├── gap_analysis.py         # Semantic gap calculation & readiness scoring
│   │       ├── verification.py         # Code execution, test assertions & skill verification
│   │       ├── resources.py            # Sequenced learning milestones & re-check quiz loop
│   │       ├── roadmap.py              # Stepper timeline nodes (Navy / Gold / Grey)
│   │       └── opportunities.py        # Verified skill matching with "Why you qualify" tags
│   ├── requirements.txt
│   ├── run.py                          # Uvicorn launcher
│   └── test_solution.py                # Automated end-to-end verification script
│
└── frontend/
    ├── index.html                      # SEO metadata & Inter font imports
    ├── vite.config.js                  # Vite bundler with @tailwindcss/vite and /api proxy
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx                     # Router & global StudentProvider wrapper
    │   ├── index.css                   # Tailwind v4 theme, brand gradients, scrollbar
    │   ├── context/
    │   │   └── StudentContext.jsx      # Global state for profile, verified skills, and roadmap
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Navbar.jsx          # Responsive header with mobile drawer & profile chip
    │   │   │   ├── Footer.jsx          # SaaS footer with Bharat engineering mission
    │   │   │   ├── Button.jsx          # Primary gradient, accent gold, secondary & ghost
    │   │   │   ├── Card.jsx            # 12-16px rounded corners with hover micro-interactions
    │   │   │   ├── ProgressBar.jsx     # Animated circular & linear progress bars
    │   │   │   ├── Badge.jsx           # Status badges (Verified, In Progress, Locked, Gap)
    │   │   │   ├── Modal.jsx           # Accessible dialog backdrop with light dismiss
    │   │   │   └── Confetti.jsx        # Celebration confetti for verified achievements
    │   │   └── layout/
    │   │       └── PageContainer.jsx   # Consistent responsive layout wrapper
    │   ├── pages/
    │   │   ├── LandingPage.jsx         # Hero, How It Works, Why NexStep, Stats banner
    │   │   ├── OnboardingPage.jsx      # 4-step wizard with progress bar & skill pills
    │   │   ├── GapAnalysisPage.jsx     # Circular readiness score & ranked gap skills
    │   │   ├── VerificationPage.jsx    # Coding challenge IDE, test runner, output console
    │   │   ├── ResourcesPage.jsx       # Sequenced learning cards & 3-question re-check quiz
    │   │   ├── RoadmapPage.jsx         # Milestone timeline (Navy / Gold / Grey)
    │   │   └── OpportunitiesPage.jsx   # Qualified internships & "Why you qualify" tags
    │   └── services/
    │       └── api.js                  # Async API client
    └── package.json
```

---

## 🌟 The 7 Core Flows

1. **Landing Page**:
   - Bold hero section with the headline: *"Verified skills. Real roadmaps. Your dream job — mapped."*
   - Interactive live gap engine preview card demonstrating syllabus-to-industry gap detection.
   - Platform stats callout (500+ colleges, 1,200+ mapped skills, 85% placement uplift).
   - "How it Works" (4 stages) and "Why NexStep" value proposition cards.

2. **4-Step Onboarding Flow**:
   - Step 1: Full Name, College / University, Course selection (B.Tech CSE / ECE / IT / EE).
   - Step 2: Semester selector (Sem 1–8) + self-reported skills tag cloud + custom input.
   - Step 3: Target Dream Role selection (Software Developer, Data Analyst, Embedded Systems Engineer).
   - Step 4: Preferred guidance language (English, Hindi, Tamil, Telugu, etc.) and profile summary review.

3. **Gap Analysis Dashboard (The Core Screen)**:
   - Real semantic embedding similarity computation using `sentence-transformers` (`all-MiniLM-L6-v2`).
   - Compares student's completed semester subjects against target role requirements.
   - Circular animated readiness progress widget ("X% Industry Readiness").
   - Ranked cards for every gap skill with:
     - Name and category badge
     - Recruiter relevance context (*"Why recruiters test this"*)
     - Expected industry depth
     - Closest college syllabus subject
     - Warm Gold CTA: *"Verify This Skill"*

4. **Skill Verification IDE**:
   - Interactive coding environment with problem prompt, test case expectations, and Monaco-style dark code editor.
   - Sandboxed Python test runner (and Judge0 API integration) executing submitted code against 3 test cases.
   - Real-time console reporting: execution time in ms, passed/failed assertions, expected vs actual diffs.
   - *"Demo Solution"* one-click filler for live hackathon judge demonstrations.
   - Confetti micro-interaction and instant verification badge upgrade upon passing.

5. **Resource Recommender & Re-check Quiz**:
   - Curated free resources with real working links (freeCodeCamp, MDN, W3Schools, Python Docs).
   - Sequenced in dependency order — locked until the prior milestone's re-check quiz is passed.
   - Interactive 3-question quiz modal with instant evaluation (2/3 passing threshold) to unlock the next milestone.

6. **Roadmap Visualization (The Hero Visual)**:
   - Visual vertical milestone timeline connecting:
     - `College Core Curriculum` (Verified, Deep Navy)
     - `Industry Gap Milestones` (Sequenced: Navy = verified, Warm Amber = in progress, Slate Grey = locked)
     - `Target Role Goal` (Software Developer / Data Analyst / Embedded Systems Engineer)
   - Interactive milestone cards with deep-dive detail inspector card.

7. **Opportunity Matcher**:
   - 12 real-world Indian tech internships (Swiggy, Zerodha, Texas Instruments, CRED, PhonePe, Infosys Springboard, etc.).
   - Dynamically filtered based on the student's *verified* skills profile.
   - Match percentage badge, stipend in INR, location, and transparent *"Why You Qualify"* analysis.
   - 1-click *"Quick Apply"* simulated flow including code test proofs for recruiters.

---

## ⚡ Quickstart & Running Locally

### 1. Backend Setup (FastAPI)
```bash
cd backend
# Virtual environment is already configured in backend/.venv
.\.venv\Scripts\python run.py
```
*Backend API will be live at `http://127.0.0.1:8000` (API Docs at `http://127.0.0.1:8000/docs`).*

### 2. Frontend Setup (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Frontend will be live at `http://localhost:5173`.*

### 3. Run Automated Integration Test
```bash
cd backend
.\.venv\Scripts\python test_solution.py
```

---

## 🏆 Smart India Hackathon Demo Highlights
1. **Zero Hallucination AI**: Uses real `sentence-transformers` embeddings to detect syllabus coverage instead of generic prompt generation.
2. **True Verification**: Skills are only marked verified when code passes automated assertions in an isolated sandbox.
3. **Transparent Recruitment**: Every internship card explains *why* the student qualifies based on verified proof-of-work.
