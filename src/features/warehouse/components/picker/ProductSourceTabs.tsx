import { useTranslation } from "react-i18next";

import SegmentedControl from "@/shared/components/SegmentedControl.tsx";

export type ProductSourceTab = "warehouse" | "manual";

interface ProductSourceTabsProps {
  value: ProductSourceTab;
  onChange: (tab: ProductSourceTab) => void;
}

/**
 * "+ product": manual entry stays the default flow (ordering a part from a
 * supplier for a specific customer); the warehouse complements it.
 */
export const ProductSourceTabs = ({
  value,
  onChange,
}: ProductSourceTabsProps) => {
  const { t } = useTranslation();

  return (
    <SegmentedControl<ProductSourceTab>
      value={value}
      onChange={onChange}
      options={[
        { value: "manual", label: t("warehouse.picker.manual") },
        { value: "warehouse", label: t("warehouse.picker.warehouse") },
      ]}
    />
  );
};
