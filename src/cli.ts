#!/usr/bin/env node
import { main } from "@/index.js";
main().catch((error) => {
    process.exit(1);
});
