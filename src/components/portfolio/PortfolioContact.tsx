import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";
import { PORTFOLIO } from "@/lib/portfolio";
import { SectionEyebrow } from "./SectionEyebrow";

export function PortfolioContact() {
  const { contact, availability } = PORTFOLIO;
  const isOpen = availability === "open";
  return (
    <section
      id="contact"
      className="pf-contact"
      aria-labelledby="pf-contact-heading"
      data-reveal
    >
      <SectionEyebrow icon="contact">{contact.eyebrow}</SectionEyebrow>
      <h2 className="pf-contact-h2" id="pf-contact-heading">
        {contact.headline}
      </h2>
      <p className="pf-contact-body">{contact.body}</p>
      <div className="pf-contact-ctas">
        <a
          className="pf-btn pf-btn-primary"
          href={`mailto:${contact.email}`}
        >
          <EnvelopeSimple size={15} weight="regular" aria-hidden />
          {contact.email}
        </a>
        {contact.links.map((link) => (
          <a
            key={link.label}
            className="pf-btn pf-btn-secondary"
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
          >
            {link.label}
          </a>
        ))}
      </div>
      <p className="pf-contact-note">
        {isOpen ? contact.openLine : contact.busyLine}
      </p>
    </section>
  );
}
