// src/components/NativeBanner.tsx
import { useEffect, useRef } from 'react';

interface NativeBannerProps {
  containerId?: string;
  className?: string;
}

const NativeBanner = ({ 
  containerId = 'container-383ea26686d67bd8882812aab8f3e5b3',
  className = ''
}: NativeBannerProps) => {
  const scriptAdded = useRef(false);
  const SCRIPT_SRC = '//producerheron.com/383ea26686d67bd8882812aab8f3e5b3/invoke.js';
  const SCRIPT_ID = 'native-banner-script';

  useEffect(() => {
    // Prevent duplicate script insertion
    if (scriptAdded.current || document.getElementById(SCRIPT_ID)) {
      return;
    }

    scriptAdded.current = true;
    
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.async = true;
    // @ts-ignore - data-cfasync is a custom attribute
    script.dataset.cfasync = 'false';
    script.src = SCRIPT_SRC;
    
    document.body.appendChild(script);

    return () => {
      const scriptElement = document.getElementById(SCRIPT_ID);
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
        scriptAdded.current = false;
      }
    };
  }, []);

  return (
    <div 
      id={containerId} 
      className={className}
    />
  );
};

export default NativeBanner;