import React, { useState } from 'react';
import { FaShoppingCart, FaInfoCircle, FaMoon, FaSun, FaTools, FaRedo } from 'react-icons/fa';
import { ResponsiveContainer, RadialBarChart, RadialBar, PieChart, Pie, Cell, Tooltip, Label } from 'recharts';
import { useParams } from 'react-router-dom';

const WaterQualityTest = () => {
  const { waterType } = useParams();

  const [parameters, setParameters] = useState({
    pH: '',
    turbidity: '',
    TDS: '',
    chlorine: '',
  });

  const [results, setResults] = useState({});
  const [showAppointmentPrompt, setShowAppointmentPrompt] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleInputChange = (e, param) => {
    setParameters({ ...parameters, [param]: e.target.value });
  };

  const getRecommendedValues = () => {
    switch (waterType) {
      case 'potable':
        return {
          pH: { min: 6.5, max: 8.5 },
          turbidity: { max: 1 },
          TDS: { max: 500 },
          chlorine: { min: 0.2, max: 4.0 },
        };
      case 'non-potable':
        return {
          pH: { min: 5.0, max: 9.0 },
          turbidity: { max: 50 },
          TDS: { max: 2000 },
          chlorine: { max: 5 },
        };
      case 'industrial':
        return {
          pH: { min: 5.0, max: 10.0 },
          turbidity: { max: 10 },
          TDS: { max: 10000 },
          chlorine: { max: 1 },
        };
      case 'agricultural':
        return {
          pH: { min: 6.0, max: 8.5 },
          turbidity: { max: 10 },
          TDS: { min: 100, max: 2000 },
          chlorine: { max: 2 },
        };
      default:
        return {
          pH: { min: 6.5, max: 8.5 },
          turbidity: { max: 4 },
          TDS: { max: 500 },
          chlorine: { max: 1 },
        };
    }
  };

  const checkQuality = (param) => {
    let status = 'Safe';
    let value = parseFloat(parameters[param]);
    const recommended = getRecommendedValues();

    if (!recommended[param]) return; // Ensure valid parameter check

    if (param === 'pH') {
      status = value >= recommended[param].min && value <= recommended[param].max ? 'Safe' : 'Unsafe';
    } else {
      status = value <= recommended[param].max ? 'Safe' : 'Unsafe';
    }

    const updatedResults = { ...results, [param]: { value, status, recommended: recommended[param].max } };
    setResults(updatedResults);

    const hasUnsafe = Object.values(updatedResults).some((result) => result.status === 'Unsafe');
    setShowAppointmentPrompt(hasUnsafe);
  };

  const resetValues = () => {
    setParameters({ pH: '', turbidity: '', TDS: '', chlorine: '' });
    setResults({});
    setShowAppointmentPrompt(false);
  };

  const getOverallStatus = () => {
    return Object.values(results).some(result => result.status === 'Unsafe') ? 'Unsafe' : 'Safe';
  };

  const pieData = [
    { name: 'Safe', value: Object.values(results).filter(result => result.status === 'Safe').length },
    { name: 'Unsafe', value: Object.values(results).filter(result => result.status === 'Unsafe').length }
  ];

  return (
    <div className={`max-w-5xl mx-auto p-6 rounded-2xl shadow-lg space-y-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-center">Water Quality Testing</h1>
        <div className="flex gap-4">
          <button onClick={resetValues} className="text-2xl p-2 rounded-full shadow-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600">
            <FaRedo className="text-gray-800 dark:text-white" />
          </button>
          <button onClick={() => setDarkMode(!darkMode)} className="text-2xl p-2 rounded-full shadow-lg">
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
          </button>
        </div>
      </div>

      <div className="p-6 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white text-center">
        <h2 className="text-xl font-semibold">Overall Water Quality Status</h2>
        <p className={`text-3xl font-bold ${getOverallStatus() === 'Unsafe' ? 'text-red-600' : 'text-green-600'}`}>
          {getOverallStatus()}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%" fill="#8884d8" label>
            <Cell fill="#00C49F" />
            <Cell fill="#FF8042" />
          </Pie>
          <Tooltip />
          <Label value="Water Quality" position="center" fontSize={20} fontWeight="bold" fill="#333" />
        </PieChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.keys(parameters).map((param, index) => (
          <div key={index} className="p-6 rounded-xl shadow-lg transition hover:scale-105 flex flex-col space-y-4 items-center bg-white dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-blue-700 text-center">{param.toUpperCase()} Test</h2>
            <input
              type="number"
              placeholder="Enter value"
              value={parameters[param]}
              onChange={(e) => handleInputChange(e, param)}
              className="p-2 w-full bg-blue-50 border border-blue-300 rounded-lg text-center dark:bg-gray-700"
            />
            <button
              onClick={() => checkQuality(param)}
              className="w-24 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
            >
              Test
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaterQualityTest;
