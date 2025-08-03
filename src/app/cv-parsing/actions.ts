"use server"

// Upload a single CV file and return its result
export async function uploadSingleCVAction(file: File) {
  const formData = new FormData()
  formData.append("files", file)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  const res = await fetch(`${apiUrl}/upload-multiple-cvs`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    return { processed: [], errors: [{ filename: file.name, error: "Upload failed" }] }
  }
  return await res.json()
}
