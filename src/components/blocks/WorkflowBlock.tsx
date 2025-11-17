import React from 'react';

interface WorkflowStep {
  stepNumber: number;
  title: string;
  description: string;
  icon?: string;
}

interface WorkflowBlockProps {
  data: {
    title?: string;
    subtitle?: string;
    intro?: string;
    steps?: WorkflowStep[];
  };
}

// Icon SVG components cho từng bước
const StepIcons: { [key: number]: React.ReactNode } = {
  1: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  2: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  ),
  3: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  4: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  5: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  6: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  ),
};

export const WorkflowBlock: React.FC<WorkflowBlockProps> = ({ data }) => {
  if (!data.steps || data.steps.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Subtle geometric background */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-16 relative z-10">
        {/* Header - Modern Typography */}
        <div className="text-center mb-20">
          {data.subtitle && (
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4">
              {data.subtitle}
            </p>
          )}
          {data.title && (
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {data.title}
            </h2>
          )}
        </div>
        
        {/* Workflow Steps - Modern Design with Large Numbers */}
        <div className="relative">
          {/* Connection Line - Desktop Only */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6">
            {data.steps.slice(0, 4).map((step, index) => (
              <div key={index} className="relative group">
                {/* Step Card */}
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
                  {/* Large Step Number */}
                  <div className="absolute -top-8 left-8">
                    <div className="relative">
                      <div className="text-8xl md:text-9xl font-black text-gray-100 dark:text-gray-800 leading-none">
                        {String(step.stepNumber || index + 1).padStart(2, '0')}
                      </div>
                      <div className="absolute inset-0 text-8xl md:text-9xl font-black bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent leading-none opacity-80">
                        {String(step.stepNumber || index + 1).padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="mt-20">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                      {step.title}
                    </h3>
                    <div 
                      className="text-gray-600 dark:text-gray-300 leading-relaxed text-base"
                      dangerouslySetInnerHTML={{ __html: step.description }}
                    />
                  </div>
                  
                  {/* Decorative Element */}
                  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl"></div>
                  
                  {/* Connection Dot - Desktop Only */}
                  <div className="hidden lg:block absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-4 h-4 rounded-full bg-white dark:bg-gray-800 border-4 border-blue-600 group-hover:scale-125 transition-transform duration-300"></div>
                  </div>
                </div>
                
                {/* Arrow Connector - Desktop Only */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-24 -right-4 z-10">
                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-400 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowBlock;
