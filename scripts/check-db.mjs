import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

const envPath = path.resolve(process.cwd(), ".env.local");

if (!fs.existsSync(envPath)) {
  console.error("Missing .env.local");
  process.exit(1);
}

const line = fs
  .readFileSync(envPath, "utf8")
  .split(/\r?\n/)
  .find((entry) => entry.startsWith("MONGODB_URI="));

if (!line) {
  console.error("MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

const uri = line.slice("MONGODB_URI=".length).trim().replace(/^["']|["']$/g, "");

try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5_000 });
  const db = mongoose.connection.db;
  const collections = (await db.listCollections().toArray()).map((c) => c.name);
  const expenseCount = await db.collection("expenses").countDocuments();

  console.log(
    JSON.stringify(
      {
        status: "connected",
        readyState: mongoose.connection.readyState,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        database: mongoose.connection.name,
        collections,
        expenseCount,
      },
      null,
      2,
    ),
  );
} catch (error) {
  console.error(
    JSON.stringify(
      {
        status: "failed",
        message: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
