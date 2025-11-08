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

