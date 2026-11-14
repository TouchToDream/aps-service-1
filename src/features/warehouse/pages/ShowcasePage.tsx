import { ItemsListPage } from "@/features/warehouse/pages/items/ItemsListPage.tsx";
import { WAREHOUSE_ITEM_KINDS } from "@/features/warehouse/types.ts";

const ShowcasePage = () => (
  <ItemsListPage kind={WAREHOUSE_ITEM_KINDS.SHOWCASE} />
);

export default ShowcasePage;
