'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Globe2, 
  Zap, 
  Brain, 
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  FileSearch,
  TrendingUp,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">ResearchForm AI</span>
            </div>
            <Link 
              href="/app"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Try It Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Powered by Advanced AI Agents
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Research Forms That
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent"> Adapt To You</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Our AI agent interviews you, generates custom research forms, and conducts comprehensive analysis—all tailored to your location and specific needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/app"
                className="group px-8 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-semibold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                Start Researching
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-lg border-2 border-gray-200"
              >
                See How It Works
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Intelligent Research, Simplified
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of research with AI-powered dynamic forms and location-aware insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From conversation to insights in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200" />
            
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-primary-400 transition-all shadow-sm hover:shadow-md">
                  <div className="absolute -top-4 left-8 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 mt-4">
                    <step.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why ResearchForm AI?
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Traditional research is time-consuming and often misses regional nuances. Our AI-powered platform adapts to you.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-6 h-6 text-primary-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 text-lg">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-12 rounded-3xl border border-primary-200">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Globe2 className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">150+</div>
                    <div className="text-gray-600">Countries Supported</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Zap className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">10x</div>
                    <div className="text-gray-600">Faster Research</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <Brain className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">AI-Powered</div>
                    <div className="text-gray-600">Intelligent Analysis</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Research?
            </h2>
            <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
              Join thousands of researchers who are already using AI to gather better insights, faster.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl hover:bg-gray-50 transition-all font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary-400" />
            <span className="text-lg font-bold text-white">ResearchForm AI</span>
          </div>
          <p className="text-sm">
            © 2026 ResearchForm AI. Built with Mastra, Next.js, and love.
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: MessageSquare,
    title: 'Conversational Interface',
    description: 'Chat naturally with our AI to describe your research needs. No complex forms or technical jargon.',
  },
  {
    icon: Globe2,
    title: 'Location-Aware',
    description: 'Automatically adapts to your region, considering local regulations, market dynamics, and preferences.',
  },
  {
    icon: Brain,
    title: 'Intelligent Forms',
    description: 'Dynamically generated forms with conditional logic that adapts based on your answers.',
  },
  {
    icon: FileSearch,
    title: 'Deep Research',
    description: 'AI agent conducts comprehensive research using multiple tools and data sources.',
  },
];

const steps = [
  {
    icon: MessageSquare,
    title: 'Conversational Interview',
    description: 'Tell our AI what you want to research through natural conversation.',
  },
  {
    icon: FileSearch,
    title: 'Form Preview',
    description: 'Review the custom-generated form with conditional logic tailored to your needs.',
  },
  {
    icon: Brain,
    title: 'Fill & Submit',
    description: 'Complete the intelligent form that adapts as you provide information.',
  },
  {
    icon: TrendingUp,
    title: 'Get Insights',
    description: 'Receive comprehensive research results with sources and recommendations.',
  },
];

const benefits = [
  'Save hours of manual research and data gathering',
  'Get region-specific insights automatically',
  'Dynamic forms that evolve based on your answers',
  'Comprehensive analysis with source attribution',
  'No technical expertise required',
  'Always adapts to your unique context',
];
