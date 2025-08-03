"use client"

import type React from "react"
import type { ReactElement } from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, CheckCircle, AlertCircle, Brain, Download, Loader2, Layout } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, GraduationCap, Briefcase, Globe, Award } from "lucide-react"
import Docxtemplater from "docxtemplater"
import PizZip from "pizzip"
import { europassParseAction } from "./actions"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  result?: EuropassResult
}

interface EuropassResult {
  parsed: {
    proposed_role: string
    family_name: string
    first_name: string
    date_of_birth: string | null
    nationality: string
    civil_status: string | null
    residence_city: string
    education: Array<{
      institution: string
      from_date: string
      to_date: string
      diploma: string
    }>
    training: Array<any>
    language_skills: Array<{
      language: string
      reading: number
      speaking: number
      writing: number
    }>
    membership_professional_bodies: string
    other_skills: string
    present_position: string
    years_within_firm: string | null
    specific_experience_in_region: Array<{
      country: string
      from_date: string
      to_date: string
    }>
    professional_experience: Array<{
      from_date: string
      to_date: string
      location: string
      company_reference_person: string
      position: string
      description: string
    }>
    publications: string
    signature_name: string | null
    signature_date: string | null
  }
}

interface EuropassProfileProps {
  result: EuropassResult
  fileName: string
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Not specified"
  // If it's already a full ISO date
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(dateStr).toLocaleDateString()
  }
  // If it's partial, just return as-is (e.g., "2016", "2020-07", "present")
  return dateStr
}

function getLanguageLevel(level: number) {
  const levels = ["Beginner", "Elementary", "Intermediate", "Advanced", "Proficient"]
  return levels[level] || "Unknown"
}

