import React from "react";
import { AboutUsSection } from "./sections/AboutUsSection";
import { BookingFormSection } from "./sections/BookingFormSection";
import { ContactUsSection } from "./sections/ContactUsSection";
import { FooterSection } from "./sections/FooterSection";
import { HeroSection } from "./sections/HeroSection";
import { InfoCardsSection } from "./sections/InfoCardsSection";
import { MainHeroSection } from "./sections/MainHeroSection";

export const Slide = (): JSX.Element => {
  return (
    <>
      {/* Fixed transparent header above all content */}
  <div className="fixed top-0 left-0 w-full z-[100]">
        <HeroSection />
      </div>
      {/* Main content with white background, padding top for header height */}
      <div className="bg-[#ffffff] overflow-hidden w-full relative ">
        <MainHeroSection />

        <BookingFormSection />

        <div className="relative w-full px-4 md:px-8 mt-[400px]">
          <img
            className="absolute top-[200px] left-[-100px] w-[400px] md:w-[600px] lg:w-[771px] h-auto object-cover"
            alt="Chatgpt image oct"
            src="/chatgpt-image-18-oct--2025--12-23-46-4.png"
          />

          <div className="relative flex justify-center pt-16 md:pt-24 lg:pt-[162px]">
            <div className="w-full max-w-[300px] md:max-w-[450px] lg:max-w-[596px] h-auto relative">
              <div className="[font-family:'Wendy_One',Helvetica] font-normal text-[#181e4b] text-[40px] md:text-[70px] lg:text-[111.7px] tracking-[-2px] md:tracking-[-3px] lg:tracking-[-4.47px] leading-[45px] md:leading-[75px] lg:leading-[118.4px] whitespace-nowrap text-center">
                ABOUT US
              </div>

              <img
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[250px] md:w-[400px] lg:w-[594px] h-2 md:h-3 lg:h-4"
                alt="Decore"
                src="/decore.png"
              />
            </div>
          </div>
        </div>

        <AboutUsSection />

        <InfoCardsSection />

        <div className="relative w-full flex justify-center pt-16 md:pt-24 lg:pt-[100px] px-4 md:px-8">
          <div className="w-full max-w-[320px] md:max-w-[500px] lg:max-w-[645px] h-auto relative">
            <div className="[font-family:'Wendy_One',Helvetica] font-normal text-[#181e4b] text-[40px] md:text-[70px] lg:text-[111.7px] tracking-[-2px] md:tracking-[-3px] lg:tracking-[-4.47px] leading-[45px] md:leading-[75px] lg:leading-[118.4px] whitespace-nowrap text-center">
              CONTACT US
            </div>

            <img
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[250px] md:w-[400px] lg:w-[594px] h-2 md:h-3 lg:h-4"
              alt="Decore"
              src="/decore-1.png"
            />
          </div>
        </div>

        <ContactUsSection />

        <FooterSection />

 
      </div>
    </>
  );
};
