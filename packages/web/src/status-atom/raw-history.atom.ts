import { atom } from "recoil";
import {} from "recoil-sync";
import { localStorageEffect } from "../modules/recoil/local-storage.effect";
import { SanitizedSikdaeHistory } from "../modules/sikdae-api/interfaces/hisroty.interface";

export const rawHistoryAtom = atom<SanitizedSikdaeHistory | null>({
  key: "rawHistoryAtom",
  default: null,
  effects: [localStorageEffect("rawHistoryAtom")],
});
