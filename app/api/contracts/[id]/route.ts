import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAuth, getOrCreateUserProfile } from '@/lib/supabase/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await requireAuth()
    const { id } = await params
    const supabase = await createClient()

    // Get or create user profile
    const user = await getOrCreateUserProfile(
      authUser.id,
      authUser.email || '',
      authUser.user_metadata?.full_name
    )

    // Get contract to verify ownership and get file URL
    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (contractError || !contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
    }

    // Delete associated reminders first (cascade should handle this, but being explicit)
    await supabase
      .from('reminders')
      .delete()
      .eq('contract_id', id)

    // Delete contract file from storage if it exists
    if (contract.file_url) {
      try {
        // Extract file path from URL
        const urlParts = contract.file_url.split('/')
        const fileName = urlParts[urlParts.length - 1]
        const filePath = `${user.id}/${fileName}`

        const adminClient = createAdminClient()
        await adminClient.storage
          .from('contracts')
          .remove([filePath])
      } catch (storageError) {
        // Log but don't fail if file deletion fails
        console.error('Error deleting contract file from storage:', storageError)
      }
    }

    // Delete contract
    const { error: deleteError } = await supabase
      .from('contracts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Contract deletion error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete contract' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Contract deletion error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

