'use client';

import Link from 'next/link';

export default function AccessibilityStatement() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F8FAFC',
      padding: '40px 20px'
    }}>
      <div style={{ 
        maxWidth: '900px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: '48px'
      }}>
        {/* Back Link */}
        <Link href="/" style={{ 
          color: '#1E3A5F', 
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          marginBottom: '24px',
          fontSize: '14px'
        }}>
          ← Back to Home
        </Link>

        {/* Title */}
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: 'bold', 
          color: '#1E3A5F',
          marginBottom: '8px'
        }}>
          Accessibility Statement
        </h1>
        
        <p style={{ color: '#6B7280', marginBottom: '32px' }}>
          Effective Date: January 28, 2026
        </p>

        {/* Content */}
        <div style={{ lineHeight: '1.7', color: '#374151' }}>
          
          {/* Intro */}
          <p style={{ marginBottom: '24px' }}>
            Multiservicios 360 is committed to providing a website that is accessible to the widest possible 
            audience, including people with disabilities. We are continually working to improve the user 
            experience for everyone and to apply relevant accessibility standards.
          </p>

          {/* Accessibility Standard */}
          <Section title="Accessibility Standard">
            <p>
              We aim to follow the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA as our 
              accessibility standard.
            </p>
          </Section>

          {/* Accessibility Features */}
          <Section title="Accessibility Features">
            <p>We strive to support accessibility features such as:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
              <li style={{ marginBottom: '8px' }}>Keyboard navigation for key site functions</li>
              <li style={{ marginBottom: '8px' }}>Logical heading structure and page landmarks for assistive technologies</li>
              <li style={{ marginBottom: '8px' }}>Text alternatives (alt text) for meaningful images</li>
              <li style={{ marginBottom: '8px' }}>Sufficient color contrast for readable text and controls</li>
              <li style={{ marginBottom: '8px' }}>Form labels and error messaging designed to be understandable and accessible</li>
            </ul>
          </Section>

          {/* Ongoing Efforts */}
          <Section title="Ongoing Efforts">
            <p>
              Accessibility is an ongoing effort. We regularly review our website and make updates to improve 
              accessibility and usability. Some areas of the website may be updated over time as we continue 
              to enhance features and content.
            </p>
          </Section>

          {/* Need Help */}
          <Section title="Need Help or Want to Report an Issue?">
            <p>
              If you experience difficulty accessing any part of multiservicios360.net, or if you need 
              assistance completing a process on our site, please contact us and we will work with you to 
              provide access to the information or service you need.
            </p>
            
            {/* Contact Box */}
            <div style={{ 
              backgroundColor: '#EFF6FF', 
              border: '1px solid #3B82F6', 
              borderRadius: '8px', 
              padding: '20px', 
              marginTop: '16px',
              marginBottom: '16px'
            }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#1E40AF' }}>Contact Us:</p>
              <p style={{ margin: '0 0 4px 0', color: '#1E40AF' }}>
                Email: <a href="mailto:support@multiservicios360.net" style={{ color: '#2563EB' }}>support@multiservicios360.net</a>
              </p>
              <p style={{ margin: 0, color: '#1E40AF' }}>
                Phone: <a href="tel:855-246-7274" style={{ color: '#2563EB' }}>855-246-7274</a>
              </p>
            </div>

            <p>When you contact us, please include:</p>
            <ul style={{ paddingLeft: '20px', marginTop: '12px' }}>
              <li style={{ marginBottom: '8px' }}>The page URL (if possible)</li>
              <li style={{ marginBottom: '8px' }}>A brief description of the issue</li>
              <li style={{ marginBottom: '8px' }}>The assistive technology and browser/device you are using (optional)</li>
            </ul>
          </Section>

          {/* Response Time */}
          <Section title="Response Time">
            <p>
              We aim to respond to accessibility requests and reports within 5 business days.
            </p>
          </Section>

          {/* Third-Party Content */}
          <Section title="Third-Party Content">
            <p>
              Some features on our site may rely on third-party services (such as payment processing or 
              embedded content). While we strive to ensure accessibility across our site, we may not control 
              the accessibility of third-party platforms. If you encounter an issue with a third-party service, 
              contact us and we will work with you on an alternative solution where possible.
            </p>
          </Section>

          {/* Statement Updates */}
          <Section title="Statement Updates">
            <p>
              We may update this Accessibility Statement from time to time. Updates will be posted on this 
              page with a revised effective date.
            </p>
          </Section>

        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: '48px', 
          paddingTop: '24px', 
          borderTop: '1px solid #E5E7EB',
          textAlign: 'center'
        }}>
          <p style={{ color: '#6B7280', marginBottom: '8px' }}>Questions about accessibility?</p>
          <p style={{ color: '#1E3A5F', fontWeight: 'bold' }}>855-246-7274</p>
          <p style={{ color: '#1E3A5F' }}>support@multiservicios360.net</p>
        </div>
      </div>
    </div>
  );
}

// Helper Component
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{ 
        fontSize: '20px', 
        fontWeight: 'bold', 
        color: '#1E3A5F',
        marginBottom: '16px'
      }}>
        {title}
      </h2>
      {children}
    </div>
  );
}