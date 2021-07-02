import { Router } from "../deps.ts";

export function use(path: string, router: Router) {
  router.get(path, async (ctx) => {
    await ctx.send({
      root: `${Deno.cwd()}/static`,
      index: "index.html",
    });
  });
}
