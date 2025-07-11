import React from "react";

interface CustomCircularProgressProps {
    value: number;
    maxValue: number;
    size?: number;
    strokeWidth?: number;
}

const CustomCircularProgress: React.FC<CustomCircularProgressProps> = ({ value, maxValue, size = 80, strokeWidth = 10 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const getOffset = (val: number) => circumference - (val / 100) * circumference;

    const normalizedValue = Math.min(value, maxValue);
    const overflowValue = Math.max(0, value - maxValue);

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg height={size} width={size}>
                <circle
                    className="text-gray-300"
                    cx={size / 2}
                    cy={size / 2}
                    fill="transparent"
                    r={radius}
                    stroke="white"
                    strokeOpacity="0.1"
                    strokeWidth={strokeWidth}
                />
                {value >= maxValue ? (
                    <>
                        {/* Base (max) ring in blue */}
                        <circle
                            cx={size / 2}
                            cy={size / 2}
                            fill="transparent"
                            r={radius}
                            stroke="blue"
                            strokeDasharray={circumference}
                            strokeDashoffset={getOffset(100)}
                            strokeLinecap="round"
                            strokeWidth={strokeWidth}
                            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                        />
                        {/* Overflow ring in red */}
                        {overflowValue > 0 && (
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                fill="transparent"
                                r={radius}
                                stroke="red"
                                strokeDasharray={circumference}
                                strokeDashoffset={getOffset((overflowValue / maxValue) * 100)}
                                strokeLinecap="round"
                                strokeWidth={strokeWidth}
                                style={{
                                    transform: "rotate(-90deg)",
                                    transformOrigin: "50% 50%",
                                }}
                            />
                        )}
                    </>
                ) : (
                    // Normal progress in blue
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        fill="transparent"
                        r={radius}
                        stroke="blue"
                        strokeDasharray={circumference}
                        strokeDashoffset={getOffset((normalizedValue / maxValue) * 100)}
                        strokeLinecap="round"
                        strokeWidth={strokeWidth}
                        style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                    />
                )}
            </svg>
            {/* Value in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-sm font-bold" style={{ pointerEvents: "none" }}>
                <p className="border-b">{value}</p>
                <p>{maxValue}</p>
            </div>
        </div>
    );
};

export default CustomCircularProgress;
