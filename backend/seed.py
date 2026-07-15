import datetime
from app.database import SessionLocal, Base, engine
from app.models import User, Service, Project, CustomerProject, Blog, Offer, SupportTicket, ChatMessage
from app.core.security import hash_password

import time
from sqlalchemy.exc import OperationalError

# Recreate database tables with retry logic (especially useful for Docker pg initialization)
print("Connecting to database...")
for i in range(15):
    try:
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        print("Connected and tables initialized.")
        break
    except OperationalError as e:
        print(f"Database connection attempt {i+1}/15 failed. Retrying in 2 seconds...")
        time.sleep(2)
else:
    print("Could not connect to database after several attempts.")
    raise Exception("Database connection failed")

db = SessionLocal()

print("Seeding database...")

# 1. Create Users
admin = User(
    email="admin@noventra.com",
    full_name="Admin Director",
    hashed_password=hash_password("admin123"),
    role="admin"
)

customer = User(
    email="client@noventra.com",
    full_name="John Doe",
    hashed_password=hash_password("client123"),
    role="customer"
)

db.add_all([admin, customer])
db.commit()
db.refresh(admin)
db.refresh(customer)

# 2. Create Services
service1 = Service(
    title="Custom Web Design & Development",
    description="Get a modern, fast, and stunning landing page or web application. Fully optimized for speed and SEO, tailored for your business growth.",
    price_range="$999 - $2999",
    icon="Code2",
    features=["100% Unique UI Design", "Responsive Layouts", "Next.js/React Implementation", "Speed & Performance Optimization", "SEO Foundations Included", "3 Months Support"],
    is_active=True
)

service2 = Service(
    title="Premium Cloud Web Hosting",
    description="Fast, reliable, and secure web hosting with 99.9% uptime. Managed cloud setup on high-speed servers with automated backups.",
    price_range="$29 - $99/mo",
    icon="Server",
    features=["99.9% Uptime SLA", "Daily Offsite Backups", "Free SSL Certificates", "Global CDN (Cloudflare)", "DDoS Protection", "Scalable Server Specs"],
    is_active=True
)

service3 = Service(
    title="Monthly Maintenance & Website Care",
    description="Keep your website secure, updated, and error-free. We handle core updates, backups, content edits, bug fixes, and security monitoring.",
    price_range="$99 - $299/mo",
    icon="ShieldCheck",
    features=["Weekly Core Updates", "Security Monitoring", "1 Hour of Monthly Content Edits", "Database Cleanup & Tuning", "Priority Email Support", "Monthly Health Report"],
    is_active=True
)

db.add_all([service1, service2, service3])

# 3. Create Portfolio Projects
proj1 = Project(
    title="Alpha SaaS Platform",
    client_name="Alpha Tech Inc.",
    description="A complete SaaS platform featuring dashboard statistics, stripe integration, and team management workspace. Build with React and FastAPI.",
    image_url="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    preview_url="https://alpha-saas-demo.example.com",
    tech_stack=["React", "Tailwind CSS", "FastAPI", "PostgreSQL"],
    category="Web Design",
    featured=True
)

proj2 = Project(
    title="FitLife Gym & Health Hub",
    client_name="FitLife Gyms",
    description="A sleek, dark-themed gym landing page with dynamic schedules, class bookings, and premium animations. Visuals optimized for desktop/mobile.",
    image_url="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    preview_url="https://fitlife-demo.example.com",
    tech_stack=["HTML", "Vanilla CSS", "GSAP", "Alpine.js"],
    category="Web Design",
    featured=True
)

proj3 = Project(
    title="Secure Cloud Infrastructure",
    client_name="Apex Global Ltd.",
    description="DevOps migration of local infrastructure to high-performance cloud clusters on AWS with automated deployment pipelines.",
    image_url="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    preview_url=None,
    tech_stack=["AWS", "Terraform", "Docker", "GitHub Actions"],
    category="Hosting",
    featured=False
)

db.add_all([proj1, proj2, proj3])

