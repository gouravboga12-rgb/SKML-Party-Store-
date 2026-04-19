import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // 1. Handle normal page changes (scroll to top)
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    // 2. Handle hash changes (scroll to specific element)
    const id = hash.replace('#', '');
    const element = document.getElementById(id);
    
    if (element) {
      // Small delay to ensure any AOS animations or layouts are settled
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToHash;
