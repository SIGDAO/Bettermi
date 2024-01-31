import React, { useEffect, useState } from "react";

interface ICarouselItemProps {
  src: string;
  url: string;
}

export const CarouselItem = ({ children }) => {
  return <div className="carousel">{children}</div>;
};

export const Carousel = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const updateIndex = (index) => {
    const totalCount = React.Children.count(children);
    if (index < 0) {
      index = totalCount - 1;
    } else if (index >= totalCount) {
      index = 0;
    }
    setActiveIndex(index);
  };

  useEffect(() => {
    let id = setInterval(() => {
      updateIndex(activeIndex + 1);
    }, 2000);

    return () => {
      clearInterval(id);
    };
  });

  return (
    <div className="CarouselWrapper">
      <div
        className="inner"
        style={{ transform: `translateX(-${activeIndex * 250}px)` }}
      >
        {children}
      </div>

      <div>
        <button onClick={() => updateIndex(activeIndex - 1)}>Prev</button>
        {children.map((child, index) => {
          return (
            <button
              key={index}
              onClick={() => updateIndex(index)}
              className={`${activeIndex === index ? "active" : ""}`}
            >
              {index + 1}
            </button>
          );
        })}
        <button onClick={() => updateIndex(activeIndex + 1)}>Next</button>
      </div>
    </div>
  );
};