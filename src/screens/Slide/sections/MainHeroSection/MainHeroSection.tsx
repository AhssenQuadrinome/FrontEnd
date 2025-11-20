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
          <div className="[font-family:'Poppins',Helvetica] font-bold text-[#df6951] text-xs md:text-sm lg:text-base tracking-[0.5px] leading-normal mb-3 md:mb-5 lg:mb-6">
            BEST BUS MANAGEMENT SYSTEM
          </div>

          <div className="relative">
            <h1 className="[font-family:'Wendy_One',Helvetica] font-normal text-[#181e4b] text-[32px] md:text-[52px] lg:text-[70px] xl:text-[90px] tracking-[-1.5px] md:tracking-[-2px] lg:tracking-[-3px] leading-[36px] md:leading-[56px] lg:leading-[74px] xl:leading-[94px]">
              Taking a bus
              <br />
              couldn&apos;t be Easier
            </h1>

            <img
              className="absolute -bottom-[-90px] md:-bottom-[-95px] lg:-bottom-[-100px] left-[40%] md:left-[45%] lg:left-[391px] w-[180px] md:w-[300px] lg:w-[500px] h-1.5 md:h-2.5 lg:h-3"
              alt="Decore"
              src="/decore-3.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
