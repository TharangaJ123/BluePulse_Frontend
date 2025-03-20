import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { FaEye, FaShoppingCart, FaRedo } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const WaterQuality = () => {
  const { waterType } = useParams(); // Get the waterType from the URL
  const navigate = useNavigate();

  const [parameters, setParameters] = useState([]);
  const [results, setResults] = useState({});
  const [showHelp, setShowHelp] = useState(false);
  const [showBuyKit, setShowBuyKit] = useState(false);
  const [showChart, setShowChart] = useState(false);

  // Define the parameters for each water type
  const waterQualityParams = {
    potable: [
      { name: 'pH Level', range: '6.5-8.5' },
      { name: 'Turbidity (NTU)', range: '0-1' },
      { name: 'Chlorine (mg/L)', range: '0.2-1.0' },
      { name: 'Total Dissolved Solids (TDS) (mg/L)', range: '300-500' },
    ],
    nonpotable: [
      { name: 'pH Level', range: '6.0-9.0' },
      { name: 'Turbidity (NTU)', range: '1-5' },
      { name: 'Ammonia (mg/L)', range: '0-1' },
      { name: 'Total Suspended Solids (TSS) (mg/L)', range: '10-100' },
    ],
    agricultural: [
      { name: 'pH Level', range: '6.0-8.5' },
      { name: 'Electrical Conductivity (EC) (dS/m)', range: '0.2-2.0' },
      { name: 'Nitrate (NO3) (mg/L)', range: '10-50' },
      { name: 'Total Dissolved Solids (TDS) (mg/L)', range: '500-1500' },
    ],
    industrial: [
      { name: 'pH Level', range: '6.0-9.0' },
      { name: 'Turbidity (NTU)', range: '1-5' },
      { name: 'Heavy Metals (mg/L)', range: '0-0.5' },
      { name: 'Chemical Oxygen Demand (COD) (mg/L)', range: '50-200' },
    ],
  };

  // Set water parameters based on water type
  useEffect(() => {
    if (waterQualityParams[waterType]) {
      setParameters(waterQualityParams[waterType]);
    } else {
      setParameters([]);
    }
  }, [waterType]);

  const handleInputChange = (e, paramName) => {
    setResults((prevResults) => ({
      ...prevResults,
      [paramName]: {
        value: e.target.value,
        status: '',
      },
    }));
  };

  const checkQuality = () => {
    const newResults = {};
    let hasFail = false;

    parameters.forEach((param) => {
      const value = parseFloat(results[param.name]?.value);
      const range = param.range.split('-').map((num) => parseFloat(num));

      if (value >= range[0] && value <= range[1]) {
        newResults[param.name] = { value, status: 'pass' };
      } else {
        newResults[param.name] = { value, status: 'fail' };
        hasFail = true;
      }
    });

    setResults(newResults);
    setShowHelp(hasFail);
    setShowBuyKit(hasFail);
    setShowChart(true); // Show the pie chart after checking the quality
  };

  const resetValues = () => {
    setResults({});
    setShowHelp(false);
    setShowBuyKit(false);
    setShowChart(false); // Hide the pie chart when resetting
  };

  // Pie chart data
  const chartData = {
    labels: parameters.map((param) => param.name),
    datasets: [
      {
        label: 'Water Quality Results',
        data: parameters.map((param) => results[param.name]?.value || 0),
        backgroundColor: [
          'rgba(104, 23, 129, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto p-10 bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold text-center mb-6">
        Water Quality Test for {waterType ? (waterType.charAt(0).toUpperCase() + waterType.slice(1)) : 'Unknown'}
      </h1>

      {/* Full-Width Message Alerts */}
      {(showHelp || showBuyKit) && (
        <div className="mb-6">
          {showHelp && (
            <div className="p-4 mb-2 text-red-700 bg-red-100 rounded-lg text-center">
              <FaEye className="inline mb-1 text-xl" />
              <p className="text-lg font-medium">
                Your water test results indicate an issue. <br /> Book an expert
                consultation now!
              </p>
              <button
                onClick={() => navigate('/serviceRequest')}
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
                Get a professional water testing kit to ensure better water quality.
              </p>
              <button
                onClick={() => navigate('/buy-kit')}
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
                      results[param.name].status === 'fail'
                        ? 'text-red-500'
                        : 'text-green-500'
                    }`}
                  >
                    Result: {results[param.name].status} (Value: {results[param.name].value})
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
              <h2 className="text-xl font-semibold text-center mb-4">Water Quality Chart</h2>
              <Pie data={chartData} />
            </div>
          )}
        </div>
      </div>

      {/* Show help or kit purchase option if needed */}
      {showHelp && (
        <div className="mt-6">
        <div className="p-4 text-yellow-700 bg-yellow-100 rounded-lg flex items-center">
          <p className="text-lg font-medium">
            Water quality parameters do not meet the standard. Please refer to guidelines.
          </p>
        </div>
      </div>
      )}

  
    </div>
  );
};

export default WaterQuality;
