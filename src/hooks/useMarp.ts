import Marp from "@marp-team/marp-core";
import { useMemo } from "react";

export function useMarp(markdown: string) {
  return useMemo(() => {
    const marp = new Marp({ html: true });
    const { html, css } = marp.render(markdown);
    return { html, css };
  }, [markdown]);
}
