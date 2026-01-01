import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Monitor, Tablet, Smartphone, ChevronLeft, ChevronRight, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';

interface Screenshot {
  id: string;
  title: string;
  description: string;
  category: string;
  features: string[];
  imagePlaceholder: string;
  route: string;
}

const screenshots: Screenshot[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Real-time metrics and team insights at a glance',
    category: 'Overview',
    features: ['Project analytics', 'Team utilization', 'Capacity metrics', 'Smart insights'],
    imagePlaceholder: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    route: '/dashboard'
  },
  {
    id: 'weekly-overview',
    title: 'Weekly Overview',
    description: 'Visual capacity planning with flexible views',
    category: 'Planning',
    features: ['Table view', 'Grid view', 'Carousel view', 'Leave integration'],
    imagePlaceholder: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    route: '/weekly-overview'
  },
  {
    id: 'resource-scheduling',
    title: 'Resource Scheduling',
    description: 'Allocate team members to projects efficiently',
    category: 'Scheduling',
    features: ['By project view', 'By person view', 'Drag & drop', 'Real-time updates'],
    imagePlaceholder: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    route: '/resource-scheduling'
  },
  {
    id: 'capacity-heatmap',
    title: 'Capacity Heatmap',
    description: 'See team workload at a glance with color coding',
    category: 'Insights',
    features: ['Color-coded capacity', 'Week-by-week view', 'Overload detection', 'Team filtering'],
    imagePlaceholder: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    route: '/capacity-heatmap'
  },
  {
    id: 'project-pipeline',
    title: 'Project Pipeline',
    description: 'Track projects through stages from start to finish',
    category: 'Projects',
    features: ['Stage tracking', 'Timeline view', 'Status management', 'Budget overview'],
    imagePlaceholder: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    route: '/resource-planning'
  },
  {
    id: 'team-members',
    title: 'Team Members',
    description: 'Manage your team with detailed profiles',
    category: 'Team',
    features: ['Profile cards', 'Skills tracking', 'Department view', 'Capacity settings'],
    imagePlaceholder: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    route: '/team-members'
  },
  {
    id: 'team-leave',
    title: 'Team Leave',
    description: 'Track and manage team availability',
    category: 'Team',
    features: ['Leave calendar', 'Request management', 'Approval workflow', 'Leave types'],
    imagePlaceholder: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    route: '/team-leave'
  },
  {
    id: 'office-settings',
    title: 'Office Settings',
    description: 'Configure your workspace preferences',
    category: 'Settings',
    features: ['Company profile', 'Departments', 'Locations', 'Project stages'],
    imagePlaceholder: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    route: '/office-settings'
  }
];

const categories = ['All', 'Overview', 'Planning', 'Scheduling', 'Insights', 'Projects', 'Team', 'Settings'];

const Screenshots: React.FC = () => {
  const navigate = useNavigate();
  const { startDemoMode } = useDemoAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredScreenshots = selectedCategory === 'All' 
    ? screenshots 
    : screenshots.filter(s => s.category === selectedCategory);

  const handleLaunchDemo = () => {
    startDemoMode();
    navigate('/dashboard');
  };

  const openLightbox = (screenshot: Screenshot, index: number) => {
    setSelectedScreenshot(screenshot);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setSelectedScreenshot(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    const currentIndex = filteredScreenshots.findIndex(s => s.id === selectedScreenshot?.id);
    let newIndex = direction === 'prev' 
      ? (currentIndex - 1 + filteredScreenshots.length) % filteredScreenshots.length
      : (currentIndex + 1) % filteredScreenshots.length;
    setSelectedScreenshot(filteredScreenshots[newIndex]);
    setLightboxIndex(newIndex);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Link 
            to="/" 
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
              App Screenshots
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Explore the powerful features of our resource management platform through these screenshots, or launch the interactive demo to try it yourself.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button
              onClick={handleLaunchDemo}
              size="lg"
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 hover:opacity-90"
            >
              <Play className="w-5 h-5 mr-2" />
              Launch Interactive Demo
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>

          {/* Device Icons */}
          <div className="flex justify-center gap-8 text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              <span className="text-sm">Desktop</span>
            </div>
            <div className="flex items-center gap-2">
              <Tablet className="w-5 h-5" />
              <span className="text-sm">Tablet</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              <span className="text-sm">Mobile</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                  : ''}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScreenshots.map((screenshot, index) => (
              <Card 
                key={screenshot.id}
                className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                onClick={() => openLightbox(screenshot, index)}
              >
                {/* Screenshot Placeholder */}
                <div 
                  className="aspect-video relative overflow-hidden"
                  style={{ background: screenshot.imagePlaceholder }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white/80 text-center p-4">
                      <div className="w-16 h-16 mx-auto mb-2 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Monitor className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-medium">{screenshot.title}</p>
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{screenshot.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {screenshot.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {screenshot.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {screenshot.features.slice(0, 3).map((feature, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {screenshot.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{screenshot.features.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedScreenshot} onOpenChange={() => closeLightbox()}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          {selectedScreenshot && (
            <>
              {/* Screenshot Display */}
              <div 
                className="aspect-video relative"
                style={{ background: selectedScreenshot.imagePlaceholder }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center p-8">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Monitor className="w-12 h-12" />
                    </div>
                    <p className="text-xl font-medium">{selectedScreenshot.title}</p>
                    <p className="text-white/70 mt-2">Screenshot preview</p>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedScreenshot.title}</h2>
                    <p className="text-muted-foreground mt-1">{selectedScreenshot.description}</p>
                  </div>
                  <Badge>{selectedScreenshot.category}</Badge>
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-2">Key Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedScreenshot.features.map((feature, i) => (
                      <Badge key={i} variant="secondary">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      closeLightbox();
                      startDemoMode();
                      navigate(selectedScreenshot.route);
                    }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Try This Feature
                  </Button>
                  <Button variant="outline" onClick={closeLightbox}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Resource Management?</h2>
          <p className="text-xl opacity-90 mb-8">
            Start your free trial today and see the difference.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={handleLaunchDemo}
              size="lg"
              variant="secondary"
            >
              <Play className="w-5 h-5 mr-2" />
              Try Interactive Demo
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white/10"
              asChild
            >
              <Link to="/auth">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Screenshots;
