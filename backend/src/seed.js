const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const connectDB = require("./config/db");
const ServiceCategory = require("./models/ServiceCategory");
const Service = require("./models/Service");
const Specialist = require("./models/Specialist");
const PromoCode = require("./models/PromoCode");
const User = require("./models/User");

// Import mock data directly (simulating what was in the frontend)
const categories = [
  { id: "plumbing", name: "Plumbing", icon: "water-outline", specCount: 16, heroImage: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=800", heroTagline: "Trusted Professionals", heroHeadline: "Expert Plumbing\nServices", heroBadges: ["Verified Experts", "1 Hr Response"], availableToday: 16, filterPills: ["All", "Leaks", "Install", "Repairs"] },
  { id: "electrical", name: "Electrical", icon: "flash-outline", specCount: 22, heroImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800", heroTagline: "Certified Electricians", heroHeadline: "Safe Electrical\nSolutions", heroBadges: ["Licensed", "Emergency Setup"], availableToday: 22, filterPills: ["All", "Wiring", "Fixes", "Fans"] },
  { id: "cleaning", name: "Cleaning", icon: "sparkles-outline", specCount: 45, heroImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800", heroTagline: "Spotless Homes", heroHeadline: "Deep Cleaning\nServices", heroBadges: ["Eco Products", "Insured"], availableToday: 45, filterPills: ["All", "Deep Clean", "Sofa", "Carpet"] },
  { id: "appliance", name: "Appliance repair", icon: "build-outline", specCount: 12, heroImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800", heroTagline: "Quick Fixes", heroHeadline: "Appliance\nRepairs", heroBadges: ["Genuine Parts", "Warranty"], availableToday: 12, filterPills: ["All", "AC", "Washing Mach", "Fridges"] },
];

const services = [
  { id: "pipe-installation", categoryId: "plumbing", categoryName: "Plumbing", title: "Pipe Installation", description: "Professional installation of residential and commercial water pipes. Includes pressure testing and leak prevention guarantee.", price: 2500, originalPrice: 3000, badge: "Popular", badgeType: "primary", rating: 4.8, reviewCount: 124, duration: "2 - 3 Hours", features: ["Pressure Testing", "Leak Guarantee", "Material Included"], image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=400", specialistId: "kamal" },
  { id: "leak-repair", categoryId: "plumbing", categoryName: "Plumbing", title: "Comprehensive Leak Detection & Fix", description: "Advanced leak detection and repair.", price: 2800, rating: 4.7, reviewCount: 98, duration: "1 - 2 Hours", image: "https://images.unsplash.com/photo-1607472586893-edb57cb31422?q=80&w=400", specialistId: "kamal" },
  { id: "drain-cleaning", categoryId: "plumbing", categoryName: "Plumbing", title: "Drain & Sewer Clog Unblocking", description: "Fast unblocking of drains.", price: 3200, rating: 4.9, reviewCount: 56, duration: "1.5 Hours", image: "https://images.unsplash.com/photo-1505798577917-a65157d3320a?q=80&w=400", specialistId: "kamal" },
  { id: "ac-deep-service", categoryId: "appliance", categoryName: "Appliance repair", title: "Comprehensive AC Deep Service", description: "Full cleaning and servicing of Split AC.", price: 3500, rating: 4.9, reviewCount: 210, duration: "2 Hours", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=400", specialistId: "sunil" },
];

const specialists = [
  { id: "kamal", name: "Kamal Perera", title: "Master Plumbing Specialist", experience: "11 yrs exp", rating: 4.96, reviewsCount: 142, jobsCompleted: 1620, distance: "1.4 km", eta: "~25 min", verified: true, status: "Live Now", categoryId: "plumbing", bio: "Licensed Master Plumber specialized in residential pressure piping." },
  { id: "sunil", name: "Sunil Perera", title: "Master HVAC Specialist", experience: "9 yrs exp", rating: 4.95, reviewsCount: 420, jobsCompleted: 1420, distance: "1.8 km", eta: "~30 min", verified: true, status: "Available Today", categoryId: "appliance", bio: "EPA certified air conditioning master tech." },
];

const users = [
  { fullName: "Kamal Perera", email: "kamal.p@example.com", phone: "0712347683", role: "customer", status: "active", avatarUrl: "https://i.pravatar.cc/150?u=1", termsAcceptedAt: new Date() },
  { fullName: "Nimal Ranasinghe", email: "nimal@example.com", phone: "0771234567", role: "customer", status: "active", avatarUrl: "https://i.pravatar.cc/150?u=2", termsAcceptedAt: new Date() },
  { fullName: "Sarah Silva", email: "sarah@example.com", phone: "0787654321", role: "customer", status: "inactive", avatarUrl: "https://i.pravatar.cc/150?u=3", termsAcceptedAt: new Date() },
];

async function seed() {
  try {
    await connectDB();
    console.log("Connected. Dropping collections to re-seed...");
    
    await ServiceCategory.deleteMany();
    await Service.deleteMany();
    await Specialist.deleteMany();
    await PromoCode.deleteMany();
    await User.deleteMany();

    console.log("Inserting categories...");
    await ServiceCategory.insertMany(categories);

    console.log("Inserting services...");
    await Service.insertMany(services);

    console.log("Inserting specialists...");
    await Specialist.insertMany(specialists);

    console.log("Inserting promo codes...");
    await PromoCode.create({
      code: "HOMECOOL20",
      discountPercentage: 20,
      active: true,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    console.log("Inserting users...");
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("password123", salt);
    const usersWithPassword = users.map(u => ({ ...u, passwordHash }));
    await User.insertMany(usersWithPassword);

    console.log("✅ Seed complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();
