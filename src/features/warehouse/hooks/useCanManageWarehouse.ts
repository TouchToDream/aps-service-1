import { ABILITIES } from "@/features/auth/abilities.ts";
import { useAuth } from "@/features/auth/hooks/useAuth.ts";

export const useCanManageWarehouse = (): boolean => {
  const { can } = useAuth();
  return can(ABILITIES.WAREHOUSE_MANAGE);
};
