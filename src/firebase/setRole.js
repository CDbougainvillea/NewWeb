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
