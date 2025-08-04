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
  Shield, 
  Zap, 
  Globe, 
  Calendar,
  Target,
  DollarSign,
  CheckCircle,
  Rocket,
  Award,
  Lock
} from "lucide-react";

interface WhitepaperModalProps {
  children: React.ReactNode;
}

export default function WhitepaperModal({ children }: WhitepaperModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-gradient-to-br from-white via-gray-50 to-blue-50">
        <DialogHeader className="px-8 pt-8 pb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <FileText className="h-6 w-6" />
            </div>
            <DialogTitle className="text-3xl font-bold tracking-tight">
              HuBiT Whitepaper
            </DialogTitle>
          </div>
          <DialogDescription className="text-blue-100 text-lg">
            Decentralized Property Management on Solana
          </DialogDescription>
          <div className="flex items-center gap-2 mt-3">
            <Globe className="h-4 w-4 text-blue-200" />
            <a 
              href="https://hubit.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-200 hover:text-white transition-colors underline"
            >
              https://hubit.io
            </a>
            <ExternalLink className="h-3 w-3 text-blue-300" />
          </div>
        </DialogHeader>
        
        <ScrollArea className="px-8 pb-8">
          <div className="space-y-8 pt-6">
            {/* Executive Summary */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">1. Executive Summary</h2>
              </div>
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    HuBiT is a utility token built on Solana that connects property managers, service providers, and residents in a transparent ecosystem. By holding HuBiT, users access premium features, while the token funds platform growth without intermediaries.
                  </p>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Why Solana?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{"<$0.01"}</div>
                        <div className="text-sm text-gray-600">Low fees per transaction</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">~2,000</div>
                        <div className="text-sm text-gray-600">TPS High speed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">✓</div>
                        <div className="text-sm text-gray-600">Mass adoption ready</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Tokenomics */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. Tokenomics</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      Token Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <Badge variant="outline" className="font-mono">HuBiT</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Blockchain:</span>
                      <Badge className="bg-purple-100 text-purple-800">Solana (SPL)</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Supply:</span>
                      <span className="font-semibold">1,000,000,000 HuBiT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contract:</span>
                      <span className="text-sm text-gray-500">[To be deployed]</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Team & Advisors</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-1/5 h-full bg-red-500"></div>
                          </div>
                          <span className="text-sm font-medium">20%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Community & Rewards</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-2/5 h-full bg-blue-500"></div>
                          </div>
                          <span className="text-sm font-medium">10%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Ecosystem Fund</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-2/5 h-full bg-purple-500"></div>
                          </div>
                          <span className="text-sm font-medium">10%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Public Circulation</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-green-500"></div>
                          </div>
                          <span className="text-sm font-medium">60%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Utility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span><strong>Hold 100 HuBiT:</strong> Ad-free app, voting rights, premium features</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span><strong>Pay-as-you-go:</strong> €1.99/month for non-holders</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span><strong>Staking:</strong> Earn rewards for locking tokens (future phase)</span>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Roadmap */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. Roadmap</h2>
              </div>
              
              <div className="space-y-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      Q3 2025
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm"><strong>MVP Development:</strong> Demo of HuBiT app (Solana wallet integration)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm"><strong>Brand Launch:</strong> Website + Twitter + Telegram community</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm"><strong>Token Deployment:</strong> SPL token creation on Solana</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <Rocket className="h-5 w-5" />
                      Q4 2025
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="text-sm"><strong>App Beta Release:</strong> iOS/Android (property management features)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span className="text-sm"><strong>Listings:</strong> CoinMarketCap, CoinGecko, CEXs (OKX, Bybit), DEXs (Raydium, Orca)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-sm"><strong>Partnerships:</strong> 50+ service providers onboarded</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-700">
                      <Globe className="h-5 w-5" />
                      Q1 2026
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-purple-500" />
                      <span className="text-sm"><strong>Global Expansion:</strong> Localized campaigns (Spain, Latam, UAE)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span className="text-sm"><strong>10,000+ Users:</strong> Incentivized via airdrops and community rewards</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-purple-500" />
                      <span className="text-sm"><strong>Governance DAO:</strong> Token holders vote on platform upgrades</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Technology */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Zap className="h-5 w-5 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">4. Technology</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-purple-700">Solana Advantages</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <span><strong>Speed:</strong> 400ms block times</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <span><strong>Cost:</strong> Transactions {"<$0.01"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      <span><strong>Scalability:</strong> Thousands of users simultaneously</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-700">App Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-500" />
                      <span><strong>Transparent Service Tracking:</strong> All requests/reviews on-chain</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-purple-500" />
                      <span><strong>HuBiT Wallet:</strong> Built-in Solana wallet for seamless payments</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-orange-500" />
                      <span><strong>Reputation System:</strong> NFT-based badges for top-rated providers</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Security & Compliance */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">5. Security & Compliance</h2>
              </div>
              
              <Card className="bg-red-50 border-red-200">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-red-600" />
                    <span><strong>Audits:</strong> Smart contract audit by Certik or Kudelski Security</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-red-600" />
                    <span><strong>KYC:</strong> Optional for fiat on-ramps (partner: MoonPay/Stripe)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-red-600" />
                    <span><strong>Legal:</strong> Structured as a utility token (no securities regulations)</span>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Team */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">6. Team</h2>
              </div>
              
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-blue-600" />
                    <span><strong>Founders:</strong> Experienced in proptech and blockchain</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span><strong>Advisors:</strong> Solana devs, legal experts, real estate veterans</span>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Conclusion */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">7. Conclusion</h2>
              </div>
              
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    HuBiT leverages Solana's efficiency to disrupt property management with transparency and decentralized governance. By holding HuBiT, users become stakeholders in the ecosystem's growth.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Next Steps:</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Finalize smart contract (audit in progress)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Launch Q3 2025 marketing campaign</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Grow partnerships with property managers</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator />

            {/* Call to Action */}
            <div className="text-center py-6">
              <p className="text-lg text-gray-600 mb-4">
                Join our community and be part of the future of property management
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
                onClick={() => window.open("https://hubit.io", "_blank")}
              >
                Visit hubit.io
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
