import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import { App } from "./app";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
);
