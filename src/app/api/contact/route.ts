import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    const formData = await request.formData()
    const data: Record<string, string> = {}
    formData.forEach((value, key) => { data[key] = value as string })
    data["access_key"] = process.env.WEB3FORMS_ACCESS_KEY ?? ""

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })

        const result = await response.json()

        if (result.success) {
            return NextResponse.json({ success: true })
        } else {
            console.error("Web3Forms error:", result)
            return NextResponse.json({ success: false }, { status: 400 })
        }
    } catch (error) {
        console.error("Contact API error:", error)
        return NextResponse.json({ success: false }, { status: 500 })
    }
}
