// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { BarChart3, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
// import { GlassmorphismCard } from '../ui/GlassmorphismCard';
// import { auditService } from '../../services/auditService';

// interface Stats {
//   total: number;
//   passed: number;
//   failed: number;
//   flagged: number;
//   averageScore: number;
// }

// export const KPICards: React.FC = () => {
//   const [stats, setStats] = useState<Stats>({
//     total: 0,
//     passed: 0,
//     failed: 0,
//     flagged: 0,
//     averageScore: 0,
//   });
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const data = await auditService.getAuditStats();
//         setStats(data);
//       } catch (error) {
//         console.error('Failed to fetch stats:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchStats();
//   }, []);

//   const cards = [
//     {
//       title: 'Total Audits',
//       value: stats.total,
//       icon: BarChart3,
//       color: 'from-blue-500 to-cyan-500',
//       bgColor: 'bg-blue-50 dark:bg-blue-900/20',
//     },
//     {
//       title: 'Average Compliance Score',
//       value: `${stats.averageScore}%`,
//       icon: TrendingUp,
//       color: stats.averageScore >= 85 ? 'from-green-500 to-emerald-500' : 'from-yellow-500 to-orange-500',
//       bgColor: 'bg-green-50 dark:bg-green-900/20',
//     },
//     {
//       title: 'Pass Rate',
//       value: stats.total > 0 ? `${Math.round((stats.passed / stats.total) * 100)}%` : '0%',
//       icon: CheckCircle,
//       color: 'from-green-500 to-emerald-500',
//       bgColor: 'bg-green-50 dark:bg-green-900/20',
//     },
//     {
//       title: 'Flagged Calls',
//       value: stats.flagged,
//       icon: AlertCircle,
//       color: 'from-red-500 to-pink-500',
//       bgColor: 'bg-red-50 dark:bg-red-900/20',
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//       {cards.map((card, index) => {
//         const Icon = card.icon;
//         return (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: index * 0.1 }}
//             whileHover={{ y: -5 }}
//           >
//             <GlassmorphismCard className={`p-6 ${card.bgColor}`}>
//               <div className="flex items-start justify-between mb-4">
//                 <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} text-white`}>
//                   <Icon className="w-6 h-6" />
//                 </div>
//               </div>

//               <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{card.title}</p>

//               {isLoading ? (
//                 <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
//               ) : (
//                 <motion.p
//                   className="text-3xl font-bold text-gray-900 dark:text-white"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
//                 >
//                   {typeof card.value === 'number' ? (
//                     <CountUpNumber target={card.value} />
//                   ) : (
//                     card.value
//                   )}
//                 </motion.p>
//               )}
//             </GlassmorphismCard>
//           </motion.div>
//         );
//       })}
//     </div>
//   );
// };

// interface CountUpNumberProps {
//   target: number;
// }

// const CountUpNumber: React.FC<CountUpNumberProps> = ({ target }) => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     const duration = 1500;
//     const steps = 60;
//     const increment = target / steps;
//     let current = 0;

//     const timer = setInterval(() => {
//       current += increment;
//       if (current >= target) {
//         setCount(target);
//         clearInterval(timer);
//       } else {
//         setCount(Math.floor(current));
//       }
//     }, duration / steps);

//     return () => clearInterval(timer);
//   }, [target]);

//   return <>{count}</>;
// };



import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { GlassmorphismCard } from '../ui/GlassmorphismCard';
import { auditService } from '../../services/auditService';

interface Stats {
  total: number;
  passed: number;
  failed: number;
  flagged: number;
  averageScore: number;
}

export const KPICards: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    passed: 0,
    failed: 0,
    flagged: 0,
    averageScore: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await auditService.getAuditStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Total Audits',
      value: stats.total,
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Average Compliance Score',
      value: `${stats.averageScore}%`,
      icon: TrendingUp,
      color: stats.averageScore >= 85 ? 'from-green-500 to-emerald-500' : 'from-yellow-500 to-orange-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Pass Rate',
      value: stats.total > 0 ? `${Math.round((stats.passed / stats.total) * 100)}%` : '0%',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Flagged Calls',
      value: stats.flagged,
      icon: AlertCircle,
      color: 'from-yellow-500 to-orange-500',
      //bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      bgColor: 'bg-orange-50 dark:bg-orange-900/10',
    },
    {
      title: 'Failed Calls',
      value: stats.failed,
      icon: XCircle,
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <GlassmorphismCard className={`p-6 ${card.bgColor}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color} text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>

              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{card.title}</p>

              {isLoading ? (
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              ) : (
                <motion.p
                  className="text-3xl font-bold text-gray-900 dark:text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  {typeof card.value === 'number' ? (
                    <CountUpNumber target={card.value} />
                  ) : (
                    card.value
                  )}
                </motion.p>
              )}
            </GlassmorphismCard>
          </motion.div>
        );
      })}
    </div>
  );
};

interface CountUpNumberProps {
  target: number;
}

const CountUpNumber: React.FC<CountUpNumberProps> = ({ target }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return <>{count}</>;
};
