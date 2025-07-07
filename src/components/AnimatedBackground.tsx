import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-purple-500/30 dark:from-blue-600/20 dark:to-purple-700/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-blob"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/30 to-pink-500/30 dark:from-purple-600/20 dark:to-pink-700/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-blob animation-delay-2000"></div>
      <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 dark:from-yellow-600/20 dark:to-orange-700/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-blob animation-delay-4000"></div>
      
      {/* Additional floating elements */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 dark:from-cyan-600/15 dark:to-blue-700/15 rounded-full filter blur-lg animate-float"></div>
      <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-gradient-to-r from-green-400/20 to-emerald-500/20 dark:from-green-600/15 dark:to-emerald-700/15 rounded-full filter blur-lg animate-float animation-delay-3000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-rose-400/20 to-pink-500/20 dark:from-rose-600/15 dark:to-pink-700/15 rounded-full filter blur-lg animate-float animation-delay-1500"></div>
      
      {/* Particle effects */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 dark:bg-white/10 rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Gradient mesh overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent dark:via-black/10 animate-pulse-slow"></div>
    </div>
  );
};

export default AnimatedBackground;