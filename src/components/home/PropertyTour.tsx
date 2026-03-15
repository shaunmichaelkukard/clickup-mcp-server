import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, useGLTF, PerspectiveCamera, Environment, Float, PresentationControls } from '@react-three/drei'
import { Loader2, X, Maximize2 } from 'lucide-react'

interface ModelProps {
  url: string
}

function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={1} />
}

interface PropertyTourProps {
  url: string
  onClose: () => void
}

export const PropertyTour = ({ url, onClose }: PropertyTourProps) => {
  const is3DModel = url.toLowerCase().endsWith('.glb') || url.toLowerCase().endsWith('.gltf')

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-background/95 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full h-full max-w-7xl mx-auto glass-card overflow-hidden border border-white/10 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 relative z-10 bg-background/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="h-1 w-8 bg-primary rounded-full" />
            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-foreground">Immersive 3D Tour</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-foreground/50 hover:text-primary"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tour Content */}
        <div className="flex-1 relative bg-[#02040a]">
          {is3DModel ? (
            <Canvas shadows dpr={[1, 2]}>
              <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
              <Suspense fallback={null}>
                <Stage environment="city" intensity={0.5} contactShadow={{ opacity: 0.4, blur: 2 }}>
                  <Model url={url} />
                </Stage>
                <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} enableDamping />
              </Suspense>
              <Environment preset="city" />
            </Canvas>
          ) : (
            <iframe 
              src={url} 
              className="w-full h-full border-none"
              allowFullScreen
              allow="xr-spatial-tracking"
            />
          )}

          {/* Loading State for 3D */}
          <Suspense fallback={
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-foreground/40">Initialising Virtual Environment...</p>
            </div>
          }>
            {null}
          </Suspense>

          {/* HUD Info */}
          <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-6 pointer-events-none">
            <div className="glass-card p-6 border-white/5 pointer-events-auto max-w-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">Controls</p>
              <p className="text-xs text-foreground/60 leading-relaxed font-mono">
                {is3DModel ? 'DRAG to rotate • SCROLL to zoom • RIGHT CLICK to pan' : 'Interact with the embedded viewer to explore the property.'}
              </p>
            </div>
            
            <div className="flex gap-3 pointer-events-auto">
              <div className="badge-glass flex items-center gap-2 text-white glow-primary px-4 py-2 border-primary/20">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Live 3D Render</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
