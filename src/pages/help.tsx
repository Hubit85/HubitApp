import React, { useState } from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Search, 
  Users, 
  User, 
  Wrench, 
  Building, 
  CreditCard, 
  Shield, 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Clock,
  ArrowRight,
  ChevronRight,
  Settings,
  FileText,
  Coins,
  Wallet
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function HelpPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Popular topics data
  const popularTopics = [
    { key: "gettingStarted", icon: HelpCircle },
    { key: "accountSettings", icon: Settings },
    { key: "paymentsAndBilling", icon: CreditCard },
    { key: "servicesManagement", icon: Wrench },
    { key: "communityFeatures", icon: Users },
    { key: "troubleshooting", icon: FileText },
    { key: "safetyAndSecurity", icon: Shield },
    { key: "hbitTokens", icon: Coins }
  ];

  // User role categories
  const userRoles = [
    { 
      key: "helpForCommunityMembers", 
      icon: Users, 
      color: "bg-blue-50 border-blue-200 hover:border-blue-300",
      iconColor: "text-blue-600"
    },
    { 
      key: "helpForIndividuals", 
      icon: User, 
      color: "bg-green-50 border-green-200 hover:border-green-300",
      iconColor: "text-green-600"
    },
    { 
      key: "helpForServiceProviders", 
      icon: Wrench, 
      color: "bg-purple-50 border-purple-200 hover:border-purple-300",
      iconColor: "text-purple-600"
    },
    { 
      key: "helpForPropertyAdministrators", 
      icon: Building, 
      color: "bg-orange-50 border-orange-200 hover:border-orange-300",
      iconColor: "text-orange-600"
    }
  ];

  // Detailed help sections
  const helpSections = {
    helpForCommunityMembers: [
      "howToReportIssues",
      "howToRequestServices", 
      "howToRateServices",
      "communityPayments",
      "neighborCommunication"
    ],
    helpForIndividuals: [
      "findingServices",
      "personalServiceRequests",
      "individualPayments", 
      "personalAccount"
    ],
    helpForServiceProviders: [
      "createProviderProfile",
      "manageServiceOfferings",
      "respondToRequests",
      "providerPayments",
      "buildReputation"
    ],
    helpForPropertyAdministrators: [
      "manageProperties",
      "coordinateServices",
      "budgetManagement",
      "residentCommunication",
      "maintenanceScheduling"
    ]
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleBackToMain = () => {
    setSelectedCategory(null);
    setSearchQuery("");
  };

  const renderMainView = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{t("helpCenter")}</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t("helpCenterDescription")}
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
          <Input
            type="text"
            placeholder={t("searchHelp")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-4 text-lg border-2 border-gray-200 focus:border-black rounded-xl shadow-sm"
          />
        </div>
      </div>

      {/* Popular Topics */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("popularTopics")}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {popularTopics.map((topic) => {
            const IconComponent = topic.icon;
            return (
              <Card 
                key={topic.key}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1 border-gray-200 hover:border-gray-300"
                onClick={() => handleCategorySelect(topic.key)}
              >
                <CardContent className="p-6 text-center">
                  <IconComponent className="h-8 w-8 mx-auto mb-3 text-gray-600" />
                  <p className="text-sm font-medium text-gray-700">{t(topic.key)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* User Role Specific Help */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Help by User Type</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {userRoles.map((role) => {
            const IconComponent = role.icon;
            return (
              <Card 
                key={role.key}
                className={`${role.color} transition-all duration-200 cursor-pointer hover:shadow-xl hover:-translate-y-2 border-2`}
                onClick={() => handleCategorySelect(role.key)}
              >
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl bg-white shadow-md`}>
                        <IconComponent className={`h-8 w-8 ${role.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{t(role.key)}</h3>
                      </div>
                    </div>
                    <ChevronRight className="h-6 w-6 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Contact Support Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-sm">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">{t("stillNeedHelp")}</h2>
          <p className="text-lg text-gray-600">{t("contactSupportTeam")}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              size="lg"
              className="flex items-center gap-3 bg-white hover:bg-gray-50 px-8 py-4 text-base"
            >
              <Mail className="h-5 w-5" />
              {t("emailSupport")}
            </Button>
            <Button 
              size="lg"
              className="flex items-center gap-3 bg-black hover:bg-gray-800 px-8 py-4 text-base"
            >
              <MessageSquare className="h-5 w-5" />
              {t("liveChat")}
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Clock className="h-5 w-5" />
            <span className="text-base">{t("supportHours")}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCategoryView = () => {
    if (!selectedCategory) return null;

    const categoryHelp = helpSections[selectedCategory as keyof typeof helpSections];
    const roleData = userRoles.find(role => role.key === selectedCategory);

    return (
      <div className="space-y-8">
        {/* Back Button and Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={handleBackToMain}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-6 py-3"
          >
            ← {t("back")}
          </Button>
        </div>

        <div className="text-center space-y-4">
          {roleData && (
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className={`p-4 rounded-2xl bg-white shadow-lg border-2 ${roleData.color.split(' ')[1]} ${roleData.color.split(' ')[2]}`}>
                <roleData.icon className={`h-12 w-12 ${roleData.iconColor}`} />
              </div>
            </div>
          )}
          <h1 className="text-4xl font-bold text-gray-900">{t(selectedCategory)}</h1>
        </div>

        {/* Help Articles */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Articles & Guides</h2>
          {categoryHelp?.map((helpItem) => (
            <Card 
              key={helpItem}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1 border-gray-200 hover:border-gray-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <HelpCircle className="h-6 w-6 text-gray-400" />
                    <span className="text-lg font-medium text-gray-900">{t(helpItem)}</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Common HBIT Topics */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">{t("hbitTokens")}</h2>
          <div className="grid grid-cols-1 gap-4">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Wallet className="h-6 w-6 text-green-600" />
                    <span className="text-lg font-medium text-gray-900">{t("howToUseHbit")}</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Settings className="h-6 w-6 text-blue-600" />
                    <span className="text-lg font-medium text-gray-900">{t("walletSetup")}</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Coins className="h-6 w-6 text-purple-600" />
                    <span className="text-lg font-medium text-gray-900">{t("tokenBenefits")}</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-sm">
          <div className="text-center space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">{t("stillNeedHelp")}</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                size="lg"
                className="flex items-center gap-3 bg-white hover:bg-gray-50 px-6 py-3"
              >
                <Mail className="h-5 w-5" />
                {t("emailSupport")}
              </Button>
              <Button 
                size="lg"
                className="flex items-center gap-3 bg-black hover:bg-gray-800 px-6 py-3"
              >
                <MessageSquare className="h-5 w-5" />
                {t("liveChat")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>{t("helpCenter")} - {t("hubit")}</title>
        <meta name="description" content={t("helpCenterDescription")} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {selectedCategory ? renderCategoryView() : renderMainView()}
        </div>
      </main>
    </>
  );
}