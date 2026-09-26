import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getJobs = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const {
      type,
      category,
      minBudget,
      maxBudget,
      paymentType,
      duration,
      search,
      sort = 'newest',
      page = '1',
      limit = '36'
    } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Build Prisma query condition
    const where: any = { status: 'open' };

    // Strictly enforce digital if requested
    if (type) where.type = type;
    if (paymentType) where.paymentType = paymentType;

    if (category) {
      const cat = (category as string).toLowerCase();

      if (cat === 'express') {
        where.OR = [
          { categoryId: 'express' },
          { duration: { contains: 'Day' } },
          { tags: { contains: 'express' } },
          { title: { contains: 'Express' } },
          { title: { contains: 'Bug' } },
          { title: { contains: 'Fix' } }
        ];
      } else if (cat === 'mobile-dev') {
        where.OR = [
          { categoryId: 'mobile-dev' },
          { skills: { contains: 'Flutter' } },
          { skills: { contains: 'React Native' } },
          { skills: { contains: 'iOS' } },
          { skills: { contains: 'Swift' } },
          { tags: { contains: 'mobile-dev' } },
          { title: { contains: 'Mobile' } },
          { title: { contains: 'App' } }
        ];
      } else if (cat === 'graphic-design' || cat === 'ui-ux') {
        where.OR = [
          { categoryId: 'graphic-design' },
          { skills: { contains: 'Figma' } },
          { skills: { contains: 'UI/UX' } },
          { tags: { contains: 'graphic-design' } },
          { title: { contains: 'UI/UX' } },
          { title: { contains: 'Figma' } },
          { title: { contains: 'Design' } }
        ];
      } else if (cat === 'ai-ml') {
        where.OR = [
          { categoryId: 'ai-ml' },
          { skills: { contains: 'AI' } },
          { skills: { contains: 'Python' } },
          { skills: { contains: 'OpenAI' } },
          { tags: { contains: 'ai-ml' } },
          { title: { contains: 'AI' } },
          { title: { contains: 'Machine Learning' } },
          { title: { contains: 'LLM' } },
          { title: { contains: 'Data' } }
        ];
      } else if (cat === 'cloud-devops') {
        where.OR = [
          { categoryId: 'cloud-devops' },
          { skills: { contains: 'DevOps' } },
          { skills: { contains: 'AWS' } },
          { skills: { contains: 'Docker' } },
          { tags: { contains: 'cloud-devops' } },
          { title: { contains: 'DevOps' } },
          { title: { contains: 'Cloud' } },
          { title: { contains: 'Kubernetes' } }
        ];
      } else if (cat === 'security') {
        where.OR = [
          { categoryId: 'security' },
          { skills: { contains: 'Security' } },
          { skills: { contains: 'Pentesting' } },
          { tags: { contains: 'security' } },
          { title: { contains: 'Security' } },
          { title: { contains: 'Audit' } },
          { title: { contains: 'Penetration' } }
        ];
      } else if (cat === 'web-dev') {
        where.OR = [
          { categoryId: 'web-dev' },
          { skills: { contains: 'React' } },
          { skills: { contains: 'Next.js' } },
          { skills: { contains: 'Node.js' } },
          { tags: { contains: 'web-dev' } },
          { title: { contains: 'Web' } },
          { title: { contains: 'React' } },
          { title: { contains: 'Full-Stack' } }
        ];
      } else {
        where.OR = [
          { categoryId: cat },
          { skills: { contains: cat } },
          { tags: { contains: cat } },
          { title: { contains: cat } }
        ];
      }
    }

    if (search) {
      const q = search as string;
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { skills: { contains: q } },
        { tags: { contains: q } }
      ];
    }

    // Force seed comprehensive digital jobs if fewer than 20 digital jobs exist
    const countDigitalJobs = await prisma.job.count({ where: { type: 'digital' } });
    if (countDigitalJobs < 20) {
      const defaultUser = await prisma.user.findFirst();
      if (defaultUser) {
        const ALL_SAMPLE_JOBS = [
          // ─── 1. WEB DEV ───
          {
            clientId: defaultUser.id,
            title: 'Full-Stack SaaS MVP Development using Next.js 14 & Supabase',
            description: 'Require an experienced Full-Stack Engineer to build an MVP SaaS platform with App Router, Supabase Auth, Stripe Webhooks, and responsive glassmorphism UI.',
            type: 'digital',
            categoryId: 'web-dev',
            skills: JSON.stringify(['Next.js', 'React', 'TypeScript', 'Supabase', 'TailwindCSS']),
            tags: JSON.stringify(['web-dev', 'react', 'nextjs']),
            budgetMin: 50000,
            budgetMax: 85000,
            paymentType: 'Fixed',
            duration: '3-4 Weeks',
            urgency: 'high'
          },
          {
            clientId: defaultUser.id,
            title: 'Refactor Legacy Node.js Backend to TypeScript & Prisma ORM',
            description: 'Migrate legacy Express JavaScript API codebase to strict TypeScript with Prisma ORM data validation, Zod schemas, and Jest unit test suite.',
            type: 'digital',
            categoryId: 'web-dev',
            skills: JSON.stringify(['Node.js', 'TypeScript', 'Express', 'Prisma', 'Jest']),
            tags: JSON.stringify(['web-dev', 'nodejs']),
            budgetMin: 35000,
            budgetMax: 60000,
            paymentType: 'Fixed',
            duration: '2 Weeks',
            urgency: 'medium'
          },
          {
            clientId: defaultUser.id,
            title: 'React Real-Time Messaging & WebSockets Chat Dashboard',
            description: 'Build a real-time collaborative workspace chat UI in React with Socket.io web-socket connections, typing indicators, and file attachments.',
            type: 'digital',
            categoryId: 'web-dev',
            skills: JSON.stringify(['React', 'Socket.io', 'Node.js', 'WebSockets', 'Tailwind']),
            tags: JSON.stringify(['web-dev', 'react']),
            budgetMin: 25000,
            budgetMax: 40000,
            paymentType: 'Fixed',
            duration: '1-2 Weeks',
            urgency: 'high'
          },

          // ─── 2. MOBILE APPS ───
          {
            clientId: defaultUser.id,
            title: 'Flutter E-Commerce Mobile App with Razorpay & UPI Payment',
            description: 'Build a cross-platform Flutter mobile shop app for iOS and Android featuring product catalog, cart persistence, and Razorpay/UPI SDK integration.',
            type: 'digital',
            categoryId: 'mobile-dev',
            skills: JSON.stringify(['Flutter', 'Dart', 'Firebase', 'Razorpay', 'iOS', 'Android']),
            tags: JSON.stringify(['mobile-dev', 'flutter']),
            budgetMin: 40000,
            budgetMax: 70000,
            paymentType: 'Fixed',
            duration: '3 Weeks',
            urgency: 'high'
          },
          {
            clientId: defaultUser.id,
            title: 'React Native Social Media Feed App with Camera & Push Notifications',
            description: 'Develop a responsive React Native app with image cropping, AWS S3 upload, OneSignal push notifications, and infinite scrolling feed.',
            type: 'digital',
            categoryId: 'mobile-dev',
            skills: JSON.stringify(['React Native', 'Expo', 'AWS S3', 'Push Notifications']),
            tags: JSON.stringify(['mobile-dev', 'react-native']),
            budgetMin: 35000,
            budgetMax: 55000,
            paymentType: 'Fixed',
            duration: '2-3 Weeks',
            urgency: 'medium'
          },
          {
            clientId: defaultUser.id,
            title: 'Native iOS SwiftUI Fitness Tracker App & Apple HealthKit',
            description: 'Native Swift iOS application reading step count and heart rate metrics via Apple HealthKit, with sleek SwiftUI charts.',
            type: 'digital',
            categoryId: 'mobile-dev',
            skills: JSON.stringify(['Swift', 'SwiftUI', 'HealthKit', 'iOS']),
            tags: JSON.stringify(['mobile-dev', 'swift']),
            budgetMin: 30000,
            budgetMax: 50000,
            paymentType: 'Fixed',
            duration: '2 Weeks',
            urgency: 'medium'
          },

          // ─── 3. UI/UX DESIGN ───
          {
            clientId: defaultUser.id,
            title: 'Complete SaaS Dashboard UI/UX Design System in Figma',
            description: 'Seeking a Lead Product Designer to create an end-to-end design system in Figma with auto-layout v5, dark theme, 20+ responsive screens.',
            type: 'digital',
            categoryId: 'graphic-design',
            skills: JSON.stringify(['Figma', 'UI/UX', 'Design System', 'Prototyping']),
            tags: JSON.stringify(['graphic-design', 'figma']),
            budgetMin: 20000,
            budgetMax: 35000,
            paymentType: 'Fixed',
            duration: '1-2 Weeks',
            urgency: 'medium'
          },
          {
            clientId: defaultUser.id,
            title: 'Mobile App Redesign & Interactive Clickable Prototype',
            description: 'Redesign existing mobile fintech app UI to modern glassmorphism aesthetic with animated micro-interactions and user flow prototype in Figma.',
            type: 'digital',
            categoryId: 'graphic-design',
            skills: JSON.stringify(['Figma', 'UI/UX', 'Mobile Design', 'User Research']),
            tags: JSON.stringify(['graphic-design', 'ui-ux']),
            budgetMin: 18000,
            budgetMax: 28000,
            paymentType: 'Fixed',
            duration: '1 Week',
            urgency: 'high'
          },
          {
            clientId: defaultUser.id,
            title: 'E-Commerce Branding & Responsive Web Design Kit',
            description: 'Comprehensive brand identity kit including logo suite, typography hierarchy, custom icons, and desktop/mobile Figma templates.',
            type: 'digital',
            categoryId: 'graphic-design',
            skills: JSON.stringify(['Figma', 'Branding', 'Graphic Design', 'UI/UX']),
            tags: JSON.stringify(['graphic-design', 'branding']),
            budgetMin: 15000,
            budgetMax: 25000,
            paymentType: 'Fixed',
            duration: '1 Week',
            urgency: 'medium'
          },

          // ─── 4. AI & DATA ───
          {
            clientId: defaultUser.id,
            title: 'Build AI-Powered SaaS Backend with OpenAI RAG & FastAPI',
            description: 'Looking for a Senior Python / AI Engineer to build a production Retrieval-Augmented Generation (RAG) backend endpoint using Anthropic Claude API, LangChain, and Pinecone vector store.',
            type: 'digital',
            categoryId: 'ai-ml',
            skills: JSON.stringify(['Python', 'OpenAI', 'FastAPI', 'Vector DB', 'Pinecone', 'AI']),
            tags: JSON.stringify(['ai-ml', 'ai', 'python']),
            budgetMin: 45000,
            budgetMax: 75000,
            paymentType: 'Fixed',
            duration: '2-3 Weeks',
            urgency: 'high'
          },
          {
            clientId: defaultUser.id,
            title: 'Fine-Tune Open-Source Llama 3 Model for Code Review Automation',
            description: 'Need an ML engineer to fine-tune Llama 3 on custom Git pull request diff datasets for automated security and syntax code review generation.',
            type: 'digital',
            categoryId: 'ai-ml',
            skills: JSON.stringify(['Python', 'PyTorch', 'Llama 3', 'HuggingFace', 'AI']),
            tags: JSON.stringify(['ai-ml', 'ml', 'python']),
            budgetMin: 60000,
            budgetMax: 95000,
            paymentType: 'Fixed',
            duration: '3-4 Weeks',
            urgency: 'medium'
          },
          {
            clientId: defaultUser.id,
            title: 'Customer Churn Analytics & Predictive Machine Learning Model',
            description: 'Develop a Scikit-Learn predictive model and Pandas data pipeline to analyze user activity logs and flag customer churn risk in real-time.',
            type: 'digital',
            categoryId: 'ai-ml',
            skills: JSON.stringify(['Python', 'Pandas', 'Scikit-Learn', 'SQL', 'Data Science']),
            tags: JSON.stringify(['ai-ml', 'data-science']),
            budgetMin: 30000,
            budgetMax: 50000,
            paymentType: 'Fixed',
            duration: '1-2 Weeks',
            urgency: 'medium'
          },

          // ─── 5. CLOUD & DEVOPS ───
          {
            clientId: defaultUser.id,
            title: 'AWS EKS Kubernetes Cluster Setup & Automated GitHub Actions CI/CD',
            description: 'Architect a production-ready AWS EKS Kubernetes cluster with ArgoCD GitOps, Helm charts, Ingress NGINX controller, and SSL cert automation.',
            type: 'digital',
            categoryId: 'cloud-devops',
            skills: JSON.stringify(['Kubernetes', 'AWS', 'Docker', 'Terraform', 'CI/CD']),
            tags: JSON.stringify(['cloud-devops', 'kubernetes']),
            budgetMin: 40000,
            budgetMax: 65000,
            paymentType: 'Fixed',
            duration: '2 Weeks',
            urgency: 'high'
          },
          {
            clientId: defaultUser.id,
            title: 'Dockerize Django + PostgreSQL Application & Deploy to GCP Cloud Run',
            description: 'Create multi-stage Dockerfiles, set up GCP Cloud SQL PostgreSQL connection pool, and configure Cloud Build automated deployment pipeline.',
            type: 'digital',
            categoryId: 'cloud-devops',
            skills: JSON.stringify(['Docker', 'GCP', 'Django', 'PostgreSQL', 'Cloud Run']),
            tags: JSON.stringify(['cloud-devops', 'docker']),
            budgetMin: 20000,
            budgetMax: 32000,
            paymentType: 'Fixed',
            duration: '1 Week',
            urgency: 'medium'
          },
          {
            clientId: defaultUser.id,
            title: 'Terraform Multi-Region Cloud Infrastructure Provisioning',
            description: 'Write IaC Terraform modules for AWS VPC subnets, RDS PostgreSQL multi-AZ database failover, and CloudWatch log metrics.',
            type: 'digital',
            categoryId: 'cloud-devops',
            skills: JSON.stringify(['Terraform', 'AWS', 'RDS', 'DevOps']),
            tags: JSON.stringify(['cloud-devops', 'terraform']),
            budgetMin: 35000,
            budgetMax: 55000,
            paymentType: 'Fixed',
            duration: '2 Weeks',
            urgency: 'medium'
          },

          // ─── 6. CYBERSECURITY ───
          {
            clientId: defaultUser.id,
            title: 'Web Application Penetration Test & Security Audit Report',
            description: 'Conduct a thorough gray-box security audit of our Node.js & React SaaS platform, checking for SQLi, XSS, auth bypass, IDOR, and SSRF.',
            type: 'digital',
            categoryId: 'security',
            skills: JSON.stringify(['Cybersecurity', 'Pentesting', 'BurpSuite', 'OWASP']),
            tags: JSON.stringify(['security', 'pentesting']),
            budgetMin: 25000,
            budgetMax: 45000,
            paymentType: 'Fixed',
            duration: '1-2 Weeks',
            urgency: 'high'
          },
          {
            clientId: defaultUser.id,
            title: 'API Gateway Authentication & OAuth2 Rate Limiting Audit',
            description: 'Audit JWT token validation logic, prevent brute-force API rate limiting vulnerabilities, and secure secrets handling.',
            type: 'digital',
            categoryId: 'security',
            skills: JSON.stringify(['Security', 'OAuth2', 'JWT', 'API Security']),
            tags: JSON.stringify(['security', 'api-security']),
            budgetMin: 20000,
            budgetMax: 35000,
            paymentType: 'Fixed',
            duration: '1 Week',
            urgency: 'high'
          },

          // ─── 7. EXPRESS 24H ───
          {
            clientId: defaultUser.id,
            title: 'Fix React AuthContext Session Refresh Loop & CORS Header Bug',
            description: 'Emergency 24h bug fix required! Axios interceptor refresh token loop is failing on production build under CORS headers. Urgent assistance needed.',
            type: 'digital',
            categoryId: 'express',
            skills: JSON.stringify(['React', 'Axios', 'CORS', 'Bug Fix', 'Express']),
            tags: JSON.stringify(['express', 'bug-fix']),
            budgetMin: 5000,
            budgetMax: 10000,
            paymentType: 'Fixed',
            duration: '1-2 Days',
            urgency: 'high'
          },
          {
            clientId: defaultUser.id,
            title: 'Optimize Slow MongoDB Aggregation Query & Add Indexing',
            description: 'Database query execution time is exceeding 8 seconds on large user collections. Need an expert to optimize query pipeline and add compound indexes.',
            type: 'digital',
            categoryId: 'express',
            skills: JSON.stringify(['MongoDB', 'Node.js', 'Database Tuning', 'Express']),
            tags: JSON.stringify(['express', 'database']),
            budgetMin: 6000,
            budgetMax: 12000,
            paymentType: 'Fixed',
            duration: '1-2 Days',
            urgency: 'high'
          },
          {
            clientId: defaultUser.id,
            title: 'Fix Stripe Webhook Payment Verification Signature Error',
            description: 'Stripe webhook signature validation fails in Node.js Express endpoint. Need 24h hotfix for live checkout workflow.',
            type: 'digital',
            categoryId: 'express',
            skills: JSON.stringify(['Node.js', 'Stripe', 'Express', 'Webhooks']),
            tags: JSON.stringify(['express', 'stripe']),
            budgetMin: 4500,
            budgetMax: 9000,
            paymentType: 'Fixed',
            duration: '1 Day',
            urgency: 'high'
          }
        ];

        for (const j of ALL_SAMPLE_JOBS) {
          await prisma.job.create({ data: j });
        }
      }
    }

    let jobs = await prisma.job.findMany({
      where,
      include: {
        client: { select: { id: true, fullName: true, profilePhoto: true, location: true } },
        category: true,
        _count: { select: { applications: true } }
      },
      skip,
      take: parseInt(limit as string),
      orderBy: sort === 'highest_budget' ? { budgetMin: 'desc' }
        : sort === 'lowest_budget' ? { budgetMin: 'asc' }
        : { createdAt: 'desc' }
    });

    // In-memory filter for budget if specified
    if (minBudget || maxBudget) {
      const minB = minBudget ? parseFloat(minBudget as string) : 0;
      const maxB = maxBudget ? parseFloat(maxBudget as string) : Infinity;
      jobs = jobs.filter(j => {
        const b = j.budgetMin || j.budgetMax || 0;
        return b >= minB && b <= maxB;
      });
    }

    const total = jobs.length;

    return res.json({
      jobs,
      total,
      page: parseInt(page as string),
      pages: Math.ceil(total / parseInt(limit as string))
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getJob = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        client: { include: { profile: true } },
        category: true,
        _count: { select: { applications: true } }
      }
    });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    return res.json({ job });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createJob = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { title, description, type, categoryId, skills, tags, budgetMin, budgetMax, paymentType, duration, location, workersNeeded, scheduledDate, urgency } = req.body;

    const job = await prisma.job.create({
      data: {
        clientId: req.user!.userId,
        title,
        description,
        type,
        categoryId,
        skills: skills ? JSON.stringify(skills) : null,
        tags: tags ? JSON.stringify(tags) : null,
        budgetMin: budgetMin ? parseFloat(budgetMin) : null,
        budgetMax: budgetMax ? parseFloat(budgetMax) : null,
        paymentType,
        duration,
        location,
        workersNeeded: workersNeeded ? parseInt(workersNeeded) : 1,
        scheduledDate,
        urgency
      }
    });

    return res.status(201).json({ message: 'Job posted successfully', job });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateJob = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job || job.clientId !== req.user!.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updated = await prisma.job.update({ where: { id }, data: req.body });
    return res.json({ job: updated });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteJob = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job || job.clientId !== req.user!.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await prisma.job.delete({ where: { id } });
    return res.json({ message: 'Job deleted' });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const applyToJob = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const { coverLetter, proposedBudget, estimatedDuration } = req.body;

    const existing = await prisma.application.findFirst({
      where: { jobId: id, applicantId: req.user!.userId }
    });
    if (existing) return res.status(400).json({ message: 'Already applied to this job' });

    const application = await prisma.application.create({
      data: {
        jobId: id,
        applicantId: req.user!.userId,
        coverLetter,
        proposedBudget: proposedBudget ? parseFloat(proposedBudget) : null,
        estimatedDuration
      }
    });

    return res.status(201).json({ message: 'Application submitted', application });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getJobApplications = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job || job.clientId !== req.user!.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const applications = await prisma.application.findMany({
      where: { jobId: id },
      include: { applicant: { include: { profile: true } } }
    });

    return res.json({ applications });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getMyJobs = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const jobs = await prisma.job.findMany({
      where: { clientId: req.user!.userId },
      include: { _count: { select: { applications: true } } }
    });
    return res.json({ jobs });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getMyApplications = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const applications = await prisma.application.findMany({
      where: { applicantId: req.user!.userId },
      include: { job: { include: { client: { select: { fullName: true, profilePhoto: true } } } } }
    });
    return res.json({ applications });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};
