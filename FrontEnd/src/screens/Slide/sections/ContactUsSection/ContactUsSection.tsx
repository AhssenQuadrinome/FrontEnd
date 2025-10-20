import React from "react";
import { Button } from "../../../../components/ui/button";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";

export const ContactUsSection = (): JSX.Element => {
  return (
    <section className="relative w-full px-4 md:px-8 py-8">
      <div className="relative w-full max-w-7xl mx-auto bg-[#fff8d4] rounded-[30px] overflow-hidden border-2 border-solid border-[#00000040] shadow-[0px_8px_10px_#de6e4b40]">
        <div className="absolute -top-36 left-[-122px] w-[1200px] h-[853px] pointer-events-none hidden lg:block">
          <div className="absolute top-0 left-0 w-[613px] h-[811px] bg-app-background" />
          <div className="absolute top-[230px] left-[168px] w-[107px] h-[5px] bg-primary-color" />
          <div className="absolute top-[745px] left-[1077px] w-[123px] h-[108px] bg-primary-color rounded-[61.33px/53.93px]" />
          <div className="absolute top-[718px] left-[1076px] w-[63px] h-[54px] bg-[#de6e4b66] rounded-[31.74px/26.77px]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
          <div className="p-6 md:p-8 lg:p-10 flex flex-col">
            <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-[#ffffff] text-3xl md:text-4xl lg:text-[52px] tracking-[0] leading-[normal] mb-7">
              GET IN TOUCH
            </h2>

            <form className="flex flex-col gap-7">
              <div className="relative">
                <Label
                  htmlFor="name"
                  className="absolute top-0 left-2 [font-family:'Poppins',Helvetica] font-normal text-[#ffffff] text-base tracking-[0] leading-[normal]"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  className="bg-app-background border-0 border-b border-solid border-[#ffffff] rounded-none pt-8 pb-2 px-2 text-[#ffffff] [font-family:'Poppins',Helvetica] focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="relative">
                <Label
                  htmlFor="email"
                  className="absolute top-0 left-2 [font-family:'Poppins',Helvetica] font-normal text-[#ffffff] text-base tracking-[0] leading-[normal]"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="bg-app-background border-0 border-b border-solid border-[#ffffff] rounded-none pt-8 pb-2 px-2 text-[#ffffff] [font-family:'Poppins',Helvetica] focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="relative">
                <Label
                  htmlFor="content"
                  className="absolute top-0 left-2 [font-family:'Poppins',Helvetica] font-normal text-[#ffffff] text-base tracking-[0] leading-[normal]"
                >
                  Content
                </Label>
                <Textarea
                  id="content"
                  className="bg-app-background border-0 border-b border-solid border-[#ffffff] rounded-none pt-8 pb-2 px-2 min-h-[150px] text-[#ffffff] [font-family:'Poppins',Helvetica] resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="newsletter"
                  className="border-[#ffffff] data-[state=checked]:bg-[#ffffff] data-[state=checked]:text-app-background"
                />
                <Label
                  htmlFor="newsletter"
                  className="[font-family:'Poppins',Helvetica] font-normal text-[#ffffff] text-xs tracking-[0] leading-[normal] cursor-pointer"
                >
                  I would like to receive the newsletter.
                </Label>
              </div>

              <div className="relative w-fit mt-2">
                <img
                  className="w-[109px] h-[37px]"
                  alt="Submit background"
                  src="/submit-background.svg"
                />
                <Button
                  type="submit"
                  className="absolute top-0 left-0 w-full h-full bg-transparent hover:bg-transparent border-0 [font-family:'Poppins',Helvetica] font-medium text-[#ffffff] text-xl tracking-[0] leading-[normal] h-auto"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>

          <div className="relative p-6 md:p-8 lg:p-10 flex items-center justify-center">
            <div className="relative">
              <img
                className="w-full max-w-[350px] md:max-w-[450px] lg:max-w-[510px] h-auto rounded-[22px] object-cover"
                alt="Maps"
                src="/maps.png"
              />
              <img
                className="absolute top-[35%] left-[36%] w-[63px] h-[42px] object-cover"
                alt="Chatgpt image oct"
                src="/chatgpt-image-18-oct--2025--12-23-46-4.png"
              />
              <img
                className="absolute top-[67%] left-[63%] w-[57px] h-[39px] object-cover"
                alt="Chatgpt image oct"
                src="/chatgpt-image-18-oct--2025--12-23-46-4.png"
              />
              <img
                className="absolute top-[13%] left-[79%] w-[57px] h-[39px] object-cover"
                alt="Chatgpt image oct"
                src="/chatgpt-image-18-oct--2025--12-23-46-4.png"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
