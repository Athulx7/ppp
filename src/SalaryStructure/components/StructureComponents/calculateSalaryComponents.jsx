/**
 * calculateSalaryComponents
 *
 * Evaluates every component's actual monetary value using:
 *   - fixed_amount  → direct value
 *   - formula_expression → eval after substituting known codes
 *   - percentage_value + base_component_code → % of base
 *
 * Then applies payrollImpact (add / sub / employer) from componentTypes
 * to compute the correct net estimated monthly cost.
 *
 * @param {Array}  components      - structure.components
 * @param {Array}  componentTypes  - [{ value: type_code, label, payrollImpact }]
 * @param {Array}  calculationOptions - [{ value: calc_code, requires_formula, requires_percentage }]
 *
 * @returns {Object} {
 *   values:    { [component_code]: number }  — raw resolved value per component
 *   netCost:   number                         — earnings − deductions (employer excluded)
 *   breakdown: { add: number, sub: number, employer: number }
 * }
 */
export function calculateSalaryComponents(components, componentTypes = [], calculationOptions = []) {

    // ── Step 1: Build payrollImpact lookup by type_code ───────────────────────
    // e.g. { SCT001: 'add', SCT002: 'sub', SCT003: 'employer' }
    // Uses whatever codes the DB returns — no hardcoding.
    const impactByTypeCode = {}
    componentTypes.forEach(t => {
        impactByTypeCode[t.value] = t.payrollImpact // 'add' | 'sub' | 'employer'
    })

    // ── Step 2: Build calc type lookup ────────────────────────────────────────
    const calcByCode = {}
    calculationOptions.forEach(c => { calcByCode[c.value] = c })

    // ── Step 3: First pass — resolve all FIXED amount components ─────────────
    // These are known immediately and serve as base values for % and formula refs.
    const values = {}
    components.forEach(comp => {
        const calcType = calcByCode[comp.calc_code]
        if (!calcType) return
        if (!calcType.requires_formula && !calcType.requires_percentage) {
            // Fixed amount
            values[comp.component_code] = parseFloat(comp.fixed_amount) || 0
        }
    })

    // ── Step 4: Second pass — resolve PERCENTAGE components ──────────────────
    // Base component must already be in `values` from step 3.
    components.forEach(comp => {
        const calcType = calcByCode[comp.calc_code]
        if (!calcType || !calcType.requires_percentage) return
        if (!comp.base_component_code) { values[comp.component_code] = 0; return }
        const baseAmount = values[comp.base_component_code] || 0
        values[comp.component_code] = ((parseFloat(comp.percentage_value) || 0) / 100) * baseAmount
    })

    // ── Step 5: Third pass — resolve FORMULA components ──────────────────────
    // Substitute all known codes, then eval safely.
    components.forEach(comp => {
        const calcType = calcByCode[comp.calc_code]
        if (!calcType || !calcType.requires_formula) return
        if (!comp.formula_expression) { values[comp.component_code] = 0; return }

        let formula = comp.formula_expression
        // Replace each known component code with its resolved number
        Object.keys(values).forEach(code => {
            const regex = new RegExp(`\\b${code}\\b`, 'g')
            formula = formula.replace(regex, values[code])
        })

        try {
            // Only allow safe arithmetic — no function calls or identifiers remain
            const result = eval(formula) // eslint-disable-line no-eval
            values[comp.component_code] = isFinite(result) ? result : 0
        } catch {
            values[comp.component_code] = 0
        }
    })

    // ── Step 6: Apply payrollImpact to compute net cost ───────────────────────
    // 'add'      → earnings   → add to net cost
    // 'sub'      → deductions → subtract from net cost
    // 'employer' → employer contributions → tracked separately, not in net cost
    const breakdown = { add: 0, sub: 0, employer: 0 }

    components.forEach(comp => {
        const amount = values[comp.component_code] || 0
        const impact = impactByTypeCode[comp.type_code] // 'add' | 'sub' | 'employer'

        if (impact === 'add') {
            breakdown.add += amount
        } else if (impact === 'sub') {
            breakdown.sub += amount
        } else if (impact === 'employer') {
            breakdown.employer += amount
        }
        // unknown impact type → ignored (safe default)
    })

    const netCost = breakdown.add - breakdown.sub

    return { values, netCost, breakdown }
}