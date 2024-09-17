import React from "react";

interface RouletteWheelProps {
  numSegments: number;
}

const RouletteNew: React.FC<RouletteWheelProps> = ({ numSegments }) => {
  const radius = 100; // Radius of the wheel
  const cx = radius; // Center x-coordinate
  const cy = radius; // Center y-coordinate

  const segments = [];

  for (let i = 0; i < numSegments; i++) {
    const startAngle = (i * 360) / numSegments;
    const endAngle = ((i + 1) * 360) / numSegments;

    const pathData = describeArc(cx, cy, radius, startAngle, endAngle);

    segments.push(
      <path
        key={i}
        d={pathData}
        fill={i % 2 === 0 ? "#d22" : "#222"} // Alternating colors
        stroke="#fff"
        strokeWidth="1"
      />,
    );
  }

  const texts = [];

  for (let i = 0; i < numSegments; i++) {
    const startAngle = (i * 360) / numSegments;
    const endAngle = ((i + 1) * 360) / numSegments;
    const middleAngle = (startAngle + endAngle) / 2;

    const angleRad = (middleAngle - 90) * (Math.PI / 180);
    const textRadius = radius * 0.7;
    const x = cx + textRadius * Math.cos(angleRad);
    const y = cy + textRadius * Math.sin(angleRad);

    texts.push(
      <text
        key={i}
        x={x}
        y={y}
        fill="#fff"
        fontSize="12"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {i + 1}
      </text>,
    );
  }

  return (
    <div className="flex items-center justify-center">
      <svg width={2 * radius} height={2 * radius}>
        {segments}
        {texts}
      </svg>
    </div>
  );
};

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  // Convert angles from degrees to radians
  const start = (startAngle - 90) * (Math.PI / 180);
  const end = (endAngle - 90) * (Math.PI / 180);

  const x1 = cx + r * Math.cos(start);
  const y1 = cy + r * Math.sin(start);
  const x2 = cx + r * Math.cos(end);
  const y2 = cy + r * Math.sin(end);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    `M ${cx} ${cy}`, // Move to center
    `L ${x1} ${y1}`, // Line to start of arc
    `A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`, // Arc
    "Z", // Close path back to center
  ].join(" ");

  return d;
}

export default RouletteNew;
