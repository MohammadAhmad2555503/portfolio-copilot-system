import { pdf } from "@react-pdf/renderer";
import { CvDocument } from "@/lib/CvDocument";
import { baseCv } from "@/lib/baseCv";

export const runtime = "nodejs";

export async function GET() {
  const blob = await pdf(<CvDocument cv={baseCv} />).toBlob();
  const arrayBuffer = await blob.arrayBuffer();

  return new Response(arrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="cv.pdf"'
    }
  });
}

