import { atom } from "recoil";
import { SikdaeHistory } from "../modules/sikdae-api/interfaces/hisroty.interface";
import {} from "recoil-sync";
import { localStorageEffect } from "../modules/recoil/local-storage.effect";

export const rawHistoryAtom = atom<SikdaeHistory | null>({
  key: "rawHistoryAtom",
  default: null,
  effects: [localStorageEffect("rawHistoryAtom")],
});
