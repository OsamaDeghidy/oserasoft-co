import HeroBackground from '@/components/HeroBackground'
import About from '@/components/About'
import Projects from '@/components/Projects'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-lisbon-brown via-himalaya/30 to-lisbon-brown min-h-screen">
      <HeroBackground />
      <About />
      <Projects />
      <Contact />
      <Footer />
    </div>
  )
}