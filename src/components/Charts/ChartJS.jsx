import React, { useEffect, useRef } from 'react';

const ChartJS = ({ type = 'line', data, options, height = 240 }) => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!window.Chart || !canvasRef.current) return undefined;
    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new window.Chart(ctx, { type, data, options });
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [type]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.data = data;
      chartRef.current.options = options;
      chartRef.current.update();
    }
  }, [data, options]);

  return (
    <canvas ref={canvasRef} height={height} />
  );
};

export default ChartJS;


