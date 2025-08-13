import React from "react";

interface IGlowText {
  content: string;
  bgColor?: string;
  textColor?: string;
  fontSize?: string;
  fontWeight?: string;
  BlurSize?: string;
  ClassName?: string;
}
const GlowText: React.FC<IGlowText> = ({
  content,
  ClassName,
  bgColor = "bg-[#813cf0]",
  textColor = "dark:bg-white bg-black",
  fontSize = "text-2xl",
  fontWeight = "font-extrabold",
  BlurSize = "blur-md",
}) => {
  return (
    <div>
      <span
        className={`absolute mx-auto py-4 flex border w-fit bg-gradient-to-r ${BlurSize} bg-clip-text ${bgColor} box-content ${fontSize} text-transparent ${fontWeight} text-center select-none `}
      >
        {content}
      </span>
      <h1
        className={`relative top-0 w-fit h-auto py-4 ${ClassName} justify-center flex bg-gradient-to-r items-center ${textColor} bg-clip-text ${fontSize} text-transparent ${fontSize} text-center ${fontWeight} select-auto font-figtree-`}
      >
        {content}
      </h1>
    </div>
  );
};

export default GlowText;
