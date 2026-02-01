import { useState } from 'react';
import { DiravColors } from '../../core/theme/colors';
import { OpportunitiesScreen } from '../opportunities/OpportunitiesScreen';
import { BlogsScreen } from '../blogs/BlogsScreen';

type TabType = 'opportunities' | 'blogs';

const DiscoverScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('opportunities');

  const tabs = [
    { id: 'opportunities' as TabType, label: 'Opportunities', icon: '🎯', count: 12 },
    { id: 'blogs' as TabType, label: 'Blogs', icon: '📚', count: 8 },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-100">
        <div className="px-4 pt-4 pb-2">
          <h1 className="text-xl font-bold text-gray-900">Discover</h1>
          <p className="text-sm text-gray-500">Explore opportunities & learn</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex px-4 pb-3 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={{
                background: activeTab === tab.id 
                  ? `linear-gradient(135deg, ${DiravColors.primary}, ${DiravColors.accentGradientEnd})`
                  : undefined,
              }}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
              <span 
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {activeTab === 'opportunities' ? (
            <OpportunitiesScreen embedded />
          ) : (
            <BlogsScreen embedded />
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoverScreen;
