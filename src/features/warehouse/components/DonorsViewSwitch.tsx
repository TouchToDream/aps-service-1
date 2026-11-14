import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { WAREHOUSE_LINKS } from "@/features/warehouse/navigation.ts";
import SegmentedControl from "@/shared/components/SegmentedControl.tsx";

type DonorsView = "donors" | "parts";

interface DonorsViewSwitchProps {
  value: DonorsView;
}

/** The "Donors" tab holds two lists: donors and their parts (incl. orphan parts). */
export const DonorsViewSwitch = ({ value }: DonorsViewSwitchProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="w-56">
      <SegmentedControl<DonorsView>
        value={value}
        options={[
          { value: "donors", label: t("warehouse.donorsView.donors") },
          { value: "parts", label: t("warehouse.donorsView.parts") },
        ]}
        onChange={(view) =>
          navigate(
            view === "donors"
              ? WAREHOUSE_LINKS.donors()
              : WAREHOUSE_LINKS.parts(),
          )
        }
      />
    </div>
  );
};
