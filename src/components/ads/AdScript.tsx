import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const AdScript = () => {
  const location = useLocation();

  const SCRIPT_ID = "adsterra-popunder";
  const SCRIPT_SRC =
    "//producerheron.com/00/4a/d8/004ad8c8b2707e6899fd7089a61b81e3.js";

  const injectScript = () => {
    // Remove old script if it exists
    const old = document.getElementById(SCRIPT_ID);
    if (old) old.remove();

    // Create the new script tag
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;

    // Always attach to body (recommended by Adsterra)
    document.body.appendChild(script);
  };

  useEffect(() => {
    // Inject script whenever route changes
    injectScript();

    // Optionally, also inject on first load
  }, [location.pathname]);

  return null;
};

export default AdScript;
