import React, { useState } from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Users, 
  Building, 
  Wrench, 
  Shield, 
  Globe, 
  Zap,
  Coins,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Download,
  Eye,
  Star,
  Target,
  Lightbulb,
  BookOpen
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function WhitepaperPage() {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    { id: "introduction", title: t("introduction"), icon: BookOpen },
    { id: "problem", title: t("problemStatement"), icon: Target },
    { id: "solution", title: t("ourSolution"), icon: Lightbulb },
    { id: "technology", title: t("technologyStack"), icon: Zap },
    { id: "tokenomics", title: t("tokenomics"), icon: Coins },
    { id: "roadmap", title: t("roadmap"), icon: TrendingUp },
    { id: "team", title: t("team"), icon: Users }
  ];

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  const renderIntroduction = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">{t("introduction")}</h2>
      <div className="prose max-w-none">
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          {t("whitepaperIntro")}
        </p>
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">{t("visionStatement")}</h3>
          <p className="text-gray-700">
            {t("visionText")}
          </p>
        </div>
      </div>
    </div>
  );

  const renderProblemStatement = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">{t("problemStatement")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t("lackOfTransparency")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{t("transparencyProblem")}</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-700 flex items-center gap-2">
              <Users className="h-5 w-5" />
              {t("communicationGaps")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{t("communicationProblem")}</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-700 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {t("inefficientProcesses")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{t("efficiencyProblem")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSolution = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">{t("ourSolution")}</h2>
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 text-2xl">{t("integratedPlatform")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 text-lg mb-4">{t("platformDescription")}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-700">{t("realTimeTracking")}</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-700">{t("automatedPayments")}</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-700">{t("qualityAssurance")}</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-700">{t("communityGovernance")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTechnology = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">{t("technologyStack")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              {t("blockchain")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{t("blockchainDescription")}</p>
            <div className="space-y-2">
              <div className="text-sm text-blue-600">• Solana Network</div>
              <div className="text-sm text-blue-600">• Smart Contracts</div>
              <div className="text-sm text-blue-600">• Decentralized Storage</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              {t("webPlatform")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{t("webDescription")}</p>
            <div className="space-y-2">
              <div className="text-sm text-purple-600">• Next.js & React</div>
              <div className="text-sm text-purple-600">• TypeScript</div>
              <div className="text-sm text-purple-600">• Real-time Updates</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTokenomics = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">{t("tokenomics")}</h2>
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg">
            <Coins className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">HBIT Token</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">1B</div>
              <div className="text-sm text-gray-600">{t("totalSupply")}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">40%</div>
              <div className="text-sm text-gray-600">{t("communityRewards")}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">30%</div>
              <div className="text-sm text-gray-600">{t("development")}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">30%</div>
              <div className="text-sm text-gray-600">{t("team")}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderRoadmap = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">{t("roadmap")}</h2>
      <div className="space-y-8">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Q1 2024</h3>
            <p className="text-gray-600">{t("roadmapQ1")}</p>
          </div>
        </div>
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Star className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Q2 2024</h3>
            <p className="text-gray-600">{t("roadmapQ2")}</p>
          </div>
        </div>
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Q3 2024</h3>
            <p className="text-gray-600">{t("roadmapQ3")}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeam = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">{t("team")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("foundingTeam")}</h3>
            <p className="text-sm text-gray-600">{t("teamDescription")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Zap className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("techTeam")}</h3>
            <p className="text-sm text-gray-600">{t("techDescription")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Building className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("advisors")}</h3>
            <p className="text-sm text-gray-600">{t("advisorsDescription")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "introduction": return renderIntroduction();
      case "problem": return renderProblemStatement();
      case "solution": return renderSolution();
      case "technology": return renderTechnology();
      case "tokenomics": return renderTokenomics();
      case "roadmap": return renderRoadmap();
      case "team": return renderTeam();
      default: return null;
    }
  };

  return (
    <>
      <Head>
        <title>{t("whitepaper")} - {t("hubit")}</title>
        <meta name="description" content={`${t("hubit")} ${t("whitepaper")} - Technical documentation and roadmap`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {!activeSection ? (
            // Main view - whitepaper overview
            <div className="space-y-12">
              {/* Header */}
              <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-4 rounded-2xl">
                  <BookOpen className="h-12 w-12 text-blue-600" />
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{t("whitepaper")}</h1>
                    <p className="text-lg text-gray-600 mt-2">HuBiT v8.0</p>
                  </div>
                </div>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                  {t("whitepaperDescription")}
                </p>
              </div>

              {/* Download and View Options */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="flex items-center gap-3 bg-black hover:bg-gray-800 px-8 py-4 text-base"
                >
                  <Download className="h-5 w-5" />
                  {t("downloadWhitepaper")}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="flex items-center gap-3 bg-white hover:bg-gray-50 px-8 py-4 text-base"
                >
                  <Eye className="h-5 w-5" />
                  {t("viewOnline")}
                </Button>
              </div>

              <Separator className="my-12" />

              {/* Table of Contents */}
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{t("tableOfContents")}</h2>
                  <p className="text-lg text-gray-600">{t("exploreSection")}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sections.map((section, index) => {
                    const IconComponent = section.icon;
                    return (
                      <Card 
                        key={section.id}
                        className="hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-2 border-gray-200 hover:border-gray-300"
                        onClick={() => handleSectionClick(section.id)}
                      >
                        <CardContent className="p-8">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                              <IconComponent className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm text-gray-500 mb-1">{String(index + 1).padStart(2, '0')}</div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h3>
                              <ArrowRight className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Key Highlights */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-sm">
                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">{t("keyHighlights")}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                        <Shield className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{t("transparency")}</h3>
                      <p className="text-sm text-gray-600">{t("transparencyDesc")}</p>
                    </div>
                    <div className="text-center">
                      <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
                        <Coins className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{t("blockchain")}</h3>
                      <p className="text-sm text-gray-600">{t("blockchainDesc")}</p>
                    </div>
                    <div className="text-center">
                      <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center">
                        <Users className="h-8 w-8 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{t("community")}</h3>
                      <p className="text-sm text-gray-600">{t("communityDesc")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Section view
            <div className="space-y-8">
              {/* Back button */}
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setActiveSection(null)}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-6 py-3"
                >
                  ← {t("back")}
                </Button>
                <div className="text-sm text-gray-500">
                  {t("whitepaper")} / {sections.find(s => s.id === activeSection)?.title}
                </div>
              </div>

              {/* Section content */}
              {renderSection()}
            </div>
          )}
        </div>
      </main>
    </>
  );
}