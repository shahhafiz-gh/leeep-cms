import type { SchoolData, TemplateId } from '@/types/school.types'

/* ────────────────────────────────────────────────────────────
 *  LEEEP CMS — Neutral DEMO dataset
 *
 *  A fully generic, fictional school used to preview each template
 *  (Template A / Template B) end-to-end before a real school is onboarded.
 *
 *  ⚠️ ABSOLUTE RULE: ZERO real school data here. Every name and line of copy
 *  below is invented. Do NOT copy anything from the real mock/fallback data
 *  in `mock.ts` (DRM / Kashmir Cambridge / any client). Images are generic
 *  stock photography (Unsplash) and placeholder avatars (Pravatar) — never a
 *  real client's photos, logo, or assets. This dataset is shown to
 *  prospective schools, so nothing may resemble an existing client.
 * ──────────────────────────────────────────────────────────── */

export type DemoTemplate = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I'

/** Build a sized Unsplash stock-photo URL from a (verified) photo id. */
const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

/** Build a placeholder avatar URL (generic faces, no real people). */
const avatar = (n: number) => `https://i.pravatar.cc/300?img=${n}`

/** Verified, education-themed Unsplash stock photos (generic, fictional use). */
const STOCK = {
  hero1: img('1562774053-701939374585', 1600),
  hero2: img('1588072432836-e10032774350', 1600),
  aboutMain: img('1523240795612-9a054b0db644', 1400),
  aboutAlt: img('1524178232363-1fb2b075b655', 1200),
  building1: img('1509869175650-a1d97972541a', 1400),
  building2: img('1488521787991-ed7bbaae773c', 1200),
  classroom: img('1503676260728-1c00da094a0b'),
  kidsStudy: img('1580582932707-520aed937b7b'),
  childRead: img('1577896851231-70ef18881754'),
  students: img('1509062522246-3755977927d7'),
  groupStudy: img('1543269865-cbf427effbad'),
  laptopStudy: img('1517486808906-6ca8b3f04846'),
  artClass: img('1571260899304-425eee4c7efc'),
  booksDesk: img('1497633762265-9d179a990aa6'),
  library: img('1562774053-701939374585'),
  scienceKids: img('1581726707445-75cbe4efc586'),
  coding: img('1531482615713-2afd69097998'),
  tech: img('1518770660439-4636190af475'),
  sports: img('1564981797816-1043664bf78d'),
  graduation: img('1546410531-bb4caa6b424d'),
} as const

/**
 * Normalise an incoming `?template=` value to a demo template id.
 *
 * Accepts BOTH the app's canonical template ids (`template-a` / `template-b`,
 * used everywhere else — `TemplateId`, `config.template_id`, `set_website_template`)
 * AND the short `a` / `b` form. This is the fix for the preview bug: a card that
 * passes its real template id (`template-b`) must render Template B, not silently
 * collapse to Template A. Unknown/missing → Template A (the default card).
 */
export function resolveDemoTemplate(raw?: string | string[]): DemoTemplate {
  const value = (Array.isArray(raw) ? raw[0] : raw)?.toLowerCase().trim()
  if (value === 'b' || value === 'template-b') return 'B'
  if (value === 'c' || value === 'template-c') return 'C'
  if (value === 'd' || value === 'template-d') return 'D'
  if (value === 'e' || value === 'template-e') return 'E'
  if (value === 'f' || value === 'template-f') return 'F'
  if (value === 'g' || value === 'template-g') return 'G'
  if (value === 'h' || value === 'template-h') return 'H'
  if (value === 'i' || value === 'template-i') return 'I'
  return 'A'
}

