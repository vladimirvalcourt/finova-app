
import { LandingHeader } from '@/components/marketing/LandingHeader'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Home() {
  return (
    <div style={{
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: '#FAFAF9',
      minHeight: '100vh',
      color: '#18181B',
      overflowX: 'hidden'
    }}>
      <LandingHeader />

      {/* Hero Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '10rem 2rem 8rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '4rem'
      }}>
        {/* Text Content */}
        <div style={{ maxWidth: '600px' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: 'rgba(0,0,0,0.04)',
              borderRadius: '100px',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#52525B',
              width: 'fit-content',
              marginBottom: '1.5rem'
            }}
          >
            <span>Built for families like yours</span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: 'serif',
              fontSize: 'clamp(3.5rem, 8vw, 5.5rem)',
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

          {/* Subheadline */}
          <p
            style={{
              fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
              lineHeight: 1.6,
              color: '#52525B',
              maxWidth: '480px',
              margin: 0,
              marginBottom: '2rem'
            }}
          >
            The first finance app that speaks Spanish, Tagalog, Creole, and 15+ more languages.
            Because you shouldn't have to translate your bank account.
          </p>

          {/* CTA Buttons */}
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
              background: 'transparent',
              color: '#18181B',
              border: '1.5px solid #E4E4E7',
              borderRadius: '100px',
              fontSize: '1rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}>
              See it in action →
            </button>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section style={{
        background: 'white',
        padding: '6rem 2rem',
        borderRadius: '3rem 3rem 0 0'
      }}>
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

          {/* Minimalist Feature List */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
            marginTop: '4rem',
          }}>
            {[
              {
                label: "01 / Language",
                title: "Talk to your money.",
                desc: "Type in Spanish, Tagalog, or Creole. Our AI understands you."
              },
              {
                label: "02 / Family",
                title: "One family. One budget.",
                desc: "Collaborate on household expenses and financial goals together."
              },
              {
                label: "03 / Future",
                title: "Build wealth together.",
                desc: "Set family goals for the house, the car, or the quinceañera."
              }
            ].map((item, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '2rem',
                padding: '3rem 0',
                borderBottom: '1px solid #E4E4E7',
                alignItems: 'baseline'
              }}>
                <span style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#A1A1AA',
                  letterSpacing: '0.05em'
                }}>
                  {item.label}
                </span>

                <h3 style={{
                  fontFamily: 'serif',
                  fontSize: '2rem',
                  fontWeight: 500,
                  margin: 0,
                  color: '#18181B'
                }}>
                  {item.title}
                </h3>

                <p style={{
                  fontSize: '1.125rem',
                  color: '#52525B',
                  margin: 0,
                  maxWidth: '300px',
                  lineHeight: 1.6
                }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Final CTA Section */}
      <section style={{
        background: 'white',
        padding: '10rem 2rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
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
          <p style={{
            color: '#A1A1AA',
            fontSize: '0.875rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <span>Works on any phone</span>
            <span>18 languages</span>
            <span>Secure</span>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '3rem 2rem',
        borderTop: '1px solid #F4F4F5',
        background: 'white'
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

          </div>
          <p style={{
            color: '#A1A1AA',
            fontSize: '0.875rem'
          }}>
            Built by immigrants, for immigrants. © 2024
          </p>
        </div>
      </footer>
    </div>
  )
}
