import { useEffect, useRef } from "react";
import './horizontalScrollContainer.css';
import * as React from 'react';

interface IHorizontalScrollContainerProps {
  children?: any;
  inputClassName?: string;
  style?: any;
}

const HorizontalScrollContainer: React.FunctionComponent<IHorizontalScrollContainerProps> = (props: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { inputClassName } = props;

  function handleScrollHorizontally(e: any) {
      const strength = Math.abs(e.deltaY);
      if (e.deltaY === 0) return;
  
      const el = e.currentTarget;
      if (
        !(el.scrollLeft === 0 && e.deltaY < 0) &&
        !(
          el.scrollWidth -
            el.clientWidth -
            Math.round(el.scrollLeft) ===
            0 && e.deltaY > 0
        )
      ) {
        e.preventDefault();
      }
      el.scrollTo({
        left: el.scrollLeft + e.deltaY,
        // large scrolls with smooth animation behavior will lag, so switch to auto
        // behavior: strength > 70 ? "auto" : "smooth",
        behavior: "auto",

      });
  
  }
  
    useEffect(() => {
      const containerElement = containerRef.current;
      if (containerElement) {
        containerElement.addEventListener("wheel", handleScrollHorizontally, { passive: false });
      }
      return () => {
        if (containerElement) {
          containerElement.removeEventListener("wheel", handleScrollHorizontally);
        }
      };
    }, []);
  
    return (
      <div
        className={`${inputClassName} horizontal-scroll-ontainer`}
        ref={containerRef}
        style={{ overflowX: 'auto', overflowY: 'hidden', msOverflowStyle: `none`, scrollbarWidth: `none`, ...props.style}}
      >
        {props.children}
      </div>
    );
};

export default HorizontalScrollContainer;
