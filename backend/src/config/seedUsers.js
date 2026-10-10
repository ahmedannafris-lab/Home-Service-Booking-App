const bcrypt = require("bcryptjs");
const User = require("../models/User");

const defaultUsers = [
  {
    fullName: "System Administrator",
    email: "admin@homemate.com",
    phone: "+94771234567",
    password: "Password123",
    role: "admin",
  },
  {
    fullName: "Kamal Perera (Provider)",
    email: "provider@homemate.com",
    phone: "+94772345678",
    password: "Password123",
    role: "provider",
  },
  {
    fullName: "Kasun Silva (Customer)",
    email: "customer@homemate.com",
    phone: "+94773456789",
    password: "Password123",
    role: "customer",
  },
];

async function seedDefaultUsers() {
  try {
    for (const u of defaultUsers) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        const passwordHash = await bcrypt.hash(u.password, 10);
        await User.create({
          fullName: u.fullName,
          email: u.email,
          phone: u.phone,
          passwordHash,
          role: u.role,
          termsAcceptedAt: new Date(),
        });
        console.log(`[Seed] Created default ${u.role} user: ${u.email}`);
      }
    }
  } catch (error) {
    console.error("[Seed] Error seeding users:", error.message);
  }
}

module.exports = seedDefaultUsers;
