

export default function Select({options, value, onChange}){

    const items = []

    for (const {label, val} of options) {
      items.push(<option value={val}>{label}</option>)
    }
        return (
        <select value={value} onChange={onChange}>
            {items}
        </select>
    )
}