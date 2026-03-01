/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Spanish slugs used in English context → correct English URLs
      { source: '/en/negocios',                   destination: '/en/business',        permanent: true },
      { source: '/en/planificacion-familiar',     destination: '/en/family-planning', permanent: true },
      { source: '/en/por-que-nosotros',           destination: '/en/why-us',          permanent: true },
      { source: '/en/contacto',                   destination: '/en/contact',         permanent: true },
      { source: '/en/nuestra-historia',           destination: '/en/our-story',       permanent: true },
      { source: '/en/mas-servicios',              destination: '/en/more-services',   permanent: true },
      // English slugs used in Spanish context → correct Spanish URLs
      { source: '/business',                      destination: '/negocios',           permanent: true },
      { source: '/family-planning',               destination: '/planificacion-familiar', permanent: true },
      { source: '/why-us',                        destination: '/por-que-nosotros',   permanent: true },
      { source: '/contact',                       destination: '/contacto',           permanent: true },
      { source: '/our-story',                     destination: '/nuestra-historia',   permanent: true },
      { source: '/more-services',                 destination: '/mas-servicios',      permanent: true },
    ];
  },
};

module.exports = nextConfig;
