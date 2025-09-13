import React, { useEffect, useRef, useState } from 'react';
import './BackgroundOnScroll.module.scss';

type BackgroundOnScrollProps = {
    children?: React.ReactNode;
    className?: string;
    bgClassName?: string;
    backgroundImageUrl: string;
};

const BackgroundOnScroll: React.FC<BackgroundOnScrollProps> = ({
    children,
    className = '',
    bgClassName = 'absolute top-0 left-0',
    backgroundImageUrl,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2, root: null, rootMargin: '0px' },
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    const background = isVisible
        ? { backgroundImage: `url(${backgroundImageUrl})` }
        : {};

    return (
        <div ref={ref} className={`bgOnScrollWrapper relative ${className}`}>
            <div
                className={`${isVisible ? 'visible' : ''} bg-cover bg-center bg-no-repeat h-full w-full ${bgClassName}`}
                style={background}
            >
                <div className="absolute top-0 left-0 w-full h-full shadow-[inset_0_0_80px_90px_rgba(1,8,18,1)]" />
                <div className="absolute top-0 left-0 w-full h-full shadow-[inset_0_0_20px_20px_rgba(1,8,18,1)]" />
            </div>
            {children}
        </div>
    );
};

export default BackgroundOnScroll;
