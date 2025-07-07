import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Code2, ArrowLeft } from 'lucide-react';
import { ContractTemplate } from '../types/contracts';
import { CONTRACT_TEMPLATES } from '../data/contractTemplates';
import { ContractTemplateCard } from './ContractTemplateCard';
import { ContractParameterForm } from './ContractParameterForm';
import { ContractDeployment } from './ContractDeployment';

interface SmartContractDeployerProps {
  signer: ethers.Signer | null;
  isConnected: boolean;
}

type DeploymentStep = 'select' | 'configure' | 'deploy';

export const SmartContractDeployer: React.FC<SmartContractDeployerProps> = ({
  signer,
  isConnected
}) => {
  const [currentStep, setCurrentStep] = useState<DeploymentStep>('select');
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [parameters, setParameters] = useState<Record<string, string>>({});

  const handleTemplateSelect = (template: ContractTemplate) => {
    setSelectedTemplate(template);
    // Initialize parameters with default values
    const defaultParams: Record<string, string> = {};
    template.parameters.forEach(param => {
      if (param.defaultValue) {
        defaultParams[param.name] = param.defaultValue;
      }
    });
    setParameters(defaultParams);
  };

  const handleNext = () => {
    if (currentStep === 'select' && selectedTemplate) {
      setCurrentStep('configure');
    } else if (currentStep === 'configure') {
      setCurrentStep('deploy');
    }
  };

  const handleBack = () => {
    if (currentStep === 'configure') {
      setCurrentStep('select');
    } else if (currentStep === 'deploy') {
      setCurrentStep('configure');
    }
  };

  const resetToStart = () => {
    setCurrentStep('select');
    setSelectedTemplate(null);
    setParameters({});
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-xl text-white inline-block mb-4">
          <Code2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Connect Your Wallet</h3>
        <p className="text-gray-600">
          Please connect your wallet to deploy smart contracts on Nexus testnet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl text-white">
              <Code2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Smart Contract Deployer</h2>
              <p className="text-gray-600">Deploy contracts to Nexus testnet with ease</p>
            </div>
          </div>
          
          {currentStep !== 'select' && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mt-6">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep === 'select' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${
              ['configure', 'deploy'].includes(currentStep) ? 'bg-blue-500' : 'bg-gray-200'
            }`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep === 'configure' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${
              currentStep === 'deploy' ? 'bg-blue-500' : 'bg-gray-200'
            }`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep === 'deploy' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 'select' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {CONTRACT_TEMPLATES.map((template) => (
              <ContractTemplateCard
                key={template.id}
                template={template}
                onSelect={handleTemplateSelect}
                isSelected={selectedTemplate?.id === template.id}
              />
            ))}
          </div>
          
          {selectedTemplate && (
            <div className="flex justify-center">
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
              >
                Configure Parameters
              </button>
            </div>
          )}
        </div>
      )}

      {currentStep === 'configure' && selectedTemplate && (
        <div>
          <ContractParameterForm
            template={selectedTemplate}
            parameters={parameters}
            onParametersChange={setParameters}
          />
          
          <div className="flex justify-center mt-6">
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors"
            >
              Review & Deploy
            </button>
          </div>
        </div>
      )}

      {currentStep === 'deploy' && selectedTemplate && (
        <ContractDeployment
          template={selectedTemplate}
          parameters={parameters}
          signer={signer}
          onBack={resetToStart}
        />
      )}
    </div>
  );
};