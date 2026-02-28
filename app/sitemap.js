import { getAllPosts } from '../lib/blog';

export default function sitemap() {
  const baseUrl = 'https://multiservicios360.net';

  // Static pages — Spanish + English pairs
  const staticPages = [
    // Homepage
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1, alternates: { languages: { es: baseUrl, en: `${baseUrl}/en` } } },
    { url: `${baseUrl}/en`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1, alternates: { languages: { en: `${baseUrl}/en`, es: baseUrl } } },
    // Products — Spanish
    { url: `${baseUrl}/poa`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9, alternates: { languages: { es: `${baseUrl}/poa`, en: `${baseUrl}/en/poa` } } },
    { url: `${baseUrl}/limited-poa`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9, alternates: { languages: { es: `${baseUrl}/limited-poa`, en: `${baseUrl}/en/limited-poa` } } },
    { url: `${baseUrl}/trust`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9, alternates: { languages: { es: `${baseUrl}/trust`, en: `${baseUrl}/en/trust` } } },
    { url: `${baseUrl}/llc`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9, alternates: { languages: { es: `${baseUrl}/llc`, en: `${baseUrl}/en/llc` } } },
    { url: `${baseUrl}/travel-authorization`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9, alternates: { languages: { es: `${baseUrl}/travel-authorization`, en: `${baseUrl}/en/travel-authorization` } } },
    { url: `${baseUrl}/guardianship`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8, alternates: { languages: { es: `${baseUrl}/guardianship`, en: `${baseUrl}/en/guardianship` } } },
    { url: `${baseUrl}/bill-of-sale`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8, alternates: { languages: { es: `${baseUrl}/bill-of-sale`, en: `${baseUrl}/en/bill-of-sale` } } },
    { url: `${baseUrl}/affidavit`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8, alternates: { languages: { es: `${baseUrl}/affidavit`, en: `${baseUrl}/en/affidavit` } } },
    { url: `${baseUrl}/revocation-poa`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8, alternates: { languages: { es: `${baseUrl}/revocation-poa`, en: `${baseUrl}/en/revocation-poa` } } },
    { url: `${baseUrl}/authorization-letter`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8, alternates: { languages: { es: `${baseUrl}/authorization-letter`, en: `${baseUrl}/en/authorization-letter` } } },
    { url: `${baseUrl}/promissory-note`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8, alternates: { languages: { es: `${baseUrl}/promissory-note`, en: `${baseUrl}/en/promissory-note` } } },
    // Products — English
    { url: `${baseUrl}/en/poa`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9, alternates: { languages: { en: `${baseUrl}/en/poa`, es: `${baseUrl}/poa` } } },
    { url: `${baseUrl}/en/limited-poa`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9, alternates: { languages: { en: `${baseUrl}/en/limited-poa`, es: `${baseUrl}/limited-poa` } } },
    { url: `${baseUrl}/en/trust`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9, alternates: { languages: { en: `${baseUrl}/en/trust`, es: `${baseUrl}/trust` } } },
    { url: `${baseUrl}/en/llc`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9, alternates: { languages: { en: `${baseUrl}/en/llc`, es: `${baseUrl}/llc` } } },
    { url: `${baseUrl}/en/travel-authorization`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9, alternates: { languages: { en: `${baseUrl}/en/travel-authorization`, es: `${baseUrl}/travel-authorization` } } },
    { url: `${baseUrl}/en/guardianship`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8, alternates: { languages: { en: `${baseUrl}/en/guardianship`, es: `${baseUrl}/guardianship` } } },
    { url: `${baseUrl}/en/bill-of-sale`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8, alternates: { languages: { en: `${baseUrl}/en/bill-of-sale`, es: `${baseUrl}/bill-of-sale` } } },
    { url: `${baseUrl}/en/affidavit`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8, alternates: { languages: { en: `${baseUrl}/en/affidavit`, es: `${baseUrl}/affidavit` } } },
    { url: `${baseUrl}/en/revocation-poa`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8, alternates: { languages: { en: `${baseUrl}/en/revocation-poa`, es: `${baseUrl}/revocation-poa` } } },
    { url: `${baseUrl}/en/authorization-letter`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8, alternates: { languages: { en: `${baseUrl}/en/authorization-letter`, es: `${baseUrl}/authorization-letter` } } },
    { url: `${baseUrl}/en/promissory-note`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8, alternates: { languages: { en: `${baseUrl}/en/promissory-note`, es: `${baseUrl}/promissory-note` } } },
    // Info pages — Spanish
    { url: `${baseUrl}/mas-servicios`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8, alternates: { languages: { es: `${baseUrl}/mas-servicios`, en: `${baseUrl}/en/more-services` } } },
    { url: `${baseUrl}/nuestra-historia`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7, alternates: { languages: { es: `${baseUrl}/nuestra-historia`, en: `${baseUrl}/en/our-story` } } },
    { url: `${baseUrl}/por-que-nosotros`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7, alternates: { languages: { es: `${baseUrl}/por-que-nosotros`, en: `${baseUrl}/en/why-us` } } },
    { url: `${baseUrl}/contacto`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7, alternates: { languages: { es: `${baseUrl}/contacto`, en: `${baseUrl}/en/contact` } } },
    // Info pages — English
    { url: `${baseUrl}/en/more-services`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8, alternates: { languages: { en: `${baseUrl}/en/more-services`, es: `${baseUrl}/mas-servicios` } } },
    { url: `${baseUrl}/en/our-story`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7, alternates: { languages: { en: `${baseUrl}/en/our-story`, es: `${baseUrl}/nuestra-historia` } } },
    { url: `${baseUrl}/en/why-us`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7, alternates: { languages: { en: `${baseUrl}/en/why-us`, es: `${baseUrl}/por-que-nosotros` } } },
    { url: `${baseUrl}/en/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7, alternates: { languages: { en: `${baseUrl}/en/contact`, es: `${baseUrl}/contacto` } } },
    // Blog
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8, alternates: { languages: { es: `${baseUrl}/blog`, en: `${baseUrl}/en/blog` } } },
    { url: `${baseUrl}/en/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8, alternates: { languages: { en: `${baseUrl}/en/blog`, es: `${baseUrl}/blog` } } },
    // Legal
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/accessibility`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Dynamic blog posts — Spanish + English
  let blogPosts = [];
  try {
    const posts = getAllPosts();
    posts.forEach((post) => {
      const lastMod = post.date ? new Date(post.date) : new Date();
      // Higher priority for 2026 posts and travel category (most searches)
      const is2026 = post.slug.includes('2026');
      const isTravel = post.category === 'travel' || post.slug.includes('carta-autorizacion');
      const priority = is2026 && isTravel ? 0.9 : is2026 ? 0.8 : isTravel ? 0.75 : 0.6;
      const changeFreq = is2026 ? 'weekly' : 'monthly';

      // Spanish version
      blogPosts.push({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: lastMod,
        changeFrequency: changeFreq,
        priority,
        alternates: { languages: { es: `${baseUrl}/blog/${post.slug}`, en: `${baseUrl}/en/blog/${post.slug}` } },
      });
      // English version
      blogPosts.push({
        url: `${baseUrl}/en/blog/${post.slug}`,
        lastModified: lastMod,
        changeFrequency: changeFreq,
        priority: priority - 0.05,
        alternates: { languages: { en: `${baseUrl}/en/blog/${post.slug}`, es: `${baseUrl}/blog/${post.slug}` } },
      });
    });
  } catch (e) {
    // If blog fails to load, continue with static pages only
  }

  return [...staticPages, ...blogPosts];
}
