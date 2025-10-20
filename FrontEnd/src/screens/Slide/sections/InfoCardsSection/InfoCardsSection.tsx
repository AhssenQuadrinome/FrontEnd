import React from "react";
import { Card, CardContent } from "../../../../components/ui/card";

const teamMembers = [
  {
    name: "Hiba ELOUERKHAOUI",
    description:
      "A well-rounded software engineer with a solid theoretical foundation in nearly every domain. Her unique mix of calmness and efficiency brings harmony to the team — she’s the balance that keeps everything running smoothly. (Empathy)",
    linkedin: "https://www.linkedin.com/in/hiba-el-ouerkhaoui-2b723429a/"
  },
  {
    name: "Abderrahmane ESSAHIH",
    description:
      "In a single word: DevSecOps. He embodies the essence of infrastructure engineering — reliable, security-focused, and always ready to get his hands dirty in the depths of systems and pipelines. (Logic)",
    linkedin: "https://www.linkedin.com/in/abderrahmane-essahih-263259298/"
  },
  {
    name: "ZAKARIA OUMGHAR",
    description:
      "The frontend lead and the aesthetic perfectionist of the group — he’d rather spend hours aligning a single div than debugging a Java file. Beyond his code, he’s the team’s atmosphere setter, the one who keeps spirits high and the vibe cool. (Frost)",
    linkedin: "https://www.linkedin.com/in/zakaria-oumghar-gl/"
  },
  {
    name: "Meryem ELFADILI",
    description:
      "When it comes to microservices and Spring Boot, she’s the go-to expert. She has all the traits of a natural leader — sharp, diligent, and insightful — though her modesty keeps her power quietly radiant. (Temper)",
    linkedin: "https://www.linkedin.com/in/meryem-elfadili/"
  },
];

export const InfoCardsSection = (): JSX.Element => {
  return (
    <section className="flex w-full items-center justify-center px-4 md:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8 lg:gap-10 max-w-[2060px] mx-auto">
        {teamMembers.map((member, index) => (
          <Card
            key={index}
            className="relative w-full max-w-[398px] h-[340px] md:h-[380px] lg:h-[420px] bg-[#A74338] border-0 mx-auto"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 90%, 0 100%)",
              transform: "skewY(-6deg)"
            }}
          >
            <div className="flex flex-col justify-between h-full p-8">
              <div>
                <h3 className="[font-family:'Inter',Helvetica] font-bold text-white text-lg md:text-xl lg:text-[23px] tracking-[-0.46px] leading-[normal] mb-2">
                  {member.name}
                </h3>
                <p className="[font-family:'Happy_Monkey',Helvetica] font-normal text-white text-sm md:text-base lg:text-[17px] tracking-[-0.34px] leading-[21.2px] mb-6">
                  {member.description}
                </p>
              </div>
              <div className="flex items-end justify-end">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-[#A74338] font-bold px-4 py-2 rounded-lg shadow-2xl hover:bg-[#f5f5f5] transition-transform duration-300"
                  style={{ transform: "skewY(6deg) translateY(-18px)" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 10.268h-3v-4.604c0-1.099-.021-2.513-1.532-2.513-1.532 0-1.767 1.197-1.767 2.435v4.682h-3v-9h2.881v1.233h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.597 2.001 3.597 4.601v4.729z"/>
                  </svg>
                  LinkedIn
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
