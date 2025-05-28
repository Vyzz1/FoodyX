import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useState } from "react";
interface OptionGroupHoverProps {
  optionGroups: OptionGroup[];
}
const OptionGroupHover: React.FC<OptionGroupHoverProps> = ({
  optionGroups,
}) => {
  const [activeOptionGroup, setActiveOptionGroup] = useState<string | null>(
    null
  );
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const handleOptionGroupClick = (groupId: string) => {
    setActiveOptionGroup((prev) => (prev === groupId ? null : groupId));
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Available Options
      </h3>

      <div className="space-y-6">
        {optionGroups.map((group: OptionGroup) => (
          <div key={group.id} className="space-y-3">
            <div
              className="bg-amber-50 p-4 rounded-xl cursor-pointer hover:bg-amber-100 transition-colors duration-200"
              onClick={() => handleOptionGroupClick(group.id)}
              onMouseEnter={() => setHoveredGroup(group.id)}
              onMouseLeave={() => setHoveredGroup(null)}
              onMouseUp={() => setHoveredGroup(null)}
            >
              <div className="flex items-baseline justify-between">
                <h4 className="text-lg font-medium text-gray-900">
                  {group.name}
                </h4>
                {group.required && (
                  <span className="text-sm font-medium text-amber-600">
                    Required
                  </span>
                )}
              </div>

              <AnimatePresence>
                {(activeOptionGroup === group.id ||
                  hoveredGroup === group.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {group.options.map((option: Option, idx: number) => (
                      <motion.div
                        key={option.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.2,
                          delay: idx * 0.1,
                        }}
                      >
                        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-100">
                          <span className="font-medium dark:text-black">
                            {option.optionName}
                          </span>
                          {option.additionalPrice > 0 && (
                            <span className="text-amber-600 dark:text-slate-600 font-medium">
                              +${option.additionalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionGroupHover;
