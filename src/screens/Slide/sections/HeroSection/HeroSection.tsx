import { ChevronDownIcon, MenuIcon, XIcon, Home, Users, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { Link } from "react-router-dom";

const navigationItems = [
  { label: "HOME", id: "home", icon: Home },
  { label: "ABOUT", id: "about", icon: Users },
  { label: "CONTACT", id: "contact", icon: Mail },
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
      `flex items-center justify-between gap-3 px-4 md:px-8 py-4 w-full relative z-[100] transition-all duration-500 ease-in-out ` +
      ((isScrolled || mobileMenuOpen)
        ? "bg-white/95 backdrop-blur-xl shadow-md border-b border-gray-100"
        : "bg-transparent")
    }>
       <img
          className="absolute top-[14px] left-8 md:left-16 lg:left-[146px] w-[70px] md:w-[75px] lg:w-[80px] h-auto object-cover transition-transform duration-300 hover:scale-105"
          alt="Chatgpt image oct"
          src="/chatgpt-image-17-oct--2025--17-41-18-2.png"
        />

      <nav className="hidden lg:flex items-center gap-3 xl:gap-5 flex-1 justify-center bg-transparent">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Button
              key={item.label}
              variant={item.id === activeId ? "default" : "ghost"}
              onClick={() => scrollToSection(item.id)}
              className={`h-auto rounded-full px-5 xl:px-6 py-2 text-xs transition-all duration-300 transform hover:scale-105 ${
                item.id === activeId
                  ? "bg-gradient-to-r from-[#df6951] to-[#a54033] hover:from-[#e07a67] hover:to-[#b64d40] text-white shadow-md shadow-[#df6951]/25 border-none"
                  : "text-[#a54033] bg-white/80 hover:bg-white hover:shadow-sm border border-gray-200"
              }`}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              <span className="[font-family:'Inter',Helvetica] font-bold tracking-wide leading-normal">
                {item.label}
              </span>
            </Button>
          );
        })}
      </nav>

      <div className="hidden lg:flex items-center gap-3 xl:gap-4 flex-shrink-0">
        <Link to="/login">
          <Button
            variant="ghost"
            className="h-auto px-4 py-1.5 text-sm rounded-full hover:bg-[#df6951]/10 transition-all duration-300 [font-family:'Poppins',Helvetica] font-semibold text-[#df6951] tracking-[0] leading-normal"
          >
            Login
          </Button>
        </Link>

        <Link to="/signup">
          <Button
            variant="outline"
            className="h-auto text-sm rounded-full border-2 border-[#df6951] px-5 xl:px-6 py-1.5 bg-gradient-to-r from-[#df6951] to-[#a54033] hover:from-[#e07a67] hover:to-[#b64d40] transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md [font-family:'Poppins',Helvetica] font-semibold text-white tracking-[0] leading-normal"
          >
            Sign up
          </Button>
        </Link>

        <Button
          variant="ghost"
          className="h-auto px-3 py-1.5 text-sm rounded-full hover:bg-gray-100 transition-all duration-300 flex items-center gap-1.5"
        >
          <span className="[font-family:'Poppins',Helvetica] font-medium text-gray-700 tracking-[0] leading-normal">
            EN
          </span>
          <ChevronDownIcon className="w-3.5 h-3.5 text-gray-600" />
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
        <div className="absolute top-full left-0 right-0 bg-white/98 backdrop-blur-xl shadow-xl p-5 lg:hidden z-50 border-b border-gray-100 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-2.5 mb-5">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Button
                  key={item.label}
                  variant={item.id === activeId ? "default" : "outline"}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollToSection(item.id);
                  }}
                  className={`h-auto rounded-lg px-5 py-2.5 w-full text-sm transition-all duration-300 ${
                    item.id === activeId
                      ? "bg-gradient-to-r from-[#df6951] to-[#a54033] text-white border-none shadow-sm"
                      : "border-2 border-gray-200 text-[#a54033] bg-white hover:bg-gray-50 hover:border-[#df6951]"
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  <span className="[font-family:'Inter',Helvetica] font-bold tracking-wide leading-normal">
                    {item.label}
                  </span>
                </Button>
              );
            })}
          </nav>
          <div className="flex flex-col gap-2.5 pt-3 border-t border-gray-200">
            <Link to="/login" className="w-full">
              <Button
                variant="ghost"
                className="h-auto w-full py-2.5 text-sm rounded-lg hover:bg-[#df6951]/10 transition-all duration-300 [font-family:'Poppins',Helvetica] font-semibold text-[#df6951] tracking-[0] leading-normal"
              >
                Login
              </Button>
            </Link>
            <Link to="/signup" className="w-full">
              <Button
                variant="outline"
                className="h-auto w-full text-sm rounded-lg border-2 border-[#df6951] px-5 py-2.5 bg-gradient-to-r from-[#df6951] to-[#a54033] hover:from-[#e07a67] hover:to-[#b64d40] transition-all duration-300 shadow-sm [font-family:'Poppins',Helvetica] font-semibold text-white tracking-[0] leading-normal"
              >
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
