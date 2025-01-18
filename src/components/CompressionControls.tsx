import React, { useCallback } from 'react';
import { Sliders } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

interface CompressionControlsProps {
  quality: number;
  onQualityChange: (quality: number) => void;
}

export function CompressionControls({ 
  quality, 
  onQualityChange
}: CompressionControlsProps) {
  const [localQuality, setLocalQuality] = React.useState(quality);
  
  const debouncedQualityChange = useDebounce((value: number) => {
    onQualityChange(value);
  }, 500);

  const handleQualityChange = useCallback((value: number) => {
    setLocalQuality(value);
    debouncedQualityChange(value);
  }, [debouncedQualityChange]);

  return (
    <div className="flex items-center gap-4 p-4 bg-[#1E1E1E] rounded-lg flex-wrap">
      <div className="flex items-center gap-2">
        <Sliders className="w-5 h-5 text-gray-400" />
        <span className="text-sm font-medium text-gray-300">Compression Quality:</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={localQuality * 100}
        onChange={(e) => handleQualityChange(Number(e.target.value) / 100)}
        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-[#00A3FF] [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:appearance-none"
      />
      <span className="text-sm font-medium text-gray-300 min-w-[3ch]">
        {Math.round(localQuality * 100)}%
      </span>
    </div>
  );
}