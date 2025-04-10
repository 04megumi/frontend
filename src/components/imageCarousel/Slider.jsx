import { useState } from 'react';
import { images, descriptions } from '../../data';

const Slider = () => {
  const [index, setIndex] = useState(0);

  return (
    // Container
    <div>
      {/*  Slides */}
      <div className="flex gap-x-20 lg:items-start items-center lg:flex-row flex-col">
        {/*  Images */}
        <div className="sm:w-[400px] sm:h-[400px] w-[300px] h-[300px] relative">
          {images.map((image, i) => (
            <img 
              key={i} 
              src={image} 
              className={`w-full h-full absolute object-cover rounded-3xl ${i === index ? "activeImage" : "inactiveImage"}`} 
            />
          ))}
        </div>
        <div>
          {/*  Descriptions */}
          <div className="relative sm:w-[400px] w-[320px] mt-22 lg:mt-5">
            {descriptions.map((desc, i) => (
              <p 
                className={`text-center sm:text-xl text-gray-600 absolute ${i === index ? "activeDesc" : "inactiveDesc"}`} 
                key={i}
              >
                {desc}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slider;