import { useTranslation } from "react-i18next";

import { Button } from "@/shared/components/ui/button.tsx";
import { DialogFooter } from "@/shared/components/ui/dialog.tsx";

interface PickerFooterProps {
  onClose: () => void;
}

/**
 * Footer of the warehouse list: same buttons in the same place as the other
 * tab; "Add" becomes available once a row is picked (on the next step).
 */
export const PickerFooter = ({ onClose }: PickerFooterProps) => {
  const { t } = useTranslation();

  return (
    <DialogFooter className="mt-auto">
      <Button type="button" variant="outline" onClick={onClose}>
        {t("common.cancel")}
      </Button>
      <Button type="button" disabled>
        {t("common.add")}
      </Button>
    </DialogFooter>
  );
};
