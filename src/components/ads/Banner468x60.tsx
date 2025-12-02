import { useEffect, useRef } from 'react';

const Banner468x60 = () => {
  const scriptAdded = useRef(false);
  const SCRIPT_ID = 'banner-468x60-script';

  useEffect(() => {
    if (scriptAdded.current || document.getElementById(SCRIPT_ID)) {
      return;
    }

    scriptAdded.current = true;

    // Create configuration script
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    configScript.innerHTML = `
      atOptions = {
        'key' : '3d3f9348f71921f5315f2c42f8f97906',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    `;

    // Create main script
    const mainScript = document.createElement('script');
    mainScript.id = SCRIPT_ID;
    mainScript.type = 'text/javascript';
    mainScript.src = '//producerheron.com/3d3f9348f71921f5315f2c42f8f97906/invoke.js';

    // Add both scripts to body
    document.body.appendChild(configScript);
    document.body.appendChild(mainScript);

    return () => {
      const scriptElement = document.getElementById(SCRIPT_ID);
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
        // Also remove config script
        const configScripts = document.querySelectorAll('script');
        configScripts.forEach(script => {
          if (script.innerHTML.includes('atOptions')) {
            script.parentNode?.removeChild(script);
          }
        });
        scriptAdded.current = false;
      }
    };
  }, []);

  return (
    <div className="my-6 flex justify-center">
      <div id="banner-468x60-container"></div>
    </div>
  );
};

export default Banner468x60;