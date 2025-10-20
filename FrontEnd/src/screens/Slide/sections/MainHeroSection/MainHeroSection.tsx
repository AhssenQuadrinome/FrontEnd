import React from "react";

export const MainHeroSection = (): JSX.Element => {
  return (
    <section id="home" className="relative w-full h-[600px] md:h-[800px] lg:h-[961px] overflow-hidden">
      <img
        className="absolute top-[-150px] right-[-50px] w-full z-50"
       
        alt="Decore"
        src="/decore-2.png"
      />



      <div className="relative top-[-150px] flex items-center justify-start w-full h-full px-4 md:px-8 lg:px-16 z-[60]">
        <div className="flex flex-col items-start max-w-full md:max-w-[700px] lg:max-w-[988px] w-full">
          <div className="[font-family:'Poppins',Helvetica] font-bold text-[#df6951] text-sm md:text-lg lg:text-[26.6px] tracking-[0] leading-normal mb-4 md:mb-8 lg:mb-[42px]">
            BEST BUS MANAGEMENT SYSTEM
          </div>

          <div className="relative">
            <h1 className="[font-family:'Wendy_One',Helvetica] font-normal text-[#181e4b] text-[36px] md:text-[60px] lg:text-[90px] xl:text-[111.7px] tracking-[-2px] md:tracking-[-3px] lg:tracking-[-4.47px] leading-[40px] md:leading-[65px] lg:leading-[95px] xl:leading-[118.4px]">
              Taking a bus
              <br />
              couldn&apos;t be Easier
            </h1>

            <img
              className="absolute -bottom-[-100px] md:-bottom-[-100px] lg:-bottom-[-110px] left-[40%] md:left-[45%] lg:left-[391px] w-[200px] md:w-[350px] lg:w-[594px] h-2 md:h-3 lg:h-4"
              alt="Decore"
              src="/decore-3.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
