const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const { Schema } = mongoose;

const DocumentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    originalName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    fileType: { type: String, enum: ["pdf", "docx", "txt", "doc"] },
    fileSize: { type: Number },
    textContent: { type: String, select: false },
    status: {
      type: String,
      enum: ["uploaded", "extracting", "analyzing", "analyzed", "failed"],
      default: "uploaded",
    },
  },
  { timestamps: true }
);

const NyayaDocument = mongoose.models.NyayaDocument || mongoose.model("NyayaDocument", DocumentSchema);

async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected");
  
  const doc = await NyayaDocument.create({
    userId: new mongoose.Types.ObjectId(),
    title: "Test",
    originalName: "test.pdf",
    fileUrl: "http://test",
    publicId: "123",
    fileType: "pdf",
    fileSize: 100,
    textContent: "HELLO WORLD",
    status: "uploaded"
  });
  
  console.log("Created doc:", doc.toObject());
  
  const fetched = await NyayaDocument.findById(doc._id).select("+textContent").lean();
  console.log("Fetched textContent:", fetched.textContent);
  
  process.exit(0);
}

test();
