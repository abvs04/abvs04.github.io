/* =====================================================================
   PORTFOLIO CONTENT
   Everything you'll want to edit lives in this file.
   - PROFILE: your name, title, contact links.
   - PROJECTS: one entry per project. `sample: true` marks copy that was
     written as a placeholder — replace it with the real story before
     you publish. Media paths point into /media/<slug>/.
   ===================================================================== */

window.PROFILE = {
  name: "Abhinav Sharma",
  role: "Project Manager, Interactive Media",
  tagline: "Project Manager · Interactive Media · XR",
  short: "I lead interactive projects from the first scoping call to opening day: games, museum installations, training simulations, AI experiences and XR.",
  mediaList: ["Games", "Installations", "Training sims", "AI experiences", "XR"],
  // The five projects that fly in during the 3D showcase, in order
  showcase: ["joramco-mr", "bis-museum", "unfpa-midwifery", "adihex", "alain-falcon"],
  status: "Open to opportunities",
  resume: "resume.pdf",                    // ← drop your PDF next to index.html with this name
  // Hero headline: wrap the word to highlight in *asterisks*
  headlineMarked: "I turn ideas into *immersive* experiences.",
  quote: { text: "Blending creativity, technical skills and strategic thinking to bring ideas to life.", by: "Abhinav Sharma" },
  studio: "DJX Labs",
  location: "India · working with teams in the Gulf and beyond", // ← edit
  email: "abhinav.abvs04@gmail.com",
  // career totals (this site shows a selection from DJX Labs)
  stats: [{ v: "30+", l: "projects" }, { v: "20+", l: "clients" }, { v: "20+", l: "shipped" }, { v: "01", l: "product in development" }],
  clients: {
    international: ["Deloitte", "ZS", "VisionX", "UNFPA", "ArcelorMittal", "Infopro Learning", "Anglo American", "Skillsoft", "ADNOC", "AHA"],
    india: ["BIS", "HAL", "DRDO", "DMRC", "JSW", "Ministry of Rural Development", "Lucknow AI City", "Keltron", "Government of Kerala"]
  },
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/abhinav-sharma-a577ba161" },
    { label: "ArtStation", href: "https://abvs.artstation.com/projects" },
    { label: "YouTube", href: "https://www.youtube.com/@TheJobSquadHD" },
    { label: "X", href: "https://x.com/abhi_TJS" },
    { label: "Resume (PDF)", href: "resume.pdf" }   // drop resume.pdf next to index.html
  ],
  // About section. Edit freely.
  about: [
    "I came to project management from the other side of the table. I studied computer games development, built levels and environments in Unreal Engine and Unity, and modelled 3D assets in Blender and Substance Painter.",
    "I then did a master’s in design innovation management, where my research was on virtual and augmented reality in education. That’s where design thinking and business planning became part of how I work.",
    "At DJX Labs I lead the 3D team and run interactive projects, from touch walls and AI kiosks to games and headset training. Because I can open the project, read the scene and judge an estimate from the inside, conversations with developers and artists move faster and scope stays honest. I also run my own local AI setup, so I know what generative video and voice can actually deliver on a deadline."
  ],
  background: [
    { label: "Studied", value: "Computer games development" },
    { label: "Master’s", value: "Design innovation management" },
    { label: "Research", value: "VR and AR in education" },
    { label: "Leads", value: "The 3D team at DJX Labs, alongside project management" },
    { label: "Hands-on", value: "Unreal, Unity, Blender, Substance Painter" },
    { label: "AI tools", value: "ComfyUI locally; Seedance, Kling and Runway for video; ElevenLabs for voice" }
  ],
  available: true,
  headline: "I get XR out of the prototype stage and into people’s hands.",
  intro:
    "I’m a project manager for interactive media. I bring clients, developers and artists together to ship games, museum installations, training simulations, AI experiences and XR, and I make sure what we build holds up in front of real people."
};

window.CATEGORIES = [
  { id: "all", label: "All work" },
  { id: "training", label: "Training sims", intro: "Practice for jobs where mistakes are expensive: aircraft engines, avionics, repairs and steel lines." },
  { id: "games", label: "Games", intro: "Things people play, in a headset, on a phone or across a living room floor." },
  { id: "installations", label: "Installations & AI", intro: "Built for a physical room: touch walls, AI characters and experiences people walk up to." },
  { id: "heritage", label: "Heritage & culture", intro: "Bringing places and history back to life for the people who visit them." },
  { id: "learning", label: "Learning & social impact", intro: "Learning for people who are usually left out: preschoolers, midwives and public-sector teams." }
];

