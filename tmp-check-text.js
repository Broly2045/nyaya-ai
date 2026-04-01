const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const DocumentSchema = new mongoose.Schema({
    textContent: { type: String, select: false },
    status: String
}, { strict: false });

const NyayaDocument = mongoose.models.NyayaDocument || mongoose.model("NyayaDocument", DocumentSchema);

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected");
  
  const doc = await NyayaDocument.findById("69c67163b90acfdc5a9ba7af").select("+textContent").lean();
  
  if (doc) {
    const text = doc.textContent || "";
    console.log("Text length:", text.length);
    console.log("Snippet (first 500 chars):", text.slice(0, 500));
  } else {
    console.log("Document not found!");
  }
  
  process.exit(0);
}

check();
