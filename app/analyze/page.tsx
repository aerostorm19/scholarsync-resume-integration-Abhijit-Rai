"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ResumeUploader } from "@/components/resume-uploader"
import { ScholarProfileInput } from "@/components/scholar-profile-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, CheckCircle, Clock, Zap } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function AnalyzePage() {
  const [resumeData, setResumeData] = useState(null)
  const [scholarData, setScholarData] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  const handleGenerateProjects = async () => {
    if (!resumeData || !scholarData) {
      alert("Please upload your resume and fetch your Scholar profile first.")
      return
    }

    setIsGenerating(true)
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    try {
      // API call to generate project suggestions
      const response = await fetch("/api/suggest-projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeData,
          scholarData,
        }),
      })

      if (response.ok) {
        const projects = await response.json()
        setProgress(100)

        // Store in localStorage for results page (in production, use proper state management)
        localStorage.setItem("projectSuggestions", JSON.stringify(projects))
        localStorage.setItem("resumeData", JSON.stringify(resumeData))
        localStorage.setItem("scholarData", JSON.stringify(scholarData))

        setTimeout(() => {
          router.push("/results")
        }, 500)
      }
    } catch (error) {
      console.error("Error generating projects:", error)
      alert("Failed to generate project suggestions. Please try again.")
    } finally {
      clearInterval(progressInterval)
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const completionPercentage = ((resumeData ? 1 : 0) + (scholarData ? 1 : 0)) * 50

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 group">
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Analyze Your Profile</h1>
              <p className="text-slate-600 text-lg">
                Upload your resume and connect your Google Scholar profile to get started.
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-slate-600">Progress</span>
                <Badge variant={completionPercentage === 100 ? "default" : "secondary"}>{completionPercentage}%</Badge>
              </div>
              <Progress value={completionPercentage} className="w-48" />
            </div>
          </div>
        </motion.div>

        {/* Status Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-2 gap-4 mb-8"
        >
          <Card
            className={`border-2 transition-all duration-300 ${resumeData ? "border-green-200 bg-green-50" : "border-slate-200"}`}
          >
            <CardContent className="flex items-center p-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${resumeData ? "bg-green-100" : "bg-slate-100"}`}
              >
                {resumeData ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Clock className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-slate-900">Resume Analysis</p>
                <p className="text-sm text-slate-600">{resumeData ? "Completed" : "Pending upload"}</p>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`border-2 transition-all duration-300 ${scholarData ? "border-green-200 bg-green-50" : "border-slate-200"}`}
          >
            <CardContent className="flex items-center p-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${scholarData ? "bg-green-100" : "bg-slate-100"}`}
              >
                {scholarData ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Clock className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div>
                <p className="font-medium text-slate-900">Scholar Profile</p>
                <p className="text-sm text-slate-600">{scholarData ? "Connected" : "Pending connection"}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-8 mb-8"
        >
          <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
            <ResumeUploader onDataExtracted={setResumeData} />
          </motion.div>
          <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 300 }}>
            <ScholarProfileInput onDataFetched={setScholarData} />
          </motion.div>
        </motion.div>

        <Separator className="my-8" />

        {/* Generate Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-50 border-2 border-blue-200">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">Generate AI-Powered Recommendations</CardTitle>
              <CardDescription className="text-lg text-slate-600">
                Our advanced AI will analyze your profile and research interests to find the perfect project matches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <AnimatePresence>
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Analyzing your profile...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="text-center text-sm text-slate-500">
                      {progress < 30 && "Processing resume data..."}
                      {progress >= 30 && progress < 60 && "Analyzing research interests..."}
                      {progress >= 60 && progress < 90 && "Matching with projects..."}
                      {progress >= 90 && "Finalizing recommendations..."}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                onClick={handleGenerateProjects}
                disabled={!resumeData || !scholarData || isGenerating}
                size="lg"
                className="w-full text-lg py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:transform-none disabled:hover:scale-100"
              >
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div
                      key="generating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="mr-2"
                      >
                        <Sparkles className="h-5 w-5" />
                      </motion.div>
                      Generating Your Perfect Matches...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="generate"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate Project Recommendations
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>

              <AnimatePresence>
                {(!resumeData || !scholarData) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-center p-4 bg-amber-50 border border-amber-200 rounded-lg"
                  >
                    <p className="text-amber-800 font-medium">
                      {!resumeData && !scholarData
                        ? "Please upload your resume and connect your Scholar profile to continue"
                        : !resumeData
                          ? "Please upload your resume to continue"
                          : "Please connect your Scholar profile to continue"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
