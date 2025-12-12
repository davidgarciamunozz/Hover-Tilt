import './App.css'
// import { HoverTiltDemo } from './components/HoverTilt'
import { CardScene } from './components/ThreeCard'

function App() {

  return (
    <>
      {/* <HoverTiltDemo></HoverTiltDemo> */}

      {/* Three.js Card Scene - Multiple Cards in One Canvas */}
      <CardScene
        cards={[
          {
            // Card 1 - Left side
            frontImg: "/cards/pokemon/charizard.png",
            backImg: "/cards/pokemon/poke-back.jpg",
            maskImg: "/cards/pokemon/charizard-foil-2.webp",
            foilImg: "/cards/pokemon/charizard-foil-1.webp",
            glowRadius: 0.8,
            glowIntensity: 0.3,
            tiltIntensity: 0.2,
            position: [-1.5, 0, 0], // Position left
            enableAura: true,
            enableParticles: true,
            auraColor1: '#BDBEB0',
            auraColor2: '#A5C3C5',
            particleColor: '#7DEBE8',
            particleCount: 100,
          },
          {
            // Card 2 - Right side (custom dimensions)
            frontImg: "/cards/back2.png",
            backImg: "/cards/OFCard-b.png",
            maskImg: "/cards/OF-mask.png",
            foilImg: "/cards/OF-mask.png",
            glowRadius: 0.4,
            glowIntensity: 0.1,
            tiltIntensity: 0.2,
            position: [1.5, 0, 0], // Position right
            enableAura: true,
            enableParticles: false,
            auraColor1: '#BDBEB0',
            auraColor2: '#A5C3C5',
            particleColor: '#7DEBE8',
            particleCount: 100,
            cardWidth: 2, // Same width
            cardHeight: 3.2, // Taller than Pokemon card
          },
        ]}
      />
    </>
  )
}

export default App
