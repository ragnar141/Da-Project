
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ZoomableArea = ({ width, height, margin, onZoom }) => {
  const zoomRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(zoomRef.current);

    // Add zoom behavior
    const zoomBehavior = d3.zoom()
      .scaleExtent([0.5, 20])
      .translateExtent([[margin.left, 0], [width + margin.left, height]])
      .extent([[margin.left, 0], [width + margin.left, height]])
      .on("zoom", (event) => {
        onZoom(event.transform);
      });

    svg.call(zoomBehavior);
  }, [width, height, margin, onZoom]);

  return <rect ref={zoomRef} x={margin.left} width={width} height={height} style={{ fill: 'none', pointerEvents: 'all' }} />;
};

export default ZoomableArea;
