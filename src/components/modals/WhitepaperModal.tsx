
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  ExternalLink, 
  TrendingUp, 
  Users, 
  Zap, 
  Globe, 
  Calendar,
  Target,
  DollarSign,
  CheckCircle,
  Rocket,
  Award
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface WhitepaperModalProps {
  children: React.ReactNode;
}

export default function WhitepaperModal({ children }: WhitepaperModalProps) {
  const { t } = useLanguage();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-white border-2 border-gray-200">
        <DialogHeader className="px-8 pt-8 pb-6 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText className="h-6 w-6 text-black" />
            </div>
            <DialogTitle className="text-3xl font-bold tracking-tight text-black">
              {t("whitepaperTitle")}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 text-lg">
            {t("whitepaperSubtitle")}
          </DialogDescription>
          <div className="flex items-center gap-2 mt-3">
            <Globe className="h-4 w-4 text-gray-500" />
            <a 
              href="https://hubit.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-black transition-colors underline"
            >
              https://hubit.io
            </a>
            <ExternalLink className="h-3 w-3 text-gray-400" />
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-200px)] px-8 pb-8 whitepaper-scroll ultra-slow-scroll">
          <div className="space-y-8 pt-6">
            {/* Executive Summary */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Target className="h-5 w-5 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-black">1. {t("executiveSummary")}</h2>
              </div>
              <Card className="border-l-4 border-l-black">
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {t("executiveSummaryText")}
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-black mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      {t("whySolana")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-black">{"<$0.01"}</div>
                        <div className="text-sm text-gray-600">{t("lowFees")}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-black">~2,000</div>
                        <div className="text-sm text-gray-600">{t("highSpeed")}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-black">✓</div>
                        <div className="text-sm text-gray-600">{t("massAdoption")}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Tokenomics */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-black">2. {t("tokenomics")}</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-black">
                      <Award className="h-5 w-5" />
                      {t("tokenDetails")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("tokenName")}</span>
                      <Badge variant="outline" className="font-mono border-black text-black">HuBiT</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("blockchain")}</span>
                      <Badge className="bg-gray-100 text-black border border-gray-300">Solana (SPL)</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("totalSupply")}</span>
                      <span className="font-semibold text-black">1,000,000,000 HuBiT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t("contract")}</span>
                      <span className="text-sm text-gray-500">{t("toBeDeployed")}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-black">
                      <TrendingUp className="h-5 w-5" />
                      {t("distribution")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{t("teamAdvisors")}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-1/5 h-full bg-black"></div>
                          </div>
                          <span className="text-sm font-medium">20%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{t("communityRewards")}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-2/5 h-full bg-gray-600"></div>
                          </div>
                          <span className="text-sm font-medium">10%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{t("ecosystemFund")}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-2/5 h-full bg-gray-500"></div>
                          </div>
                          <span className="text-sm font-medium">10%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{t("publicCirculation")}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-gray-800"></div>
                          </div>
                          <span className="text-sm font-medium">60%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gray-50 border-gray-200">
                <CardHeader>
                  <CardTitle className="text-black">{t("utility")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-black" />
                    <span className="text-gray-700"><strong>{t("holdHubit")}</strong> {t("holdHubitDesc")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-black" />
                    <span className="text-gray-700"><strong>{t("payAsYouGo")}</strong> {t("payAsYouGoDesc")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-black" />
                    <span className="text-gray-700"><strong>{t("staking")}</strong> {t("stakingDesc")}</span>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Roadmap */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-black">3. {t("roadmap")}</h2>
              </div>
              
              <div className="space-y-6">
                <Card className="border-l-4 border-l-black">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-black">
                      <CheckCircle className="h-5 w-5" />
                      {t("q3Title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-black" />
                      <span className="text-sm text-gray-700"><strong>{t("mvpDevelopment")}</strong> {t("mvpDevelopmentDesc")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-black" />
                      <span className="text-sm text-gray-700"><strong>{t("brandLaunch")}</strong> {t("brandLaunchDesc")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-black" />
                      <span className="text-sm text-gray-700"><strong>{t("tokenDeployment")}</strong> {t("tokenDeploymentDesc")}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-gray-600">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-black">
                      <Rocket className="h-5 w-5" />
                      {t("q4Title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-700"><strong>{t("appBetaRelease")}</strong> {t("appBetaReleaseDesc")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-700"><strong>{t("listings")}</strong> {t("listingsDesc")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-700"><strong>{t("partnerships")}</strong> {t("partnershipsDesc")}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-gray-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-black">
                      <Globe className="h-5 w-5" />
                      {t("q1Title")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700"><strong>{t("globalExpansion")}</strong> {t("globalExpansionDesc")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700"><strong>{t("tenThousandUsers")}</strong> {t("tenThousandUsersDesc")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700"><strong>{t("governanceDao")}</strong> {t("governanceDaoDesc")}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Separator className="bg-gray-200" />

            {/* Call to Action */}
            <div className="text-center py-6">
              <p className="text-lg text-gray-600 mb-4">
                {t("joinCommunity")}
              </p>
              <Button 
                size="lg" 
                className="bg-black hover:bg-gray-800 text-white px-8 transition-all duration-200 hover:scale-105 flex items-center gap-2 mx-auto"
                onClick={() => window.open("https://twitter.com/HuBiTofficial", "_blank")}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                {t("followTwitter")}
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
