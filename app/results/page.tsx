"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, GraduationCap, Lightbulb, Star, TrendingUp, Target, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ProjectSuggestion {
  title: string
  description: string
  matchScore: number
  relevantSkills: string[]
  researchAreas: string[]
}

export default function ResultsPage() {
  const [resumeData, setResumeData] = useState(null)
  const [scholarData, setScholarData] = useState(null)
  const [projects, setProjects] = useState<ProjectSuggestion[]>([])

  useEffect(() => {
    // Load data from localStorage (in production, use proper state management)
    const storedResumeData = localStorage.getItem("resumeData")
    const storedScholarData = localStorage.getItem("scholarData")
    const storedProjects = localStorage.getItem("projectSuggestions")

    if (storedResumeData) setResumeData(JSON.parse(storedResumeData))
    if (storedScholarData) setScholarData(JSON.parse(storedScholarData))
    if (storedProjects) setProjects(JSON.parse(storedProjects))
  }, [])

  if (!resumeData || !scholarData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Data Found</CardTitle>
            <CardDescription>Please go back and upload your resume and Scholar profile first.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/analyze">
              <Button className="w-full">Go to Analysis Page</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getMatchColor = (score: number) => {
    if (score >= 90) return "from-green-500 to-emerald-500"
    if (score >= 80) return "from-blue-500 to-cyan-500"
    if (score >= 70) return "from-yellow-500 to-orange-500"
    return "from-gray-500 to-slate-500"
  }

  const getMatchBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 border-green-200"
    if (score >= 80) return "bg-blue-100 text-blue-800 border-blue-200"
    if (score >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

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
          <Link href="/analyze" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 group">
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Analysis
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Your Perfect{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Project Matches
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              AI-powered recommendations based on your skills and research interests
            </p>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-8 mb-12"
        >
          {/* Resume Summary */}
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="h-full bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900">Professional Profile</CardTitle>
                    <CardDescription>Extracted from your resume</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-600 font-medium mb-1">NAME</p>
                    <p className="font-semibold text-slate-900">{resumeData.name}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-600 font-medium mb-1">EMAIL</p>
                    <p className="font-semibold text-slate-900 text-sm">{resumeData.email}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-blue-600 font-medium mb-2">CORE SKILLS</p>
                  <div className="flex flex-wrap gap-1">
                    {resumeData.skills.map((skill, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">{skill}</Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-blue-600 font-medium mb-2">EDUCATION</p>
                  <div className="space-y-2">
                    {resumeData.education.map((edu, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="p-2 bg-white rounded border border-blue-200 text-sm text-slate-700"
                      >
                        {edu}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Scholar Profile Summary */}
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="h-full bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900">Research Profile</CardTitle>
                    <CardDescription>From your Google Scholar profile</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-lg border border-purple-200">
                    <p className="text-xs text-purple-600 font-medium mb-1">RESEARCHER</p>
                    <p className="font-semibold text-slate-900">{scholarData.name}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-purple-200">
                    <p className="text-xs text-purple-600 font-medium mb-1">AFFILIATION</p>
                    <p className="font-semibold text-slate-900 text-sm">{scholarData.affiliation}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white"
                  >
                    <TrendingUp className="h-5 w-5 mx-auto mb-1" />
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                      className="text-2xl font-bold"
                    >
                      {scholarData.citations.toLocaleString()}
                    </motion.p>
                    <p className="text-xs opacity-90">Citations</p>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white"
                  >
                    <Target className="h-5 w-5 mx-auto mb-1" />
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                      className="text-2xl font-bold"
                    >
                      {scholarData.hIndex}
                    </motion.p>
                    <p className="text-xs opacity-90">h-index</p>
                  </motion.div>
                </div>

                <div>
                  <p className="text-xs text-purple-600 font-medium mb-2">RESEARCH INTERESTS</p>
                  <div className="flex flex-wrap gap-1">
                    {scholarData.interests.map((interest, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        whileHover={{ scale: 1.1 }}
                      >
                        <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
                          {interest}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Project Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-white to-yellow-50 border-2 border-yellow-200 hover:shadow-xl transition-all duration-300">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-slate-900">AI-Recommended Projects</CardTitle>
              <CardDescription className="text-lg text-slate-600">
                {projects.length} personalized matches based on your profile analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <AnimatePresence>
                  {projects.map((project, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="relative overflow-hidden border-2 border-slate-200 rounded-xl p-6 bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    >
                      {/* Match score indicator */}
                      <div className="absolute top-4 right-4">
                        <div className={`flex items-center space-x-2`}>
                          <Star className="w-4 h-4 text-yellow-500" />
                          <Badge className={getMatchBadgeColor(project.matchScore)}>{project.matchScore}% match</Badge>
                        </div>
                      </div>

                      {/* Project content */}
                      <div className="pr-24">
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p className="text-slate-600 mb-4 leading-relaxed">{project.description}</p>

                        <div className="flex flex-wrap gap-2">
                          <div className="flex flex-wrap gap-1">
                            {project.relevantSkills.map((skill, skillIndex) => (
                              <motion.div
                                key={skillIndex}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 + index * 0.1 + skillIndex * 0.05 }}
                                whileHover={{ scale: 1.1 }}
                              >
                                <Badge className="bg-blue-100 text-blue-700 border-blue-200">{skill}</Badge>
                              </motion.div>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {project.researchAreas.map((area, areaIndex) => (
                              <motion.div
                                key={areaIndex}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7 + index * 0.1 + areaIndex * 0.05 }}
                                whileHover={{ scale: 1.1 }}
                              >
                                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
                                  {area}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Gradient overlay on hover */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${getMatchColor(project.matchScore)} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                      ></div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {projects.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-12 text-slate-500"
                  >
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    >
                      <Lightbulb className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
                    <p className="mb-6">No project suggestions generated yet.</p>
                    <Link href="/analyze">
                      <Button className="transform hover:scale-105 transition-all duration-200">
                        <Zap className="w-4 h-4 mr-2" />
                        Generate Projects
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>

              {projects.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="text-center mt-8 pt-6 border-t border-yellow-200"
                >
                  <p className="text-slate-600 mb-4">Want more personalized recommendations?</p>
                  <Link href="/analyze">
                    <Button variant="outline" className="mr-4 bg-transparent">
                      Refine Analysis
                    </Button>
                  </Link>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Save Results
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
