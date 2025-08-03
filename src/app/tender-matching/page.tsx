"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, CheckCircle, AlertCircle, Brain, Eye, Star, Users } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Briefcase, Globe, GraduationCap, Building, Mail, Phone, MapPin } from "lucide-react"
import { uploadTenderAction } from "./actions"

interface CandidateMatch {
  id: number
  Name: string
  Gender: string
  DOB: string | null
  Location: string
  Email: string[] | null
  Phone: string[] | null
  SocialMedia: string[] | null
  LastCVUpdate: number
  YearsOfExperience: number
  Nationalities: string[]
  Languages: string[]
  CountriesOfWork: string[]
  ClientsOrDonors: string[]
  RoleExperience: string[]
  AcademicQualifications: string[] | null
  TechnicalSectors: string[]
  FunctionalAreas: string[]
  score: number
}

interface SelectedCandidate {
  id: number
  Name: string
  score: number
  Reason: string
}

interface TenderResult {
  matches: CandidateMatch[]
  agent_output: {
    selected_candidates: SelectedCandidate[]
  }
}

interface UploadedTender {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  result?: TenderResult
}

interface CandidateProfileProps {
  candidate: CandidateMatch
}

function CandidateProfile({ candidate }: CandidateProfileProps) {
  return (
    <div className="overflow-y-auto max-h-[70vh]">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-full">
          <TabsTrigger
            value="overview"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs md:text-sm"
          >
            <User className="w-4 h-4" /> Overview
          </TabsTrigger>
          <TabsTrigger
            value="experience"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs md:text-sm"
          >
            <Briefcase className="w-4 h-4" /> Experience
          </TabsTrigger>
          <TabsTrigger
            value="geographic"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs md:text-sm"
          >
            <Globe className="w-4 h-4" /> Geographic
          </TabsTrigger>
          <TabsTrigger
            value="clients"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs md:text-sm"
          >
            <Building className="w-4 h-4" /> Clients
          </TabsTrigger>
          <TabsTrigger
            value="education"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white text-xs md:text-sm"
          >
            <GraduationCap className="w-4 h-4" /> Education
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-primary-700">Full Name</label>
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/20 min-h-[48px] flex items-center">
                <span className="text-primary-900 text-sm md:text-base">{candidate.Name}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-primary-700">Gender</label>
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/20 min-h-[48px] flex items-center">
                <span className="text-primary-900 text-sm md:text-base">{candidate.Gender}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-primary-700">Location</label>
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/20 min-h-[48px] flex items-center">
                <MapPin className="w-4 h-4 text-primary-600 mr-2" />
                <span className="text-primary-900 text-sm md:text-base">{candidate.Location}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-primary-700">Years of Experience</label>
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/20 min-h-[48px] flex items-center">
                <span className="text-primary-900 text-sm md:text-base">{candidate.YearsOfExperience} years</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-primary-700">Email</label>
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/20 min-h-[48px] flex items-center">
                {candidate.Email ? (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-primary-600 mr-2" />
                    <span className="text-primary-900 text-sm md:text-base">{candidate.Email[0]}</span>
                  </div>
                ) : (
                  <span className="text-primary-400 italic">Not specified</span>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-primary-700">Phone</label>
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/20 min-h-[48px] flex items-center">
                {candidate.Phone ? (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-primary-600 mr-2" />
                    <span className="text-primary-900 text-sm md:text-base">{candidate.Phone[0]}</span>
                  </div>
                ) : (
                  <span className="text-primary-400 italic">Not specified</span>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="experience" className="space-y-4">
          <div>
            <label className="text-sm font-medium text-primary-700 mb-2 block">Technical Sectors</label>
            <div className="flex flex-wrap gap-2">
              {candidate.TechnicalSectors.map((sector, index) => (
                <Badge key={index} className="bg-primary/10 text-primary border-primary/20 text-xs md:text-sm">
                  {sector}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-primary-700 mb-2 block">Functional Areas</label>
            <div className="flex flex-wrap gap-2">
              {candidate.FunctionalAreas.map((area, index) => (
                <Badge key={index} className="bg-secondary/10 text-secondary border-secondary/20 text-xs md:text-sm">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-primary-700 mb-2 block">Role Experience</label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {candidate.RoleExperience.slice(0, 10).map((role, index) => (
                <div key={index} className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                  <span className="text-primary-900 text-sm md:text-base">{role}</span>
                </div>
              ))}
              {candidate.RoleExperience.length > 10 && (
                <div className="text-center">
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs md:text-sm">
                    +{candidate.RoleExperience.length - 10} more roles
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="geographic" className="space-y-4">
          <div>
            <label className="text-sm font-medium text-primary-700 mb-2 block">Nationalities</label>
            <div className="flex flex-wrap gap-2">
              {candidate.Nationalities.map((nationality, index) => (
                <Badge key={index} className="bg-accent/10 text-accent border-accent/20 text-xs md:text-sm">
                  {nationality}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-primary-700 mb-2 block">Languages</label>
            <div className="flex flex-wrap gap-2">
              {candidate.Languages.map((language, index) => (
                <Badge key={index} className="bg-primary/10 text-primary border-primary/20 text-xs md:text-sm">
                  {language}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-primary-700 mb-2 block">Countries of Work</label>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {candidate.CountriesOfWork.map((country, index) => (
                <Badge key={index} className="bg-secondary/10 text-secondary border-secondary/20 text-xs md:text-sm">
                  {country}
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="clients" className="space-y-4">
          <div>
            <label className="text-sm font-medium text-primary-700 mb-2 block">Clients/Donors</label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {candidate.ClientsOrDonors.map((client, index) => (
                <div key={index} className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                  <span className="text-primary-900 text-sm md:text-base">{client}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="education" className="space-y-4">
          <div>
            <label className="text-sm font-medium text-primary-700 mb-2 block">Academic Qualifications</label>
            {candidate.AcademicQualifications ? (
              <div className="space-y-3">
                {candidate.AcademicQualifications.map((qual, index) => (
                  <div key={index} className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <span className="text-primary-900 text-sm md:text-base">{qual}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <span className="text-primary-400 italic">No academic qualifications specified</span>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function TenderMatchingPage() {
  const [uploadedTender, setUploadedTender] = useState<UploadedTender | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const showToast = (message: string) => {
    setToastVisible(false)
    setTimeout(() => {
      setToastMessage(message)
      setToastVisible(true)
      setTimeout(() => {
        setToastVisible(false)
      }, 4000)
    }, 10)
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
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [])

  const handleFileUpload = async (file: File) => {
    const maxSize = 4.5 * 1024 * 1024 // 4.5MB in bytes
    if (file.size > maxSize) {
      showToast("File is too large. Please upload a file less than or equal to 4.5MB.")
      return
    }
    const newTender: UploadedTender = {
      id: `tender-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
    }
    setUploadedTender(newTender)
    // Simulate upload progress
    setUploadedTender((prev) => prev && { ...prev, progress: 30, status: "uploading" })
    // Call server action to upload and process the tender
    const response = await uploadTenderAction(file)
    if (response && response.status === "processed" && response.result) {
      setUploadedTender((prev) =>
        prev
          ? {
              ...prev,
              status: "completed",
              progress: 100,
              result: response.result,
            }
          : null,
      )
      showToast("Tender processed successfully! Found matching candidates.")
    } else {
      setUploadedTender((prev) =>
        prev
          ? {
              ...prev,
              status: "error",
              progress: 100,
            }
          : null,
      )
      showToast("Tender processing failed.")
    }
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

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="pt-24 pb-12 px-6">
        <div className="mx-auto px-4 md:px-16 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Tender-to-CV Matching</h1>
            <p className="text-xl text-primary-700 max-w-3xl mx-auto leading-relaxed">
              Upload your tender document and let our AI find the most suitable experts from our database with
              intelligent matching and scoring
            </p>
          </div>
          <div className="space-y-6">
            {/* Upload Area */}
            <Card className="bg-primary/5 border-primary/20 hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary">
                  <Upload className="w-6 h-6 text-primary" />
                  Upload Tender Document
                </CardTitle>
                <CardDescription className="text-primary-700">
                  Upload a single tender file in PDF or Word format for expert matching.
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
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-base md:text-lg font-semibold text-primary-900 mb-2">
                        Drop your tender file here
                      </p>
                      <p className="text-sm md:text-base text-primary-700 mb-4">
                        or click to browse from your computer
                      </p>
                      <Button
                        className="bg-primary hover:bg-primary/90 text-white font-semibold text-sm md:text-base"
                        onClick={() => document.getElementById("tender-input")?.click()}
                      >
                        Choose File
                      </Button>
                      <input
                        id="tender-input"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        className="hidden"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Uploaded Tender */}
            {uploadedTender && (
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-primary text-lg md:text-xl">
                    <FileText className="w-6 h-6 text-primary" />
                    Tender Processing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-primary rounded-lg flex items-center justify-center">
                          {(() => {
                            const StatusIcon = getStatusIcon(uploadedTender.status)
                            return (
                              <StatusIcon className={`w-5 h-5 ${getStatusColor(uploadedTender.status)} text-white`} />
                            )
                          })()}
                        </div>
                        <div>
                          <p className="font-medium text-primary-900 truncate max-w-[150px] sm:max-w-xs">
                            {uploadedTender.name}
                          </p>
                          <p className="text-xs md:text-sm text-primary-700">{formatFileSize(uploadedTender.size)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {uploadedTender.status === "completed" && uploadedTender.result && (
                          <Badge className="bg-accent/10 text-accent border-accent/20 text-xs md:text-sm">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {uploadedTender.result.matches.length} matches found
                          </Badge>
                        )}
                      </div>
                    </div>
                    {uploadedTender.status !== "completed" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className={`capitalize ${getStatusColor(uploadedTender.status)}`}>
                            {uploadedTender.status}...
                          </span>
                          <span className="text-primary-700">{uploadedTender.progress}%</span>
                        </div>
                        <Progress value={uploadedTender.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Results */}
            {uploadedTender?.status === "completed" && uploadedTender.result && (
              <>
                {/* AI Selected Candidates */}
                <Card className="bg-primary/10 border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-primary text-lg md:text-xl">
                      <Star className="w-6 h-6 text-sm" />
                      AI Recommended Candidates
                    </CardTitle>
                    <CardDescription className="text-primary-700 text-sm md:text-base">
                      Top candidates selected by our AI agent based on tender requirements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {uploadedTender.result.agent_output.selected_candidates.map((candidate, index) => (
                        <div key={candidate.id} className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-semibold text-primary-900">{candidate.Name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs md:text-sm hover:text-white hover:text-sm transition-colors duration-200">
                                    Score: {candidate.score}%
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-primary-700 text-sm leading-relaxed">{candidate.Reason}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                {/* All Matches */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-primary text-lg md:text-xl">
                      <Users className="w-6 h-6 text-primary" />
                      All Matching Candidates ({uploadedTender.result.matches.length})
                    </CardTitle>
                    <CardDescription className="text-primary-700 text-sm md:text-base">
                      Complete list of candidates matching your tender requirements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {uploadedTender.result.matches.map((candidate) => (
                        <div key={candidate.id} className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-primary-900 text-base md:text-lg truncate">
                                  {candidate.Name}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs md:text-sm hover:text-white hover:text-sm transition-colors duration-200">
                                    {candidate.YearsOfExperience} years exp.
                                  </Badge>
                                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs md:text-sm hover:text-white hover:text-sm transition-colors duration-200">
                                    {candidate.Location}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center justify-end gap-2">
                              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs md:text-sm hover:text-white hover:text-sm transition-colors duration-200">
                                Match Score: {(candidate.score * 10).toFixed(1)}%
                              </Badge>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-primary/20 text-primary hover:bg-primary/10 bg-white h-8 px-3 md:h-9 md:px-4 text-xs md:text-sm"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-full md:max-w-4xl max-h-[90vh] overflow-hidden bg-white border-gray-200 text-gray-900 p-4 md:p-6">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-3 text-xl text-primary">
                                      <User className="w-6 h-6 text-primary" />
                                      Candidate Profile - {candidate.Name}
                                    </DialogTitle>
                                    <DialogDescription className="text-primary-700">
                                      Detailed profile and experience • Match Score:{" "}
                                      {(candidate.score * 100).toFixed(1)}%
                                    </DialogDescription>
                                  </DialogHeader>
                                  <CandidateProfile candidate={candidate} />
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-primary-700">Top Skills: </span>
                              <span className="text-primary-900">
                                {candidate.TechnicalSectors.slice(0, 3).join(", ")}
                              </span>
                            </div>
                            <div>
                              <span className="text-primary-700">Key Clients: </span>
                              <span className="text-primary-900">
                                {candidate.ClientsOrDonors.slice(0, 2).join(", ")}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
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
