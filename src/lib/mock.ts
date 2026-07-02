import type { SchoolData } from '@/types/school.types'

/**
 * Generic editing-prompt scaffold for Template A.
 *
 * Every field reads as an instruction ("Your School Name", "Add your tagline
 * here", …) so a school admin previewing the template sees a blank, brandable
 * shell rather than another school's content. In production the Frappe backend
 * supplies the real per-school data; this is only the dev fallback / reference
 * for the expected `SchoolData` shape.
 */
export const placeholderTemplateAData: SchoolData = {
  name: 'Your School Name',
  tagline: 'Add your school tagline here',
  logo: '',
  config: {
    template_id: 'template-a',
  },

  hero: {
    slides: [
      {
        title: 'Your headline goes here',
        subtitle: 'Welcome to your school',
        description:
          'Add a short, welcoming description of your school here. Tell visitors what makes your institution special and why families should choose you.',
        image: '',
        cta: { label: 'Explore Admissions', href: '#admissions' },
      },
    ],
  },

  about: {
    title: 'About Us',
    subtitle: 'Your about subtitle here',
    description:
      'Describe your school here — your philosophy, your approach to education, and what sets you apart. This text appears on the home and about pages.',
    image: '',
    heroImage: '',
    homeImage: '',
    homeSecondaryImage: '',
    badges: [
      { icon: 'lucide:landmark', label: 'Est. Year', sublabel: 'Add a short caption' },
      { icon: 'lucide:shield-check', label: 'Your Highlight', sublabel: 'Add a short caption' },
    ],
    whyChooseUs: [
      { title: 'Reason One', description: 'Describe the first reason families should choose your school.', icon: 'lucide:book-open' },
      { title: 'Reason Two', description: 'Describe the second reason families should choose your school.', icon: 'lucide:award' },
      { title: 'Reason Three', description: 'Describe the third reason families should choose your school.', icon: 'lucide:layout-grid' },
      { title: 'Reason Four', description: 'Describe the fourth reason families should choose your school.', icon: 'lucide:users' },
    ],
    mission: [
      { title: 'Mission Point One', description: 'Add a short supporting statement.', icon: 'lucide:book-open-text' },
      { title: 'Mission Point Two', description: 'Add a short supporting statement.', icon: 'lucide:users' },
      { title: 'Mission Point Three', description: 'Add a short supporting statement.', icon: 'lucide:shield-check' },
    ],
    vision: 'Add your school\'s vision statement here.',
    missionStatement: 'Add your school\'s mission statement here.',
    values: ['Value One', 'Value Two', 'Value Three', 'Value Four', 'Value Five', 'Value Six'],
    achievements: [
      { title: 'Achievement Title', description: 'Describe this achievement.', year: 'Year', icon: 'lucide:badge-check' },
      { title: 'Achievement Title', description: 'Describe this achievement.', year: 'Year', icon: 'lucide:trophy' },
      { title: 'Achievement Title', description: 'Describe this achievement.', year: 'Year', icon: 'lucide:medal' },
    ],
  },

  academics: {
    title: 'Academics',
    subtitle: 'Your academics subtitle here',
    description:
      'Describe your academic programs, curriculum, and teaching approach here.',
    image: '',
    streams: [
      { name: 'Stream / Wing One', description: 'Describe this stream, wing, or grade range.', subjects: ['Subject', 'Subject', 'Subject'], image: '' },
      { name: 'Stream / Wing Two', description: 'Describe this stream, wing, or grade range.', subjects: ['Subject', 'Subject', 'Subject'], image: '' },
      { name: 'Stream / Wing Three', description: 'Describe this stream, wing, or grade range.', subjects: ['Subject', 'Subject', 'Subject'], image: '' },
    ],
    methodology: {
      title: 'How We Teach',
      description: 'Describe your teaching philosophy here.',
      steps: [
        { title: 'Step One', description: 'Describe this part of your approach.', icon: 'lucide:lightbulb' },
        { title: 'Step Two', description: 'Describe this part of your approach.', icon: 'lucide:flask-conical' },
        { title: 'Step Three', description: 'Describe this part of your approach.', icon: 'lucide:clipboard-check' },
        { title: 'Step Four', description: 'Describe this part of your approach.', icon: 'lucide:heart-handshake' },
      ],
    },
    results: {
      title: 'Our Results',
      description: 'Highlight your academic results here.',
      stats: [
        { label: 'Add a label', value: '0%' },
        { label: 'Add a label', value: '0%' },
        { label: 'Add a label', value: '0+' },
        { label: 'Add a label', value: '0' },
      ],
      image: '',
    },
    clubs: [
      { name: 'Club / Activity One', description: 'Describe this club or activity.', image: '' },
      { name: 'Club / Activity Two', description: 'Describe this club or activity.', image: '' },
      { name: 'Club / Activity Three', description: 'Describe this club or activity.', image: '' },
      { name: 'Club / Activity Four', description: 'Describe this club or activity.', image: '' },
    ],
  },

  admissions: {
    title: 'Begin Your Journey With Us',
    subtitle: 'Admissions subtitle here',
    description:
      'Add a short introduction to your admissions process here, inviting families to apply.',
    image: '',
    homeImage: '',
    requirementsImage: '',
    highlights: [
      { icon: 'lucide:shield-check', label: 'Add a highlight' },
      { icon: 'lucide:star', label: 'Add a highlight' },
      { icon: 'lucide:clock', label: 'Add a highlight' },
    ],
    callout: { icon: 'lucide:users', label: 'Limited Seats', sublabel: 'Apply Early' },
    process: {
      title: 'How to Apply',
      steps: [
        { step: 1, title: 'Inquire', description: 'Describe the first step.' },
        { step: 2, title: 'Apply', description: 'Describe the second step.' },
        { step: 3, title: 'Assessment', description: 'Describe the third step.' },
        { step: 4, title: 'Enroll', description: 'Describe the final step.' },
      ],
    },
    whyChoose: [
      { title: 'Reason One', description: 'Add a short supporting statement.', icon: 'lucide:award' },
      { title: 'Reason Two', description: 'Add a short supporting statement.', icon: 'lucide:shield-check' },
      { title: 'Reason Three', description: 'Add a short supporting statement.', icon: 'lucide:users' },
      { title: 'Reason Four', description: 'Add a short supporting statement.', icon: 'lucide:sprout' },
    ],
    faqs: [
      { question: 'Add a frequently asked question here?', answer: 'Add the answer to this question here.' },
      { question: 'Add a frequently asked question here?', answer: 'Add the answer to this question here.' },
      { question: 'Add a frequently asked question here?', answer: 'Add the answer to this question here.' },
      { question: 'Add a frequently asked question here?', answer: 'Add the answer to this question here.' },
    ],
  },

  contact: {
    title: 'Contact Us',
    subtitle: 'Get In Touch',
    image: '',
    address: 'Add your school address here',
    phone: ['+00 00000 00000'],
    email: ['info@yourschool.com'],
    workingHours: 'Mon - Sat: 9AM - 4PM',
    mapEmbedUrl: '',
    landmarks: [
      { icon: 'lucide:map-pin', label: 'Add a nearby landmark' },
      { icon: 'lucide:bus', label: 'Add a nearby landmark' },
      { icon: 'lucide:map', label: 'Add a nearby landmark' },
    ],
    transport: [
      { type: 'Train', detail: 'Add transport details' },
      { type: 'Bus', detail: 'Add transport details' },
      { type: 'Car', detail: 'Add transport details' },
    ],
    visitingHours: [
      { label: 'Main Reception', time: '9:00 AM - 3:00 PM' },
      { label: 'Student Gate', time: '8:30 AM - 4:00 PM' },
    ],
    highlights: [
      { icon: 'lucide:check-circle', label: 'Dedicated Support', sublabel: 'Add a short caption' },
      { icon: 'lucide:star', label: 'Add a highlight', sublabel: 'Add a short caption' },
    ],
  },

  updates: {
    announcements: [
      {
        id: 'ann-1',
        title: 'Your first announcement title',
        short_description: 'Add a short summary of this announcement. This text appears in the announcement card on the home and updates pages.',
        published_date: '2025-01-01',
        category: 'General',
        is_pinned: true,
        thumbnail: '',
      },
      {
        id: 'ann-2',
        title: 'Your second announcement title',
        short_description: 'Add a short summary of this announcement.',
        published_date: '2025-01-01',
        category: 'General',
      },
    ],
    events: [
      {
        id: 'evt-1',
        title: 'Your first event title',
        description: 'Add a short description of this event.',
        date: '2025-01-01',
        location: 'Add a location',
        category: 'General',
      },
    ],
  },

  testimonials: [
    { id: 'test-1', name: 'Reviewer Name', role: 'Parent', content: 'Add a testimonial quote from a parent, student, or alumnus here.', rating: 5 },
    { id: 'test-2', name: 'Reviewer Name', role: 'Parent', content: 'Add a testimonial quote from a parent, student, or alumnus here.', rating: 5 },
    { id: 'test-3', name: 'Reviewer Name', role: 'Alumni', content: 'Add a testimonial quote from a parent, student, or alumnus here.', rating: 5 },
  ],

  stats: [
    { label: 'Add a label', value: '0+', icon: 'lucide:graduation-cap' },
    { label: 'Add a label', value: '0%', icon: 'lucide:check-circle' },
    { label: 'Add a label', value: '0+', icon: 'lucide:users' },
    { label: 'Add a label', value: '0', icon: 'lucide:history' },
  ],

  gallery: {
    title: 'Life at Our Campus',
    images: [
      { src: '', alt: 'Add a caption' },
      { src: '', alt: 'Add a caption' },
      { src: '', alt: 'Add a caption' },
      { src: '', alt: 'Add a caption' },
    ],
  },

  faculty: [],

  alumni: [
    { name: 'Alumnus Name', batch: 'Year', achievement: 'Add their achievement', image: '', testimonial: 'Add a short quote from this alumnus.' },
    { name: 'Alumnus Name', batch: 'Year', achievement: 'Add their achievement', image: '', testimonial: 'Add a short quote from this alumnus.' },
  ],

  programs: [
    {
      id: 'prog-1',
      name: 'Program One',
      description: 'Describe this program and the grades it covers.',
      image: '',
      grade_range: 'Grade range',
      features: ['Add a feature', 'Add a feature', 'Add a feature', 'Add a feature'],
    },
    {
      id: 'prog-2',
      name: 'Program Two',
      description: 'Describe this program and the grades it covers.',
      image: '',
      grade_range: 'Grade range',
      features: ['Add a feature', 'Add a feature', 'Add a feature', 'Add a feature'],
    },
    {
      id: 'prog-3',
      name: 'Program Three',
      description: 'Describe this program and the grades it covers.',
      image: '',
      grade_range: 'Grade range',
      features: ['Add a feature', 'Add a feature', 'Add a feature', 'Add a feature'],
    },
  ],

  portalLinks: [
    { label: 'Access Admin Dashboard', url: '#', variant: 'dark' },
  ],

  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Updates', href: '/updates' },
    { label: 'About', href: '/about' },
    { label: 'Academics', href: '/academics' },
    { label: 'Admissions', href: '/admissions' },
    { label: 'Contact', href: '/contact' },
    { label: 'Login', href: '/login' },
  ],

  socialLinks: [
    { platform: 'facebook', url: '#', icon: 'ri:facebook-fill' },
    { platform: 'youtube', url: '#', icon: 'ri:youtube-fill' },
    { platform: 'instagram', url: '#', icon: 'ri:instagram-fill' },
  ],

  footer: {
    description: 'Add a short description of your school for the footer here.',
    columns: [
      {
        title: 'Quick Links',
        links: [
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Academics', href: '/academics' },
          { label: 'Admissions', href: '/admissions' },
          { label: 'Updates', href: '/updates' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    copyright: '© 2026 Your School Name',
  },
}

export const mockKcgsData: SchoolData = {
  name: 'Kashmir Cambridge Group of Schools',
  tagline: 'Nurturing young minds with excellence in academics, character, and values since 2009 — Tukroo, Shopian.',
  logo: '/assets/kcs/images/header/kcs.webp',
  config: { template_id: 'template-b' },

  hero: {
    slides: [
      {
        title: 'Kashmir Cambridge Group of Schools',
        subtitle: 'Knowledge Meets Innovation',
        description: 'Nurturing young minds with excellence in academics, character, and values since 2009 — Tukroo, Shopian.',
        // No default background video — the hero shows the image until the school
        // uploads its own (optimised) video. See HeroSection's editor control.
        image: '/assets/kcs/images/campus-life/campus-life-hero.webp',
      },
    ],
  },

  about: {
    title: 'About Kashmir Cambridge Group of Schools',
    subtitle: 'Est. 2009',
    description: 'At Kashmir Cambridge Group of Schools, we believe in the transformative power of education and the boundless potential within every individual. Established in 2009, we have been dedicated to fostering intellectual curiosity, academic excellence, and a vibrant campus community.',
    image: '/assets/kcs/images/about/kc-building.webp',
    heroImage: '/assets/kcs/images/about/kc-building-2.webp',
    homeImage: '/assets/kcs/images/campus-life/student-life.webp',
    homeSecondaryImage: '/assets/kcs/images/campus-life/art-culture.webp',
    whyChooseUs: [
      { title: 'Academic Excellence', description: 'Rigorous curriculum with outstanding board results year after year.' },
      { title: 'Experienced Faculty', description: 'Dedicated teachers committed to unlocking every student\'s potential.' },
      { title: 'Modern Facilities', description: 'Labs, library, sports ground, computer center — everything for holistic growth.' },
      { title: 'Safe Environment', description: 'CCTV-monitored campus with transport facility across Shopian district.' },
    ],
    mission: [
      { title: 'Student Life', description: 'Building a vibrant community of creative and accomplished people.', image: '/assets/kcs/images/campus-life/student-life.webp', icon: 'lucide:users' },
      { title: 'Arts & Culture', description: 'Celebrating creativity through cultural programs, art, and music.', image: '/assets/kcs/images/campus-life/art-culture.webp', icon: 'lucide:palette' },
      { title: 'Sports', description: 'Promoting teamwork, discipline, and physical excellence.', image: '/assets/kcs/images/campus-life/athletics.webp', icon: 'lucide:dumbbell' },
    ],
    vision: 'To be the region\'s most trusted institution — producing academically excellent, morally upright citizens who lead with character.',
    values: ['Excellence', 'Integrity', 'Creativity', 'Discipline', 'Teamwork', 'Respect'],
    achievements: [
      {
        title: 'Outstanding Board Results',
        description: 'Consistently high JKBOSE results with distinctions across Class 10 and 12.',
        year: '2024',
        icon: 'lucide:graduation-cap',
      },
      {
        title: 'State-Level Sports',
        description: 'Students represented the district at state-level athletics and cricket tournaments.',
        year: '2023',
        icon: 'lucide:medal',
      },
      {
        title: 'Science & Innovation Fair',
        description: 'Award-winning student projects showcased at regional science exhibitions.',
        year: '2023',
        icon: 'lucide:lightbulb',
      },
      {
        title: 'Arts & Culture Recognition',
        description: 'Felicitated for excellence in cultural programs and the creative arts.',
        year: '2022',
        icon: 'lucide:palette',
      },
      {
        title: 'Best Emerging School',
        description: 'Recognised among Shopian district\'s fastest-growing institutions.',
        year: '2021',
        icon: 'lucide:trending-up',
      },
      {
        title: '15+ Years of Excellence',
        description: 'A trusted name in quality education across the Shopian region since 2009.',
        year: '2009',
        icon: 'lucide:history',
      },
    ],
  },

  academics: {
    title: 'Academics',
    subtitle: 'Knowledge Meets Innovation',
    description:
      'Our rigorous curriculum spans Primary to Senior Secondary, blending JKBOSE board preparation with science, technology, and a vibrant culture of inquiry and extracurricular excellence.',
    image: '/assets/kcs/images/about/kc-building.webp',
    streams: [
      {
        name: 'Science',
        description: 'For aspiring engineers, doctors, and researchers — with modern labs and expert faculty.',
        subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science'],
        image: '/assets/kcs/images/about/kc-building.webp',
      },
      {
        name: 'Commerce',
        description: 'Foundations in business, accountancy, and economics for future leaders and entrepreneurs.',
        subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics'],
        image: '/assets/kcs/images/about/kc-building-2.webp',
      },
      {
        name: 'Humanities',
        description: 'A broad liberal-arts grounding in history, political science, and the social sciences.',
        subjects: ['History', 'Political Science', 'Geography', 'English'],
        image: '/assets/kcs/images/about/kc-building.webp',
      },
    ],
    methodology: {
      title: 'Our Teaching Philosophy',
      description: 'A student-centred approach that balances academic rigour with holistic growth.',
      steps: [
        { title: 'Inquiry-Led Learning', description: 'Students question, explore, and discover rather than simply memorise.', icon: 'lucide:compass' },
        { title: 'Technology-Enabled', description: 'Smart classrooms and digital resources bring every lesson to life.', icon: 'lucide:monitor' },
        { title: 'Personalised Mentoring', description: 'Small class sizes ensure every student is known, guided, and supported.', icon: 'lucide:users' },
        { title: 'Beyond the Classroom', description: 'Clubs, sports, and the arts develop confident, well-rounded individuals.', icon: 'lucide:sparkles' },
      ],
    },
    results: {
      title: 'A Track Record of Excellence',
      description: 'Year after year, our students achieve outstanding board results and beyond.',
      stats: [
        { label: 'Board Pass Rate', value: '98%' },
        { label: 'Distinctions', value: '80%' },
        { label: 'University Placements', value: '95%' },
        { label: 'Years of Excellence', value: '15+' },
      ],
      image: '/assets/kcs/images/about/kc-building-2.webp',
    },
    clubs: [
      { name: 'Robotics & Coding', description: 'Hands-on robotics, programming, and innovation challenges.', image: '/assets/kcs/images/campus-life/student-life.webp' },
      { name: 'Literary & Debate', description: 'Public speaking, debate, and creative writing that sharpen expression.', image: '/assets/kcs/images/campus-life/art-culture.webp' },
      { name: 'Arts & Music', description: 'Painting, theatre, and music nurturing creativity and culture.', image: '/assets/kcs/images/campus-life/art-culture.webp' },
      { name: 'Sports & Athletics', description: 'Cricket, athletics, and indoor games promoting fitness and teamwork.', image: '/assets/kcs/images/campus-life/athletics.webp' },
    ],
  },

  admissions: {
    title: 'Admissions Open',
    subtitle: 'Session 2025–26',
    description: 'Join the Kashmir Cambridge family. We welcome students from Nursery to Class 12. Apply online or visit our campus at Tukroo, Shopian.',
    image: '/assets/kcs/images/about/kc-building-2.webp',
    homeImage: '/assets/kcs/images/campus-life/athletics.webp',
    requirementsImage: '/assets/kcs/images/campus-life/student-life.webp',
    process: {
      title: 'How to Apply',
      steps: [
        { step: 1, title: 'Enquire', description: 'Call or visit our campus to learn about our programs.' },
        { step: 2, title: 'Apply', description: 'Fill out the admission form online or in person.' },
        { step: 3, title: 'Assessment', description: 'Attend an interaction session with our academic team.' },
        { step: 4, title: 'Enroll', description: 'Complete formalities and welcome to Kashmir Cambridge!' },
      ],
    },
    faqs: [
      { question: 'What is the minimum age criteria for Nursery?', answer: 'The child must be 3 years old by March 31st of the academic year they are applying for.' },
      { question: 'Is there an entrance exam for admission?', answer: 'For Class 6 and above, there is a standard assessment in English, Mathematics, and Science to understand the student\'s current academic level.' },
      { question: 'Do you provide school transport?', answer: 'Yes, we offer safe transport facilities across the Shopian district, with attendants on every bus.' },
      { question: 'What is the fee refund policy?', answer: 'Admission fees are non-refundable. Tuition fees may be refunded on a pro-rata basis if a withdrawal notice is given 30 days in advance.' },
      { question: 'What documents are required for admission?', answer: 'Birth Certificate, previous year\'s report card, Aadhar cards (parents and child), passport-size photos, and the Transfer Certificate (TC) from the previous school.' },
      { question: 'What is the student-teacher ratio?', answer: 'We maintain a healthy student-teacher ratio to ensure personalised attention for every child.' },
      { question: 'Are extracurricular activities included in the fee?', answer: 'Most in-house extracurricular activities are included. Specialised external coaching may have additional nominal charges.' },
      { question: 'Can we visit the campus before applying?', answer: 'Yes, we encourage campus tours. Please schedule an appointment through our admission office on working days.' },
    ],
  },

  contact: {
    title: 'Contact Us',
    subtitle: 'Get In Touch',
    image: '/assets/kcs/images/campus-life/campus-life-hero.webp',
    address: 'Tukroo, Shopian, Jammu & Kashmir — 192303',
    phone: ['+91 70060 37002'],
    email: ['info@kashmircambridge.in'],
    workingHours: 'Mon – Sat: 9 AM – 5 PM',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3295.0!2d74.82!3d33.72!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDQzJzEyLjAiTiA3NMKwNDknMTIuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin',
  },

  updates: {
    announcements: [
      {
        id: 'kc-ann-1',
        title: 'Admissions Open for Session 2025–26',
        short_description: 'Applications are now being accepted for Nursery to Class 12. Secure your child\'s place at Kashmir Cambridge with our streamlined online admission process.',
        published_date: '2025-12-10',
        category: 'Admissions',
        is_pinned: true,
        thumbnail: '/assets/kcs/images/about/kc-building.webp',
      },
      {
        id: 'kc-ann-2',
        title: 'Outstanding JKBOSE Board Results',
        short_description: 'Our students achieved a 98% pass rate with numerous distinctions across Class 10 and 12 examinations.',
        published_date: '2025-11-18',
        category: 'Achievement',
        thumbnail: '/assets/kcs/images/about/kc-building-2.webp',
      },
      {
        id: 'kc-ann-3',
        title: 'Annual Science & Innovation Fair',
        short_description: 'Students showcased award-winning projects at our annual science exhibition, judged by visiting academics.',
        published_date: '2025-10-22',
        category: 'Academics',
      },
      {
        id: 'kc-ann-4',
        title: 'New Robotics Lab Inaugurated',
        short_description: 'A modern robotics and coding lab has been opened to nurture the next generation of innovators.',
        published_date: '2025-09-30',
        category: 'Infrastructure',
      },
      {
        id: 'kc-ann-5',
        title: 'Inter-School Cricket Champions',
        short_description: 'Our senior team lifted the district inter-school cricket trophy after a thrilling final.',
        published_date: '2025-09-12',
        category: 'Sports',
      },
    ],
    events: [
      {
        id: 'kc-evt-1',
        title: 'Annual Day & Cultural Fest',
        description: 'An evening of music, dance, and drama celebrating the talents of our students.',
        date: '2025-12-21',
        location: 'KCS Auditorium',
        category: 'Cultural',
      },
      {
        id: 'kc-evt-2',
        title: 'Parent–Teacher Meet',
        description: 'A dedicated session for parents to discuss academic progress with our faculty.',
        date: '2025-11-29',
        location: 'Main Campus',
        category: 'Academic',
      },
      {
        id: 'kc-evt-3',
        title: 'Winter Sports Carnival',
        description: 'Inter-house competitions in athletics, football, and indoor games.',
        date: '2025-12-05',
        location: 'Sports Ground',
        category: 'Sports',
      },
    ],
  },

  testimonials: [
    { id: 't1', name: 'Tariq Ahmad', role: 'Parent', content: 'Kashmir Cambridge has truly shaped my child\'s academic journey. The teachers here go above and beyond to ensure every student reaches their full potential.', rating: 5 },
    { id: 't2', name: 'Nusrat Jan', role: 'Parent', content: 'As a parent, I couldn\'t be happier with my decision to enroll my children here. The discipline, values, and quality education they receive at Kashmir Cambridge is unmatched in the region.', rating: 4 },
    { id: 't3', name: 'Zahoor Ahmad', role: 'Parent', content: 'The years my children spent at Kashmir Cambridge were the most formative of their lives. The campus environment and dedicated faculty prepared them brilliantly for university.', rating: 5 },
    { id: 't4', name: 'Rukhsana Bano', role: 'Parent', content: 'An exceptional school that truly cares about each child\'s growth. The teachers are approachable, the facilities are modern, and the environment is very positive.', rating: 5 },
    { id: 't5', name: 'Bilal Hussain', role: 'Alumni, Batch 2021', content: 'My years at Kashmir Cambridge gave me the confidence and knowledge to pursue engineering at a top NIT. The teachers never gave up on us.', rating: 5 },
    { id: 't6', name: 'Sajida Wani', role: 'Parent', content: 'The school\'s focus on both academics and extracurriculars is commendable. My son has grown so much — academically and as a person.', rating: 5 },
  ],

  stats: [
    { label: 'Students Enrolled', value: '1000+', icon: 'lucide:graduation-cap' },
    { label: 'Expert Faculty', value: '100+', icon: 'lucide:users' },
    { label: 'Years of Excellence', value: '20+', icon: 'lucide:history' },
    { label: 'Successful Alumni', value: '5k+', icon: 'lucide:award' },
  ],

  gallery: {
    images: [
      { src: '/assets/kcs/images/campus-life/student-life.webp', alt: 'Student Life' },
      { src: '/assets/kcs/images/campus-life/art-culture.webp', alt: 'Arts & Culture' },
      { src: '/assets/kcs/images/campus-life/athletics.webp', alt: 'Athletics' },
      { src: '/assets/kcs/images/about/kc-building.webp', alt: 'Campus Building' },
    ],
  },

  faculty: [],

  programs: [
    { id: 'f1', name: 'Modern Classrooms', description: 'Spacious classrooms with whiteboards and modern teaching aids.', features: ['lucide:school', '#4150B6'] },
    { id: 'f2', name: 'Science Laboratory', description: 'Fully equipped lab for Physics, Chemistry, and Biology experiments.', features: ['lucide:flask-conical', '#2563eb'] },
    { id: 'f3', name: 'Computer Lab', description: 'Modern systems providing digital literacy and programming skills.', features: ['lucide:laptop', '#059669'] },
    { id: 'f4', name: 'Library & Reading Room', description: 'Rich collection of textbooks, reference materials, and periodicals.', features: ['lucide:library', '#d97706'] },
    { id: 'f5', name: 'Sports Ground', description: 'Dedicated field for cricket, football, athletics, and outdoor activities.', features: ['lucide:dumbbell', '#7c3aed'] },
    { id: 'f6', name: 'SQAY Training Area', description: 'Traditional Kashmiri martial art coached by experienced instructors.', features: ['lucide:swords', '#dc2626'] },
    { id: 'f7', name: 'Transport Facility', description: 'Safe school transport covering key routes across Shopian district.', features: ['lucide:bus', '#0891b2'] },
    { id: 'f8', name: 'Green Campus', description: 'Beautifully maintained campus surrounded by natural greenery.', features: ['lucide:trees', '#16a34a'] },
    { id: 'f9', name: 'Assembly & Event Hall', description: 'Spacious hall for assemblies, cultural events, and competitions.', features: ['lucide:megaphone', '#e11d48'] },
    { id: 'f10', name: 'First Aid & Medical Room', description: 'On-campus medical room to handle health emergencies.', features: ['lucide:heart-pulse', '#f43f5e'] },
    { id: 'f11', name: 'Clean Water & Canteen', description: 'Purified water stations and hygienic canteen throughout the school day.', features: ['lucide:utensils', '#8b5cf6'] },
    { id: 'f12', name: 'CCTV Surveillance', description: 'Comprehensive CCTV coverage for student and staff safety.', features: ['lucide:cctv', '#475569'] },
  ],

  portalLinks: [
    { label: 'Login with AMI Diaroo', url: 'https://ami.kashmircambridge.com', variant: 'primary' },
    { label: 'Login with Kashmir Cambridge', url: 'https://kmr.kashmircambridge.com', variant: 'dark' },
  ],

  navigation: [
    { label: 'Home', href: '/' },
    { label: 'Updates', href: '/updates' },
    { label: 'About', href: '/about' },
    { label: 'Academics', href: '/academics' },
    { label: 'Admissions', href: '/admissions' },
    { label: 'Contact', href: '/contact' },
  ],

  socialLinks: [
    { platform: 'facebook', url: 'https://www.facebook.com/people/Kashmir-Cambridge-Group-Of-Schools/61560041427806/', icon: 'mdi:facebook' },
    { platform: 'instagram', url: 'https://www.instagram.com/kashmircambridge', icon: 'mdi:instagram' },
    { platform: 'youtube', url: 'https://www.youtube.com/@kashmircambridgegroupofsch-y6h', icon: 'mdi:youtube' },
  ],

  footer: {
    description: 'We are passionate about education, dedicated to providing high-quality resources to learners of all backgrounds.',
    columns: [
      {
        title: 'Our Campus',
        links: [
          { label: 'Academics', href: '/academics' },
          { label: 'Updates & Events', href: '/updates' },
        ],
      },
      {
        title: 'Explore',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Admissions', href: '/admissions' },
          { label: 'Contact Us', href: '/contact' },
        ],
      },
    ],
    copyright: '© 2026 Kashmir Cambridge Group of Schools',
  },
};
