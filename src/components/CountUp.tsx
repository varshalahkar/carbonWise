import { useEffect, useState } from "react";

type CountUpProps = {
  value: number;
  suffix?: string;
};

export default function CountUp({ value, suffix = "" }: CountUpProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 650;

    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setDisplayValue(Math.round(value * progress));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <>
      {displayValue}
      {suffix}
    </>
  );
}
