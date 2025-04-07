
import React, { useState } from "react";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wrench, Zap, Paintbrush, Grid, Droplet, Thermometer, Home, Lock, Hammer, Trees, Truck, Wifi, Calendar, ClipboardList, Building, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";
import { useRouter } from "next/router";

// Define repair category type
interface RepairCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

// Define bid type
interface Bid {
  id: string;
  amount: string;
  scope: string;
  company: string;
}

// Define community request type
interface CommunityRequest {
  id: string;
  budget: string;
  description: string;
  category: string;
}

export default function ServiceProviderDashboard() {
  const [activeTab, setActiveTab] = useState("plumbing");
  const { t } = useLanguage();
  const router = useRouter();
  
  // Define repair categories with icons
  const repairCategories: RepairCategory[] = [
    { id: "plumbing", name: t("plumbing"), icon: <Droplet className="mr-2 h-5 w-5" /> },
    { id: "electrical", name: t("electrical"), icon: <Zap className="mr-2 h-5 w-5" /> },
    { id: "painting", name: t("painting"), icon: <Paintbrush className="mr-2 h-5 w-5" /> },
    { id: "flooring", name: t("flooring"), icon: <Grid className="mr-2 h-5 w-5" /> },
    { id: "roofing", name: t("roofing"), icon: <Home className="mr-2 h-5 w-5" /> },
    { id: "hvac", name: t("hvac"), icon: <Thermometer className="mr-2 h-5 w-5" /> },
    { id: "carpentry", name: t("carpentry"), icon: <Hammer className="mr-2 h-5 w-5" /> },
    { id: "locksmith", name: t("locksmith"), icon: <Lock className="mr-2 h-5 w-5" /> },
    { id: "appliance", name: t("applianceRepair"), icon: <Wrench className="mr-2 h-5 w-5" /> },
    { id: "landscaping", name: t("landscaping"), icon: <Trees className="mr-2 h-5 w-5" /> },
    { id: "moving", name: t("movingServices"), icon: <Truck className="mr-2 h-5 w-5" /> },
    { id: "networking", name: t("homeNetworking"), icon: <Wifi className="mr-2 h-5 w-5" /> },
  ];

  // Sample bids data for each category - 10 bids per category
  const bidData = {
    plumbing: [
      { id: "plumbing-1", amount: "$450", scope: t("bathroomPlumbingOverhaul"), company: t("elitePlumbingSolutions") },
      { id: "plumbing-2", amount: "$280", scope: t("kitchenSinkInstallation"), company: t("waterworksPro") },
      { id: "plumbing-3", amount: "$175", scope: t("toiletRepair"), company: t("reliableHomeServices") },
      { id: "plumbing-4", amount: "$320", scope: t("leakDetection"), company: t("precisionPlumbers") },
      { id: "plumbing-5", amount: "$550", scope: t("fullHousePlumbing"), company: t("masterPlumbingCo") },
      { id: "plumbing-6", amount: "$225", scope: t("showerInstallation"), company: t("qualityPlumbing") },
      { id: "plumbing-7", amount: "$375", scope: t("drainCleaning"), company: t("drainMasters") },
      { id: "plumbing-8", amount: "$490", scope: t("waterHeaterReplacement"), company: t("hotWaterExperts") },
      { id: "plumbing-9", amount: "$150", scope: t("faucetReplacement"), company: t("fixItPlumbing") },
      { id: "plumbing-10", amount: "$600", scope: t("sewerLineRepair"), company: t("deepDrainServices") }
    ],
    electrical: [
      { id: "electrical-1", amount: "$350", scope: t("homeRewiring"), company: t("powerElectrical") },
      { id: "electrical-2", amount: "$220", scope: t("outletInstallation"), company: t("voltExperts") },
      { id: "electrical-3", amount: "$275", scope: t("lightingInstallation"), company: t("brightSolutions") },
      { id: "electrical-4", amount: "$400", scope: t("panelUpgrade"), company: t("circuitPros") },
      { id: "electrical-5", amount: "$180", scope: t("ceilingFanInstallation"), company: t("fanMasters") },
      { id: "electrical-6", amount: "$320", scope: t("electricalInspection"), company: t("safetyFirst") },
      { id: "electrical-7", amount: "$450", scope: t("generatorInstallation"), company: t("powerBackup") },
      { id: "electrical-8", amount: "$195", scope: t("switchReplacement"), company: t("switchItUp") },
      { id: "electrical-9", amount: "$550", scope: t("smartHomeWiring"), company: t("smartElectric") },
      { id: "electrical-10", amount: "$290", scope: t("outdoorLighting"), company: t("nightLightPros") }
    ],
    painting: [
      { id: "painting-1", amount: "$1200", scope: t("interiorPainting"), company: t("colorMasters") },
      { id: "painting-2", amount: "$1500", scope: t("exteriorPainting"), company: t("freshCoatPros") },
      { id: "painting-3", amount: "$350", scope: t("accentWall"), company: t("accentArtistry") },
      { id: "painting-4", amount: "$800", scope: t("cabinetRefinishing"), company: t("cabinetRenew") },
      { id: "painting-5", amount: "$950", scope: t("deckStaining"), company: t("deckRevival") },
      { id: "painting-6", amount: "$600", scope: t("wallpaperRemoval"), company: t("smoothWalls") },
      { id: "painting-7", amount: "$400", scope: t("textureApplication"), company: t("textureArtists") },
      { id: "painting-8", amount: "$1800", scope: t("commercialPainting"), company: t("proPainters") },
      { id: "painting-9", amount: "$250", scope: t("trimPainting"), company: t("detailPainters") },
      { id: "painting-10", amount: "$700", scope: t("fenceStaining"), company: t("fenceRefresh") }
    ],
    flooring: [
      { id: "flooring-1", amount: "$2800", scope: t("hardwoodInstallation"), company: t("hardwoodHeroes") },
      { id: "flooring-2", amount: "$1500", scope: t("tileFlorInstallation"), company: t("tileExperts") },
      { id: "flooring-3", amount: "$900", scope: t("carpetInstallation"), company: t("carpetKings") },
      { id: "flooring-4", amount: "$1200", scope: t("vinylInstallation"), company: t("vinylPros") },
      { id: "flooring-5", amount: "$650", scope: t("floorRefinishing"), company: t("floorRevival") },
      { id: "flooring-6", amount: "$400", scope: t("laminateInstallation"), company: t("laminateLords") },
      { id: "flooring-7", amount: "$350", scope: t("floorRepair"), company: t("repairRight") },
      { id: "flooring-8", amount: "$1800", scope: t("marbleInstallation"), company: t("marbleMasters") },
      { id: "flooring-9", amount: "$550", scope: t("subfloorRepair"), company: t("foundationFix") },
      { id: "flooring-10", amount: "$2500", scope: t("radiantFloorHeating"), company: t("warmWalkers") }
    ],
    roofing: [
      { id: "roofing-1", amount: "$7500", scope: t("completeRoofReplacement"), company: t("topRoofing") },
      { id: "roofing-2", amount: "$900", scope: t("roofRepair"), company: t("leakStoppers") },
      { id: "roofing-3", amount: "$1200", scope: t("gutterInstallation"), company: t("gutterGuards") },
      { id: "roofing-4", amount: "$600", scope: t("chimneyRepair"), company: t("chimneyChamps") },
      { id: "roofing-5", amount: "$350", scope: t("ventInstallation"), company: t("ventilationPros") },
      { id: "roofing-6", amount: "$4500", scope: t("metalRoofInstallation"), company: t("metalMasters") },
      { id: "roofing-7", amount: "$800", scope: t("skylightInstallation"), company: t("skyBrights") },
      { id: "roofing-8", amount: "$1500", scope: t("flatRoofCoating"), company: t("flatRoofExperts") },
      { id: "roofing-9", amount: "$2800", scope: t("solarRoofInstallation"), company: t("solarRoofing") },
      { id: "roofing-10", amount: "$450", scope: t("roofInspection"), company: t("roofInspectors") }
    ],
    hvac: [
      { id: "hvac-1", amount: "$3500", scope: t("acInstallation"), company: t("coolAirPros") },
      { id: "hvac-2", amount: "$2800", scope: t("furnaceInstallation"), company: t("heatMasters") },
      { id: "hvac-3", amount: "$350", scope: t("hvacMaintenance"), company: t("systemService") },
      { id: "hvac-4", amount: "$600", scope: t("ductCleaning"), company: t("freshAirDucts") },
      { id: "hvac-5", amount: "$1200", scope: t("heatPumpInstallation"), company: t("efficientHeat") },
      { id: "hvac-6", amount: "$450", scope: t("thermostatInstallation"), company: t("smartControl") },
      { id: "hvac-7", amount: "$800", scope: t("ventilationImprovement"), company: t("airFlowExperts") },
      { id: "hvac-8", amount: "$250", scope: t("filterReplacement"), company: t("cleanAirSystems") },
      { id: "hvac-9", amount: "$1500", scope: t("zoneSystemInstallation"), company: t("comfortZones") },
      { id: "hvac-10", amount: "$900", scope: t("refrigerantRecharge"), company: t("coolantPros") }
    ],
    carpentry: [
      { id: "carpentry-1", amount: "$1800", scope: t("customCabinetry"), company: t("cabinetCraftsmen") },
      { id: "carpentry-2", amount: "$1200", scope: t("deckConstruction"), company: t("deckBuilders") },
      { id: "carpentry-3", amount: "$800", scope: t("crownMolding"), company: t("crownKings") },
      { id: "carpentry-4", amount: "$2500", scope: t("customClosets"), company: t("closetCreations") },
      { id: "carpentry-5", amount: "$950", scope: t("stairwayRenovation"), company: t("stairMasters") },
      { id: "carpentry-6", amount: "$600", scope: t("doorInstallation"), company: t("doorExperts") },
      { id: "carpentry-7", amount: "$1500", scope: t("windowReplacement"), company: t("clearViewPros") },
      { id: "carpentry-8", amount: "$3500", scope: t("kitchenRemodel"), company: t("kitchenCraft") },
      { id: "carpentry-9", amount: "$400", scope: t("trimWork"), company: t("trimArtisans") },
      { id: "carpentry-10", amount: "$1100", scope: t("customShelving"), company: t("shelfSolutions") }
    ],
    locksmith: [
      { id: "locksmith-1", amount: "$150", scope: t("lockRekeying"), company: t("keyMasters") },
      { id: "locksmith-2", amount: "$250", scope: t("deadboltInstallation"), company: t("secureLocks") },
      { id: "locksmith-3", amount: "$350", scope: t("smartLockInstallation"), company: t("smartSecurity") },
      { id: "locksmith-4", amount: "$120", scope: t("lockoutService"), company: t("quickAccess") },
      { id: "locksmith-5", amount: "$200", scope: t("safeCombinationChange"), company: t("safeExperts") },
      { id: "locksmith-6", amount: "$180", scope: t("mailboxLockReplacement"), company: t("mailSecure") },
      { id: "locksmith-7", amount: "$300", scope: t("highSecurityLocks"), company: t("fortressLocks") },
      { id: "locksmith-8", amount: "$450", scope: t("keylessSecurity"), company: t("modernLocks") },
      { id: "locksmith-9", amount: "$275", scope: t("cabinetLocks"), company: t("secureCabinets") },
      { id: "locksmith-10", amount: "$500", scope: t("completeHomeRekeying"), company: t("totalSecurity") }
    ],
    appliance: [
      { id: "appliance-1", amount: "$200", scope: t("refrigeratorRepair"), company: t("coolFixers") },
      { id: "appliance-2", amount: "$150", scope: t("washerRepair"), company: t("washWizards") },
      { id: "appliance-3", amount: "$175", scope: t("dryerRepair"), company: t("dryerDocs") },
      { id: "appliance-4", amount: "$225", scope: t("dishwasherRepair"), company: t("dishDoctors") },
      { id: "appliance-5", amount: "$180", scope: t("ovenRepair"), company: t("ovenExperts") },
      { id: "appliance-6", amount: "$120", scope: t("microwaveRepair"), company: t("microTechs") },
      { id: "appliance-7", amount: "$250", scope: t("rangeHoodRepair"), company: t("ventPros") },
      { id: "appliance-8", amount: "$300", scope: t("iceMarkerRepair"), company: t("iceFixers") },
      { id: "appliance-9", amount: "$275", scope: t("garbageDisposalRepair"), company: t("disposalDocs") },
      { id: "appliance-10", amount: "$350", scope: t("wineCollerRepair"), company: t("wineTechs") }
    ],
    landscaping: [
      { id: "landscaping-1", amount: "$1200", scope: t("lawnDesign"), company: t("lawnArtists") },
      { id: "landscaping-2", amount: "$800", scope: t("gardenInstallation"), company: t("gardenGurus") },
      { id: "landscaping-3", amount: "$350", scope: t("treeTriming"), company: t("treeTrimmers") },
      { id: "landscaping-4", amount: "$2500", scope: t("outdoorKitchen"), company: t("outdoorLiving") },
      { id: "landscaping-5", amount: "$1500", scope: t("irrigationSystem"), company: t("waterWise") },
      { id: "landscaping-6", amount: "$600", scope: t("fenceInstallation"), company: t("boundaryPros") },
      { id: "landscaping-7", amount: "$900", scope: t("patioConstruction"), company: t("patioBuilders") },
      { id: "landscaping-8", amount: "$450", scope: t("mulchingService"), company: t("groundCovers") },
      { id: "landscaping-9", amount: "$750", scope: t("retainingWall"), company: t("wallWorks") },
      { id: "landscaping-10", amount: "$1800", scope: t("waterFeature"), company: t("waterWonders") }
    ],
    moving: [
      { id: "moving-1", amount: "$800", scope: t("localMove"), company: t("cityMovers") },
      { id: "moving-2", amount: "$2500", scope: t("longDistanceMove"), company: t("distanceMovers") },
      { id: "moving-3", amount: "$400", scope: t("furnitureDelivery"), company: t("furnitureShippers") },
      { id: "moving-4", amount: "$350", scope: t("packingServices"), company: t("packPros") },
      { id: "moving-5", amount: "$250", scope: t("loadingServices"), company: t("heavyLifters") },
      { id: "moving-6", amount: "$1200", scope: t("officeRelocation"), company: t("businessMovers") },
      { id: "moving-7", amount: "$600", scope: t("pianoMoving"), company: t("pianoTransport") },
      { id: "moving-8", amount: "$300", scope: t("storageServices"), company: t("secureStorage") },
      { id: "moving-9", amount: "$450", scope: t("applianceMoving"), company: t("applianceShifters") },
      { id: "moving-10", amount: "$1500", scope: t("internationalShipping"), company: t("globalMovers") }
    ],
    networking: [
      { id: "networking-1", amount: "$350", scope: t("wifiSetup"), company: t("wifiWizards") },
      { id: "networking-2", amount: "$500", scope: t("homeNetworkInstallation"), company: t("networkNinjas") },
      { id: "networking-3", amount: "$250", scope: t("routerConfiguration"), company: t("routerPros") },
      { id: "networking-4", amount: "$800", scope: t("smartHomeIntegration"), company: t("smartIntegrators") },
      { id: "networking-5", amount: "$450", scope: t("securityCameraInstallation"), company: t("securityVision") },
      { id: "networking-6", amount: "$600", scope: t("meshNetworkSetup"), company: t("meshMasters") },
      { id: "networking-7", amount: "$300", scope: t("tvMounting"), company: t("displayDoctors") },
      { id: "networking-8", amount: "$750", scope: t("homeTheaterSetup"), company: t("theaterTechs") },
      { id: "networking-9", amount: "$400", scope: t("gamingNetworkOptimization"), company: t("gamingGurus") },
      { id: "networking-10", amount: "$550", scope: t("officeNetworkSetup"), company: t("businessTech") }
    ]
  };

  // Sample community requests data - 3 per category
  const communityRequestsData = {
    plumbing: [
      { id: "plumbing-req-1", budget: "$300", description: t("bathroomSinkInstallation"), category: "plumbing" },
      { id: "plumbing-req-2", budget: "$450", description: t("showerLeakRepair"), category: "plumbing" },
      { id: "plumbing-req-3", budget: "$600", description: t("waterHeaterInstallation"), category: "plumbing" }
    ],
    electrical: [
      { id: "electrical-req-1", budget: "$250", description: t("electricalOutletInstallation"), category: "electrical" },
      { id: "electrical-req-2", budget: "$400", description: t("ceilingFanWiring"), category: "electrical" },
      { id: "electrical-req-3", budget: "$800", description: t("homeRewiring"), category: "electrical" }
    ],
    painting: [
      { id: "painting-req-1", budget: "$500", description: t("livingRoomPainting"), category: "painting" },
      { id: "painting-req-2", budget: "$750", description: t("exteriorHousePainting"), category: "painting" },
      { id: "painting-req-3", budget: "$300", description: t("kitchenCabinetPainting"), category: "painting" }
    ],
    flooring: [
      { id: "flooring-req-1", budget: "$400", description: t("hardwoodFloorRepair"), category: "flooring" },
      { id: "flooring-req-2", budget: "$1200", description: t("kitchenTileInstallation"), category: "flooring" },
      { id: "flooring-req-3", budget: "$900", description: t("basementCarpetInstallation"), category: "flooring" }
    ],
    roofing: [
      { id: "roofing-req-1", budget: "$800", description: t("roofLeakRepair"), category: "roofing" },
      { id: "roofing-req-2", budget: "$5000", description: t("completeRoofReplacement"), category: "roofing" },
      { id: "roofing-req-3", budget: "$600", description: t("gutterCleaning"), category: "roofing" }
    ],
    hvac: [
      { id: "hvac-req-1", budget: "$350", description: t("acMaintenance"), category: "hvac" },
      { id: "hvac-req-2", budget: "$2500", description: t("furnaceReplacement"), category: "hvac" },
      { id: "hvac-req-3", budget: "$450", description: t("ductCleaning"), category: "hvac" }
    ],
    carpentry: [
      { id: "carpentry-req-1", budget: "$275", description: t("customShelvingInstallation"), category: "carpentry" },
      { id: "carpentry-req-2", budget: "$1500", description: t("deckBuilding"), category: "carpentry" },
      { id: "carpentry-req-3", budget: "$800", description: t("kitchenCabinetInstallation"), category: "carpentry" }
    ],
    locksmith: [
      { id: "locksmith-req-1", budget: "$150", description: t("lockReplacement"), category: "locksmith" },
      { id: "locksmith-req-2", budget: "$300", description: t("smartLockInstallation"), category: "locksmith" },
      { id: "locksmith-req-3", budget: "$200", description: t("safeUnlocking"), category: "locksmith" }
    ],
    appliance: [
      { id: "appliance-req-1", budget: "$200", description: t("refrigeratorRepair"), category: "appliance" },
      { id: "appliance-req-2", budget: "$175", description: t("dishwasherInstallation"), category: "appliance" },
      { id: "appliance-req-3", budget: "$225", description: t("ovenRepair"), category: "appliance" }
    ],
    landscaping: [
      { id: "landscaping-req-1", budget: "$600", description: t("gardenDesign"), category: "landscaping" },
      { id: "landscaping-req-2", budget: "$350", description: t("lawnCare"), category: "landscaping" },
      { id: "landscaping-req-3", budget: "$1200", description: t("sprinklerSystemInstallation"), category: "landscaping" }
    ],
    moving: [
      { id: "moving-req-1", budget: "$500", description: t("apartmentMove"), category: "moving" },
      { id: "moving-req-2", budget: "$300", description: t("furnitureRearrangement"), category: "moving" },
      { id: "moving-req-3", budget: "$1500", description: t("crossCountryMove"), category: "moving" }
    ],
    networking: [
      { id: "networking-req-1", budget: "$250", description: t("wifiNetworkSetup"), category: "networking" },
      { id: "networking-req-2", budget: "$400", description: t("smartHomeConfiguration"), category: "networking" },
      { id: "networking-req-3", budget: "$600", description: t("securityCameraInstallation"), category: "networking" }
    ]
  };
  
  // Get bids for the active category
  const categoryBids = bidData[activeTab as keyof typeof bidData] || [];
  
  // Get community requests for the active category
  const filteredRequests = communityRequestsData[activeTab as keyof typeof communityRequestsData] || [];

  // Function to handle navigation to administrator dashboard
  const handleAdminDashboardClick = () => {
    router.push("/administrador-fincas");
  };

  return (
    <>
      <Head>
        <title>{t("serviceProviderDashboard")} | {t("handyman")}</title>
        <meta name="description" content={t("serviceProviderDesc")} />
      </Head>
      
      <Header />
      
      <div className="flex h-screen bg-gray-100 pt-16">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white shadow-lg">
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">{t("dashboard")}</h2>
            <nav className="space-y-2">
              <Button 
                variant={activeTab === "overview" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("overview")}
              >
                <MapPin className="mr-2 h-5 w-5" />
                {t("overview")}
              </Button>
              <Button 
                variant={activeTab === "plumbing" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("plumbing")}
              >
                <Droplet className="mr-2 h-5 w-5" />
                {t("plumbing")}
              </Button>
              <Button 
                variant={activeTab === "electrical" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("electrical")}
              >
                <Zap className="mr-2 h-5 w-5" />
                {t("electrical")}
              </Button>
              <Button 
                variant={activeTab === "painting" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("painting")}
              >
                <Paintbrush className="mr-2 h-5 w-5" />
                {t("painting")}
              </Button>
              <Button 
                variant={activeTab === "carpentry" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setActiveTab("carpentry")}
              >
                <Hammer className="mr-2 h-5 w-5" />
                {t("carpentry")}
              </Button>
              <Button 
                variant={activeTab === "admin" ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => handleAdminDashboardClick()}
              >
                <Building className="mr-2 h-5 w-5" />
                {t("estateAdministrator")}
              </Button>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">
              {activeTab === "overview" ? t("serviceProviderDashboard") : 
               repairCategories.find(c => c.id === activeTab)?.name + " " + t("services")}
            </h1>
            
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">{t("serviceOverview")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {repairCategories.slice(0, 6).map((category) => (
                    <Card key={category.id} className="hover:bg-gray-50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          {category.icon}
                          <div>
                            <h3 className="font-bold text-lg">{category.name}</h3>
                            <p className="text-gray-600">
                              {bidData[category.id as keyof typeof bidData]?.length || 0} {t("activeBids")}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2 w-full"
                          onClick={() => setActiveTab(category.id)}
                        >
                          {t("viewDetails")}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            
            {/* Service Category Tabs */}
            {activeTab !== "overview" && activeTab !== "admin" && (
              <div className="grid grid-cols-1 gap-8">
                {/* Bids Section */}
                <Card className="shadow-md">
                  <CardHeader className="bg-white border-b">
                    <CardTitle className="text-xl flex items-center justify-between">
                      <span>{t("activeBids")}</span>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                        {categoryBids.length} {t("bids")}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {categoryBids.map((bid) => (
                        <div key={bid.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{bid.company}</h3>
                            <span className="text-lg font-bold text-blue-600">{bid.amount}</span>
                          </div>
                          <p className="text-gray-600 mb-3">{bid.scope}</p>
                          <div className="flex justify-end">
                            <Button variant="outline" size="sm" className="mr-2">{t("editBid")}</Button>
                            <Button size="sm">{t("contactClient")}</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Community Requests Section */}
                <Card className="shadow-md">
                  <CardHeader className="bg-white border-b">
                    <CardTitle className="text-xl flex items-center justify-between">
                      <span>{t("communityRequests")}</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                        {filteredRequests.length} {t("requests")}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {filteredRequests.length > 0 ? (
                      <div className="divide-y">
                        {filteredRequests.map((request) => (
                          <div key={request.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                              <p className="text-gray-600">{request.description}</p>
                              <span className="font-bold text-green-600">{request.budget}</span>
                            </div>
                            <div className="flex justify-end">
                              <Button variant="outline" size="sm" className="mr-2">{t("viewDetails")}</Button>
                              <Button size="sm">{t("submitBid")}</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <p>{t("noRequests")}</p>
                        <Button variant="outline" className="mt-4">{t("browseAllRequests")}</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Admin Redirect Tab */}
            {activeTab === "admin" && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">{t("estateAdministrator")}</h2>
                <p className="text-gray-600 mb-4">{t("redirectingToAdminDashboard")}</p>
                <Button onClick={handleAdminDashboardClick}>{t("goToAdminDashboard")}</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
