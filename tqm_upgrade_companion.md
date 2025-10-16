# Upgrade Companion to the Trilogy
## Metric-Guided Braid Evolution & Participatory Validation (Merged Golden Patch)

**Version:** 2.1 Unified Extension  
**Context:** Companion to *Preface*, *Book II §8*  
**Purpose:** Integrate metric geometry, participatory validation, and invariant-preserving rebraid into a unified, simulation-ready framework.

---

## I. Motivation

The Trilogy established the foundation:
- ∇ as the fundamental contraction operator
- ICE validators ensuring Interface/Center/Evidence integrity
- Receipt append as the ledger mechanism

This upgrade makes those loops explicit, tunable, and backward-compatible by adding:
1. Metric geometry (g_x, g_y) → adaptive contraction
2. Participatory validators → self/shared ICE feedback
3. Ethics tolerances (ε_I, ε_C, ε_E)
4. Invariant-preserving rebraid → safe reorganization
5. Thermodynamic softness (β) → unified control of stochasticity

---

## II. Core Operator Definitions

### 2.1 Master Update Step

Φ_{n+1} = ℰ' ( Λ^∧([ICE]_self, [ICE]_shared, κ, ε, β) ∘ [ICE]_ℓ ∘ ∇^(braid)_{g_x,g_y} )(Φ_n)

**Order of application (right to left):**
1. Metric-guided contraction
2. Local physical ICE aperture
3. Participatory validators (self + shared)
4. Commit via ethics-weighted compositor
5. Append emergence receipt → update ledger

---

### 2.2 Metric-Guided Contraction ∇^(braid)_{g_x,g_y}

**Domain:** H_Ω → H_Ω

**Definition:**
Φ' = exp_Φ(-α g^{-1}∇_Φ ℓ_P)

**Properties:**
- Follows geodesics in (g_x,g_y)-geometry
- Reduces to classical ∇ when g_x=g_y=1
- Metric can be learned as Fisher/Hessian of validator loss
- Default diagonal form: g=diag(g_x,g_y)

---

### 2.3 Local Physical ICE Aperture [ICE]_ℓ

**Domain:** H_Ω → H_Ω^(valid)

**Function:** Enforces finite-scale locality—only strands within ℓ interact.

**Local Topological Conservation.** [ICE]_ℓ acts via aperture-local isotopies; therefore 𝒥 (chosen invariants) are conserved. Physical quantities (energy, charge) are enforced by standard continuity constraints.

---

### 2.4 Participatory Validators

**[ICE]_self**
- **Domain:** Individual braid region
- **Checks:** Center coherence, evidence sufficiency
- **Output:** (Φ", flags_self = {center_conflict, evidence_gap, visibility:true})

**[ICE]_shared**
- **Domain:** Cross-braid interface
- **Checks:** Interface alignment, handshake validity
- **Output:** (Φ"', flags_shared = {interface_mismatch, handshake_fail, visibility:true})

**Participatory property:** Agents see their own validation states, generating reflexive accountability.

---

### 2.5 Ethics-Compositor Λ^∧(κ,ε,β)

**Domain:** H_Ω^(valid) → H_Ω^(commit)

**Parameters:**
- κ — commitment strength (0=soft, 1=hard)
- β — temperature: controls stochasticity and aperture width
- ε = (ε_I, ε_C, ε_E) — interface, center, and evidence tolerances

**Lyapunov Contractiveness.** With local averaging [ICE]_ℓ and 0 < κ < 1, the metric distance V(Φ)=d_g(Φ,Φ*)^2 satisfies  V(Φ_{n+1}) ≤ κ²V(Φ_n) + η(ℓ,β).

---

### 2.6 Emergence & Receipt Append ℰ'

**Domain:** H_Ω^(commit) → H_Ω × Receipts

**Dual Output:**
1. Updated braid state Φ_{n+1}
2. Receipt r_{n+1}:
   - parent_hash, timestamp
   - validators_fired, κ, β
   - ε_I, ε_C, ε_E
   - invariants_snapshot (𝒥)
   - signer_id, hash
   - hash = BLAKE3(parent_hash || canonical_json(r))

---

### 2.7 Invariant-Preserving Rebraid R_t

**Domain:** H_Ω → H_Ω

**Invariant-Preserving Rebraid.** After ℰ', apply R_t to allow reorganization without altering observables:
Φ_{n+1} → Φ'_{n+1} with 𝒥(Φ'_{n+1}) = 𝒥(Φ_{n+1}), and 𝓛(Φ'_{n+1}) = 𝓛(Φ_{n+1}).

**Permitted moves:** (i) local slide; (ii) 2–2 flip on square faces.

---

### 2.8 Continuum Recovery (Bridge Limit)

**Proposition (Bridge Recovery, O(Δx²)).**  
With g_x=g_y=1, fixed aperture width ℓ and time step Δt (ℓ²/Δt→D), and soft mode (κ→0, large ε):
Φ_{n+1} = Φ_n + Δt(DΔΦ_n) + O(Δx²),
recovering the Laplacian step and Schrödinger form under probability conservation.

---

## III. Integration with Trilogy Structure

| Book | Focus | Upgrade Role |
|------|--------|---------------|
| Book I: The Infinite (Metaphysics) | Wholeness ↔ Contraction | Defines geometric field (g_x,g_y) |
| Book II: The Bridge (Physics) | Contraction ↔ Emergence | Recovers Laplacian (O(Δx²)) & metric dynamics |
| Book III: The Praxis (Ethics) | Validation ↔ Participation | Enforces participatory feedback and ethical tolerances |

---

## IV. Validation Checklist

| Test | Expected Behavior |
|------|-------------------|
| Continuum limit | Soft mode, isotropic metric → Laplacian recovery |
| Invariant check | 𝒥 unchanged per tick under R_t |
| Receipt chain | 𝓛 updates only via ℰ'; hash chain validates |
| Participatory ε | Tighten ε_I → quarantine boundary strands; tighten ε_C → reject contradictions |
| Metric anisotropy | Directional contraction; invariants and receipts preserved |

---

## V. Closing Reflection

The upgrade preserves the Trilogy’s essence while adding operational rigor. Every contraction follows information geometry, every validation is participatory and visible, every commit tunable through ethical policy, and every rebraid provably safe.

**The braid doesn’t just evolve—it evolves responsibly.**

