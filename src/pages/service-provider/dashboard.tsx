import React, { useState } from "react";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Wrench, Zap, Paintbrush, Grid, Droplet, Thermometer, Home, Lock, Hammer, Trees, Truck, Wifi, Calendar, ClipboardList, Building, MapPin, Shovel, Construction, Brush, Sparkles, Palette, Leaf, Gem, Tv, Key, Package, Scissors, Utensils, User, CreditCard, Star, Award, Phone, Mail, Globe, Camera, Upload, CheckCircle, Clock, Users, Briefcase, FileText, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";
import { useRouter } from "next/router";
import ZoomableSection from "@/components/ZoomableSection";

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
  const [activeTab, setActiveTab] = useState("overview");
  const { t } = useLanguage();
  const router = useRouter();
  
  // Define repair categories with icons
  const repairCategories: RepairCategory[] = [
    { id: 'plumbing', name: t('plumbing'), icon: <Droplet className='mr-2 h-5 w-5' /> },
    { id: 'electrical', name: t('electrical'), icon: <Zap className='mr-2 h-5 w-5' /> },
    { id: 'painting', name: t('painting'), icon: <Paintbrush className='mr-2 h-5 w-5' /> },
    { id: 'flooring', name: t('flooring'), icon: <Grid className='mr-2 h-5 w-5' /> },
    { id: 'roofing', name: t('roofing'), icon: <Home className='mr-2 h-5 w-5' /> },
    { id: 'hvac', name: t('hvac'), icon: <Thermometer className='mr-2 h-5 w-5' /> },
    { id: 'carpentry', name: t('carpentry'), icon: <Hammer className='mr-2 h-5 w-5' /> },
    { id: 'locksmith', name: t('locksmith'), icon: <Key className='mr-2 h-5 w-5' /> },
    { id: 'appliance', name: t('applianceRepair'), icon: <Wrench className='mr-2 h-5 w-5' /> },
    { id: 'landscaping', name: t('landscaping'), icon: <Trees className='mr-2 h-5 w-5' /> },
    { id: 'moving', name: t('movingServices'), icon: <Truck className='mr-2 h-5 w-5' /> },
    { id: 'networking', name: t('homeNetworking'), icon: <Wifi className='mr-2 h-5 w-5' /> },
    { id: 'masonry', name: t('masonry'), icon: <Construction className='mr-2 h-5 w-5' /> },
    { id: 'rooftiles', name: t('roofTiles'), icon: <Home className='mr-2 h-5 w-5' /> },
    { id: 'restoration', name: t('restoration'), icon: <Brush className='mr-2 h-5 w-5' /> },
    { id: 'cleaning', name: t('deepCleaning'), icon: <Sparkles className='mr-2 h-5 w-5' /> },
    { id: 'decoration', name: t('interiorDecoration'), icon: <Palette className='mr-2 h-5 w-5' /> },
    { id: 'gardening', name: t('gardening'), icon: <Leaf className='mr-2 h-5 w-5' /> },
    { id: 'renovation', name: t('completeRenovation'), icon: <Gem className='mr-2 h-5 w-5' /> },
    { id: 'cableTV', name: t('cableTV'), icon: <Tv className='mr-2 h-5 w-5' /> },
    { id: 'packageDelivery', name: t('packageDelivery'), icon: <Package className='mr-2 h-5 w-5' /> },
    { id: 'hairdressing', name: t('hairdressing'), icon: <Scissors className='mr-2 h-5 w-5' /> },
    { id: 'catering', name: t('catering'), icon: <Utensils className='mr-2 h-5 w-5' /> },
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
    ],
    masonry: [
      { id: 'masonry-1', amount: '$1200', scope: t('brickWallConstruction'), company: t('brickMasters') },
      { id: 'masonry-2', amount: '$850', scope: t('stonePathway'), company: t('stoneCraftsmen') },
      { id: 'masonry-3', amount: '$2500', scope: t('fireplaceConstruction'), company: t('fireplaceExperts') },
      { id: 'masonry-4', amount: '$1800', scope: t('retainingWall'), company: t('solidStructures') },
      { id: 'masonry-5', amount: '$950', scope: t('brickRepair'), company: t('brickDoctors') },
      { id: 'masonry-6', amount: '$3500', scope: t('stoneFacade'), company: t('facadePros') },
      { id: 'masonry-7', amount: '$750', scope: t('chimneyRepair'), company: t('chimneyMasters') },
      { id: 'masonry-8', amount: '$1400', scope: t('outdoorKitchen'), company: t('outdoorLiving') },
      { id: 'masonry-9', amount: '$650', scope: t('stepRepair'), company: t('stepByStep') },
      { id: 'masonry-10', amount: '$4200', scope: t('stonePatio'), company: t('patioBuilders') }
    ],
    rooftiles: [
      { id: 'rooftiles-1', amount: '$3500', scope: t('clayTileReplacement'), company: t('clayTilePros') },
      { id: 'rooftiles-2', amount: '$2800', scope: t('concreteTileInstallation'), company: t('concreteMasters') },
      { id: 'rooftiles-3', amount: '$1200', scope: t('tileRepair'), company: t('tileFixers') },
      { id: 'rooftiles-4', amount: '$5500', scope: t('completeRoofTileReplacement'), company: t('completeRoofing') },
      { id: 'rooftiles-5', amount: '$800', scope: t('ridgeTileRepair'), company: t('ridgeExperts') },
      { id: 'rooftiles-6', amount: '$950', scope: t('valleyRepair'), company: t('valleyPros') },
      { id: 'rooftiles-7', amount: '$4200', scope: t('slateTileInstallation'), company: t('slateSpecialists') },
      { id: 'rooftiles-8', amount: '$650', scope: t('tileSealing'), company: t('sealTeam') },
      { id: 'rooftiles-9', amount: '$1800', scope: t('decorativeTileWork'), company: t('decorativePros') },
      { id: 'rooftiles-10', amount: '$3200', scope: t('historicTileRestoration'), company: t('heritageTiles') }
    ],
    restoration: [
      { id: 'restoration-1', amount: '$2500', scope: t('historicHomeRestoration'), company: t('heritageMasters') },
      { id: 'restoration-2', amount: '$1800', scope: t('woodworkRestoration'), company: t('woodCraftsmen') },
      { id: 'restoration-3', amount: '$3500', scope: t('facadeRestoration'), company: t('facadeArtisans') },
      { id: 'restoration-4', amount: '$950', scope: t('furnitureRestoration'), company: t('furnitureRevival') },
      { id: 'restoration-5', amount: '$1200', scope: t('doorRestoration'), company: t('doorDoctors') },
      { id: 'restoration-6', amount: '$4500', scope: t('completeInteriorRestoration'), company: t('interiorMasters') },
      { id: 'restoration-7', amount: '$850', scope: t('staircaseRestoration'), company: t('stairPros') },
      { id: 'restoration-8', amount: '$750', scope: t('windowRestoration'), company: t('windowWizards') },
      { id: 'restoration-9', amount: '$5800', scope: t('historicKitchenRestoration'), company: t('kitchenCraftsmen') },
      { id: 'restoration-10', amount: '$2200', scope: t('ornamentalPlasterwork'), company: t('plasterArtisans') }
    ],
    cleaning: [
      { id: 'cleaning-1', amount: '$450', scope: t('deepHouseCleaning'), company: t('deepCleanPros') },
      { id: 'cleaning-2', amount: '$350', scope: t('carpetDeepCleaning'), company: t('carpetRevival') },
      { id: 'cleaning-3', amount: '$650', scope: t('postConstructionCleaning'), company: t('constructionCleanup') },
      { id: 'cleaning-4', amount: '$250', scope: t('upholsteryCleaning'), company: t('upholsteryRefresh') },
      { id: 'cleaning-5', amount: '$550', scope: t('airDuctCleaning'), company: t('freshAirSystems') },
      { id: 'cleaning-6', amount: '$850', scope: t('exteriorPressureWashing'), company: t('pressurePros') },
      { id: 'cleaning-7', amount: '$400', scope: t('windowDeepCleaning'), company: t('crystalClear') },
      { id: 'cleaning-8', amount: '$750', scope: t('basementDeepCleaning'), company: t('basementRevival') },
      { id: 'cleaning-9', amount: '$300', scope: t('kitchenDeepCleaning'), company: t('kitchenSanitizers') },
      { id: 'cleaning-10', amount: '$950', scope: t('wholehouseDeepCleaning'), company: t('totalRefresh') }
    ],
    decoration: [
      { id: 'decoration-1', amount: '$1800', scope: t('interiorStyling'), company: t('styleExperts') },
      { id: 'decoration-2', amount: '$950', scope: t('colorConsultation'), company: t('colorWhisperers') },
      { id: 'decoration-3', amount: '$2500', scope: t('furnitureArrangement'), company: t('spaceOptimizers') },
      { id: 'decoration-4', amount: '$1200', scope: t('artworkSelection'), company: t('artCurators') },
      { id: 'decoration-5', amount: '$3500', scope: t('completeRoomMakeover'), company: t('roomTransformers') },
      { id: 'decoration-6', amount: '$750', scope: t('lightingDesign'), company: t('lightingArtists') },
      { id: 'decoration-7', amount: '$1500', scope: t('seasonalDecoration'), company: t('seasonalExperts') },
      { id: 'decoration-8', amount: '$850', scope: t('textileSelection'), company: t('fabricSpecialists') },
      { id: 'decoration-9', amount: '$650', scope: t('accessoryStyling'), company: t('accentArtists') },
      { id: 'decoration-10', amount: '$4500', scope: t('luxuryInteriorDesign'), company: t('luxuryLiving') }
    ],
    gardening: [
      { id: 'gardening-1', amount: '$950', scope: t('gardenDesign'), company: t('gardenVisionaries') },
      { id: 'gardening-2', amount: '$450', scope: t('plantSelection'), company: t('plantWhisperers') },
      { id: 'gardening-3', amount: '$750', scope: t('vegetableGardenSetup'), company: t('edibleGardens') },
      { id: 'gardening-4', amount: '$350', scope: t('seasonalPlanting'), company: t('seasonalGardeners') },
      { id: 'gardening-5', amount: '$1200', scope: t('gardenRenovation'), company: t('gardenRevival') },
      { id: 'gardening-6', amount: '$650', scope: t('herbGardenDesign'), company: t('herbSpecialists') },
      { id: 'gardening-7', amount: '$2500', scope: t('japaneseGardenInstallation'), company: t('zenGardens') },
      { id: 'gardening-8', amount: '$550', scope: t('gardenMaintenance'), company: t('gardenKeepers') },
      { id: 'gardening-9', amount: '$850', scope: t('waterFeatureInstallation'), company: t('waterWizards') },
      { id: 'gardening-10', amount: '$1800', scope: t('outdoorLightingDesign'), company: t('nightGardens') }
    ],
    renovation: [
      { id: 'renovation-1', amount: '$15000', scope: t('completeHomeRenovation'), company: t('totalTransformations') },
      { id: 'renovation-2', amount: '$8500', scope: t('kitchenRenovation'), company: t('kitchenRevival') },
      { id: 'renovation-3', amount: '$7500', scope: t('bathroomRenovation'), company: t('bathroomRenewal') },
      { id: 'renovation-4', amount: '$12000', scope: t('basementFinishing'), company: t('basementCreators') },
      { id: 'renovation-5', amount: '$9500', scope: t('atticConversion'), company: t('atticTransformers') },
      { id: 'renovation-6', amount: '$6500', scope: t('openConceptCreation'), company: t('wallBreakers') },
      { id: 'renovation-7', amount: '$18000', scope: t('homeExtension'), company: t('spaceExpanders') },
      { id: 'renovation-8', amount: '$5500', scope: t('outdoorLivingSpace'), company: t('outdoorCreators') },
      { id: 'renovation-9', amount: '$11000', scope: t('masterSuiteRenovation'), company: t('luxurySuites') },
      { id: 'renovation-10', amount: '$25000', scope: t('historicHomeModernization'), company: t('modernHeritage') }
    ],
    cableTV: [
      { id: 'cableTV-1', amount: '$350', scope: t('basicCableInstallation'), company: t('cableConnectors') },
      { id: 'cableTV-2', amount: '$550', scope: t('premiumChannelPackage'), company: t('eliteEntertainment') },
      { id: 'cableTV-3', amount: '$250', scope: t('tvMounting'), company: t('screenSetup') },
      { id: 'cableTV-4', amount: '$450', scope: t('homeTheaterSetup'), company: t('cinemaAtHome') },
      { id: 'cableTV-5', amount: '$150', scope: t('routerConfiguration'), company: t('wifiWizards') },
      { id: 'cableTV-6', amount: '$650', scope: t('fullHomeEntertainment'), company: t('entertainmentExperts') },
      { id: 'cableTV-7', amount: '$200', scope: t('cableTroubleshooting'), company: t('signalFixers') },
      { id: 'cableTV-8', amount: '$300', scope: t('satelliteInstallation'), company: t('skySignal') },
      { id: 'cableTV-9', amount: '$400', scope: t('streamingDeviceSetup'), company: t('streamTeam') },
      { id: 'cableTV-10', amount: '$750', scope: t('smartTVIntegration'), company: t('smartHomeMedia') }
    ],
    packageDelivery: [
      { id: 'packageDelivery-1', amount: '$50', scope: t('sameDay'), company: t('rapidDelivery') },
      { id: 'packageDelivery-2', amount: '$30', scope: t('nextDay'), company: t('reliableShipping') },
      { id: 'packageDelivery-3', amount: '$75', scope: t('fragileItems'), company: t('carefulCarriers') },
      { id: 'packageDelivery-4', amount: '$100', scope: t('bulkyItems'), company: t('heavyLifters') },
      { id: 'packageDelivery-5', amount: '$45', scope: t('documentDelivery'), company: t('docuRun') },
      { id: 'packageDelivery-6', amount: '$60', scope: t('groceryDelivery'), company: t('foodFast') },
      { id: 'packageDelivery-7', amount: '$40', scope: t('medicineDelivery'), company: t('medExpress') },
      { id: 'packageDelivery-8', amount: '$80', scope: t('furnitureDelivery'), company: t('furnishingFleet') },
      { id: 'packageDelivery-9', amount: '$35', scope: t('localDelivery'), company: t('neighborhoodCouriers') },
      { id: 'packageDelivery-10', amount: '$120', scope: t('internationalShipping'), company: t('globalSend') }
    ],
    hairdressing: [
      { id: 'hairdressing-1', amount: '$45', scope: t('basicHaircut'), company: t('styleStudio') },
      { id: 'hairdressing-2', amount: '$75', scope: t('colorTreatment'), company: t('colorMasters') },
      { id: 'hairdressing-3', amount: '$120', scope: t('weddingHairstyle'), company: t('brideBeauty') },
      { id: 'hairdressing-4', amount: '$60', scope: t('blowDry'), company: t('blowoutBar') },
      { id: 'hairdressing-5', amount: '$150', scope: t('hairExtensions'), company: t('lengthLuxury') },
      { id: 'hairdressing-6', amount: '$90', scope: t('highlights'), company: t('dimensionDesigners') },
      { id: 'hairdressing-7', amount: '$40', scope: t('trimAndStyle'), company: t('quickCuts') },
      { id: 'hairdressing-8', amount: '$180', scope: t('keratin'), company: t('smoothSolutions') },
      { id: 'hairdressing-9', amount: '$65', scope: t('menGrooming'), company: t('gentlemenCuts') },
      { id: 'hairdressing-10', amount: '$110', scope: t('specialOccasion'), company: t('eventElegance') }
    ],
    catering: [
      { id: 'catering-1', amount: '$350', scope: t('smallGathering'), company: t('intimateEats') },
      { id: 'catering-2', amount: '$750', scope: t('corporateEvent'), company: t('businessBites') },
      { id: 'catering-3', amount: '$1200', scope: t('wedding'), company: t('weddingFeasts') },
      { id: 'catering-4', amount: '$500', scope: t('birthdayParty'), company: t('celebrationChefs') },
      { id: 'catering-5', amount: '$250', scope: t('deliveryMeal'), company: t('homeGourmet') },
      { id: 'catering-6', amount: '$450', scope: t('cocktailParty'), company: t('mixAndMingle') },
      { id: 'catering-7', amount: '$650', scope: t('holidayDinner'), company: t('festiveFeasts') },
      { id: 'catering-8', amount: '$300', scope: t('brunch'), company: t('morningDelights') },
      { id: 'catering-9', amount: '$850', scope: t('fullServiceEvent'), company: t('completeCreations') },
      { id: 'catering-10', amount: '$400', scope: t('dessertBar'), company: t('sweetTreats') }
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
    ],
    masonry: [
      { id: 'masonry-req-1', budget: '$1500', description: t('brickWallRepair'), category: 'masonry' },
      { id: 'masonry-req-2', budget: '$3000', description: t('stonePatio'), category: 'masonry' },
      { id: 'masonry-req-3', budget: '$800', description: t('chimneyRepointing'), category: 'masonry' }
    ],
    rooftiles: [
      { id: 'rooftiles-req-1', budget: '$2500', description: t('roofTileReplacement'), category: 'rooftiles' },
      { id: 'rooftiles-req-2', budget: '$900', description: t('leakingTileRepair'), category: 'rooftiles' },
      { id: 'rooftiles-req-3', budget: '$4000', description: t('completeRoofTileInstallation'), category: 'rooftiles' }
    ],
    restoration: [
      { id: 'restoration-req-1', budget: '$1800', description: t('antiqueTableRestoration'), category: 'restoration' },
      { id: 'restoration-req-2', budget: '$3500', description: t('historicDoorRestoration'), category: 'restoration' },
      { id: 'restoration-req-3', budget: '$2200', description: t('woodworkRepair'), category: 'restoration' }
    ],
    cleaning: [
      { id: 'cleaning-req-1', budget: '$400', description: t('moveOutDeepCleaning'), category: 'cleaning' },
      { id: 'cleaning-req-2', budget: '$650', description: t('carpetAndUpholsteryCleaning'), category: 'cleaning' },
      { id: 'cleaning-req-3', budget: '$800', description: t('postRenovationCleaning'), category: 'cleaning' }
    ],
    decoration: [
      { id: 'decoration-req-1', budget: '$1200', description: t('livingRoomStyling'), category: 'decoration' },
      { id: 'decoration-req-2', budget: '$750', description: t('holidayDecoration'), category: 'decoration' },
      { id: 'decoration-req-3', budget: '$2000', description: t('officeMakeover'), category: 'decoration' }
    ],
    gardening: [
      { id: 'gardening-req-1', budget: '$500', description: t('frontYardLandscaping'), category: 'gardening' },
      { id: 'gardening-req-2', budget: '$350', description: t('herbGardenSetup'), category: 'gardening' },
      { id: 'gardening-req-3', budget: '$1200', description: t('gardenIrrigationSystem'), category: 'gardening' }
    ],
    renovation: [
      { id: 'renovation-req-1', budget: '$8000', description: t('kitchenRemodel'), category: 'renovation' },
      { id: 'renovation-req-2', budget: '$6500', description: t('bathroomUpgrade'), category: 'renovation' },
      { id: 'renovation-req-3', budget: '$15000', description: t('basementConversion'), category: 'renovation' }
    ]
  };
  
  // Get bids for the active category
  const categoryBids = bidData[activeTab as keyof typeof bidData] || [];
  
  // Get community requests for the active category
  const filteredRequests = communityRequestsData[activeTab as keyof typeof communityRequestsData] || [];

  // Function to handle navigation to administrator dashboard
  const handleAdminDashboardClick = () => {
    router.push('/administrador-fincas');
  };

  return (
    <>
      <Head>
        <title>{t('serviceProviderDashboard')} | {t('hubit')}</title>
        <meta name='description' content={t('serviceProviderDesc')} />
      </Head>
      
      <Header />
      
      <div className='flex h-screen bg-gray-100 pt-16'>
        {/* Sidebar */}
        <div className='w-64 bg-gray-800 text-white shadow-lg overflow-y-auto'>
          <div className='p-4'>
            <h2 className='text-2xl font-bold mb-6'>{t('dashboard')}</h2>
            <nav className='space-y-2'>
              <Button 
                variant={activeTab === 'overview' ? 'default' : 'ghost'} 
                className='w-full justify-start'
                onClick={() => setActiveTab('overview')}
              >
                <MapPin className='mr-2 h-5 w-5' />
                {t('overview')}
              </Button>
              <Button 
                variant={activeTab === 'perfil' ? 'default' : 'ghost'} 
                className='w-full justify-start'
                onClick={() => setActiveTab('perfil')}
              >
                <User className='mr-2 h-5 w-5' />
                {t('myProfile')}
              </Button>
              {repairCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeTab === category.id ? 'default' : 'ghost'}
                  className='w-full justify-start'
                  onClick={() => setActiveTab(category.id)}
                >
                  {category.icon}
                  {category.name}
                </Button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <ZoomableSection className="h-full overflow-auto" enableZoom={true} maxScale={3} minScale={0.5}>
            <div className="p-6 min-h-full">
              <h1 className="text-3xl font-bold mb-6">
                {activeTab === "overview" ? t("serviceProviderDashboard") : 
                 activeTab === "perfil" ? t("myProfile") :
                 repairCategories.find(c => c.id === activeTab)?.name + " " + t("services")}
              </h1>
              
              {/* Mi Perfil Tab */}
              {activeTab === "perfil" && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* Company Profile Card */}
                    <div className="lg:w-1/3">
                      <Card>
                        <CardContent className="p-6 flex flex-col items-center">
                          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4 relative">
                            <Building className="h-16 w-16 text-gray-500" />
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-white hover:bg-gray-100"
                            >
                              <Camera className="h-4 w-4" />
                            </Button>
                          </div>
                          <h2 className="text-xl font-bold text-center">Fontanería Express S.L.</h2>
                          <p className="text-gray-500 mb-2 text-center">{t("serviceProvider")}</p>
                          <div className="flex items-center mb-4">
                            <div className="flex mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">4.8 (124 {t("reviews")})</span>
                          </div>
                          <Button className="w-full mb-2">{t("editProfile")}</Button>
                          <Button variant="outline" className="w-full">{t("viewPublicProfile")}</Button>
                        </CardContent>
                      </Card>
                      
                      {/* Quick Stats */}
                      <Card className="mt-4">
                        <CardHeader>
                          <CardTitle className="text-lg">{t("quickStats")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">{t("completedJobs")}</span>
                              <span className="font-bold">156</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">{t("activeBids")}</span>
                              <span className="font-bold">12</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">{t("responseTime")}</span>
                              <span className="font-bold">2h</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">{t("memberSince")}</span>
                              <span className="font-bold">2022</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    {/* Company Information */}
                    <div className="lg:w-2/3">
                      <div className="space-y-6">
                        {/* Basic Company Info */}
                        <Card>
                          <CardHeader>
                            <CardTitle>{t("companyInformation")}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="company-name">{t("companyName")}</Label>
                                  <Input id="company-name" defaultValue="Fontanería Express S.L." />
                                </div>
                                <div>
                                  <Label htmlFor="tax-id">{t("taxId")}</Label>
                                  <Input id="tax-id" defaultValue="B-12345678" />
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="phone">{t("phoneLabel")}</Label>
                                  <Input id="phone" type="tel" defaultValue="+34 912 345 678" />
                                </div>
                                <div>
                                  <Label htmlFor="email">{t("emailLabel")}</Label>
                                  <Input id="email" type="email" defaultValue="info@fontaneriaexpress.com" />
                                </div>
                              </div>
                              
                              <div>
                                <Label htmlFor="address">{t("businessAddress")}</Label>
                                <Input id="address" defaultValue="Calle Mayor 123, 28001 Madrid, España" />
                              </div>
                              
                              <div>
                                <Label htmlFor="website">{t("website")}</Label>
                                <Input id="website" type="url" defaultValue="www.fontaneriaexpress.com" />
                              </div>
                              
                              <div>
                                <Label htmlFor="description">{t("companyDescription")}</Label>
                                <Textarea 
                                  id="description" 
                                  defaultValue="Empresa especializada en servicios de fontanería con más de 15 años de experiencia. Ofrecemos servicios 24/7 para emergencias y trabajamos con las mejores marcas del mercado."
                                  rows={3}
                                />
                              </div>
                              <Button className="w-full">{t("saveChanges")}</Button>
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Services Offered */}
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{t("servicesOffered")}</CardTitle>
                            <Button variant="outline" size="sm">{t("editServices")}</Button>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary" className="p-2 text-sm">
                                <Droplet className="mr-1 h-4 w-4" />
                                {t("plumbing")}
                              </Badge>
                              <Badge variant="secondary" className="p-2 text-sm">
                                <Wrench className="mr-1 h-4 w-4" />
                                {t("applianceRepair")}
                              </Badge>
                              <Badge variant="secondary" className="p-2 text-sm">
                                <Home className="mr-1 h-4 w-4" />
                                {t("bathroomRenovation")}
                              </Badge>
                              <Badge variant="secondary" className="p-2 text-sm">
                                <Thermometer className="mr-1 h-4 w-4" />
                                {t("waterHeating")}
                              </Badge>
                              <Badge variant="secondary" className="p-2 text-sm">
                                <Clock className="mr-1 h-4 w-4" />
                                {t("emergencyService")}
                              </Badge>
                              <Badge variant="secondary" className="p-2 text-sm">
                                <CheckCircle className="mr-1 h-4 w-4" />
                                {t("maintenance")}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Certifications & Licenses */}
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{t("certificationsLicenses")}</CardTitle>
                             <Button variant="outline" size="sm">{t("addCertification")}</Button>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center">
                                  <FileText className="h-5 w-5 text-blue-600 mr-3" />
                                  <div>
                                    <h4 className="font-medium">{t("professionalLicense")}</h4>
                                    <p className="text-sm text-gray-500">{t("validUntil")}: 12/2025</p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                                  {t("verified")}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center">
                                  <FileText className="h-5 w-5 text-blue-600 mr-3" />
                                  <div>
                                    <h4 className="font-medium">{t("insuranceCertificate")}</h4>
                                    <p className="text-sm text-gray-500">{t("coverage")}: €500,000</p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                                  {t("verified")}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center">
                                  <Award className="h-5 w-5 text-blue-600 mr-3" />
                                  <div>
                                    <h4 className="font-medium">{t("qualityCertification")}</h4>
                                    <p className="text-sm text-gray-500">ISO 9001:2015</p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                                  {t("verified")}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Portfolio */}
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{t("portfolio")}</CardTitle>
                            <Button variant="outline" size="sm">{t("addPhoto")}</Button>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {[1,2,3,4,5].map(i => (
                                <div key={i} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center relative group">
                                  <ImageIcon className="h-12 w-12 text-gray-400" />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20"><Camera className="mr-1 h-4 w-4" /> {t("change")}</Button>
                                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20"><FileText className="mr-1 h-4 w-4" /> {t("details")}</Button>
                                  </div>
                                </div>
                              ))}
                              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:border-gray-400 hover:bg-gray-200 transition-colors">
                                <div className="text-center">
                                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                                  <p className="text-sm text-gray-500">{t("uploadPhoto")}</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        {/* Recent Reviews */}
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>{t("recentReviews")}</CardTitle>
                            <Button variant="link" size="sm">{t("viewAllReviews")}</Button>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="border-b pb-4">
                                <div className="flex justify-between items-start mb-1">
                                  <div>
                                    <h4 className="font-medium">María González</h4>
                                    <div className="flex items-center">
                                      <div className="flex mr-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <Star 
                                            key={star} 
                                            className="h-4 w-4 text-yellow-400 fill-yellow-400" 
                                          />
                                        ))}
                                      </div>
                                      <span className="text-sm text-gray-500">5.0</span>
                                    </div>
                                  </div>
                                  <span className="text-xs text-gray-500">2 {t("daysAgo")}</span>
                                </div>
                                <p className="text-gray-600 text-sm">
                                  "Excelente servicio. Llegaron puntuales y solucionaron el problema de la tubería rápidamente. Muy profesionales."
                                </p>
                              </div>
                              
                              <div className="border-b pb-4">
                                <div className="flex justify-between items-start mb-1">
                                  <div>
                                    <h4 className="font-medium">Carlos Rodríguez</h4>
                                    <div className="flex items-center">
                                      <div className="flex mr-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                          <Star 
                                            key={star} 
                                            className={`h-4 w-4 ${star <= 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                                          />
                                        ))}
                                      </div>
                                      <span className="text-sm text-gray-500">4.0</span>
                                    </div>
                                  </div>
                                  <span className="text-xs text-gray-500">1 {t("weekAgo")}</span>
                                </div>
                                <p