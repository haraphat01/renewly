import OpenAI from 'openai'
import { z } from 'zod'

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured')
  }
  return new OpenAI({
    apiKey,
  })
}

const ContractSchema = z.object({
  client_name: z.string().describe('The name of the client or company'),
  contract_title: z.string().optional().nullable().describe('Title or description of the contract'),
  start_date: z.string().describe('Contract start date in YYYY-MM-DD format'),
  end_date: z.string().describe('Contract end date in YYYY-MM-DD format'),
  renewal_date: z.string().optional().nullable().describe('Contract renewal date in YYYY-MM-DD format if mentioned'),
  rate: z.number().optional().describe('The rate or amount (numeric value only). Use 0 if not specified.'),
  rate_currency: z.string().default('USD').describe('Currency code (USD, EUR, GBP, etc.)'),
  payment_terms: z.string().optional().nullable().describe('Payment terms (e.g., Net 30, Due on receipt)'),
  payment_frequency: z.enum(['one-time', 'monthly', 'quarterly', 'yearly']).default('monthly').describe('How often payment is made'),
  notes: z.string().optional().nullable().describe('Any additional important notes from the contract'),
})

export type ExtractedContractData = z.infer<typeof ContractSchema>

export async function extractContractData(text: string): Promise<ExtractedContractData> {
  const systemPrompt = `You are an expert at extracting contract information from text. Extract the following information:
- Client name
- Contract title/description
- Start date (format as YYYY-MM-DD)
- End date (format as YYYY-MM-DD)
- Renewal date if mentioned (format as YYYY-MM-DD)
- Rate/amount (numeric value only)
- Currency (default to USD if not specified)
- Payment terms
- Payment frequency (one-time, monthly, quarterly, yearly)
- Any important notes

If a date is not explicitly stated, use reasonable defaults or return null. For rates, extract the numeric value only. If no rate is found, use 0. Return the data as JSON matching this schema. Always return valid JSON with all required fields.`

  try {
    const openai = getOpenAI()
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Extract contract information from this text:\n\n${text}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from OpenAI')
    }

    const parsed = JSON.parse(content)
    
    // Handle null/undefined values before parsing
    const cleaned = {
      ...parsed,
      renewal_date: parsed.renewal_date || null,
      rate: parsed.rate !== undefined && parsed.rate !== null ? Number(parsed.rate) : 0,
      contract_title: parsed.contract_title || null,
      payment_terms: parsed.payment_terms || null,
      notes: parsed.notes || null,
    }
    
    const result = ContractSchema.parse(cleaned)
    
    // Ensure rate is always a number
    if (result.rate === undefined || result.rate === null) {
      result.rate = 0
    }
    
    return result
  } catch (error) {
    console.error('Error extracting contract data:', error)
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError<any>
      const errorMessages = zodError.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      console.error('Validation errors:', JSON.stringify(zodError.issues, null, 2))
      throw new Error(`Failed to extract contract data: ${errorMessages}`)
    }
    throw new Error('Failed to extract contract data')
  }
}

// Setup DOMMatrix polyfill once at module level
if (typeof globalThis.DOMMatrix === 'undefined') {
  class DOMMatrixPolyfill {
    a: number = 1
    b: number = 0
    c: number = 0
    d: number = 1
    e: number = 0
    f: number = 0
    m11: number = 1
    m12: number = 0
    m21: number = 0
    m22: number = 1
    m41: number = 0
    m42: number = 0
    
    constructor(init?: string | number[]) {
      if (init) {
        if (typeof init === 'string') {
          const values = init.match(/[\d.-]+/g)?.map(Number) || []
          if (values.length >= 6) {
            this.a = this.m11 = values[0]
            this.b = this.m12 = values[1]
            this.c = this.m21 = values[2]
            this.d = this.m22 = values[3]
            this.e = this.m41 = values[4]
            this.f = this.m42 = values[5]
          }
        } else if (Array.isArray(init) && init.length >= 6) {
          this.a = this.m11 = init[0]
          this.b = this.m12 = init[1]
          this.c = this.m21 = init[2]
          this.d = this.m22 = init[3]
          this.e = this.m41 = init[4]
          this.f = this.m42 = init[5]
        }
      }
    }
    
    multiply(other: DOMMatrixPolyfill): DOMMatrixPolyfill {
      const result = new DOMMatrixPolyfill()
      result.a = result.m11 = this.a * other.a + this.c * other.b
      result.b = result.m12 = this.b * other.a + this.d * other.b
      result.c = result.m21 = this.a * other.c + this.c * other.d
      result.d = result.m22 = this.b * other.c + this.d * other.d
      result.e = result.m41 = this.a * other.e + this.c * other.f + this.e
      result.f = result.m42 = this.b * other.e + this.d * other.f + this.f
      return result
    }
    
    translate(x: number, y: number): DOMMatrixPolyfill {
      return this.multiply(new DOMMatrixPolyfill([1, 0, 0, 1, x, y]))
    }
    
    scale(x: number, y?: number): DOMMatrixPolyfill {
      return this.multiply(new DOMMatrixPolyfill([x, 0, 0, y ?? x, 0, 0]))
    }
  }
  
  // @ts-ignore
  globalThis.DOMMatrix = DOMMatrixPolyfill
  // @ts-ignore
  globalThis.DOMMatrixReadOnly = DOMMatrixPolyfill
}

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // Use pdf-parse v2 API
  const { PDFParse } = require('pdf-parse')
  
  // Ensure buffer is a Buffer instance
  const pdfBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer)
  
  // Create parser instance
  const parser = new PDFParse({ data: pdfBuffer })
  
  try {
    // Extract text using getText() method
    const result = await parser.getText()
    return result.text || ''
  } catch (error: any) {
    console.error('Error in extractTextFromPDF:', error)
    throw new Error(`Failed to extract text from PDF: ${error.message || error}`)
  } finally {
    // Always destroy the parser to free memory
    await parser.destroy()
  }
}

export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  const mammoth = require('mammoth')
  const result = await mammoth.extractRawText({ buffer })
  return result.value
}

