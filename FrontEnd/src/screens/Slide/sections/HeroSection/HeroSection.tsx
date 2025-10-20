import { ChevronDownIcon, MenuIcon, XIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";

const navigationItems = [
  { label: "HOME", id: "home" },
  { label: "ABOUT", id: "about" },
  { label: "CONTACT", id: "contact" },
];

export const HeroSection = (): JSX.Element => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>(navigationItems[0].id);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const headerOffset = 100;
    const onSpy = () => {
      let current = navigationItems[0].id;
      for (const item of navigationItems) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top - headerOffset <= 0) {
          current = item.id;
        }
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", onSpy, { passive: true });
    onSpy();
    return () => window.removeEventListener("scroll", onSpy);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const headerOffset = 90; // adjust if header height changes
    const bodyRect = document.body.getBoundingClientRect().top;
    const elemRect = el.getBoundingClientRect().top;
    const offsetPosition = elemRect - bodyRect - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    setActiveId(id);
  };

  return (
    <header className={
      `flex items-center justify-between gap-4 px-4 md:px-8 py-6 w-full relative z-[100] transition-colors duration-300 ` +
      ((isScrolled || mobileMenuOpen)
        ? "bg-[rgba(255,255,255,0.06)] backdrop-blur-lg backdrop-saturate-125 border border-[rgba(255,255,255,0.08)] shadow-sm"
        : "bg-transparent")
    }>
       <img
          className="absolute top-[18px] left-8 md:left-16 lg:left-[146px] w-[90px] md:w-[90px] lg:w-[100px] h-auto object-cover"
          alt="Chatgpt image oct"
          src="/chatgpt-image-17-oct--2025--17-41-18-2.png"
        />

      <nav className="hidden lg:flex items-center gap-6 xl:gap-12 flex-1 justify-center bg-transparent">
        {navigationItems.map((item) => (
          <Button
            key={item.label}
            variant={item.id === activeId ? "default" : "outline"}
            onClick={() => scrollToSection(item.id)}
            className={`h-auto rounded-full px-5 xl:px-7 py-2 ${
              item.id === activeId
                ? "bg-[#a54033] hover:bg-[#a54033]/90 text-white border-none"
                : "border-[#a54033] text-[#a54033] bg-transparent hover:bg-[#a54033]/10"
            }`}
          >
            <span className="[font-family:'Inter',Helvetica] font-bold text-xs tracking-[0] leading-normal">
              {item.label}
            </span>
          </Button>
        ))}
      </nav>

      <div className="hidden lg:flex items-center gap-3 xl:gap-6 flex-shrink-0">
        <Button
          variant="ghost"
          className="h-auto p-0 hover:bg-transparent [-webkit-text-stroke:1.33px_#df6951] [font-family:'Poppins',Helvetica] font-medium text-[#f5b75c] text-base xl:text-[22.6px] tracking-[0] leading-normal"
        >
          Login
        </Button>

        <Button
          variant="outline"
          className="h-auto rounded-[6.65px] border-[1.33px] border-[#df6951] px-4 xl:px-6 py-2 xl:py-3 bg-transparent hover:bg-[#df6951]/10 [-webkit-text-stroke:1.33px_#df6951] [font-family:'Poppins',Helvetica] font-medium text-[#f5b75c] text-base xl:text-[22.6px] tracking-[0] leading-normal"
        >
          Sign up
        </Button>

        <Button
          variant="ghost"
          className="h-auto p-0 hover:bg-transparent flex items-center gap-2.5"
        >
          <span className="[font-family:'Poppins',Helvetica] font-medium text-x-1st text-base xl:text-[22.6px] tracking-[0] leading-normal">
            EN
          </span>
          <ChevronDownIcon className="w-[13px] h-[7px]" />
        </Button>
      </div>

      <Button
        variant="ghost"
        className="lg:hidden h-auto p-2 hover:bg-transparent"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <XIcon className="w-6 h-6 text-[#a54033]" />
        ) : (
          <MenuIcon className="w-6 h-6 text-[#a54033]" />
        )}
      </Button>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg p-6 lg:hidden z-50">
          <nav className="flex flex-col gap-4 mb-6">
            {navigationItems.map((item) => (
              <Button
                key={item.label}
                variant={item.id === activeId ? "default" : "outline"}
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollToSection(item.id);
                }}
                className={`h-auto rounded-full px-7 py-2 w-full ${
                  item.id === activeId
                    ? "bg-[#a54033] hover:bg-[#a54033]/90 text-white border-none"
                    : "border-[#a54033] text-[#a54033] bg-transparent hover:bg-[#a54033]/10"
                }`}
              >
                <span className="[font-family:'Inter',Helvetica] font-bold text-xs tracking-[0] leading-normal">
                  {item.label}
                </span>
              </Button>
            ))}
          </nav>
          <div className="flex flex-col gap-4">
            <Button
              variant="ghost"
              className="h-auto py-2 hover:bg-transparent [-webkit-text-stroke:1.33px_#df6951] [font-family:'Poppins',Helvetica] font-medium text-[#f5b75c] text-lg tracking-[0] leading-normal"
            >
              Login
            </Button>
            <Button
              variant="outline"
              className="h-auto rounded-[6.65px] border-[1.33px] border-[#df6951] px-6 py-3 bg-transparent hover:bg-[#df6951]/10 [-webkit-text-stroke:1.33px_#df6951] [font-family:'Poppins',Helvetica] font-medium text-[#f5b75c] text-lg tracking-[0] leading-normal"
            >
              Sign up
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
