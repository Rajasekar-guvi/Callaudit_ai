// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { PhoneOff, Menu, X } from 'lucide-react';
// import { ThemeToggle } from '../ui/ThemeToggle';
// import { useTheme } from '../../hooks/useTheme';
// import { APP_CONFIG } from '../../config/constants';

// interface StickyHeaderProps {
//   currentPage?: string;
// }

// export const StickyHeader: React.FC<StickyHeaderProps> = ({ currentPage = 'submission' }) => {
//   const { theme, toggleTheme } = useTheme();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   return (
//     <header className="sticky top-0 z-40 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-900 dark:to-purple-900 backdrop-blur-md shadow-lg">
//       <div className="max-w-7xl mx-auto px-6 py-4">
//         <div className="flex items-center justify-between">
//           <Link to="/" className="flex items-center gap-3 group">
//             <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
//               <PhoneOff className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-white">{APP_CONFIG.appName}</h1>
//               <p className="text-xs text-white/80">AI Compliance</p>
//             </div>
//           </Link>

//           <nav className="hidden md:flex items-center gap-8">
//             <Link
//               to="/"
//               className={`text-sm font-medium transition-colors ${
//                 currentPage === 'submission'
//                   ? 'text-white border-b-2 border-white pb-1'
//                   : 'text-white/80 hover:text-white'
//               }`}
//             >
//               Submission
//             </Link>
//             <Link
//               to="/dashboard"
//               className={`text-sm font-medium transition-colors ${
//                 currentPage === 'dashboard'
//                   ? 'text-white border-b-2 border-white pb-1'
//                   : 'text-white/80 hover:text-white'
//               }`}
//             >
//               Dashboard
//             </Link>
//           </nav>

//           <div className="flex items-center gap-3">
//             <ThemeToggle theme={theme} onToggle={toggleTheme} />

//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="md:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
//             >
//               {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>

//         {mobileMenuOpen && (
//           <nav className="md:hidden mt-4 flex flex-col gap-3 pb-2">
//             <Link
//               to="/"
//               className="px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors"
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               Submission
//             </Link>
//             <Link
//               to="/dashboard"
//               className="px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors"
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               Dashboard
//             </Link>
//           </nav>
//         )}
//       </div>
//     </header>
//   );
// };

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { Menu, X } from 'lucide-react';
// import { ThemeToggle } from '../ui/ThemeToggle';
// import { useTheme } from '../../hooks/useTheme';
// import { APP_CONFIG } from '../../config/constants';

// interface StickyHeaderProps {
//   currentPage?: string;
// }

// // Custom Gen Z waveform logo — animated bars inside gradient circle
// const WaveformLogo: React.FC = () => (
//   <div className="relative w-10 h-10 flex items-center justify-center">
//     {/* Outer gradient circle */}
//     <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 opacity-90 shadow-lg shadow-purple-500/40" />

//     {/* Subtle glow ring */}
//     <div className="absolute inset-0 rounded-xl ring-1 ring-white/20" />

//     {/* Waveform bars */}
//     <div className="relative flex items-center gap-[3px]">
//       {[10, 16, 22, 16, 10].map((h, i) => (
//         <div
//           key={i}
//           className="w-[3px] rounded-full bg-white"
//           style={{
//             height: h,
//             opacity: i === 2 ? 1 : 0.75,
//           }}
//         />
//       ))}
//     </div>
//   </div>
// );

// export const StickyHeader: React.FC<StickyHeaderProps> = ({ currentPage = 'submission' }) => {
//   const { theme, toggleTheme } = useTheme();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   return (
//     <header className="sticky top-0 z-40 bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-900 dark:to-purple-900 backdrop-blur-md shadow-lg">
//       <div className="max-w-7xl mx-auto px-6 py-4">
//         <div className="flex items-center justify-between">
//           <Link to="/" className="flex items-center gap-3 group">
//             <WaveformLogo />
//             <div>
//               <h1 className="text-xl font-bold text-white tracking-tight">
//                 {APP_CONFIG.appName}
//               </h1>
//               <p className="text-xs text-white/70 tracking-wide">Audit. Analyse. Act.</p>
//             </div>
//           </Link>

