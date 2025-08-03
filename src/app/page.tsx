"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Users,
  Layout,
  Search,
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
  Workflow,
  Upload,
  Download,
  Settings,
  Globe,
  Leaf,
  Shield,
  Building,
  TreePine,
  Utensils,
  Scale,
  Flower,
  Wheat,
} from "lucide-react"

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: FileText,
      title: "CV Parsing & Data Extraction",
      description: "Automatically extract 17 predefined data fields from CVs in PDF/Word format with AI precision.",
      details: [
        "Extract name, contact info, experience, qualifications",
        "Parse sectors, functional areas, and languages",
        "Identify countries of work and client/donor experience",
        "Bulk processing with cloud storage integration",
      ],
      color: "from-primary/10 to-primary/5",
      path: "/cv-parsing",
    },
    {
      icon: Users,
      title: "Expert Profile Generation",
      description: "Generate tailored expert profiles based on CV data and tender requirements using advanced AI.",
      details: [
        "Tailored profile writing based on CV + Tender/RFP",
        "Customizable writing style and format instructions",
        "Professional formatting for proposal submissions",
        "Multiple output formats (PDF/Word)",
      ],
      color: "from-secondary/10 to-secondary/5",
      path: "/expert-profile",
    },
    {
      icon: Layout,
      title: "CV Formatting & Standardization",
      description: "Auto-format CVs into standardized templates like Europass with consistent professional styling.",
      details: [
        "Europass template auto-fill functionality",
        "Consistent professional formatting",
        "Multiple export options (PDF/Word/CSV)",
        "Brand compliance and standardization",
      ],
      color: "from-accent/10 to-accent/5",
      path: "/cv-formatting",
    },
    {
      icon: Search,
      title: "Intelligent Tender-to-CV Matching",
      description:
        "Advanced matching system using NLP to find the best experts for specific tenders with contextual understanding.",
      details: [
        "Natural language processing for contextual matching",
        "Multi-criteria analysis and scoring system",
        "Thematic similarity recognition beyond keywords",
        "Comprehensive matching matrix with rankings",
      ],
      color: "from-blue-500/10 to-blue-500/5",
      path: "/tender-matching",
    },
  ]

  const stats = [
    { number: "17", label: "Data Fields Extracted", icon: FileText },
    { number: "4", label: "Processing Paths", icon: Workflow },
    { number: "2000+", label: "CVs Processed", icon: Users },
    { number: "50+", label: "Countries Covered", icon: Globe },
  ]

  const sectors = [
    { name: "Climate Change & Renewable Energy", icon: Leaf },
    { name: "Peace & Security", icon: Shield },
    { name: "Community Infrastructure", icon: Building },
    { name: "Protected Area Management", icon: TreePine },
    { name: "Food Security", icon: Utensils },
    { name: "Policy & Governance", icon: Scale },
    { name: "Biodiversity Conservation", icon: Flower },
    { name: "Gender Mainstreaming", icon: Users },
    { name: "Agricultural Value Chains", icon: Wheat },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-primary min-h-[70vh] flex items-center overflow-hidden">
        <div className="mx-auto px-4 md:px-16 relative z-10 text-white text-center">
          <div className={`transition-all duration-1000 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
            <Badge className="mb-4 md:mb-6 bg-secondary/20 text-secondary border-secondary/30 hover:bg-secondary/30">
              <Zap className="w-4 h-4 mr-2" />
              AI-Powered Proposal Development
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Revolutionizing
              <br />
              <span className="text-secondary">International Development</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
              IteraAI transforms manual proposal development with intelligent automation. Parse CVs, generate expert
              profiles, and match talent to tenders with unprecedented speed and accuracy for global impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-primary-50 hover:text-primary-900 font-semibold px-8 py-4 text-base md:text-lg"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/20 hover:border-white/50 px-8 py-4 text-base md:text-lg bg-transparent"
              >
                Schedule Demo
              </Button>
            </div>

            {/* Company Credentials */}
            <div className="mt-8 md:mt-12">
              <p className="text-sm text-primary-100 mb-4">Trusted by Leading Global Organizations</p>
              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-primary-200">
                <span className="font-semibold">UNDP</span>
                <span className="font-semibold">World Bank</span>
                <span className="font-semibold">FAO</span>
                <span className="font-semibold">UNICEF</span>
                <span className="font-semibold">ADB</span>
                <span className="font-semibold">UN Women</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 md:py-16 bg-secondary/20">
        <div className="mx-auto px-4 md:px-16">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">Cynosure International in Numbers</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Our impact and capabilities, quantified for clarity and confidence.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="bg-white border-gray-200 shadow-md transition-all duration-300 text-center flex flex-col items-center p-6"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                </div>
                <div className="text-2xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm md:text-lg text-gray-600">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-10 md:py-20">
        <div className="mx-auto px-4 md:px-16">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
              <Settings className="w-4 h-4 mr-2" />4 Core Processing Paths
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
              Comprehensive AI-Driven
              <br />
              <span className="text-primary">Automation Suite</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform your proposal development workflow with our four specialized processing paths, each designed to
              automate critical tasks in international development consulting.
            </p>
          </div>

          <div className="space-y-20">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-8 lg:gap-16 animate-fade-in`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Feature Visual */}
                <div className="flex-1 relative">
                  <Card className="bg-white border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-primary/10 text-primary border-primary/20">{feature.path}</Badge>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <feature.icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Upload className="w-4 h-4 text-primary" />
                              <span className="text-xs text-gray-500 uppercase tracking-wide">Input</span>
                            </div>
                            <p className="text-sm text-gray-700 font-medium">PDF/Word CVs</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Download className="w-4 h-4 text-secondary" />
                              <span className="text-xs text-gray-500 uppercase tracking-wide">Output</span>
                            </div>
                            <p className="text-sm text-gray-700 font-medium">Structured Data</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Processing Accuracy</span>
                            <span className="text-primary font-semibold">98%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full w-[98%]"></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Feature Content */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                    <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6">{feature.description}</p>
                  </div>

                  {/* Feature Benefits */}
                  <div className="space-y-3">
                    {feature.details.map((detail, detailIndex) => (
                      <div
                        key={detailIndex}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                      >
                        <div className="flex-shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center mt-0.5">
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs md:text-sm text-gray-700">{detail}</span>
                      </div>
                    ))}
                  </div>

                    <Button
                    asChild
                    className="bg-primary hover:bg-primary-600 text-white font-semibold"
                    >
                    <a href={feature.path}>
                      Learn More
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </a>
                    </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20 bg-secondary">
        <div className="mx-auto px-4 md:px-16">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">Streamlined Workflow</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              From CV upload to expert matching - see how IteraAI transforms your entire proposal development process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload & Parse",
                description:
                  "Bulk upload CVs from cloud storage or drag & drop. AI extracts all 17 predefined data fields automatically with high accuracy.",
                icon: Upload,
              },
              {
                step: "02",
                title: "Process & Generate",
                description:
                  "Generate tailored profiles, format CVs using Europass templates, and prepare structured data for CRM integration.",
                icon: Workflow,
              },
              {
                step: "03",
                title: "Match & Export",
                description:
                  "Intelligent matching against tender requirements with NLP-powered contextual analysis, scoring, and comprehensive export capabilities.",
                icon: Target,
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="bg-white border-gray-200 shadow-lg transition-all duration-300 animate-slide-in-left"
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    {item.step}
                  </div>
                  <CardTitle className="text-lg md:text-xl text-gray-900 mb-2">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <item.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <CardDescription className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto px-4 md:px-16">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">Specialized Sector Expertise</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Supporting international development across diverse sectors with AI-powered precision
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((sector, index) => (
              <Card
                key={index}
                className="bg-white border-gray-200 hover:border-primary/50 shadow-md transition-all duration-300 p-8 text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <sector.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg md:text-xl text-gray-900 mb-2">{sector.name}</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="mx-auto px-4 md:px-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to Transform Your Workflow?</h2>
          <p className="text-lg md:text-xl text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Join Cynosure International in revolutionizing proposal development with AI-powered automation for
            international development projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-primary-50 hover:text-primary-900 font-semibold px-8 py-4 text-base md:text-lg"
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/20 hover:border-white/50 px-8 py-4 text-base md:text-lg bg-transparent"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
