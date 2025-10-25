import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Textarea } from "../../../../components/ui/textarea";
export function ContactUsSection(): JSX.Element {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [focus, setFocus] = useState({ name: false, email: false, content: false });
  return (
    <section id="contact" className="relative w-full px-4 md:px-8 py-12">
      <div className="relative w-full max-w-7xl mx-auto rounded-[30px] border-2 border-solid border-[#00000030] shadow-2xl bg-gradient-to-br from-[#fff8d4] to-[#fbeee6] overflow-visible">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 relative z-10 min-h-[520px]">
          {/* Left: Black Form Section */}
          <div className="flex flex-col justify-center p-6 md:p-10 lg:p-14 bg-[#232323] rounded-l-[30px] min-h-[420px]">
            <h2 className="[font-family:'Poppins',Helvetica] font-semibold text-white text-3xl md:text-4xl lg:text-[44px] tracking-[0] leading-[normal] mb-7">
              GET IN TOUCH
            </h2>
            <form className="flex flex-col gap-7">
              <div className="relative mt-2">
                <Input
                  id="name"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  onFocus={() => setFocus(f => ({ ...f, name: true }))}
                  onBlur={() => setFocus(f => ({ ...f, name: false }))}
                  className="bg-transparent border-0 border-b-2 border-[#fff8d4] rounded-none pt-6 pb-2 px-2 text-white [font-family:'Poppins',Helvetica] focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-transparent"
                  placeholder=" "
                />
                <Label
                  htmlFor="name"
                  className={`absolute left-2 text-[#fff8d4] text-base font-medium transition-all duration-200 [font-family:'Poppins',Helvetica] pointer-events-none ${focus.name || name ? '-top-4 text-sm text-[#fff8d4]' : 'top-1 text-base text-[#888]'}`}
                >
                  Name
                </Label>
              </div>
              <div className="relative mt-2">
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocus(f => ({ ...f, email: true }))}
                  onBlur={() => setFocus(f => ({ ...f, email: false }))}
                  className="bg-transparent border-0 border-b-2 border-[#fff8d4] rounded-none pt-6 pb-2 px-2 text-white [font-family:'Poppins',Helvetica] focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-transparent"
                  placeholder=" "
                />
                    <Label
                      htmlFor="email"
                      className={`absolute left-2 text-[#fff8d4] text-base font-medium transition-all duration-200 [font-family:'Poppins',Helvetica] pointer-events-none ${focus.email || email ? '-top-4 text-sm text-[#fff8d4]' : 'top-1 text-base text-[#888]'}`}
                    >
                  Email
                </Label>
              </div>
              <div className="relative mt-2">
                <Textarea
                  id="content"
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  onFocus={() => setFocus(f => ({ ...f, content: true }))}
                  onBlur={() => setFocus(f => ({ ...f, content: false }))}
                  className="bg-transparent border-0 border-b-2 border-[#fff8d4] rounded-none pt-6 pb-2 px-2 min-h-[120px] text-white [font-family:'Poppins',Helvetica] resize-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder-transparent"
                  placeholder=" "
                />
                    <Label
                      htmlFor="content"
                      className={`absolute left-2 text-[#fff8d4] text-base font-medium transition-all duration-200 [font-family:'Poppins',Helvetica] pointer-events-none ${focus.content || content ? '-top-4 text-sm text-[#fff8d4]' : 'top-1 text-base text-[#888]'}`}
                    >
                  Content
                </Label>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Checkbox
                  id="newsletter"
                  className="border-[#fff8d4] data-[state=checked]:bg-[#fff8d4] data-[state=checked]:text-[#232323]"
                />
                <Label
                  htmlFor="newsletter"
                  className="[font-family:'Poppins',Helvetica] font-normal text-[#fff8d4] text-xs tracking-[0] leading-[normal] cursor-pointer"
                >
                  I would like to receive the newsletter.
                </Label>
              </div>
              <div className="relative w-fit mt-4">
                <Button
                  type="submit"
                  className="w-[120px] h-[44px] bg-[#de6e4b] hover:bg-[#a74338] text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-200 [font-family:'Poppins',Helvetica]"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
          {/* Right: Map Section fills the card */}
          <div className="relative flex items-center justify-center p-0 bg-[#fff8d4] rounded-r-[30px] overflow-hidden min-h-[420px]">
            <img
              className="absolute inset-0 w-full h-full object-cover object-center"
              alt="Maps"
              src="/maps.png"
            />
            {/* Bus icons on map */}
            <img
              className="absolute top-[35%] left-[36%] w-[48px] h-[32px] object-cover drop-shadow-xl"
              alt="Bus icon"
              src="/chatgpt-image-18-oct--2025--12-23-46-4.png"
            />
            <img
              className="absolute top-[67%] left-[63%] w-[44px] h-[28px] object-cover drop-shadow-xl"
              alt="Bus icon"
              src="/chatgpt-image-18-oct--2025--12-23-46-4.png"
            />
            <img
              className="absolute top-[13%] left-[79%] w-[44px] h-[28px] object-cover drop-shadow-xl"
              alt="Bus icon"
              src="/chatgpt-image-18-oct--2025--12-23-46-4.png"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
