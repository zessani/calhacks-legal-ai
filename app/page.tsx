"use client";

import Link from 'next/link';
import React from 'react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001f3f] to-[#000a1a] text-white selection:bg-blue-600/30">
      {/* Custom Font Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap');

        h1, h2, h3 {
          font-family: 'Space Grotesk', sans-serif;
        }

        body {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen px-6 space-y-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-30 animate-pulse" />
          <h1 className="relative text-6xl md:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-blue-50">
            LegalAI
          </h1>
        </div>

        <p className="text-2xl max-w-2xl mx-auto text-blue-100/90 font-light">
          Save thousands in legal fees. Understand complex legal documents in minutes, not hours.
        </p>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <Link href="/auth" className="group relative inline-flex items-center justify-center">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <button className="relative px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg transition duration-300 shadow-lg">
              Try For Free
            </button>
          </Link>
          <p className="text-blue-100/70 text-sm">No credit card required</p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          {[
            { metric: "85%", desc: "Average cost savings vs traditional legal services" },
            { metric: "15 min", desc: "Average time to understand complex documents" },
            { metric: "24/7", desc: "Instant access to legal document analysis" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-blue-50">{stat.metric}</span>
              <span className="text-sm text-blue-100/70 mt-2">{stat.desc}</span>
            </div>
          ))}
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-10 animate-fade-in-up">
          <p className="text-lg font-light opacity-70">See How It Works</p>
          <svg className="w-6 h-6 mx-auto mt-2 animate-bounce opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#002b5c]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-blue-50">
            Cut Through Legal Complexity
          </h2>
          <p className="text-xl text-blue-100/80 font-light">
            Get instant clarity on legal documents at a fraction of traditional costs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                title: "Smart Document Analysis",
                desc: "Our AI breaks down complex legal language into clear, actionable points, saving you expensive consultation hours."
              },
              {
                title: "Native Understanding",
                desc: "Our AI simplifies the content and voices it out into your native language"
              },
              {
                title: "Risk Identification",
                desc: "Automatically highlight potential issues and obligations, preventing costly oversights."
              }
            ].map((feature, i) => (
              <div key={i} className="group p-6 rounded-lg bg-[#003c71]/50 backdrop-blur-sm border border-blue-400/10 transition-all duration-300 hover:border-blue-400/30 hover:bg-[#003c71]/80">
                <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-blue-50">
                  {feature.title}
                </h3>
                <p className="text-blue-100/70">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-[#003b5c]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-blue-50">
            Save Time & Money
          </h2>
          <p className="text-xl text-blue-100/80 font-light">
            Perfect for businesses and individuals looking to reduce legal costs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {[
              {
                title: "Contract Review",
                desc: "Review contracts in minutes instead of hours. Identify key terms, obligations, and potential risks without expensive lawyer consultations."
              },
              {
                title: "Legal Document Drafting",
                desc: "Get guidance on document creation and modification, reducing dependency on costly legal services."
              },
              {
                title: "Lease Review",
                desc: "Efficiently analyze lease agreements to understand terms, conditions, and potential red flags, ensuring informed decision-making."
              },
              {
                title: "Legal Fee Savings",
                desc: "Reduce legal consulting hours by getting instant clarity on document contents and implications."
              }
            ].map((use, i) => (
              <div key={i} className="group p-6 rounded-lg bg-[#003c71]/50 backdrop-blur-sm border border-blue-400/10 transition-all duration-300 hover:border-blue-400/30 hover:bg-[#003c71]/80">
                <h3 className="text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-blue-50">
                  {use.title}
                </h3>
                <p className="text-blue-100/70">{use.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4 relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white">Start Saving on Legal Costs Today</h2>
          <p className="text-xl text-blue-100/90 font-light">Join thousands of businesses saving up to 85% on legal document costs</p>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center mt-8">
            <Link href="/auth" className="group relative inline-flex items-center justify-center">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-blue-300 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <button className="relative px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 rounded-lg text-lg transition duration-300 shadow-lg font-medium">
                Start Free Trial
              </button>
            </Link>
            <span className="text-blue-100/70">or</span>
            <Link href="/pricing" className="text-blue-100 hover:text-white transition-colors">
              View Pricing Plans →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-blue-900/50 backdrop-blur-sm text-center text-sm text-blue-100/50">
        © 2024 Legal AI. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;