import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAuth, getOrCreateUserProfile } from '@/lib/supabase/auth'
import { extractContractData, extractTextFromPDF, extractTextFromDOCX } from '@/lib/ai/extract-contract'
import { calculateContractStatus, shouldCreateReminders } from '@/lib/utils/contract-status'
import { canCreateContract } from '@/lib/utils/subscription'

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth()
    const supabase = await createClient()

    // Get or create user profile
    const user = await getOrCreateUserProfile(
      authUser.id,
      authUser.email || '',
      authUser.user_metadata?.full_name
    )

    // Check subscription limits
    const canCreate = await canCreateContract(user.id)
    if (!canCreate.allowed) {
      return NextResponse.json({ error: canCreate.reason }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const fileType = file.type
    const isPDF = fileType === 'application/pdf' || file.name.endsWith('.pdf')
    const isDOCX = fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')

    if (!isPDF && !isDOCX) {
      return NextResponse.json({ error: 'Invalid file type. Please upload a PDF or DOCX file.' }, { status: 400 })
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text
    let text: string
    if (isPDF) {
      text = await extractTextFromPDF(buffer)
    } else {
      text = await extractTextFromDOCX(buffer)
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Could not extract text from file' }, { status: 400 })
    }

    // Extract contract data using AI
    const extractedData = await extractContractData(text)

    // Upload file to Supabase Storage using admin client (bypasses RLS)
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}.${fileExt}`
    
    const adminClient = createAdminClient()
    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from('contracts')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file: ' + uploadError.message }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = adminClient.storage
      .from('contracts')
      .getPublicUrl(fileName)

    // Calculate status
    const status = calculateContractStatus(extractedData.end_date)

    // Create contract
    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .insert({
        user_id: user.id,
        client_name: extractedData.client_name,
        contract_title: extractedData.contract_title,
        start_date: extractedData.start_date,
        end_date: extractedData.end_date,
        renewal_date: extractedData.renewal_date || null,
        rate: extractedData.rate || 0,
        rate_currency: extractedData.rate_currency || 'USD',
        payment_terms: extractedData.payment_terms || null,
        payment_frequency: extractedData.payment_frequency,
        status,
        file_url: publicUrl,
        file_name: file.name,
        extracted_data: extractedData,
        notes: extractedData.notes || null,
      })
      .select()
      .single()

    if (contractError) {
      console.error('Contract creation error:', contractError)
      return NextResponse.json({ error: 'Failed to create contract' }, { status: 500 })
    }

    // Create reminders
    const reminders = shouldCreateReminders(extractedData.end_date, extractedData.renewal_date || undefined)
    if (reminders.renewal && reminders.dates.length > 0) {
      const reminderInserts = reminders.dates.map(date => ({
        contract_id: contract.id,
        user_id: user.id,
        reminder_type: 'renewal' as const,
        reminder_date: date.toISOString().split('T')[0],
      }))

      await supabase.from('reminders').insert(reminderInserts)
    }

    return NextResponse.json({ 
      success: true, 
      contract,
      extracted: extractedData,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

