import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const teamMembers = [
  {
    name: "Hiba ELOUERKHAOUI",
    role: "Software Engineer",
    number: "01",
    position: "Full Stack",
    trait: "Empathy",
    stats: {
      teamwork: 99,
      creativity: 95,
      problemSolving: 92,
      leadership: 88,
    },
    description: "The balance keeper who brings harmony",
    linkedin: "https://www.linkedin.com/in/hiba-el-ouerkhaoui-2b723429a/",
    avatar: "HE",
  },
  {
    name: "Abderrahmane ESSAHIH",
    role: "DevSecOps Engineer",
    number: "02",
    position: "Infrastructure",
    trait: "Logic",
    stats: {
      security: 98,
      infrastructure: 96,
      automation: 94,
      monitoring: 92,
    },
    description: "The fortress builder securing our digital realm",
    linkedin: "https://www.linkedin.com/in/abderrahmane-essahih-263259298/",
    avatar: "AE",
  },
  {
    name: "ZAKARIA OUMGHAR",
    role: "Frontend Lead",
    number: "03",
    position: "UI/UX Master",
    trait: "Frost",
    stats: {
      design: 99,
      frontend: 97,
      userExp: 95,
      innovation: 93,
    },
    description: "The pixel perfectionist crafting digital experiences",
    linkedin: "https://www.linkedin.com/in/zakaria-oumghar-gl/",
    avatar: "ZO",
  },
  {
    name: "Meryem ELFADILI",
    role: "Backend Architect",
    number: "04",
    position: "Microservices",
    trait: "Temper",
    stats: {
      architecture: 98,
      backend: 96,
      scalability: 94,
      performance: 92,
    },
    description: "The architect designing scalable digital highways",
    linkedin: "https://www.linkedin.com/in/meryem-elfadili/",
    avatar: "ME",
  },
];

export const InfoCardsSection = (): JSX.Element => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      if (titleRef.current) {
        gsap.from(titleRef.current.children, {
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
          },
          opacity: 0,
          y: 30,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out",
        });
      }

      // Cards animation - simple fade in
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".team-card");
        
        cards.forEach((card, index) => {
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
            },
            opacity: 0,
            y: 40,
            duration: 0.7,
            delay: index * 0.1,
            ease: "power2.out",
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full px-4 md:px-8 py-16 md:py-24 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#BB5245]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Section Header */}
      <div ref={titleRef} className="text-center mb-16 md:mb-20 relative z-10">
        <div className="inline-block mb-4">
          <span className="text-sm md:text-base font-semibold text-[#BB5245] bg-[#BB5245]/10 px-6 py-2 rounded-full border border-[#BB5245]/20">
            Meet The Team
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-800 via-[#BB5245] to-gray-800 bg-clip-text text-transparent">
          The Minds Behind Innovation
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
          A diverse team of passionate engineers building the future of urban transport
        </p>
      </div>

      {/* Team Cards Grid - Sports Card Style */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 max-w-[1400px] mx-auto relative z-10"
      >
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="team-card group relative"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Sports Card */}
            <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1e] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#BB5245] transition-all duration-300 group-hover:shadow-[#BB5245]/50 group-hover:shadow-3xl group-hover:-translate-y-2">
              
              {/* Top Header with Number */}
              <div className="relative bg-[#BB5245] p-4 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="text-white/70 text-xs font-bold uppercase tracking-wider">OurBusWay</div>
                    <div className="text-white text-sm font-bold mt-1">{member.position}</div>
                  </div>
                  <div className="text-6xl font-black text-white/20">{member.number}</div>
                </div>
              </div>

              {/* Avatar Section */}
              <div className="relative bg-white p-6">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                <div className="relative flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#BB5245] to-[#8a3d32] flex items-center justify-center shadow-xl border-4 border-white group-hover:scale-110 transition-transform duration-300">
                    <span className="text-6xl text-white" style={{ fontFamily: "'Dancing Script', 'Great Vibes', 'Allura', 'Alex Brush', cursive", fontWeight: 600 }}>{member.avatar}</span>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-3 h-3 bg-[#BB5245] rounded-full" />
                <div className="absolute top-4 right-4 w-3 h-3 bg-[#BB5245] rounded-full" />
                <div className="absolute bottom-4 left-4 w-3 h-3 bg-[#BB5245] rounded-full" />
                <div className="absolute bottom-4 right-4 w-3 h-3 bg-[#BB5245] rounded-full" />
              </div>

              {/* Player Name Bar */}
              <div className="bg-[#BB5245] px-4 py-3 text-center">
                <h3 className="text-white font-black text-lg uppercase tracking-wide">
                  {member.name.split(' ').map((part, i) => (
                    <span key={i} className={i === member.name.split(' ').length - 1 ? "block text-xl" : "block text-xs"}>
                      {part}
                    </span>
                  ))}
                </h3>
              </div>

              {/* Stats Section */}
              <div className="bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1e] p-6">
                <div className="text-white/50 text-xs font-bold uppercase tracking-wider mb-3 text-center">
                  Developer Stats
                </div>
                
                <div className="space-y-2">
                  {Object.entries(member.stats).map(([key, value], idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-white/70 text-xs uppercase tracking-wide font-semibold">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#BB5245] to-[#ff6b5a] rounded-full transition-all duration-1000"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                        <span className="text-[#BB5245] text-sm font-black min-w-[2rem] text-right">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Rating Stars */}
                <div className="flex items-center justify-center gap-1 mt-4 pt-4 border-t border-white/10">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[#BB5245] fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* Description */}
                <p className="text-white/60 text-xs text-center mt-3 italic">
                  "{member.description}"
                </p>
              </div>

              {/* Bottom Action Bar */}
              <div className="bg-[#BB5245] p-3">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white text-[#BB5245] font-bold px-4 py-2 rounded-lg hover:bg-gray-100 transition-all duration-300 group/btn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 10.268h-3v-4.604c0-1.099-.021-2.513-1.532-2.513-1.532 0-1.767 1.197-1.767 2.435v4.682h-3v-9h2.881v1.233h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.597 2.001 3.597 4.601v4.729z" />
                  </svg>
                  <span className="uppercase text-sm tracking-wider">Connect</span>
                  <svg
                    className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Decorative Text */}
      <div className="text-center mt-16 relative z-10">
        <p className="text-gray-500 text-sm md:text-base italic">
          "Alone we can do so little; together we can do so much." - Helen Keller
        </p>
      </div>
    </section>
  );
};
