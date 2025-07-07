import React from 'react';
import { Code, FileText, Coins, Image, Database } from 'lucide-react';
import { ContractTemplate } from '../types/contracts';

interface ContractTemplateCardProps {
  template: ContractTemplate;
  onSelect: (template: ContractTemplate) => void;
  isSelected: boolean;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'storage':
      return <Database className="w-6 h-6" />;
    case 'token':
      return <Coins className="w-6 h-6" />;
    case 'nft':
      return <Image className="w-6 h-6" />;
    default:
      return <Code className="w-6 h-6" />;
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'storage':
      return 'from-blue-500 to-cyan-500';
    case 'token':
      return 'from-green-500 to-emerald-500';
    case 'nft':
      return 'from-purple-500 to-pink-500';
    default:
      return 'from-gray-500 to-slate-500';
  }
};

export const ContractTemplateCard: React.FC<ContractTemplateCardProps> = ({
  template,
  onSelect,
  isSelected
}) => {
  return (
    <div
      onClick={() => onSelect(template)}
      className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border-2 ${
        isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-transparent'
      }`}
    >
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className={`bg-gradient-to-r ${getCategoryColor(template.category)} p-3 rounded-xl text-white`}>
            {getCategoryIcon(template.category)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{template.category}</p>
          </div>
        </div>

        <p className="text-gray-600 mb-4">{template.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileText className="w-4 h-4" />
            <span>{template.parameters.length} parameters</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isSelected 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {isSelected ? 'Selected' : 'Select'}
          </div>
        </div>
      </div>
    </div>
  );
};