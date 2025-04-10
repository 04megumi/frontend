import React from "react";
import Bg from "../components/imageCarousel/Bg";
import Slider from "../components/imageCarousel/Slider";

const ImageCarousel = () => {
    return (
        <div className="centerChild h-screen">
            <Bg />
            <Slider />
        </div>
    );
};

export default ImageCarousel;