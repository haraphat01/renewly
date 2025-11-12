export default function StructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dealping.tech'

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Dealping",
    "url": baseUrl,
    "logo": `${baseUrl}/icon.png`,
    "description": "AI-powered contract management for independent professionals",
    "sameAs": [
      // Add your social media profiles here
      // "https://twitter.com/dealping",
      // "https://linkedin.com/company/dealping",
    ],
  }

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Dealping",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "priceValidUntil": "2026-12-31",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1",
    },
    "description": "AI-powered contract management for independent professionals. Track contracts, get automated reminders, and never miss a renewal or rate increase again.",
    "featureList": [
      "AI Contract Extraction",
      "Automated Reminders",
      "Revenue Tracking",
      "Contract Templates",
      "Multi-format Support (PDF, DOCX)",
    ],
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Dealping",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/sign-up`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Dealping?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Dealping is an AI-powered contract management platform designed for independent professionals. It helps you track contracts, get automated reminders before renewals, and never miss important contract dates or rate increases.",
        },
      },
      {
        "@type": "Question",
        "name": "How does AI contract extraction work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Simply upload your contract as a PDF or DOCX file. Our AI automatically extracts key information including client names, contract dates, rates, payment terms, and renewal dates, saving you time on manual data entry.",
        },
      },
      {
        "@type": "Question",
        "name": "What types of reminders does Dealping send?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Dealping sends automated email reminders 30, 15, and 7 days before contract expiration. For Pro users, you also get daily reminders when contracts are less than 7 days from expiry, plus SMS notifications.",
        },
      },
      {
        "@type": "Question",
        "name": "Is there a free plan?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Dealping offers a free plan that allows you to manage one contract with email reminders. This is perfect for trying out the platform. Pro plans start at $9/month or $90/year for unlimited contracts and additional features.",
        },
      },
      {
        "@type": "Question",
        "name": "Who is Dealping for?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Dealping is designed for independent professionals including freelancers, consultants, independent contractors, small business owners, and agencies managing client contracts. It's perfect for anyone who needs to track multiple contracts without the complexity of enterprise tools.",
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}

