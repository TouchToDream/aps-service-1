import { useTranslation } from "react-i18next";

import { getDonorTitle } from "@/features/warehouse/lib/service.ts";
import type { DonorShort } from "@/features/warehouse/types.ts";

interface DonorTitleProps {
  donor: DonorShort;
}

export const DonorTitle = ({ donor }: DonorTitleProps) => {
  const { t } = useTranslation();
  return (
    <>
      {getDonorTitle(donor) ?? t("warehouse.donor.unnamed", { id: donor.id })}
    </>
  );
};
