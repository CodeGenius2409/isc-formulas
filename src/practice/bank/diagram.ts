// The figures a question can ask for. Each is generated from the question's own values and drawn by
// components/bank/BankDiagram.tsx. Every label is a string, so a value can be filled in per attempt.
export type DiagramSpec =
  /** A cell with internal resistance, feeding two resistors in parallel. */
  | { kind: 'cell-parallel'; emf: string; r: string; r1: string; r2: string }
  /** Two capacitors in series across a supply. */
  | { kind: 'series-capacitors'; c1: string; c2: string; v: string }
  /** A balanced or nearly balanced Wheatstone bridge. P and Q on top, R and S below. */
  | { kind: 'wheatstone'; p: string; q: string; r: string; s: string };
