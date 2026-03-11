import React, { useState, useEffect } from 'react';
//import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, defs, linearGradient, stop } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { GlassmorphismCard } from '../ui/GlassmorphismCard';
import { SkeletonLoader } from '../ui/SkeletonLoader';
import { EmptyState } from '../ui/EmptyState';
import { auditService } from '../../services/auditService';
import { TrendingUp } from 'lucide-react';

interface TrendData {
  date: string;
  score: number;
}

type TimePeriod = 7 | 30 | 90;

export const ComplianceTrendChart: React.FC = () => {
  const [data, setData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(30);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const trendData = await auditService.getComplianceTrend(timePeriod);
        if (Array.isArray(trendData)) {
          setData(trendData);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Failed to fetch trend data:', error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timePeriod]);

  const timeOptions: Array<{ label: string; value: TimePeriod }> = [
    { label: 'Last 7 Days', value: 7 },
    { label: 'Last 30 Days', value: 30 },
    { label: 'Last 90 Days', value: 90 },
  ];

  return (
    <GlassmorphismCard className="p-6 md:p-8">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h3 className="text-xl font-bold">Compliance Trend</h3>
          <div className="flex gap-2">
            {timeOptions.map((option) => (
              <button
                key={option.value}
                className={`px-3 py-1.5 rounded-lg ${
                  timePeriod === option.value ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
                onClick={() => setTimePeriod(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-80">
          <SkeletonLoader type="card" className="h-full" />
        </div>
      ) : data.length === 0 ? (
        <div className="h-80 flex items-center justify-center">
          <EmptyState
            icon={TrendingUp}
            title="No trend data"
            description="Submit more audits to see compliance trends"
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0, 0, 0, 0.1)"
              />
              <XAxis
                dataKey="date"
                stroke="rgba(0, 0, 0, 0.4)"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="rgba(0, 0, 0, 0.4)"
                domain={[0, 100]}
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: any) => `${value}%`}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
                fillOpacity={1}
                fill="url(#colorScore)"
                isAnimationActive={true}
                animationDuration={500}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </GlassmorphismCard>
  );
};