# 4. Create Customer Project Tracking
cust_project = CustomerProject(
    customer_id=customer.id,
    title="Modern E-Commerce Portal",
    description="Developing a high-performance fashion storefront with local payment gateways and headless Shopify integrations.",
    progress_percent=70,
    status="Development",
    milestones={
        "Phase 1: Discovery & Wireframing": True,
        "Phase 2: UI Design Sign-off": True,
        "Phase 3: Frontend & API Integration": False,
        "Phase 4: Payment Testing": False,
        "Phase 5: Final Launch": False
    },
    domain="https://www.doe-store.com",
    hosting_status="Pending",
    renewal_date="2027-07-15"
)

db.add(cust_project)

# 5. Create Blogs
blog1 = Blog(
    title="Why Your Business Needs Next.js in 2026",
    summary="Next.js has become the industry standard for React apps. We cover the main reasons why Next.js 15 outperforms other web stacks.",
    content="""# Next.js 15 is Here: The Game Changer for Modern SEO and Speed

As search engines prioritize Core Web Vitals, site speed and Server-Side Rendering (SSR) have become critical differentiators. Next.js 15 takes these speed improvements to the next level.

## Key Benefits of Next.js 15
1. **React Server Components (RSC):** Render components on the server to reduce the JavaScript bundle size shipped to clients.
2. **Streaming HTML:** Stream page chunks as they render, so users see parts of the page instantly rather than waiting for the entire page to fetch.
3. **Advanced Caching Defaults:** Sensible request caching keeps server loads low and client rendering blazing fast.

Investing in a Next.js site now ensures your digital presence is modern, secure, and ready to convert visitors to customers.
""",
    cover_image="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    author_name="Noventra Design Team",
    tags=["Programming", "Web Design", "SEO"],
    published_at=datetime.datetime.utcnow() - datetime.timedelta(days=2)
)

blog2 = Blog(
    title="Web Hosting Decoded: VPS vs Managed Cloud",
    summary="Unsure what hosting plan fits your business? Learn about the security, control, and cost differences in modern cloud hosting.",
    content="""# Deciding on Hosting: VPS vs. Managed Cloud Services

Choosing hosting is one of the most critical decisions for a website launching. Let's compare the choices:

## Virtual Private Server (VPS)
A VPS gives you root access to a split portion of a server. It is cost-effective but requires regular maintenance, terminal commands, security patches, and server admin skills.

## Managed Cloud Services (AWS / Neon / Railway)
With Managed Cloud, the hosting provider (and Noventra Solutions) handles the infrastructure: backups, scaling, firewalling, and server configuration are fully managed. It costs slightly more but offers complete peace of mind.

At Noventra Solutions, we recommend **Managed Cloud** to 90% of our clients to avoid middle-of-the-night downtime and secure their business data.
""",
    cover_image="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    author_name="Cloud Infrastructure Team",
    tags=["Hosting", "Cloud"],
    published_at=datetime.datetime.utcnow() - datetime.timedelta(days=5)
)

db.add_all([blog1, blog2])

# 6. Create Support Ticket & Chat Messages
ticket = SupportTicket(
    customer_id=customer.id,
    subject="Domain Configuration & DNS Records Lookup",
    status="Open"
)
db.add(ticket)
db.commit()
db.refresh(ticket)

msg1 = ChatMessage(
    ticket_id=ticket.id,
    sender_id=customer.id,
    message="Hi, I need help pointing my domain to the new hosting platform. Can you send me the DNS records?",
    created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=2)
)

msg2 = ChatMessage(
    ticket_id=ticket.id,
    sender_id=admin.id,
    message="Sure, John! Here are the NS records: ns1.noventrahosting.com and ns2.noventrahosting.com. Let me know if you need help editing them on GoDaddy.",
    created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=1)
)

msg3 = ChatMessage(
    ticket_id=ticket.id,
    sender_id=customer.id,
    message="Great, I updated them. Can you check if they are propagating?",
    created_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=15)
)

db.add_all([msg1, msg2, msg3])

# 7. Create Active Offer (Sale countdown timer)
offer = Offer(
    title="Summer Launch Discount",
    discount_percentage=30,
    ends_at=(datetime.datetime.utcnow() + datetime.timedelta(days=12)).isoformat() + "Z",
    is_active=True,
    coupon_code="NOVENTRA30"
)
db.add(offer)

db.commit()
db.close()

print("Database seeded successfully!")
