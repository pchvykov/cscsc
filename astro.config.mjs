// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://complexitycontemplation.org",
  trailingSlash: "ignore",
  build: { format: "directory" },
  // Old short links stay alive: QR codes printed for CCS26 point at /p1-/p4.
  redirects: {
    "/p1": "/ccs26/p1/",
    "/p2": "/ccs26/p2/",
    "/p3": "/ccs26/p3/",
    "/p4": "/ccs26/p4/",
  },
});
