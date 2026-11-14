import { useMemo } from "react";
import { Controller, FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { DictionaryRefField } from "@/features/warehouse/components/DictionaryRefField.tsx";
import { EnumSelectField } from "@/features/warehouse/components/EnumSelectField.tsx";
import { LocationSelectField } from "@/features/warehouse/components/LocationSelectField.tsx";
import { PartPhotoSection } from "@/features/warehouse/components/part-form/PartPhotoSection.tsx";
import { StoragePlaceField } from "@/features/warehouse/components/StoragePlaceField.tsx";
import { useDonorPartForm } from "@/features/warehouse/hooks/useDonorPartForm.ts";
import { createCategoryFetcher } from "@/features/warehouse/lib/searchFetchers.ts";
import {
  type DonorPart,
  PART_CONDITIONS,
  PART_STATUSES,
  WAREHOUSE_CATEGORY_KINDS,
} from "@/features/warehouse/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import { FormField } from "@/shared/components/common/FormField.tsx";
import { Button } from "@/shared/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog.tsx";
import { Label } from "@/shared/components/ui/label.tsx";

const PART_KIND = WAREHOUSE_CATEGORY_KINDS.PART;

interface PartFormDialogProps {
  part?: DonorPart;
  donorId: number | null;
  defaultLocationId: number | null;
  onClose: () => void;
}

/** Mount only while open — the form takes its defaults on mount. */
export const PartFormDialog = ({
  part,
  donorId,
  defaultLocationId,
  onClose,
}: PartFormDialogProps) => {
  const { t } = useTranslation();
  const fetchCategories = useMemo(() => createCategoryFetcher(PART_KIND), []);
  const { methods, onSubmit, isPending } = useDonorPartForm({
    part,
    donorId,
    defaultLocationId,
    onSuccess: onClose,
  });
  const {
    control,
    register,
    formState: { errors },
  } = methods;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t(part ? "warehouse.part.edit" : "warehouse.part.create")}
          </DialogTitle>
        </DialogHeader>
        {part && <PartPhotoSection part={part} />}
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <DictionaryRefField
                  label={t("warehouse.part.fields.category")}
                  value={field.value}
                  onChange={field.onChange}
                  fetchItems={fetchCategories}
                  queryKey={queryKeys.warehouse.categories(PART_KIND)}
                  error={errors.category?.message}
                />
              )}
            />
            <div className="flex flex-col gap-1">
              <Label>{t("warehouse.part.fields.name")}</Label>
              <FormField
                autoComplete="off"
                placeholder={t("warehouse.part.fields.namePlaceholder")}
                error={errors.name}
                {...register("name")}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="condition"
                control={control}
                render={({ field }) => (
                  <EnumSelectField
                    label={t("warehouse.part.fields.condition")}
                    value={field.value}
                    options={Object.values(PART_CONDITIONS)}
                    getLabel={(option) =>
                      t(`warehouse.partConditions.${option}`)
                    }
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <EnumSelectField
                    label={t("warehouse.part.fields.status")}
                    value={field.value}
                    options={Object.values(PART_STATUSES)}
                    getLabel={(option) => t(`warehouse.partStatuses.${option}`)}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
            <Controller
              name="locationId"
              control={control}
              render={({ field }) => (
                <LocationSelectField
                  label={t("warehouse.part.fields.location")}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.locationId?.message}
                />
              )}
            />
            <Controller
              name="storagePlace"
              control={control}
              render={({ field }) => (
                <StoragePlaceField
                  label={t("warehouse.part.fields.storagePlace")}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.storagePlace?.message}
                />
              )}
            />
            <div className="flex flex-col gap-1">
              <Label>{t("warehouse.part.fields.note")}</Label>
              <FormField
                autoComplete="off"
                error={errors.note}
                {...register("note")}
              />
            </div>
            {errors.root && (
              <p className="text-sm text-destructive">{errors.root.message}</p>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {t(part ? "common.save" : "common.add")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