/** Map an internal `/demo/...?template=X` link to its live route, e.g. `/about`. */
function demoHrefToLive(href: string): string {
  const match = href.match(/^\/demo(\/[^?#]*)?/)
  if (!match) return href
  const path = match[1] ?? ''
  return path === '' || path === '/' ? '/' : path
}

/**
 * Demo data for the inline EDITOR preview.
 *
 * Identical to the template-selection demo (`getDemoData`) — same fully
 * populated, fictional content — but internal links point at the LIVE routes
 * (`/about`, …) instead of `/demo/...`, so navigating inside the editor stays on
 * the real pages. Used so an admin always sees a complete, working example to
 * edit over, never the school's own sparse draft/published data.
 */
export function getEditorDemoData(template: DemoTemplate): SchoolData {
  const data = getDemoData(template)
  return {
    ...data,
    navigation: data.navigation.map((item) => ({
      ...item,
      href: demoHrefToLive(item.href),
      children: item.children?.map((child) => ({ ...child, href: demoHrefToLive(child.href) })),
    })),
    hero: {
      ...data.hero,
      slides: data.hero.slides.map((slide) =>
        slide.cta ? { ...slide, cta: { ...slide.cta, href: demoHrefToLive(slide.cta.href) } } : slide,
      ),
    },
    footer: {
      ...data.footer,
      columns: data.footer.columns.map((col) => ({
        ...col,
        links: col.links.map((link) => ({ ...link, href: demoHrefToLive(link.href) })),
      })),
    },
  }
}

/**
 * Build the neutral demo SchoolData for the requested template.
 *
 * Navigation and footer links point back into `/demo/...` (carrying the
 * `?template=` flag) so the whole preview stays self-contained and navigable
 * without ever touching the real subdomain or draft-preview render paths.
 */
export function getDemoData(template: DemoTemplate, paletteOverride?: string): SchoolData {
  const templateId: TemplateId =
    template === 'B'
      ? 'template-b'
      : template === 'C'
        ? 'template-c'
        : template === 'D'
          ? 'template-d'
          : template === 'E'
            ? 'template-e'
            : template === 'F'
              ? 'template-f'
              : template === 'G'
                ? 'template-g'
                : template === 'H'
                  ? 'template-h'
                  : template === 'I'
                    ? 'template-i'
                    : 'template-a'
  // Horizon defaults to its warm palette so the demo card shows its true look; an
  // explicit override (from ?palette=) lets the gallery preview any curated preset.
  // Quill's built-in terracotta and Almanac's walnut ARE their defaults, so
  // neither needs a preset id.
  const palette = paletteOverride !== undefined ? paletteOverride : template === 'C' ? 'warm' : ''
  const q = `?template=${template}`
  /** Internal demo link helper, e.g. demoHref('/about') → '/demo/about?template=A'. */
  const demoHref = (path: string) => `/demo${path}${q}`

  return {
    name: 'Leeep Public School',
    tagline: 'Where curious minds grow',
    logo: '/assets/demo/logo.svg', // generic demo emblem — not a real client logo
    config: { template_id: templateId, palette, font_family: 'biorhyme' },

    hero: {
      // One slide for every template but Grand, whose hero rotates — so its
      // demo carries the extra slides that show what the slider does (and what
      // the builder's "Hero slides" list edits), each with its own dwell time.
      slides: [
        {
          title: 'Welcome to Leeep Public School',
          subtitle: 'Where curious minds grow',
          description:
            'A nurturing environment for every learner — blending strong academics, creativity, and character so each student discovers their full potential.',
          image: STOCK.hero1,
          cta: { label: 'Explore Admissions', href: demoHref('/admissions') },
          duration: '6',
        },
        ...(template === 'H'
          ? [
              {
                title: 'Admissions are open for the new session',
                subtitle: 'Join us',
                description:
                  'Apply online in a few minutes — our admissions team will be in touch as soon as your form is in.',
                image: STOCK.students,
                cta: { label: 'Online Admission', href: demoHref('/admissions') },
                secondaryCta: { label: 'Visit the campus', href: demoHref('/contact') },
                duration: '8',
              },
              {
                title: 'Learning that goes beyond the classroom',
                subtitle: 'Sport, arts and science',
                description:
                  'Labs, studios and playing fields that give every student somewhere to be good at something.',
                image: STOCK.scienceKids,
                cta: { label: 'Our facilities', href: demoHref('/academics') },
                duration: '5',
              },
            ]
          : []),
      ],
    },

    // Home-only "About our school" teaser — independent of the About page.
    homeAbout: {
      title: 'EST. 2025',
      subtitle: 'Nurturing Excellence in Education',
      description:
        'At Leeep Public School we pair a rich, inquiry-led curriculum with mentorship, the arts, and sport — helping every child grow in knowledge, character, and confidence.',
      image: STOCK.students,
      secondaryImage: STOCK.classroom,
      badges: [
        { icon: 'lucide:landmark', label: 'Established 2020', sublabel: 'A fresh approach' },
        { icon: 'lucide:shield-check', label: 'Safe & Caring', sublabel: 'Every learner matters' },
      ],
      mission: [
        { title: 'Inquiry-Led Learning', description: 'Students question, explore, and discover.', image: STOCK.groupStudy },
        { title: 'Caring Mentors', description: 'Small classes mean every student is known.', image: STOCK.childRead },
        { title: 'Beyond the Classroom', description: 'Clubs, sport, and the arts build character.', image: STOCK.sports },
      ],
    },

    about: {
      title: 'About Leeep Schools',
      subtitle: 'Est. 2020 (demo)',
      description:
        'Leeep Schools is a sample institution used to showcase this website template. We believe every child learns differently, and our approach pairs a rich curriculum with mentorship, the arts, and sport to grow well-rounded individuals.',
      image: STOCK.aboutMain,
      heroImage: STOCK.building1,
      homeImage: STOCK.students,
      homeSecondaryImage: STOCK.classroom,
      badges: [
        { icon: 'lucide:landmark', label: 'Established 2020', sublabel: 'A fresh approach' },
        { icon: 'lucide:shield-check', label: 'Safe & Caring', sublabel: 'Every learner matters' },
      ],
      whyChooseUs: [
        { title: 'Strong Academics', description: 'A balanced, inquiry-led curriculum that builds deep understanding.', icon: 'lucide:book-open' },
        { title: 'Caring Mentors', description: 'Small classes mean every student is known, guided, and supported.', icon: 'lucide:users' },
        { title: 'Modern Facilities', description: 'Bright classrooms, labs, a library, and open spaces to explore.', icon: 'lucide:layout-grid' },
        { title: 'Beyond the Classroom', description: 'Clubs, sport, and the arts that build confidence and character.', icon: 'lucide:sparkles' },
      ],
      mission: [
        { title: 'Learn', description: 'Spark curiosity and a lifelong love of learning.', icon: 'lucide:book-open-text', image: STOCK.groupStudy },
        { title: 'Grow', description: 'Develop confident, kind, and capable young people.', icon: 'lucide:sprout', image: STOCK.childRead },
        { title: 'Lead', description: 'Encourage responsibility, teamwork, and integrity.', icon: 'lucide:shield-check', image: STOCK.sports },
      ],
      missionStatement:
        'To provide a joyful, rigorous education that helps every learner grow in knowledge, character, and confidence.',
      vision:
        'To be a school where curiosity is celebrated and every student leaves ready to shape a better world.',
      values: ['Curiosity', 'Kindness', 'Integrity', 'Creativity', 'Teamwork', 'Respect'],
      achievements: [
        { title: 'Sample Excellence Award', description: 'A placeholder achievement showing how recognitions appear.', year: '2024', icon: 'lucide:trophy', image: STOCK.graduation },
        { title: 'Inter-School Sample Cup', description: 'Demo students excelled at a fictional regional tournament.', year: '2023', icon: 'lucide:medal', image: STOCK.sports },
        { title: 'Young Innovators Showcase', description: 'Placeholder text for a science and innovation highlight.', year: '2023', icon: 'lucide:lightbulb', image: STOCK.tech },
      ],
      // Rendered as About sections by Template H, and linked from its About
      // dropdown — the demo carries them so that menu has something behind it.
      messages: [
        {
          role: 'Chairman',
          name: 'Mr. V. Menon',
          image: avatar(13),
          message:
            'Welcome to our sample school. A school is a promise made to a family: that their child will be known by name, stretched a little further each year, and sent out steadier than they arrived.\n\nThis is placeholder copy — a real school writes its own message here, at whatever length it wants to.',
        },
        {
          role: 'Principal',
          name: 'Dr. P. Rao',
          image: avatar(60),
          message:
            'Every morning this building fills with several hundred different reasons to be curious. Our work is to keep that curiosity alive while giving it the discipline to become something.\n\nPlaceholder text, shown here so the Principal’s Message section and its menu link can be previewed.',
        },
      ],
    },

    team: {
      title: 'The people who make learning personal',
      subtitle: 'Our people',
      description:
        'We are educators, mentors, specialists, and school leaders brought together by one shared belief: children flourish when they are known, challenged, and cared for. Our different experiences make the school stronger; our common purpose keeps us moving in the same direction.',
      message: {
        name: 'Dr. P. Rao',
        role: 'Principal',
        image: avatar(60),
        content:
          'A school is built one relationship at a time. Our work is to create the trust, curiosity, and sense of belonging that let every learner do their best work.',
      },
      members: [
        { name: 'Dr. P. Rao', role: 'Principal', department: 'Leadership', image: avatar(60), qualification: 'Ph.D. · M.Ed.', bio: 'Leads the school community with a focus on thoughtful teaching and student wellbeing.' },
        { name: 'Ms. S. Iyer', role: 'Head of Science', department: 'Academics', image: avatar(45), qualification: 'M.Sc. · B.Ed.', bio: 'Builds inquiry-led science experiences that turn questions into confident discovery.' },
        { name: 'Mr. K. Nair', role: 'Sports Coordinator', department: 'Student Life', image: avatar(51), qualification: 'B.P.Ed.', bio: 'Helps students grow through movement, teamwork, resilience, and joyful competition.' },
        { name: 'Ms. A. Sen', role: 'Early Years Lead', department: 'Early Years', image: avatar(47), qualification: 'M.A. · ECCE', bio: 'Creates warm, play-rich classrooms where young learners feel safe to explore.' },
        { name: 'Mr. R. Das', role: 'School Counsellor', department: 'Student Support', image: avatar(12), qualification: 'M.A. Psychology', bio: 'Works alongside families and teachers to support every student’s sense of belonging.' },
        { name: 'Ms. N. Kapoor', role: 'Arts Lead', department: 'Creative Arts', image: avatar(32), qualification: 'M.F.A.', bio: 'Makes the arts a vivid part of daily school life and a language for self-expression.' },
      ],
    },

    academics: {
      title: 'Academics',
      subtitle: 'Curiosity meets rigour',
      description:
        'Our sample curriculum spans the early years through senior school, balancing core subjects with the arts, technology, and hands-on inquiry.',
      image: STOCK.building1,
      streams: [
        { name: 'Science', description: 'For future engineers, doctors, and researchers — with hands-on labs.', subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics'], image: STOCK.scienceKids },
        { name: 'Commerce', description: 'Foundations in business, accounting, and economics.', subjects: ['Accountancy', 'Business Studies', 'Economics'], image: STOCK.laptopStudy },
        { name: 'Humanities', description: 'A broad grounding in history, languages, and the social sciences.', subjects: ['History', 'Geography', 'Political Science', 'English'], image: STOCK.booksDesk },
      ],
      methodology: {
        title: 'How We Teach',
        description: 'A student-centred approach that balances rigour with joy.',
        steps: [
          { title: 'Inquiry-Led', description: 'Students question, explore, and discover rather than memorise.', icon: 'lucide:compass' },
          { title: 'Technology-Enabled', description: 'Smart classrooms and digital tools bring lessons to life.', icon: 'lucide:monitor' },
          { title: 'Personalised', description: 'Small classes ensure every learner is supported.', icon: 'lucide:users' },
          { title: 'Hands-On', description: 'Projects, clubs, and labs turn ideas into practice.', icon: 'lucide:flask-conical' },
        ],
      },
      results: {
        title: 'Sample Results',
        description: 'Illustrative figures showing how outcomes are presented.',
        stats: [
          { label: 'Pass Rate', value: '99%' },
          { label: 'Distinctions', value: '75%' },
          { label: 'University Placements', value: '90%' },
          { label: 'Avg. Class Size', value: '24' },
        ],
        image: STOCK.building2,
      },
      resourcesTitle: 'Syllabus & Booklists',
      resourcesDescription: 'Class-wise material for the current session.',
      // Downloads that belong to academics rather than a page of their own.
      // Files are attached per school; the demo shows the empty state.
      resources: [
        { title: 'Syllabus', description: 'Class-wise syllabus for the current session.', files: [] },
        { title: 'Booklist', description: 'The books each class works from.', files: [] },
      ],
      clubs: [
        { name: 'Robotics & Coding', description: 'Hands-on robotics, programming, and innovation challenges.', image: STOCK.tech },
        { name: 'Debate & Literary', description: 'Public speaking, debate, and creative writing.', image: STOCK.classroom },
        { name: 'Arts & Music', description: 'Painting, theatre, and music to nurture creativity.', image: STOCK.artClass },
        { name: 'Sports & Athletics', description: 'Team games and athletics promoting fitness and teamwork.', image: STOCK.sports },
      ],
      curriculum: {
        title: 'Our Curriculum',
        description: 'A connected pathway from early years to senior school.',
        items: [
          { title: 'Early Years', description: 'Play-based learning that builds curiosity and confidence.' },
          { title: 'Primary', description: 'Strong foundations in literacy, numeracy, and inquiry.' },
          { title: 'Senior', description: 'Specialised streams that prepare students for what comes next.' },
        ],
      },
      courses: [
        { id: 'demo-c1', name: 'Foundation Program', description: 'A sample course entry for early learners.', duration: '2 years', image: STOCK.kidsStudy, subjects: ['Literacy', 'Numeracy', 'Discovery'] },
        { id: 'demo-c2', name: 'Senior Science', description: 'A sample senior-school science pathway.', duration: '2 years', image: STOCK.classroom, subjects: ['Physics', 'Chemistry', 'Biology'] },
      ],
    },

    admissions: {
      title: 'Admissions Open (Demo)',
      subtitle: 'Sample Session 2025–26',
      description:
        'Join the Leeep Schools demo family. This is sample copy showing how your admissions invitation and process will appear to families.',
      applicationCardTitle: 'Ready when you are',
      applicationCardDescription:
        'The application takes about ten minutes. You can save nothing halfway, so gather documents first.',
      image: STOCK.aboutAlt,
      homeImage: STOCK.graduation,
      requirementsImage: STOCK.groupStudy,
      highlights: [
        { icon: 'lucide:shield-check', label: 'Simple online form' },
        { icon: 'lucide:star', label: 'Welcoming community' },
        { icon: 'lucide:clock', label: 'Rolling admissions' },
      ],
      callout: { icon: 'lucide:users', label: 'Limited Seats', sublabel: 'Apply Early' },
      rulesTitle: 'Admission rules',
      process: {
        title: 'How to Apply',
        steps: [
          { step: 1, title: 'Enquire', description: 'Reach out or visit our (demo) campus to learn more.' },
          { step: 2, title: 'Apply', description: 'Complete the sample admission form online.' },
          { step: 3, title: 'Assessment', description: 'A friendly interaction to understand your child.' },
          { step: 4, title: 'Enroll', description: 'Complete the formalities and join the community.' },
        ],
      },
      whyChoose: [
        { title: 'Personalised Attention', description: 'Small classes and dedicated mentors.', icon: 'lucide:users' },
        { title: 'Holistic Growth', description: 'Academics, arts, and sport in balance.', icon: 'lucide:sprout' },
        { title: 'Safe Environment', description: 'A caring, secure, and inclusive campus.', icon: 'lucide:shield-check' },
        { title: 'Proven Approach', description: 'A curriculum designed around how children learn.', icon: 'lucide:award' },
      ],
      feeStructure: [
        { grade: 'Early Years', tuition: '₹00,000', total: '₹00,000', details: 'Sample fee row — figures are illustrative.' },
        { grade: 'Primary', tuition: '₹00,000', total: '₹00,000', details: 'Sample fee row — figures are illustrative.' },
        { grade: 'Senior', tuition: '₹00,000', total: '₹00,000', details: 'Sample fee row — figures are illustrative.' },
      ],
      faqs: [
        { question: 'What is the minimum age for the early years?', answer: 'This is sample text showing how an FAQ answer is displayed to families.' },
        { question: 'Is there an entrance assessment?', answer: 'Placeholder answer describing a friendly, low-pressure assessment.' },
        { question: 'Do you offer transport?', answer: 'Demo answer noting sample transport routes and safety.' },
        { question: 'Can we visit before applying?', answer: 'Sample answer inviting families to book a campus tour.' },
      ],
      formEnabled: true,
    },

    contact: {
      title: 'Contact Us',
      subtitle: 'Get In Touch',
      image: STOCK.building2,
      address: '123 Demo Road, Sample City, 000000',
      phone: ['00000 00000'],
      email: ['hello@leeepschool.example'],
      workingHours: 'Mon – Sat: 9 AM – 4 PM',
      mapEmbedUrl: '',
      coordinates: { lat: 0, lng: 0 },
      highlights: [
        { icon: 'lucide:check-circle', label: 'Dedicated Support', sublabel: 'We reply quickly' },
        { icon: 'lucide:star', label: 'Friendly Team', sublabel: 'Always happy to help' },
      ],
      landmarks: [
        { icon: 'lucide:map-pin', label: 'Opposite Sample Park' },
        { icon: 'lucide:bus', label: 'Near Demo Bus Stand' },
        { icon: 'lucide:map', label: '5 min from City Center (demo)' },
      ],
      transport: [
        { type: 'Train', detail: 'Sample directions from the nearest station.' },
        { type: 'Bus', detail: 'Sample bus routes serving the campus.' },
        { type: 'Car', detail: 'Sample parking and drop-off information.' },
      ],
      visitingHours: [
        { label: 'Main Reception', time: '9:00 AM – 3:00 PM' },
        { label: 'Admissions Office', time: '10:00 AM – 2:00 PM' },
      ],
    },

    updates: {
      announcements: [
        {
          id: 'demo-ann-1',
          title: 'Admissions Open for the Sample Session',
          short_description: 'Placeholder announcement showing how news appears on the home and updates pages.',
          content: 'This is sample announcement body text. Replace it with your own news once your school is set up.',
          published_date: '2025-01-15',
          category: 'Admissions',
          is_pinned: true,
          thumbnail: STOCK.aboutAlt,
        },
        {
          id: 'demo-ann-2',
          title: 'Annual Sample Day Celebrated',
          short_description: 'A fictional highlight demonstrating an achievement-style announcement.',
          published_date: '2025-01-08',
          category: 'Events',
          thumbnail: STOCK.graduation,
        },
        {
          id: 'demo-ann-3',
          title: 'New Demo Science Lab Opens',
          short_description: 'Sample infrastructure update used to populate the updates feed.',
          published_date: '2025-01-02',
          category: 'Infrastructure',
          thumbnail: STOCK.tech,
        },
      ],
      events: [
        {
          id: 'demo-evt-1',
          title: 'Sample Annual Day & Cultural Fest',
          description: 'A placeholder evening of music, dance, and drama.',
          date: '2025-03-21',
          location: 'Demo Auditorium',
          category: 'Cultural',
          image: STOCK.artClass,
        },
        {
          id: 'demo-evt-2',
          title: 'Parent–Teacher Meet (Demo)',
          description: 'Sample session for families to meet our faculty.',
          date: '2025-02-28',
          location: 'Main Campus',
          category: 'Academic',
          image: STOCK.classroom,
        },
        {
          id: 'demo-evt-3',
          title: 'Winter Sports Carnival (Sample)',
          description: 'Illustrative inter-house games and athletics.',
          date: '2025-02-10',
          location: 'Sports Ground',
          category: 'Sports',
          image: STOCK.sports,
        },
      ],
    },

    testimonials: [
      { id: 'demo-t1', name: 'A. Sharma, Parent', role: 'Parent', content: 'Sample testimonial showing how a parent quote is presented. The teachers are wonderful.', rating: 5, avatar: avatar(12), image: avatar(12), featured: 'yes' },
      { id: 'demo-t2', name: 'R. Mehta, Parent', role: 'Parent', content: 'Placeholder review highlighting a caring environment and strong academics.', rating: 4, avatar: avatar(32) },
      { id: 'demo-t3', name: 'J. Verma, Alumni', role: 'Alumni', content: 'Demo alumni quote describing a positive, formative school experience.', rating: 5, avatar: avatar(13) },
    ],

    testimonialsIntro: {
      title: 'What families tell us',
      subtitle: 'Testimonials',
      layout: 'grid',
    },

    // Frame only — the notices themselves come from `updates.announcements`.
    // Fictional campuses and videos, so the demo exercises the multi-campus
    // menu and the video gallery without carrying a real school's links.
    campuses: [
      { name: 'Main Campus', admissionUrl: '/admissions/apply', address: '123 Demo Road, Sample City' },
      { name: 'North Campus', admissionUrl: '/admissions/apply', address: '45 Example Lane, Sample City' },
    ],

    videoGallery: {
      title: 'Video Gallery',
      subtitle: 'A few minutes inside a school day.',
      videos: [
        { title: 'A day at Leeep Public School', url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ' },
        { title: 'Annual Day highlights', url: 'https://youtu.be/aqz-KE-bpKQ' },
        { title: 'Our science labs', url: 'https://www.youtube.com/embed/aqz-KE-bpKQ' },
      ],
    },

    // Rendered by Template H's home page. Generic wording on purpose: the demo
    // must not carry any real school's chosen passage.
    quote: {
      title: 'Quote of the Day',
      text: 'Tell me and I forget. Teach me and I remember. Involve me and I learn.',
      attribution: 'Benjamin Franklin',
    },

    notifications: {
      title: 'Latest notifications',
      subtitle: 'Noticeboard',
      limit: '5',
      layout: 'ticker',
      cta: { label: 'All updates' },
      emptyText: 'Nothing new on the noticeboard just now.',
    },

    socialSpace: {
      title: 'From the school feed',
      subtitle: 'Social space',
      handle: '@leeepschools',
      posts: [
        { image: STOCK.sports, caption: 'Sample post: the relay final, decided by half a second.', platform: 'instagram', date: '12 August', url: '#' },
        { image: STOCK.scienceKids, caption: 'Sample post: science fair day, thirty-one projects and one hovercraft.', platform: 'facebook', date: '05 August', url: '#' },
        { image: STOCK.library, caption: 'Sample post: the new library corner is open and already full.', platform: 'instagram', date: '29 July', url: '#' },
        { image: STOCK.artClass, caption: 'Sample post: art week, and the corridor has never looked better.', platform: 'youtube', date: '21 July', url: '#' },
        { image: STOCK.coding, caption: 'Sample post: our robotics team is off to the state finals.', platform: 'twitter', date: '14 July', url: '#' },
        { image: STOCK.graduation, caption: 'Sample post: the class of 2026, on their last morning.', platform: 'instagram', date: '02 July', url: '#' },
      ],
    },

    magazine: {
      title: 'The school magazine',
      subtitle: 'School magazine',
      description:
        'Written, edited and illustrated by students. Four issues a year, every one of them archived here.',
      issues: [
        { title: 'Sample issue — Monsoon 2026', cover: STOCK.booksDesk, issue: '14', date: 'Aug 2026', summary: 'Student journalism, the debate special, and a photo essay on the old library.', url: '#' },
        { title: 'Sample issue — Spring 2026', cover: STOCK.library, issue: '13', date: 'Apr 2026', summary: 'Founders week, plus every winning entry from the poetry prize.', url: '#' },
        { title: 'Sample issue — Winter 2025', cover: STOCK.childRead, issue: '12', date: 'Dec 2025', summary: 'Snow days, the science fair, and an interview with our longest-serving teacher.', url: '#' },
        { title: 'Sample issue — Autumn 2025', cover: STOCK.kidsStudy, issue: '11', date: 'Sep 2025', summary: 'Sports day in full colour and the first of the ethics essays.', url: '#' },
      ],
    },

    stats: [
      { label: 'Students', value: '5000', suffix: '+', icon: 'lucide:graduation-cap' },
      { label: 'Teachers', value: '420', suffix: '+', icon: 'lucide:users' },
      { label: 'Years', value: '15', suffix: '+', icon: 'lucide:history' },
      { label: 'Pass Rate', value: '98', suffix: '+', icon: 'lucide:award' },
    ],

    gallery: {
      title: 'Life at Leeep Schools',
      subtitle:
        'Two rows drifting the opposite way from each other. Hover to hold them still and read a caption.',
      motion: 'marquee',
      speed: 'medium',
      images: [
        { src: STOCK.students, alt: 'Sample campus photo' },
        { src: STOCK.classroom, alt: 'Sample classroom photo' },
        { src: STOCK.sports, alt: 'Sample sports photo', eventId: 'demo-e1' },
        { src: STOCK.artClass, alt: 'Sample event photo' },
        { src: STOCK.library, alt: 'Sample library photo' },
        { src: STOCK.scienceKids, alt: 'Sample science fair photo' },
        { src: STOCK.graduation, alt: 'Sample graduation photo' },
        { src: STOCK.groupStudy, alt: 'Sample study group photo' },
      ],
    },

    faculty: [
      { id: 'demo-f1', name: 'Dr. P. Rao', designation: 'Principal', department: 'Administration', image: avatar(60), bio: 'Sample faculty bio used to populate the staff section.', qualifications: ['Ph.D. (Demo)'], email: 'principal@leeepschool.example' },
      { id: 'demo-f2', name: 'Ms. S. Iyer', designation: 'Head of Science', department: 'Science', image: avatar(45), bio: 'Placeholder biography for a senior teacher.', qualifications: ['M.Sc. (Demo)'], email: 'science@leeepschool.example' },
      { id: 'demo-f3', name: 'Mr. K. Nair', designation: 'Sports Coordinator', department: 'Physical Education', image: avatar(51), bio: 'Demo profile showing how staff cards appear.', qualifications: ['B.P.Ed. (Demo)'] },
    ],

    alumni: [
      { name: 'M. Khan (Demo)', batch: '2022', achievement: 'Sample alumni achievement', image: avatar(15), testimonial: 'Placeholder quote from a fictional alumnus.' },
      { name: 'T. Das (Demo)', batch: '2021', achievement: 'Sample alumni achievement', image: avatar(52), testimonial: 'Another invented alumni quote for the demo.' },
    ],

    programs: [
      { id: 'demo-p1', name: 'Early Years Program', description: 'Play-based learning for our youngest students.', image: STOCK.kidsStudy, grade_range: 'Nursery – KG', features: ['Activity-based', 'Caring mentors', 'Safe spaces', 'Joyful learning'] },
      { id: 'demo-p2', name: 'Primary Program', description: 'Strong foundations across core subjects.', image: STOCK.childRead, grade_range: 'Grades 1 – 5', features: ['Inquiry-led', 'Reading focus', 'Creative arts', 'Outdoor play'] },
      { id: 'demo-p3', name: 'Senior Program', description: 'Specialised streams for senior learners.', image: STOCK.coding, grade_range: 'Grades 6 – 12', features: ['Science & Commerce', 'Career guidance', 'Labs & projects', 'Leadership'] },
    ],

    portalLinks: [
      { label: 'Student & Parent Portal (Demo)', url: '#', variant: 'primary' },
      { label: 'Staff Portal (Demo)', url: '#', variant: 'dark' },
    ],

    navigation: [
      { label: 'Home', href: demoHref('') },
      { label: 'Updates', href: demoHref('/updates') },
      {
        label: 'About',
        href: demoHref('/about'),
        children: [
          { label: 'About School', href: demoHref('/about') },
          { label: 'Team', href: demoHref('/about/team') },
        ],
      },
      { label: 'Academics', href: demoHref('/academics') },
      { label: 'Admissions', href: demoHref('/admissions') },
      { label: 'Contact', href: demoHref('/contact') },
      { label: 'Login', href: demoHref('/login') },
    ],

    // All five canonical platforms in a FIXED order (matches the backend's
    // STANDARD_SOCIAL) so the inline editor's index-based `socialLinks.N.url`
    // edits always land on the right platform. ALL start un-configured (empty
    // url → blue outline in the editor); the admin's saved URLs overlay green
    // "done" ticks. Only configured ones ever render on a live site.
    socialLinks: [
      { platform: 'facebook', url: '', icon: 'ri:facebook-fill' },
      { platform: 'instagram', url: '', icon: 'ri:instagram-line' },
      { platform: 'twitter', url: '', icon: 'ri:twitter-x-fill' },
      { platform: 'youtube', url: '', icon: 'ri:youtube-fill' },
      { platform: 'linkedin', url: '', icon: 'ri:linkedin-fill' },
    ],

    footer: {
      description:
        'Leeep Schools is a sample school used to preview this website template. All content shown here is fictional.',
      columns: [
        {
          title: 'Explore',
          links: [
            { label: 'Home', href: demoHref('') },
            { label: 'About', href: demoHref('/about') },
            { label: 'Academics', href: demoHref('/academics') },
          ],
        },
        {
          title: 'Get Involved',
          links: [
            { label: 'Admissions', href: demoHref('/admissions') },
            { label: 'Updates', href: demoHref('/updates') },
            { label: 'Contact', href: demoHref('/contact') },
          ],
        },
      ],
      copyright: '© 2026 Leeep Schools (Demo)',
    },
  }
}
