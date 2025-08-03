"use server"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function profileExpertStep1(cvFile: File, tenderFile: File) {
  const formData = new FormData()
  formData.append("cv", cvFile)
  formData.append("tender", tenderFile)

  const response = await fetch(`${API_URL}/profile-expert/step1`, {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to process step 1")
  }

  return await response.json()
}

export async function profileExpertStep2(cvAssignments: any, tenderAssignments: any) {
  const response = await fetch(`${API_URL}/profile-expert/step2`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cv_assignments: cvAssignments, tender_assignments: tenderAssignments }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to process step 2")
  }

  return await response.json()
}

export async function profileExpertStep3(selectedAssignments: any, cvText: string) {
  const response = await fetch(`${API_URL}/profile-expert/step3`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ selected_assignments: selectedAssignments, cv_text: cvText }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to process step 3")
  }

  return await response.json()
}

export async function profileExpertStep4(writeUp: any, cvText: string, tenderAssignments: any) {
  const response = await fetch(`${API_URL}/profile-expert/step4`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ write_up: writeUp, cv_text: cvText, tender_assignments: tenderAssignments }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to process step 4")
  }

  return await response.json()
}
