import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ABILITIES } from "@/features/auth/abilities.ts";
import { DictionaryTablePage } from "@/features/dictionaries/components/DictionaryTablePage.tsx";
import { warehouseApi } from "@/features/warehouse/api";
import { FilterSelect } from "@/features/warehouse/components/FilterSelect.tsx";
import { useLocationFilterOptions } from "@/features/warehouse/hooks/useLocationFilterOptions.ts";
import { useWarehouseLocations } from "@/features/warehouse/hooks/useWarehouseLocations.ts";
import {
  mapStoragePlaceFormValues,
  NO_LOCATION_VALUE,
  prepareStoragePlaceList,
  toSinglePageResponse,
} from "@/features/warehouse/lib/service.ts";
import type { StoragePlace } from "@/features/warehouse/types.ts";
import { queryKeys } from "@/shared/api/queryKeys.ts";
import type {
  ColumnConfig,
  FieldConfig,
} from "@/widgets/table/models/types.ts";

const api = {
  getAll: async (
    _page: number,
    _perPage: number,
    _sortColumn?: string | null,
    _sortType?: string,
    filters?: Record<string, string>,
  ) => {
    const places = await warehouseApi.getStoragePlaces();
    return toSinglePageResponse(
      prepareStoragePlaceList(
        places,
        filters?.location_id,
        filters?.name ?? "",
      ),
    );
  },
  create: async (values: Partial<StoragePlace>) => {
    const place = mapStoragePlaceFormValues(values);
    return warehouseApi.createStoragePlace(place.name, place.locationId);
  },
  update: (id: number, values: Partial<StoragePlace>) =>
    warehouseApi.updateStoragePlace(id, mapStoragePlaceFormValues(values)),
  remove: warehouseApi.deleteStoragePlace,
};

/**
 * Where donors and parts are kept. Managed by `warehouse_manage`, viewing is
 * open. The same name may repeat in different offices; deleting a place that
 * still holds a donor or a part returns 422, shown as is.
 */
const StoragePlacesPage = () => {
  const { t } = useTranslation();
  const { locations } = useWarehouseLocations();
  const locationOptions = useLocationFilterOptions();

  const columns = useMemo<ColumnConfig<StoragePlace>[]>(() => {
    const names = new Map(locations.map((l) => [l.id, l.name]));
    return [
      {
        key: "name",
        field: "name",
        labelKey: "dictionaries.table_fields.name",
        sortable: false,
      },
      {
        key: "locationId",
        field: "locationId",
        labelKey: "warehouse.table.location",
        sortable: false,
        formField: false,
        renderCell: (_value, place) =>
          place.locationId === null
            ? t("warehouse.storagePlaces.noLocation")
            : (names.get(place.locationId) ?? "—"),
      },
    ];
  }, [locations, t]);

  const formFields = useMemo<FieldConfig[]>(
    () => [
      {
        key: "name",
        label: t("dictionaries.table_fields.name"),
        required: true,
      },
      {
        // The API field name, so a 422 on `location_id` lands on it.
        key: "location_id",
        label: t("warehouse.table.location"),
        type: "select",
        options: [
          ...locationOptions,
          {
            value: NO_LOCATION_VALUE,
            label: t("warehouse.storagePlaces.noLocation"),
          },
        ],
        getInitialValue: (item) =>
          item.locationId == null ? NO_LOCATION_VALUE : item.locationId,
      },
    ],
    [locationOptions, t],
  );

  return (
    <DictionaryTablePage
      titleKey="sidebar.dictionaries_list.storage_places"
      api={api}
      queryKeyFn={queryKeys.warehouse.storagePlaceList}
      columns={columns}
      formFields={formFields}
      filterBar={
        <FilterSelect
          filterKey="location_id"
          allLabel={t("warehouse.filters.allLocations")}
          options={locationOptions}
        />
      }
      extraFilterKeys={["location_id"]}
      manageAbility={ABILITIES.WAREHOUSE_MANAGE}
    />
  );
};

export default StoragePlacesPage;
