import React, { useEffect, useRef } from 'react';
import { AudioVisualizerProps } from '../types';

const Visualizer: React.FC<AudioVisualizerProps> = ({ analyser, isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 300;
      canvas.height = canvas.parentElement?.clientHeight || 100;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const bufferLength = analyser ? analyser.frequencyBinCount : 0;
    const dataArray = analyser ? new Uint8Array(bufferLength) : new Uint8Array(0);

    const draw = () => {
      if (!isActive) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.strokeStyle = '#334155'; // Slate 700
        ctx.lineWidth = 1;
        ctx.stroke();
        return;
      }

      if (analyser) {
        analyser.getByteTimeDomainData(dataArray);
      }

      // Clear with transparent bg
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Neon Gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, '#60A5FA'); // Blue 400
      gradient.addColorStop(0.5, '#A78BFA'); // Purple 400
      gradient.addColorStop(1, '#34D399'); // Emerald 400
      ctx.strokeStyle = gradient;

      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; // 128 is zero-point
        // Amplify the visualization slightly
        const deviation = v - 1;
        const amplified = 1 + (deviation * 1.5); 
        
        const y = (amplified * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          // Curve smoothing
          const prevX = x - sliceWidth;
          const prevY = ((dataArray[i-1]/128.0) * canvas.height) / 2;
          const xc = (prevX + x) / 2;
          const yc = (prevY + y) / 2;
          // ctx.quadraticCurveTo(prevX, prevY, xc, yc); // Smoother, but simple line is faster
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      
      // Add a glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#60A5FA';

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [analyser, isActive]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default Visualizer;