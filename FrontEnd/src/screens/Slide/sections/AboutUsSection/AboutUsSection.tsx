import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

const statsData = [
  { label: "+3 YEARS" },
  { label: "+70 City" },
  { label: "+50k bookings" },
  { label: "1k+ Sub" },
];

export const AboutUsSection = (): JSX.Element => {
  return (
    <section className="w-full relative px-4 md:px-8 py-8 mt-10 ">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 max-w-7xl mx-auto">
        <Card className="bg-[#00000000] rounded-[30px] border-0 backdrop-blur-[2.0px] backdrop-brightness-[110%] [-webkit-backdrop-filter:blur(2.0px)_brightness(110%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] max-w-3xl">
          <CardContent className="p-0 max-w-3xl">
            <div className="bg-[#00000000] rounded-[30px] backdrop-blur-[2.0px] backdrop-brightness-[110%] [-webkit-backdrop-filter:blur(2.0px)_brightness(110%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] ">
              <div className="bg-[#df695126] rounded-[30px] p-9">
                <p className="[font-family:'Inter',Helvetica] font-bold text-[#5a1608] text-base md:text-lg lg:text-[22px] tracking-[0] leading-[normal]">
                  We are a team of passionate software engineering students
                  dedicated to modernizing urban transport management through a
                  microservices-based architecture. Our project aims to simplify
                  bus operations and enhance passenger experience by providing
                  an intuitive platform for viewing schedules, purchasing
                  tickets, tracking buses in real time, and managing
                  subscriptions. Built with scalability and reliability in mind,
                  the system integrates secure authentication, independent
                  services, and cloud deployment — combining cutting-edge
                  technologies with a clean, user-focused design.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 lg:gap-6 w-full lg:w-auto">
          {statsData.map((stat, index) => (
            <Card
              key={index}
              className="bg-[#00000000] rounded-[30px] border border-solid border-[#ffffff] backdrop-blur-[2.0px] backdrop-brightness-[110%] [-webkit-backdrop-filter:blur(2.0px)_brightness(110%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] h-[fit-content] w-full "
            >
              <CardContent className="p-0">
                <div className="bg-[#df695126] rounded-[30px] p-2 flex items-center justify-center min-h-[123px]">
                  <div className="flex items-center justify-center">
                    <div className="w-full max-w-[210px] h-12 md:h-14 bg-[#df6951] rounded-[14.5px] flex items-center justify-center px-2">
                      <span className="[font-family:'Inter',Helvetica] font-bold text-[#ffffff] text-sm md:text-lg lg:text-[22px] text-center tracking-[0] leading-[normal]">
                        {stat.label}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
