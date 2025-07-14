import type React from "react"

const Footer: React.FC = () => {
  return (
    <div className="h-[60px] md:h-[80px] w-full flex p-2 gap-2 justify-center items-center border-t-[1px] border-[#D5D7DA]">
      <p className="font-normal text-[12px] md:text-[14px] leading-[24px] md:leading-[28px] tracking-[-0.03em] text-[#535862]">
        © 2025 Web Programming Hack Blog All rights reserved.
      </p>
    </div>
  )
}

export default Footer
