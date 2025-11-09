import { NextRequest, NextResponse } from 'next/server'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'

const templateContent: Record<string, any> = {
  'freelance-writing': {
    title: 'Freelance Writing Contract',
    sections: [
      {
        heading: '1. Parties',
        content: [
          'This Freelance Writing Contract ("Agreement") is entered into on [DATE] between:',
          '',
          'Client: [CLIENT NAME]',
          'Address: [CLIENT ADDRESS]',
          '',
          'Freelancer: [YOUR NAME]',
          'Address: [YOUR ADDRESS]',
        ],
      },
      {
        heading: '2. Scope of Work',
        content: [
          'The Freelancer agrees to provide professional writing services as described below:',
          '- Project Type: [BLOG POSTS / ARTICLES / COPYWRITING / EBOOK]',
          '- Deliverables: [NUMBER] articles of approximately [WORD COUNT] words each',
          '- Tone/Style: [INFORMATIVE / CASUAL / TECHNICAL / FORMAL]',
          '- Delivery Deadline: [DATE]',
        ],
      },
      {
        heading: '3. Payment Terms',
        content: [
          'Rate: $[AMOUNT] per [WORD/PIECE/HOUR]',
          'Total Project Fee: $[TOTAL AMOUNT]',
          'Payment Schedule:',
          '- [50% upon signing, 50% upon delivery] or [per deliverable]',
          'Late payments after [NUMBER] days may incur a [PERCENT]% late fee.',
          'Payment Method: [BANK TRANSFER / PAYPAL / STRIPE]',
        ],
      },
      {
        heading: '4. Revisions and Approval',
        content: [
          'The Client is entitled to [NUMBER] rounds of revisions per deliverable.',
          'Revisions must be requested within [NUMBER] days of delivery.',
          'Additional revisions beyond the agreed amount will be billed at $[RATE]/hour.',
        ],
      },
      {
        heading: '5. Copyright and Ownership',
        content: [
          'Upon full payment, the Client obtains exclusive rights to the written materials.',
          'The Freelancer may include excerpts in a professional portfolio with prior consent.',
        ],
      },
      {
        heading: '6. Confidentiality',
        content: [
          'Both parties agree to maintain confidentiality of all project-related materials and communications.',
          'This clause remains valid after termination of the Agreement.',
        ],
      },
      {
        heading: '7. Termination',
        content: [
          'Either party may terminate this Agreement with [NUMBER] days written notice.',
          'If terminated early, Client shall pay for all completed work up to termination date.',
        ],
      },
      {
        heading: '8. Dispute Resolution',
        content: [
          'Any disputes will first be resolved through good faith negotiation.',
          'If unresolved, disputes shall be settled under the laws of [STATE/COUNTRY].',
        ],
      },
      {
        heading: '9. Signatures',
        content: [
          'Client Signature: ____________________________   Date: ___________',
          'Freelancer Signature: _________________________   Date: ___________',
        ],
      },
    ],
  },

  'web-design': {
    title: 'Web Design Contract',
    sections: [
      {
        heading: '1. Parties',
        content: [
          'This Web Design Contract ("Agreement") is entered into on [DATE] between:',
          '',
          'Client: [CLIENT NAME]',
          'Address: [CLIENT ADDRESS]',
          '',
          'Freelancer: [YOUR NAME]',
          'Address: [YOUR ADDRESS]',
        ],
      },
      {
        heading: '2. Project Overview',
        content: [
          'The Freelancer agrees to design and develop a website for the Client based on the following scope:',
          '- Number of Pages: [NUMBER]',
          '- Design Style: [MODERN / MINIMAL / CORPORATE / CREATIVE]',
          '- Responsive Design: Mobile, Tablet, and Desktop',
          '- Features: [CONTACT FORM, CMS, E-COMMERCE, BLOG, ETC.]',
          '- Delivery Timeline: [START DATE] to [END DATE]',
        ],
      },
      {
        heading: '3. Payment Terms',
        content: [
          'Total Fee: $[AMOUNT]',
          'Payment Schedule:',
          '- 50% deposit upon signing: $[AMOUNT]',
          '- 50% upon final delivery: $[AMOUNT]',
          'Invoices are due within [NUMBER] days of issue.',
          'Late payments will incur a [PERCENT]% monthly fee.',
        ],
      },
      {
        heading: '4. Revisions and Changes',
        content: [
          'The Client is entitled to [NUMBER] rounds of revisions per design phase.',
          'Any major scope changes will require a new quote or change order.',
        ],
      },
      {
        heading: '5. Intellectual Property',
        content: [
          'Upon full payment, the Client owns the final design and website files.',
          'The Freelancer retains the right to showcase the project in their portfolio.',
        ],
      },
      {
        heading: '6. Confidentiality',
        content: [
          'Both parties agree not to disclose confidential information shared during the project.',
        ],
      },
      {
        heading: '7. Termination',
        content: [
          'Either party may terminate this Agreement with written notice.',
          'Client will pay for all completed work up to termination date.',
        ],
      },
      {
        heading: '8. Dispute Resolution and Governing Law',
        content: [
          'Disputes will be resolved under the jurisdiction of [STATE/COUNTRY].',
        ],
      },
      {
        heading: '9. Signatures',
        content: [
          'Client Signature: ____________________________   Date: ___________',
          'Freelancer Signature: _________________________   Date: ___________',
        ],
      },
    ],
  },

  'software-development': {
    title: 'Software Development Contract',
    sections: [
      {
        heading: '1. Parties',
        content: [
          'This Software Development Agreement is entered into on [DATE] between:',
          '',
          'Client: [CLIENT NAME]',
          'Developer: [YOUR NAME]',
        ],
      },
      {
        heading: '2. Project Description',
        content: [
          'The Developer agrees to design, develop, and deliver software as described below:',
          '- Application Type: [WEB / MOBILE / DESKTOP]',
          '- Technology Stack: [LIST TECHNOLOGIES]',
          '- Deliverables: [SOURCE CODE, DOCUMENTATION, DEPLOYMENT]',
          '- Timeline: [START DATE] to [END DATE]',
        ],
      },
      {
        heading: '3. Payment and Milestones',
        content: [
          'Total Fee: $[AMOUNT]',
          'Milestone Schedule:',
          '- Phase 1 ([DATE]): $[AMOUNT]',
          '- Phase 2 ([DATE]): $[AMOUNT]',
          '- Final Delivery ([DATE]): $[AMOUNT]',
          'Late payment may result in project delays.',
        ],
      },
      {
        heading: '4. Intellectual Property Rights',
        content: [
          'Upon full payment, the Client owns all intellectual property rights to the final software.',
          'The Developer may retain reusable components and libraries not specific to the project.',
        ],
      },
      {
        heading: '5. Maintenance and Support',
        content: [
          'The Developer will provide post-launch maintenance for [NUMBER] months.',
          'Extended support available at $[RATE]/hour.',
        ],
      },
      {
        heading: '6. Confidentiality',
        content: [
          'All code, documentation, and project details are confidential and may not be shared.',
        ],
      },
      {
        heading: '7. Termination',
        content: [
          'Either party may terminate this Agreement with [NUMBER] days written notice.',
          'Client shall pay for completed milestones and any work-in-progress.',
        ],
      },
      {
        heading: '8. Dispute Resolution',
        content: [
          'Any disputes shall be governed by the laws of [STATE/COUNTRY].',
        ],
      },
      {
        heading: '9. Signatures',
        content: [
          'Client Signature: ____________________________   Date: ___________',
          'Developer Signature: _________________________   Date: ___________',
        ],
      },
    ],
  },

  'consulting': {
    title: 'Consulting Services Agreement',
    sections: [
      {
        heading: '1. Parties',
        content: [
          'This Consulting Agreement is entered into on [DATE] between:',
          'Client: [CLIENT NAME]',
          'Consultant: [YOUR NAME]',
        ],
      },
      {
        heading: '2. Scope of Services',
        content: [
          'The Consultant agrees to provide advisory and strategic services including:',
          '- [DESCRIBE SERVICES]',
          '- Duration: [START DATE] to [END DATE]',
        ],
      },
      {
        heading: '3. Compensation',
        content: [
          'Hourly Rate: $[AMOUNT] per hour',
          'Estimated Hours: [NUMBER]',
          'Total Estimated Fee: $[AMOUNT]',
          'Invoices are due within [NUMBER] days of receipt.',
        ],
      },
      {
        heading: '4. Confidentiality',
        content: [
          'Consultant agrees not to disclose or use any confidential client information for personal gain.',
        ],
      },
      {
        heading: '5. Independent Contractor Status',
        content: [
          'Consultant is an independent contractor and not an employee of the Client.',
          'Consultant is responsible for taxes and benefits.',
        ],
      },
      {
        heading: '6. Termination',
        content: [
          'Either party may terminate with [NUMBER] days written notice.',
          'Payment is required for work performed up to termination.',
        ],
      },
      {
        heading: '7. Governing Law',
        content: [
          'This Agreement shall be governed by the laws of [STATE/COUNTRY].',
        ],
      },
      {
        heading: '8. Signatures',
        content: [
          'Client Signature: ____________________________   Date: ___________',
          'Consultant Signature: _________________________   Date: ___________',
        ],
      },
    ],
  },

  'graphic-design': {
    title: 'Graphic Design Contract',
    sections: [
      {
        heading: '1. Parties',
        content: [
          'This Graphic Design Contract is made on [DATE] between:',
          'Client: [CLIENT NAME]',
          'Designer: [YOUR NAME]',
        ],
      },
      {
        heading: '2. Project Scope',
        content: [
          'The Designer agrees to create and deliver the following design materials:',
          '- Deliverables: [POSTER / LOGO / BRAND KIT / SOCIAL MEDIA GRAPHICS]',
          '- File Formats: [AI, PSD, PNG, PDF]',
          '- Deadline: [DATE]',
        ],
      },
      {
        heading: '3. Payment Terms',
        content: [
          'Total Fee: $[AMOUNT]',
          '50% upfront and 50% upon final approval.',
          'Late payments incur a [PERCENT]% monthly fee.',
        ],
      },
      {
        heading: '4. Revisions',
        content: [
          'Client is entitled to [NUMBER] revision rounds.',
          'Extra revisions: $[RATE]/hour.',
        ],
      },
      {
        heading: '5. Ownership & Usage Rights',
        content: [
          'Client receives full ownership rights upon payment.',
          'Designer retains right to use work for self-promotion.',
        ],
      },
      {
        heading: '6. Confidentiality',
        content: ['All project details remain confidential.'],
      },
      {
        heading: '7. Termination',
        content: [
          'Either party may terminate with written notice.',
          'Client pays for all work completed.',
        ],
      },
      {
        heading: '8. Signatures',
        content: [
          'Client Signature: ____________________________   Date: ___________',
          'Designer Signature: _________________________   Date: ___________',
        ],
      },
    ],
  },

  'marketing': {
    title: 'Marketing Services Contract',
    sections: [
      {
        heading: '1. Parties',
        content: [
          'This Marketing Services Agreement is made on [DATE] between:',
          'Client: [CLIENT NAME]',
          'Marketer: [YOUR NAME]',
        ],
      },
      {
        heading: '2. Scope of Work',
        content: [
          'The Marketer agrees to plan, execute, and monitor marketing campaigns for the Client.',
          '- Channels: [SOCIAL MEDIA / EMAIL / SEO / PPC]',
          '- Duration: [START DATE] to [END DATE]',
          '- Deliverables: [CONTENT, REPORTS, ADS]',
        ],
      },
      {
        heading: '3. Compensation',
        content: [
          'Monthly Retainer: $[AMOUNT] or Project Fee: $[AMOUNT]',
          'Invoices due within [NUMBER] days.',
        ],
      },
      {
        heading: '4. Reporting & Communication',
        content: [
          'Marketer will provide periodic reports detailing campaign performance and insights.',
        ],
      },
      {
        heading: '5. Confidentiality',
        content: [
          'All marketing data and strategies remain confidential between both parties.',
        ],
      },
      {
        heading: '6. Termination',
        content: [
          'Either party may terminate with [NUMBER] days notice.',
          'All fees up to the termination date remain payable.',
        ],
      },
      {
        heading: '7. Governing Law',
        content: ['This Agreement is governed by the laws of [STATE/COUNTRY].'],
      },
      {
        heading: '8. Signatures',
        content: [
          'Client Signature: ____________________________   Date: ___________',
          'Marketer Signature: _________________________   Date: ___________',
        ],
      },
    ],
  },

  'photography': {
    title: 'Photography Services Contract',
    sections: [
      {
        heading: '1. Parties',
        content: [
          'This Photography Services Contract is entered into on [DATE] between:',
          'Client: [CLIENT NAME]',
          'Photographer: [YOUR NAME]',
        ],
      },
      {
        heading: '2. Photography Services',
        content: [
          'The Photographer agrees to provide the following services:',
          '- Event Type: [WEDDING / CORPORATE / PORTRAIT / PRODUCT]',
          '- Date and Time: [DATE] from [TIME] to [TIME]',
          '- Location: [VENUE ADDRESS]',
          '- Number of Photos: Approximately [NUMBER] edited images',
          '- Delivery Format: [DIGITAL / PRINT / BOTH]',
        ],
      },
      {
        heading: '3. Payment Terms',
        content: [
          'Total Fee: $[AMOUNT]',
          'Deposit: $[AMOUNT] due upon signing (non-refundable)',
          'Balance: $[AMOUNT] due [BEFORE EVENT / UPON DELIVERY]',
          'Additional Services: [PRINTS / ALBUMS / EXTRA HOURS] at $[RATE]',
        ],
      },
      {
        heading: '4. Image Delivery and Usage Rights',
        content: [
          'Final images will be delivered within [NUMBER] weeks of the event.',
          'Client receives personal usage rights for all delivered images.',
          'Photographer retains copyright and may use images for portfolio and marketing.',
          'Commercial usage requires separate licensing agreement.',
        ],
      },
      {
        heading: '5. Cancellation and Rescheduling',
        content: [
          'Cancellation more than [NUMBER] days before event: Deposit forfeited.',
          'Cancellation less than [NUMBER] days: Full fee due.',
          'Rescheduling: Subject to availability, may incur additional fees.',
        ],
      },
      {
        heading: '6. Signatures',
        content: [
          'Client Signature: ____________________________   Date: ___________',
          'Photographer Signature: _________________________   Date: ___________',
        ],
      },
    ],
  },

  'video-production': {
    title: 'Video Production Contract',
    sections: [
      {
        heading: '1. Parties',
        content: [
          'This Video Production Agreement is entered into on [DATE] between:',
          'Client: [CLIENT NAME]',
          'Videographer: [YOUR NAME]',
        ],
      },
      {
        heading: '2. Project Scope',
        content: [
          'The Videographer agrees to produce the following:',
          '- Video Type: [PROMOTIONAL / EVENT / DOCUMENTARY / COMMERCIAL]',
          '- Duration: Approximately [LENGTH] minutes',
          '- Shoot Date(s): [DATE(S)]',
          '- Location(s): [VENUE(S)]',
          '- Deliverables: [FINAL VIDEO / RAW FOOTAGE / BOTH]',
        ],
      },
      {
        heading: '3. Payment Terms',
        content: [
          'Total Project Fee: $[AMOUNT]',
          'Payment Schedule:',
          '- 50% deposit: $[AMOUNT] upon signing',
          '- 25% upon shoot completion: $[AMOUNT]',
          '- 25% upon final delivery: $[AMOUNT]',
        ],
      },
      {
        heading: '4. Revisions and Approval',
        content: [
          'Client is entitled to [NUMBER] rounds of revisions.',
          'Additional revisions: $[RATE]/hour.',
          'Final approval must be given within [NUMBER] days of delivery.',
        ],
      },
      {
        heading: '5. Usage Rights',
        content: [
          'Client receives usage rights for [PERSONAL / COMMERCIAL / UNLIMITED] use.',
          'Videographer retains right to use footage for portfolio and marketing.',
        ],
      },
      {
        heading: '6. Signatures',
        content: [
          'Client Signature: ____________________________   Date: ___________',
          'Videographer Signature: _________________________   Date: ___________',
        ],
      },
    ],
  },

  'business-consulting': {
    title: 'Business Consulting Agreement',
    sections: [
      {
        heading: '1. Parties',
        content: [
          'This Business Consulting Agreement is entered into on [DATE] between:',
          'Client: [CLIENT NAME]',
          'Consultant: [YOUR NAME]',
        ],
      },
      {
        heading: '2. Consulting Services',
        content: [
          'The Consultant will provide business advisory services including:',
          '- Strategic planning and analysis',
          '- Business process improvement',
          '- Market research and analysis',
          '- Operational recommendations',
          '- Duration: [START DATE] to [END DATE]',
        ],
      },
      {
        heading: '3. Compensation',
        content: [
          'Hourly Rate: $[AMOUNT] per hour',
          'OR Monthly Retainer: $[AMOUNT]',
          'Estimated Total: $[AMOUNT]',
          'Invoices due within [NUMBER] days of receipt.',
        ],
      },
      {
        heading: '4. Deliverables',
        content: [
          'Consultant will provide:',
          '- Written reports and recommendations',
          '- Strategic plans and roadmaps',
          '- Regular progress updates',
        ],
      },
      {
        heading: '5. Confidentiality',
        content: [
          'All business information shared is strictly confidential.',
          'Consultant will not disclose or use information for personal gain.',
        ],
      },
      {
        heading: '6. Signatures',
        content: [
          'Client Signature: ____________________________   Date: ___________',
          'Consultant Signature: _________________________   Date: ___________',
        ],
      },
    ],
  },

  'it-consulting': {
    title: 'IT Consulting Agreement',
    sections: [
      {
        heading: '1. Parties',
        content: [
          'This IT Consulting Agreement is entered into on [DATE] between:',
          'Client: [CLIENT NAME]',
          'IT Consultant: [YOUR NAME]',
        ],
      },
      {
        heading: '2. IT Services',
        content: [
          'The Consultant will provide IT consulting services:',
          '- System analysis and assessment',
          '- Technology recommendations',
          '- Implementation planning',
          '- Technical support and troubleshooting',
          '- Project Duration: [START DATE] to [END DATE]',
        ],
      },
      {
        heading: '3. Compensation',
        content: [
          'Hourly Rate: $[AMOUNT] per hour',
          'OR Fixed Project Fee: $[AMOUNT]',
          'Payment Terms: [NET 15 / NET 30]',
        ],
      },
      {
        heading: '4. Scope and Limitations',
        content: [
          'Services are limited to consulting and advisory.',
          'Implementation services require separate agreement.',
          'Hardware/software purchases are client responsibility.',
        ],
      },
      {
        heading: '5. Confidentiality and Security',
        content: [
          'All client systems and data are confidential.',
          'Consultant will maintain security best practices.',
          'No unauthorized access or data sharing.',
        ],
      },
      {
        heading: '6. Signatures',
        content: [
          'Client Signature: ____________________________   Date: ___________',
          'IT Consultant Signature: _________________________   Date: ___________',
        ],
      },
    ],
  },

  'financial-consulting': {
    title: 'Financial Consulting Agreement',
    sections: [
      {
        heading: '1. Parties',
        content: [
          'This Financial Consulting Agreement is entered into on [DATE] between:',
          'Client: [CLIENT NAME]',
          'Financial Consultant: [YOUR NAME]',
        ],
      },
      {
        heading: '2. Financial Services',
        content: [
          'The Consultant will provide financial advisory services:',
          '- Financial analysis and planning',
          '- Budget development and review',
          '- Investment recommendations',
          '- Tax planning strategies',
          '- Duration: [START DATE] to [END DATE]',
        ],
      },
      {
        heading: '3. Compensation',
        content: [
          'Hourly Rate: $[AMOUNT] per hour',
          'OR Retainer: $[AMOUNT] per month',
          'Total Estimated Fee: $[AMOUNT]',
        ],
      },
      {
        heading: '4. Regulatory Compliance',
        content: [
          'Consultant is not providing investment advice requiring SEC registration.',
          'Client acknowledges consultant is not a licensed financial advisor.',
          'All recommendations are advisory only.',
        ],
      },
      {
        heading: '5. Confidentiality',
        content: [
          'All financial information is strictly confidential.',
          'Consultant will maintain professional confidentiality standards.',
        ],
      },
      {
        heading: '6. Signatures',
        content: [
          'Client Signature: ____________________________   Date: ___________',
          'Financial Consultant Signature: _________________________   Date: ___________',
        ],
      },
    ],
  },

  'independent-contractor': {
    title: 'Independent Contractor Agreement',
    sections: [
      {
        heading: '1. Parties',
        content: [
          'This Independent Contractor Agreement is entered into on [DATE] between:',
          'Client: [CLIENT NAME]',
          'Contractor: [YOUR NAME]',
        ],
      },
      {
        heading: '2. Services to be Performed',
        content: [
          'Contractor agrees to provide the following services:',
          '- [DESCRIBE SERVICES IN DETAIL]',
          '- Project Timeline: [START DATE] to [END DATE]',
          '- Deliverables: [LIST DELIVERABLES]',
        ],
      },
      {
        heading: '3. Compensation',
        content: [
          'Payment Method: [HOURLY / FIXED FEE / PER DELIVERABLE]',
          'Rate/Fee: $[AMOUNT]',
          'Total Estimated: $[AMOUNT]',
          'Payment Terms: [NET 15 / NET 30 / UPON COMPLETION]',
        ],
      },
      {
        heading: '4. Independent Contractor Status',
        content: [
          'Contractor is an independent contractor, not an employee.',
          'Contractor is responsible for own taxes, insurance, and benefits.',
          'Client will not withhold taxes or provide benefits.',
        ],
      },
      {
        heading: '5. Work Product and Ownership',
        content: [
          'Upon full payment, Client owns all work product and deliverables.',
          'Contractor may use work for portfolio with Client permission.',
        ],
      },
      {
        heading: '6. Confidentiality',
        content: [
          'Contractor agrees to maintain confidentiality of all client information.',
        ],
      },
      {
        heading: '7. Termination',
        content: [
          'Either party may terminate with [NUMBER] days written notice.',
          'Payment due for all work completed up to termination date.',
        ],
      },
      {
        heading: '8. Signatures',
        content: [
          'Client Signature: ____________________________   Date: ___________',
          'Contractor Signature: _________________________   Date: ___________',
        ],
      },
    ],
  },

  'service-agreement': {
    title: 'Service Agreement',
    sections: [
      {
        heading: '1. Parties',
        content: [
          'This Service Agreement is entered into on [DATE] between:',
          'Service Provider: [YOUR NAME]',
          'Client: [CLIENT NAME]',
        ],
      },
      {
        heading: '2. Services',
        content: [
          'Service Provider agrees to provide:',
          '- [DESCRIBE SERVICES]',
          '- Service Period: [START DATE] to [END DATE]',
          '- Service Location: [LOCATION]',
        ],
      },
      {
        heading: '3. Payment Terms',
        content: [
          'Service Fee: $[AMOUNT]',
          'Payment Schedule: [ONE-TIME / MONTHLY / PER SERVICE]',
          'Due Date: [DATE OR TERMS]',
          'Late Fee: [PERCENT]% per month on overdue amounts.',
        ],
      },
      {
        heading: '4. Responsibilities',
        content: [
          'Service Provider Responsibilities:',
          '- [LIST RESPONSIBILITIES]',
          '',
          'Client Responsibilities:',
          '- [LIST RESPONSIBILITIES]',
        ],
      },
      {
        heading: '5. Term and Termination',
        content: [
          'This agreement begins on [DATE] and continues until [DATE].',
          'Either party may terminate with [NUMBER] days written notice.',
        ],
      },
      {
        heading: '6. Signatures',
        content: [
          'Service Provider Signature: ____________________________   Date: ___________',
          'Client Signature: _________________________   Date: ___________',
        ],
      },
    ],
  },

  'vendor-agreement': {
    title: 'Vendor Service Agreement',
    sections: [
      {
        heading: '1. Parties',
        content: [
          'This Vendor Service Agreement is entered into on [DATE] between:',
          'Business: [YOUR BUSINESS NAME]',
          'Vendor: [VENDOR NAME]',
        ],
      },
      {
        heading: '2. Vendor Services',
        content: [
          'Vendor agrees to provide the following services/products:',
          '- [DESCRIBE SERVICES OR PRODUCTS]',
          '- Service Period: [START DATE] to [END DATE]',
          '- Delivery Schedule: [SCHEDULE]',
        ],
      },
      {
        heading: '3. Pricing and Payment',
        content: [
          'Service/Product Price: $[AMOUNT]',
          'Payment Terms: [NET 30 / UPON DELIVERY / MONTHLY]',
          'Invoices due within [NUMBER] days of receipt.',
        ],
      },
      {
        heading: '4. Quality Standards',
        content: [
          'Vendor must meet agreed quality standards.',
          'Business may reject non-conforming services/products.',
          'Vendor will correct issues at no additional cost.',
        ],
      },
      {
        heading: '5. Term and Termination',
        content: [
          'Agreement term: [DURATION]',
          'Either party may terminate with [NUMBER] days notice.',
        ],
      },
      {
        heading: '6. Signatures',
        content: [
          'Business Signature: ____________________________   Date: ___________',
          'Vendor Signature: _________________________   Date: ___________',
        ],
      },
    ],
  },

  'client-service-agreement': {
    title: 'Client Service Agreement',
    sections: [
      {
        heading: '1. Parties',
        content: [
          'This Client Service Agreement is entered into on [DATE] between:',
          'Service Provider: [YOUR BUSINESS NAME]',
          'Client: [CLIENT NAME]',
        ],
      },
      {
        heading: '2. Services Provided',
        content: [
          'Service Provider agrees to provide:',
          '- [DESCRIBE SERVICES]',
          '- Service Period: [START DATE] to [END DATE]',
          '- Service Location: [LOCATION]',
        ],
      },
      {
        heading: '3. Fees and Payment',
        content: [
          'Service Fee: $[AMOUNT]',
          'Payment Schedule: [ONE-TIME / MONTHLY / PER SERVICE]',
          'Payment Method: [CHECK / BANK TRANSFER / CREDIT CARD]',
          'Late payments incur [PERCENT]% monthly interest.',
        ],
      },
      {
        heading: '4. Client Obligations',
        content: [
          'Client agrees to:',
          '- Provide necessary information and access',
          '- Make timely payments',
          '- Cooperate with service delivery',
        ],
      },
      {
        heading: '5. Limitation of Liability',
        content: [
          'Service Provider liability limited to fees paid.',
          'Not liable for indirect or consequential damages.',
        ],
      },
      {
        heading: '6. Signatures',
        content: [
          'Service Provider Signature: ____________________________   Date: ___________',
          'Client Signature: _________________________   Date: ___________',
        ],
      },
    ],
  },

  'nda': {
    title: 'Non-Disclosure Agreement (NDA)',
    sections: [
      {
        heading: '1. Parties',
        content: [
          'This Non-Disclosure Agreement is entered into on [DATE] between:',
          'Disclosing Party: [PARTY NAME]',
          'Receiving Party: [PARTY NAME]',
        ],
      },
      {
        heading: '2. Definition of Confidential Information',
        content: [
          'Confidential Information includes:',
          '- Business plans, strategies, and financial information',
          '- Customer lists and data',
          '- Proprietary technology and processes',
          '- Any information marked as confidential',
        ],
      },
      {
        heading: '3. Obligations',
        content: [
          'Receiving Party agrees to:',
          '- Keep all Confidential Information strictly confidential',
          '- Use information solely for [PURPOSE]',
          '- Not disclose to third parties without written consent',
          '- Return or destroy all Confidential Information upon request',
        ],
      },
      {
        heading: '4. Exceptions',
        content: [
          'Confidential Information does not include:',
          '- Information already publicly known',
          '- Information independently developed',
          '- Information received from third parties without restriction',
        ],
      },
      {
        heading: '5. Term',
        content: [
          'This agreement remains in effect for [NUMBER] years from the date of signing.',
          'Confidentiality obligations survive termination.',
        ],
      },
      {
        heading: '6. Signatures',
        content: [
          'Disclosing Party Signature: ____________________________   Date: ___________',
          'Receiving Party Signature: _________________________   Date: ___________',
        ],
      },
    ],
  },

  'maintenance-agreement': {
    title: 'Maintenance Service Agreement',
    sections: [
      {
        heading: '1. Parties',
        content: [
          'This Maintenance Service Agreement is entered into on [DATE] between:',
          'Service Provider: [YOUR NAME/BUSINESS]',
          'Client: [CLIENT NAME]',
        ],
      },
      {
        heading: '2. Maintenance Services',
        content: [
          'Service Provider agrees to provide ongoing maintenance:',
          '- Service Type: [EQUIPMENT / SOFTWARE / FACILITY / WEBSITE]',
          '- Service Schedule: [WEEKLY / MONTHLY / QUARTERLY / AS NEEDED]',
          '- Service Location: [LOCATION]',
          '- Term: [START DATE] to [END DATE]',
        ],
      },
      {
        heading: '3. Fees',
        content: [
          'Monthly Fee: $[AMOUNT]',
          'OR Annual Fee: $[AMOUNT]',
          'Additional Services: $[RATE]/hour',
          'Payment due by [DAY] of each month.',
        ],
      },
      {
        heading: '4. Service Response Times',
        content: [
          'Emergency: [NUMBER] hours',
          'Urgent: [NUMBER] hours',
          'Routine: [NUMBER] business days',
        ],
      },
      {
        heading: '5. Renewal and Termination',
        content: [
          'Agreement auto-renews unless terminated with [NUMBER] days notice.',
          'Either party may terminate with written notice.',
        ],
      },
      {
        heading: '6. Signatures',
        content: [
          'Service Provider Signature: ____________________________   Date: ___________',
          'Client Signature: _________________________   Date: ___________',
        ],
      },
    ],
  },

  'agency-retainer': {
    title: 'Agency Retainer Agreement',
    sections: [
      {
        heading: '1. Parties',
        content: [
          'This Agency Retainer Agreement is entered into on [DATE] between:',
          'Agency: [AGENCY NAME]',
          'Client: [CLIENT NAME]',
        ],
      },
      {
        heading: '2. Retainer Services',
        content: [
          'Agency agrees to provide ongoing services:',
          '- Service Scope: [MARKETING / DESIGN / DEVELOPMENT / CONSULTING]',
          '- Monthly Retainer: $[AMOUNT]',
          '- Included Hours: [NUMBER] hours per month',
          '- Additional Hours: $[RATE]/hour',
        ],
      },
      {
        heading: '3. Payment Terms',
        content: [
          'Monthly retainer due on [DAY] of each month.',
          'Additional services billed separately.',
          'Invoices due within [NUMBER] days.',
        ],
      },
      {
        heading: '4. Scope of Work',
        content: [
          'Services included in retainer:',
          '- [LIST SERVICES]',
          '',
          'Services not included (billed separately):',
          '- [LIST EXCLUDED SERVICES]',
        ],
      },
      {
        heading: '5. Reporting',
        content: [
          'Agency will provide monthly reports detailing:',
          '- Hours used and remaining',
          '- Work completed',
          '- Upcoming deliverables',
        ],
      },
      {
        heading: '6. Term and Termination',
        content: [
          'Initial term: [NUMBER] months',
          'Auto-renews monthly unless terminated with [NUMBER] days notice.',
        ],
      },
      {
        heading: '7. Signatures',
        content: [
          'Agency Signature: ____________________________   Date: ___________',
          'Client Signature: _________________________   Date: ___________',
        ],
      },
    ],
  },

  'agency-project': {
    title: 'Agency Project Agreement',
    sections: [
      {
        heading: '1. Parties',
        content: [
          'This Agency Project Agreement is entered into on [DATE] between:',
          'Agency: [AGENCY NAME]',
          'Client: [CLIENT NAME]',
        ],
      },
      {
        heading: '2. Project Scope',
        content: [
          'Agency agrees to deliver the following project:',
          '- Project Name: [PROJECT NAME]',
          '- Deliverables: [LIST DELIVERABLES]',
          '- Timeline: [START DATE] to [END DATE]',
          '- Budget: $[AMOUNT]',
        ],
      },
      {
        heading: '3. Payment Schedule',
        content: [
          'Payment Milestones:',
          '- 50% upon signing: $[AMOUNT]',
          '- 25% at midpoint: $[AMOUNT]',
          '- 25% upon final delivery: $[AMOUNT]',
        ],
      },
      {
        heading: '4. Project Phases',
        content: [
          'Phase 1: [DESCRIPTION] - Due [DATE]',
          'Phase 2: [DESCRIPTION] - Due [DATE]',
          'Phase 3: [DESCRIPTION] - Due [DATE]',
        ],
      },
      {
        heading: '5. Revisions and Changes',
        content: [
          'Client is entitled to [NUMBER] revision rounds per phase.',
          'Scope changes require written change order and may affect timeline/cost.',
        ],
      },
      {
        heading: '6. Signatures',
        content: [
          'Agency Signature: ____________________________   Date: ___________',
          'Client Signature: _________________________   Date: ___________',
        ],
      },
    ],
  },

  'agency-client': {
    title: 'Agency-Client Service Agreement',
    sections: [
      {
        heading: '1. Parties',
        content: [
          'This Agency-Client Service Agreement is entered into on [DATE] between:',
          'Agency: [AGENCY NAME]',
          'Client: [CLIENT NAME]',
        ],
      },
      {
        heading: '2. Services',
        content: [
          'Agency will provide comprehensive services:',
          '- [SERVICE TYPE 1]',
          '- [SERVICE TYPE 2]',
          '- [SERVICE TYPE 3]',
          '- Service Period: [START DATE] to [END DATE]',
        ],
      },
      {
        heading: '3. Compensation',
        content: [
          'Payment Structure: [RETAINER / PROJECT-BASED / HOURLY]',
          'Monthly/Project Fee: $[AMOUNT]',
          'Additional Services: $[RATE]/hour',
          'Payment Terms: [NET 15 / NET 30]',
        ],
      },
      {
        heading: '4. Agency Responsibilities',
        content: [
          'Agency will:',
          '- Assign dedicated team members',
          '- Provide regular progress updates',
          '- Deliver work on time and to agreed standards',
          '- Maintain confidentiality',
        ],
      },
      {
        heading: '5. Client Responsibilities',
        content: [
          'Client will:',
          '- Provide timely feedback and approvals',
          '- Supply necessary materials and information',
          '- Make payments as agreed',
        ],
      },
      {
        heading: '6. Intellectual Property',
        content: [
          'Upon full payment, Client owns all final deliverables.',
          'Agency retains right to showcase work in portfolio.',
        ],
      },
      {
        heading: '7. Signatures',
        content: [
          'Agency Signature: ____________________________   Date: ___________',
          'Client Signature: _________________________   Date: ___________',
        ],
      },
    ],
  },
}



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const templateId = id
    const template = templateContent[templateId]

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // Create document sections
    const children: any[] = [
      new Paragraph({
        text: template.title,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
    ]

    // Add each section
    template.sections.forEach((section: any) => {
      children.push(
        new Paragraph({
          text: section.heading,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 300, after: 200 },
        })
      )

      section.content.forEach((line: string) => {
        if (line.trim() === '') {
          children.push(new Paragraph({ text: '' }))
        } else {
          children.push(
            new Paragraph({
              text: line,
              spacing: { after: 100 },
            })
          )
        }
      })
    })

    // Create the document
    const doc = new Document({
      sections: [
        {
          children,
        },
      ],
    })

    // Generate the document as a buffer
    const buffer = await Packer.toBuffer(doc)

    // Return as downloadable file
    return new NextResponse(buffer as any, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${template.title.replace(/\s+/g, '-')}.docx"`,
      },
    })
  } catch (error: any) {
    console.error('Template generation error:', error)
    return NextResponse.json({ error: 'Failed to generate template' }, { status: 500 })
  }
}

