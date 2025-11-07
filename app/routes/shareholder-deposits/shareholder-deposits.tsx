// app/routes/api.shareholders.$id.deposits.tsx

import { data } from "react-router";
import { getShareholderDeposits } from "../sub-form/helpers/services.server";

export async function loader({ params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const deposits = await getShareholderDeposits(id);
    return deposits;
  } catch (error) {
    return data({ error: "Failed to fetch deposits" }, { status: 500 });
  }
}
