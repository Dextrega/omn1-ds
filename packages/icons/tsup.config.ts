import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    web: "src/web.tsx",
    native: "src/native.tsx",
    names: "src/names.ts",
    all: "src/all.tsx",
    "native-all": "src/native-all.tsx",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  external: [
    "react",
    "lucide-react",
    "lucide-react-native",
    "nativewind",
    "react-native",
    "react-native-svg",
  ],
});