window.PROJECTS = [
  {
    slug: "joramco-mr",
    tags: ["MR", "training sim", "aviation"],
    title: "Engine Fan Blade Replacement",
    client: "Joramco",
    sector: "Aviation MRO",
    category: "training",
    medium: "MR",
    platform: "Meta Quest 3",
    year: "2026",
    status: "shipped",
    featured: true,
    tagline: "An 8-step mixed reality procedure for replacing a damaged turbofan blade, practised on a full-scale engine that isn’t really there.",
    brief:
      "Joramco’s technicians learn fan blade replacement on live engines, and engine time is scarce and expensive. The module puts a full-scale turbofan into the training room in passthrough MR. Trainees diagnose damage with a virtual scanner, then work through nose cone removal, blade identification, retainer unclipping, installation and final inspection, with a progress panel that tracks every step.",
    role: [
      "Ran discovery sessions with Joramco’s training leads to turn the maintenance manual into an interactive step graph",
      "Owned the sprint plan across Unity dev, 3D and UX, and held scope to an 8-step core loop for v1",
      "Set up on-device QA on Quest 3 in a hangar-like environment and managed the client acceptance round"
    ],
    outcomes: [
      "Three diagnostic scenarios: compressor blade damage, turbine blade thermal distress, fan FOD",
      "Hand-tracked tool interactions with step-level guidance and a completion report",
      "Used as a showcase at DJX Labs’ aviation pitches"
    ],
    stack: ["Unity", "Meta XR SDK", "Hand tracking", "Passthrough MR"],
    team: "2 weeks",
    sample: true,
    media: { loop: "loop.mp4", poster: "poster.jpg" },
    deck: ["deck-1.jpg", "deck-4.jpg", "deck-8.jpg", "deck-12.jpg", "deck-16.jpg", "deck-21.jpg"]
  },
  {
    slug: "joramco-splat",
    tags: ["VR", "gaussian splats", "aviation"],
    title: "Avionics LRU Replacement",
    client: "Joramco",
    sector: "Aviation MRO",
    category: "training",
    medium: "VR",
    platform: "Meta Quest 3 · Gaussian splats",
    year: "2026",
    status: "shipped",
    featured: true,
    tagline: "A real aircraft avionics bay, captured as a Gaussian splat, where trainees find and swap a faulty line-replaceable unit.",
    brief:
      "Modelling a cramped avionics bay by hand would take months and still look wrong. We captured the real bay as a Gaussian splat and added 3D elements for the parts trainees handle, then built the interaction layer on top. Trainees find the faulty unit by its ID, pull it, seat the replacement and run system checks. At the end they’re scored on time and accuracy.",
    role: [
      "Pitched splat capture as the faster, more faithful route",
      "Delivered it in 4 days with a team of three: Gaussian splat plus 3D elements",
      "Coordinated the on-site capture window with Joramco engineering",
      "Defined the scoring model (time, accuracy, experience grade) with the client’s training team"
    ],
    outcomes: [
      "Built in 4 days, from capture to scored training",
      "Photoreal training environment without a full 3D modelling pass",
      "Scored assessment flow trainers can use to sign off practice runs",
      "A repeatable capture-to-headset pipeline for future bays"
    ],
    stack: ["Unity", "Gaussian splatting", "Meta XR SDK"],
    team: "3 people · 4 days",
    sample: true,
    media: { loop: "loop.mp4", poster: "poster.jpg" }
  },
  {
    slug: "drone-mr",
    tags: ["MR", "hand tracking", "repair training"],
    title: "Drone Repair Lab",
    client: "DJX Labs R&D",
    sector: "Technical training",
    category: "training",
    medium: "MR",
    platform: "Meta Quest 3",
    year: "2026",
    status: "shipped",
    tagline: "A hands-only MR repair bench: open the drone, replace a motor and put it back together on your own table.",
    brief:
      "This is an internal R&D piece to show how quickly a hardware repair procedure can become a mixed reality lesson. A virtual drone sits on a real table. You remove the battery, open the casing, swap the rear motor, tighten the screws and reattach the propellers, all with your bare hands.",
    role: [
      "Scoped it as a two-sprint showcase with a fixed demo date",
      "Wrote the step script and success criteria",
      "Produced the launch video and LinkedIn rollout"
    ],
    outcomes: [
      "Reusable MR step-guidance framework, later used in client pitches",
      "Strong engagement on the launch post"
    ],
    stack: ["Unity", "Hand tracking", "Passthrough MR"],
    team: "2 weeks",
    sample: true,
    media: { loop: "loop.mp4", poster: "poster.jpg" }
  },
  {
    slug: "rc-car",
    tags: ["MR", "scene understanding", "racing"],
    title: "MR RC Racer",
    client: "DJX Labs R&D",
    sector: "Gaming",
    category: "games",
    medium: "MR",
    platform: "Meta Quest 3",
    year: "2026",
    status: "prototype",
    tagline: "One room, infinite tracks. The track drapes over your boxes, sofa and floor, and you race a tiny car through it.",
    brief:
      "A mixed reality racing prototype built on scene understanding. The game reads your room and generates a track that runs across furniture and around obstacles, so every room plays differently.",
    role: [
      "Ran it as a one-week, game-jam style sprint",
      "Organised playtests across different room layouts",
      "Shaped the vertical slice for publisher conversations"
    ],
    outcomes: [
      "Playable vertical slice with procedural room-aware tracks",
      "Launch clip used as a studio showreel piece"
    ],
    stack: ["Unity", "Scene API", "MR Utility Kit"],
    team: "1 week",
    sample: true,
    media: { loop: "loop.mp4", poster: "poster.jpg" }
  },
  {
    slug: "aha-falcon",
    tags: ["mobile", "game design", "Gulf heritage"],
    title: "AHA Falcon Game",
    client: "AHA",
    sector: "Gaming · Gulf heritage",
    category: "games",
    medium: "Game",
    platform: "Mobile",
    year: "2026",
    status: "in production",
    featured: true,
    tagline: "A falconry game built on real Gulf competition formats: speed races, heritage hunts and beauty shows.",
    brief:
      "The game is built around three pillars of modern falconry. In speed races, falcons chase drone lures over an electronically timed 400 m sprint. Heritage hunting trials score pursuit, stoop and endurance in the style of Bedouin traditions. Shows and training cover conformation, obedience and team demonstrations. Players raise, train and compete with Peregrine, Saker and hybrid falcons.",
    role: [
      "Researched competition formats with the client and turned them into game modes",
      "Owned the production roadmap and milestone reviews with AHA",
      "Ran art direction reviews for desert environments and falcon models"
    ],
    outcomes: [
      "Three game modes mapped to real competition categories",
      "Pitch deck and vertical slice approved for full production"
    ],
    stack: ["Unity", "Mobile", "Live-ops planning"],
    team: "7 people · ongoing",
    sample: true,
    media: { poster: "poster.jpg", stills: ["still-1.jpg", "still-2.jpg", "still-3.jpg", "still-4.jpg", "still-5.jpg", "still-6.jpg"] }
  },
  {
    slug: "alain-falcon",
    tags: ["arcade", "joystick", "heritage quiz"],
    title: "Wingstrike: Al Ain Falcon Game",
    client: "Al Ain Heritage Festival",
    sector: "Gaming · Heritage festival",
    category: "games",
    medium: "Game",
    platform: "Portrait screen + arcade joystick",
    year: "2026",
    status: "shipped",
    tagline: "A two-minute arcade flight over Al Ain: steer a falcon with a joystick and answer heritage questions by flying through the right answer.",
    brief:
      "A festival game had to teach something without feeling like a quiz. Instead of questions and buttons, the player steers a falcon left and right with a joystick over a stylised Al Ain: city blocks, the oasis and its falaj channels, Al Jahili Fort and the winding mountain road. Questions about Al Ain and Abu Dhabi heritage appear mid-flight and the answers sit in the landscape, so choosing means flying into one. Gems add to the score, three lives and a two-minute timer keep the pace up, and a scorecard ranks each run against the day’s top three. Questions run in Arabic and English and were written from public heritage sources.",
    role: [
      "Ran production and progress reviews for the festival build",
      "Turned the question-and-answer brief into a navigate-to-choose mechanic",
      "Coordinated the Al Ain question bank, design updates and the joystick setup"
    ],
    outcomes: [
      "Two-minute runs built for a festival queue",
      "Heritage questions answered by flying, not tapping"
    ],
    stack: ["Unity", "Arcade joystick", "Arabic + English content"],
    team: "4 people · 1 week",
    sample: true,
    media: { loop: "loop.mp4", poster: "poster.jpg", stills: ["still-1.jpg", "still-7.jpg", "still-2.jpg", "still-3.jpg", "still-4.jpg", "still-5.jpg", "still-6.jpg"] }
  },
  {
    slug: "f1-pitstop",
    tags: ["MR", "VR", "multiplayer"],
    title: "F1 Pit Stop Experience",
    client: "VisionX",
    sector: "Motorsport · Brand experience",
    category: "games",
    medium: "MR + VR",
    platform: "Meta Quest · multiplayer",
    year: "2026",
    status: "shipped",
    tagline: "A multiplayer F1 experience: a full-size car parked in your room in mixed reality, and a pit lane you can step into together in VR.",
    brief:
      "Two ways into Formula 1. In mixed reality, a full-scale F1 car appears on the floor of whatever room you are in, and you walk around it while info panels introduce the car and its parts. In VR, players share a branded pit lane and garage, next to the car on its marks, with the tyre racks and team boxes around them. When I joined there was already a first version, and the 3D needed to get a lot better.",
    role: [
      "Got the 3D redone and raised it well above the previous version: car, pit lane and garage",
      "Ran multiplayer testing, so several headsets share the same pit lane reliably",
      "Managed delivery with VisionX through to the final build"
    ],
    outcomes: [
      "3D quality clearly above the version I inherited",
      "Multiplayer sessions tested across headsets"
    ],
    stack: ["Unity", "Meta Quest", "Passthrough MR", "Multiplayer"],
    team: "4 people · 4 weeks",
    media: { loop: "loop.mp4", poster: "poster.jpg", stills: ["still-1.jpg", "still-2.jpg", "still-3.jpg", "still-4.jpg", "still-5.jpg"] }
  },
  {
    slug: "pop-mankous",
    tags: ["interactive presentation", "AI video", "camera tracking"],
    title: "PoP. Mankous",
    client: "DJX Labs",
    sector: "Interactive presentation · UAE heritage",
    category: "heritage",
    medium: "Interactive presentation",
    platform: "PC · Unity",
    year: "2026",
    status: "shipped",
    tagline: "A presentation you travel through: slides placed inside real locations, AI video between stops, and a 3D island to come back to.",
    brief:
      "Instead of clicking through a slide deck, the audience moved through real places, such as Qasr Al Jahili and Zayed National Museum, with each slide tracked into the scene so it sits in the location rather than on top of it. AI-generated video carried the journey between stops, and every chapter returned to a stylised 3D island that worked as the menu. Built in Unity, with camera tracking done in Blender.",
    role: [
      "Produced it end to end with a three-person team: me, a developer and a 3D artist",
      "Shaped the flow: real location, slides in the scene, then back to the 3D island",
      "Coordinated the AI video, the Unity build and the Blender tracking passes"
    ],
    outcomes: [
      "Shipped in 2 weeks",
      "Slides that live inside real places instead of on a flat screen"
    ],
    stack: ["Unity", "AI video", "Blender camera tracking"],
    team: "3 people · 2 weeks",
    media: { loop: "loop.mp4", poster: "poster.jpg", stills: ["still-3.jpg", "still-5.jpg", "still-6.jpg", "still-7.jpg", "still-8.jpg", "still-1.jpg", "still-2.jpg", "still-4.jpg"] }
  },
  {
    slug: "adnoc-ai",
    tags: ["AI avatar", "voice", "kiosk"],
    title: "Cyber Aware AI Assistant",
    client: "ADNOC",
    sector: "Energy · Cybersecurity",
    category: "installations",
    medium: "AI kiosk",
    platform: "Portrait display + touch console",
    year: "2026",
    status: "shipped",
    tagline: "A voice-driven AI character that answers staff questions on AI governance and cyber awareness, live on the floor.",
    brief:
      "ADNOC wanted cyber and AI awareness to feel like a conversation instead of a slide deck. We built a holographic-style AI character on a tall portrait display, paired with a touch console of suggested questions and a microphone for free-form voice queries. Answers are spoken back with a live waveform and captions.",
    role: [
      "Managed delivery against a fixed event date",
      "Worked with ADNOC stakeholders on approved answer content and guardrails",
      "Coordinated hardware: display, console, microphone and on-site install"
    ],
    outcomes: [
      "Live at an ADNOC event with continuous visitor use",
      "Content approval workflow the client could run themselves"
    ],
    stack: ["Unity", "LLM + speech pipeline", "Touch UI"],
    team: "2 weeks",
    sample: true,
    media: { loop: "loop.mp4", poster: "poster.jpg", photo: "photo.jpg" }
  },
  {
    slug: "adihex",
    tags: ["RFID", "100-inch touch", "event"],
    title: "ADIHEX Heritage Explorer",
    client: "AHA",
    sector: "Abu Dhabi Heritage Authority · ADIHEX 2026",
    category: "installations",
    medium: "Interactive installation",
    platform: "100-inch touch screen + RFID",
    year: "2026",
    status: "shipped",
    tagline: "Place a card, fly to a place: an RFID and touch experience on a 100-inch screen for AHA at ADIHEX.",
    brief:
      "Visitors placed an RFID card on the reader and the screen took them to that place: Abu Dhabi, Al Ain, Al Dhafra, or AHA’s Heritage to the World programme. Each location opened on a 3D landmark ringed by a carousel of information cards that visitors could spin and tap, in English or Arabic. The whole app was made in one week for the Abu Dhabi International Hunting and Equestrian Exhibition, including testing, client feedback and sign-off.",
    role: [
      "In charge of production, from brief to sign-off",
      "Fitted build, testing, client feedback and sign-off into a single week",
      "Coordinated the RFID cards and reader, the 100-inch touch display and bilingual content"
    ],
    outcomes: [
      "Built, tested and signed off in 1 week",
      "Live on the AHA stand at ADIHEX 2026"
    ],
    stack: ["RFID", "Touch UI", "English + Arabic content"],
    team: "1 week, brief to sign-off",
    media: { loop: "loop.mp4", poster: "poster.jpg", photo: "photo.jpg", stills: ["still-1.jpg", "still-2.jpg", "still-3.jpg", "still-4.jpg", "still-5.jpg", "still-6.jpg", "still-7.jpg", "still-8.jpg", "still-9.jpg"] }
  },
  {
    slug: "ridge-centre",
    tags: ["AI Holobox", "3D character", "10 exhibits"],
    title: "Ridge Interpretation Centre",
    client: "DMRC",
    sector: "Interpretation centre · Delhi Ridge",
    category: "installations",
    medium: "Interactive exhibits",
    platform: "Holobox, holographic displays, VR, AR, touch",
    year: "2026",
    status: "shipped",
    tagline: "Ten digital exhibits about the Delhi Ridge at Patel Chowk, led by an AI Holobox guide who answers visitors’ questions as a 3D character.",
    brief:
      "The Delhi Ridge is the northern end of the Aravallis, one of the oldest mountain ranges in the world, and today survives as green pockets inside the city. The interpretation centre at Patel Chowk tells that story through 10 digital exhibits: a holographic pyramid of 3D models, holographic fans of the Ridge’s flora and fauna, a 360° VR film, a projection-mapped flip book, a multi-touch table, AR wall infographics and posters, and an AI Holobox guide. On the 75-inch transparent Holobox, a 3D character greets visitors, listens through a push-to-talk microphone and answers from an offline knowledge base with text-to-speech and lip-sync. Suggested questions on a touch kiosk act as a fallback.",
    role: [
      "Owned the Holobox exhibit end to end, from the knowledge base to the 3D character and its animations",
      "Shaped the question-and-answer flow: voice by push-to-talk, with touch questions as a fallback",
      "Coordinated character design, animation, text-to-speech, lip-sync and on-site install"
    ],
    outcomes: [
      "10 exhibits shipped for the centre",
      "An AI guide that runs offline, speaks with lip-sync and never leaves a visitor without an answer"
    ],
    stack: ["Unity", "Offline knowledge base", "TTS + lip-sync", "3D character animation"],
    team: "2 weeks · led the Holobox",
    media: { loop: "loop.mp4", poster: "poster.jpg", stills: ["still-1.jpg", "still-2.jpg", "still-3.jpg", "still-4.jpg", "still-5.jpg"] }
  },
  {
    slug: "zs-avatars",
    tags: ["VR", "AI avatars", "enterprise"],
    title: "AI Avatar Meeting Room",
    client: "ZS",
    sector: "Consulting · Enterprise AI",
    category: "installations",
    medium: "VR + AI",
    platform: "Meta Quest 3",
    year: "2026",
    status: "shipped",
    tagline: "A virtual meeting room where AI colleagues, a project coordinator and a data analyst, walk you through live dashboards.",
    brief:
      "ZS wanted to show what working alongside AI agents might feel like. In the headset you join a meeting room with named AI avatars, each with a role. They speak, react and pull up floating panels such as project status, data quality reports and business impact charts as the conversation moves.",
    role: [
      "Ran scope workshops to choose which agent personas made the cut",
      "Coordinated avatar, voice and dashboard workstreams",
      "Owned demo readiness for ZS leadership sessions"
    ],
    outcomes: [
      "Multi-avatar conversational demo with live data panels",
      "Used in ZS client innovation sessions"
    ],
    stack: ["Unity", "AI avatars", "TTS / STT", "Data viz"],
    team: "3 weeks",
    sample: true,
    media: { loop: "loop.mp4", poster: "poster.jpg" }
  },
  {
    slug: "bis-museum",
    tags: ["17 exhibits", "AR · VR · AI", "museum"],
    title: "BIS Museum of Standards",
    client: "Bureau of Indian Standards",
    sector: "Museums · Government",
    category: "installations",
    medium: "Interactive museum",
    platform: "Touch walls, AR, VR, AI Holobox, projection, kiosks",
    year: "2026",
    status: "shipped",
    featured: true,
    tagline: "A 17-exhibit interactive museum for the Bureau of Indian Standards in Noida, tracing standards from ancient weights and measures to Digital BIS.",
    brief:
      "Standards are everywhere and invisible. The BIS museum in Noida had to make them something visitors want to touch: where standardisation came from, what BIS does, how hallmarking and certification work, and what a world without standards would look like. The museum runs as 17 interactive exhibits, from room-scale touch walls and a projection-mapped table to VR, AR, an AI Holobox character that answers questions by voice, quizzes and feedback kiosks.",
    role: [
      "Led 6 of the 17 exhibits: AR, VR, an AI Holobox character, touch walls, interactive projection and a kiosk",
      "Took each one from content and design through build, install and sign-off with BIS",
      "Coordinated the hardware for each exhibit: lidar touch walls, VR headset, tablets, projector and Holobox"
    ],
    outcomes: [
      "17 interactive exhibits live in the museum",
      "6 exhibits led across AR, VR, AI, touch, projection and kiosk"
    ],
    stack: ["Unity", "AR · VR", "AI character", "Lidar touch", "Projection mapping"],
    team: "24 weeks · led 6 of 17 exhibits",
    media: { loop: "loop.mp4", poster: "poster.jpg" }
  },
  {
    slug: "musexr",
    tags: ["MR", "heritage", "spatial anchors"],
    title: "WeevXR",
    client: "Weev · DJX Labs product",
    sector: "Heritage tourism",
    category: "heritage",
    medium: "MR",
    platform: "Meta Quest 3",
    year: "2026",
    status: "in production",
    featured: true,
    tagline: "The XR side of Weev, DJX Labs’ own product (previously MuseXR): walk a heritage site and watch its lost artefacts and stories appear where they once stood.",
    brief:
      "Weev is DJX Labs’ own product, currently in development, and WeevXR (previously MuseXR) is the mixed reality part of it, which is what I worked on. On site at Delhi’s monuments, visitors see restored artefacts, portals into the past and narrated stories anchored to the real architecture. A creator tool lets curators place content without code.",
    role: [
      "Worked on WeevXR, the XR part of the Weev product: roadmap, backlog and release planning",
      "Ran on-site field tests at heritage locations",
      "Produced the launch film"
    ],
    outcomes: [
      "Field-tested at outdoor monuments in daylight passthrough",
      "Curator placement tool for content without code"
    ],
    stack: ["Unity", "Spatial anchors", "Passthrough MR"],
    team: "6 people · 5 months",
    sample: true,
    media: { loop: "loop.mp4", poster: "poster.jpg" }
  },
  {
    slug: "kerala-temple",
    tags: ["Gaussian splat", "VR", "1-day POC"],
    title: "Kerala Temple VR",
    client: "Government of Kerala",
    sector: "Heritage · Tourism",
    category: "heritage",
    medium: "VR · Gaussian splat",
    platform: "Meta Quest",
    year: "2025",
    status: "prototype",
    tagline: "A Kerala temple captured as a Gaussian splat and walkable in VR, built in one day to show the government any temple can be captured this way.",
    brief:
      "A proof of concept for the Kerala government. We told them we could turn any temple into a Gaussian splat you can stand inside in VR, then showed it: a lamp-lit temple interior, with carved wooden pillars, rows of oil lamps and kolam on the floor, captured and running in a headset within a single day.",
    role: [
      "Ran the one-day proof of concept with a team of two, from capture to headset",
      "Framed the pitch: a Gaussian splat of any temple, on request",
      "Prepared the VR build for the government demo"
    ],
    outcomes: ["Temple to VR in one day", "A repeatable capture pipeline for any temple"],
    stack: ["Unity", "Baked lighting", "VR"],
    team: "2 people · 1 day",
    sample: true,
    media: { loop: "loop.mp4", poster: "poster.jpg" }
  },
  {
    slug: "keltron-anganwadi",
    tags: ["VR", "early learning", "Malayalam"],
    title: "Anganwadi VR Learning Worlds",
    client: "Keltron",
    sector: "Early-childhood education",
    category: "learning",
    medium: "VR",
    platform: "Meta Quest",
    year: "2026",
    status: "shipped",
    featured: true,
    tagline: "Malayalam-language VR worlds for preschoolers: count reindeer in the snow, photograph colours and meet the farm animals.",
    brief:
      "These learning worlds were built for Kerala’s Anganwadi preschool centres with Keltron. Each world teaches one concept in Malayalam. In Snowy Counting, children count reindeer, snowmen and gifts. In the colour garden, they hunt for colours with a camera. On the farm, they meet the animals. Interactions are big and forgiving, and narration is voiced for small children.",
    role: [
      "Coordinated with education specialists on learning outcomes for each world",
      "Ran child-safety and comfort reviews (session length, locomotion, UI size)",
      "Managed localisation and voice-over in Malayalam"
    ],
    outcomes: [
      "Three learning worlds delivered",
      "Comfort-first design for very young users"
    ],
    stack: ["Unity", "Localisation", "VR"],
    team: "2 weeks",
    sample: true,
    media: { loop: "loop.mp4", poster: "poster.jpg" }
  },
  {
    slug: "unfpa-midwifery",
    tags: ["VR", "global health", "17 modules"],
    title: "Midwifery Training VR",
    client: "UNFPA Benin",
    sector: "Global health",
    category: "learning",
    medium: "VR",
    platform: "Standalone VR",
    year: "2026",
    status: "in production",
    tagline: "17 VR training modules for midwives in Benin, covering birthing, active management of the third stage of labour (AMTSL) and postpartum haemorrhage cases.",
    brief:
      "Midwives in Benin need to rehearse the whole of a birth, including the rare emergencies, where order and hygiene matter as much as technique. We are developing 17 modules for UNFPA Benin across three areas. Birthing covers preparation for birth, normal birth in the supine position, a lateral birth variation and immediate newborn care. AMTSL covers the uterotonic injection, clamping and cutting the cord, signs of placental separation, controlled delivery of the placenta, placenta and cord examination, blood-loss measurement with a calibrated drape, uterine massage and perineal care. The PPH cases cover retained placental tissue, an atonic uterus and a perineal tear. Each module puts the trainee in a realistic delivery room with a patient and a supervising midwife, a checklist of steps beside them and a hand interaction for every action, so skipped or out-of-order steps are caught in the moment.",
    role: [
      "Learned the clinical process for each procedure so it could be turned into steps a trainee can practise",
      "Ran production of all 17 modules with a team of six",
      "Owned client communication with UNFPA Benin"
    ],
    outcomes: [
      "17 modules across birthing, AMTSL and PPH cases",
      "18-week production timeline",
      "Now being localised for UNFPA Botswana and Côte d’Ivoire, with AMTSL and PPH steps adapted to each country’s protocols"
    ],
    stack: ["Unity", "Hand interactions", "Step-by-step assessment"],
    team: "6 people · 18 weeks",
    media: { loop: "loop.mp4", poster: "poster.jpg", stills: ["still-1.jpg", "still-2.jpg", "still-4.jpg", "still-5.jpg", "still-6.jpg", "still-7.jpg", "still-3.jpg", "still-8.jpg"] }
  },
  {
    slug: "unfpa-fiji",
    tags: ["VR", "localisation", "global health"],
    title: "Midwifery Training VR · Fiji",
    client: "UNFPA Fiji",
    sector: "Global health · Pacific",
    category: "learning",
    medium: "VR",
    platform: "Standalone VR",
    year: "2026",
    status: "shipped",
    tagline: "The India midwifery VR model, localised for Fiji to Pacific EmONC guidelines and shipped in four weeks.",
    brief:
      "UNFPA Fiji needed the midwifery VR training that already existed for India, but matched to how care is delivered in the Pacific. We localised the India model to the Pacific EmONC (emergency obstetric and newborn care) guidelines: the delivery room, the clinical steps, the management checklists and the scenario menu, with hand-tracked interactions and a login so each trainee’s progress is their own.",
    role: [
      "Ran the localisation from the India model to the Pacific EmONC steps",
      "Managed the four-week schedule through to shipping",
      "Handled client communication with UNFPA Fiji"
    ],
    outcomes: [
      "Shipped in 4 weeks",
      "A localisation approach now being reused for UNFPA Botswana and Côte d’Ivoire"
    ],
    stack: ["Unity", "Hand tracking", "Localisation"],
    team: "4 weeks",
    media: { loop: "loop.mp4", poster: "poster.jpg", stills: ["still-1.jpg", "still-2.jpg", "still-3.jpg", "still-4.jpg", "still-5.jpg", "still-6.jpg", "still-7.jpg", "still-8.jpg", "still-9.jpg", "still-10.jpg"] }
  },
  {
    slug: "ai-summit",
    tags: ["anamorphic", "Unreal Engine", "Blender"],
    title: "AI Summit Anamorphic Films",
    client: "Lucknow AI City · Ministry of Rural Development",
    sector: "Events · Government",
    category: "installations",
    medium: "Anamorphic 3D films",
    platform: "Corner LED displays",
    year: "2026",
    status: "shipped",
    tagline: "Two anamorphic 3D films for corner LED screens at AI Summit 2026, where drones, maps and buildings appear to burst out of the screen.",
    brief:
      "Two stands at AI Summit 2026 wanted something that stopped people in the aisle. We made two anamorphic films for their corner LED displays: one for Lucknow AI City, with Uttar Pradesh lighting up, smart-city drones and green infrastructure, and one for the Ministry of Rural Development, with its training and housing numbers rising out of the screen. Built in Unreal Engine and Blender, with client feedback rounds inside a two-week schedule.",
    role: [
      "Ran production of both films with a team of three",
      "Managed client feedback rounds for two clients in parallel",
      "Delivered both films for the summit in two weeks"
    ],
    outcomes: [
      "2 anamorphic films shipped in 2 weeks",
      "Live on the stands at AI Summit 2026"
    ],
    stack: ["Unreal Engine", "Blender", "Anamorphic LED"],
    team: "3 people · 2 weeks",
    media: { loop: "loop.mp4", poster: "poster.jpg", photo: "photo.jpg", stills: ["still-1.jpg", "still-2.jpg", "still-3.jpg"] }
  },
  {
    slug: "venue-sims",
    tags: ["digital twin", "venue simulation", "3D"],
    title: "VenueSims",
    client: "Diriyah concept",
    sector: "Smart venues · Saudi Arabia",
    category: "installations",
    medium: "Venue simulation",
    platform: "3D simulation + dashboards",
    year: "2026",
    status: "prototype",
    tagline: "A digital twin concept for a heritage district and its venues: simulate crowds, mobility and events before they happen.",
    brief:
      "VenueSims models a whole district, from the masterplan and exhibition halls down to individual booths, so operators can plan and run it from one command centre. The concept for Diriyah covers real-time crowd management in sensitive heritage zones such as At-Turaif, smart mobility and parking, a digital visitor journey with AR and VR, predictive operations for staffing and transport, heritage asset protection with IoT sensors, public safety for festivals, and retail and hospitality intelligence.",
    role: [
      "Shaped the concept and the capability map with the client",
      "Coordinated the masterplan renders and the 3D venue and booth simulations",
      "Planned how the digital twin would feed a single command centre"
    ],
    outcomes: [
      "District, hall and booth-level 3D simulations",
      "A capability roadmap from crowd management to heritage asset protection"
    ],
    stack: ["Unity / Unreal", "Digital twin", "IoT data"],
    team: "— people · — weeks",
    sample: true,
    media: { loop: "loop.mp4", poster: "poster.jpg", stills: ["still-1.jpg", "still-2.jpg", "still-3.jpg", "still-4.jpg", "still-5.jpg", "still-6.jpg", "still-7.jpg", "still-8.jpg", "still-9.jpg"] }
  },
  {
    slug: "arcelor",
    tags: ["VR POC", "blended learning", "industrial training"],
    title: "Souring Line VR Training",
    client: "Infopro Learning",
    sector: "For ArcelorMittal AMTB · Steel",
    category: "training",
    medium: "VR + desktop simulation",
    platform: "Meta Quest + desktop",
    year: "2026",
    status: "prototype",
    tagline: "A VR proof of concept for the AMTB Souring weld line: the first step in moving operator onboarding from slides and trainer-led gates to a blended, measurable pathway.",
    brief:
      "Onboarding on each AMTB weld line took 30 to 35 hours of trainer-led slides and on-the-job learning. The first two gates needed a trainer physically present, operators met live machinery before they felt confident, and there was no data on who was struggling, across three sites in North America. The plan was a blended journey launched from the client’s LMS: eLearning and 3D video for the concepts, short VR sessions of 5 to 10 minutes for practice, a desktop simulation for anyone who can’t or won’t wear a headset, and assessments that unlock each gate. The proof of concept tests that model on one scenario, pre-positioning blanks from the PTab through the LUni and LEEf onto the MagFi, in five tasks: equipment orientation, blank pickup, transfer, final crowding, and a knowledge check with a corrective-action decision. Its job is to show whether VR beats the current method on learning outcomes and time to proficiency, not just to demo the technology.",
    role: [
      "Planned the proof of concept: scope, five learning tasks, and a 10-week schedule from kick-off to acceptance",
      "Answered ArcelorMittal’s concerns (mixed-age staff, headset comfort, a no-headset option, LMS launch) with short VR sessions, a parallel desktop sim and tracked assessments",
      "Built in client checkpoints at kick-off, storyboard, first playable with pilot operators, iteration sign-off and final acceptance"
    ],
    outcomes: [
      "POC scoped: 5 tasks, about 5 minutes in VR, desktop version in parallel",
      "Gates 1 and 2 redesigned as a self-paced digital pathway, with trainers focused on a short Q&A gate",
      "A roadmap from the POC to a three-level curriculum that reuses across weld lines"
    ],
    stack: ["Unity", "VR + desktop sim", "SCORM / LMS", "Performance data log"],
    team: "10-week POC",
    media: { loop: "loop.mp4", poster: "poster.jpg", stills: ["still-1.jpg", "still-2.jpg", "still-3.jpg", "still-4.jpg", "still-5.jpg", "still-6.jpg", "still-7.jpg", "still-8.jpg", "still-9.jpg"] }
  }
];

