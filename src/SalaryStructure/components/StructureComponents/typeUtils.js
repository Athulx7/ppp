export const BLANK_FORM = {
    componentId: '', component_code: '', component_name: '',
    type_code: '', calc_code: '', fixed_amount: '',
    percentage_value: '', base_component_code: '', formula_expression: '',
}

export const TYPE_COLOR_PALETTE = [
    { bg: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400', border: 'border-l-emerald-400' },
    { bg: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-400', border: 'border-l-red-400' },
    { bg: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-400', border: 'border-l-blue-400' },
    { bg: 'bg-violet-100 text-violet-700 border-violet-200', dot: 'bg-violet-400', border: 'border-l-violet-400' },
    { bg: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-400', border: 'border-l-amber-400' },
    { bg: 'bg-cyan-100 text-cyan-700 border-cyan-200', dot: 'bg-cyan-400', border: 'border-l-cyan-400' },
]

export const FALLBACK_COLOR = {
    bg: 'bg-gray-100 text-gray-500 border-gray-200',
    dot: 'bg-gray-300',
    border: 'border-l-gray-300'
}

export function buildTypeMap(componentTypes) {
    const map = {}
    componentTypes.forEach((t, i) => {
        map[t.value] = {
            label: t.label,
            colors: TYPE_COLOR_PALETTE[i] || FALLBACK_COLOR
        }
    })
    return map
}