import React, { useState } from 'react';
import { Code, ChevronDown, ChevronUp, Sparkles, FileText } from 'lucide-react';
import { ContractTemplate } from '../types';
import { CONTRACT_TEMPLATES } from '../contracts/templates';

interface ContractSelectorProps {
  selectedTemplate: ContractTemplate | null;
  onTemplateSelect: (template: ContractTemplate) => void;
}

const ContractSelector: React.FC<ContractSelectorProps> = ({
  selectedTemplate,
  onTemplateSelect
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20 dark:border-gray-700/30 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 p-3 rounded-xl shadow-lg transition-colors duration-300">
          <Code className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-300">Smart Contract Templates</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Choose from our curated collection</p>
        </div>
      </div>

      <div className="space-y-4">
        {CONTRACT_TEMPLATES.map((template, index) => (
          <div
            key={index}
            className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
              selectedTemplate === template
                ? 'border-purple-500 dark:border-purple-400 bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/30 dark:to-pink-900/30 shadow-lg'
                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80'
            } backdrop-blur-sm`}
            onClick={() => onTemplateSelect(template)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-bold text-gray-800 dark:text-white text-lg transition-colors duration-300">{template.name}</h4>
                  {selectedTemplate === template && (
                    <div className="flex items-center space-x-1 bg-purple-100 dark:bg-purple-900/50 backdrop-blur-sm px-2 py-1 rounded-full border border-purple-200 dark:border-purple-700">
                      <Sparkles className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Selected</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed transition-colors duration-300">{template.description}</p>
                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  <div className="flex items-center space-x-1">
                    <FileText className="h-3 w-3" />
                    <span>Solidity</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>•</span>
                    <span>{template.constructorParams.length} parameters</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {selectedTemplate === template && (
                  <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 rounded-full animate-pulse shadow-lg"></div>
                )}
                <div className="text-gray-400 dark:text-gray-500 transition-colors duration-300">
                  →
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-800 dark:text-white flex items-center space-x-2 transition-colors duration-300">
              <Code className="h-4 w-4" />
              <span>Contract Source Code</span>
            </h4>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 backdrop-blur-sm"
            >
              <span className="text-sm font-medium">
                {isExpanded ? 'Hide' : 'Show'} Code
              </span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
          </div>
          
          {isExpanded && (
            <div className="bg-gray-900 dark:bg-black/80 backdrop-blur-md rounded-xl p-6 overflow-x-auto shadow-inner animate-slide-down border border-gray-700/50">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-400 text-sm ml-2">{selectedTemplate.name}.sol</span>
              </div>
              <pre className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-mono">
                {selectedTemplate.code}
              </pre>
            </div>
          )}
          
          {!isExpanded && (
            <div className="bg-gradient-to-r from-gray-50/80 to-purple-50/80 dark:from-gray-800/50 dark:to-purple-900/30 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30 dark:border-gray-700/30">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center transition-colors duration-300">
                Click "Show Code" to view the complete smart contract source code
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContractSelector;