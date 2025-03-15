import React from 'react';

const WaterQualityTesting = () => {
  const tests = [
    { id: 1, date: '2023-10-01', location: 'New York', result: 'Safe' },
    { id: 2, date: '2023-10-02', location: 'Los Angeles', result: 'Unsafe' },
    { id: 3, date: '2023-10-03', location: 'Chicago', result: 'Safe' },
  ];

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <h1 className="text-2xl font-bold text-blue-800 mb-6">Water Quality Testing</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Location</th>
              <th className="text-left p-2">Result</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <tr key={test.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{test.date}</td>
                <td className="p-2">{test.location}</td>
                <td className="p-2">{test.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default WaterQualityTesting;