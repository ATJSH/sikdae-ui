export interface SikdaeHistoryAmount {
  totalAmount: number;
  couponAmount: number;
  policyAmount: number;
  myPointAmount: number;
  captainPayAmount: number;
  welfareAmount: number;
}

export interface SikdaeSessionHistory {
  couponId: string;
  badgeName: string;
  useDate: number;
  state: string;
  stateName: string;
  price: number;
  payType: string;
  storeInfo: {
    storeId: string;
    storeName: string;
    supplyType: number;
    supplyTypes: (
      | {
          code: "LOCAL";
          name: "방문식사";
        }
      | {
          code: "DELIVERY";
          name: "전화배달";
        }
    )[];
    orderedMenus: {
      menuId: null | string;
      menuName: string;
      menuImageUrl: null | string;
      quantity: null | number;
      amount: null | number;
      totalAmount: null | number;
    };
  };
}

export interface SikdaeHistory {
  amount: SikdaeHistoryAmount;
  histories: SikdaeSessionHistory[];
}

export interface SanitizedSikdaeHistory {
  amount: SikdaeHistoryAmount;
  histories: (Pick<
    SikdaeSessionHistory,
    "badgeName" | "useDate" | "state" | "stateName" | "price" | "payType"
  > & {
    storeInfo: Pick<SikdaeSessionHistory["storeInfo"], "storeName">;
  })[];
}
