import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { FaEye, FaShoppingCart, FaRedo } from "react-icons/fa";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import NavigationBar from "./NavigationBar";
import Footer from "./Footer";

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

  // Define the parameters for each water type
  const waterQualityParams = {
    potable: [
      { name: "pH Level", range: "6.5-8.5" },
      { name: "Turbidity (NTU)", range: "0-1" },
      { name: "Chlorine (mg/L)", range: "0.2-1.0" },
      { name: "Total Dissolved Solids (TDS) (mg/L)", range: "300-500" },
    ],
    nonpotable: [
      { name: "pH Level", range: "6.0-9.0" },
      { name: "Turbidity (NTU)", range: "1-5" },
      { name: "Ammonia (mg/L)", range: "0-1" },
      { name: "Total Suspended Solids (TSS) (mg/L)", range: "10-100" },
    ],
    agricultural: [
      { name: "pH Level", range: "6.0-8.5" },
      { name: "Electrical Conductivity (EC) (dS/m)", range: "0.2-2.0" },
      { name: "Nitrate (NO3) (mg/L)", range: "10-50" },
      { name: "Total Dissolved Solids (TDS) (mg/L)", range: "500-1500" },
    ],
    industrial: [
      { name: "pH Level", range: "6.0-9.0" },
      { name: "Turbidity (NTU)", range: "1-5" },
      { name: "Heavy Metals (mg/L)", range: "0-0.5" },
      { name: "Chemical Oxygen Demand (COD) (mg/L)", range: "50-200" },
    ],
  };

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
        value: e.target.value,
        status: "",
      },
    }));
  };

  const checkQuality = () => {
    const newResults = {};
    let hasFail = false;

    parameters.forEach((param) => {
      const value = parseFloat(results[param.name]?.value);
      const range = param.range.split("-").map((num) => parseFloat(num));

      if (value >= range[0] && value <= range[1]) {
        newResults[param.name] = { value, status: "pass" };
      } else {
        newResults[param.name] = { value, status: "fail" };
        hasFail = true;
      }
    });

    setResults(newResults);
    setShowHelp(hasFail);
    setShowBuyKit(hasFail);
    setShowChart(true); // Show the pie chart after checking the quality
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
        label: "Water Quality Results",
        data: parameters.map((param) => results[param.name]?.value || 0),
        backgroundColor: [
          "rgba(104, 23, 129, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(54, 162, 235, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(54, 162, 235, 1)",
        ],
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
      <div className="max-w-7xl mx-auto p-10 ">
        <h1 className="text-4xl font-bold text-center mb-6">
          Water Quality Test for{" "}
          {waterType
            ? waterType.charAt(0).toUpperCase() + waterType.slice(1)
            : "Unknown"}
        </h1>

        {/* Full-Width Message Alerts */}
        {(showHelp || showBuyKit) && (
          <div className="mb-6">
            {showHelp && (
              <div className="p-4 mb-2 text-red-700 bg-red-100 rounded-lg text-center">
                <FaEye className="inline mb-1 text-xl" />
                <p className="text-lg font-medium">
                  Your water test results indicate an issue. <br /> Book an
                  expert consultation now!
                </p>
                <button
                  onClick={() => navigate("/serviceRequest")}
                  className="bg-yellow-500 text-white py-2 px-6 rounded-md mt-4 hover:bg-yellow-600"
                >
                  Book a Consultation
                </button>
              </div>
            )}
            {showBuyKit && (
              <div className="p-4 text-blue-700 bg-blue-100 rounded-lg text-center">
                <FaShoppingCart className="inline mb-1 text-xl" />
                <p className="text-lg font-medium">
                  Get a professional water testing kit to ensure better water
                  quality.
                </p>
                <button
                  onClick={() => navigate("/onlineStoreHome")}
                  className="bg-blue-500 text-white py-2 px-6 rounded-md mt-4 hover:bg-blue-600"
                >
                  Purchase Testing Kit
                </button>
              </div>
            )}
          </div>
        )}

        {/* Parameter Inputs Below the Chart */}
        <div className="flex justify-between w-full mb-8">
          <div className="w-2/5">
            {parameters.length > 0 ? (
              parameters.map((param) => (
                <div key={param.name} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {param.name} (Range: {param.range})
                  </label>
                  <input
                    type="number"
                    onChange={(e) => handleInputChange(e, param.name)}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                    placeholder={`Enter value for ${param.name}`}
                  />
                  {results[param.name] && (
                    <p
                      className={`mt-2 text-sm ${
                        results[param.name].status === "fail"
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      Result: {results[param.name].status} (Value:{" "}
                      {results[param.name].value})
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-red-500">Invalid water type selected.</p>
            )}

            {/* Buttons */}
            <div className="flex gap-4 mt-4">
              <button
                onClick={checkQuality}
                className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
              >
                Check Quality
              </button>
              <button
                onClick={resetValues}
                className="flex-1 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 flex items-center justify-center"
              >
                <FaRedo className="mr-2" /> Reset
              </button>
            </div>
          </div>

          {/* Large Pie Chart */}
          <div className="w-2/5">
            {showChart && parameters.length > 0 && (
              <div className="flex flex-col items-center mb-8">
                <h2 className="text-xl font-semibold text-center mb-4">
                  Water Quality Chart
                </h2>
                <Pie data={chartData} />
              </div>
            )}
          </div>
          
          <div className="mt-6 text-center">
            <div className="inline-block text-6xl mb-2">{waterTypeInfo.icon}</div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              {waterTypeInfo.title} Quality Test
            </h1>
            <p className="text-lg text-white/90">{waterTypeInfo.description}</p>
          </div>
        </div>

        {/* Show help or kit purchase option if needed */}
        {showHelp && (
          <div className="mt-6">
            <div className="p-4 text-yellow-700 bg-yellow-100 rounded-lg flex items-center">
              <p className="text-lg font-medium">
                Water quality parameters do not meet the standard. Please refer
                to guidelines.
              </p>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default WaterQuality;