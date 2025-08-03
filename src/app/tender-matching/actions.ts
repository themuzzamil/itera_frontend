"use server"

export async function uploadTenderAction(file: File) {
  const formData = new FormData()
  formData.append("file", file)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  const res = await fetch(`${apiUrl}/upload-tender`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    return { status: "error" }
  }
  return await res.json()
}
