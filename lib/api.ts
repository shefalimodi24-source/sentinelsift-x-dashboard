NEXT_PUBLIC_API_URL = https://sentinelsift-x-production.up.railway.app

export interface Finding {
    finding: string
    evidence: string[]
    sources: string[]
}

export interface Benchmark {
    precision: number
    recall: number
    detection_rate: number
}

export interface InvestigationData {
    findings: Finding[]
    tools: string[]
    evidence: string[]
    reasoning_log: string[]
    benchmark: Benchmark
}

export async function getInvestigationData(): Promise<InvestigationData> {
    const response = await fetch(`${API_URL}/latest`)

    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
    }

    return response.json()
}

export async function uploadInvestigation(file: File) {
    const formData = new FormData()

    formData.append("file", file)

    const response = await fetch(
        `${API_URL}/analyze`,
        {
            method: "POST",
            body: formData,
        }
    )

    if (!response.ok) {
        throw new Error("Upload failed")
    }

    return response.json()
}
