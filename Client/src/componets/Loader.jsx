import { useEffect, useState } from "react";

import loaderBg from "../assets/Loaderbg.png";

import gif1 from "../assets/loaders/project gif1.gif";

import gif2 from "../assets/loaders/project gif2.gif";
import gif3 from "../assets/loaders/project gif3.gif";
import gif4 from "../assets/loaders/project gif4.gif";
import gif5 from "../assets/loaders/project gif5.gif";
import gif6 from "../assets/loaders/project gif6.gif";
import gif7 from "../assets/loaders/project gif7.gif";

const gifs = [
  gif1,
  gif2,
  gif3,
  gif4,
  gif5,
  gif6,
  gif7,
];

export default function Loader() {
  const [currentGif, setCurrentGif] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGif((prev) => (prev + 1) % gifs.length);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex items-center justify-center min-h-screen min-w-screen"
      style={{
        backgroundImage: `url(${loaderBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <img
        src={gifs[currentGif]}
        alt="loading"
        className="w-20 h-20 z-10"
      />
    </div>
  );
}