//           <nav className="hidden md:flex items-center gap-8">
//             <Link
//               to="/"
//               className={`text-sm font-medium transition-colors ${
//                 currentPage === 'submission'
//                   ? 'text-white border-b-2 border-white pb-1'
//                   : 'text-white/80 hover:text-white'
//               }`}
//             >
//               Submission
//             </Link>
//             <Link
//               to="/dashboard"
//               className={`text-sm font-medium transition-colors ${
//                 currentPage === 'dashboard'
//                   ? 'text-white border-b-2 border-white pb-1'
//                   : 'text-white/80 hover:text-white'
//               }`}
//             >
//               Dashboard
//             </Link>
//           </nav>

//           <div className="flex items-center gap-3">
//             <ThemeToggle theme={theme} onToggle={toggleTheme} />
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="md:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
//             >
//               {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>

//         {mobileMenuOpen && (
//           <nav className="md:hidden mt-4 flex flex-col gap-3 pb-2">
//             <Link
//               to="/"
//               className="px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors"
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               Submission
//             </Link>
//             <Link
//               to="/dashboard"
//               className="px-4 py-2 text-white hover:bg-white/20 rounded-lg transition-colors"
//               onClick={() => setMobileMenuOpen(false)}
//             >
//               Dashboard
//             </Link>
//           </nav>
//         )}
//       </div>
//     </header>
//   );
// };


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useTheme } from '../../hooks/useTheme';
import { APP_CONFIG } from '../../config/constants';

interface StickyHeaderProps {
  currentPage?: string;
}

const WaveformLogo: React.FC = () => (
  <div className="relative w-9 h-9 flex items-center justify-center">
    {/* Pure emerald square — accent only */}
    <div
      className="absolute inset-0 rounded-lg"
      style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
    />
    <div className="absolute inset-0 rounded-lg ring-1 ring-white/10" />
    {/* Waveform bars */}
    <div className="relative flex items-center gap-[2.5px]">
      {[8, 14, 20, 14, 8].map((h, i) => (
        <div
          key={i}
          className="w-[2.5px] rounded-full bg-white"
          style={{ height: h, opacity: i === 2 ? 1 : 0.8 }}
        />
      ))}
    </div>
  </div>
);

export const StickyHeader: React.FC<StickyHeaderProps> = ({ currentPage = 'submission' }) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: '#09090b',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <WaveformLogo />
            <div>
              <h1
                className="text-base font-semibold tracking-tight"
                style={{ color: '#fafafa' }}
              >
                {APP_CONFIG.appName}
              </h1>
              <p
                className="text-[11px] tracking-wide font-medium"
                style={{ color: '#10b981' }}
              >
                Audit. Analyse. Act.
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="relative px-4 py-2 text-sm font-medium rounded-md transition-all"
              style={{
                color: currentPage === 'submission' ? '#fafafa' : '#71717a',
                background: currentPage === 'submission' ? 'rgba(255,255,255,0.06)' : 'transparent',
              }}
            >
              Submission
              {currentPage === 'submission' && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full"
                  style={{ background: '#10b981' }}
                />
              )}
            </Link>
            <Link
              to="/dashboard"
              className="relative px-4 py-2 text-sm font-medium rounded-md transition-all"
              style={{
                color: currentPage === 'dashboard' ? '#fafafa' : '#71717a',
                background: currentPage === 'dashboard' ? 'rgba(255,255,255,0.06)' : 'transparent',
              }}
            >
              Dashboard
              {currentPage === 'dashboard' && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full"
                  style={{ background: '#10b981' }}
                />
              )}
            </Link>
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{ color: '#a1a1aa' }}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav
            className="md:hidden mt-3 flex flex-col gap-1 pb-3 border-t pt-3"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          >
            <Link
              to="/"
              className="px-3 py-2 text-sm rounded-md transition-colors"
              style={{ color: '#a1a1aa' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Submission
            </Link>
            <Link
              to="/dashboard"
              className="px-3 py-2 text-sm rounded-md transition-colors"
              style={{ color: '#a1a1aa' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};


