import { StyleSheet } from "@react-pdf/renderer";

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 34,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.42,
    color: "#111827"
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 4
  },
  subtitle: {
    fontSize: 12,
    color: "#2563eb",
    marginBottom: 8
  },
  meta: {
    fontSize: 9,
    color: "#475569",
    marginBottom: 12
  },
  section: {
    marginTop: 12
  },
  heading: {
    fontSize: 12,
    fontWeight: 700,
    color: "#0f172a",
    borderBottom: "1px solid #cbd5e1",
    paddingBottom: 3,
    marginBottom: 6
  },
  role: {
    fontSize: 11,
    fontWeight: 700,
    color: "#111827"
  },
  muted: {
    color: "#64748b"
  },
  bullet: {
    marginLeft: 8,
    marginBottom: 3
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4
  },
  chip: {
    backgroundColor: "#e0f2fe",
    color: "#0f172a",
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 3,
    marginBottom: 4
  }
});

