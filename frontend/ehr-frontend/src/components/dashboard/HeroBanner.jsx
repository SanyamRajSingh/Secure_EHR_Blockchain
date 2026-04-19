import { motion } from "framer-motion";

function HeroBanner() {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-xl shadow-md mb-6 overflow-hidden">

      {/* Background animated circles */}
      <motion.div
        className="absolute w-72 h-72 bg-[color:var(--bg-card)]/10 rounded-full top-[-80px] right-[-80px]"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 6 }}
      />

      <motion.div
        className="absolute w-48 h-48 bg-[color:var(--bg-card)]/10 rounded-full bottom-[-60px] left-[-60px]"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 5 }}
      />

      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-2">
          Secure Electronic Health Records
        </h1>

        <p className="text-blue-100">
          Blockchain-powered integrity monitoring for medical records.
        </p>
      </div>

    </div>
  );
}

export default HeroBanner;