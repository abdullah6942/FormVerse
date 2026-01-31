'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
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
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="top" className="min-h-screen">
      {/* Navigation */}
      <nav className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-in-out ${
        isScrolled 
          ? 'top-4 w-[95%] max-w-7xl' 
          : 'top-0 w-full'
      }`}>
        <div className={`transition-all duration-700 ease-in-out px-6 py-4 ${
          isScrolled
            ? 'bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl'
            : 'bg-black/60 backdrop-blur-xl border-b border-white/10'
        }`}>
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-450" strokeWidth={1.5} />
              <span className="text-xl font-bold text-white">FormVerse</span>
            </div>
            <div className="flex items-center gap-8">
              <a 
                href="#top" 
                className="text-zinc-300 hover:text-emerald-400 transition-colors font-medium"
              >
                Home
              </a>
              <a 
                href="#features" 
                className="text-zinc-300 hover:text-emerald-400 transition-colors font-medium"
              >
                Features
              </a>
              <a 
                href="#why-formverse" 
                className="text-zinc-300 hover:text-emerald-400 transition-colors font-medium"
              >
                Why FormVerse
              </a>
              <Link href="/app">
              <HoverBorderGradient
                containerClassName="rounded-full"
                className="px-8 py-3.5 bg-emerald-gradient text-white font-medium"
              >
                Try It Free
              </HoverBorderGradient>
            </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <HoverBorderGradient
              containerClassName="rounded-full inline-flex mb-8"
              className="items-center gap-2 px-4 py-1.5 bg-zinc-900 border border-zinc-800 text-sm text-zinc-300"
            >
              <Sparkles className="w-4 h-4" strokeWidth={1.5} />
              Powered by Advanced AI Agents
            </HoverBorderGradient>
            
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 leading-tight">
              Research Forms That
              <span className="italic text-emerald-400"> Adapt To You</span>
            </h1>
            
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Our AI agent interviews you, generates custom research forms, and conducts comprehensive analysis—all tailored to your location and specific needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/app">
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  className="group px-8 py-3.5 bg-emerald-gradient text-white font-medium flex items-center justify-center gap-2"
                >
                  Start Researching
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                </HoverBorderGradient>
              </Link>
              <HoverBorderGradient
                as="button"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                containerClassName="rounded-full"
                className="px-8 py-3.5 bg-zinc-900 border border-zinc-700 text-white"
              >
                See How It Works
              </HoverBorderGradient>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-white mb-4">
              Intelligent Research, Simplified
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
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
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="relative p-8 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl hover:border-emerald-900/50 transition-all duration-500 group overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-emerald-950/30 to-transparent pointer-events-none rounded-2xl" />
                
                {/* Left accent bar */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 group-hover:h-20 w-1 rounded-r-full bg-zinc-700 group-hover:bg-emerald-500 transition-all duration-200" />
                
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 group-hover:border-emerald-900 transition-colors duration-200">
                    <feature.icon className="w-6 h-6 text-zinc-400 group-hover:text-emerald-400 transition-colors duration-200" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:translate-x-1 transition duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              From conversation to insights in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden lg:block absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-emerald-900/30 via-emerald-500/50 to-emerald-900/30" />
            
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: index * 0.1 }}
                className="relative"
              >
                <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 hover:border-emerald-900/50 transition-all duration-500 group overflow-hidden">
                  {/* Gradient overlay on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-emerald-950/30 to-transparent pointer-events-none rounded-2xl" />
                  
                  {/* Left accent bar */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-12 group-hover:h-20 w-1 rounded-r-full bg-zinc-700 group-hover:bg-emerald-500 transition-all duration-200" />
                  
                  <div className="relative z-10">
                    <div className="absolute -top-12 left-0 w-8 h-8 bg-emerald-gradient text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center mb-4 mt-4 group-hover:border-emerald-900 transition-colors duration-200">
                      <step.icon className="w-6 h-6 text-zinc-400 group-hover:text-emerald-400 transition-colors duration-200" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:translate-x-1 transition duration-200">
                      {step.title}
                    </h3>
                    <p className="text-zinc-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="why-formverse" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl text-white mb-6">
                Why FormVerse?
              </h2>
              <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
                Traditional research is time-consuming and often misses regional nuances. Our AI-powered platform adapts to you.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <p className="text-zinc-300 text-lg">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-12 rounded-2xl">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center">
                    <Globe2 className="w-8 h-8 text-emerald-450" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">150+</div>
                    <div className="text-zinc-400">Countries Supported</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center">
                    <Zap className="w-8 h-8 text-emerald-450" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">10x</div>
                    <div className="text-zinc-400">Faster Research</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-center">
                    <Brain className="w-8 h-8 text-emerald-450" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">AI-Powered</div>
                    <div className="text-zinc-400">Intelligent Analysis</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-zinc-950/50 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">
              Ready to Transform Your Research?
            </h2>
            <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
              Join thousands of researchers who are already using AI to gather better insights, faster.
            </p>
            <div className="flex justify-center">
              <Link href="/app">
                <HoverBorderGradient
                  containerClassName="rounded-full"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-gradient text-white font-medium"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                </HoverBorderGradient>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-black border-t border-zinc-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {/* Brand Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-emerald-450" strokeWidth={1.5} />
                <span className="text-xl font-bold text-white">FormVerse</span>
              </div>
              <p className="text-sm text-zinc-500 mb-3">AI-powered research forms</p>
              <p className="text-sm text-zinc-400 leading-relaxed">
                The fastest way to gather insights with intelligent forms that adapt to your needs and location.
              </p>
            </div>

            {/* Product Section */}
            <div className="md:pl-8">
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#features" className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#why-formverse" className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm">
                    Why FormVerse
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm">
                    How It Works
                  </a>
                </li>
              </ul>
            </div>

            {/* Company Section */}
            <div className="md:pl-8">
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://www.clientacquisition.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-emerald-400 transition-colors text-sm"
                  >
                    Client Acquisition
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-zinc-800 text-center">
            <p className="text-sm text-zinc-500">
              © 2026 FormVerse. Built with Mastra, Next.js, and love.
            </p>
          </div>
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
