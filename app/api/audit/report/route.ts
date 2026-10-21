import { renderToBuffer } from "@react-pdf/renderer";
import { verifyToken } from "@/lib/audit/token";
import { decodeResponses, score } from "@/lib/audit/scoring";
import { ReportDocument } from "@/lib/audit/report-pdf";

/**
 * GET /api/audit/report?r=<signed token> — the visitor's personalised PDF.
 * Built on demand from the verified token, so each emailed link can only ever
 * produce the report for the answers it was issued for. Nothing is stored.
 *
 * GET /api/audit/report?a=<encoded answers> — the same PDF straight from the
 * results page, for answers the visitor has just given. It holds no personal
 * details, so it needs no signature.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const verified = params.has("r")
    ? verifyToken(params.get("r"))
    : (() => {
        const responses = decodeResponses(params.get("a") ?? "");
        return responses ? { responses, issuedAt: new Date() } : null;
      })();
  if (!verified) {
    return new Response("This report link isn’t valid or has expired.", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-robots-tag": "noindex",
      },
    });
  }
  const pdf = await renderToBuffer(
    ReportDocument({
      result: score(verified.responses),
      issuedAt: verified.issuedAt,
    })
  );
  return new Response(new Uint8Array(pdf), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition":
        'attachment; filename="noova-brand-growth-report.pdf"',
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex",
      "referrer-policy": "no-referrer",
    },
  });
}
