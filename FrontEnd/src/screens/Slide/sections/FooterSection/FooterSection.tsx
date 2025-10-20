import React from "react";

const linkItems = [
  { text: "Home" },
  { text: "Booking" },
  { text: "About" },
  { text: "Contact" },
];

const teamMembers = [
  { name: "Hiba EL OUERKHAOUI" },
  { name: "Abderrahmane ESSAHIH" },
  { name: "Zakaria OUMGHAR" },
  { name: "Meryem ELFADILI" },
];

export const FooterSection = (): JSX.Element => {
  return (
    <footer className="relative w-full bg-[#df695126] py-[38px] px-[66px]">
      <div className="flex items-start gap-8 max-w-[1840px] mx-auto">
        <div className="flex items-center justify-center gap-4 flex-1">
          <div className="flex-1 [font-family:'Staatliches',Helvetica] font-normal text-[#a54033] text-[40px] tracking-[0] leading-6">
            MY BUS WAY
          </div>
        </div>

        <div className="flex items-start gap-8 flex-1">
          <div className="flex flex-col items-start gap-[26px] flex-1">
            <div className="self-stretch [font-family:'Inter',Helvetica] font-normal text-[#a54033] text-xl tracking-[0] leading-5">
              Links
            </div>

            <div className="flex flex-col items-start gap-6 self-stretch w-full">
              {linkItems.map((item, index) => (
                <div
                  key={index}
                  className="self-stretch [font-family:'Inter',Helvetica] font-normal text-[#212421] text-base tracking-[0] leading-4 cursor-pointer hover:text-[#a54033] transition-colors"
                >
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start gap-[26px] flex-1">
            <div className="self-stretch [font-family:'Inter',Helvetica] font-normal text-[#a54033] text-xl tracking-[0] leading-5">
              AHSSEN QUADRINOME
            </div>

            <div className="flex flex-col items-start gap-6 self-stretch w-full">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="self-stretch [font-family:'Inter',Helvetica] font-normal text-[#212421] text-base tracking-[0] leading-4"
                >
                  {member.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-8 mt-[201px]">
        <div className="w-fit [font-family:'Inter',Helvetica] font-normal text-black text-sm tracking-[0] leading-[14px] whitespace-nowrap">
          @2025 All right reserved to Ahssen Quadrinome
        </div>
      </div>

      <img
        className="absolute top-0 left-0 w-[826px] h-[314px] object-cover pointer-events-none"
        alt="Chatgpt image oct"
        src="/chatgpt-image-17-oct--2025--17-41-18-2.png"
      />
    </footer>
  );
};
