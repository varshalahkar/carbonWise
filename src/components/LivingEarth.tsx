import { motion } from "framer-motion";

type LivingEarthProps = {
  score: number | null;
};

export default function LivingEarth({ score }: LivingEarthProps) {
  const healthClass = score === null ? "earth-unknown" : score >= 60 ? "earth-healthy" : score >= 40 ? "earth-moderate" : "earth-low";
  const leafCount = score === null ? "leaf-count-quiet" : score >= 60 ? "leaf-count-rich" : "leaf-count-sparse";

  return (
    <motion.div
      className="living-earth-wrap"
      animate={{ y: [0, -16, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className={`living-earth ${healthClass}`} aria-label="Animated planet health visualization">
        <div className="earth-cloud earth-cloud-one" />
        <div className="earth-cloud earth-cloud-two" />
        <div className="earth-cloud earth-cloud-three" />
      </div>
      <div className={`leaf-field ${leafCount}`} aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="particle-field" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
    </motion.div>
  );
}
