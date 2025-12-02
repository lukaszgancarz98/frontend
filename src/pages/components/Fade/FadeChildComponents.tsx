import React, { RefObject, useEffect, useRef, useState } from 'react';
import './FadeChildComponents.modules.scss';

type FadeChildComponentsProps = {
    children: React.ReactNode;
    className?: string;
    ref?: RefObject<HTMLDivElement | null>;
};

const FadeChildComponents: React.FC<FadeChildComponentsProps> = ({
    children,
    className = '',
    ref,
}) => {
    const refference = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const pickedRef = ref || refference;

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 },
        );

        if (pickedRef.current) {
            observer.observe(pickedRef.current);
        }

        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div ref={pickedRef} className={`fade-in-wrapper h-full z-50`}>
            <div
                className={`fade-in-content ${isVisible ? 'visible' : ''} ${className} h-full`}
            >
                {children}
            </div>
        </div>
    );
};

export default FadeChildComponents;
