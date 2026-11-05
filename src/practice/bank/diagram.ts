// The figures a question can ask for. Each is generated from the question's own values and drawn by
// components/bank/BankDiagram.tsx. Every label is a string, so a value can be filled in per attempt.

export type CircuitElement =
  | { type: 'R' | 'C' | 'L' | 'switch' | 'diode'; label?: string; reverse?: 1 }
  | { type: 'meter'; meter: 'A' | 'V' | 'G'; label?: string }
  | { type: 'parallel'; branches: CircuitElement[][] };

export type DiagramSpec =
  /** A cell with internal resistance, feeding two resistors in parallel. */
  | { kind: 'cell-parallel'; emf: string; r: string; r1: string; r2: string }
  /** Two capacitors in series across a supply. */
  | { kind: 'series-capacitors'; c1: string; c2: string; v: string }
  /** A balanced or nearly balanced Wheatstone bridge. P and Q on top, R and S below. */
  | { kind: 'wheatstone'; p: string; q: string; r: string; s: string }
  /** A loop of elements in series, some of them parallel groups, around a cell or an a.c. source. */
  | { kind: 'circuit'; source: { type: 'cell' | 'ac'; label: string; r?: string }; loop: CircuitElement[] }
  /** Object, lens and focal points to scale. The image is left out so the figure doesn't give the answer away. */
  | { kind: 'lens'; lens: 'convex' | 'concave'; f: number; u: number; fLabel: string; uLabel: string }
  | { kind: 'mirror'; mirror: 'concave' | 'convex'; f: number; u: number; fLabel: string; uLabel: string }
  | { kind: 'prism'; angle: string; incidence?: string }
  /** Two slits and a screen. */
  | { kind: 'ydse'; d: string; D: string; lambda: string }
  /** Axes with one or more straight or curved lines from points. */
  | { kind: 'graph'; x: string; y: string; lines: { label?: string; points: [number, number][]; smooth?: 1 }[]; ticksX?: [number, string][]; ticksY?: [number, string][] }
  | { kind: 'projectile'; v: string; angle: string; h?: string }
  | { kind: 'incline'; angle: string; m: string; mu?: string; force?: string }
  | { kind: 'pulley'; m1: string; m2: string }
  /** A block and the forces on it. */
  | { kind: 'block'; m: string; forces: { dir: 'left' | 'right' | 'up' | 'down'; label: string }[] }
  /** Point charges on a line, with the gaps between them. `point` marks where something is asked. */
  | { kind: 'charges'; items: { q: string; sign: '+' | '-' }[]; gaps: string[]; point?: { after: number; label: string; gap: string } }
  | { kind: 'wave'; amplitude: string; wavelength: string }
  /** A rod sliding on rails in a magnetic field. */
  | { kind: 'rail'; B: string; l: string; v: string; r?: string }
  /** A long straight wire, and a point near it. */
  | { kind: 'wire'; I: string; r: string }
  | { kind: 'solenoid'; turns: string; I: string; length: string }
  | { kind: 'spring'; k: string; m: string; a?: string }
  | { kind: 'orbit'; height: string; mass: string }
  /** Horizontal levels with energies, and an arrow for a transition. */
  | { kind: 'levels'; levels: { n: string; E?: string; at: number }[]; from?: number; to?: number }
  | { kind: 'capacitor'; A: string; d: string; V?: string; dielectric?: string }
  /** Two arrows from a point, at an angle. */
  | { kind: 'vectors'; a: string; b: string; angle: string; deg: number }
  /** A body on a circular path. */
  | { kind: 'circle'; r: string; v: string; m?: string }
  /** A track falling from a height, with a point part-way down. */
  | { kind: 'hill'; H: string; m?: string; point?: { label: string; fraction: number } }
  /** Two trolleys on a track, the first moving. */
  | { kind: 'trolleys'; a: string; b: string; v: string }
  /** A door or bar seen from above, with a force at its far end. */
  | { kind: 'lever'; r: string; F: string; angle: string; deg: number }
  /** Masses at positions on an axis. */
  | { kind: 'axis-masses'; items: { m: string; x: string }[] }
  /** A pipe narrowing, with what's known at each end. */
  | { kind: 'pipe'; a1: string; v1: string; a2: string }
  /** A tank with a hole in its side. */
  | { kind: 'tank'; h: string }
  /** A thin tube standing in a liquid. The rise is only named. */
  | { kind: 'capillary'; r: string }
  /** A heat engine between two reservoirs. */
  | { kind: 'engine'; hot: string; cold: string }
  /** The fundamental of a string or an air column. */
  | { kind: 'standing'; ends: 'fixed' | 'open' | 'closed'; L: string; note?: string }
  /** A dipole, wire or coil at an angle to a uniform field. */
  | { kind: 'in-field'; body: 'dipole' | 'wire' | 'coil'; B: string; label: string; angle: string; deg: number }
  /** Two parallel wires carrying current. */
  | { kind: 'parallel-wires'; i1: string; i2: string; d: string; same: boolean }
  /** A charged particle entering a field going into the page. */
  | { kind: 'field-entry'; B: string; v: string; q: string }
  /** A transformer. Each side lists only what the question gives. */
  | { kind: 'transformer'; primary: string[]; secondary: string[] }
  /** A ray crossing a boundary. */
  | { kind: 'refraction'; i: string; r: string; iDeg: number; rDeg: number; top: string; bottom: string }
  /** Objective and eyepiece on one axis. */
  | { kind: 'telescope'; fo: string; fe: string }
  /** Light falling on a metal, and an electron leaving. */
  | { kind: 'photoelectric'; light: string; metal: string }
  /** A ball falling from a height, and perhaps rebounding part of the way. */
  | { kind: 'drop'; h: string; rebound?: { label: string; fraction: number } }
  /** A wire hanging from a support, with a load. */
  | { kind: 'hanging'; L: string; A: string; F: string; e?: string }
  /** A biconvex lens with the radii of its two faces. */
  | { kind: 'lens-surfaces'; r1: string; r2: string; n: string }
  /** A flat circular coil, with its centre marked. */
  | { kind: 'coil'; turns: string; r: string; I: string }
  /** A table of data, for data-based questions. */
  | { kind: 'table'; head: string[]; rows: string[][]; caption?: string }
  /** A binary tree. Each node gives its label and its children by index. */
  | { kind: 'tree'; nodes: { label: string; left?: number; right?: number }[] };
