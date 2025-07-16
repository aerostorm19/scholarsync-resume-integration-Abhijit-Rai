const pdfParse = require("pdf-parse");
import mammoth from "mammoth";
import { extractStructuredData } from "./extractor";

export async function parseResumeFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.toLowerCase().split(".").pop();

  console.log("File extension:", ext);
  console.log("Buffer size:", buffer.length);

  let text = "";

  if (ext === "pdf") {
    const { text: pdfText } = await pdfParse(buffer);
    text = pdfText;
  } else if (ext === "docx") {
    const { value } = await mammoth.extractRawText({ buffer });
    text = value;
  } else {
    throw new Error("Unsupported file type. Only .pdf and .docx allowed.");
  }

  if (!text || text.trim().length < 10) {
    throw new Error("Resume is empty or could not be parsed.");
  }

  console.log("Extracted Resume Text:", text.slice(0, 300));

  return extractStructuredData(text);
}
