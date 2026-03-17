import { motion } from "framer-motion";

function BlockchainNetworkGraph({ records = [] }) {

  const blocks = Array.isArray(records) ? records.slice(0, 6) : [];

  return (

    <div className="bg-white p-6 rounded-xl shadow-md mt-6">

      <h2 className="text-lg font-semibold mb-4">
        Blockchain Visualization
      </h2>

      <div className="flex items-center gap-6 overflow-x-auto">

        {blocks.map((block, index) => (

          <motion.div
            key={block.record_id}

            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}

            transition={{
              delay: index * 0.25,
              type: "spring",
              stiffness: 120
            }}

            className="min-w-[170px] bg-gray-900 text-white rounded-lg p-4 flex flex-col items-center shadow-lg relative"
          >

            <div className="text-xs text-gray-400">
              Block
            </div>

            <div className="text-xl font-bold">
              #{block.record_id}
            </div>

            <div className="text-xs mt-2 text-gray-400">
              Patient
            </div>

            <div className="text-sm">
              {block.patient_id}
            </div>

            <div className="text-xs mt-2 font-mono text-green-400">
              {block.block_hash
                ? block.block_hash.substring(0,12) + "..."
                : "Pending"}
            </div>

            {index !== blocks.length - 1 && (
              <div className="absolute right-[-20px] top-1/2 w-10 h-[2px] bg-gray-400"></div>
            )}

          </motion.div>

        ))}

      </div>

    </div>

  );
}

export default BlockchainNetworkGraph;