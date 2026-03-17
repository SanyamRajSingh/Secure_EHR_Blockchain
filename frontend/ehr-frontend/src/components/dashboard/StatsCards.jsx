import { motion } from "framer-motion";
import { FaUserInjured, FaFileMedical, FaLink } from "react-icons/fa";

function StatsCards({ patients, records }) {

  const cards = [
    {
      title: "Total Patients",
      value: patients,
      icon: <FaUserInjured size={30} />,
      color: "text-blue-600"
    },
    {
      title: "Medical Records",
      value: records,
      icon: <FaFileMedical size={30} />,
      color: "text-purple-600"
    },
    {
      title: "Blockchain Status",
      value: "Connected",
      icon: <FaLink size={30} />,
      color: "text-green-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all flex items-center justify-between"
        >
          <div>
            <p className="text-gray-500 text-sm">{card.title}</p>
            <h2 className={`text-3xl font-bold mt-2 ${card.color}`}>
              {card.value}
            </h2>
          </div>

          <div className={`opacity-70 ${card.color}`}>
            {card.icon}
          </div>

        </motion.div>
      ))}
    </div>
  );
}

export default StatsCards;