/* =====================================================================
   LAB — personal & academic work (from abvs.myportfolio.com)
   Images live in media/lab/<slug>-1.jpg, -2.jpg, -3.jpg.
   group: "games" | "3d" | "design". featured: true = large card.
   ===================================================================== */
window.LAB_GROUPS = [
  { id: "all", label: "Everything" },
  { id: "3d", label: "3D & environments" },
  { id: "games", label: "Games", intro: "Things people play, in a headset, on a phone or across a living room floor." },
  { id: "design", label: "Design & research" }
];

window.LAB = [
  // ---------- 3d ----------
  { slug: "abandoned-house", group: "3d", featured: true,
    title: "Abandoned House", kind: "Environment · Unreal Engine 5.5",
    note: "A house swallowed by jungle, with sagging roof, peeling paint, mist on the ground and light breaking through the canopy. It’s built for atmosphere first.",
    tools: ["Unreal Engine 5.5", "Lighting", "Set dressing"], url: "https://abvs.myportfolio.com/abandoned-house", images: 3 },
  { slug: "stylized", group: "3d", featured: true,
    title: "Stylized environment", kind: "Game art · Fortnite-inspired",
    note: "Modelled in Blender, sculpted in ZBrush, then baked high-to-low and textured in Substance Painter. The final scene is rendered in Unreal, with a mix of hand-painted and PBR textures that stays light enough to run.",
    tools: ["Blender", "ZBrush", "Substance Painter", "Unreal"], url: "https://abvs.myportfolio.com/fortnite-inspired-stylized-art", images: 3 },
  { slug: "scorpio-n", group: "3d", featured: true,
    title: "Mahindra Scorpio-N", kind: "Automotive viz · Unreal Engine 5.5",
    note: "A personal recreation of one of my favourite Indian SUVs, focused on realistic materials and dynamic lighting.",
    tools: ["Unreal Engine 5.5", "Automotive"], url: "https://abvs.myportfolio.com/scorpio-n", images: 3 },
  { slug: "corinthian-column", group: "3d",
    title: "Corinthian Column", kind: "Procedural modelling · Blender",
    note: "Acanthus leaves, volutes and fluting, all built non-destructively, so the whole column can be adjusted by parameters and still keep clean topology.",
    tools: ["Blender", "Procedural", "Non-destructive"], url: "https://abvs.myportfolio.com/corinthian-column", images: 3 },
  { slug: "environment-art", group: "3d",
    title: "Environment art", kind: "Landscapes & sci-fi",
    note: "A collection of environments, from calm landscapes to sci-fi sets.",
    tools: ["Unreal", "Blender"], url: "https://abvs.myportfolio.com/environment-art", images: 3 },
  { slug: "props", group: "3d",
    title: "Mine props & character", kind: "Game-ready assets",
    note: "A miner with a jackhammer, a mine tunnel and a crate of dynamite. These are detailed, realistic props made to dress a scene.",
    tools: ["Blender", "Substance Painter"], url: "https://abvs.myportfolio.com/3d-props", images: 3 },
  { slug: "optimus-prime", group: "3d",
    title: "Optimus Prime", kind: "Character · fan tribute",
    note: "My childhood hero, modelled after the scenes in Transformers 4.",
    tools: ["Blender", "Substance Painter", "Unreal"], url: "https://abvs.myportfolio.com/optimus-prime", images: 3 },
  { slug: "darth-vader", group: "3d",
    title: "Darth Vader", kind: "Character · fan tribute",
    note: "My take on Vader, built to capture his weight and menace.",
    tools: ["Unreal Engine 5"], url: "https://abvs.myportfolio.com/darth-vader", images: 1 },
  { slug: "interior", group: "3d",
    title: "Interior design", kind: "Archviz",
    note: "Interiors that balance style and function.",
    tools: ["3D visualisation"], url: "https://abvs.myportfolio.com/interior-design", images: 3 },
  { slug: "abstract", group: "3d",
    title: "Abstract 3D", kind: "Form & texture studies",
    note: "Experiments with form, material and light.",
    tools: ["Blender"], url: "https://abvs.myportfolio.com/abstract-art", images: 3 },

  // ---------- games ----------
  { slug: "ar-car-lidar", group: "games",
    title: "AR Car Game for LiDAR devices", kind: "AR game · Unity · iOS & Android",
    note: "Drive a 3D car around the real world through your phone’s camera. On LiDAR iPhones the car collides with a scanned mesh of the room, so it bumps into actual furniture.",
    tools: ["Unity", "Vuforia", "ARKit LiDAR"], url: "https://abvs.myportfolio.com/ar-car-game-for-lidar-devices", images: 3 },
  { slug: "zombie-survival", group: "games",
    title: "Zombie Survival", kind: "Multiplayer shooter · up to 4 players",
    note: "Escape a virus-hit town across three night-time levels while zombies get faster and smarter. The core tension is whether to spend ammo or save it.",
    tools: ["Multiplayer", "Level design", "Enemy AI"], url: "https://abvs.myportfolio.com/zombie-survival-multiplayer-game", images: 3 },
  { slug: "outlander-rush", group: "games",
    title: "Outlander Rush", kind: "Tower defence RTS · Unity · PC",
    note: "Defend your base from waves of robots, placing towers wherever you like. Each wave adds faster and tougher enemies. Built for players aged 8 and up.",
    tools: ["Unity", "Wave design", "RTS"], url: "https://abvs.myportfolio.com/outlander-rush-tower-defense", images: 3 },
  { slug: "synth", group: "games",
    title: "Synth", kind: "3D fighting game · Unity · PC",
    note: "A one-on-one fighter with five characters and eight arenas, playable against AI or a friend in local co-op.",
    tools: ["Unity", "Combat system", "Local co-op"], url: "https://abvs.myportfolio.com/synth-fighting-game", images: 3 },
  { slug: "mr-foxy", group: "games",
    title: "Adventure of Mr. Foxy", kind: "2D platformer · Unity · Android",
    note: "Collect the key and reach the door, past falling platforms, vanishing platforms and patrolling enemies.",
    tools: ["Unity", "2D", "Android"], url: "https://abvs.myportfolio.com/adventure-of-mr-foxy-mobile-game", images: 3 },

  // ---------- design & research ----------
  { slug: "blended-classroom", group: "design", featured: true,
    title: "Blended Classroom", kind: "VR education · physics labs",
    note: "This brings traditional school physics labs into VR, so students can run experiments that are hard or unsafe to set up in a real classroom.",
    tools: ["VR", "Learning design"], url: "https://abvs.myportfolio.com/blended-classroom", images: 3 },
  { slug: "vr-special-needs", group: "design",
    title: "VR education for special needs children", kind: "Design thinking · accessibility",
    note: "A VR learning concept shaped around the specific challenges special needs students face, designed for access and engagement first.",
    tools: ["Design thinking", "VR", "Inclusive design"], url: "https://abvs.myportfolio.com/vr-education-for-special-needs-children", images: 3 },
  { slug: "sparked-vr", group: "design",
    title: "SparkED VR", kind: "Startup business plan",
    note: "A business plan for an education and training VR startup, covering market analysis, strategy and financial projections.",
    tools: ["Business strategy", "Market analysis", "Financials"], url: "https://abvs.myportfolio.com/sparked-vr-business-plan", images: 3 },
  { slug: "physics-vr", group: "design",
    title: "High school physics in VR", kind: "Research · STEM education",
    note: "An immersive physics lab designed to make abstract concepts something students can see and handle.",
    tools: ["VR", "Research"], url: "https://abvs.myportfolio.com/enhancing-high-school-physics-education-using-vr", images: 3 },
  { slug: "uniqlo", group: "design",
    title: "UNIQLO: Adopt a Tree", kind: "Service design & branding",
    note: "A sustainability campaign concept that turns UNIQLO’s CSR work into something customers can take part in.",
    tools: ["Service design", "Branding", "Campaign"], url: "https://abvs.myportfolio.com/uniqlo-adopt-a-tree", images: 3 },
  { slug: "ambong", group: "design",
    title: "Ambong Langkawi Resort", kind: "Website redesign · UX",
    note: "A redesigned resort website with clearer navigation and visuals that lead with the Langkawi setting.",
    tools: ["UX", "Web design"], url: "https://abvs.myportfolio.com/ambong-langkawi-resort-redesign", images: 3 }
];

