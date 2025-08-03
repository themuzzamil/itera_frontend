"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Brain,
  Trash2,
  Eye,
  Download,
  Loader2,
  Users,
  ClipboardList,
  PenTool,
  UserCheck,
  Play,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { profileExpertStep1, profileExpertStep2, profileExpertStep3, profileExpertStep4 } from "./actions"

interface StepData {
  step1?: {
    cv_assignments: any
    tender_assignments: any
    cv_text: string // Added to store for subsequent steps
    tender_text: string // Added to store for subsequent steps
  }
  step2?: {
    selected_assignments: any
  }
  step3?: {
    write_up: any
  }
  step4?: {
    expert_profile: any
  }
}

interface ProcessingState {
  step: number
  isProcessing: boolean
  error: string | null
  completed: boolean[]
}

export default function ProfileExpertPage() {
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [tenderFile, setTenderFile] = useState<File | null>(null)
  const [stepData, setStepData] = useState<StepData>({})
  const [processingState, setProcessingState] = useState<ProcessingState>({
    step: 0,
    isProcessing: false,
    error: null,
    completed: [false, false, false, false],
  })
  const [isDragOver, setIsDragOver] = useState(false)
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

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const files = Array.from(e.dataTransfer.files)
      if (files.length >= 2) {
        setCvFile(files[0])
        setTenderFile(files[1])
      } else if (files.length === 1) {
        if (!cvFile) {
          setCvFile(files[0])
        } else {
          setTenderFile(files[0])
        }
      }
    },
    [cvFile],
  )

  const handleFileUpload = (files: FileList | null, type: "cv" | "tender") => {
    if (files && files.length > 0) {
      const file = files[0]
      const maxSize = 4.5 * 1024 * 1024 // 4.5MB in bytes

      if (file.size > maxSize) {
        showToast("File is too large. Please upload a file less than or equal to 4.5MB.")
        return
      }

      if (type === "cv") {
        setCvFile(files[0])
      } else {
        setTenderFile(files[0])
      }
    }
  }

  const executeStep1 = async () => {
    if (!cvFile || !tenderFile) {
      showToast("Please upload both CV and tender files")
      return
    }
    setProcessingState((prev) => ({ ...prev, step: 1, isProcessing: true, error: null }))
    try {
      const result = await profileExpertStep1(cvFile, tenderFile)
      setStepData((prev) => ({ ...prev, step1: result }))
      setProcessingState((prev) => ({
        ...prev,
        step: 1,
        isProcessing: false,
        completed: [true, false, false, false],
      }))
      showToast("Step 1 completed: CV and tender assignments extracted")
    } catch (error) {
      setProcessingState((prev) => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }))
      showToast("Error in step 1: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  const executeStep2 = async () => {
    if (!processingState.completed[0] || !stepData.step1) {
      showToast("Please complete step 1 first")
      return
    }
    setProcessingState((prev) => ({ ...prev, step: 2, isProcessing: true, error: null }))
    try {
      const result = await profileExpertStep2(stepData.step1.cv_assignments, stepData.step1.tender_assignments)
      setStepData((prev) => ({ ...prev, step2: result }))
      setProcessingState((prev) => ({
        ...prev,
        step: 2,
        isProcessing: false,
        completed: [true, true, false, false],
      }))
      showToast("Step 2 completed: Assignment selection and ranking done")
    } catch (error) {
      setProcessingState((prev) => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }))
      showToast("Error in step 2: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  const executeStep3 = async () => {
    if (!processingState.completed[1] || !stepData.step2 || !stepData.step1) {
      showToast("Please complete step 2 first")
      return
    }
    setProcessingState((prev) => ({ ...prev, step: 3, isProcessing: true, error: null }))
    try {
      const result = await profileExpertStep3(stepData.step2.selected_assignments, stepData.step1.cv_text)
      setStepData((prev) => ({ ...prev, step3: result }))
      setProcessingState((prev) => ({
        ...prev,
        step: 3,
        isProcessing: false,
        completed: [true, true, true, false],
      }))
      showToast("Step 3 completed: Assignment write-up generated")
    } catch (error) {
      setProcessingState((prev) => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }))
      showToast("Error in step 3: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  const executeStep4 = async () => {
    if (!processingState.completed[2] || !stepData.step3 || !stepData.step1) {
      showToast("Please complete step 3 first")
      return
    }
    setProcessingState((prev) => ({ ...prev, step: 4, isProcessing: true, error: null }))
    try {
      const result = await profileExpertStep4(
        stepData.step3.write_up,
        stepData.step1.cv_text,
        stepData.step1.tender_assignments,
      )
      setStepData((prev) => ({ ...prev, step4: result }))
      setProcessingState((prev) => ({
        ...prev,
        step: 4,
        isProcessing: false,
        completed: [true, true, true, true],
      }))
      showToast("Step 4 completed: Expert profile generated successfully!")
    } catch (error) {
      setProcessingState((prev) => ({
        ...prev,
        isProcessing: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }))
      showToast("Error in step 4: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  const resetProcess = async () => {
    setCvFile(null)
    setTenderFile(null)
    setStepData({})
    setProcessingState({
      step: 0,
      isProcessing: false,
      error: null,
      completed: [false, false, false, false],
    })
    showToast("Process reset successfully")
  }

  const downloadResult = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const steps = [
    {
      id: 1,
      title: "Extract Assignments",
      description: "Analyze CV and tender to extract relevant assignments",
      icon: ClipboardList,
      action: executeStep1,
      canExecute: cvFile && tenderFile,
      result: stepData.step1,
    },
    {
      id: 2,
      title: "Select & Rank",
      description: "Select and rank the most relevant assignments",
      icon: Users,
      action: executeStep2,
      canExecute: processingState.completed[0],
      result: stepData.step2,
    },
    {
      id: 3,
      title: "Generate Write-up",
      description: "Create detailed write-up for selected assignments",
      icon: PenTool,
      action: executeStep3,
      canExecute: processingState.completed[1],
      result: stepData.step3,
    },
    {
      id: 4,
      title: "Expert Profile",
      description: "Generate final expert profile document",
      icon: UserCheck,
      action: executeStep4,
      canExecute: processingState.completed[2],
      result: stepData.step4,
    },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="pt-24 pb-12 px-6">
        <div className="mx-auto px-4 md:px-16 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">Expert Profile Generator</h1>
            <p className="text-xl text-primary-700 max-w-3xl mx-auto leading-relaxed">
              Upload CV and tender documents to generate comprehensive expert profiles through our AI-powered multi-step
              process
            </p>
          </div>
          {/* Progress Overview */}
          <Card className="bg-primary/5 border-primary/20 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-primary">
                <Brain className="w-6 h-6 text-primary" />
                Process Progress
              </CardTitle>
              <CardDescription className="text-primary-700">
                Complete each step in sequence to generate your expert profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isCompleted = processingState.completed[index]
                  const isCurrent = processingState.step === step.id && processingState.isProcessing
                  const canExecute = step.canExecute && !processingState.isProcessing
                  return (
                    <div
                      key={step.id}
                      className={`relative p-4 rounded-lg border transition-all duration-300 ${
                        isCompleted
                          ? "bg-primary/10 border-primary/30"
                          : isCurrent
                            ? "bg-secondary/10 border-secondary/30"
                            : canExecute
                              ? "bg-primary/5 border-primary/20 hover:border-primary/30"
                              : "bg-primary/5 border-primary/20"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? "bg-primary text-white"
                              : isCurrent
                                ? "bg-secondary text-white"
                                : "bg-primary/20 text-primary"
                          }`}
                        >
                          {isCurrent ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                        </div>
                        <span className={`font-medium ${isCompleted ? "text-primary" : "text-primary-900"}`}>
                          Step {step.id}
                        </span>
                      </div>
                      <h3 className="font-semibold text-primary-900 mb-1">{step.title}</h3>
                      <p className="text-sm text-primary-700">{step.description}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
          {/* File Upload Section */}
          <Card className="bg-primary/5 border-primary/20 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-primary">
                <Upload className="w-6 h-6 text-primary" />
                Upload Documents
              </CardTitle>
              <CardDescription className="text-primary-700">
                Upload both CV and tender documents to begin the process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CV Upload */}
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">CV Document</label>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
                      isDragOver ? "border-primary bg-primary/5" : "border-primary/30 hover:border-primary/50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {cvFile ? (
                      <div className="space-y-2">
                        <FileText className="w-8 h-8 mx-auto text-primary" />
                        <p className="font-medium text-primary-900 truncate max-w-[150px] sm:max-w-xs mx-auto">
                          {cvFile.name}
                        </p>
                        <p className="text-sm text-primary-700">{formatFileSize(cvFile.size)}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-primary/20 text-primary hover:bg-primary/10 bg-white"
                          onClick={() => setCvFile(null)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 mx-auto text-primary-400" />
                        <p className="text-primary-700">Drop CV here or click to browse</p>
                        <Button
                          variant="outline"
                          className="border-primary/20 text-primary hover:bg-primary/10 bg-white"
                          onClick={() => document.getElementById("cv-input")?.click()}
                        >
                          Choose CV File
                        </Button>
                        <input
                          id="cv-input"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e.target.files, "cv")}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {/* Tender Upload */}
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Tender Document</label>
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
                      isDragOver ? "border-primary bg-primary/5" : "border-primary/30 hover:border-primary/50"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {tenderFile ? (
                      <div className="space-y-2">
                        <FileText className="w-8 h-8 mx-auto text-primary" />
                        <p className="font-medium text-primary-900 truncate max-w-[150px] sm:max-w-xs mx-auto">
                          {tenderFile.name}
                        </p>
                        <p className="text-sm text-primary-700">{formatFileSize(tenderFile.size)}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-primary/20 text-primary hover:bg-primary/10 bg-white"
                          onClick={() => setTenderFile(null)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 mx-auto text-primary-400" />
                        <p className="text-primary-700">Drop tender here or click to browse</p>
                        <Button
                          variant="outline"
                          className="border-primary/20 text-primary hover:bg-primary/10 bg-white"
                          onClick={() => document.getElementById("tender-input")?.click()}
                        >
                          Choose Tender File
                        </Button>
                        <input
                          id="tender-input"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e.target.files, "tender")}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Processing Steps */}
          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isCompleted = processingState.completed[index]
              const isCurrent = processingState.step === step.id && processingState.isProcessing
              const canExecute = step.canExecute && !processingState.isProcessing
              return (
                <Card
                  key={step.id}
                  className={`transition-all duration-300 ${
                    isCompleted
                      ? "bg-primary/10 border-primary/30"
                      : isCurrent
                        ? "bg-secondary/10 border-secondary/30"
                        : "bg-primary/5 border-primary/20"
                  }`}
                >
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? "bg-primary text-white"
                              : isCurrent
                                ? "bg-secondary text-white"
                                : "bg-primary/20 text-primary"
                          }`}
                        >
                          {isCurrent ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                          ) : isCompleted ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <Icon className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-primary-900 text-lg md:text-xl">
                            Step {step.id}: {step.title}
                          </CardTitle>
                          <CardDescription className="text-primary-700 text-sm md:text-base">
                            {step.description}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {step.result && (
                          <>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-primary/20 text-primary hover:bg-primary/10 bg-white h-8 px-3 md:h-9 md:px-4 text-xs md:text-sm"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span className="hidden sm:inline ml-1">Preview</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-full md:max-w-4xl max-h-[90vh] overflow-hidden bg-white border-gray-200 text-gray-900 p-4 md:p-6">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-3 text-lg md:text-xl text-primary">
                                    <Icon className="w-6 h-6 text-primary" />
                                    Step {step.id} Results
                                  </DialogTitle>
                                  <DialogDescription className="text-primary-700 text-sm md:text-base">
                                    View the results from {step.title.toLowerCase()}
                                  </DialogDescription>
                                </DialogHeader>
                                <ScrollArea className="max-h-[60vh]">
                                  <pre className="bg-primary/10 p-4 rounded-lg text-sm text-primary-900 whitespace-pre-wrap">
                                    {JSON.stringify(step.result, null, 2)}
                                  </pre>
                                </ScrollArea>
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-primary/20 text-primary hover:bg-primary/10 bg-white h-8 px-3 md:h-9 md:px-4 text-xs md:text-sm"
                              onClick={() => downloadResult(step.result, `step${step.id}_results.json`)}
                            >
                              <Download className="w-4 h-4" />
                              <span className="hidden sm:inline ml-1">Download</span>
                            </Button>
                          </>
                        )}
                        <Button
                          onClick={step.action}
                          disabled={!canExecute || processingState.isProcessing}
                          className={`${
                            isCompleted
                              ? "bg-primary/20 text-primary border-primary/30"
                              : canExecute
                                ? "bg-primary hover:bg-primary/90 text-white"
                                : "bg-primary/50 text-white cursor-not-allowed"
                          } font-semibold h-8 px-3 md:h-9 md:px-4 text-xs md:text-sm`}
                        >
                          {isCurrent ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin text-primary" />
                              Processing...
                            </>
                          ) : isCompleted ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Completed
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              <span className="hidden sm:inline">Execute Step {step.id}</span>
                              <span className="inline sm:hidden">Step {step.id}</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  {isCurrent && (
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-primary-700">Processing step {step.id}...</span>
                          <span className="text-primary-700">Please wait</span>
                        </div>
                        <Progress value={undefined} className="h-2" />
                      </div>
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
          {/* Final Results */}
          {processingState.completed[3] && stepData.step4 && (
            <Card className="bg-primary/10 border-primary/30 mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary">
                  <CheckCircle className="w-6 h-6 text-accent" />
                  Expert Profile Generated Successfully!
                </CardTitle>
                <CardDescription className="text-primary-700">
                  Your expert profile has been generated and is ready for download
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-primary-800 text-center sm:text-left flex-1">
                    <p className="font-medium">Complete expert profile generated</p>
                    <p className="text-sm text-primary-700">All processing steps completed successfully</p>
                  </div>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 text-sm md:text-base"
                    onClick={() => downloadResult(stepData.step4, "expert_profile.json")}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Error Display */}
          {processingState.error && (
            <Card className="bg-red-500/10 border-red-500/30 mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-red-500">
                  <AlertCircle className="w-6 h-6" />
                  Processing Error
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600">{processingState.error}</p>
                <Button
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => setProcessingState((prev) => ({ ...prev, error: null }))}
                >
                  Dismiss
                </Button>
              </CardContent>
            </Card>
          )}
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
