declare module 'pdf-parse' {
  interface PDFInfo {
    [key: string]: any
  }

  interface PDFMetadata {
    [key: string]: any
  }

  interface PDFData {
    numpages: number
    numrender: number
    info: PDFInfo
    metadata: PDFMetadata | null
    text: string
    version: string
  }

  interface PDFParseOptions {
    pagerender?: (pageData: any) => string
    max?: number
  }

  function pdfParse(
    dataBuffer: Buffer,
    options?: PDFParseOptions
  ): Promise<PDFData>

  export = pdfParse
}
