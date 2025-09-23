import React from 'react';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue }) => {
  return (
    <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-purple-200 text-sm">{title}</p>
          <p className="text-white text-2xl font-bold">{value}</p>
        </div>
        <Icon className="text-purple-400 w-8 h-8" />
      </div>
      {trend && (
        <div className="flex items-center mt-2">
          {trend}
          {trendValue && (
            <span className="text-sm ml-1">{trendValue}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsCard;