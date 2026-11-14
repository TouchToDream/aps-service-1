import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import { WAREHOUSE_LINKS } from "@/features/warehouse/navigation.ts";
import { cn } from "@/shared/lib/utils.ts";

const TABS = [
  { key: "showcase", to: WAREHOUSE_LINKS.showcase() },
  { key: "supplies", to: WAREHOUSE_LINKS.supplies() },
  { key: "donors", to: WAREHOUSE_LINKS.donors() },
] as const;

export const WarehouseTabs = () => {
  const { t } = useTranslation();

  return (
    <nav className="mx-auto flex w-full max-w-3xl gap-4 px-2 pt-2 sm:gap-5 sm:px-4 sm:pt-4 lg:max-w-screen-2xl">
      {TABS.map((tab) => (
        <NavLink
          key={tab.key}
          to={tab.to}
          className={({ isActive }) =>
            cn(
              "border-b-2 pb-2 text-sm whitespace-nowrap transition-colors sm:text-base",
              isActive
                ? "border-primary font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )
          }
        >
          {t(`warehouse.tabs.${tab.key}`)}
        </NavLink>
      ))}
    </nav>
  );
};
