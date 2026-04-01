const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const DocumentSchema = new mongoose.Schema({}, { strict: false });
const NyayaDocument = mongoose.models.NyayaDocument || mongoose.model("NyayaDocument", DocumentSchema);

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
  
  const doc = await NyayaDocument.findById("69c636abe635a8c083aacc26").lean();
  console.log("Found Doc:", doc);
  
  if (doc) {
    console.log("textContent defined?", doc.textContent !== undefined);
    console.log("textContent type:", typeof doc.textContent);
    console.log("textContent snippet:", typeof doc.textContent === "string" ? doc.textContent.slice(0, 100) : null);
  }
  
  process.exit(0);
}

check();
