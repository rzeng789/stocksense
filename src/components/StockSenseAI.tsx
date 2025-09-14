'use client';

import React, { useState } from 'react';
import FinancialIntelligence from './FinancialIntelligence';
import IndividualStockAnalysis from './IndividualStockAnalysis';

type TabType = 'financial-intelligence' | 'individual-analysis';

const StockSenseAI: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('financial-intelligence');

  const tabs = [
    {
      id: 'financial-intelligence' as TabType,
      label: 'AI News Analysis',
      description: 'AI-powered news analysis and market insights'
    },
    {
      id: 'individual-analysis' as TabType,
      label: 'Individual Stock Analysis',
      description: 'Advanced stock analysis with correlation insights'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🧠 StockSense AI
          </h1>
          <p className="text-lg text-gray-600">
            Advanced AI-powered financial analysis and market intelligence
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">{tab.label}</span>
                    <span className="text-xs mt-1 opacity-75">{tab.description}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg">
          {activeTab === 'financial-intelligence' && (
            <div className="p-6">
              <FinancialIntelligence />
            </div>
          )}
          
          {activeTab === 'individual-analysis' && (
            <div className="p-6">
              <IndividualStockAnalysis />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockSenseAI;