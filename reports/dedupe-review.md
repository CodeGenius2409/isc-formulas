# Duplicates for you to decide

These 55 groups look like repeats, but I was not sure. **Nothing here was deleted.** Every entry is still in the book.

To merge a group, add its ids to `MERGE` in `scripts/dedupe-decisions.mjs` (canonical id first), remove it from `REVIEW`, and run `npm run data`. Favourites migrate on their own.

## 1. Percentage error / Percentage error (product/quotient) / Percentage error (power)

You flagged these as near-duplicates, but only the name overlaps. p-xi-1-11 defines percentage error. p-xi-1-5 and p-xi-1-6 are the propagation rules for products/quotients and powers.

**Suggestion:** Keep all three.

- `p-xi-1-11`, Physics XI, 1. Physical World and Measurement › Units & Dimensions
  - `\frac{\Delta x}{x}\times 100\%`
- `p-xi-1-5`, Physics XI, 1. Physical World and Measurement › Units & Dimensions
  - `\frac{\Delta x}{x}\times 100\% = \frac{\Delta a}{a}\times 100\% + \frac{\Delta b}{b}\times 100\%`
  - Note: For x = a × b or a/b
- `p-xi-1-6`, Physics XI, 1. Physical World and Measurement › Units & Dimensions
  - `\frac{\Delta x}{x}\times 100\% = n\,\frac{\Delta a}{a}\times 100\%`
  - Note: For x = aⁿ

## 2. Definition of the ampere

Both are named "Definition of the ampere". p-xi-1-16 is the current definition (fixed e, since 2019). p-xii-3-52 is the older force-between-wires definition.

**Suggestion:** Keep both, and rename p-xii-3-52 "Ampere from force between wires".

- `p-xi-1-16`, Physics XI, 1. Physical World and Measurement › SI Base & Supplementary Units
  - `e=1.602176634\times10^{-19}\ \text{C}\ \text{(exact; defines A)}`
  - Note: Base unit of electric current
- `p-xii-3-52`, Physics XII, 3. Magnetic Effects of Current & Magnetism › Force on Charges & Currents
  - `\frac{F}{l}=\frac{\mu_0}{2\pi}\frac{(1)(1)}{1}=2\times10^{-7}\ \text{N m}^{-1}`
  - Note: 1 A in each of two long parallel wires 1 m apart

## 3. Mean density of Earth

Both are "Mean density of Earth". One is a value, the other is the formula ρ = 3g/4πGR.

**Suggestion:** Keep both.

- `p-xi-1-201`, Physics XI, 1. Physical World and Measurement › Physical Constants
  - `\rho_E=5.5\times10^{3}\ \text{kg m}^{-3}`
  - Note: 5.51 g cm⁻³
- `p-xi-6-18`, Physics XI, 6. Gravitation › Universal Law of Gravitation
  - `\rho=\frac{3g}{4\pi GR}`

## 4. Conservation of angular momentum

Same law of conservation of angular momentum, as I₁ω₁ = I₂ω₂ and as τ_ext = 0 ⇒ L constant.

**Suggestion:** Merge only if one form is enough for you.

- `p-xi-5-22`, Physics XI, 5. System of Particles & Rotational Motion › Centre of Mass & Rotation
  - `I_{1}\omega_{1}=I_{2}\omega_{2}`
  - Note: If τ_ext = 0
- `p-xi-5-52`, Physics XI, 5. System of Particles & Rotational Motion › Torque and Angular Momentum
  - `\vec\tau_{ext}=0\ \Rightarrow\ \vec L=\text{constant}`

## 5. Wave equation

Both are "Wave equation", but y = A sin(kx − ωt) and y = A sin(2π/λ)(vt − x) differ by an overall sign.

**Suggestion:** Keep both, and check which sign convention your textbook uses.

- `p-xi-10-7`, Physics XI, 10. Oscillations and Waves › SHM & Waves
  - `y=A\sin(kx-\omega t)`
  - Note: k = 2π/λ
- `p-xi-10-23`, Physics XI, 10. Oscillations and Waves › SHM & Waves
  - `y=A\sin\frac{2\pi}{\lambda}(vt-x)`

## 6. Intensity from a point source

Same I = P/4πr², but each continues to a different result (the intensity ratio, and E₀).

**Suggestion:** Keep both.

- `p-xi-10-152`, Physics XI, 10. Oscillations and Waves › Wave Motion
  - `I=\frac{P}{4\pi r^{2}}\ \Rightarrow\ \frac{I_1}{I_2}=\frac{r_2^{2}}{r_1^{2}}`
- `p-xii-5-20`, Physics XII, 5. Electromagnetic Waves › EM Wave Properties
  - `I=\frac{P}{4\pi r^{2}}\ \Rightarrow\ E_0=\sqrt{\frac{P}{2\pi\varepsilon_0cr^{2}}}`
  - Note: isotropic source of power P

## 7. Isochoric process

Both describe an isochoric process, but Physics and Chemistry use different symbols and sign conventions for work.

**Suggestion:** Keep both.

- `p-xi-8-117`, Physics XI, 8. Thermodynamics › Thermodynamic Processes
  - `W=0,\quad Q=\Delta U=nC_v\Delta T,\quad \frac{P}{T}=\text{constant}`
- `c-xi-6-20`, Chemistry XI, 6. Thermodynamics › System, Properties & Processes
  - `\Delta V=0\ \Rightarrow\ w=0,\quad\Delta U=q_V`
  - Note: Constant volume

## 8. Efficiency of heat engine

Both are "Efficiency of heat engine". The Physics form uses heats (true for any engine). The Chemistry form ends in 1 − Tc/Th, which holds only for a reversible engine.

**Suggestion:** Keep both.

- `p-xi-8-139`, Physics XI, 8. Thermodynamics › Heat Engines, Refrigerators and Entropy
  - `\eta=\frac{W}{Q_1}=1-\frac{Q_2}{Q_1}`
- `c-xi-6-109`, Chemistry XI, 6. Thermodynamics › Second Law & Entropy
  - `\eta=\frac{w}{q_h}=1-\frac{T_c}{T_h}`
  - Note: Carnot engine; temperatures in kelvin

## 9. Refrigerator COP / Refrigerator: COP

Refrigerator COP written with temperatures and with heats. The temperature form holds only for a reversible cycle.

**Suggestion:** Keep both.

- `p-xi-8-11`, Physics XI, 8. Thermodynamics › Laws & Processes
  - `\beta=\frac{Q_2}{W}=\frac{T_2}{T_1-T_2}`
  - Note: Carnot fridge
- `p-xi-8-147`, Physics XI, 8. Thermodynamics › Heat Engines, Refrigerators and Entropy
  - `\beta=\frac{Q_2}{W}=\frac{Q_2}{Q_1-Q_2}`
  - Note: Q₂ from cold reservoir

## 10. Molar volume at STP

Molar volume at STP. p-xi-9-19 writes the unit as L and adds the m³ value. c-xi-1-14 has the correct unit, L mol⁻¹.

**Suggestion:** Merge, keeping c-xi-1-14 with the m³ value added.

- `p-xi-9-19`, Physics XI, 9. Kinetic Theory of Gases › Gas Laws and Equation of State
  - `V_m=22.4\ \text{L}=22.4\times10^{-3}\ \text{m}^{3}`
  - Note: 0 °C, 1 atm
- `c-xi-1-14`, Chemistry XI, 1. Some Basic Concepts of Chemistry › Mole Concept & Stoichiometry
  - `V_{m}=22.4\ \text{L mol}^{-1}`
  - Note: At 273.15 K and 1 atm (22.7 L at 1 bar, IUPAC STP)

## 11. Density of a gas at STP

Density of a gas at STP, as ρ = M/V_m and as d = M/22.4 g L⁻¹.

**Suggestion:** Merge if you are happy with one form.

- `p-xi-9-23`, Physics XI, 9. Kinetic Theory of Gases › Gas Laws and Equation of State
  - `\rho=\frac{M}{V_m}`
  - Note: M in kg mol⁻¹
- `c-xi-1-25`, Chemistry XI, 1. Some Basic Concepts of Chemistry › Mole Concept & Stoichiometry
  - `d=\frac{M}{22.4}\ \text{g L}^{-1}`
  - Note: M in g/mol

## 12. Dipole moment

Both are "Dipole moment": the electric dipole p = q·2a (vector, separation 2a) and the bond dipole μ = q × d.

**Suggestion:** Keep both.

- `p-xii-1-21`, Physics XII, 1. Electrostatics › Coulomb’s Law & Fields
  - `\vec{p}=q\cdot 2\vec{a}`
- `c-xi-4-3`, Chemistry XI, 4. Chemical Bonding › VBT, MOT, VSEPR
  - `\mu=q\times d`
  - Note: Unit: Debye

## 13. Stopping potential

Stopping potential as eV₀ = hν − φ and as eV₀ = K.E.max. Related steps of the same argument.

**Suggestion:** Keep both.

- `p-xii-7-8`, Physics XII, 7. Dual Nature of Radiation & Matter › Photoelectric & de Broglie
  - `eV_0=h\nu-\phi`
- `c-xi-2-36`, Chemistry XI, 2. Structure of Atom › Electromagnetic Radiation & Planck
  - `eV_0=\text{K.E.}_{\max}`
  - Note: Voltage that stops the fastest photoelectrons

## 14. Bohr radius

All named "Bohr radius", but they are rₙ for hydrogen, the constant a₀, and rₙ with Z.

**Suggestion:** Keep all three, and rename them to say which is which.

- `p-xii-8-1`, Physics XII, 8. Atoms and Nuclei › Bohr Model & Radioactivity
  - `r_{n}=\frac{n^{2}h^{2}\varepsilon_{0}}{\pi me^{2}}=0.529\,n^{2}\,\text{Å}`
- `p-xii-8-26`, Physics XII, 8. Atoms and Nuclei › Physical Constants (Class XII)
  - `a_0=\frac{\varepsilon_0h^{2}}{\pi m_ee^{2}}=0.529\ \text{Å}=5.29\times10^{-11}\ \text{m}`
  - Note: radius of the first Bohr orbit of hydrogen
- `c-xi-2-5`, Chemistry XI, 2. Structure of Atom › Quantum & Bohr
  - `r_{n}=\frac{0.529n^{2}}{Z}\,\text{Å}`

## 15. Number of spectral lines

Number of spectral lines: n(n−1)/2 from level n to the ground state, and the general n₂ → n₁ form.

**Suggestion:** Keep both.

- `p-xii-8-67`, Physics XII, 8. Atoms and Nuclei › Bohr Model of Hydrogen-like Atoms
  - `N=\frac{n(n-1)}{2}`
  - Note: possible lines when many atoms de-excite from level n
- `c-xi-2-56`, Chemistry XI, 2. Structure of Atom › Bohr Model
  - `\text{Lines}=\frac{(n_2-n_1)(n_2-n_1+1)}{2}\quad\left(\text{from }n_2\to n_1\text{ downwards}\right)`
  - Note: From n to ground state: n(n-1)/2

## 16. Number of atoms in a sample

Both are "Number of atoms in a sample", but the Chemistry form includes atoms per molecule.

**Suggestion:** Keep both.

- `p-xii-8-111`, Physics XII, 8. Atoms and Nuclei › Radioactive Decay
  - `N=\frac{m}{M}N_A`
  - Note: m = mass, M = molar mass
- `c-xi-1-19`, Chemistry XI, 1. Some Basic Concepts of Chemistry › Mole Concept & Stoichiometry
  - `N_{\text{atoms}}=n\times N_A\times(\text{atoms per molecule})`
  - Note: Atomicity multiplies particle count

## 17. Mole fraction

Mole fraction for two components and the general form with Σn.

**Suggestion:** Keep both.

- `c-xii-2-18`, Chemistry XII, 2. Solutions › Concentration Terms
  - `x_{A}=\frac{n_{A}}{n_{A}+n_{B}},\quad x_{A}+x_{B}=1`
  - Note: Dimensionless; independent of T
- `c-xi-1-9`, Chemistry XI, 1. Some Basic Concepts of Chemistry › Mole Concept & Stoichiometry
  - `x_i=\frac{n_i}{\sum n_j}`

## 18. Standard hydrogen electrode

Standard hydrogen electrode as a half-reaction and as cell notation.

**Suggestion:** Keep both.

- `c-xi-8-100`, Chemistry XI, 8. Redox Reactions › Electrode Potential (Introduction)
  - `\text{2H}^{+}\text{(aq)}+2e^{-}\rightleftharpoons\text{H}_2\text{(g)},\quad E^{\circ}=0.00\ \text{V}`
  - Note: Reference electrode
- `c-xii-3-36`, Chemistry XII, 3. Electrochemistry › Electrode Potential & EMF
  - `\text{Pt}\,\|\,\text{H}_{2}(g,1\,\text{bar})\,\|\,\text{H}^{+}(aq,1\,\text{M}),\quad E^{\circ}=0.00\ \text{V}`
  - Note: Reference electrode

## 19. SN2 mechanism

SN2 mechanism as a specific example and in general form.

**Suggestion:** Keep both.

- `c-xi-10-92`, Chemistry XI, 10. Organic Chemistry – Basic Principles › Types of Reactions & Mechanisms
  - `\text{HO}^{-}+\text{CH}_3\text{Br}\rightarrow[\text{HO}\cdots\text{CH}_3\cdots\text{Br}]^{-}\rightarrow\text{CH}_3\text{OH}+\text{Br}^{-}`
  - Note: Backside attack; inversion of configuration
- `c-xii-7-48`, Chemistry XII, 7. Haloalkanes, Alcohols, Phenols, Ethers › SN1, SN2 and Elimination
  - `\text{Nu}^{-}+\text{R-X}\rightarrow[\text{Nu}\cdots\text{R}\cdots\text{X}]^{\ddagger}\rightarrow\text{Nu-R}+\text{X}^{-}`
  - Note: One step; inversion of configuration (Walden)

## 20. Prussian blue formation

Prussian blue formation as a molecular equation and an ionic equation.

**Suggestion:** Keep both.

- `c-xi-10-107`, Chemistry XI, 10. Organic Chemistry – Basic Principles › Purification & Analysis
  - `3\text{Na}_4[\text{Fe(CN)}_6]+4\text{FeCl}_3\rightarrow\text{Fe}_4[\text{Fe(CN)}_6]_3+12\text{NaCl}`
  - Note: Prussian blue = nitrogen present
- `c-xii-6-182`, Chemistry XII, 6. p-Block, d- & f-Block, Coordination › Stability & Importance of Coordination Compounds
  - `4\text{Fe}^{3+}+3[\text{Fe(CN)}_{6}]^{4-}\rightarrow\text{Fe}_{4}[\text{Fe(CN)}_{6}]_{3}\downarrow`
  - Note: Prussian blue

## 21. Nitration of benzene

Nitration of benzene, but the temperatures differ: 323–333 K and 333 K.

**Suggestion:** Your call on the correct range. Then merge.

- `c-xi-11-128`, Chemistry XI, 11. Hydrocarbons › Aromatic Hydrocarbons
  - `\text{C}_6\text{H}_6+\text{HNO}_3\xrightarrow{\text{conc. H}_2\text{SO}_4,\ 323\text{--}333\ \text{K}}\text{C}_6\text{H}_5\text{NO}_2+\text{H}_2\text{O}`
  - Note: Nitrating mixture
- `c-xii-9-33`, Chemistry XII, 9. Amines & Biomolecules › Preparation of Amines
  - `\text{C}_{6}\text{H}_{6}+\text{HNO}_{3}\xrightarrow{\text{conc. H}_{2}\text{SO}_{4},\ 333\ \text{K}}\text{C}_{6}\text{H}_{5}\text{NO}_{2}+\text{H}_{2}\text{O}`
  - Note: Nitrobenzene

## 22. Friedel-Crafts acylation

Friedel-Crafts acylation with CH₃COCl and with general RCOCl.

**Suggestion:** Keep both.

- `c-xi-11-135`, Chemistry XI, 11. Hydrocarbons › Aromatic Hydrocarbons
  - `\text{C}_6\text{H}_6+\text{CH}_3\text{COCl}\xrightarrow{\text{anhyd. AlCl}_3}\text{C}_6\text{H}_5\text{COCH}_3+\text{HCl}`
  - Note: Acetophenone
- `c-xii-8-24`, Chemistry XII, 8. Aldehydes, Ketones, Carboxylic Acids › Preparation of Aldehydes & Ketones
  - `\text{C}_{6}\text{H}_{6}+\text{RCOCl}\xrightarrow{\text{anhyd. AlCl}_{3}}\text{C}_{6}\text{H}_{5}\text{COR}+\text{HCl}`
  - Note: Aromatic ketone

## 23. Nitrite: dilute acid test

Nitrite with dilute acid, but the two equations are not the same reaction as written.

**Suggestion:** Check against your practical manual.

- `c-xi-12-19`, Chemistry XI, 12. Practical Chemistry (Paper II) › Qualitative Analysis: Anions
  - `\text{NaNO}_2+\text{HCl}\rightarrow\text{NaCl}+\text{HNO}_2;\ \ 3\text{HNO}_2\rightarrow\text{HNO}_3+2\text{NO}+\text{H}_2\text{O}`
  - Note: Brown fumes: 2NO + O2 -> 2NO2
- `c-xii-11-40`, Chemistry XII, 11. Practical Chemistry › Qualitative Analysis: Anions
  - `2\,\text{NO}_{2}^{-}+2\,\text{H}^{+}\rightarrow\text{NO}+\text{NO}_{2}+\text{H}_{2}\text{O}`
  - Note: Reddish-brown fumes of NO2

## 24. Sulphide: dilute acid test

Sulphide with dilute acid as a molecular and an ionic equation.

**Suggestion:** Keep both, or merge to the ionic form.

- `c-xi-12-23`, Chemistry XI, 12. Practical Chemistry (Paper II) › Qualitative Analysis: Anions
  - `\text{Na}_2\text{S}+2\text{HCl}\rightarrow2\text{NaCl}+\text{H}_2\text{S}\uparrow`
  - Note: Rotten egg smell
- `c-xii-11-45`, Chemistry XII, 11. Practical Chemistry › Qualitative Analysis: Anions
  - `\text{S}^{2-}+2\,\text{H}^{+}\rightarrow\text{H}_{2}\text{S}\uparrow`
  - Note: Rotten egg smell

## 25. Sulphite: dilute acid test

Sulphite with dilute acid as a molecular and an ionic equation.

**Suggestion:** Keep both, or merge to the ionic form.

- `c-xi-12-26`, Chemistry XI, 12. Practical Chemistry (Paper II) › Qualitative Analysis: Anions
  - `\text{Na}_2\text{SO}_3+2\text{HCl}\rightarrow2\text{NaCl}+\text{H}_2\text{O}+\text{SO}_2\uparrow`
  - Note: Suffocating smell of burning sulphur
- `c-xii-11-49`, Chemistry XII, 11. Practical Chemistry › Qualitative Analysis: Anions
  - `\text{SO}_{3}^{2-}+2\,\text{H}^{+}\rightarrow\text{H}_{2}\text{O}+\text{SO}_{2}\uparrow`
  - Note: Suffocating smell of burning sulphur

## 26. Phosphate: ammonium molybdate / Phosphate: ammonium molybdate test

Ammonium molybdate test, written with different reagents and balancing.

**Suggestion:** Check against your practical manual.

- `c-xi-12-48`, Chemistry XI, 12. Practical Chemistry (Paper II) › Qualitative Analysis: Anions
  - `\text{PO}_4^{3-}+12(\text{NH}_4)_2\text{MoO}_4+24\text{HNO}_3\rightarrow(\text{NH}_4)_3\text{PO}_4\cdot12\text{MoO}_3\downarrow+21\text{NH}_4\text{NO}_3+12\text{H}_2\text{O}+3\text{NO}_3^{-}`
  - Note: Canary yellow ppt on warming with conc. HNO3
- `c-xii-11-80`, Chemistry XII, 11. Practical Chemistry › Qualitative Analysis: Anions
  - `\text{PO}_{4}^{3-}+12\,\text{MoO}_{4}^{2-}+3\,\text{NH}_{4}^{+}+24\,\text{H}^{+}\rightarrow(\text{NH}_{4})_{3}[\text{P(Mo}_{3}\text{O}_{10})_{4}]\downarrow+12\,\text{H}_{2}\text{O}`
  - Note: Canary yellow ppt with conc. HNO3

## 27. Iron(III): ammonium hydroxide (group III) / Group III: Fe3+ with NaOH

Identical ionic equation, but the names give different reagents (ammonium hydroxide and NaOH).

**Suggestion:** Keep both.

- `c-xi-12-64`, Chemistry XI, 12. Practical Chemistry (Paper II) › Qualitative Analysis: Cations
  - `\text{Fe}^{3+}+3\text{OH}^{-}\rightarrow\text{Fe(OH)}_3\downarrow`
  - Note: Reddish brown ppt; NH4Cl suppresses [OH-]
- `c-xii-11-109`, Chemistry XII, 11. Practical Chemistry › Qualitative Analysis: Cations
  - `\text{Fe}^{3+}+3\,\text{OH}^{-}\rightarrow\text{Fe(OH)}_{3}\downarrow`
  - Note: Reddish-brown ppt

## 28. Potash alum crystallisation / Potash alum formula

Potash alum as a crystallisation reaction and as a formula.

**Suggestion:** Keep both.

- `c-xi-12-99`, Chemistry XI, 12. Practical Chemistry (Paper II) › Preparation of Inorganic Compounds
  - `\text{K}_2\text{SO}_4+\text{Al}_2(\text{SO}_4)_3+24\text{H}_2\text{O}\rightarrow\text{K}_2\text{SO}_4\cdot\text{Al}_2(\text{SO}_4)_3\cdot24\text{H}_2\text{O}`
  - Note: Octahedral crystals, M = 948 (KAl(SO4)2.12H2O = 474)
- `c-xii-11-169`, Chemistry XII, 11. Practical Chemistry › Preparation of Inorganic Compounds (Related)
  - `\text{K}_{2}\text{SO}_{4}\cdot\text{Al}_{2}(\text{SO}_{4})_{3}\cdot24\,\text{H}_{2}\text{O}`
  - Note: KAl(SO4)2.12H2O

## 29. Sulphate: barium chloride / Barium: sulphate

Same reaction used for two different tests (sulphate anion and barium cation).

**Suggestion:** Keep both.

- `c-xi-12-30`, Chemistry XI, 12. Practical Chemistry (Paper II) › Qualitative Analysis: Anions
  - `\text{SO}_4^{2-}+\text{Ba}^{2+}\rightarrow\text{BaSO}_4\downarrow`
  - Note: White ppt insoluble in conc. HCl
- `c-xi-12-86`, Chemistry XI, 12. Practical Chemistry (Paper II) › Qualitative Analysis: Cations
  - `\text{Ba}^{2+}+\text{SO}_4^{2-}\rightarrow\text{BaSO}_4\downarrow`
  - Note: White ppt

## 30. Oxalate: calcium chloride / Calcium: ammonium oxalate

Same reaction used for two different tests (oxalate anion and calcium cation).

**Suggestion:** Keep both.

- `c-xi-12-46`, Chemistry XI, 12. Practical Chemistry (Paper II) › Qualitative Analysis: Anions
  - `\text{C}_2\text{O}_4^{2-}+\text{Ca}^{2+}\rightarrow\text{CaC}_2\text{O}_4\downarrow`
  - Note: White ppt soluble in dilute HCl, insoluble in acetic acid
- `c-xi-12-88`, Chemistry XI, 12. Practical Chemistry (Paper II) › Qualitative Analysis: Cations
  - `\text{Ca}^{2+}+\text{C}_2\text{O}_4^{2-}\rightarrow\text{CaC}_2\text{O}_4\downarrow`
  - Note: White ppt

## 31. Decarboxylation of sodium salt of acid / Methane from sodium acetate (lab)

Methane from sodium acetate appears as two pairs that differ only by the Δ over the arrow. Each pair is already merged across classes.

**Suggestion:** Merge the two pairs into one.

- `c-xi-11-1`, Chemistry XI, 11. Hydrocarbons › Alkanes: Preparation
  - `\text{CH}_3\text{COONa}+\text{NaOH}\xrightarrow{\text{CaO},\ \Delta}\text{CH}_4+\text{Na}_2\text{CO}_3`
  - Note: Soda lime; removes one carbon
- `c-xi-11-21`, Chemistry XI, 11. Hydrocarbons › Alkanes: Preparation
  - `\text{CH}_3\text{COONa}+\text{NaOH}\xrightarrow{\text{CaO}}\text{CH}_4+\text{Na}_2\text{CO}_3`
  - Note: Laboratory preparation

## 32. Elevation of boiling point

Elevation of boiling point with and without the van't Hoff factor i.

**Suggestion:** Keep both, and rename the second "with van't Hoff factor".

- `c-xii-2-3`, Chemistry XII, 2. Solutions › Colligative Properties
  - `\Delta T_{b}=K_{b}\cdot m`
- `c-xii-2-13`, Chemistry XII, 2. Solutions › Colligative Properties
  - `\Delta T_b=iK_bm`

## 33. Depression of freezing point

Depression of freezing point with and without the van't Hoff factor i.

**Suggestion:** Keep both, and rename the second "with van't Hoff factor".

- `c-xii-2-4`, Chemistry XII, 2. Solutions › Colligative Properties
  - `\Delta T_{f}=K_{f}\cdot m`
- `c-xii-2-14`, Chemistry XII, 2. Solutions › Colligative Properties
  - `\Delta T_f=iK_fm`

## 34. Molar conductivity

Molar conductivity as κ/c and as κ × 1000/C. Same idea, different concentration units.

**Suggestion:** Keep both.

- `c-xii-3-6`, Chemistry XII, 3. Electrochemistry › Cells & Conductance
  - `\Lambda_{m}=\frac{\kappa}{c}`
  - Note: κ = conductivity
- `c-xii-3-15`, Chemistry XII, 3. Electrochemistry › Cells & Conductance
  - `\Lambda_{m}=\frac{\kappa\times 1000}{C}`
  - Note: C in mol/L

## 35. pH of salt of weak acid + strong base / pH of salt of weak acid and strong base

pH of a salt of a weak acid and strong base, with ½pK_w and with 7. These are equal only at 25 °C.

**Suggestion:** Keep the general form, or both.

- `c-xi-7-14`, Chemistry XI, 7. Equilibrium › Chemical & Ionic
  - `\mathrm{pH}=\frac{1}{2}\mathrm{p}K_{w}+\frac{1}{2}\mathrm{p}K_{a}+\frac{1}{2}\log C`
- `c-xi-7-151`, Chemistry XI, 7. Equilibrium › Salt Hydrolysis
  - `\text{pH}=7+\tfrac{1}{2}\text{p}K_a+\tfrac{1}{2}\log C`
  - Note: e.g. sodium acetate

## 36. General outer configuration of d-block / General configuration of d-block

These disagree. c-xi-2-124 gives d-block configuration (n−1)d¹⁻¹⁰ ns⁰⁻² and c-xii-6-3 gives ns¹⁻². Palladium is the usual exception (4d¹⁰ 5s⁰).

**Suggestion:** Merge to the ns⁰⁻² form if your syllabus includes Pd.

- `c-xi-2-124`, Chemistry XI, 2. Structure of Atom › Electronic Configuration
  - `(n-1)d^{1\text{--}10}\,ns^{0\text{--}2}`
  - Note: Pd is 4d10 5s0
- `c-xii-6-3`, Chemistry XII, 6. p-Block, d- & f-Block, Coordination › d-Block: Configuration & Properties
  - `(n-1)d^{1-10}\,ns^{1-2}`
  - Note: Zn, Cd, Hg (d10) not strictly transition elements

## 37. Difference using complement / Event 'A but not B'

Identical LaTeX, A − B = A ∩ B′, in Sets and in Probability (as an event).

**Suggestion:** Keep both.

- `m-xi-1-36`, Mathematics XI, 1. Sets and Functions › Laws of Sets
  - `A-B=A\cap B'`
- `m-xi-5-73`, Mathematics XI, 5. Statistics and Probability › Sample Space & Events
  - `A\cap B'=A-B`

## 38. cos C − cos D / cos D − cos C (alternative sign)

cos C − cos D and its rearrangement cos D − cos C.

**Suggestion:** Merge unless you find the second form useful.

- `m-xi-1-17d`, Mathematics XI, 1. Sets and Functions › Trigonometric Functions
  - `\cos C-\cos D=-2\sin\frac{C+D}{2}\sin\frac{C-D}{2}`
- `m-xi-1-411`, Mathematics XI, 1. Sets and Functions › Sum-to-Product Identities
  - `\cos D-\cos C=2\sin\frac{C+D}{2}\sin\frac{C-D}{2}`

## 39. Area of a circular segment

Both are "Area of a circular segment": a closed form in θ, and an integral form.

**Suggestion:** Keep both.

- `m-xi-1-180`, Mathematics XI, 1. Sets and Functions › Angle Measure & Arcs
  - `A=\frac{1}{2}r^{2}(\theta-\sin\theta)`
  - Note: θ in radians
- `m-xii-3-418`, Mathematics XII, 3. Calculus › Area Under Curves
  - `\text{Area to the right of }x=h:\ A=2\int_{h}^{a}\sqrt{a^{2}-x^{2}}\,dx`
  - Note: Circle x² + y² = a²

## 40. GP sum (r ≠ 1) / Sum of GP for r < 1

GP sum as a(rⁿ−1)/(r−1) and as a(1−rⁿ)/(1−r). Algebraically equal, but each is convenient for a different r.

**Suggestion:** Keep both.

- `m-xi-2-13`, Mathematics XI, 2. Algebra › Linear Inequalities & Sequences
  - `S_{n}=a\frac{r^{n}-1}{r-1}`
- `m-xi-2-237`, Mathematics XI, 2. Algebra › Geometric Progression
  - `S_{n}=\frac{a(1-r^{n})}{1-r}\quad(r\ne1)`
  - Note: Same value as a(r^n − 1)/(r − 1)

## 41. Square of a sum and difference / Perfect square trinomial test

The same identity read in reverse, named "Perfect square trinomial test".

**Suggestion:** Merge.

- `m-xi-2-414`, Mathematics XI, 2. Algebra › Algebraic Identities & Special Values
  - `(a\pm b)^{2}=a^{2}\pm2ab+b^{2}`
- `m-xi-2-441`, Mathematics XI, 2. Algebra › Algebraic Identities & Special Values
  - `a^{2}\pm2ab+b^{2}=(a\pm b)^{2}`

## 42. Powers of 2

Powers of 2 over different ranges in Mathematics and Computer Science.

**Suggestion:** Merge into the longer table in Computer Science.

- `m-xi-2-489`, Mathematics XI, 2. Algebra › Constants & Approximations
  - `2^{5}=32,\ 2^{6}=64,\ 2^{7}=128,\ 2^{8}=256,\ 2^{9}=512,\ 2^{10}=1024`
- `cs-xi-1-34`, Computer Science XI, 1. Computer Fundamentals & Number Systems › Number Systems
  - `\begin{aligned}&2^{0}=1,\ 2^{1}=2,\ 2^{2}=4,\ 2^{3}=8,\ 2^{4}=16,\ 2^{5}=32\\&2^{6}=64,\ 2^{7}=128,\ 2^{8}=256,\ 2^{9}=512,\ 2^{10}=1024\end{aligned}`

## 43. Angle between two lines / Angle between two curves

Identical LaTeX, but one is the angle between two lines and the other between two curves (using tangent slopes).

**Suggestion:** Keep both.

- `m-xi-3-8`, Mathematics XI, 3. Coordinate Geometry › Straight Lines
  - `\tan\theta=\left\|\frac{m_{1}-m_{2}}{1+m_{1}m_{2}}\right\|`
- `m-xii-3-161`, Mathematics XII, 3. Calculus › Tangents and Normals
  - `\tan\theta=\left\|\frac{m_{1}-m_{2}}{1+m_{1}m_{2}}\right\|`
  - Note: m1, m2 slopes of tangents at the point of intersection

## 44. Centroid of a triangle

Centroid of a triangle in coordinates and in vector form.

**Suggestion:** Keep both.

- `m-xi-3-28`, Mathematics XI, 3. Coordinate Geometry › Points & Coordinates
  - `G=\left(\frac{x_{1}+x_{2}+x_{3}}{3},\frac{y_{1}+y_{2}+y_{3}}{3}\right)`
  - Note: Divides each median 2 : 1
- `m-xii-4-54`, Mathematics XII, 4. Vectors and 3-D Geometry › Position and Section Formulae
  - `\vec{g}=\frac{\vec{a}+\vec{b}+\vec{c}}{3}`
  - Note: Coordinates: ((x₁+x₂+x₃)/3, (y₁+y₂+y₃)/3, (z₁+z₂+z₃)/3)

## 45. Fourth vertex of a parallelogram

Fourth vertex of a parallelogram in coordinates and in vector form.

**Suggestion:** Keep both.

- `m-xi-3-32`, Mathematics XI, 3. Coordinate Geometry › Points & Coordinates
  - `D=A+C-B=(x_{1}+x_{3}-x_{2},\ y_{1}+y_{3}-y_{2})`
  - Note: ABCD with AC and BD as diagonals
- `m-xii-4-59`, Mathematics XII, 4. Vectors and 3-D Geometry › Position and Section Formulae
  - `\vec{d}=\vec{a}+\vec{c}-\vec{b}`
  - Note: ABCD in order

## 46. Centroid of a tetrahedron

Centroid of a tetrahedron in coordinates and in vector form.

**Suggestion:** Keep both.

- `m-xi-3-235`, Mathematics XI, 3. Coordinate Geometry › 3-D Geometry (Intro)
  - `\left(\frac{\sum x_{i}}{4},\frac{\sum y_{i}}{4},\frac{\sum z_{i}}{4}\right)`
- `m-xii-4-55`, Mathematics XII, 4. Vectors and 3-D Geometry › Position and Section Formulae
  - `\vec{g}=\frac{\vec{a}+\vec{b}+\vec{c}+\vec{d}}{4}`

## 47. Collinearity of three points in 3-D

Collinearity in 3-D by distances and by vectors.

**Suggestion:** Keep both.

- `m-xi-3-243`, Mathematics XI, 3. Coordinate Geometry › 3-D Geometry (Intro)
  - `d(A,B)+d(B,C)=d(A,C)\ \ \text{(B between A and C)}`
- `m-xii-4-129`, Mathematics XII, 4. Vectors and 3-D Geometry › 3-D Coordinates and Axes
  - `A,B,C\ \text{collinear}\iff\overrightarrow{AB}\ \text{and}\ \overrightarrow{BC}\ \text{have proportional components}`
  - Note: Or AB + BC = AC

## 48. Concurrency of three lines / Consistency of 3 equations in 2 variables

Identical determinant = 0, used for concurrency of three lines and for consistency of three equations in two variables.

**Suggestion:** Keep both.

- `m-xi-3-95`, Mathematics XI, 3. Coordinate Geometry › Straight Lines
  - `\begin{vmatrix}a_{1}&b_{1}&c_{1}\\a_{2}&b_{2}&c_{2}\\a_{3}&b_{3}&c_{3}\end{vmatrix}=0`
- `m-xii-2-134`, Mathematics XII, 2. Algebra › Systems of Linear Equations
  - `\begin{vmatrix}a_1&b_1&c_1\\a_2&b_2&c_2\\a_3&b_3&c_3\end{vmatrix}=0`
  - Note: Necessary condition for consistency (lines concurrent)

