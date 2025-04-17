import React from "react";

interface GenericPageProps {
  title: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  imageLeft?: string;
  imageRight?: string;
  highlightColor?: string;
}

const GenericPage: React.FC<GenericPageProps> = ({
  title,
  description,
  buttonText,
  buttonLink,
  imageRight,
  highlightColor = "orange",
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 -mt-10  sm:px-6 md:px-8 lg:px-10 xl:px-12">
      <div className="w-[96%] bg-[#F3F3F3] rounded-[40px] py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-extrabold text-noir mb-6 sm:mb-8 md:mb-10 relative inline-block">
                {title}
                <div className={`absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-${highlightColor} to-transparent`}></div>
              </h1>
              {description && (
                <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 md:mb-12 max-w-[500px] sm:max-w-[600px] mx-auto lg:mx-0">
                  {description}
                </p>
              )}
              {buttonText && (
                <a
                  href={buttonLink || "#"}
                  className="inline-block bg-orange hover:bg-noir font-semibold text-white px-6 sm:px-8 py-3 sm:py-4 rounded-3xl transition-colors duration-300 text-sm sm:text-base md:text-lg"
                >
                  {buttonText}
                </a>
              )}
            </div>

            {imageRight && (
              <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
                <img
                  src={imageRight}
                  alt="Illustration"
                  className="w-full h-auto rounded-lg max-w-[500px] sm:max-w-[600px] md:max-w-[700px] mx-auto lg:mx-0"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericPage;
