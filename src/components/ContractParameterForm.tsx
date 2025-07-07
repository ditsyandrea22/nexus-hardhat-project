import React, { useState } from 'react';
import { ContractTemplate, ContractParameter } from '../types/contracts';
import { Settings, AlertCircle } from 'lucide-react';

interface ContractParameterFormProps {
  template: ContractTemplate;
  onParametersChange: (parameters: Record<string, string>) => void;
  parameters: Record<string, string>;
}

export const ContractParameterForm: React.FC<ContractParameterFormProps> = ({
  template,
  onParametersChange,
  parameters
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleParameterChange = (paramName: string, value: string) => {
    const newParameters = { ...parameters, [paramName]: value };
    onParametersChange(newParameters);

    // Clear error when user starts typing
    if (errors[paramName]) {
      setErrors(prev => ({ ...prev, [paramName]: '' }));
    }
  };

  const validateParameter = (param: ContractParameter, value: string): string => {
    if (param.required && !value.trim()) {
      return `${param.name} is required`;
    }

    // Type-specific validation
    if (value.trim()) {
      switch (param.type) {
        case 'uint256':
        case 'uint8':
          if (!/^\d+$/.test(value)) {
            return `${param.name} must be a positive number`;
          }
          break;
        case 'string':
          if (value.length > 50) {
            return `${param.name} must be less than 50 characters`;
          }
          break;
      }
    }

    return '';
  };

  const handleBlur = (param: ContractParameter, value: string) => {
    const error = validateParameter(param, value);
    setErrors(prev => ({ ...prev, [param.name]: error }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl text-white">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Contract Parameters</h3>
          <p className="text-sm text-gray-500">Configure your {template.name}</p>
        </div>
      </div>

      <div className="space-y-4">
        {template.parameters.map((param) => (
          <div key={param.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {param.name}
              {param.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={param.type.includes('uint') ? 'number' : 'text'}
              value={parameters[param.name] || param.defaultValue || ''}
              onChange={(e) => handleParameterChange(param.name, e.target.value)}
              onBlur={(e) => handleBlur(param, e.target.value)}
              placeholder={param.description}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors[param.name] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors[param.name] && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errors[param.name]}</span>
              </div>
            )}
            <p className="text-xs text-gray-500">{param.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};