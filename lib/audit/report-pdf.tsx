import "server-only";
import path from "node:path";
import {
  Document,
  Font,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { Styles } from "@react-pdf/renderer";
import {
  AREA_SERVICE,
  AUDIT,
  BOOKING_URL,
  QUESTIONS,
  SHORT_TITLES,
} from "@/content/audit";
import { IMPORTANCE_LABEL, type Result } from "./scoring";

/**
 * The personalised Brand & Growth Report (A4 PDF), built from one visitor's
 * scored answers. It matches the workbook's look: Playfair + Lato on warm
 * paper, charcoal cover, oxblood accent.
 */
const ASSETS = path.join(process.cwd(), "lib/audit/pdf-assets");

Font.register({
  family: "Playfair",
  fonts: [
    { src: path.join(ASSETS, "playfair-400-normal.ttf") },
    { src: path.join(ASSETS, "playfair-400-italic.ttf"), fontStyle: "italic" },
  ],
});
Font.register({
  family: "Lato",
  fonts: [
    { src: path.join(ASSETS, "lato-300.ttf"), fontWeight: 300 },
    { src: path.join(ASSETS, "lato-400.ttf"), fontWeight: 400 },
    { src: path.join(ASSETS, "lato-700.ttf"), fontWeight: 700 },
  ],
});
Font.registerHyphenationCallback((w) => [w]); // no hyphenation

const c = {
  paper: "#faf8f3",
  limestone: "#f1ece3",
  ink: "#1a1917",
  charcoal: "#24211d",
  grey: "#6e6a63",
  light: "#b8b2a8",
  rule: "#e0d9cc",
  oxblood: "#7a2e2e",
};

const s = StyleSheet.create({
  page: {
    backgroundColor: c.paper,
    color: c.ink,
    fontFamily: "Lato",
    fontSize: 9.5,
    lineHeight: 1.55,
    paddingTop: 56,
    paddingBottom: 64,
    paddingHorizontal: 56,
  },
  eyebrow: {
    fontFamily: "Lato",
    fontWeight: 300,
    fontSize: 7,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    color: c.grey,
  },
  display: {
    fontFamily: "Playfair",
    fontStyle: "italic",
    fontSize: 26,
    lineHeight: 1.15,
  },
  h2: {
    fontFamily: "Playfair",
    fontStyle: "italic",
    fontSize: 18,
    lineHeight: 1.2,
    marginBottom: 14,
  },
  h3: { fontFamily: "Lato", fontWeight: 700, fontSize: 10.5, marginBottom: 4 },
  body: { color: c.ink },
  muted: { color: c.grey },
  rule: { borderTopWidth: 0.6, borderTopColor: c.rule },
  run: {
    position: "absolute",
    left: 56,
    right: 56,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chip: {
    fontSize: 6.5,
    letterSpacing: 1,
    textTransform: "uppercase",
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderWidth: 0.6,
  },
});

/** Inline **bold** / *italic* from the workbook copy. */
function Rich({ text, style }: { text: string; style?: Styles[string] }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return (
    <Text style={style}>
      {parts.map((p, i) =>
        p.startsWith("**") ? (
          <Text key={i} style={{ fontWeight: 700 }}>
            {p.slice(2, -2)}
          </Text>
        ) : p.startsWith("*") && p.endsWith("*") && p.length > 1 ? (
          <Text key={i} style={{ color: c.grey }}>
            {p.slice(1, -1)}
          </Text>
        ) : (
          p
        )
      )}
    </Text>
  );
}

function Chip({ status }: { status: string | null }) {
  if (!status) return null;
  const strong = status === "Act now";
  const plan = status === "Plan next";
  return (
    <Text
      style={[
        s.chip,
        {
          color: strong ? "#fff" : plan ? c.oxblood : c.grey,
          backgroundColor: strong ? c.oxblood : undefined,
          borderColor: strong || plan ? c.oxblood : c.rule,
        },
      ]}
    >
      {status}
    </Text>
  );
}

function RunningBits() {
  return (
    <>
      <View fixed style={[s.run, { top: 28 }]}>
        <Text style={s.eyebrow}>Your Brand &amp; Growth Report</Text>
        <Text style={s.eyebrow}>noova</Text>
      </View>
      <View fixed style={[s.run, { bottom: 30 }]}>
        <Text style={s.eyebrow}>noovadata.com</Text>
        <Text
          style={s.eyebrow}
          render={({ pageNumber }) => String(pageNumber).padStart(2, "0")}
        />
      </View>
    </>
  );
}

const pct = (score: number) => `${((score - 1) / 3) * 100}%`;

export function ReportDocument({
  result,
  issuedAt,
}: {
  result: Result;
  issuedAt: Date;
}) {
  const band = AUDIT.bands.find((b) => b.name === result.overallBand);
  const date = issuedAt.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const prioritySet = new Set(result.priorities.map((p) => p.areaId));

  return (
    <Document
      title="Your Brand & Growth Report — noova"
      author="noova"
      subject="Small Business Brand & Growth Audit results"
      language="en-GB"
    >
      {/* ---------- cover ---------- */}
      <Page
        size="A4"
        style={[
          s.page,
          {
            backgroundColor: c.charcoal,
            color: "#f6f1e7",
            justifyContent: "space-between",
          },
        ]}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={[s.eyebrow, { color: "#b8b2a8" }]}>
            The Small Business Brand &amp; Growth Audit
          </Text>
          <Text style={[s.eyebrow, { color: "#b8b2a8" }]}>{date}</Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Image
            src={path.join(ASSETS, "monogram-white.png")}
            style={{ width: 54, height: 54, marginBottom: 40, opacity: 0.9 }}
          />
          <Text style={[s.eyebrow, { color: "#b8b2a8", marginBottom: 14 }]}>
            Your personalised
          </Text>
          <Text style={[s.display, { fontSize: 36, textAlign: "center" }]}>
            Brand &amp; Growth Report
          </Text>
        </View>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              borderTopWidth: 0.6,
              borderTopColor: "#3a362f",
              paddingTop: 22,
            }}
          >
            <Text
              style={{ fontFamily: "Playfair", fontSize: 64, lineHeight: 1 }}
            >
              {result.overall === null ? "—" : result.overall.toFixed(1)}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: "#b8b2a8",
                marginLeft: 8,
                marginBottom: 10,
              }}
            >
              out of 4.0
            </Text>
            <View style={{ flex: 1 }} />
            <Text
              style={[
                s.eyebrow,
                { color: "#c98f8a", fontSize: 9, marginBottom: 12 },
              ]}
            >
              {result.overallBand ?? "No overall score"}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: "Playfair",
              fontStyle: "italic",
              fontSize: 14,
              marginTop: 14,
              lineHeight: 1.35,
              maxWidth: 380,
            }}
          >
            {band?.meaning ??
              "Too many questions were marked not applicable for an overall score, but your area results follow."}
          </Text>
          <View style={{ flexDirection: "row", marginTop: 26 }}>
            {result.strongest && (
              <View style={{ flex: 1 }}>
                <Text style={[s.eyebrow, { color: "#b8b2a8" }]}>
                  Strongest area{result.strongest.soFar ? " so far" : ""}
                </Text>
                <Text style={{ marginTop: 4, fontSize: 11 }}>
                  {SHORT_TITLES[result.strongest.areaId]}
                </Text>
              </View>
            )}
            {result.priorities[0] && (
              <View style={{ flex: 1 }}>
                <Text style={[s.eyebrow, { color: "#b8b2a8" }]}>
                  First priority
                </Text>
                <Text style={{ marginTop: 4, fontSize: 11 }}>
                  {SHORT_TITLES[result.priorities[0].areaId]}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Page>

      {/* ---------- areas ---------- */}
      <Page size="A4" style={s.page}>
        <RunningBits />
        <Text style={[s.eyebrow, { color: c.oxblood, marginBottom: 8 }]}>
          01 · Your results profile
        </Text>
        <Text style={s.h2}>Your six areas</Text>
        {result.areas.map((a) => (
          <View key={a.id} style={{ marginBottom: 16 }} wrap={false}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 10 }}>
                <Text style={{ color: c.oxblood, fontSize: 8 }}>{a.id} </Text>
                {a.title}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={[s.muted, { fontSize: 8.5, marginRight: 8 }]}>
                  {a.score === null
                    ? "Not scored"
                    : `${a.score.toFixed(1)} · ${a.band}`}
                </Text>
                <Chip status={a.status} />
              </View>
            </View>
            <View
              style={{
                height: 5,
                backgroundColor: c.limestone,
                marginTop: 6,
                position: "relative",
              }}
            >
              {a.score !== null && (
                <View
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: pct(a.score),
                    backgroundColor: prioritySet.has(a.id)
                      ? c.oxblood
                      : c.charcoal,
                  }}
                />
              )}
              {[2.0, 2.8, 3.5].map((t) => (
                <View
                  key={t}
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: pct(t),
                    width: 0.8,
                    backgroundColor: c.paper,
                  }}
                />
              ))}
            </View>
            <Text style={[s.muted, { fontSize: 7.5, marginTop: 4 }]}>
              Importance to you: {IMPORTANCE_LABEL[a.importance]}
              {a.notApplicable ? ` · ${a.notApplicable} not applicable` : ""}
            </Text>
          </View>
        ))}
        <View style={[s.rule, { marginTop: 8, paddingTop: 14 }]}>
          <Text style={[s.eyebrow, { marginBottom: 8 }]}>
            What the bands mean
          </Text>
          {AUDIT.bands.map((b) => (
            <View
              key={b.name}
              style={{ flexDirection: "row", marginBottom: 5 }}
            >
              <Text style={{ width: 110, fontWeight: 700, fontSize: 8.5 }}>
                {b.name}{" "}
                <Text style={[s.muted, { fontWeight: 400 }]}>
                  {b.min.toFixed(1)}–{b.max.toFixed(1)}
                </Text>
              </Text>
              <Text style={[s.muted, { flex: 1, fontSize: 8.5 }]}>
                {b.meaning}
              </Text>
            </View>
          ))}
          <Text style={[s.muted, { fontSize: 8, marginTop: 10 }]}>
            Status comes from the workbook’s priority grid: your band in each
            area, set against how important you said it is right now.
          </Text>
        </View>
      </Page>

      {/* ---------- priorities + 30-day plan ---------- */}
      <Page size="A4" style={s.page}>
        <RunningBits />
        <Text style={[s.eyebrow, { color: c.oxblood, marginBottom: 8 }]}>
          02 · Your priorities
        </Text>
        <Text style={s.h2}>Your 30-day plan</Text>
        {result.priorities.length === 0 && (
          <Text style={s.muted}>
            {result.allDistinctive
              ? "Every area you scored is a genuine strength. Protect what’s working, and use the check-ins below to keep it that way."
              : "None of your areas needs urgent attention right now. Use the area notes that follow to refine what’s already working."}
          </Text>
        )}
        {result.priorities.map((p) => {
          const q = QUESTIONS.find((x) => x.id === p.questionId);
          return (
            <View
              key={p.areaId}
              wrap={false}
              style={[s.rule, { flexDirection: "row", paddingVertical: 14 }]}
            >
              <View style={{ width: 70 }}>
                <Text
                  style={{
                    fontFamily: "Playfair",
                    fontStyle: "italic",
                    fontSize: 24,
                    color: c.oxblood,
                    lineHeight: 1,
                  }}
                >
                  {p.rank}
                </Text>
                <Text style={[s.eyebrow, { color: c.oxblood, marginTop: 6 }]}>
                  {p.when}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={[s.h3, { flex: 1 }]}>
                    {p.action.title}{" "}
                    <Text style={{ fontWeight: 400, color: c.grey }}>
                      · {SHORT_TITLES[p.areaId]}
                    </Text>
                  </Text>
                  <Chip status={p.urgent ? "Act now" : p.status} />
                </View>
                {p.urgent && (
                  <Text
                    style={{ color: c.oxblood, fontSize: 8.5, marginBottom: 4 }}
                  >
                    Missed enquiries cost you clients directly, so treat this as
                    urgent.
                  </Text>
                )}
                <View style={{ flexDirection: "row", marginTop: 6 }}>
                  <View style={{ flex: 1, paddingRight: 12 }}>
                    <Text style={s.eyebrow}>
                      Current challenge{q ? ` · ${q.title}` : ""}
                    </Text>
                    <Rich
                      text={p.challenge}
                      style={{ marginTop: 2, fontSize: 9 }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.eyebrow}>What good looks like</Text>
                    <Rich
                      text={p.goodLooksLike}
                      style={{ marginTop: 2, fontSize: 9 }}
                    />
                  </View>
                </View>
                <Text style={[s.eyebrow, { marginTop: 8 }]}>
                  Recommended action · {p.action.effort}
                </Text>
                <Rich
                  text={p.action.body}
                  style={{ marginTop: 2, fontSize: 9 }}
                />
                {p.action.note && (
                  <Rich
                    text={p.action.note}
                    style={{ marginTop: 3, fontSize: 8, color: c.grey }}
                  />
                )}
              </View>
            </View>
          );
        })}
        <View
          style={[
            s.rule,
            { flexDirection: "row", paddingTop: 14, marginTop: 4 },
          ]}
          wrap={false}
        >
          {AUDIT.milestones.map((m) => (
            <View key={m.day} style={{ flex: 1, paddingRight: 12 }}>
              <Text style={[s.eyebrow, { color: c.oxblood }]}>{m.day}</Text>
              <Text style={[s.muted, { fontSize: 8.5, marginTop: 3 }]}>
                {m.text}
              </Text>
            </View>
          ))}
        </View>
        <Text
          style={{
            fontFamily: "Playfair",
            fontStyle: "italic",
            fontSize: 10.5,
            marginTop: 16,
          }}
        >
          A tip: {AUDIT.milestoneTip}
        </Text>
      </Page>

      {/* ---------- area by area ---------- */}
      <Page size="A4" style={s.page}>
        <RunningBits />
        <Text style={[s.eyebrow, { color: c.oxblood, marginBottom: 8 }]}>
          03 · Area by area
        </Text>
        <Text style={s.h2}>Recommendations from your answers</Text>
        {AUDIT.categories.map((cat) => {
          const a = result.areas.find((x) => x.id === cat.id)!;
          const recs = result.recommendations[cat.id];
          return (
            <View key={cat.id} style={[s.rule, { paddingVertical: 12 }]}>
              <View wrap={false}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 4,
                  }}
                >
                  <Text style={s.h3}>
                    <Text
                      style={{ color: c.oxblood, fontWeight: 400, fontSize: 8 }}
                    >
                      {cat.id}{" "}
                    </Text>
                    {cat.title}
                  </Text>
                  <Text style={[s.muted, { fontSize: 8.5 }]}>
                    {a.score === null
                      ? "Not scored"
                      : `${a.score.toFixed(1)} · ${a.band}`}
                  </Text>
                </View>
                <Text style={[s.muted, { fontSize: 8.8 }]}>
                  {a.band
                    ? cat.meanings[a.band]
                    : "More than two questions were marked not applicable, so this area isn’t scored."}
                </Text>
              </View>
              {recs.map((r) => (
                <View
                  key={r.actionKey}
                  wrap={false}
                  style={{ flexDirection: "row", marginTop: 7 }}
                >
                  <Text style={{ width: 10, color: c.oxblood }}>·</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 9 }}>
                      <Text style={{ fontWeight: 700 }}>{r.title}. </Text>
                      <Rich text={r.body} />
                      <Text style={{ color: c.grey, fontSize: 7.5 }}>
                        {" "}
                        ({r.effort})
                      </Text>
                    </Text>
                    {r.note && (
                      <Rich
                        text={r.note}
                        style={{ marginTop: 2, fontSize: 8, color: c.grey }}
                      />
                    )}
                  </View>
                </View>
              ))}
              <Text style={{ fontSize: 8, color: c.grey, marginTop: 7 }}>
                Where noova can help: {AREA_SERVICE[cat.id].label} ·
                noovadata.com{AREA_SERVICE[cat.id].href}
              </Text>
            </View>
          );
        })}
      </Page>

      {/* ---------- next step ---------- */}
      <Page size="A4" style={[s.page, { justifyContent: "space-between" }]}>
        <RunningBits />
        <View>
          <Text style={[s.eyebrow, { color: c.oxblood, marginBottom: 8 }]}>
            04 · Your next step
          </Text>
          <Text style={[s.display, { marginBottom: 16 }]}>
            Would a second opinion help?
          </Text>
          <Text style={{ fontSize: 11, lineHeight: 1.6, maxWidth: 400 }}>
            If you’d like to talk through your results, book a free 30-minute
            discovery call. Bring your scores and your three priorities. We’ll
            help you think through what to tackle first, whether or not you
            decide to work with us.
          </Text>
          <Link
            src={BOOKING_URL}
            style={{
              marginTop: 22,
              alignSelf: "flex-start",
              backgroundColor: c.oxblood,
              color: "#fff",
              paddingVertical: 10,
              paddingHorizontal: 18,
              fontSize: 8,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Book your call · cal.com/jessicafeto/30min
          </Link>
          <View style={[s.rule, { marginTop: 36, paddingTop: 16 }]}>
            <Text style={s.eyebrow}>Go further</Text>
            <Text style={{ marginTop: 6, maxWidth: 400 }}>
              The 28-page Brand &amp; Growth Audit workbook covers every area in
              more depth, with useful tools, specialist-support notes and space
              to plan. Download it from your results page.
            </Text>
          </View>
        </View>
        <View>
          <Image
            src={path.join(ASSETS, "monogram-ink.png")}
            style={{ width: 30, height: 27, marginBottom: 14 }}
          />
          <Text style={{ fontSize: 9 }}>
            jessica@noovadata.com · noovadata.com · @noovadata · London | Tirana
          </Text>
          <Text
            style={[s.muted, { fontSize: 7.5, marginTop: 14, lineHeight: 1.5 }]}
          >
            {AUDIT.disclaimer}
          </Text>
          <Text style={[s.muted, { fontSize: 7.5, marginTop: 6 }]}>
            © noova 2026. Generated {date}.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
