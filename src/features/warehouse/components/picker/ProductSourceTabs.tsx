import { useTranslation } from "react-i18next";

import SegmentedControl from "@/shared/components/SegmentedControl.tsx";

export type ProductSourceTab = "warehouse" | "manual";

interface ProductSourceTabsProps {
  value: ProductSourceTab;
  onChange: (tab: ProductSourceTab) => void;
}

/** "+ product": the warehouse picker is the default, manual entry stays as is. */
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
        { value: "warehouse", label: t("warehouse.picker.warehouse") },
        { value: "manual", label: t("warehouse.picker.manual") },
      ]}
    />
  );
};
