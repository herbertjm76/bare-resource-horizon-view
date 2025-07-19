
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoUpload } from '@/components/VideoUpload';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Target, 
  Lightbulb, 
  Code, 
  DollarSign,
  Rocket,
  Clock,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Star,
  Play,
  Settings
} from 'lucide-react';

const AnimatedLogo = ({ videoUrl, onEditMode }: { videoUrl?: string; onEditMode?: () => void }) => {
  const [showUpload, setShowUpload] = useState(false);

  const handleVideoUploaded = (url: string) => {
    // In a real app, you'd save this to your database or local storage
    // For now, we'll just close the upload interface
    setShowUpload(false);
    if (onEditMode) onEditMode();
  };

  if (showUpload) {
    return (
      <div className="relative flex flex-col items-center justify-center mb-8 p-6 border-2 border-dashed border-gray-300 rounded-lg">
        <VideoUpload 
          onVideoUploaded={handleVideoUploaded}
          currentVideoUrl={videoUrl}
        />
        <Button 
          onClick={() => setShowUpload(false)}
          variant="ghost"
          className="mt-4"
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center mb-8 group">
      <div className="animate-[fadeIn_1s_ease-out] hover:animate-[scaleIn_0.3s_ease-out]">
        {videoUrl ? (
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            className="w-96 h-96 object-contain transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <img 
            src="/lovable-uploads/a62ee2a5-631d-44db-b4c6-1dc8b1cd9f5a.png" 
            alt="BareResource Logo" 
            className="w-96 h-96 object-contain transition-transform duration-300 hover:scale-105"
          />
        )}
      </div>
      <Button
        onClick={() => setShowUpload(true)}
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Settings className="w-4 h-4" />
      </Button>
    </div>
  );
};

const Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(-1); // Start with cover page
  const [videoLogoUrl, setVideoLogoUrl] = useState<string>('https://gxebsznewbwtktzqeilg.supabase.co/storage/v1/object/public/videos//0719.mp4'); // Store video URL
  
  const slides = [
    { id: 'cover', title: 'Cover', icon: Star },
    { id: 'problem', title: 'The Problem', icon: AlertCircle },
    { id: 'solution', title: 'Our Solution', icon: Lightbulb },
    { id: 'mvp', title: 'MVP Features', icon: CheckCircle },
    { id: 'market', title: 'Target Market', icon: Target },
    { id: 'demo', title: 'Product Demo', icon: Code },
    { id: 'roadmap', title: 'Roadmap', icon: Rocket },
    { id: 'tech', title: 'Technical Stack', icon: BarChart3 },
    { id: 'business', title: 'Business Model', icon: DollarSign },
    { id: 'team', title: 'Team Vision', icon: Users }
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const startPresentation = () => setCurrentSlide(0);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Cover Page */}
        {currentSlide === -1 && (
          <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <AnimatedLogo 
              videoUrl={videoLogoUrl} 
              onEditMode={() => setVideoLogoUrl('')} 
            />
            <div className="animate-[fadeInUp_1s_ease-out_0.5s_both] space-y-6">
              <h1 className="text-6xl font-bold text-gray-900 mb-4">
                Meet BareResource
              </h1>
              <p className="text-2xl text-gray-600 mb-8">
                Resource Planning, simplified
              </p>
              <div className="flex justify-center gap-3 mb-8">
                <Badge variant="secondary" className="text-lg px-4 py-2">MVP Ready</Badge>
                <Badge variant="outline" className="text-lg px-4 py-2">Seeking Co-founders</Badge>
                <Badge variant="outline" className="text-lg px-4 py-2">Series A Target</Badge>
              </div>
              <Button 
                onClick={startPresentation}
                size="lg"
                className="text-lg px-8 py-4 animate-pulse hover:animate-none"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Presentation
              </Button>
            </div>
          </div>
        )}

        {/* Presentation Content */}
        {currentSlide >= 0 && (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                BareResource
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                Resource Planning for Design Studios
              </p>
              <div className="flex justify-center gap-2 mb-6">
                <Badge variant="secondary">MVP Ready</Badge>
                <Badge variant="outline">Seeking Co-founders</Badge>
                <Badge variant="outline">Series A Target</Badge>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center mb-8">
              <div className="flex gap-2 bg-white p-2 rounded-lg shadow-sm">
                {slides.slice(1).map((slide, index) => (
                  <Button
                    key={slide.id}
                    variant={currentSlide === index ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentSlide(index)}
                    className="text-xs"
                  >
                    <slide.icon className="w-4 h-4 mr-1" />
                    {slide.title}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Slide Content */}
        {currentSlide >= 0 && (
          <Card className="min-h-[600px] shadow-lg">
            <CardContent className="p-8">
              
              {/* Slide 1: The Problem */}
              {currentSlide === 0 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">The Problem</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                      <CardTitle className="text-red-700">Resource Planning Chaos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <Clock className="w-5 h-5 text-red-500 mt-0.5" />
                          <span>Teams spend 20+ hours/week on resource planning</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Users className="w-5 h-5 text-red-500 mt-0.5" />
                          <span>Staff overallocation leads to burnout</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Calendar className="w-5 h-5 text-red-500 mt-0.5" />
                          <span>Projects delayed due to poor capacity planning</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                      <CardTitle className="text-orange-700">Market Pain Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <TrendingUp className="w-5 h-5 text-orange-500 mt-0.5" />
                          <span>Design studios growing 40% YoY but using spreadsheets</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <BarChart3 className="w-5 h-5 text-orange-500 mt-0.5" />
                          <span>No unified view of team capacity vs. project demands</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <DollarSign className="w-5 h-5 text-orange-500 mt-0.5" />
                          <span>Revenue loss from poor resource utilization</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">💡 Discussion Point:</h3>
                  <p className="text-yellow-700">What's your experience with resource planning in previous roles? What tools or methods have you seen work or fail?</p>
                </div>
              </div>
            )}

            {/* Slide 2: Our Solution */}
            {currentSlide === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Lightbulb className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Solution</h2>
                  <p className="text-xl text-gray-600">Visual resource planning that actually works</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-blue-700 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Visual Planning
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>See team capacity and project timelines in one unified calendar view</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-green-700 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Smart Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>AI-powered recommendations for optimal resource allocation</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-purple-200 bg-purple-50">
                    <CardHeader>
                      <CardTitle className="text-purple-700 flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Team Harmony
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Balance workloads and prevent burnout with capacity monitoring</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-4">Core Value Proposition:</h3>
                  <div className="text-2xl font-bold text-blue-900 text-center">
                    "Turn resource planning from a 20-hour weekly nightmare into a 5-minute daily routine"
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">💡 Discussion Point:</h3>
                  <p className="text-yellow-700">What resonates most with you about this approach? What would you add or change?</p>
                </div>
              </div>
            )}

            {/* Slide 3: MVP Features */}
            {currentSlide === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">MVP Features (Built)</h2>
                  <Badge variant="secondary" className="text-lg px-4 py-2">Ready for Market</Badge>
                </div>
                
                <Tabs defaultValue="core" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="core">Core Features</TabsTrigger>
                    <TabsTrigger value="planning">Planning Tools</TabsTrigger>
                    <TabsTrigger value="insights">Smart Features</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="core" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            Resource Allocation Grid
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            <li>✅ Visual timeline with team member capacity</li>
                            <li>✅ Drag-and-drop resource assignment</li>
                            <li>✅ Real-time utilization tracking</li>
                            <li>✅ Holiday and leave management</li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-purple-500" />
                            Dashboard & Analytics
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            <li>✅ Team utilization overview</li>
                            <li>✅ Project pipeline health</li>
                            <li>✅ Capacity bottleneck alerts</li>
                            <li>✅ Time range filtering</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="planning" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-green-500" />
                            Team Management
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            <li>✅ Multi-office support</li>
                            <li>✅ Role-based capacity settings</li>
                            <li>✅ Skills and specialization tracking</li>
                            <li>✅ Leave calendar integration</li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-orange-500" />
                            Project Planning
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            <li>✅ Project stages and milestones</li>
                            <li>✅ Resource requirement planning</li>
                            <li>✅ Timeline and deadline tracking</li>
                            <li>✅ Budget and fee management</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="insights" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            Smart Insights
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            <li>✅ Overallocation warnings</li>
                            <li>✅ Underutilization alerts</li>
                            <li>✅ Project delay predictions</li>
                            <li>✅ Resource optimization suggestions</li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-red-500" />
                            Workload Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            <li>✅ Weekly/monthly workload heatmaps</li>
                            <li>✅ Team capacity vs. demand charts</li>
                            <li>✅ Burnout risk indicators</li>
                            <li>✅ Productivity trend analysis</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">💡 Discussion Point:</h3>
                  <p className="text-yellow-700">Which features do you think will have the biggest impact on user adoption? What's missing from your perspective?</p>
                </div>
              </div>
            )}

            {/* Slide 4: Target Market */}
            {currentSlide === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Target className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Target Market</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-green-700">Primary Market</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Design Studios (10-50 employees)</h4>
                        <ul className="space-y-1 text-sm">
                          <li>• $2-10M annual revenue</li>
                          <li>• Multiple concurrent projects</li>
                          <li>• Struggling with Excel/basic tools</li>
                          <li>• High growth trajectory</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg">
                        <h5 className="font-semibold text-green-700 mb-2">Market Size:</h5>
                        <p className="text-2xl font-bold text-green-800">15,000+ studios globally</p>
                        <p className="text-sm text-green-600">$450M+ TAM</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-blue-700">Secondary Markets</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Creative Agencies</h4>
                        <p className="text-sm">Marketing, advertising, and digital agencies</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Consulting Firms</h4>
                        <p className="text-sm">Project-based professional services</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Software Development</h4>
                        <p className="text-sm">Custom development and product teams</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-purple-700">Ideal Customer Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Company Profile</h4>
                        <ul className="text-sm space-y-1">
                          <li>• 15-40 team members</li>
                          <li>• $3-8M annual revenue</li>
                          <li>• 5-15 concurrent projects</li>
                          <li>• Growth stage (Series A/B)</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Pain Points</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Resource planning chaos</li>
                          <li>• Team burnout issues</li>
                          <li>• Project deadline slips</li>
                          <li>• Poor visibility into capacity</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Decision Makers</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Operations Directors</li>
                          <li>• Project Managers</li>
                          <li>• Studio Partners/Founders</li>
                          <li>• Creative Directors</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">💡 Discussion Point:</h3>
                  <p className="text-yellow-700">Do you have experience or connections in any of these markets? How would you refine this target profile?</p>
                </div>
              </div>
            )}

            {/* Slide 5: Product Demo */}
            {currentSlide === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Code className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Product Demo</h2>
                  <p className="text-xl text-gray-600">See Bareresource in Action</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <Card className="border-purple-200 bg-purple-50">
                      <CardHeader>
                        <CardTitle className="text-purple-700">Core Features Demo</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Dashboard Overview</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Resource Allocation Grid</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Team Workload Calendar</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Project Planning Tools</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Smart Insights & Alerts</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader>
                        <CardTitle className="text-blue-700">User Flow</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ol className="space-y-2 text-sm">
                          <li><strong>1.</strong> Login → Dashboard overview</li>
                          <li><strong>2.</strong> Check team utilization alerts</li>
                          <li><strong>3.</strong> Review weekly resource grid</li>
                          <li><strong>4.</strong> Adjust allocations with drag-drop</li>
                          <li><strong>5.</strong> Plan upcoming project resources</li>
                        </ol>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="space-y-6">
                    <Card className="h-64 border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <div className="text-center">
                        <Code className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Live Demo Area</p>
                        <p className="text-sm text-gray-400">Switch to actual app for demo</p>
                      </div>
                    </Card>
                    
                    <Card className="border-orange-200 bg-orange-50">
                      <CardHeader>
                        <CardTitle className="text-orange-700">Demo Scenarios</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p><strong>Scenario 1:</strong> Handling overallocation crisis</p>
                        <p><strong>Scenario 2:</strong> Planning new project resources</p>
                        <p><strong>Scenario 3:</strong> Managing team leave periods</p>
                        <p><strong>Scenario 4:</strong> Optimizing utilization rates</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">💡 Discussion Point:</h3>
                  <p className="text-yellow-700">After seeing the demo, what questions or concerns do you have? What would you want to test first?</p>
                </div>
              </div>
            )}

            {/* Slide 6: Roadmap */}
            {currentSlide === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Rocket className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Product Roadmap</h2>
                </div>
                
                <div className="space-y-6">
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-green-700 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Q1 2024 - MVP Launch ✅
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <ul className="space-y-1 text-sm">
                          <li>✅ Core resource allocation grid</li>
                          <li>✅ Team dashboard & analytics</li>
                          <li>✅ Project planning tools</li>
                          <li>✅ Multi-office support</li>
                        </ul>
                        <ul className="space-y-1 text-sm">
                          <li>✅ Leave management</li>
                          <li>✅ Utilization tracking</li>
                          <li>✅ Smart insights</li>
                          <li>✅ Mobile responsiveness</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-blue-700 flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Q2 2024 - Growth Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <ul className="space-y-1 text-sm">
                          <li>🔄 Advanced AI recommendations</li>
                          <li>🔄 Automated scheduling</li>
                          <li>🔄 Integration APIs (Slack, Asana)</li>
                          <li>🔄 Custom reporting dashboard</li>
                        </ul>
                        <ul className="space-y-1 text-sm">
                          <li>🔄 Client portal access</li>
                          <li>🔄 Time tracking integration</li>
                          <li>🔄 Budget vs. actual analysis</li>
                          <li>🔄 Team performance metrics</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-purple-200 bg-purple-50">
                    <CardHeader>
                      <CardTitle className="text-purple-700 flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        Q3-Q4 2024 - Scale Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <ul className="space-y-1 text-sm">
                          <li>🚀 Multi-company management</li>
                          <li>🚀 Advanced analytics & forecasting</li>
                          <li>🚀 Resource marketplace</li>
                          <li>🚀 White-label solutions</li>
                        </ul>
                        <ul className="space-y-1 text-sm">
                          <li>🚀 API for custom integrations</li>
                          <li>🚀 Enterprise security features</li>
                          <li>🚀 International expansion</li>
                          <li>🚀 Industry-specific templates</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-orange-700">Strategic Priorities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Product</h4>
                        <ul className="text-sm space-y-1">
                          <li>• AI-powered optimization</li>
                          <li>• Seamless integrations</li>
                          <li>• Mobile-first experience</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Market</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Design studio penetration</li>
                          <li>• Enterprise expansion</li>
                          <li>• International markets</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Business</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Series A fundraising</li>
                          <li>• Team scaling to 25+</li>
                          <li>• $10M ARR target</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">💡 Discussion Point:</h3>
                  <p className="text-yellow-700">What features would you prioritize differently? What market opportunities are we missing?</p>
                </div>
              </div>
            )}

            {/* Slide 7: Technical Stack */}
            {currentSlide === 6 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <BarChart3 className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Technical Architecture</h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-blue-700">Frontend Stack</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">React 18</Badge>
                        <span className="text-sm">Modern component architecture</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">TypeScript</Badge>
                        <span className="text-sm">Type-safe development</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Tailwind CSS</Badge>
                        <span className="text-sm">Utility-first styling</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Vite</Badge>
                        <span className="text-sm">Fast build tooling</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">React Query</Badge>
                        <span className="text-sm">Data fetching & caching</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-green-700">Backend Stack</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Supabase</Badge>
                        <span className="text-sm">PostgreSQL + Auth + Storage</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Edge Functions</Badge>
                        <span className="text-sm">Serverless API endpoints</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Row Level Security</Badge>
                        <span className="text-sm">Data access control</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Real-time</Badge>
                        <span className="text-sm">Live updates & collaboration</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-purple-700">Architecture Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Scalability</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Serverless architecture</li>
                          <li>• Auto-scaling database</li>
                          <li>• CDN-distributed assets</li>
                          <li>• Optimized for growth</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Performance</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Sub-second load times</li>
                          <li>• Real-time updates</li>
                          <li>• Optimistic UI updates</li>
                          <li>• Efficient data caching</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Security</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Enterprise-grade auth</li>
                          <li>• Row-level security</li>
                          <li>• GDPR compliant</li>
                          <li>• Audit logging</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                      <CardTitle className="text-orange-700">Development Advantages</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>• <strong>Rapid iteration:</strong> Modern tooling enables fast feature development</p>
                      <p>• <strong>Type safety:</strong> Reduces bugs and improves developer productivity</p>
                      <p>• <strong>Component reusability:</strong> Modular architecture for scalable codebase</p>
                      <p>• <strong>Built-in best practices:</strong> Security, performance, and scalability by default</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                      <CardTitle className="text-red-700">Technical Debt Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>• <strong>Very low:</strong> Modern stack with current best practices</p>
                      <p>• <strong>Well-structured:</strong> Clean separation of concerns</p>
                      <p>• <strong>Maintainable:</strong> Comprehensive component library</p>
                      <p>• <strong>Future-ready:</strong> Easy to extend and modify</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">💡 Discussion Point:</h3>
                  <p className="text-yellow-700">What's your experience with these technologies? Any concerns or suggestions for the tech stack?</p>
                </div>
              </div>
            )}

            {/* Slide 8: Business Model */}
            {currentSlide === 7 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <DollarSign className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Business Model</h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-blue-700">Starter</CardTitle>
                      <div className="text-3xl font-bold text-blue-900">$49/mo</div>
                      <p className="text-sm text-blue-600">Per team (up to 15 members)</p>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>✅ Resource allocation grid</p>
                      <p>✅ Basic dashboard</p>
                      <p>✅ Team management</p>
                      <p>✅ Project planning</p>
                      <p>✅ Email support</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-green-200 bg-green-50 ring-2 ring-green-300">
                    <CardHeader>
                      <CardTitle className="text-green-700 flex items-center gap-2">
                        Professional
                        <Badge variant="secondary">Popular</Badge>
                      </CardTitle>
                      <div className="text-3xl font-bold text-green-900">$149/mo</div>
                      <p className="text-sm text-green-600">Per team (up to 50 members)</p>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>✅ Everything in Starter</p>
                      <p>✅ Advanced analytics</p>
                      <p>✅ Smart insights & AI</p>
                      <p>✅ Integrations</p>
                      <p>✅ Priority support</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-purple-200 bg-purple-50">
                    <CardHeader>
                      <CardTitle className="text-purple-700">Enterprise</CardTitle>
                      <div className="text-3xl font-bold text-purple-900">Custom</div>
                      <p className="text-sm text-purple-600">Unlimited members</p>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>✅ Everything in Professional</p>
                      <p>✅ White-label options</p>
                      <p>✅ Custom integrations</p>
                      <p>✅ Dedicated support</p>
                      <p>✅ SLA guarantees</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-green-700">Revenue Projections</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-semibold">Year 1 Target:</span>
                          <span className="font-bold text-green-700">$500K ARR</span>
                        </div>
                        <p className="text-sm text-gray-600">50 customers @ $10K average ACV</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-semibold">Year 2 Target:</span>
                          <span className="font-bold text-green-700">$2.5M ARR</span>
                        </div>
                        <p className="text-sm text-gray-600">200 customers @ $12K average ACV</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-semibold">Year 3 Target:</span>
                          <span className="font-bold text-green-700">$10M ARR</span>
                        </div>
                        <p className="text-sm text-gray-600">600 customers @ $16K average ACV</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-blue-700">Unit Economics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold">CAC</p>
                          <p className="text-2xl font-bold text-blue-700">$800</p>
                        </div>
                        <div>
                          <p className="font-semibold">LTV</p>
                          <p className="text-2xl font-bold text-blue-700">$24K</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold">LTV:CAC</p>
                          <p className="text-2xl font-bold text-green-600">30:1</p>
                        </div>
                        <div>
                          <p className="font-semibold">Payback</p>
                          <p className="text-2xl font-bold text-blue-700">8 mo</p>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold">Monthly Churn</p>
                        <p className="text-2xl font-bold text-red-600">3.5%</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-orange-700">Go-to-Market Strategy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Content Marketing</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Resource planning guides</li>
                          <li>• Design studio case studies</li>
                          <li>• SEO-optimized content</li>
                          <li>• Industry thought leadership</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Partnership Channel</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Design consultants</li>
                          <li>• Project management tools</li>
                          <li>• Industry associations</li>
                          <li>• Referral programs</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Direct Sales</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Targeted outbound</li>
                          <li>• Demo-driven sales</li>
                          <li>• Free trial conversion</li>
                          <li>• Account expansion</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">💡 Discussion Point:</h3>
                  <p className="text-yellow-700">What's your take on these pricing tiers and business model? How would you approach customer acquisition?</p>
                </div>
              </div>
            )}

            {/* Slide 9: Team Vision */}
            {currentSlide === 8 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <Users className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Team Vision</h2>
                  <p className="text-xl text-gray-600">Building the future of resource planning</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-blue-700">What We're Looking For</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Co-Founder/CTO</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Full-stack development experience</li>
                          <li>• Product architecture vision</li>
                          <li>• Team leadership skills</li>
                          <li>• Startup experience preferred</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Head of Product</h4>
                        <ul className="text-sm space-y-1">
                          <li>• B2B SaaS product experience</li>
                          <li>• User research & design thinking</li>
                          <li>• Data-driven decision making</li>
                          <li>• Growth mindset</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">VP of Sales</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Enterprise sales background</li>
                          <li>• Creative industry connections</li>
                          <li>• Team building experience</li>
                          <li>• Revenue accountability</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-green-700">What We Offer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Equity & Compensation</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Significant equity stake (2-10%)</li>
                          <li>• Competitive base salary</li>
                          <li>• Performance bonuses</li>
                          <li>• Full benefits package</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Growth Opportunity</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Ground floor of high-growth startup</li>
                          <li>• Shape product and company direction</li>
                          <li>• Build and lead teams</li>
                          <li>• Industry recognition potential</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Work Environment</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Remote-first culture</li>
                          <li>• Flexible working arrangements</li>
                          <li>• Learning & development budget</li>
                          <li>• Collaborative team culture</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="border-purple-200 bg-purple-50">
                  <CardHeader>
                    <CardTitle className="text-purple-700">Company Culture & Values</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Target className="w-6 h-6 text-purple-600" />
                        </div>
                        <h4 className="font-semibold mb-1">Customer-Obsessed</h4>
                        <p className="text-sm">Every decision starts with customer value</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="font-semibold mb-1">Growth Mindset</h4>
                        <p className="text-sm">Continuous learning and improvement</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <h4 className="font-semibold mb-1">Team First</h4>
                        <p className="text-sm">Collaborative and supportive environment</p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Rocket className="w-6 h-6 text-orange-600" />
                        </div>
                        <h4 className="font-semibold mb-1">Move Fast</h4>
                        <p className="text-sm">Bias for action and rapid iteration</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="text-orange-700">Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-700 mt-0.5">1</div>
                        <div>
                          <h4 className="font-semibold">Initial Discussion</h4>
                          <p className="text-sm text-gray-600">Explore mutual fit and answer questions</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-700 mt-0.5">2</div>
                        <div>
                          <h4 className="font-semibold">Product & Market Deep Dive</h4>
                          <p className="text-sm text-gray-600">Detailed analysis and strategic planning session</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-700 mt-0.5">3</div>
                        <div>
                          <h4 className="font-semibold">Terms & Equity Discussion</h4>
                          <p className="text-sm text-gray-600">Align on compensation, equity, and responsibilities</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-sm font-bold text-orange-700 mt-0.5">4</div>
                        <div>
                          <h4 className="font-semibold">Trial Period</h4>
                          <p className="text-sm text-gray-600">2-4 week working trial to ensure great fit</p>
                        </div>
                      </li>
                    </ol>
                  </CardContent>
                </Card>

                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">💡 Open Discussion:</h3>
                  <p className="text-yellow-700">What excites you most about this opportunity? What concerns or questions do you have? How do you see yourself contributing to Bareresource's success?</p>
                </div>
              </div>
            )}

            </CardContent>
          </Card>
        )}

        {/* Navigation Controls */}
        {currentSlide >= 0 && (
          <div className="flex justify-between items-center mt-6">
            <Button 
              onClick={prevSlide} 
              variant="outline"
              disabled={currentSlide === 0}
            >
              Previous
            </Button>
            
            <div className="text-sm text-gray-500">
              {currentSlide + 1} of {slides.length - 1}
            </div>
            
            <Button 
              onClick={nextSlide}
              disabled={currentSlide === slides.length - 2}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Presentation;
