// components/SocialBarScript.tsx
import { useEffect, useRef } from 'react';

const SocialBarScript = () => {
  const scriptAdded = useRef(false);
  const SCRIPT_SRC = '//producerheron.com/8e/86/a5/8e86a593673c9c604273ca1adb6a391d.js';
  const SCRIPT_ID = 'social-bar-script';

  useEffect(() => {
    if (scriptAdded.current || document.getElementById(SCRIPT_ID)) {
      return;
    }

    scriptAdded.current = true;
    
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.type = 'text/javascript';
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

  return null;
};

export default SocialBarScript;