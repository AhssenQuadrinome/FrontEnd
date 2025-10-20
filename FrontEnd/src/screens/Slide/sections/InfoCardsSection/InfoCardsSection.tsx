import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

const teamMembers = [
  {
    name: "Hiba ELOUERKHAOUI",
    description:
      "A versatile software engineer whose calm precision and strong theoretical grounding bring balance to the entire team.",
    icon: "/group-126669.png",
    iconClasses: "w-[23.49%] h-[23.12%] top-[74.38%] left-[7.94%]",
  },
  {
    name: "Abderrahmane ESSAHIH",
    description:
      "The embodiment of DevSecOps, blending security, infrastructure, and reliability into the backbone of our workflow.",
    icon: "/arrow.png",
    iconClasses: "w-[18.59%] h-[12.46%] top-[86.20%] left-[16.58%]",
  },
  {
    name: "ZAKARIA OUMGHAR",
    description:
      "The frontend lead obsessed with perfect layouts, often found arguing with Meryem about whether the API or the CSS is to blame.",
    icon: "/arrow-1.png",
    iconClasses: "w-[18.55%] h-[12.46%] top-[86.20%] left-[16.82%]",
  },
  {
    name: "Meryem ELFADILI",
    description:
      "The Spring Boot and microservices expert who always wins half the arguments with Zakaria — mostly because her backend actually works.",
    icon: "/arrow-2.png",
    iconClasses: "w-[18.55%] h-[12.46%] top-[86.20%] left-[16.82%]",
  },
];

export const InfoCardsSection = (): JSX.Element => {
  return (
    <section className="flex w-full items-center justify-center px-4 md:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10 max-w-[2060px] mx-auto">
        {teamMembers.map((member, index) => (
          <Card
            key={index}
            className="relative w-full max-w-[398px] h-[500px] md:h-[550px] lg:h-[594px] bg-transparent border-0 mx-auto"
          >
            <CardContent className="relative w-[79.15%] h-[53.87%] top-[46.13%] left-[10.30%] bg-[url(/rectangle-1586.svg)] bg-[100%_100%] p-0">
              <img
                className={`absolute ${member.iconClasses}`}
                alt={`${member.name} icon`}
                src={member.icon}
              />

              <div className="flex flex-col w-[84.76%] items-start gap-2 absolute h-[52.81%] top-[23.59%] left-[7.62%]">
                <h3 className="relative flex items-center justify-center w-fit mt-[-1.00px] [font-family:'Inter',Helvetica] font-bold text-[#ffffff] text-lg md:text-xl lg:text-[23px] tracking-[-0.46px] leading-[normal]">
                  {member.name}
                </h3>

                <p className="relative w-full max-w-[269px] [font-family:'Happy_Monkey',Helvetica] font-normal text-[#ffffff] text-sm md:text-base lg:text-[17px] tracking-[-0.34px] leading-[21.2px]">
                  {member.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
