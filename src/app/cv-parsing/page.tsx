"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, Cloud, Trash2, CheckCircle, AlertCircle, Brain, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, User, Briefcase, Globe, GraduationCap, Building } from "lucide-react"
import { uploadSingleCVAction } from "./actions"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  extractedFields?: number
  parsedData?: any // Store parsed data for preview
  error?: string
}

function DataField({ label, value, copyable = false }: { label: string; value: string; copyable?: boolean }) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-primary-700">{label}</label>
      <div className="bg-primary/5 rounded-lg p-3 border border-primary/20 flex justify-between items-center min-h-[48px]">
        <span className="text-primary-900 flex-1 text-sm md:text-base">
          {value || <span className="text-primary-400 italic">Not specified</span>}
        </span>
        {copyable && value && (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 hover:bg-primary/10 ml-2 flex-shrink-0"
            onClick={() => copyToClipboard(value)}
          >
            <Copy className="w-3 h-3 text-primary-600" />
          </Button>
        )}
      </div>
    </div>
  )
}

function CVDataPreview({ parsed }: { parsed: any }) {
  // Defensive: fallback if parsed is missing
  if (!parsed) return <div className="text-primary-400">No data available.</div>

  // Normalize backend keys to expected frontend keys
  const normalized = {
    // Personal
    first_name: parsed.Name ? parsed.Name.split(" ")[0] : parsed.first_name || "",
    family_name: parsed.Name ? parsed.Name.split(" ").slice(1).join(" ") : parsed.family_name || "",
    gender: parsed.Gender || parsed.gender || "",
    date_of_birth: parsed.DOB || parsed.date_of_birth || "",
    residence_city: parsed.Location || parsed.residence_city || "",
    email: parsed.Email || parsed.email || "",
    phone: parsed.Phone || parsed.phone || "",
    social_media: parsed.SocialMedia || parsed.social_media || "",
    last_cv_update: parsed.LastCVUpdate || parsed.last_cv_update || "",
    // Professional
    years_of_experience: parsed.YearsOfExperience || parsed.years_of_experience || "",
    role_experience: parsed.RoleExperience || parsed.role_experience || [],
    // Geographic
    nationality: parsed.Nationalities ? parsed.Nationalities.join(", ") : parsed.nationality || "",
    language_skills: parsed.Languages
      ? parsed.Languages.map((lang: string) => {
          // Try to parse "Urdu (Excellent)" etc.
          const [language, levelRaw] = lang.split(" (")
          let level = "Intermediate"
          if (levelRaw) {
            if (levelRaw.toLowerCase().includes("excellent") || levelRaw.toLowerCase().includes("native"))
              level = "Native"
            else if (levelRaw.toLowerCase().includes("good") || levelRaw.toLowerCase().includes("fluent"))
              level = "Fluent"
          }
          return { language: language.trim(), level }
        })
      : parsed.language_skills || [],
    specific_experience_in_region: parsed.CountriesOfWork
      ? parsed.CountriesOfWork.map((country: string) => ({ country }))
      : parsed.specific_experience_in_region || [],
    // Experience
    clients_donors: parsed.ClientsOrDonors
      ? Array.isArray(parsed.ClientsOrDonors)
        ? parsed.ClientsOrDonors
        : String(parsed.ClientsOrDonors)
            .split(",")
            .map((c: string) => c.trim())
      : [],
    technical_sectors: parsed.TechnicalSectors
      ? Array.isArray(parsed.TechnicalSectors)
        ? parsed.TechnicalSectors
        : String(parsed.TechnicalSectors)
            .split(",")
            .map((c: string) => c.trim())
      : [],
    functional_areas: parsed.FunctionalAreas
      ? Array.isArray(parsed.FunctionalAreas)
        ? parsed.FunctionalAreas
        : String(parsed.FunctionalAreas)
            .split(",")
            .map((c: string) => c.trim())
      : [],
    // Education
    education: parsed.AcademicQualifications
      ? parsed.AcademicQualifications.map((q: string) => {
          // Try to parse "Degree, Institution, Year"
          const [degree, institution, year] = q.split(",").map((s) => s.trim())
          return { diploma: degree, institution, to_date: year }
        })
      : parsed.education || [],
  }

  // Map backend fields to UI fields
  const personal = {
    name: [normalized.first_name, normalized.family_name].filter(Boolean).join(" ") || "",
    gender: normalized.gender || "",
    dateOfBirth: normalized.date_of_birth || "",
    location: normalized.residence_city || "",
    email: normalized.email || "",
    phone: normalized.phone || "",
    socialMedia: normalized.social_media || "",
    lastUpdate: normalized.last_cv_update || "",
  }
  const professional = {
    yearsOfExperience: normalized.years_of_experience ? `${normalized.years_of_experience} years` : "",
    roleExperience: normalized.role_experience || [],
  }
  const geographic = {
    nationalities: normalized.nationality ? normalized.nationality.split(",").map((n: string) => n.trim()) : [],
    languages: Array.isArray(normalized.language_skills) ? normalized.language_skills : [],
    countriesOfWork: Array.isArray(normalized.specific_experience_in_region)
      ? normalized.specific_experience_in_region.map((r: any) => r.country)
      : [],
  }
  const experience = {
    clientsDonors: normalized.clients_donors
      ? Array.isArray(normalized.clients_donors)
        ? normalized.clients_donors
        : String(normalized.clients_donors)
            .split(",")
            .map((c: string) => c.trim())
      : [],
    technicalSectors: normalized.technical_sectors
      ? Array.isArray(normalized.technical_sectors)
        ? normalized.technical_sectors
        : String(normalized.technical_sectors)
            .split(",")
            .map((c: string) => c.trim())
      : [],
    functionalAreas: normalized.functional_areas
      ? Array.isArray(normalized.functional_areas)
        ? normalized.functional_areas
        : String(normalized.functional_areas)
            .split(",")
            .map((c: string) => c.trim())
      : [],
  }
  const education = {
    academicQualifications: Array.isArray(normalized.education)
      ? normalized.education.map((e: any) => ({
          degree: e.diploma,
          institution: e.institution,
          year: e.to_date ? String(e.to_date).slice(0, 4) : "",
        }))
      : [],
  }

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
            value="professional"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs md:text-sm"
          >
            <Briefcase className="w-3 h-3 md:w-4 md:h-4" /> Professional
          </TabsTrigger>
          <TabsTrigger
            value="geographic"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs md:text-sm"
          >
            <Globe className="w-3 h-3 md:w-4 md:h-4" /> Geographic
          </TabsTrigger>
          <TabsTrigger
            value="experience"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs md:text-sm"
          >
            <Building className="w-3 h-3 md:w-4 md:h-4" /> Experience
          </TabsTrigger>
          <TabsTrigger
            value="education"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs md:text-sm"
          >
            <GraduationCap className="w-3 h-3 md:w-4 md:h-4" /> Education
          </TabsTrigger>
        </TabsList>
        <TabsContent value="personal" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DataField label="Full Name" value={personal.name} />
            <DataField label="Gender" value={personal.gender} />
            <DataField label="Date of Birth" value={personal.dateOfBirth} />
            <DataField label="Location" value={personal.location} />
            <DataField label="Email" value={personal.email} copyable />
            <DataField label="Phone" value={personal.phone} copyable />
            <DataField label="Social Media" value={personal.socialMedia} copyable />
            <DataField label="Last CV Update" value={personal.lastUpdate} />
          </div>
        </TabsContent>
        <TabsContent value="professional" className="space-y-4">
          <DataField label="Years of Experience" value={professional.yearsOfExperience} />
          <div>
            <label className="text-sm font-medium text-primary-700 mb-2 block">Role Experience</label>
            <div className="space-y-2">
              {(professional.roleExperience || []).map((role: string, index: number) => (
                <div key={index} className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                  <span className="text-primary-900 text-sm md:text-base">{role}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="geographic" className="space-y-4">
          <div>
            <label className="text-sm font-medium text-primary-700 mb-2 block">Nationalities</label>
            <div className="flex flex-wrap gap-2">
              {(geographic.nationalities || []).map((nationality: string, index: number) => (
                <Badge key={index} className="bg-primary/10 text-primary border-primary/20 text-xs md:text-sm">
                  {nationality}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-primary-700 mb-2 block">Languages</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(geographic.languages || []).map((lang: any, index: number) => (
                <div
                  key={index}
                  className="bg-primary/5 rounded-lg p-3 border border-primary/20 flex justify-between items-center"
                >
                  <span className="text-primary-900 text-sm md:text-base">{lang.language}</span>
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10 text-xs md:text-sm">
                    {lang.level}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-primary-700 mb-2 block">Countries of Work</label>
            <div className="flex flex-wrap gap-2">
              {(geographic.countriesOfWork || []).map((country: string, index: number) => (
                <Badge
                  key={index}
                  className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10 text-xs md:text-sm"
                >
                  {country}
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="experience" className="space-y-4">
          <div>
            <label className="text-sm font-medium text-primary-700 mb-2 block">Clients/Donors</label>
            <div className="space-y-2">
              {(experience.clientsDonors || []).map((client: string, index: number) => (
                <div key={index} className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                  <span className="text-primary-900 text-sm md:text-base">{client}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-primary-700 mb-2 block">Technical Sectors</label>
              <div className="space-y-2">
                {(experience.technicalSectors || []).map((sector: string, index: number) => (
                  <Badge
                    key={index}
                    className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10 block w-fit text-xs md:text-sm"
                  >
                    {sector}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-primary-700 mb-2 block">Functional Areas</label>
              <div className="space-y-2">
                {(experience.functionalAreas || []).map((area: string, index: number) => (
                  <Badge
                    key={index}
                    className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10 block w-fit text-xs md:text-sm"
                  >
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="education" className="space-y-4">
          <div>
            <label className="text-sm font-medium text-primary-700 mb-2 block">Academic Qualifications</label>
            <div className="space-y-4">
              {(education.academicQualifications || []).map((qual: any, index: number) => (
                <div key={index} className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <h4 className="font-semibold text-primary-900 text-sm md:text-base mb-2">{qual.degree}</h4>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-primary-700 text-xs md:text-sm">{qual.institution}</span>
                    <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10 text-xs md:text-sm">
                      {qual.year}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function CVParsingPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [completedCount, setCompletedCount] = useState(0)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const showToast = (message: string) => {
    setToastMessage(message)
    setToastVisible(true)
    setTimeout(() => {
      setToastVisible(false)
    }, 4000)
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

  const handleFileUpload = async (files: File[]) => {
    const maxSize = 4.5 * 1024 * 1024; // 4.5MB in bytes
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        showToast(`File "${file.name}" is too large. Please upload files less than or equal to 4.5MB.`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    // Add files to UI with uploading status
    const newFiles: UploadedFile[] = validFiles.map((file, index) => ({
      id: `file-${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
    }))
    setUploadedFiles((prev) => [...prev, ...newFiles])

    // For each file, upload and update status as soon as result is received
    validFiles.forEach(async (file, idx) => {
      // Set status to processing
      setUploadedFiles((prev) =>
        prev.map((f, i) =>
          f.name === file.name && f.status === "uploading" ? { ...f, status: "processing", progress: 50 } : f,
        ),
      )

      const response = await uploadSingleCVAction(file)

      setUploadedFiles((prev) =>
        prev.map((f) => {
          if (f.name === file.name) {
            const processed = response.processed?.find((p: any) => p.filename === f.name)
            const error = response.errors?.find((e: any) => e.filename === f.name)

            if (processed) {
              const parsed = processed.parsed || processed.result || {}
              const extractedFields = parsed ? Object.keys(parsed).length : 0
              return {
                ...f,
                status: "completed",
                progress: 100,
                extractedFields,
                parsedData: parsed,
              }
            } else if (error) {
              return { ...f, status: "error", progress: 100, error: error.error }
            }
          }
          return f
        }),
      )
    })
  }

  // Show toast when new files are completed
  useEffect(() => {
    const currentCompleted = uploadedFiles.filter((f) => f.status === "completed").length
    if (currentCompleted > completedCount) {
      const newlyCompleted = currentCompleted - completedCount
      showToast(`${newlyCompleted} CV${newlyCompleted > 1 ? "s" : ""} added to Supabase successfully`)
      setCompletedCount(currentCompleted)
    }
  }, [uploadedFiles, completedCount])

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
        return "text-primary-700"
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

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="pt-24 pb-12">
        <div className="mx-auto px-4 md:px-16 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-primary">CV Parsing & Data Extraction</h1>
            <p className="text-lg md:text-xl text-primary-700 max-w-3xl mx-auto leading-relaxed">
              Upload CVs in PDF or Word format and let our AI extract 17 predefined data fields with precision and
              speed.
            </p>
          </div>

          <div className="space-y-6">
            {/* Upload Area */}
            <Card className="bg-primary/5 border-primary/20 shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary text-lg md:text-xl">
                  <Upload className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  Upload CVs
                </CardTitle>
                <CardDescription className="text-primary-700 text-sm md:text-base">
                  Drag and drop files or click to browse. Supports PDF and Word documents.
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                {/* Cloud Storage Options */}
                <div className="mt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-px bg-primary/30 flex-1"></div>
                    <span className="text-primary-700 text-sm">Or import from</span>
                    <div className="h-px bg-primary/30 flex-1"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="border-primary/30 text-primary-700 hover:bg-primary/10 bg-white h-10 md:h-12 text-sm md:text-base"
                    >
                      <Cloud className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Google Drive
                    </Button>
                    <Button
                      variant="outline"
                      className="border-primary/30 text-primary-700 hover:bg-primary/10 bg-white h-10 md:h-12 text-sm md:text-base"
                    >
                      <Cloud className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      OneDrive
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <Card className="bg-primary/5 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-primary text-lg md:text-xl">
                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-primary" />
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
                                <p className="font-medium text-primary-900 truncate text-sm md:text-base">
                                  {file.name}
                                </p>
                                <p className="text-xs md:text-sm text-primary-700">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Status and Actions Row */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-2">
                              {file.status === "completed" && (
                                <Badge className="bg-primary text-white border-primary/20 hover:bg-primary/90 text-xs md:text-sm">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Completed
                                </Badge>
                              )}
                              {file.status === "error" && (
                                <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-xs md:text-sm">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Error
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {file.status === "completed" && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-primary/20 text-primary hover:bg-primary/10 bg-white h-8 px-3 md:h-9 md:px-4 text-xs md:text-sm"
                                    >
                                      <Eye className="w-4 h-4 mr-1" />
                                      <span className="hidden sm:inline">Preview</span>
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-full md:max-w-4xl max-h-[90vh] overflow-hidden bg-white border-gray-200 text-gray-900 p-4 md:p-6">
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center gap-3 text-lg md:text-xl text-primary">
                                        <FileText className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                                        CV Data Preview - {file.name}
                                      </DialogTitle>
                                      <DialogDescription className="text-primary-700 text-sm md:text-base">
                                        Extracted data from AI processing • Processing completed successfully
                                      </DialogDescription>
                                    </DialogHeader>
                                    <CVDataPreview parsed={file.parsedData} />
                                  </DialogContent>
                                </Dialog>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-primary/20 text-primary hover:bg-primary/10 bg-white h-8 px-3 md:h-9 md:px-4 text-xs md:text-sm"
                                onClick={() => removeFile(file.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                <span className="hidden sm:inline">Remove</span>
                              </Button>
                            </div>
                          </div>

                          {file.status !== "completed" && file.status !== "error" && (
                            <div className="space-y-2 mt-3">
                              <div className="flex justify-between text-sm">
                                <span className={`capitalize ${getStatusColor(file.status)}`}>{file.status}...</span>
                                <span className="text-primary-700">{file.progress}%</span>
                              </div>
                              <Progress value={file.progress} className="h-2" />
                            </div>
                          )}
                          {file.status === "error" && file.error && (
                            <div className="text-red-500 text-xs md:text-sm mt-3 p-2 bg-red-50 rounded border border-red-200">
                              {file.error}
                            </div>
                          )}
                        </div>
                      )
                    })}
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
