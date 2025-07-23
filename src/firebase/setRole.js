// setRole.js
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load service account
const serviceAccountPath = path.join(__dirname, "serviceAccountKey.json");
const serviceAccount = JSON.parse(await readFile(serviceAccountPath, "utf8"));

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount),
});

const users = [
  { email: "guard@guard.com", role: "guard" },
  { email: "resident1@example.com", role: "admin" },
  { email: "resident2@example.com", role: "admin" },
  { email: "resident3@example.com", role: "admin" },
  { email: "resident4@example.com", role: "admin" },
  { email: "resident5@example.com", role: "admin" },
  { email: "resident6@example.com", role: "admin" },
  { email: "resident7@example.com", role: "admin" },
  { email: "resident8@example.com", role: "admin" },
  { email: "resident9@example.com", role: "admin" },
  { email: "resident10@example.com", role: "admin" },
  { email: "resident11@example.com", role: "admin" },
  { email: "resident12@example.com", role: "admin" },
  { email: "resident13@example.com", role: "admin" },
  { email: "resident14@example.com", role: "admin" },
  { email: "resident15@example.com", role: "admin" },
  { email: "resident16@example.com", role: "admin" },
  { email: "resident17@example.com", role: "admin" },
  { email: "resident18@example.com", role: "admin" },
  { email: "resident19@example.com", role: "admin" },
  { email: "resident20@example.com", role: "admin" },
  { email: "resident21@example.com", role: "admin" },
  { email: "resident22@example.com", role: "admin" },
  { email: "resident23@example.com", role: "admin" },
  { email: "wall@wall.com", role: "admin" },
];

for (const { email, role } of users) {
  try {
    const user = await getAuth().getUserByEmail(email);
    await getAuth().setCustomUserClaims(user.uid, { role });
    console.log(`✅ Role '${role}' assigned to ${email}`);
  } catch (error) {
    console.error(`❌ Failed to set role for ${email}:`, error.message);
  }
}
