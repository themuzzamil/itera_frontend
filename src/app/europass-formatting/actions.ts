"use server"

// This server action will wait indefinitely for a response from the API endpoint.
// The fetch API does not impose a timeout by default, but server/proxy timeouts may still occur.
export async function europassParseAction(files: File[]) {
  const formData = new FormData()
  files.forEach((file) => formData.append("files", file))

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    const res = await fetch(`${apiUrl}/europass-parse`, {
      method: "POST",
      body: formData,
    })

    if (!res.ok) {
      return { processed: [], errors: files.map((f) => ({ filename: f.name, error: "Upload failed" })) }
    }
    return await res.json()
  } catch (error: any) {
    // Catch network/server errors (like UND_ERR_HEADERS_TIMEOUT)
    return {
      processed: [],
      errors: files.map((f) => ({
        filename: f.name,
        error: error?.message || "Unknown error"
      }))
    }
  }
}
