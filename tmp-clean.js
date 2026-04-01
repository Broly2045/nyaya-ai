const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const AnalysisSchema = new mongoose.Schema({}, { strict: false });
const Analysis = mongoose.models.Analysis || mongoose.model("Analysis", AnalysisSchema);

async function clean() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected");
  
  const result = await Analysis.deleteMany({});
  console.log("Deleted", result.deletedCount, "corrupted analysis records.");
  
  process.exit(0);
}

clean();
