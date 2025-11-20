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
            <div className="w-full max-w-[280px] md:max-w-[400px] lg:max-w-[500px] h-auto relative">
              <div className="[font-family:'Wendy_One',Helvetica] font-normal text-[#181e4b] text-[36px] md:text-[56px] lg:text-[80px] tracking-[-1.5px] md:tracking-[-2.5px] lg:tracking-[-3.5px] leading-[40px] md:leading-[60px] lg:leading-[84px] whitespace-nowrap text-center">
                ABOUT US
              </div>

              <img
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[220px] md:w-[350px] lg:w-[480px] h-1.5 md:h-2.5 lg:h-3"
                alt="Decore"
                src="/decore.png"
              />
            </div>
          </div>
        </div>

        <AboutUsSection />

        <InfoCardsSection />

        <div className="relative w-full flex justify-center pt-16 md:pt-24 lg:pt-[100px] px-4 md:px-8">
          <div className="w-full max-w-[300px] md:max-w-[450px] lg:max-w-[550px] h-auto relative">
            <div className="[font-family:'Wendy_One',Helvetica] font-normal text-[#181e4b] text-[36px] md:text-[56px] lg:text-[80px] tracking-[-1.5px] md:tracking-[-2.5px] lg:tracking-[-3.5px] leading-[40px] md:leading-[60px] lg:leading-[84px] whitespace-nowrap text-center">
              CONTACT US
            </div>

            <img
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[220px] md:w-[350px] lg:w-[480px] h-1.5 md:h-2.5 lg:h-3"
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
