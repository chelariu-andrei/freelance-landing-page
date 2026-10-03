import { Section } from "@/layout/Section";
import { Container } from "@/layout/Container";
import { content } from "@/content/content";
import { isSet, mailtoHref } from "@/content/links";

/** The privacy policy text: one titled block per section, contact email where a section asks for it. */
export function PrivacyPolicy() {
  const p = content.privacy;
  const { email } = content.site;
  return (
    <Section tone="white" aria-label="Privacy policy">
      <Container>
        <div className="flex flex-col gap-12 max-w-[72ch]">
          <p className="m-0 text-caption font-medium uppercase tracking-[0.08em] text-ink-muted">
            {p.updatedLabel}: {p.updated}
          </p>
          {p.sections.map((s) => (
            <section key={s.title} className="flex flex-col gap-4">
              <h2 className="m-0 font-display font-regular text-heading-lg text-ink">{s.title}</h2>
              {s.paragraphs.map((t) => (
                <p key={t} className="m-0 text-body-md text-ink-muted">{t}</p>
              ))}
              {s.email && isSet(email) && (
                <a href={mailtoHref(email)} className="ac-focus self-start text-body-md font-medium text-ink underline underline-offset-4">{email}</a>
              )}
            </section>
          ))}
        </div>
      </Container>
    </Section>
  );
}
