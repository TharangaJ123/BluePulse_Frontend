import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { 
  AlertTriangle, 
  ShoppingCart, 
  RotateCcw, 
  Check, 
  ArrowLeft, 
  HelpCircle, 
  Droplet,
  Bookmark,
  Download
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ModernFooter from './Footer';
import NavigationBar from './NavigationBar';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define water types with descriptive information
const WATER_TYPES = {
  potable: {
    title: "Drinking Water",
    description: "Water safe for human consumption",
    icon: "🚰",
    color: "blue"
  },
  nonpotable: {
    title: "Non-Potable Water",
    description: "Water not intended for drinking but suitable for other uses",
    icon: "💧",
    color: "cyan"
  },
  agricultural: {
    title: "Agricultural Water",
    description: "Water used for irrigation and farming purposes",
    icon: "🌱",
    color: "green"
  },
  industrial: {
    title: "Industrial Water",
    description: "Water used in manufacturing and industrial processes",
    icon: "🏭",
    color: "purple"
  }
};

// Define parameter info with helpful explanations
const PARAMETER_INFO = {
  'pH Level': {
    description: "Measures acidity or alkalinity (1-14). Neutral is 7.",
    icon: "⚗️",
    importance: "Critical for most biological processes and chemical reactions.",
    color: "blue"
  },
  'Turbidity (NTU)': {
    description: "Measures water cloudiness due to suspended particles.",
    icon: "🌫️",
    importance: "Affects water treatment processes and can harbor microorganisms.",
    color: "amber"
  },
  'Chlorine (mg/L)': {
    description: "Disinfectant used in water treatment.",
    icon: "🧪",
    importance: "Kills harmful bacteria and viruses in water.",
    color: "lime"
  },
  'Dissolved Oxygen (DO) (mg/L)': {
    description: "Amount of oxygen dissolved in water.",
    icon: "🧫",
    importance: "Essential for aquatic life and indicates water quality.",
    color: "sky"
  },
  'Ammonia (mg/L)': {
    description: "Nitrogen compound that can be toxic at high levels.",
    icon: "🔬",
    importance: "Indicates possible sewage contamination or agricultural runoff.",
    color: "yellow"
  },
  'Electrical Conductivity (EC) (dS/m)': {
    description: "Measures water's ability to conduct electrical current.",
    icon: "⚡",
    importance: "Indicates level of dissolved salts and minerals.",
    color: "orange"
  },
  'Nitrate (NO3) (mg/L)': {
    description: "Form of nitrogen found in fertilizers and waste.",
    icon: "🌿",
    importance: "Can cause algal blooms and be harmful at high concentrations.",
    color: "emerald"
  },
  'Heavy Metals (mg/L)': {
    description: "Concentrations of metals like lead, mercury, etc.",
    icon: "⚠️",
    importance: "Can cause serious health issues even at low concentrations.",
    color: "red"
  }
};

// Define absolute minimum and maximum ranges for each parameter
const ABSOLUTE_RANGES = {
  'pH Level': { min: 1, max: 14 },
  'Turbidity (NTU)': { min: 0, max: 100 },
  'Chlorine (mg/L)': { min: 0, max: 10 },
  'Dissolved Oxygen (DO) (mg/L)': { min: 0, max: 20 },
  'Ammonia (mg/L)': { min: 0, max: 50 },
  'Electrical Conductivity (EC) (dS/m)': { min: 0, max: 10 },
  'Nitrate (NO3) (mg/L)': { min: 0, max: 100 },
  'Heavy Metals (mg/L)': { min: 0, max: 10 },
};

// Define the parameters for each water type
const WATER_QUALITY_PARAMS = {
  potable: [
    { name: 'pH Level', range: '6.5-8.5' },
    { name: 'Turbidity (NTU)', range: '0-1' },
    { name: 'Chlorine (mg/L)', range: '0.2-1.0' },
    { name: 'Dissolved Oxygen (DO) (mg/L)', range: '6-8' },
  ],
  nonpotable: [
    { name: 'pH Level', range: '6.0-9.0' },
    { name: 'Turbidity (NTU)', range: '1-5' },
    { name: 'Ammonia (mg/L)', range: '0-1' },
    { name: 'Dissolved Oxygen (DO) (mg/L)', range: '4-6' },
  ],
  agricultural: [
    { name: 'pH Level', range: '6.0-8.5' },
    { name: 'Electrical Conductivity (EC) (dS/m)', range: '0.2-2.0' },
    { name: 'Nitrate (NO3) (mg/L)', range: '10-50' },
    { name: 'Dissolved Oxygen (DO) (mg/L)', range: '5-7' },
  ],
  industrial: [
    { name: 'pH Level', range: '6.0-9.0' },
    { name: 'Turbidity (NTU)', range: '1-5' },
    { name: 'Heavy Metals (mg/L)', range: '0-0.5' },
    { name: 'Dissolved Oxygen (DO) (mg/L)', range: '3-5' },
  ],
};

const WaterQuality = () => {
  const { waterType } = useParams();
  const navigate = useNavigate();
  const reportRef = useRef();

  const [parameters, setParameters] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [results, setResults] = useState({});
  const [errors, setErrors] = useState({});
  const [showHelp, setShowHelp] = useState(false);
  const [showBuyKit, setShowBuyKit] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [showParameterInfo, setShowParameterInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [overallStatus, setOverallStatus] = useState(null);

  // Set water parameters based on water type
  useEffect(() => {
    if (WATER_QUALITY_PARAMS[waterType]) {
      setParameters(WATER_QUALITY_PARAMS[waterType]);
      setInputValues(
        WATER_QUALITY_PARAMS[waterType].reduce((acc, param) => ({
          ...acc,
          [param.name]: '',
        }), {})
      );
    } else {
      setParameters([]);
    }
  }, [waterType]);

  // Format label with an optional tooltip icon
  const FormattedLabel = ({ paramName, range }) => (
    <div className="flex items-center space-x-2 mb-1">
      <span className="font-medium text-gray-700">{paramName}</span>
      <button 
        onClick={(e) => {
          e.preventDefault();
          setShowParameterInfo(paramName === showParameterInfo ? null : paramName);
        }}
        className="text-gray-400 hover:text-gray-600 focus:outline-none"
        aria-label={`More info about ${paramName}`}
      >
        <HelpCircle size={16} />
      </button>
      <span className="text-sm text-gray-500 ml-auto">Range: {range}</span>
    </div>
  );

  // Handle input changes
  const handleInputChange = (e, paramName) => {
    const value = e.target.value;
    setInputValues((prev) => ({ ...prev, [paramName]: value }));

    const parsedValue = parseFloat(value);
    if (value === '') {
      setErrors((prev) => ({ ...prev, [paramName]: '' }));
      setResults((prev) => {
        const newResults = { ...prev };
        delete newResults[paramName];
        return newResults;
      });
      return;
    }

    if (isNaN(parsedValue)) {
      setErrors((prev) => ({
        ...prev,
        [paramName]: 'Please enter a valid number',
      }));
      return;
    }

    const param = parameters.find((p) => p.name === paramName);
    const absoluteRange = ABSOLUTE_RANGES[param.name];

    if (!absoluteRange) {
      setErrors((prev) => ({
        ...prev,
        [paramName]: `No absolute range defined for ${param.name}`,
      }));
      return;
    }

    if (parsedValue < absoluteRange.min || parsedValue > absoluteRange.max) {
      setErrors((prev) => ({
        ...prev,
        [paramName]: `${param.name} must be between ${absoluteRange.min} and ${absoluteRange.max}`,
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, [paramName]: '' }));

    const { deviation, status } = calculateDeviation(parsedValue, param.range);
    const safenessPercentage = calculateSafenessPercentage(parsedValue, param.range);

    setResults((prevResults) => ({
      ...prevResults,
      [paramName]: {
        value: parsedValue,
        status,
        deviation,
        safenessPercentage,
      },
    }));
  };

  // Calculate deviation
  const calculateDeviation = (value, range) => {
    const [min, max] = range.split('-').map(Number);
    if (value >= min && value <= max) {
      return { deviation: 0, status: 'safe' };
    } else if (value < min) {
      return { deviation: min - value, status: 'unsafe' };
    } else {
      return { deviation: value - max, status: 'unsafe' };
    }
  };

  // Calculate safeness percentage
  const calculateSafenessPercentage = (value, range) => {
    const [min, max] = range.split('-').map(Number);
    if (value >= min && value <= max) {
      return 100;
    } else if (value < min) {
      return Math.max(0, (1 - (min - value) / min) * 100);
    } else {
      return Math.max(0, (1 - (value - max) / max) * 100);
    }
  };

  // Check water quality
  const checkQuality = () => {
    // Check if all parameters have values
    const missingInputs = parameters.filter(param => 
      inputValues[param.name] === '' || errors[param.name]
    );
    
    if (missingInputs.length > 0) {
      // Highlight missing fields with errors
      const newErrors = { ...errors };
      missingInputs.forEach(param => {
        if (inputValues[param.name] === '') {
          newErrors[param.name] = 'This field is required';
        }
      });
      setErrors(newErrors);
      return;
    }

    // Simulate processing
    setIsSubmitting(true);
    
    setTimeout(() => {
      let unsafeCount = 0;
      parameters.forEach((param) => {
        if (results[param.name]?.status === 'unsafe') {
          unsafeCount++;
        }
      });

      // Calculate overall water quality status
      if (unsafeCount === 0) {
        setOverallStatus('excellent');
      } else if (unsafeCount === 1) {
        setOverallStatus('good');
      } else if (unsafeCount === 2) {
        setOverallStatus('fair');
      } else {
        setOverallStatus('poor');
      }

      setShowHelp(unsafeCount > 0);
      setShowBuyKit(unsafeCount > 0);
      setShowChart(true);
      setShowProgressBar(true);
      setIsSubmitting(false);
    }, 1500); // Simulate processing time
  };

  // Reset all values
  const resetValues = () => {
    setInputValues(
      parameters.reduce((acc, param) => ({
        ...acc,
        [param.name]: '',
      }), {})
    );
    setResults({});
    setErrors({});
    setShowHelp(false);
    setShowBuyKit(false);
    setShowChart(false);
    setShowProgressBar(false);
    setOverallStatus(null);
    setShowParameterInfo(null);
  };

  // Calculate safeness and unsafeness percentages
  const qualityStats = useMemo(() => {
    if (parameters.length === 0) {
      return { 
        safePercentage: 0, 
        unsafePercentage: 0,
        safeParams: [],
        unsafeParams: [],
        completedCount: 0
      };
    }

    const safeParams = parameters.filter(param => 
      results[param.name]?.status === 'safe'
    );
    
    const unsafeParams = parameters.filter(param => 
      results[param.name]?.status === 'unsafe'
    );
    
    const completedCount = Object.keys(results).length;
    const safePercentage = (safeParams.length / parameters.length) * 100;
    const unsafePercentage = (unsafeParams.length / parameters.length) * 100;

    return { 
      safePercentage, 
      unsafePercentage, 
      safeParams, 
      unsafeParams,
      completedCount
    };
  }, [parameters, results]);

  // Chart data with better colors
  const chartData = useMemo(() => ({
    labels: ['Safe', 'Unsafe'],
    datasets: [
      {
        label: 'Water Quality Safeness',
        data: [qualityStats.safePercentage, qualityStats.unsafePercentage],
        backgroundColor: ['#10b981', '#ef4444'],
        borderColor: ['#059669', '#dc2626'],
        borderWidth: 1,
        hoverOffset: 4
      },
    ],
  }), [qualityStats]);

  // Chart options
  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw.toFixed(1)}%`;
          }
        }
      }
    },
    cutout: '70%',
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  // Get water type info
  const waterTypeInfo = WATER_TYPES[waterType] || {
    title: "Unknown Water Type",
    description: "Please select a valid water type",
    icon: "❓",
    color: "gray"
  };

  // Get color class based on status
  const getStatusColorClass = (status) => {
    switch(status) {
      case 'excellent': return 'bg-emerald-500';
      case 'good': return 'bg-green-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Get text for overall status
  const getStatusText = (status) => {
    switch(status) {
      case 'excellent': return 'Excellent - All parameters within safe range';
      case 'good': return 'Good - Most parameters within safe range';
      case 'fair': return 'Fair - Some parameters outside safe range';
      case 'poor': return 'Poor - Multiple parameters outside safe range';
      default: return 'Unknown';
    }
  };

  // Generate PDF report
  const generatePDF = () => {
    const input = reportRef.current;
    const doc = new jsPDF('p', 'mm', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };

    html2canvas(input, options).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      doc.save('water-quality-report.pdf');
    });
  };

  return (
    <div>
      <NavigationBar/>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      {/* Main container */}
      <div className="max-w-6xl mx-auto rounded-xl shadow-xl bg-white overflow-hidden" ref={reportRef}>
        {/* Header */}
        <div className={`bg-${waterTypeInfo.color}-600 text-white p-6`}>
          <div className="flex justify-end">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-white hover:text-white/80 transition-colors"
            >
              <Bookmark size={20} className="mr-2" />
              <span>Save Results</span>
            </button>
          </div>
          
          <div className="mt-6 text-center">
            <div className="inline-block text-6xl mb-2">{waterTypeInfo.icon}</div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              {waterTypeInfo.title} Quality Test
            </h1>
            <p className="text-lg text-white/90">{waterTypeInfo.description}</p>
          </div>
        </div>

        {/* Invalid water type message */}
        {parameters.length === 0 && (
          <div className="p-8">
            <div className="p-6 bg-red-50 border-l-4 border-red-500 text-red-900 rounded-lg mb-6">
              <p className="text-lg font-semibold">Invalid water type selected.</p>
              <p className="text-sm text-red-700 mt-1">Please select a valid water type (e.g., potable, nonpotable, agricultural, industrial).</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        {/* Main content */}
        {parameters.length > 0 && (
          <div className="p-8">
            {/* Status display */}
            {overallStatus && (
              <div className={`mb-8 p-6 rounded-lg ${getStatusColorClass(overallStatus)} bg-opacity-10 border-l-4 ${getStatusColorClass(overallStatus)}`}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${getStatusColorClass(overallStatus)}`}>
                    {overallStatus === 'excellent' || overallStatus === 'good' ? (
                      <Check className="text-white" size={24} />
                    ) : (
                      <AlertTriangle className="text-white" size={24} />
                    )}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold">{getStatusText(overallStatus)}</h2>
                    <p className="text-sm mt-1">
                      {qualityStats.safeParams.length} of {parameters.length} parameters within safe range.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action notifications */}
            {(showHelp || showBuyKit) && (
              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {showHelp && (
                  <div className="p-6 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg shadow-md border border-amber-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-amber-500 text-white rounded-full">
                        <AlertTriangle size={20} />
                      </div>
                      <div className="ml-4">
                        <p className="text-lg font-semibold">Water quality issues detected</p>
                        <p className="text-sm text-amber-700 mt-1">Get expert help to resolve your water quality problems.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/serviceRequest')}
                      className="mt-4 w-full bg-gradient-to-r from-amber-400 to-amber-500 text-white py-2.5 px-6 rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Request Consultation</span>
                    </button>
                  </div>
                )}
                
                {showBuyKit && (
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-md border border-blue-200">
                    <div className="flex items-center">
                      <div className="p-3 bg-blue-500 text-white rounded-full">
                        <ShoppingCart size={20} />
                      </div>
                      <div className="ml-4">
                        <p className="text-lg font-semibold">Get a professional testing kit</p>
                        <p className="text-sm text-blue-700 mt-1">For more accurate and comprehensive testing.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/buy-kit')}
                      className="mt-4 w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white py-2.5 px-6 rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all flex items-center justify-center gap-2"
                    >
                      <span>Shop Testing Kits</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Input section */}
              <div className="lg:col-span-3 space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Droplet className="mr-2 text-blue-500" size={20} />
                    Enter Your Water Test Values
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {parameters.map((param) => (
                      <div key={param.name} className="relative">
                        <FormattedLabel paramName={param.name} range={param.range} />
                        
                        {showParameterInfo === param.name && (
                          <div className="absolute z-10 bg-white p-4 rounded-lg shadow-lg border border-gray-200 mb-4 mt-1 w-full">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-lg mr-2">{PARAMETER_INFO[param.name].icon}</span>
                              <h4 className="font-semibold">{param.name}</h4>
                              <button 
                                onClick={() => setShowParameterInfo(null)}
                                className="text-gray-400 hover:text-gray-600"
                                aria-label="Close info"
                              >
                                ×
                              </button>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{PARAMETER_INFO[param.name].description}</p>
                            <p className="text-sm font-medium text-gray-700">
                              <span className="font-semibold">Why it matters:</span> {PARAMETER_INFO[param.name].importance}
                            </p>
                          </div>
                        )}
                        
                        <div className="relative">
                          <input
                            id={`input-${param.name}`}
                            type="number"
                            step="0.01"
                            value={inputValues[param.name] || ''}
                            onChange={(e) => handleInputChange(e, param.name)}
                            className={`block w-full px-4 py-3 rounded-lg border ${
                              errors[param.name] 
                                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            } shadow-sm transition-colors`}
                            placeholder={`Enter ${param.name}`}
                            aria-describedby={`error-${param.name}`}
                          />
                        </div>
                        
                        {errors[param.name] && (
                          <p
                            id={`error-${param.name}`}
                            className="mt-1.5 text-sm text-red-600 flex items-center"
                          >
                            <AlertTriangle size={14} className="mr-1" />
                            {errors[param.name]}
                          </p>
                        )}
                        
                        {showProgressBar && results[param.name] && (
                          <div className="mt-3">
                            <div className="relative h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`absolute h-full ${results[param.name].status === 'safe' ? 'bg-green-500' : 'bg-red-500'} transition-all duration-500 ease-out`}
                                style={{ width: `${results[param.name].status === 'safe' ? 100 : results[param.name].safenessPercentage}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-1 text-xs text-gray-500">
                              <span>
                                Status: 
                                <span className={results[param.name].status === 'safe' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                  {' '}{results[param.name].status === 'safe' ? 'Safe' : 'Outside safe range'}
                                </span>
                              </span>
                              <span>
                                {results[param.name].safenessPercentage.toFixed(0)}% within limits
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={checkQuality}
                      disabled={isSubmitting}
                      className={`flex-1 ${
                        isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                      } text-white py-3 rounded-lg transition-all flex items-center justify-center`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Analyze Water Quality'
                      )}
                    </button>
                    <button
                      onClick={resetValues}
                      className="px-4 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                      <RotateCcw size={16} className="mr-2" />
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Results section */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Results</h2>
                    {showChart && (
                      <button
                        onClick={generatePDF}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        <Download size={16} />
                        <span>Export PDF</span>
                      </button>
                    )}
                  </div>
                  
                  {!showChart && (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                      <div className="text-6xl mb-4">📊</div>
                      <p className="text-center">Enter your test values and click "Analyze Water Quality" to see results.</p>
                    </div>
                  )}

                  {showChart && (
                    <div className="space-y-6">
                      {/* Chart */}
                      <div className="flex flex-col items-center">
                        <div className="relative w-48 h-48">
                          <Doughnut data={chartData} options={chartOptions} />
                          <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-3xl font-bold text-gray-700">
                              {qualityStats.safePercentage.toFixed(0)}%
                            </span>
                            <span className="text-sm text-gray-500">Safe</span>
                          </div>
                        </div>
                      </div>

                      {/* Parameter status summary */}
                      <div className="mt-4">
                        <h3 className="font-medium text-gray-700 mb-2">Parameter Status</h3>
                        <div className="space-y-2">
                          {qualityStats.safeParams.length > 0 && (
                            <div className="bg-green-50 p-3 rounded-lg border border-green-200 mb-2">
                              <h4 className="text-sm font-medium text-green-800 mb-1">Safe Parameters</h4>
                              <ul className="text-sm text-green-700">
                                {qualityStats.safeParams.map(param => (
                                  <li key={param.name} className="flex items-center">
                                    <Check size={14} className="mr-1 text-green-600" />
                                    {param.name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {qualityStats.unsafeParams.length > 0 && (
                            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                              <h4 className="text-sm font-medium text-red-800 mb-1">Parameters Outside Range</h4>
                              <ul className="text-sm text-red-700">
                                {qualityStats.unsafeParams.map(param => (
                                  <li key={param.name} className="flex items-center">
                                    <AlertTriangle size={14} className="mr-1 text-red-600" />
                                    {param.name}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Recommendations */}
                      {overallStatus === 'poor' && (
                        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <h3 className="font-medium text-amber-800 mb-1">Recommendations</h3>
                          <p className="text-sm text-amber-700">
                            Multiple parameters are outside safe ranges. Professional assessment is recommended for this water source.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    <ModernFooter/>
    </div>
  );
};

export default WaterQuality;