## 49. Rate of change of the area of a circle / Rate of change of circle area

Rate of change of a circle's area, as dA/dr and as dA/dt (with the chain rule).

**Suggestion:** Keep both.

- `m-xi-4-161`, Mathematics XI, 4. Calculus › Meaning of the Derivative
  - `\frac{dA}{dr}=2\pi r\quad(A=\pi r^{2})`
- `m-xii-3-126`, Mathematics XII, 3. Calculus › Rate of Change
  - `A=\pi r^{2}\Rightarrow\frac{dA}{dt}=2\pi r\frac{dr}{dt}`
  - Note: Circumference C = 2πr, dC/dt = 2π dr/dt

## 50. Rate of change of the volume of a sphere / Rate of change of sphere volume

Rate of change of a sphere's volume, as dV/dr and as dV/dt (with the chain rule).

**Suggestion:** Keep both.

- `m-xi-4-162`, Mathematics XI, 4. Calculus › Meaning of the Derivative
  - `\frac{dV}{dr}=4\pi r^{2}\quad\left(V=\tfrac{4}{3}\pi r^{3}\right)`
- `m-xii-3-127`, Mathematics XII, 3. Calculus › Rate of Change
  - `V=\frac43\pi r^{3}\Rightarrow\frac{dV}{dt}=4\pi r^{2}\frac{dr}{dt}`
  - Note: Surface area S = 4πr², dS/dt = 8πr dr/dt

## 51. Symmetric matrix

Symmetric matrix as Aᵀ = A and as the array condition A[i][j] = A[j][i].

**Suggestion:** Keep both, since the Computer Science form is the one used in code.

- `m-xii-1-10b`, Mathematics XII, 2. Algebra › Matrices & Determinants
  - `A^{T}=A`
- `cs-xi-10-56`, Computer Science XI, 10. Arrays and Strings › Two-Dimensional Arrays
  - `A[i][j]=A[j][i]\ \text{ for all }i,j\quad(A=A^{T})`
  - Note: Must be square

## 52. Barium: ammonium carbonate (group V) / Group V: Ba2+ with ammonium carbonate

Barium with ammonium carbonate as an ionic equation and with the full reagent.

**Suggestion:** Keep both, or merge to the ionic form.

- `c-xi-12-84`, Chemistry XI, 12. Practical Chemistry (Paper II) › Qualitative Analysis: Cations
  - `\text{Ba}^{2+}+\text{CO}_3^{2-}\rightarrow\text{BaCO}_3\downarrow`
  - Note: White ppt; also Sr2+ and Ca2+
- `c-xii-11-127`, Chemistry XII, 11. Practical Chemistry › Qualitative Analysis: Cations
  - `\text{Ba}^{2+}+(\text{NH}_{4})_{2}\text{CO}_{3}\rightarrow\text{BaCO}_{3}\downarrow+2\,\text{NH}_{4}^{+}`
  - Note: White ppt (Ca2+, Sr2+ also)

## 53. Aluminium: ammonium hydroxide (group III) / Group III: Al3+ with NH4OH

Aluminium with ammonium hydroxide, written with OH⁻ and with NH₄OH.

**Suggestion:** Keep both, or merge to the ionic form.

- `c-xi-12-68`, Chemistry XI, 12. Practical Chemistry (Paper II) › Qualitative Analysis: Cations
  - `\text{Al}^{3+}+3\text{OH}^{-}\rightarrow\text{Al(OH)}_3\downarrow`
  - Note: White gelatinous ppt
- `c-xii-11-103`, Chemistry XII, 11. Practical Chemistry › Qualitative Analysis: Cations
  - `\text{Al}^{3+}+3\,\text{NH}_{4}\text{OH}\rightarrow\text{Al(OH)}_{3}\downarrow+3\,\text{NH}_{4}^{+}`
  - Note: White gelatinous ppt

## 54. Bohr energy levels / Bohr energy (H-atom)

Bohr energy levels with and without Z. Named for hydrogen, but the Chemistry form is the general hydrogen-like one.

**Suggestion:** Keep both, since the Z form is more general.

- `p-xii-8-2`, Physics XII, 8. Atoms and Nuclei › Bohr Model & Radioactivity
  - `E_{n}=-\frac{13.6}{n^{2}}\,\text{eV}`
  - Note: Hydrogen
- `c-xi-2-4`, Chemistry XI, 2. Structure of Atom › Quantum & Bohr
  - `E_{n}=-\frac{13.6Z^{2}}{n^{2}}\,\text{eV}`

## 55. Alkyne general formula / Diene and cycloalkene general formula

Identical CₙH₂ₙ₋₂ for alkynes and for dienes/cycloalkenes. These are isomeric classes, not the same thing.

**Suggestion:** Keep both.

- `c-xi-10-4`, Chemistry XI, 10. Organic Chemistry – Basic Principles › Nomenclature & Isomerism
  - `\mathrm{C}_{n}\mathrm{H}_{2n-2}`
- `c-xi-10-8`, Chemistry XI, 10. Organic Chemistry – Basic Principles › General Formulae of Homologous Series
  - `\text{C}_n\text{H}_{2n-2}`
  - Note: Isomeric with alkynes
