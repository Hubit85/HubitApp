import React, { useState } from "react";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wrench, Zap, Paintbrush, Grid, Droplet, Thermometer, Home, Lock, Hammer, Trees, Truck, Wifi } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";

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
  const [activeCategory, setActiveCategory] = useState('plumbing');
  const { t } = useLanguage();
  
  // Define repair categories with icons
  const repairCategories: RepairCategory[] = [
    { id: 'plumbing', name: t('plumbing'), icon: <Droplet className='mr-2 h-5 w-5' /> },
    { id: 'electrical', name: t('electrical'), icon: <Zap className='mr-2 h-5 w-5' /> },
    { id: 'painting', name: t('painting'), icon: <Paintbrush className='mr-2 h-5 w-5' /> },
    { id: 'flooring', name: t('flooring'), icon: <Grid className='mr-2 h-5 w-5' /> },
    { id: 'roofing', name: t('roofing'), icon: <Home className='mr-2 h-5 w-5' /> },
    { id: 'hvac', name: t('hvac'), icon: <Thermometer className='mr-2 h-5 w-5' /> },
    { id: 'carpentry', name: t('carpentry'), icon: <Hammer className='mr-2 h-5 w-5' /> },
    { id: 'locksmith', name: t('locksmith'), icon: <Lock className='mr-2 h-5 w-5' /> },
    { id: 'appliance', name: t('applianceRepair'), icon: <Wrench className='mr-2 h-5 w-5' /> },
    { id: 'landscaping', name: t('landscaping'), icon: <Trees className='mr-2 h-5 w-5' /> },
    { id: 'moving', name: t('movingServices'), icon: <Truck className='mr-2 h-5 w-5' /> },
    { id: 'networking', name: t('homeNetworking'), icon: <Wifi className='mr-2 h-5 w-5' /> },
  ];

  // Sample bids data for each category
  const generateBids = (category: string): Bid[] => [
    { 
      id: `${category}-1`, 
      amount: '$450', 
      scope: t('bathroomPlumbingOverhaul'), 
      company: t('elitePlumbingSolutions') 
    },
    { 
      id: `${category}-2`, 
      amount: '$280', 
      scope: t('kitchenSinkInstallation'), 
      company: t('waterworksPro') 
    },
    { 
      id: `${category}-3`, 
      amount: '$175', 
      scope: t('toiletRepair'), 
      company: t('reliableHomeServices') 
    },
    { 
      id: `${category}-4`, 
      amount: '$320', 
      scope: t('leakDetection'), 
      company: t('precisionPlumbers') 
    },
    { 
      id: `${category}-5`, 
      amount: '$550', 
      scope: t('fullHousePlumbing'), 
      company: t('masterPlumbingCo') 
    },
  ];

  // Sample community requests data
  const communityRequests: CommunityRequest[] = [
    { id: 'req-1', budget: '$300', description: t('bathroomSinkInstallation'), category: 'plumbing' },
    { id: 'req-2', budget: '$250', description: t('electricalOutletInstallation'), category: 'electrical' },
    { id: 'req-3', budget: '$500', description: t('livingRoomPainting'), category: 'painting' },
    { id: 'req-4', budget: '$400', description: t('hardwoodFloorRepair'), category: 'flooring' },
    { id: 'req-5', budget: '$800', description: t('roofLeakRepair'), category: 'roofing' },
    { id: 'req-6', budget: '$350', description: t('acMaintenance'), category: 'hvac' },
    { id: 'req-7', budget: '$275', description: t('customShelvingInstallation'), category: 'carpentry' },
    { id: 'req-8', budget: '$150', description: t('lockReplacement'), category: 'locksmith' },
  ];
  
  // Get bids for the active category
  const categoryBids = generateBids(activeCategory);
  
  // Filter community requests by active category
  const filteredRequests = communityRequests.filter(
    request => request.category === activeCategory
  );

  return (
    <>
      <Head>
        <title>{t('serviceProviderDashboard')} | {t('handyman')}</title>
        <meta name='description' content={t('serviceProviderDesc')} />
      </Head>
      
      <Header />
      
      <div className='flex h-screen bg-background'>
        {/* Sidebar */}
        <div className='w-64 bg-[hsl(0,0%,20%)] text-white shadow-lg'>
          <div className='p-4'>
            <h2 className='text-2xl font-bold mb-6'>{t('dashboard')}</h2>
            <nav className='space-y-2'>
              {repairCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? 'default' : 'ghost'} 
                  className='w-full justify-start'
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.icon}
                  <span>{category.name}</span>
                </Button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className='flex-1 overflow-auto'>
          <div className='p-6'>
            <h1 className='text-3xl font-bold mb-6 text-foreground'>
              {repairCategories.find(c => c.id === activeCategory)?.name} {t('services')}
            </h1>
            
            <div className='grid grid-cols-1 gap-8'>
              {/* Bids Section */}
              <Card className='shadow-md'>
                <CardHeader className='bg-white dark:bg-[hsl(0,0%,20%)] border-b'>
                  <CardTitle className='text-xl flex items-center justify-between text-foreground'>
                    <span>{t('activeBids')}</span>
                    <Badge variant='outline' className='bg-[hsl(25,30%,35%)/10] text-[hsl(25,30%,35%)] border-[hsl(25,30%,35%)/30]'>
                      {categoryBids.length} {t('bids')}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className='p-0'>
                  <div className='divide-y'>
                    {categoryBids.map((bid) => (
                      <div key={bid.id} className='p-4 hover:bg-secondary transition-colors'>
                        <div className='flex justify-between items-start mb-2'>
                          <h3 className='font-medium text-foreground'>{bid.company}</h3>
                          <span className='text-lg font-bold text-[hsl(25,30%,35%)]'>{bid.amount}</span>
                        </div>
                        <p className='text-muted-foreground mb-3'>{bid.scope}</p>
                        <div className='flex justify-end'>
                          <Button variant='outline' size='sm' className='mr-2'>{t('editBid')}</Button>
                          <Button size='sm' className='bg-[hsl(25,30%,35%)] hover:bg-[hsl(25,30%,30%)]'>{t('contactClient')}</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Community Requests Section */}
              <Card className='shadow-md'>
                <CardHeader className='bg-white dark:bg-[hsl(0,0%,20%)] border-b'>
                  <CardTitle className='text-xl flex items-center justify-between text-foreground'>
                    <span>{t('communityRequests')}</span>
                    <Badge variant='outline' className='bg-[hsl(25,30%,35%)/10] text-[hsl(25,30%,35%)] border-[hsl(25,30%,35%)/30]'>
                      {filteredRequests.length} {t('requests')}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className='p-0'>
                  {filteredRequests.length > 0 ? (
                    <div className='divide-y'>
                      {filteredRequests.map((request) => (
                        <div key={request.id} className='p-4 hover:bg-secondary transition-colors'>
                          <div className='flex justify-between items-start mb-2'>
                            <p className='text-muted-foreground'>{request.description}</p>
                            <span className='font-bold text-[hsl(25,30%,35%)]'>{request.budget}</span>
                          </div>
                          <div className='flex justify-end'>
                            <Button variant='outline' size='sm' className='mr-2'>{t('viewDetails')}</Button>
                            <Button size='sm' className='bg-[hsl(25,30%,35%)] hover:bg-[hsl(25,30%,30%)]'>{t('submitBid')}</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className='p-8 text-center text-muted-foreground'>
                      <p>{t('noRequests')}</p>
                      <Button variant='outline' className='mt-4'>{t('browseAllRequests')}</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}