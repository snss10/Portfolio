/**
 * Structured data (JSON-LD) shared by every page. Each page adds its own nodes
 * (ProfilePage, WebPage, BreadcrumbList) to this graph; they refer to the
 * person and the website by @id, so search engines see one connected picture.
 */
import { site } from '../data/site';
import { education, certifications } from '../data/experience';

export const ids = (base: URL) => ({
  person: new URL('/#person', base).href,
  website: new URL('/#website', base).href,
});

export function baseGraph(base: URL) {
  const { person, website } = ids(base);
  return [
    {
      '@type': 'WebSite',
      '@id': website,
      url: new URL('/', base).href,
      name: site.name,
      alternateName: [site.shortName, new URL(base).hostname],
      description: site.seo.description,
      inLanguage: 'en',
      publisher: { '@id': person },
    },
    {
      '@type': 'Person',
      '@id': person,
      name: site.name,
      alternateName: site.shortName,
      url: new URL('/', base).href,
      jobTitle: site.currentTitle,
      description: site.seo.description,
      email: `mailto:${site.email}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Hyderabad',
        addressRegion: 'Telangana',
        addressCountry: 'IN',
      },
      worksFor: { '@type': 'Organization', name: site.company },
      alumniOf: { '@type': 'CollegeOrUniversity', name: education.school },
      hasCredential: certifications.map((c) => ({
        '@type': 'EducationalOccupationalCredential',
        name: c.name,
        credentialCategory: 'certificate',
        recognizedBy: { '@type': 'Organization', name: c.issuer },
        url: c.href,
      })),
      knowsAbout: [
        'Agentic AI',
        'Multi-agent systems',
        'LangGraph',
        'LangChain',
        'Model Context Protocol',
        'Retrieval-augmented generation',
        'FastAPI',
        'Python',
        'PostgreSQL',
        'Playwright',
      ],
      sameAs: [site.links.github, site.links.linkedin],
    },
  ];
}

/** A BreadcrumbList from [name, path] pairs. */
export function breadcrumbs(base: URL, trail: [string, string][]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: new URL(path, base).href,
    })),
  };
}
