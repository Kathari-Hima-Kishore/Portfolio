import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const formData = await request.formData()
    formData.append("access_key", process.env.WEB3FORMS_ACCESS_KEY ?? "")

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        })

        const data = await response.json()

        if (data.success) {
            return NextResponse.json({ success: true })
        } else {
            return NextResponse.json({ success: false }, { status: 400 })
        }
    } catch {
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
