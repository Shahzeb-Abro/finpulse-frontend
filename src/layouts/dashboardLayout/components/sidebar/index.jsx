import { Logo, LogoSmall } from "@/assets/svgs";
import {
  IconArrowFatLines,
  IconArrowUpDown,
  IconChartDonut,
  IconHouse,
  IconJarFill,
  IconReceipt,
  IconWrench,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/routes/routes";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BotMessageSquare } from "lucide-react";

const NAV_ITEMS = [
  {
    id: 1,
    icon: <IconHouse height={24} width={24} />,
    label: "Overview",
    to: ROUTES.overview,
  },
  {
    id: 2,
    icon: <IconArrowUpDown height={24} width={24} />,
    label: "Transactions",
    to: ROUTES.transactions,
  },
  {
    id: 3,
    icon: <IconChartDonut height={24} width={24} />,
    label: "Budgets",
    to: ROUTES.budgets,
  },
  {
    id: 4,
    icon: <IconJarFill height={24} width={24} />,
    label: "Pots",
    to: ROUTES.pots,
  },
  {
    id: 5,
    icon: <BotMessageSquare height={24} />,
    label: "AI Assistant",
    to: ROUTES.aiAssistant,
  },
  {
    id: 6,
    icon: <IconReceipt height={24} width={24} />,
    label: "Recurring Bills",
    to: ROUTES.recurringBills,
  },
  {
    id: 7,
    icon: <IconWrench height={24} width={24} />,
    label: "Settings",
    to: ROUTES.settings,
  },
];

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 89 : 300 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-full flex flex-col gap-6 bg-grey-900 rounded-r-[16px] overflow-hidden"
    >
      <div>
        <AnimatePresence mode="wait">
          {isCollapsed ? (
            <motion.div
              key="logo-small"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex justify-center py-10 px-4"
            >
              <LogoSmall />
            </motion.div>
          ) : (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex py-10 px-8"
            >
              <Logo />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        className={cn(
          "flex flex-col gap-1  mb-auto",
          isCollapsed ? "pr-2" : "pr-6",
        )}
      >
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.id} to={item.to}>
            {({ isActive }) => (
              <div
                className={cn(
                  "flex items-center gap-4 h-14 py-4 border-l-4 border-transparent text-grey-300 hover:text-white",
                  isCollapsed ? "px-8 justify-center" : "px-8",
                  isActive &&
                    "bg-white rounded-r-[12px] text-grey-900 border-green-sec hover:text-grey-900",
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <span className={cn("shrink-0", isActive && "text-green-sec")}>
                  {item.icon}
                </span>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-base font-bold whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            )}
          </NavLink>
        ))}
      </div>

      <button
        onClick={() => setIsCollapsed((prev) => !prev)}
        className={cn(
          "flex items-center gap-4 py-4 text-grey-300 hover:text-white cursor-pointer",
          isCollapsed ? "justify-center px-4" : "px-8",
        )}
      >
        <motion.span
          animate={{ rotate: isCollapsed ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <IconArrowFatLines />
        </motion.span>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="text-base font-bold whitespace-nowrap overflow-hidden"
            >
              Minimize Menu
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.aside>
  );
};

export const SidebarSmall = () => {
  return (
    <div className="min-h-13 md:min-h-16.5 bg-grey-900 rounded-t-lg pt-2 px-4 sm:px-10 w-full">
      <div className="flex items-center gap-4 justify-between">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.id} to={item.to} className="flex-1">
            {({ isActive }) => (
              <div
                className={cn(
                  "flex flex-col gap-1 py-2 border-b-4 border-transparent hover:text-white items-center text-grey-500",
                  isActive &&
                    "text-green-sec bg-beige-100 border-green-sec rounded-t-lg",
                )}
              >
                <span className={cn("shrink-0", isActive && "text-green-sec")}>
                  {item.icon}
                </span>
                <span
                  className={cn(
                    "text-xs font-bold text-center hidden md:block",
                    isActive && "text-foreground ",
                  )}
                >
                  {item.label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};
