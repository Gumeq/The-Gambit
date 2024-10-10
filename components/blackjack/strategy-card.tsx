import React from "react";

const BlackjackStrategyCard: React.FC = () => {
  // Define types for the strategyKey object
  const strategyKey: { [key: string]: string } = {
    H: "Hit",
    S: "Stand",
    D: "Double if allowed, otherwise hit",
    Ds: "Double if allowed, otherwise stand",
    N: "Don't split the pair",
    Y: "Split the Pair",
    YN: "Split only if 'DAS' is offered",
    SUR: "Surrender",
  };

  // Define types for the table data arrays
  const hardTotals: string[][] = [
    ["17", "S", "S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
    ["16", "S", "S", "S", "S", "S", "S", "H", "H", "H", "H", "H"],
    ["15", "S", "S", "S", "S", "S", "H", "H", "H", "H", "H", "H"],
    ["14", "S", "S", "S", "S", "S", "H", "H", "H", "H", "H", "H"],
    ["13", "S", "S", "S", "S", "S", "H", "H", "H", "H", "H", "H"],
    ["12", "H", "H", "S", "S", "S", "H", "H", "H", "H", "H", "H"],
    ["11", "D", "D", "D", "D", "D", "D", "D", "D", "D", "D", "H"],
    ["10", "D", "D", "D", "D", "D", "D", "D", "D", "H", "H", "H"],
    ["9", "H", "D", "D", "D", "D", "D", "H", "H", "H", "H", "H"],
    ["8", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
  ];

  const softTotals: string[][] = [
    ["A,9", "S", "S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
    ["A,8", "S", "S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
    ["A,7", "Ds", "Ds", "Ds", "Ds", "S", "S", "H", "H", "H", "H"],
    ["A,6", "H", "D", "D", "D", "D", "H", "H", "H", "H", "H", "H"],
    ["A,5", "H", "H", "D", "D", "D", "H", "H", "H", "H", "H", "H"],
    ["A,4", "H", "H", "D", "D", "D", "H", "H", "H", "H", "H", "H"],
    ["A,3", "H", "H", "H", "D", "D", "H", "H", "H", "H", "H", "H"],
    ["A,2", "H", "H", "H", "D", "D", "H", "H", "H", "H", "H", "H"],
  ];

  const pairSplitting: string[][] = [
    ["A,A", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y"],
    ["T,T", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N"],
    ["9,9", "Y", "Y", "Y", "Y", "Y", "S", "Y", "Y", "S", "Y", "N"],
    ["8,8", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y"],
    ["7,7", "Y", "Y", "Y", "Y", "Y", "Y", "H", "H", "H", "H", "H"],
    ["6,6", "Y/N", "Y", "Y", "Y", "Y", "Y", "H", "H", "H", "H", "H"],
    ["5,5", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N", "N"],
    ["4,4", "N", "N", "N", "Y/N", "Y/N", "N", "N", "N", "N", "N", "N"],
    ["3,3", "Y/N", "Y/N", "Y", "Y", "Y", "Y", "Y", "N", "N", "N", "N"],
    ["2,2", "Y/N", "Y/N", "Y", "Y", "Y", "Y", "Y", "N", "N", "N", "N"],
  ];

  const surrender: string[][] = [
    ["16", "", "", "", "", "", "", "", "SUR", "SUR", "SUR"],
    ["15", "", "", "", "", "", "", "", "SUR", "SUR", "SUR"],
    ["14", "", "", "", "", "", "", "", "", "", ""],
  ];

  // Define the return type for renderTable: JSX.Element
  const renderTable = (data: string[][], title: string): JSX.Element => (
    <div className="mb-6">
      <h3 className="mb-2 text-lg font-bold">{title}</h3>
      <table className="table-auto border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Totals</th>
            <th className="border border-gray-300 px-4 py-2">2</th>
            <th className="border border-gray-300 px-4 py-2">3</th>
            <th className="border border-gray-300 px-4 py-2">4</th>
            <th className="border border-gray-300 px-4 py-2">5</th>
            <th className="border border-gray-300 px-4 py-2">6</th>
            <th className="border border-gray-300 px-4 py-2">7</th>
            <th className="border border-gray-300 px-4 py-2">8</th>
            <th className="border border-gray-300 px-4 py-2">9</th>
            <th className="border border-gray-300 px-4 py-2">10</th>
            <th className="border border-gray-300 px-4 py-2">A</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="text-center">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border border-gray-300 px-4 py-2"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-bold">Blackjack Basic Strategy</h2>
      <p className="mb-4">Key:</p>
      <ul className="mb-6">
        {Object.keys(strategyKey).map((key) => (
          <li key={key}>
            <strong>{key}:</strong> {strategyKey[key]}
          </li>
        ))}
      </ul>
      {renderTable(hardTotals, "Hard Totals")}
      {renderTable(softTotals, "Soft Totals")}
      {renderTable(pairSplitting, "Pair Splitting")}
      {renderTable(surrender, "Surrender")}
    </div>
  );
};

export default BlackjackStrategyCard;
