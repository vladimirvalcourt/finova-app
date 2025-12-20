"use client";

import { LandingHeader } from '@/components/marketing/LandingHeader'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight, Globe, Users, TrendingUp, CheckCircle2 } from 'lucide-react'

// --- Visual Components ---

const AppMockup = () => {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '420px', margin: '0 auto' }}>
      {/* Background Decor Elements */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '100px',
        height: '100px',
        background: '#F59E0B',
        filter: 'blur(50px)',
        opacity: 0.4,
        borderRadius: '50%',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20px',
        left: '-20px',
        width: '120px',
        height: '120px',
        background: '#10B981',
        filter: 'blur(60px)',
        opacity: 0.3,
        borderRadius: '50%',
        zIndex: 0
      }} />

      {/* Main Card */}
      <div className="glass-card-dark" style={{
        borderRadius: '24px',
        padding: '32px',
        color: 'white',
        transform: 'rotateY(-10deg) rotateX(5deg)',
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        position: 'relative',
        zIndex: 10,
        animation: 'float 6s ease-in-out infinite',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(23, 23, 28, 0.85)', // Darker background for contrast
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header / Balance */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#9CA3AF' }}>Total Balance</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '6px' }} />
            </div>
          </div>
          <h3 style={{ fontSize: '42px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em', lineHeight: 1 }}>$12,450.00</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
            <div style={{ padding: '4px 10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', borderRadius: '100px', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} /> +2.4%
            </div>
            <span style={{ fontSize: '13px', color: '#6B7280' }}>vs last month</span>
          </div>
        </div>

        {/* Recent Transactions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {[
            { icon: "🛒", title: "Grocery Store", sub: "Food & Drink", amount: "-$84.30" },
            { icon: "💸", title: "Transfer to Mom", sub: "Family", amount: "-$200.00" },
            { icon: "🎬", title: "Netflix", sub: "Subscription", amount: "-$15.99" }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{
                  width: '44px', height: '44px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>{item.icon}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 500, color: '#F3F4F6' }}>{item.title}</div>
                  <div style={{ fontSize: '13px', color: '#6B7280' }}>{item.sub}</div>
                </div>
              </div>
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#F3F4F6' }}>{item.amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Card Behind (Budget) - Simplified */}
      <div className="glass-card" style={{
        position: 'absolute',
        top: '40%',
        right: '-50px',
        width: '160px',
        borderRadius: '20px',
        padding: '20px',
        zIndex: 20,
        animation: 'float-delayed 7s ease-in-out infinite',
        background: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ fontSize: '12px', color: '#52525B', fontWeight: 600 }}>Monthly Budget</div>
          <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>75%</div>
        </div>
        <div style={{ height: '6px', background: '#F4F4F5', borderRadius: '10px', overflow: 'hidden', marginBottom: '8px' }}>
          <div style={{ width: '75%', height: '100%', background: '#10B981', borderRadius: '10px' }} />
        </div>
        <div style={{ fontSize: '11px', color: '#A1A1AA' }}>$1,200 spent</div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div style={{
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: '#FAFAF9',
      minHeight: '100vh',
      color: '#18181B',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* Ambient Background Animation */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div className="animate-blob" style={{ position: 'absolute', top: '10%', left: '20%', width: '400px', height: '400px', background: '#E0E7FF', borderRadius: '50%', mixBlendMode: 'multiply', filter: 'blur(80px)', opacity: 0.7 }} />
        <div className="animate-blob animation-delay-2000" style={{ position: 'absolute', top: '20%', right: '20%', width: '350px', height: '350px', background: '#FCE7F3', borderRadius: '50%', mixBlendMode: 'multiply', filter: 'blur(80px)', opacity: 0.7 }} />
        <div className="animate-blob animation-delay-4000" style={{ position: 'absolute', bottom: '20%', left: '30%', width: '300px', height: '300px', background: '#FEF3C7', borderRadius: '50%', mixBlendMode: 'multiply', filter: 'blur(80px)', opacity: 0.7 }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <LandingHeader />

        {/* Hero Section */}
        <section style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '8rem 2rem 6rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          alignItems: 'center',
          gap: '4rem'
        }}>
          {/* Text Content */}
          <div style={{ maxWidth: '600px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(0,0,0,0.05)',
                backdropFilter: 'blur(4px)',
                borderRadius: '100px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#52525B',
                width: 'fit-content',
                marginBottom: '1.5rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <span>Built for families like yours</span>
            </div>

            <h1
              style={{
                fontFamily: 'serif',
                fontSize: 'clamp(3.5rem, 8vw, 5rem)',
                lineHeight: 1,
                fontWeight: 500,
                letterSpacing: '-0.04em',
                margin: 0,
                marginBottom: '1.5rem'
              }}
            >
              Manage money.<br />
              <span style={{ color: '#71717A', fontStyle: 'italic' }}>In your language.</span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
                lineHeight: 1.6,
                color: '#52525B',
                maxWidth: '480px',
                margin: 0,
                marginBottom: '2.5rem',
                // Text shadow kept for contrast against any overlapping blobs
                textShadow: '0 2px 20px rgba(255,255,255,0.8)'
              }}
            >
              The first finance app that speaks Spanish, Portuguese, Creole, and 20+ more languages.
              Because you shouldn't have to translate your finances.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button style={{
                padding: '1.1rem 2.2rem',
                background: '#18181B',
                color: 'white',
                border: 'none',
                borderRadius: '100px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
              }}>
                Start budgeting in your language
              </button>

              <button style={{
                padding: '1.1rem 2.2rem',
                background: 'rgba(255,255,255,0.5)',
                color: '#18181B',
                border: '1.5px solid #E4E4E7',
                borderRadius: '100px',
                fontSize: '1rem',
                fontWeight: 500,
                cursor: 'pointer',
                backdropFilter: 'blur(4px)'
              }}>
                See it in action →
              </button>
            </div>
          </div>

          {/* Visual Content - App Mockup */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <AppMockup />
          </div>
        </section >

        {/* Social Proof Strip */}
        <div style={{
          marginTop: '-2rem',
          marginBottom: '6rem',
          borderTop: '1px solid rgba(0,0,0,0.05)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(5px)',
          padding: '2rem 0'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#A1A1AA', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Trusted By Families In</span>
            <div style={{ display: 'flex', gap: '2rem', opacity: 0.6, fontWeight: 500, fontSize: '1.1rem' }}>
              <span>🇺🇸 United States</span>
              <span>🇲🇽 Mexico</span>
              <span>🇧🇷 Brazil</span>
              <span>🇨🇴 Colombia</span>
            </div>
          </div>
        </div>


        {/* Features Section - Interactive Cards */}
        < section style={{
          padding: '6rem 2rem',
        }
        }>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Section Header */}
            <div style={{ marginBottom: '4rem', maxWidth: '600px' }}>
              <p style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#A1A1AA',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '1rem'
              }}>
                Features
              </p>
              <h2 style={{
                fontFamily: 'serif',
                fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                lineHeight: 1.1,
                fontWeight: 500,
                letterSpacing: '-0.02em',
                marginBottom: '1rem'
              }}>
                Made for how you actually live
              </h2>
              <p style={{ fontSize: '1.125rem', color: '#71717A', lineHeight: 1.6 }}>
                Not another generic bank app. This one gets you.
              </p>
            </div>

            {/* Grid Feature Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}>
              {[
                {
                  label: "Language",
                  title: "Talk to your money.",
                  desc: "Type in Spanish, Portuguese, or Creole. Our AI understands you.",
                  icon: <Globe size={28} strokeWidth={1.5} />
                },
                {
                  label: "Family",
                  title: "One family. One budget.",
                  desc: "Collaborate on household expenses and financial goals together.",
                  icon: <Users size={28} strokeWidth={1.5} />
                },
                {
                  label: "Future",
                  title: "Build wealth together.",
                  desc: "Set family goals for the house, the car, or the quinceañera.",
                  icon: <TrendingUp size={28} strokeWidth={1.5} />
                }
              ].map((item, i) => (
                <div key={i} className="glass-card" style={{
                  padding: '2.5rem',
                  borderRadius: '1.5rem',
                  background: 'white',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px -5px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    width: '56px', height: '56px',
                    background: '#F4F4F5',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '2rem',
                    color: '#18181B'
                  }}>
                    {item.icon}
                  </div>

                  <h3 style={{
                    fontFamily: 'serif',
                    fontSize: '1.75rem',
                    fontWeight: 500,
                    margin: 0,
                    marginBottom: '1rem',
                    color: '#18181B'
                  }}>
                    {item.title}
                  </h3>

                  <p style={{
                    fontSize: '1.125rem',
                    color: '#52525B',
                    margin: 0,
                    lineHeight: 1.6
                  }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section >

        {/* Final CTA Section */}
        < section style={{
          padding: '10rem 2rem',
          textAlign: 'center',
          position: 'relative'
        }}>
          <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
            <h2 style={{
              fontFamily: 'serif',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.1,
              fontWeight: 500,
              letterSpacing: '-0.02em',
              marginBottom: '1.5rem'
            }}>
              Show your family there's a better way.
            </h2>
            <p style={{
              fontSize: '1.25rem',
              color: '#71717A',
              marginBottom: '3rem',
              lineHeight: 1.5
            }}>
              Free forever. No credit card. No tricks.
            </p>
            <button style={{
              padding: '1.25rem 3rem',
              background: '#18181B',
              color: 'white',
              border: 'none',
              borderRadius: '100px',
              fontSize: '1.125rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              marginBottom: '2.5rem'
            }}>
              Get Started — It's Free
            </button>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              flexWrap: 'wrap',
              color: '#52525B',
              fontSize: '0.875rem',
              fontWeight: 500
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={16} /> Works on any phone</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={16} /> 18 languages</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={16} /> Secure</span>
            </div>
          </div>
        </section >

        {/* Footer */}
        < footer style={{
          padding: '3rem 2rem',
          borderTop: '1px solid rgba(0,0,0,0.05)',
          background: 'rgba(255,255,255,0.5)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{
              fontFamily: 'serif',
              fontSize: '1.5rem',
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}>
              Finova
            </div>
            <p style={{
              color: '#A1A1AA',
              fontSize: '0.875rem'
            }}>
              Built by immigrants, for immigrants. © 2024
            </p>
          </div>
        </footer >
      </div>
    </div >
  )
}
