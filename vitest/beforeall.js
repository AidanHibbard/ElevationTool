import { beforeAll } from "vitest";
;(global).CSS = { supports: () => false };

beforeAll(() => {
    console.log("beforeAll");
    global.CSS = {
        supports: (str) => false,
        escape: (str) => str,
    };
    console.log("CSS.support:" + CSS.supports("selector(:focus-visible)"));
});