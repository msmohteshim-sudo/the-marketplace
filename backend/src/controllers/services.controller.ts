import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

export const getServices = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const {
      type,
      category,
      minPrice,
      maxPrice,
      rating,
      deliveryTime,
      search,
      sort = 'recommended',
      page = '1',
      limit = '36'
    } = req.query;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    // Build Prisma query condition
    const where: any = { status: 'active' };

    // Strictly enforce digital if requested
    if (type) where.type = type;

    if (category) {
      const cat = (category as string).toLowerCase();

      if (cat === 'express') {
        where.deliveryTime = 1;
      } else if (cat === 'mobile-dev') {
        where.OR = [
          { categoryId: 'mobile-dev' },
          { tags: { contains: 'mobile-dev' } },
          { tags: { contains: 'flutter' } },
          { tags: { contains: 'ios' } },
          { title: { contains: 'Mobile' } },
          { title: { contains: 'App' } }
        ];
      } else if (cat === 'graphic-design' || cat === 'ui-ux') {
        where.OR = [
          { categoryId: 'graphic-design' },
          { tags: { contains: 'graphic-design' } },
          { tags: { contains: 'figma' } },
          { tags: { contains: 'ui/ux' } },
          { title: { contains: 'UI/UX' } },
          { title: { contains: 'Design' } }
        ];
      } else if (cat === 'ai-ml') {
        where.OR = [
          { categoryId: 'ai-ml' },
          { tags: { contains: 'ai-ml' } },
          { tags: { contains: 'ai' } },
          { tags: { contains: 'llm' } },
          { title: { contains: 'AI' } },
          { title: { contains: 'Machine Learning' } }
        ];
      } else if (cat === 'cloud-devops') {
        where.OR = [
          { categoryId: 'cloud-devops' },
          { tags: { contains: 'cloud-devops' } },
          { tags: { contains: 'aws' } },
          { tags: { contains: 'docker' } },
          { title: { contains: 'DevOps' } },
          { title: { contains: 'Cloud' } }
        ];
      } else if (cat === 'security') {
        where.OR = [
          { categoryId: 'security' },
          { tags: { contains: 'security' } },
          { tags: { contains: 'pentesting' } },
          { title: { contains: 'Security' } },
          { title: { contains: 'Pentesting' } }
        ];
      } else if (cat === 'web-dev') {
        where.OR = [
          { categoryId: 'web-dev' },
          { tags: { contains: 'web-dev' } },
          { tags: { contains: 'react' } },
          { title: { contains: 'Web' } },
          { title: { contains: 'React' } }
        ];
      } else {
        where.OR = [
          { categoryId: cat },
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
        { tags: { contains: q } }
      ];
    }

    if (deliveryTime) {
      const maxDays = parseInt(deliveryTime as string);
      where.deliveryTime = { lte: maxDays };
    }

    if (rating) {
      const minRatingVal = parseFloat(rating as string);
      where.totalRating = { gte: minRatingVal };
    }

    // Seed comprehensive sample digital services if fewer than 18 exist
    const countDigital = await prisma.service.count({ where: { type: 'digital' } });
    if (countDigital < 18) {
      const defaultUser = await prisma.user.findFirst();
      if (defaultUser) {
        const sampleDigitalServices = [
          // ─── 1. WEB DEV SECTION ───
          {
            sellerId: defaultUser.id,
            title: 'Professional Next.js 14 & React Full-Stack Web Application',
            description: 'Modern, high-performance web app built with Next.js App Router, TypeScript, Tailwind CSS, and Prisma backend with authentication.',
            type: 'digital',
            tags: JSON.stringify(['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'web-dev']),
            deliveryTime: 3,
            totalOrders: 42,
            totalRating: 4.9,
            ratingCount: 38,
            isVerified: true,
            isFeatured: true,
            packages: { create: [{ name: 'Full Web App', description: 'Complete full stack app with API', price: 14999, deliveryDays: 3, revisions: 3 }] }
          },
          {
            sellerId: defaultUser.id,
            title: 'Custom Vue 3 & Nuxt 3 Web Dashboard with Stripe Payment',
            description: 'Scalable Vue 3 dashboard with Pinia state management, Pinia store, dark glassmorphism UI, and integrated Stripe billing.',
            type: 'digital',
            tags: JSON.stringify(['Vue', 'Nuxt', 'JavaScript', 'Stripe', 'web-dev']),
            deliveryTime: 4,
            totalOrders: 31,
            totalRating: 4.92,
            ratingCount: 26,
            isVerified: true,
            packages: { create: [{ name: 'Nuxt Dashboard', description: 'Web dashboard with Auth & Billing', price: 18500, deliveryDays: 4, revisions: 2 }] }
          },
          {
            sellerId: defaultUser.id,
            title: 'Node.js & Express RESTful API Microservices Architecture',
            description: 'High-speed Node.js microservices API with JWT authentication, Redis caching, Rate limiting, and PostgreSQL database queries.',
            type: 'digital',
            tags: JSON.stringify(['Node.js', 'Express', 'PostgreSQL', 'Redis', 'web-dev']),
            deliveryTime: 2,
            totalOrders: 54,
            totalRating: 4.88,
            ratingCount: 42,
            isVerified: true,
            packages: { create: [{ name: 'Microservices API', description: 'Production API backend with JWT & Redis', price: 11999, deliveryDays: 2, revisions: 3 }] }
          },

          // ─── 2. MOBILE APPS SECTION ───
          {
            sellerId: defaultUser.id,
            title: 'Cross-Platform iOS & Android Mobile App with Flutter & Firebase',
            description: 'Native performance mobile application with clean architecture, state management (Riverpod/Bloc), Firebase backend, and responsive UI.',
            type: 'digital',
            tags: JSON.stringify(['Flutter', 'Dart', 'iOS', 'Android', 'mobile-dev']),
            deliveryTime: 5,
            totalOrders: 29,
            totalRating: 5.0,
            ratingCount: 24,
            isVerified: true,
            packages: { create: [{ name: 'Mobile App MVP', description: 'iOS & Android build with 5 screens', price: 24999, deliveryDays: 5, revisions: 2 }] }
          },
          {
            sellerId: defaultUser.id,
            title: 'React Native Mobile App Development & Redux State Management',
            description: 'Cross-platform React Native app with Expo / Bare CLI, push notifications, offline storage, and smooth micro-animations.',
            type: 'digital',
            tags: JSON.stringify(['React Native', 'Expo', 'Mobile', 'Redux', 'mobile-dev']),
            deliveryTime: 3,
            totalOrders: 37,
            totalRating: 4.9,
            ratingCount: 31,
            isVerified: true,
            packages: { create: [{ name: 'React Native App', description: 'Full mobile app codebase with push notifs', price: 18500, deliveryDays: 3, revisions: 3 }] }
          },
          {
            sellerId: defaultUser.id,
            title: 'Native Swift iOS App Feature Integration & App Store Deployment',
            description: 'Native iOS Swift SwiftUI app development, CoreData storage, Apple Pay integration, and submission assistance to Apple App Store.',
            type: 'digital',
            tags: JSON.stringify(['Swift', 'iOS', 'SwiftUI', 'Apple Pay', 'mobile-dev']),
            deliveryTime: 4,
            totalOrders: 21,
            totalRating: 4.95,
            ratingCount: 18,
            isVerified: true,
            packages: { create: [{ name: 'Native iOS Build', description: 'SwiftUI application codebase & submission', price: 22000, deliveryDays: 4, revisions: 2 }] }
          },

          // ─── 3. UI/UX & DESIGN SECTION ───
          {
            sellerId: defaultUser.id,
            title: 'SaaS UI/UX Design & Interactive Figma Prototype System',
            description: 'Pixel-perfect, modern glassmorphism & dark mode UI/UX design system with component library and clickable interactive Figma prototype.',
            type: 'digital',
            tags: JSON.stringify(['Figma', 'UI/UX', 'Design System', 'Prototyping', 'graphic-design']),
            deliveryTime: 2,
            totalOrders: 34,
            totalRating: 4.85,
            ratingCount: 29,
            isVerified: true,
            packages: { create: [{ name: 'Figma UI Suite', description: 'Complete dashboard design with 10+ frames', price: 7999, deliveryDays: 2, revisions: 5 }] }
          },
          {
            sellerId: defaultUser.id,
            title: 'Mobile App UI/UX Redesign & Modern Dark Mode Asset Kit',
            description: 'Complete UI/UX design overhaul for iOS and Android apps with auto-layout Figma files, custom iconography, and micro-interactions.',
            type: 'digital',
            tags: JSON.stringify(['Figma', 'UI/UX', 'Mobile Design', 'Dark Mode', 'graphic-design']),
            deliveryTime: 3,
            totalOrders: 28,
            totalRating: 4.9,
            ratingCount: 23,
            isVerified: true,
            packages: { create: [{ name: 'Mobile Design Kit', description: 'Complete mobile screens in Figma', price: 9500, deliveryDays: 3, revisions: 4 }] }
          },
          {
            sellerId: defaultUser.id,
            title: 'Design System & Component Library in Figma (Tailwind Tokens)',
            description: 'Enterprise design system with typography scale, HSL color tokens, responsive UI components, variants, and developer handoff guide.',
            type: 'digital',
            tags: JSON.stringify(['Design System', 'Figma', 'UI/UX', 'Tailwind', 'graphic-design']),
            deliveryTime: 2,
            totalOrders: 40,
            totalRating: 5.0,
            ratingCount: 35,
            isVerified: true,
            packages: { create: [{ name: 'Design System', description: 'Comprehensive design system token library', price: 11000, deliveryDays: 2, revisions: 3 }] }
          },

          // ─── 4. AI & DATA SECTION ───
          {
            sellerId: defaultUser.id,
            title: 'Custom AI Chatbot & LLM RAG Pipeline (OpenAI / Claude API)',
            description: 'Integrate custom RAG pipelines, fine-tuned LLM agents, Vector DBs (Pinecone/Chroma), and conversational AI widgets into your application.',
            type: 'digital',
            tags: JSON.stringify(['AI', 'LLM', 'OpenAI', 'Python', 'ai-ml']),
            deliveryTime: 1, // Express
            totalOrders: 56,
            totalRating: 4.95,
            ratingCount: 48,
            isVerified: true,
            isFeatured: true,
            packages: { create: [{ name: 'AI Integration', description: 'Custom AI agent endpoint & UI', price: 9999, deliveryDays: 1, revisions: 2 }] }
          },
          {
            sellerId: defaultUser.id,
            title: 'Python Data Science Analytics Dashboard & Predictive Model',
            description: 'Data cleaning, exploratory data analysis, Pandas/Polars data pipelines, interactive Streamlit / Dash visualization dashboard, and ML model.',
            type: 'digital',
            tags: JSON.stringify(['Python', 'Data Science', 'Machine Learning', 'Pandas', 'ai-ml']),
            deliveryTime: 3,
            totalOrders: 33,
            totalRating: 4.88,
            ratingCount: 27,
            isVerified: true,
            packages: { create: [{ name: 'Data Dashboard', description: 'Interactive dashboard & ML model script', price: 14500, deliveryDays: 3, revisions: 3 }] }
          },
          {
            sellerId: defaultUser.id,
            title: 'Vector Database Setup (Pinecone/Chroma) & Custom Embeddings API',
            description: 'Build semantic search pipelines with OpenAI embeddings, Pinecone / Qdrant vector store indexing, and fast hybrid search endpoints.',
            type: 'digital',
            tags: JSON.stringify(['AI', 'Vector DB', 'Pinecone', 'Embeddings', 'ai-ml']),
            deliveryTime: 2,
            totalOrders: 25,
            totalRating: 5.0,
            ratingCount: 21,
            isVerified: true,
            packages: { create: [{ name: 'Vector DB Pipeline', description: 'Semantic search indexing pipeline', price: 16000, deliveryDays: 2, revisions: 2 }] }
          },

          // ─── 5. CLOUD & DEVOPS SECTION ───
          {
            sellerId: defaultUser.id,
            title: 'AWS / GCP Kubernetes & Automated CI/CD Pipeline Setup',
            description: 'Production-ready cloud architecture setup using Terraform, Docker containers, Kubernetes (EKS/GKE), and GitHub Actions automated deployment.',
            type: 'digital',
            tags: JSON.stringify(['DevOps', 'AWS', 'Kubernetes', 'Docker', 'cloud-devops']),
            deliveryTime: 2,
            totalOrders: 19,
            totalRating: 5.0,
            ratingCount: 16,
            isVerified: true,
            packages: { create: [{ name: 'Cloud Infrastructure', description: 'CI/CD pipeline & SSL domain setup', price: 18999, deliveryDays: 2, revisions: 2 }] }
          },
          {
            sellerId: defaultUser.id,
            title: 'Docker Containerization & Multi-Container Server Environment',
            description: 'Containerize backend Node/Python apps, NGINX reverse proxy, SSL certbot renewal, and docker-compose deployment script.',
            type: 'digital',
            tags: JSON.stringify(['Docker', 'NGINX', 'DevOps', 'Linux', 'cloud-devops']),
            deliveryTime: 1, // Express
            totalOrders: 48,
            totalRating: 4.92,
            ratingCount: 39,
            isVerified: true,
            packages: { create: [{ name: 'Docker Server Setup', description: 'Dockerized app environment ready to run', price: 8500, deliveryDays: 1, revisions: 2 }] }
          },
          {
            sellerId: defaultUser.id,
            title: 'Terraform Infrastructure as Code & SSL Domain Cloud Migration',
            description: 'Automate your cloud infrastructure with Terraform scripts, Cloudflare DNS configuration, AWS S3 storage buckets, and IAM policy setup.',
            type: 'digital',
            tags: JSON.stringify(['Terraform', 'AWS', 'Cloudflare', 'IaC', 'cloud-devops']),
            deliveryTime: 2,
            totalOrders: 22,
            totalRating: 4.9,
            ratingCount: 17,
            isVerified: true,
            packages: { create: [{ name: 'Terraform Setup', description: 'IaC cloud provisioning scripts', price: 12500, deliveryDays: 2, revisions: 2 }] }
          },

          // ─── 6. CYBERSECURITY SECTION ───
          {
            sellerId: defaultUser.id,
            title: 'Cybersecurity Pentesting & OWASP Top 10 Vulnerability Audit',
            description: 'Comprehensive security audit of web app API endpoints, OWASP Top 10 vulnerabilities, auth bypass, SQL injection, and detailed remediation report.',
            type: 'digital',
            tags: JSON.stringify(['Cybersecurity', 'Pentesting', 'Security Audit', 'OWASP', 'security']),
            deliveryTime: 1, // Express
            totalOrders: 23,
            totalRating: 4.9,
            ratingCount: 19,
            isVerified: true,
            packages: { create: [{ name: 'Security Audit', description: 'Full vulnerability scan report & fixes', price: 11999, deliveryDays: 1, revisions: 2 }] }
          },
          {
            sellerId: defaultUser.id,
            title: 'API Authentication Security Audit & Rate Limiting Hardening',
            description: 'Secure your REST/GraphQL APIs against DDoS, brute force attacks, CSRF, XSS, and insecure direct object references (IDOR).',
            type: 'digital',
            tags: JSON.stringify(['Security', 'API Security', 'OAuth', 'JWT', 'security']),
            deliveryTime: 1, // Express
            totalOrders: 31,
            totalRating: 5.0,
            ratingCount: 26,
            isVerified: true,
            packages: { create: [{ name: 'API Security Hardening', description: 'Security patch implementation & audit', price: 9999, deliveryDays: 1, revisions: 2 }] }
          },

          // ─── 7. 24h EXPRESS WORK SECTION ───
          {
            sellerId: defaultUser.id,
            title: 'Fix Critical React / Next.js Auth Bug & State Persistence Error',
            description: 'Emergency 24h bug fix for React state management, OAuth login redirect loops, session token refresh bugs, and CORS errors.',
            type: 'digital',
            tags: JSON.stringify(['React', 'Next.js', 'Bug Fix', 'Express', 'express']),
            deliveryTime: 1, // Express
            totalOrders: 67,
            totalRating: 5.0,
            ratingCount: 58,
            isVerified: true,
            packages: { create: [{ name: '24h Bug Fix', description: 'Immediate bug fix & PR merge within 24h', price: 3499, deliveryDays: 1, revisions: 3 }] }
          },
          {
            sellerId: defaultUser.id,
            title: 'Express API Endpoint & PostgreSQL Database Query Optimization',
            description: 'Fast 24h resolution for slow SQL queries, database indexing, Express route error handling, and Prisma schema migration.',
            type: 'digital',
            tags: JSON.stringify(['Express', 'PostgreSQL', 'Prisma', 'Bug Fix', 'express']),
            deliveryTime: 1, // Express
            totalOrders: 51,
            totalRating: 4.95,
            ratingCount: 44,
            isVerified: true,
            packages: { create: [{ name: 'Express API Fix', description: '24h endpoint fix & query tuning', price: 4999, deliveryDays: 1, revisions: 2 }] }
          }
        ];

        for (const s of sampleDigitalServices) {
          await prisma.service.create({ data: s });
        }
      }
    }

    let services = await prisma.service.findMany({
      where,
      include: {
        seller: { select: { id: true, fullName: true, profilePhoto: true, location: true } },
        packages: { orderBy: { price: 'asc' } },
        category: true
      },
      skip,
      take: parseInt(limit as string),
      orderBy: sort === 'newest' ? { createdAt: 'desc' }
        : sort === 'top_rated' ? { totalRating: 'desc' }
        : sort === 'fastest_delivery' ? { deliveryTime: 'asc' }
        : { totalOrders: 'desc' }
    });

    // In-memory filter for minPrice / maxPrice if specified
    if (minPrice || maxPrice) {
      const min = minPrice ? parseFloat(minPrice as string) : 0;
      const max = maxPrice ? parseFloat(maxPrice as string) : Infinity;
      services = services.filter(s => {
        const p = s.packages?.[0]?.price || 0;
        return p >= min && p <= max;
      });
    }

    // In-memory sort for price if specified
    if (sort === 'lowest_price') {
      services.sort((a, b) => (a.packages?.[0]?.price || 0) - (b.packages?.[0]?.price || 0));
    } else if (sort === 'highest_price') {
      services.sort((a, b) => (b.packages?.[0]?.price || 0) - (a.packages?.[0]?.price || 0));
    }

    const total = services.length;

    return res.json({
      services,
      total,
      page: parseInt(page as string),
      pages: Math.ceil(total / parseInt(limit as string))
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getService = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        seller: { include: { profile: true } },
        packages: true,
        reviews: { include: { reviewer: { select: { fullName: true, profilePhoto: true } } }, take: 5 },
        category: true
      }
    });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    return res.json({ service });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const createService = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { title, description, type, categoryId, tags, location, serviceRadius, deliveryTime, packages } = req.body;

    const service = await prisma.service.create({
      data: {
        sellerId: req.user!.userId,
        title,
        description,
        type,
        categoryId,
        tags: tags ? JSON.stringify(tags) : null,
        location,
        serviceRadius,
        deliveryTime,
        packages: packages ? {
          create: packages.map((p: any) => ({
            name: p.name,
            description: p.description,
            price: parseFloat(p.price),
            deliveryDays: parseInt(p.deliveryDays),
            revisions: p.revisions || 1,
            features: p.features ? JSON.stringify(p.features) : null
          }))
        } : undefined
      },
      include: { packages: true }
    });

    return res.status(201).json({ message: 'Service created successfully', service });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateService = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service || service.sellerId !== req.user!.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await prisma.service.update({
      where: { id },
      data: req.body
    });

    return res.json({ message: 'Service updated', service: updated });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteService = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service || service.sellerId !== req.user!.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await prisma.service.delete({ where: { id } });
    return res.json({ message: 'Service deleted' });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getMyServices = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const services = await prisma.service.findMany({
      where: { sellerId: req.user!.userId },
      include: { packages: true, category: true }
    });
    return res.json({ services });
  } catch (e) {
    return res.status(500).json({ message: 'Server error' });
  }
};