/* =====================================================================
   CHAPTERS — the story told for each featured project in the 3D
   showcase. Keyed by project slug; order comes from PROFILE.showcase.
   Stats marked // SAMPLE are placeholders: replace with real figures.
   ===================================================================== */
window.CHAPTERS = {
  "unfpa-midwifery": {
    kicker: "17 modules",
    tint: "80, 200, 190",
    problem: "Midwives in Benin rarely get to rehearse a full birth, let alone the emergencies, before they meet one for real.",
    did: "Learned the clinical process behind each procedure, turned it into steps a trainee can practise, and ran production of 17 modules with a team of six, while owning client communication with UNFPA Benin.",
    result: "A course that covers birthing, the third stage of labour and three postpartum haemorrhage cases, with every step guided and checked.",
    stats: [{ v: 17, l: "VR modules" }, { v: 6, l: "people on the team" }, { v: 18, l: "week timeline" }],
    sats: ["still-5.jpg", "still-1.jpg", "still-6.jpg"]
  },
  "adihex": {
    kicker: "One week",
    tint: "255, 190, 110",
    problem: "AHA needed a stand experience for ADIHEX that pulled people in and told the story of four places, with one week to make it.",
    did: "Ran production from brief to sign-off inside that week: RFID cards, a 100-inch touch screen, English and Arabic content, with testing and client feedback built into the schedule.",
    result: "Place a card and the screen flies you to Abu Dhabi, Al Ain, Al Dhafra or Heritage to the World, with landmark cards to spin and tap.",
    stats: [{ v: 1, l: "week, brief to sign-off" }, { v: 100, l: "inch touch screen" }, { v: 4, l: "places to explore" }],
    sats: ["photo.jpg", "still-7.jpg", "still-3.jpg"]
  },
  "alain-falcon": {
    kicker: "Wingstrike",
    tint: "140, 200, 80",
    problem: "A heritage festival quiz had to feel like a game people queue for, not a test.",
    did: "Turned questions and answers into a navigate-to-choose mechanic, steering a falcon with a joystick into the right answer, and ran production with a team of four to the festival build in one week.",
    result: "Two-minute flights over Al Ain’s oasis, forts and mountain road, with a scorecard that ranks the day’s best runs.",
    stats: [{ v: 1, l: "week build" }, { v: 4, l: "people" }, { v: 2, l: "minute runs" }],
    sats: ["still-7.jpg", "still-1.jpg", "still-5.jpg"]
  },
  "joramco-mr": {
    kicker: "Fan blade",
    tint: "90, 150, 255",
    problem: "Technicians learn fan blade replacement on live engines, which are scarce, expensive and can’t be paused for a lesson.",
    did: "Turned the maintenance manual into an 8-step MR procedure with Joramco’s trainers, shipped it in two weeks, and ran acceptance in a hangar-like space.",
    result: "Trainees rehearse the whole job, from nose cone to final inspection, on a full-scale engine that isn’t there.",
    stats: [{ v: 8, l: "guided steps" }, { v: 3, l: "damage scenarios" }, { v: 2, l: "week build" }],
    sats: ["deck-4.jpg", "deck-12.jpg", "deck-21.jpg"]
  },
  "bis-museum": {
    kicker: "17 exhibits",
    tint: "120, 100, 255",
    problem: "Standards are invisible. A museum for the Bureau of Indian Standards had to make thousands of years of weights, measures, hallmarks and certification worth touching.",
    did: "Led 6 of its 17 interactive exhibits, AR, VR, an AI Holobox character, touch walls, interactive projection and a kiosk, from content and design to install and sign-off.",
    result: "A museum where visitors walk from ancient weights to Digital BIS by touching, talking and looking through a headset.",
    stats: [{ v: 17, l: "interactive exhibits" }, { v: 6, l: "exhibits I led" }, { v: "AR·VR·AI", l: "plus touch & projection" }],
    sats: ["still-21.jpg", "still-10.jpg", "still-30.jpg"]
  },
  "musexr": {
    kicker: "WeevXR",
    tint: "255, 170, 90",
    problem: "Delhi’s monuments hold stories visitors can’t see: lost artefacts, vanished rooms, the people who were there.",
    did: "Owned the v1 roadmap and backlog, ran field tests at real monuments in daylight passthrough, and produced the launch film.",
    result: "Visitors walk the real site and watch history reappear exactly where it stood.",
    stats: [{ v: "Outdoor", l: "daylight MR" }, { v: "No-code", l: "curator tool" }, { v: "Quest 3", l: "on-site" }],
    sats: ["still-10.jpg", "still-11.jpg", "reel-1.jpg"]
  },
  "adnoc-ai": {
    kicker: "Cyber aware",
    tint: "40, 120, 255",
    problem: "AI governance and cyber awareness are dry subjects, and staff skim the slide decks.",
    did: "Delivered against a fixed event date, worked with ADNOC on approved answers and guardrails, and coordinated the display, console, mic and install.",
    result: "Staff walk up and ask an AI character questions out loud, and it answers them live on the floor.",
    stats: [{ v: "Voice", l: "+ touch input" }, { v: "Live", l: "at an ADNOC event" }, { v: 6, l: "weeks to ship" /* SAMPLE */ }],
    sats: ["photo.jpg", "still-10.jpg", "still-11.jpg"]
  },
  "keltron-anganwadi": {
    kicker: "Anganwadi",
    tint: "90, 205, 140",
    problem: "Preschoolers in Kerala’s Anganwadi centres learn by doing, but centres have few hands-on materials.",
    did: "Worked with education specialists on outcomes, ran comfort and child-safety reviews, and managed the Malayalam voice-over.",
    result: "Three VR worlds where small children count, find colours and meet farm animals in their own language.",
    stats: [{ v: 3, l: "learning worlds" }, { v: "Malayalam", l: "voiced throughout" }, { v: "3–6", l: "year-olds" }],
    sats: ["still-10.jpg", "still-20.jpg", "still-30.jpg"]
  }
};
