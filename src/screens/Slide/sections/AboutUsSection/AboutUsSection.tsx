import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const statsData = [
  { label: "3+", subtitle: "Years Experience" },
  { label: "70+", subtitle: "Cities" },
  { label: "50k+", subtitle: "Bookings" },
  { label: "1k+", subtitle: "Subscribers" },
];

const features = [
  { 
    title: "Real-Time Tracking", 
    desc: "Track your bus in real-time",
    iconPath: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
    bgColor: "from-[#BB5245] to-[#9a4339]"
  },
  { 
    title: "Easy Booking", 
    desc: "Book tickets with one tap",
    iconPath: "M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z",
    bgColor: "from-[#BB5245] to-[#9a4339]"
  },
  { 
    title: "Secure Payment", 
    desc: "Safe and encrypted transactions",
    iconPath: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z",
    bgColor: "from-[#BB5245] to-[#9a4339]"
  },
  { 
    title: "Mobile First", 
    desc: "Optimized for all devices",
    iconPath: "M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z",
    bgColor: "from-[#BB5245] to-[#9a4339]"
  },
];

export const AboutUsSection = (): JSX.Element => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation with split text effect
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
          opacity: 0,
          y: 50,
          scale: 0.9,
        });
      }

      // Subtitle animation
      if (subtitleRef.current) {
        gsap.from(subtitleRef.current, {
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: "top 80%",
          },
          opacity: 0,
          y: 30,
          duration: 1,
          delay: 0.3,
        });
      }

      // Content card animation with 3D effect
      if (contentRef.current) {
        // Set initial state
        gsap.set(contentRef.current, { opacity: 1, y: 0 });
        
        gsap.from(contentRef.current, {
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power2.out",
        });
      }

      // Stats counter animation
      if (statsRef.current) {
        const statCards = statsRef.current.querySelectorAll(".stat-card");
        
        // Set initial state
        gsap.set(statCards, { opacity: 1, y: 0, scale: 1 });
        
        statCards.forEach((card, index) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none none",
            },
            opacity: 0,
            y: 30,
            scale: 0.95,
            duration: 0.5,
            delay: index * 0.1,
            ease: "power2.out",
          });

          // Number counter animation
          const numberElement = card.querySelector(".stat-number");
          if (numberElement) {
            const finalValue = numberElement.textContent || "0";
            gsap.from(numberElement, {
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
              },
              textContent: 0,
              duration: 2,
              delay: index * 0.1 + 0.5,
              snap: { textContent: 1 },
              onUpdate: function () {
                if (this.targets()[0]) {
                  this.targets()[0].textContent = Math.ceil(
                    parseFloat(this.targets()[0].textContent as string)
                  ).toString() + finalValue.replace(/[0-9]/g, "");
                }
              },
            });
          }
        });
      }

      // Features animation with stagger
      if (featuresRef.current) {
        const featureCards = featuresRef.current.querySelectorAll(".feature-card");
        
        // Set initial state
        gsap.set(featureCards, { opacity: 1, y: 0 });
        
        gsap.from(featureCards, {
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 30,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
        });
      }

      // Floating animation for decorative element
      if (floatingRef.current) {
        gsap.to(floatingRef.current, {
          y: -20,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full relative px-4 md:px-8 py-16 md:py-24 overflow-hidden"
    >
      {/* Decorative floating circles */}
      <div
        ref={floatingRef}
        className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-[#BB5245]/20 to-transparent rounded-full blur-3xl pointer-events-none"
      />
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">


        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
          {/* Content Card */}
          <div
            ref={contentRef}
            className="relative group"
            style={{ perspective: "1000px" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#BB5245]/20 to-blue-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/50 hover:shadow-[#BB5245]/10 hover:shadow-3xl transition-all duration-500">
              <div className="absolute top-0 left-0 w-20 h-20 bg-[#BB5245]/10 rounded-br-full" />
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#BB5245]/10 rounded-tl-full" />
              
              <div className="relative z-10">
                <div className="w-16 h-1 bg-gradient-to-r from-[#BB5245] to-[#d6614f] rounded-full mb-6" />
                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                  We are a team of passionate <span className="text-[#BB5245] font-semibold">software engineering students</span> dedicated 
                  to modernizing urban transport management through a microservices-based architecture. 
                  Our project aims to simplify bus operations and enhance passenger experience by providing 
                  an intuitive platform for <span className="text-[#BB5245] font-semibold">viewing schedules, purchasing tickets, tracking buses 
                  in real-time</span>, and managing subscriptions. Built with scalability and reliability in mind, 
                  the system integrates secure authentication, independent services, and cloud deployment — 
                  combining <span className="text-[#BB5245] font-semibold">cutting-edge technologies</span> with a clean, user-focused design.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div ref={statsRef} className="grid grid-cols-2 gap-4 md:gap-6">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="stat-card group relative bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-white/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#BB5245]/0 to-[#BB5245]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#BB5245]/5 rounded-bl-full transform translate-x-8 -translate-y-8 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
                
                <div className="relative z-10">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-[#BB5245] to-[#d6614f] bg-clip-text text-transparent mb-2 stat-number">
                    {stat.label}
                  </div>
                  <div className="text-sm md:text-base text-gray-600 font-medium">
                    {stat.subtitle}
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#BB5245] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card group relative bg-white backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl border-2 border-white/80 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              {/* Vibrant gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              {/* Icon circle with gradient */}
              <div className="relative z-10 p-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.bgColor} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <svg 
                    className="w-8 h-8 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d={feature.iconPath} />
                  </svg>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#BB5245] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
              
              {/* Accent line with matching gradient */}
              <div className={`h-1 bg-gradient-to-r ${feature.bgColor} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              
              {/* Corner decoration */}
              <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${feature.bgColor} opacity-5 rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
