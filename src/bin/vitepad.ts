#!/usr/bin/env node
import { main } from "~/index";
main().catch(error => {
    console.error('💥 程序异常:', error);
    process.exit(1);
});