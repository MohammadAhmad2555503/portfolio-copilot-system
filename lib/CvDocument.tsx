import { Document, Page, Text, View } from "@react-pdf/renderer";
import { pdfStyles as styles } from "@/lib/pdfStyles";
import type { BaseCv } from "@/lib/types";

type Props = {
  cv: BaseCv;
  coverLetter?: string;
};

export function CvDocument({ cv, coverLetter }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{cv.name}</Text>
        <Text style={styles.subtitle}>{cv.title}</Text>
        <Text style={styles.meta}>
          {cv.email} | {cv.phone} | {cv.location} | {cv.links.linkedin} | {cv.links.github}
        </Text>

        <View style={styles.section}>
          <Text style={styles.heading}>Professional Summary</Text>
          <Text>{cv.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Experience</Text>
          {cv.experience.map((item) => (
            <View key={`${item.company}-${item.role}`} style={{ marginBottom: 8 }}>
              <Text style={styles.role}>
                {item.role} - {item.company}
              </Text>
              <Text style={styles.muted}>{item.dates}</Text>
              {item.bullets.map((bullet) => (
                <Text key={bullet} style={styles.bullet}>
                  - {bullet}
                </Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Education</Text>
          {cv.education.map((item) => (
            <View key={`${item.school}-${item.degree}`} style={{ marginBottom: 6 }}>
              <Text style={styles.role}>{item.degree}</Text>
              <Text style={styles.muted}>
                {item.school} | {item.dates}
              </Text>
              <Text>{item.details}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Skills</Text>
          {Object.entries(cv.skills).map(([group, skills]) => (
            <View key={group} style={{ marginBottom: 6 }}>
              <Text style={styles.role}>{group}</Text>
              <View style={styles.chipRow}>
                {skills.map((skill) => (
                  <Text key={`${group}-${skill}`} style={styles.chip}>
                    {skill}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      </Page>
      {coverLetter ? (
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>Cover Letter</Text>
          {coverLetter.split("\n").map((paragraph) => (
            <Text key={paragraph.slice(0, 32)} style={{ marginBottom: 10 }}>
              {paragraph}
            </Text>
          ))}
        </Page>
      ) : null}
    </Document>
  );
}

