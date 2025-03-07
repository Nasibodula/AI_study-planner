import React from 'react';
import { Brain, Calendar, Camera, BarChart3, Users, Settings } from 'lucide-react';

const Button = ({ children, variant = 'primary', size = 'lg', className = '' }) => {
  const baseStyles = "font-semibold rounded-lg transition-colors duration-200";
  const sizeStyles = size === 'lg' ? 'px-6 py-3' : 'px-4 py-2';
  
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-white text-blue-900 hover:bg-gray-100",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
  };

  return (
    <button className={`${baseStyles} ${sizeStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
      {children}
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <Card className="p-6">
      <div className="text-center">
        <div className="mb-4 flex justify-center">{icon}</div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Card>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-blue-900 mb-6">
          Master Your Study Journey
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Enhance your learning experience with AI-powered focus tracking and personalized study recommendations.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="primary">
            Get Started
          </Button>
          <Button variant="outline">
            Learn More
          </Button>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Calendar className="w-8 h-8 text-blue-600" />}
            title="Study Planner"
            description="Plan your study sessions with our intuitive calendar-based scheduling system."
          />
          <FeatureCard
            icon={<Camera className="w-8 h-8 text-blue-600" />}
            title="Focus Tracking"
            description="Real-time focus monitoring with camera-based attention tracking."
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8 text-blue-600" />}
            title="Analytics Dashboard"
            description="Visualize your progress with detailed performance analytics."
          />
          <FeatureCard
            icon={<Brain className="w-8 h-8 text-blue-600" />}
            title="Smart Recommendations"
            description="Get personalized study suggestions powered by AI."
          />
          <FeatureCard
            icon={<Users className="w-8 h-8 text-blue-600" />}
            title="Study Groups"
            description="Connect and collaborate with fellow students."
          />
          <FeatureCard
            icon={<Settings className="w-8 h-8 text-blue-600" />}
            title="Customizable"
            description="Personalize your study environment to match your preferences."
          />
        </div>
      </section>

      {/* Login/Signup Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Start?</h2>
          <div className="flex gap-4 justify-center">
            <a href='/authpage'>
            <Button variant="secondary">
              Log In
            </Button>
            </a>
            <Button variant="secondary">
              Sign Up
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>© 2025 Study Focus App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