function EuropassProfile({ result, fileName }: EuropassProfileProps) {
  const { parsed } = result
  return (
    <div className="overflow-y-auto max-h-[70vh]">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-full bg-primary/5 mb-6">
          <TabsTrigger
            value="personal"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs md:text-sm"
          >
            <User className="w-3 h-3 md:w-4 md:h-4" /> Personal
          </TabsTrigger>
          <TabsTrigger
            value="education"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs md:text-sm"
          >
            <GraduationCap className="w-3 h-3 md:w-4 md:h-4" /> Education
          </TabsTrigger>
          <TabsTrigger
            value="experience"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs md:text-sm"
          >
            <Briefcase className="w-3 h-3 md:w-4 md:h-4" /> Experience
          </TabsTrigger>
          <TabsTrigger
            value="languages"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs md:text-sm"
          >
            <Globe className="w-3 h-3 md:w-4 md:h-4" /> Languages
          </TabsTrigger>
          <TabsTrigger
            value="skills"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs md:text-sm"
          >
            <Award className="w-3 h-3 md:w-4 md:h-4" /> Skills
          </TabsTrigger>
        </TabsList>
        <TabsContent value="personal" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DataField label="First Name" value={parsed.first_name} />
            <DataField label="Family Name" value={parsed.family_name} />
            <DataField label="Proposed Role" value={parsed.proposed_role} />
            <DataField label="Date of Birth" value={formatDate(parsed.date_of_birth)} />
            <DataField label="Nationality" value={parsed.nationality} />
            <DataField label="Civil Status" value={parsed.civil_status || "Not specified"} />
            <DataField label="Residence City" value={parsed.residence_city} />
            <DataField label="Present Position" value={parsed.present_position} />
          </div>
        </TabsContent>
        <TabsContent value="education" className="space-y-4">
          <div>
            <label className="text-sm font-medium text-primary-700 mb-2 block">Academic Qualifications</label>
            {parsed.education.length > 0 ? (
              <div className="space-y-4">
                {parsed.education.map((edu, index) => (
                  <div key={index} className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <h4 className="font-semibold text-primary-900 mb-2">{edu.diploma}</h4>
                    <p className="text-primary-800 mb-2">{edu.institution}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-primary-700">
                        {formatDate(edu.from_date)} - {formatDate(edu.to_date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <span className="text-primary-400 italic">No education information available</span>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="experience" className="space-y-4">
          <div>
            <label className="text-sm font-medium text-primary-700 mb-2 block">Professional Experience</label>
            {parsed.professional_experience.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {parsed.professional_experience.map((exp, index) => (
                  <div key={index} className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-primary-900">{exp.position}</h4>
                      <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                        {formatDate(exp.from_date)} - {formatDate(exp.to_date)}
                      </Badge>
                    </div>
                    <p className="text-primary-800 mb-2">{exp.location}</p>
                    <p className="text-primary-700 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <span className="text-primary-400 italic">No professional experience available</span>
              </div>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-primary-700 mb-2 block">Regional Experience</label>
            {parsed.specific_experience_in_region.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {parsed.specific_experience_in_region.map((region, index) => (
                  <div key={index} className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                    <div className="font-medium text-primary-900">{region.country}</div>
                    <div className="text-sm text-primary-700">
                      {formatDate(region.from_date)} - {formatDate(region.to_date)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <span className="text-primary-400 italic">No regional experience specified</span>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="languages" className="space-y-4">
          <div>
            <label className="text-sm font-medium text-primary-700 mb-2 block">Language Skills</label>
            {parsed.language_skills.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parsed.language_skills.map((lang, index) => (
                  <div key={index} className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <h4 className="font-semibold text-primary-900 mb-3">{lang.language}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-primary-800">Reading:</span>
                        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                          {getLanguageLevel(lang.reading)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-primary-800">Speaking:</span>
                        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                          {getLanguageLevel(lang.speaking)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-primary-800">Writing:</span>
                        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                          {getLanguageLevel(lang.writing)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <span className="text-primary-400 italic">No language skills specified</span>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="skills" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <DataField label="Professional Bodies Membership" value={parsed.membership_professional_bodies} />
            <DataField label="Other Skills" value={parsed.other_skills} />
            <DataField label="Publications" value={parsed.publications} />
            <DataField label="Years Within Firm" value={parsed.years_within_firm || "Not specified"} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface DataFieldProps {
  label: string
  value: string
}

function DataField({ label, value }: DataFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-primary-700">{label}</label>
      <div className="bg-primary/5 rounded-lg p-3 border border-primary/20 min-h-[48px] flex items-center">
        <span className="text-primary-900 flex-1 text-sm md:text-base">
          {value || <span className="text-primary-400 italic">Not specified</span>}
        </span>
      </div>
    </div>
  )
}

export default function EuropassFormattingPage(): ReactElement {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const showToast = (message: string) => {
    setToastMessage(message)
    setToastVisible(true)
    setTimeout(() => {
      setToastVisible(false)
    }, 4000)
  }

  const downloadEuropassCVWithTemplate = async (file: UploadedFile) => {
    if (!file.result) return
    try {
      // Use the .docx template from the public folder
      const response = await fetch("/EU_Template_Docxtemplater.docx")
      if (!response.ok) {
        throw new Error(`Template file not found: ${response.status}`)
      }
      const contentType = response.headers.get("content-type")
      if (
        !contentType ||
        !contentType.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document")
      ) {
        throw new Error("Template file is not a valid .docx file")
      }
      const templateBuffer = await response.arrayBuffer()

      const zip = new PizZip(templateBuffer)
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      })

      const { parsed } = file.result

      const templateData = {
        proposed_role: parsed.proposed_role || "",
        family_name: parsed.family_name || "",
        first_name: parsed.first_name || "",
        date_of_birth: parsed.date_of_birth || "",
        nationality: parsed.nationality || "",
        civil_status: parsed.civil_status || "",
        residence_city: parsed.residence_city || "",
        education: parsed.education.map((edu) => ({
          period: `${formatDate(edu.from_date)} - ${formatDate(edu.to_date)}`,
          institution: edu.institution,
          diploma: edu.diploma,
        })),
        training:
          parsed.training.length > 0
            ? parsed.training.map((train: any) => ({
                period: train.period || "",
                topic: train.topic || "",
                provider: train.provider || "",
              }))
            : [
                {
                  period: "N/A",
                  topic: "No training data available",
                  provider: "",
                },
              ],
        languages: parsed.language_skills.map((lang) => ({
          language: lang.language,
          read: lang.reading.toString(),
          speak: lang.speaking.toString(),
          write: lang.writing.toString(),
        })),
        membership_professional_bodies: parsed.membership_professional_bodies || "N/A",
        other_skills: parsed.other_skills || "N/A",
        present_position: parsed.present_position || "",
        years_within_firm: parsed.years_within_firm || "N/A",
        region_experience: parsed.specific_experience_in_region.map((region) => ({
          country: region.country,
          period: `${formatDate(region.from_date)} - ${formatDate(region.to_date)}`,
        })),
        professional_experience: parsed.professional_experience.map((exp) => ({
          period: `${formatDate(exp.from_date)} - ${formatDate(exp.to_date)}`,
          location: exp.location,
          company: exp.company_reference_person || "N/A",
          position: exp.position,
          description: exp.description,
        })),
        publications: parsed.publications || "N/A",
        signature_name: parsed.signature_name || `${parsed.first_name} ${parsed.family_name}`,
        signature_date: parsed.signature_date || new Date().toLocaleDateString(),
      }

      doc.render(templateData)

      const output = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })

      const url = URL.createObjectURL(output)
      const a = document.createElement("a")
      a.href = url
      a.download = `Europass_CV_${parsed.first_name}_${parsed.family_name}.docx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showToast("Europass CV downloaded successfully!")
    } catch (error) {
      console.error("Error generating document:", error)
      showToast(`Error generating document: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    handleFileUpload(files)
  }, [])

  const handleFileUpload = (files: File[]) => {
    const maxSize = 4.5 * 1024 * 1024; // 4.5MB in bytes
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        showToast(`File "${file.name}" is too large. Please upload files less than or equal to 4.5MB.`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    const newFiles: UploadedFile[] = validFiles.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
    }))
    setUploadedFiles((prev) => [...prev, ...newFiles])

    // Simulate upload progress
    newFiles.forEach((file, index) => {
      setTimeout(() => {
        const interval = setInterval(() => {
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === file.id ? { ...f, progress: Math.min(f.progress + 10, 100) } : f)),
          )
        }, 200)
        setTimeout(() => {
          clearInterval(interval)
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === file.id ? { ...f, status: "completed", progress: 100 } : f)),
          )
        }, 2000)
      }, index * 500)
    })
  }

  const handleProcessFiles = async () => {
    const completedFiles = uploadedFiles.filter((f) => f.status === "completed" && !f.result)
    if (completedFiles.length === 0) return

    setIsProcessing(true)
    showToast(
      `Processing ${completedFiles.length} CV${completedFiles.length > 1 ? "s" : ""} for Europass formatting...`,
    )

    // Find actual File objects from input element
    const inputFiles = Array.from((document.getElementById("file-input") as HTMLInputElement)?.files || [])
    const filesForApi = completedFiles
      .map((f) => inputFiles.find((file) => file.name === f.name))
      .filter(Boolean) as File[]

    // Process each file sequentially and update UI as soon as result arrives
    for (let i = 0; i < filesForApi.length; i++) {
      const file = filesForApi[i]

      // Set file to processing
      setUploadedFiles((prev) =>
        prev.map((f) => (f.name === file.name ? { ...f, status: "processing", progress: 10 } : f)),
      )

      // Call backend for this file
      const response = await europassParseAction([file])

      // If processed, update file
      if (response.processed && response.processed.length > 0) {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.name === file.name
              ? {
                  ...f,
                  status: "completed",
                  progress: 100,
                  result: { parsed: response.processed[0].parsed },
                }
              : f,
          ),
        )
      }

      // If error, update file
      if (response.errors && response.errors.length > 0) {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.name === file.name
              ? {
                  ...f,
                  status: "error",
                  progress: 100,
                  result: undefined,
                  error: response.errors[0].error,
                }
              : f,
          ),
        )
      }
    }

    setIsProcessing(false)
    showToast("Europass formatting completed!")
  }

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uploading":
        return "text-blue-500"
      case "processing":
        return "text-yellow-500"
      case "completed":
        return "text-accent"
      case "error":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading":
        return Upload
      case "processing":
        return Brain
      case "completed":
        return CheckCircle
      case "error":
        return AlertCircle
      default:
        return FileText
    }
  }

  const completedFiles = uploadedFiles.filter((f) => f.status === "completed" && !f.result)
  const processedFiles = uploadedFiles.filter((f) => f.result)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="pt-24 pb-12 px-4 md:px-16">
        <div className="mx-auto px-4 md:px-16 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Europass CV Formatting</h1>
            <p className="text-lg md:text-xl text-primary-700 max-w-3xl mx-auto leading-relaxed">
              Upload CVs in PDF or Word format and convert them to standardized Europass format with AI precision
            </p>
          </div>

          <div className="space-y-6">
            {/* Upload Area */}
            <Card className="bg-primary/5 border-primary/20 shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary text-lg md:text-xl">
                  <Upload className="w-6 h-6 text-primary" />
                  Upload CVs for Europass Formatting
                </CardTitle>
                <CardDescription className="text-primary-700 text-sm md:text-base">
                  Drag and drop multiple CV files or click to browse. Supports PDF and Word documents.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 md:p-8">
                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 md:p-8 text-center transition-all duration-300 ${
                    isDragOver ? "border-primary bg-primary/5 scale-105" : "border-primary/30 hover:border-primary/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="space-y-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <Upload className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-base md:text-lg font-semibold text-primary-900 mb-2">
                        Drop your CV files here
                      </p>
                      <p className="text-sm md:text-base text-primary-700 mb-4">
                        or click to browse from your computer
                      </p>
                      <Button
                        className="bg-primary hover:bg-primary/90 text-white font-semibold text-sm md:text-base"
                        onClick={() => document.getElementById("file-input")?.click()}
                      >
                        Choose Files
                      </Button>
                      <input
                        id="file-input"
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => e.target.files && handleFileUpload(Array.from(e.target.files))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Process Button */}
            {completedFiles.length > 0 && (
              <div className="text-center py-4">
                <Button
                  onClick={handleProcessFiles}
                  disabled={isProcessing}
                  className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-4 text-base md:text-lg"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing {completedFiles.length} CV{completedFiles.length > 1 ? "s" : ""}...
                    </>
                  ) : (
                    <>
                      <Layout className="mr-2 h-5 w-5" />
                      Format {completedFiles.length} CV{completedFiles.length > 1 ? "s" : ""} to Europass
                    </>
                  )}
                </Button>
              </div>
            )}
            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <Card className="bg-primary/5 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-primary text-lg md:text-xl">
                    <FileText className="w-6 h-6 text-primary" />
                    Uploaded Files ({uploadedFiles.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {uploadedFiles.map((file) => {
                      const StatusIcon = getStatusIcon(file.status)
                      return (
                        <div key={file.id} className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-9 h-9 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                <StatusIcon
                                  className={`w-4 h-4 md:w-5 md:h-5 ${getStatusColor(file.status)} text-white`}
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-primary-900 truncate text-sm md:text-base max-w-[150px] sm:max-w-xs">
                                  {file.name}
                                </p>
                                <p className="text-xs md:text-sm text-primary-700">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Status and Actions Row */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-2">
                              {file.status === "completed" && file.result && (
                                <Badge className="bg-primary text-white border-primary/20 hover:bg-primary/90 text-xs md:text-sm">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Europass Ready
                                </Badge>
                              )}
                              {file.status === "completed" && !file.result && (
                                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-secondary/10 text-xs md:text-w">
                                  <CheckCircle className="w-3 h-3 mr-1 text-primary" />
                                  Ready to Process
                                </Badge>
                              )}
                              {file.status === "error" && (
                                <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-xs md:text-sm">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Error
                                </Badge>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {file.status === "completed" && file.result && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-primary/20 text-primary hover:bg-primary/10 bg-white h-8 px-3 md:h-9 md:px-4 text-xs md:text-sm"
                                    >
                                      Preview
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white border-gray-200 text-gray-900 p-4 md:p-6">
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center gap-3 text-primary text-lg md:text-xl">
                                        <Layout className="w-6 h-6 text-primary" />
                                        Europass CV Preview - {file.name}
                                      </DialogTitle>
                                      <DialogDescription className="text-primary-700 text-sm md:text-base">
                                        Formatted CV data in Europass standard • Ready for download
                                      </DialogDescription>
                                    </DialogHeader>
                                    <EuropassProfile result={file.result} fileName={file.name} />
                                  </DialogContent>
                                </Dialog>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-primary/20 text-primary hover:bg-primary/10 bg-white h-8 px-3 md:h-9 md:px-4 text-xs md:text-sm"
                                onClick={() => downloadEuropassCVWithTemplate(file)}
                              >
                                Download
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-primary/20 text-primary hover:bg-primary/10 bg-white h-8 px-3 md:h-9 md:px-4 text-xs md:text-sm"
                                onClick={() => removeFile(file.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                          {file.status !== "completed" && (
                            <div className="space-y-2 mt-3">
                              <div className="flex justify-between text-sm">
                                <span className={`capitalize ${getStatusColor(file.status)}`}>{file.status}...</span>
                                <span className="text-primary-700">{file.progress}%</span>
                              </div>
                              <Progress value={file.progress} className="h-2" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Processing Summary */}
            {processedFiles.length > 0 && (
              <Card className="bg-primary/5 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-primary text-lg md:text-xl">
                    <CheckCircle className="w-6 h-6 text-accent" />
                    Processing Complete
                  </CardTitle>
                  <CardDescription className="text-primary-700 text-sm md:text-base">
                    {processedFiles.length} CV{processedFiles.length > 1 ? "s" : ""} successfully formatted to Europass
                    standard
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-primary-800 text-center sm:text-left flex-1">
                      <p className="font-medium text-sm md:text-base">Ready for download and use in your proposals</p>
                      <p className="text-sm text-primary-700">All CVs are now in standardized Europass format</p>
                    </div>
                    <Button
                      className="bg-primary hover:bg-primary/90 text-white font-semibold text-sm md:text-base px-6 py-3"
                      onClick={() => {
                        processedFiles.forEach((file) => downloadEuropassCVWithTemplate(file))
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      {/* Custom Toast */}
      {toastVisible && (
        <div className="fixed bottom-4 left-4 z-50 animate-slide-in-left">
          <div className="bg-primary text-white rounded-lg p-4 shadow-lg max-w-sm">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-white flex-shrink-0" />
              <span className="text-white font-medium">{toastMessage}</span>
              <button
                onClick={() => setToastVisible(false)}
                className="ml-auto text-white/70 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
