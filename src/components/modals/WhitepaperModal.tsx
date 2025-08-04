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
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-white border-2 border-gray-200">
        <DialogHeader className="px-8 pt-8 pb-6 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText className="h-6 w-6 text-black" />
            </div>
            <DialogTitle className="text-3xl font-bold tracking-tight text-black">
              HuBiT Whitepaper
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600 text-lg">
            Decentralized Property Management on Solana
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
        
        <ScrollArea className="h-[calc(90vh-200px)] px-8 pb-8">
          <div className="space-y-8 pt-6">
            {/* Executive Summary */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Target className="h-5 w-5 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-black">1. Executive Summary</h2>
              </div>
              <Card className="border-l-4 border-l-black">
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    HuBiT is a utility token built on Solana that connects property managers, service providers, and residents in a transparent ecosystem. By holding HuBiT, users access premium features, while the token funds platform growth without intermediaries.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-black mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Why Solana?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-black">{"<$0.01"}</div>
                        <div className="text-sm text-gray-600">Low fees per transaction</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-black">~2,000</div>
                        <div className="text-sm text-gray-600">TPS High speed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-black">✓</div>
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
                <div className="p-2 bg-gray-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-black">2. Tokenomics</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-black">
                      <Award className="h-5 w-5" />
                      Token Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <Badge variant="outline" className="font-mono border-black text-black">HuBiT</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Blockchain:</span>
                      <Badge className="bg-gray-100 text-black border border-gray-300">Solana (SPL)</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Supply:</span>
                      <span className="font-semibold text-black">1,000,000,000 HuBiT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contract:</span>
                      <span className="text-sm text-gray-500">[To be deployed]</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-black">
                      <TrendingUp className="h-5 w-5" />
                      Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Team & Advisors</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-1/5 h-full bg-black"></div>
                          </div>
                          <span className="text-sm font-medium">20%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Community & Rewards</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-2/5 h-full bg-gray-600"></div>
                          </div>
                          <span className="text-sm font-medium">10%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Ecosystem Fund</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="w-2/5 h-full bg-gray-500"></div>
                          </div>
                          <span className="text-sm font-medium">10%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">Public Circulation</span>
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
                  <CardTitle className="text-black">Utility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-black" />
                    <span className="text-gray-700"><strong>Hold 100 HuBiT:</strong> Ad-free app, voting rights, premium features</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-black" />
                    <span className="text-gray-700"><strong>Pay-as-you-go:</strong> €1.99/month for non-holders</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-black" />
                    <span className="text-gray-700"><strong>Staking:</strong> Earn rewards for locking tokens (future phase)</span>
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
                <h2 className="text-2xl font-bold text-black">3. Roadmap</h2>
              </div>
              
              <div className="space-y-6">
                <Card className="border-l-4 border-l-black">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-black">
                      <CheckCircle className="h-5 w-5" />
                      Q3 2025
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-black" />
                      <span className="text-sm text-gray-700"><strong>MVP Development:</strong> Demo of HuBiT app</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-black" />
                      <span className="text-sm text-gray-700"><strong>Brand Launch:</strong> Website + Twitter</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-black" />
                      <span className="text-sm text-gray-700"><strong>Token Deployment:</strong> SPL token creation on Solana</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-gray-600">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-black">
                      <Rocket className="h-5 w-5" />
                      Q4 2025
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-700"><strong>App Beta Release:</strong> iOS/Android (property management features, Solana wallet integration)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-700"><strong>Listings:</strong> CoinMarketCap, CoinGecko, centralized and decentralized exchanges</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-700"><strong>Partnerships:</strong> 50+ service providers onboarded</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-gray-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-black">
                      <Globe className="h-5 w-5" />
                      Q1 2026
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700"><strong>Global Expansion:</strong> International market campaigns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700"><strong>10,000+ Users:</strong> Incentivized via airdrops and community rewards</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700"><strong>Governance DAO:</strong> Token holders vote on platform upgrades</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Technology */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Zap className="h-5 w-5 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-black">4. Technology</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-black">Solana Advantages</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-black" />
                      <span className="text-gray-700"><strong>Speed:</strong> 400ms block times</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-black" />
                      <span className="text-gray-700"><strong>Cost:</strong> Transactions {"<$0.01"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-black" />
                      <span className="text-gray-700"><strong>Scalability:</strong> Thousands of users simultaneously</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-black">App Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-black" />
                      <span className="text-gray-700"><strong>Transparent Service Tracking:</strong> All requests/reviews on-chain</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-black" />
                      <span className="text-gray-700"><strong>HuBiT Wallet:</strong> Built-in Solana wallet for seamless payments</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-black" />
                      <span className="text-gray-700"><strong>Reputation System:</strong> NFT-based badges for top-rated providers</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Security & Compliance */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Shield className="h-5 w-5 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-black">5. Security & Compliance</h2>
              </div>
              
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-black" />
                    <span className="text-gray-700"><strong>Audits:</strong> Smart contract audit by Certik or Kudelski Security</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-black" />
                    <span className="text-gray-700"><strong>KYC:</strong> Optional for fiat on-ramps (partner: MoonPay/Stripe)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-black" />
                    <span className="text-gray-700"><strong>Legal:</strong> Structured as a utility token (no securities regulations)</span>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Team */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Users className="h-5 w-5 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-black">6. Team</h2>
              </div>
              
              <Card className="border border-gray-200">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-black" />
                    <span className="text-gray-700"><strong>Founders:</strong> Experienced in proptech and blockchain</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-black" />
                    <span className="text-gray-700"><strong>Advisors:</strong> Solana devs, legal experts, real estate veterans</span>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Conclusion */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Target className="h-5 w-5 text-black" />
                </div>
                <h2 className="text-2xl font-bold text-black">7. Conclusion</h2>
              </div>
              
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    HuBiT leverages Solana's efficiency to disrupt property management with transparency and decentralized governance. By holding HuBiT, users become stakeholders in the ecosystem's growth.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-black mb-3">Next Steps:</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-black" />
                        <span className="text-sm text-gray-700">Finalize smart contract (audit in progress)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-black" />
                        <span className="text-sm text-gray-700">Launch Q3 2025 marketing campaign</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-black" />
                        <span className="text-sm text-gray-700">Grow partnerships with property managers</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <Separator className="bg-gray-200" />

            {/* Call to Action */}
            <div className="text-center py-6">
              <p className="text-lg text-gray-600 mb-4">
                Join our community and be part of the future of property management
              </p>
              <Button 
                size="lg" 
                className="bg-black hover:bg-gray-800 text-white px-8 transition-all duration-200 hover:scale-105"
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
