import { motion } from "framer-motion";
import { FaUserInjured, FaFileMedical, FaLink, FaUserMd } from "react-icons/fa";

function StatsCards({ patients, records, doctors }) {

  const cards = [
    {
      title: "Total Patients",
      value: patients,
      icon: <FaUserInjured size={28} />,
      color: "text-blue-600",
      bg: "bg-[color:var(--bg-secondary)]"
    },
    {
      title: "Medical Records",
      value: records,
      icon: <FaFileMedical size={28} />,
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      title: "Doctors",
      value: doctors,
      icon: <FaUserMd size={28} />,
      color: "text-teal-600",
      bg: "bg-teal-50"
    },
    {
      title: "Blockchain Status",
      value: "Connected",
      icon: <FaLink size={28} />,
      color: "text-green-600",
      bg: "bg-green-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-[color:var(--bg-card)] p-6 rounded-xl shadow-md hover:shadow-xl transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-[color:var(--text-secondary)] text-sm">{card.title}</p>
            <h2 className={`text-3xl font-bold mt-2 ${card.color}`}>
              {card.value}
            </h2>
          </div>
          <div className={`p-3 rounded-full ${card.bg} ${card.color} opacity-90`}>
            {card.icon}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default StatsCards;