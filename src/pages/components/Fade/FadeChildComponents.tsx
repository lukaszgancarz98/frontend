import React, { useEffect, useRef, useState } from "react";
import "./FadeChildComponents.modules.scss";

type FadeChildComponentsProps = {
  children: React.ReactNode;
  className?: string;
};

const FadeChildComponents: React.FC<FadeChildComponentsProps> = ({
  children,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Jeśli chcesz tylko raz uruchomić
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`fade-in-wrapper h-full z-50`}>
      <div
        className={`fade-in-content ${isVisible ? "visible" : ""} ${className} h-full`}
      >
        {children}
      </div>
    </div>
  );
};

export default FadeChildComponents;
