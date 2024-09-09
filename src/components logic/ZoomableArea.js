import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ZoomableArea = ({ width, height, margin, onZoom, zoomState, onClick }) => {
  const zoomableRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(zoomableRef.current);

    // Define the zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([1, 10]) // Set the zoom limits
      .translateExtent([[0, 0], [width + margin.left + margin.right, height + margin.bottom + margin.top]])  // Set the translate limits
      .on('zoom', (event) => {
        onZoom(event.transform);
      });

    svg.call(zoom);

    return () => {
      svg.on('.zoom', null);
    };
  }, [onZoom, width, height, margin]);

  useEffect(() => {
    if (zoomState) {
      const svg = d3.select(zoomableRef.current);
      svg.call(d3.zoom().transform, zoomState);
    }
  }, [zoomState]);

  return (
    <rect
      ref={zoomableRef}
      width={width + margin.left + margin.right}
      height={height + margin.top + margin.bottom}
      fill="none"
      pointerEvents="all"
      onClick={onClick} // Add onClick event handler
    />
  );
};

export default ZoomableArea;
