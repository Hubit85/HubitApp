import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Phone,
  Settings,
  FileText,
  Coins,
  Wallet
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface HelpModalProps {
  children: React.ReactNode;
}

export default function HelpModal({ children }: HelpModalProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">{t("helpCenter")}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {t("helpCenterDescription")}
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder={t("searchHelp")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 py-3 text-lg border-2 border-gray-200 focus:border-black rounded-lg"
        />
      </div>

      {/* Popular Topics */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">{t("popularTopics")}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {popularTopics.map((topic) => {
            const IconComponent = topic.icon;
            return (
              <Card 
                key={topic.key}
                className="hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-0.5 border-gray-200 hover:border-gray-300"
                onClick={() => handleCategorySelect(topic.key)}
              >
                <CardContent className="p-4 text-center">
                  <IconComponent className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm font-medium text-gray-700">{t(topic.key)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* User Role Specific Help */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Help by User Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userRoles.map((role) => {
            const IconComponent = role.icon;
            return (
              <Card 
                key={role.key}
                className={`${role.color} transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1 border-2`}
                onClick={() => handleCategorySelect(role.key)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                        <IconComponent className={`h-6 w-6 ${role.iconColor}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{t(role.key)}</h4>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Contact Support Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">{t("stillNeedHelp")}</h3>
          <p className="text-gray-600">{t("contactSupportTeam")}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white hover:bg-gray-50"
            >
              <Mail className="h-4 w-4" />
              {t("emailSupport")}
            </Button>
            <Button 
              className="flex items-center gap-2 bg-black hover:bg-gray-800"
            >
              <MessageSquare className="h-4 w-4" />
              {t("liveChat")}
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{t("supportHours")}</span>
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
      <div className="space-y-6">
        {/* Back Button and Header */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            onClick={handleBackToMain}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            ← {t("back")}
          </Button>
        </div>

        <div className="text-center space-y-2">
          {roleData && (
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`p-3 rounded-lg bg-white shadow-sm border-2 ${roleData.color.split(' ')[1]} ${roleData.color.split(' ')[2]}`}>
                <roleData.icon className={`h-8 w-8 ${roleData.iconColor}`} />
              </div>
            </div>
          )}
          <h2 className="text-3xl font-bold text-gray-900">{t(selectedCategory)}</h2>
        </div>

        {/* Help Articles */}
        <div className="space-y-3">
          {categoryHelp?.map((helpItem) => (
            <Card 
              key={helpItem}
              className="hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-0.5 border-gray-200 hover:border-gray-300"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="h-5 w-5 text-gray-400" />
                    <span className="font-medium text-gray-900">{t(helpItem)}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Common HBIT Topics */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">{t("hbitTokens")}</h3>
          <div className="grid grid-cols-1 gap-3">
            <Card className="hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-0.5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Wallet className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-gray-900">{t("howToUseHbit")}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-0.5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Settings className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">{t("walletSetup")}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-0.5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Coins className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-gray-900">{t("tokenBenefits")}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">{t("stillNeedHelp")}</h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2 bg-white hover:bg-gray-50"
              >
                <Mail className="h-4 w-4" />
                {t("emailSupport")}
              </Button>
              <Button 
                size="sm"
                className="flex items-center gap-2 bg-black hover:bg-gray-800"
              >
                <MessageSquare className="h-4 w-4" />
                {t("liveChat")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>{t("helpCenter")}</DialogTitle>
        </DialogHeader>
        <div className="p-2">
          {selectedCategory ? renderCategoryView() : renderMainView()}
        </div>
      </DialogContent>
    </Dialog>
  );
}