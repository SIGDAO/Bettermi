import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ICarouselItemProps {
  src: string;
  link: string;
}

interface IImageSliderProps {
  slides: ICarouselItemProps[];
}

export const CarouselItem = ({ children }) => {
  return <div className="carousel">{children}</div>;
};

const ImageSlider: React.FunctionComponent<IImageSliderProps> = (props) => {
  const { slides } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const [onholdPage, setOnholdPage] = useState<boolean[]>([false, false]);

  const Carousel = ({ children }) => {
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
        console.log("activeIndex", activeIndex);
        setOnholdPage([false, false]);
        updateIndex(activeIndex + 1);
      }, 2000);

      return () => {
        clearInterval(id);
      };
    }, []);

    return (
      <div className="CarouselWrapper">
        <div className="inner" style={{ transform: `translateX(-${activeIndex * 250}px)` }}>
          {children}
        </div>
        <div className="slide-dots-hH9Cww">
          {children.map((child, index) => {
            return <div key={index} onClick={() => updateIndex(index)} className={`${activeIndex === index ? "x444-3SAlGE" : "x445-3SAlGE"}`} />;
          })}
        </div>
      </div>
    );
  };

  const updateOnHoldPage = (index) => {
    setOnholdPage((prev) => {
      const newArray = [...prev];
      
      return newArray.map((item, i) => {
        if (i === index) {
          return true;
        }

        return false;
      });
    });

    setActiveIndex(index);
  };

  return (
    <div className="special-card-RoXPLo">
      <div className="buttons-slider-container">
        <button className={onholdPage[0] ? "special_button-hH9Cww-active" : "special_button-hH9Cww"} onClick={() => updateOnHoldPage(0)}>
          <div className="ic_notifications-9uK1Tx ic_notifications">
            <img className="ic_notifications-6bhCAa ic_notifications" src={`${process.env.PUBLIC_URL}/img/home/bxs-News.svg`} alt="ic_notifications" />
          </div>
        </button>
        <button className="special_button-hH9Cww">
          <div className="ic_reservation-nXPAX5 ic_reservation">
            <img className="ic_reservation-p9BhAR ic_reservation" src={`${process.env.PUBLIC_URL}/img/home/bxs-forum.svg`} alt="ic_reservation" />
          </div>
          <div className="ic_locked-nXPAX5 ic_locked">
            <img className="ic_locked-OiAYIf ic_locked" src={`${process.env.PUBLIC_URL}/img/ic-locked-1@1x.png`} alt="ic_locked" />
          </div>
        </button>
{/* 
        <button className={onholdPage[1] ? "special_button-hH9Cww-active" : "special_button-hH9Cww"} onClick={() => updateOnHoldPage(1)}>
          <div className="ic_forum_image ic_leaderboard">
            <img className="ic_leaderboard-6DxnCN ic_leaderboard" src={`${process.env.PUBLIC_URL}/img/`} alt="ic_leaderboard" />
          </div>
        </button> */}

        {/* <button className="special_button-hH9Cww">
          <div className="ic_reservation-nXPAX5 ic_reservation">
            <img className="ic_reservation-p9BhAR ic_reservation" src={`${process.env.PUBLIC_URL}/img/home/ic-reservation@1x.png`} alt="ic_reservation" />
          </div>
          <div className="ic_locked-nXPAX5 ic_locked">
            <img className="ic_locked-OiAYIf ic_locked" src={`${process.env.PUBLIC_URL}/img/ic-locked-1@1x.png`} alt="ic_locked" />
          </div>
        </button> */}
        <button className={onholdPage[1] ? "special_button-hH9Cww-active" : "special_button-hH9Cww"} onClick={() => updateOnHoldPage(1)}>
          <div className="ic_leaderboard-IgToMG ic_leaderboard">
            <img className="ic_leaderboard-6DxnCN ic_leaderboard" src={`${process.env.PUBLIC_URL}/img/home/bxs-Leaderboard.svg`} alt="ic_leaderboard" />
          </div>
        </button>
      </div>
      <div className="special-scroll-hH9Cww">
        <div className="x25-hK4LUV">
          <Carousel>
            {slides.map((slide, index) => {
              return (
                <CarouselItem key={index}>
                  <Link to={slide.link}>
                    <img className="home-scroller-element-image" src={slide.src} alt="" />
                  </Link>
                </CarouselItem>
              );
            })}
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
