import { useEffect, useRef } from 'react';

const Banner728x90 = () => {
    const scriptAdded = useRef(false);
    const SCRIPT_ID = 'banner-728x90-script';

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
  	'key' : '360242063ba4582120f24f8352f1546b',
  	'format' : 'iframe',
  	'height' : 90,
  	'width' : 728,
  	'params' : {}
  };
    `;

        // Create main script
        const mainScript = document.createElement('script');
        mainScript.id = SCRIPT_ID;
        mainScript.type = 'text/javascript';
        mainScript.src = '//producerheron.com/360242063ba4582120f24f8352f1546b/invoke.js';

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
            <div id="banner-728x90-container"></div>
        </div>
    );
};

export default Banner728x90;