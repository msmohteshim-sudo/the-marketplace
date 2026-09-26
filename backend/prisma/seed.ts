import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding The Marketplace database...');

  // Create categories
  const categories = [
    // Digital Services
    { name: 'Web Development', slug: 'web-dev', type: 'digital_service', icon: '💻' },
    { name: 'Mobile Development', slug: 'mobile-dev', type: 'digital_service', icon: '📱' },
    { name: 'AI & Machine Learning', slug: 'ai-ml', type: 'digital_service', icon: '🤖' },
    { name: 'Graphic Design', slug: 'graphic-design', type: 'digital_service', icon: '🎨' },
    { name: 'UI/UX Design', slug: 'ui-ux', type: 'digital_service', icon: '✏️' },
    { name: 'Video Editing', slug: 'video-editing', type: 'digital_service', icon: '🎬' },
    { name: 'Content Writing', slug: 'content-writing', type: 'digital_service', icon: '📝' },
    { name: 'SEO & Marketing', slug: 'seo-marketing', type: 'digital_service', icon: '📈' },
    { name: 'Data Science', slug: 'data-science', type: 'digital_service', icon: '📊' },
    { name: 'Cybersecurity', slug: 'cybersecurity', type: 'digital_service', icon: '🔒' },
    // Local Services
    { name: 'Electrician', slug: 'electrician', type: 'local_service', icon: '⚡' },
    { name: 'Plumber', slug: 'plumber', type: 'local_service', icon: '🔧' },
    { name: 'Cleaning', slug: 'cleaning', type: 'local_service', icon: '🧹' },
    { name: 'Photography', slug: 'photography', type: 'local_service', icon: '📸' },
    { name: 'Tutoring', slug: 'tutoring', type: 'local_service', icon: '📚' },
    { name: 'Moving Assistance', slug: 'moving', type: 'local_service', icon: '📦' },
    // Digital Jobs
    { name: 'React Developer', slug: 'react-dev', type: 'digital_job', icon: '⚛️' },
    { name: 'Python Developer', slug: 'python-dev', type: 'digital_job', icon: '🐍' },
    { name: 'Full Stack Developer', slug: 'fullstack', type: 'digital_job', icon: '🖥️' },
    { name: 'Data Analyst', slug: 'data-analyst', type: 'digital_job', icon: '📉' },
    // Local Jobs
    { name: 'Home Repair', slug: 'home-repair', type: 'local_job', icon: '🔨' },
    { name: 'Event Assistant', slug: 'event-assist', type: 'local_job', icon: '🎪' },
    // Ideas
    { name: 'Startup Ideas', slug: 'startup-ideas', type: 'idea', icon: '💡' },
    { name: 'App Ideas', slug: 'app-ideas', type: 'idea', icon: '📱' },
    { name: 'AI Ideas', slug: 'ai-ideas', type: 'idea', icon: '🤖' },
    { name: 'Business Ideas', slug: 'business-ideas', type: 'idea', icon: '💼' },
    // Courses
    { name: 'Programming', slug: 'programming', type: 'course', icon: '💻' },
    { name: 'Web Development', slug: 'web-dev-course', type: 'course', icon: '🌐' },
    { name: 'Data Science', slug: 'data-science-course', type: 'course', icon: '📊' },
    { name: 'AI & ML', slug: 'ai-ml-course', type: 'course', icon: '🤖' },
    { name: 'Business', slug: 'business-course', type: 'course', icon: '💼' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });
  }

  // Create admin user
  const adminHash = await bcrypt.hash('Admin@1234', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@marketplace.com' },
    update: {},
    create: {
      email: 'admin@marketplace.com',
      passwordHash: adminHash,
      fullName: 'Marketplace Admin',
      isAdmin: true,
      isVerified: true,
      activeMode: 'client',
      profileComplete: 100,
      profile: { create: {} }
    }
  });

  // Create demo users
  const hash = await bcrypt.hash('Demo@1234', 10);

  const users = [
    { email: 'rahul@demo.com', fullName: 'Rahul Sharma', activeMode: 'freelancer', capabilities: JSON.stringify(['freelancer']), freelancerWorkPreference: 'digital', bio: 'Full Stack Developer with 5+ years experience', location: 'Mumbai, India' },
    { email: 'priya@demo.com', fullName: 'Priya Patel', activeMode: 'client', capabilities: JSON.stringify(['client', 'freelancer']), clientWorkPreference: 'both', freelancerWorkPreference: 'digital', bio: 'AI/ML Engineer & Hiring Manager (Client + Freelancer)', location: 'Bangalore, India' },
    { email: 'arjun@demo.com', fullName: 'Arjun Singh', activeMode: 'freelancer', capabilities: JSON.stringify(['freelancer']), freelancerWorkPreference: 'physical', bio: 'Expert Electrician, 8 years experience', location: 'Delhi, India' },
    { email: 'meera@demo.com', fullName: 'Meera Nair', activeMode: 'freelancer', capabilities: JSON.stringify(['freelancer']), freelancerWorkPreference: 'both', bio: 'Serial Entrepreneur & Idea Creator', location: 'Hyderabad, India' },
    { email: 'client@demo.com', fullName: 'Rohan Gupta', activeMode: 'client', capabilities: JSON.stringify(['client']), clientWorkPreference: 'both', bio: 'Startup founder looking for talent', location: 'Pune, India' },
  ];

  const createdUsers: any[] = [];
  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        capabilities: u.capabilities,
        clientWorkPreference: u.clientWorkPreference || 'both',
        freelancerWorkPreference: u.freelancerWorkPreference || 'both'
      },
      create: {
        email: u.email,
        passwordHash: hash,
        fullName: u.fullName,
        activeMode: u.activeMode,
        capabilities: u.capabilities,
        clientWorkPreference: u.clientWorkPreference || 'both',
        freelancerWorkPreference: u.freelancerWorkPreference || 'both',
        bio: u.bio,
        location: u.location,
        isVerified: true,
        profileComplete: 80,
        profile: {
          create: {
            skills: JSON.stringify(['JavaScript', 'React', 'Node.js']),
            languages: JSON.stringify(['English', 'Hindi'])
          }
        }
      }
    });
    createdUsers.push(user);
  }

  const [rahul, priya, arjun, meera, rohan] = createdUsers;

  // Get categories
  const webDevCat = await prisma.category.findFirst({ where: { slug: 'web-dev' } });
  const aiMlCat = await prisma.category.findFirst({ where: { slug: 'ai-ml' } });
  const electricianCat = await prisma.category.findFirst({ where: { slug: 'electrician' } });
  const startupIdeasCat = await prisma.category.findFirst({ where: { slug: 'startup-ideas' } });
  const programmingCat = await prisma.category.findFirst({ where: { slug: 'programming' } });
  const webDevCourseCat = await prisma.category.findFirst({ where: { slug: 'web-dev-course' } });

  // Create demo services
  if (rahul) {
    await prisma.service.create({
      data: {
        sellerId: rahul.id,
        title: 'Professional React.js Web Application Development',
        description: 'I will build a modern, fast, and responsive React web application for your business. Specializing in React 18, TypeScript, and modern best practices.',
        type: 'digital',
        categoryId: webDevCat?.id,
        tags: JSON.stringify(['React', 'TypeScript', 'Web App']),
        totalOrders: 47,
        totalRating: 4.9,
        ratingCount: 23,
        isVerified: true,
        packages: {
          create: [
            { name: 'Basic', description: 'Simple landing page', price: 2999, deliveryDays: 3, revisions: 2 },
            { name: 'Standard', description: 'Full web app with 5 pages', price: 7999, deliveryDays: 7, revisions: 3 },
            { name: 'Premium', description: 'Complete web app with dashboard', price: 14999, deliveryDays: 14, revisions: 5 }
          ]
        }
      }
    });

    await prisma.service.create({
      data: {
        sellerId: rahul.id,
        title: 'REST API Development with Node.js & Express',
        description: 'High-performance REST APIs with Node.js, Express, and your choice of database.',
        type: 'digital',
        categoryId: webDevCat?.id,
        tags: JSON.stringify(['Node.js', 'API', 'Backend']),
        totalOrders: 32,
        totalRating: 4.8,
        ratingCount: 18,
        packages: {
          create: [
            { name: 'Basic', price: 1999, deliveryDays: 2, revisions: 1 },
            { name: 'Standard', price: 4999, deliveryDays: 5, revisions: 2 },
            { name: 'Premium', price: 9999, deliveryDays: 10, revisions: 3 }
          ]
        }
      }
    });
  }

  if (priya) {
    await prisma.service.create({
      data: {
        sellerId: priya.id,
        title: 'AI/ML Model Development & Integration',
        description: 'Custom AI and Machine Learning solutions. From data analysis to model deployment.',
        type: 'digital',
        categoryId: aiMlCat?.id,
        tags: JSON.stringify(['Python', 'AI', 'Machine Learning']),
        totalOrders: 28,
        totalRating: 5.0,
        ratingCount: 15,
        isVerified: true,
        packages: {
          create: [
            { name: 'Basic', description: 'Data analysis and visualization', price: 4999, deliveryDays: 5, revisions: 2 },
            { name: 'Standard', description: 'Custom ML model', price: 12999, deliveryDays: 14, revisions: 2 },
            { name: 'Premium', description: 'End-to-end AI solution', price: 29999, deliveryDays: 30, revisions: 3 }
          ]
        }
      }
    });
  }

  if (arjun) {
    await prisma.service.create({
      data: {
        sellerId: arjun.id,
        title: 'Professional Electrician Services — Home & Office',
        description: 'Expert electrical work for homes and offices. Wiring, repairs, installations, and more.',
        type: 'local',
        categoryId: electricianCat?.id,
        location: 'Delhi NCR',
        serviceRadius: 15,
        tags: JSON.stringify(['Electrician', 'Wiring', 'Installation']),
        totalOrders: 156,
        totalRating: 4.9,
        ratingCount: 89,
        isVerified: true,
        packages: {
          create: [
            { name: 'Basic', description: 'Minor repairs & checkup', price: 499, deliveryDays: 1, revisions: 0 },
            { name: 'Standard', description: 'Full room wiring', price: 1999, deliveryDays: 1, revisions: 0 },
            { name: 'Premium', description: 'Complete home electrical work', price: 5999, deliveryDays: 2, revisions: 0 }
          ]
        }
      }
    });
  }

  // Create demo jobs
  if (rohan) {
    await prisma.job.create({
      data: {
        clientId: rohan.id,
        title: 'Senior React Developer needed for SaaS Product',
        description: 'We are building a B2B SaaS platform and need an experienced React developer.',
        type: 'digital',
        categoryId: webDevCat?.id,
        skills: JSON.stringify(['React', 'TypeScript', 'Node.js']),
        budgetMin: 30000,
        budgetMax: 60000,
        paymentType: 'monthly',
        duration: '1_3_months',
        status: 'open'
      }
    });

    await prisma.job.create({
      data: {
        clientId: rohan.id,
        title: 'Need Electrician for Office Setup — Mumbai',
        description: 'Setting up a new office of 2000 sq ft. Need professional electrician.',
        type: 'local',
        categoryId: electricianCat?.id,
        budgetMin: 15000,
        budgetMax: 25000,
        location: 'Mumbai, Maharashtra',
        workersNeeded: 2,
        urgency: 'normal',
        status: 'open'
      }
    });
  }

  // Create demo ideas
  if (meera) {
    await prisma.idea.create({
      data: {
        creatorId: meera.id,
        categoryId: startupIdeasCat?.id,
        title: 'AI-Powered Local Food Discovery App',
        summary: 'An app that uses AI to discover authentic local restaurants and hidden gems based on food preference DNA profiling.',
        problem: 'People struggle to find authentic local food experiences, especially in new cities. Generic review apps don\'t capture food DNA.',
        solution: 'AI profiling based on past food preferences + local restaurant partnerships + reward system for early adopters.',
        targetUsers: 'Food enthusiasts, travelers, millennials aged 22-40',
        stage: 'concept',
        price: 49999,
        licenseTypes: JSON.stringify(['commercial', 'startup']),
        tags: JSON.stringify(['Food Tech', 'AI', 'Startup'])
      }
    });

    await prisma.idea.create({
      data: {
        creatorId: meera.id,
        categoryId: startupIdeasCat?.id,
        title: 'Skill Certification via Blockchain',
        summary: 'A platform that issues tamper-proof skill certificates on blockchain, verifiable by employers.',
        problem: 'Certificate fraud is rampant. Employers spend too much time verifying credentials.',
        solution: 'Issue all certificates as NFTs on a public blockchain. Employers scan QR code to instantly verify.',
        targetUsers: 'HR teams, educational institutions, professional certification bodies',
        stage: 'prototype',
        price: 99999,
        licenseTypes: JSON.stringify(['exclusive']),
        isNDARequired: true,
        tags: JSON.stringify(['Blockchain', 'EdTech', 'HR Tech'])
      }
    });
  }

  // Create demo courses
  if (priya) {
    const course = await prisma.course.create({
      data: {
        instructorId: priya.id,
        categoryId: programmingCat?.id,
        title: 'Complete Python & Machine Learning Bootcamp 2024',
        description: 'Go from Python beginner to AI/ML expert. 50+ hours of video content, real projects, and a certificate.',
        level: 'beginner',
        price: 1499,
        totalStudents: 3240,
        totalRating: 4.8,
        ratingCount: 892,
        totalDuration: 3000,
        hasCertificate: true,
        status: 'published',
        tags: JSON.stringify(['Python', 'Machine Learning', 'AI'])
      }
    });

    await prisma.courseModule.create({
      data: {
        courseId: course.id,
        title: 'Python Fundamentals',
        order: 1,
        lessons: {
          create: [
            { title: 'Setting up Python Environment', type: 'video', duration: 15, order: 1, isFree: true },
            { title: 'Variables & Data Types', type: 'video', duration: 20, order: 2 },
            { title: 'Control Flow', type: 'video', duration: 25, order: 3 }
          ]
        }
      }
    });
  }

  if (rahul) {
    await prisma.course.create({
      data: {
        instructorId: rahul.id,
        categoryId: webDevCourseCat?.id,
        title: 'Full Stack Web Development with React & Node.js',
        description: 'Master modern web development. Build 5 real-world projects and land your first developer job.',
        level: 'intermediate',
        price: 1999,
        totalStudents: 1850,
        totalRating: 4.9,
        ratingCount: 423,
        totalDuration: 3600,
        hasCertificate: true,
        status: 'published',
        tags: JSON.stringify(['React', 'Node.js', 'Full Stack'])
      }
    });
  }

  console.log('✅ Seeding completed!');
  console.log('\n📋 Demo accounts:');
  console.log('Admin:    admin@marketplace.com  / Admin@1234');
  console.log('Freelancer: rahul@demo.com       / Demo@1234');
  console.log('Instructor: priya@demo.com       / Demo@1234');
  console.log('Local Worker: arjun@demo.com     / Demo@1234');
  console.log('Idea Creator: meera@demo.com     / Demo@1234');
  console.log('Client:   client@demo.com        / Demo@1234');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
