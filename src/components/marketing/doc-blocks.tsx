import type { DocBlock } from "@/lib/docs";

export function DocBlocks({ blocks }: { blocks: DocBlock[] }) {
  return (
    <div className="space-y-10">
      {blocks.map((block, i) => (
        <section key={i} className="space-y-4">
          {block.heading ? (
            <h2 className="scroll-mt-24 text-xl font-semibold tracking-tight md:text-2xl">{block.heading}</h2>
          ) : null}

          {block.paragraphs?.map((p, j) => (
            <p key={j} className="text-[15px] leading-7 text-foreground/85">{p}</p>
          ))}

          {block.bullets ? (
            <ul className="ml-5 list-disc space-y-1.5 text-[15px] leading-7 text-foreground/85">
              {block.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>
          ) : null}

          {block.code ? (
            <div className="overflow-hidden rounded-xl border border-border/70 bg-card">
              <div className="flex items-center justify-between border-b border-border/60 bg-secondary/40 px-4 py-2">
                <span className="font-mono text-xs text-muted-foreground">{block.code.label ?? block.code.lang}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-primary">{block.code.lang}</span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-foreground/90">{block.code.body}</pre>
            </div>
          ) : null}

          {block.table ? (
            <div className="overflow-x-auto rounded-xl border border-border/70">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-secondary/40">
                    {block.table.columns.map((c) => (
                      <th key={c} className="border-b border-border/60 px-4 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {c || "\u00a0"}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.table.rows.map((row, r) => (
                    <tr key={r} className="odd:bg-card/40">
                      {row.map((cell, c) => (
                        <td key={c} className={`border-b border-border/40 px-4 py-2.5 align-top ${c === 0 ? "font-mono text-xs text-foreground" : "text-foreground/80"}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {block.note ? (
            <p className="rounded-lg border border-primary/25 bg-primary/5 px-4 py-3 text-sm leading-6 text-foreground/85">
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">note</span>
              <span className="ml-2">{block.note}</span>
            </p>
          ) : null}
        </section>
      ))}
    </div>
  );
}
