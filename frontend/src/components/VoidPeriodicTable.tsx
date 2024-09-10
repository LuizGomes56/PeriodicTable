import { Families, Layout } from "../types";

const Cell = ({ protons }: { protons: number }) => {
    return (
        <td className="border p-0 border-black transition-all h-16 w-16 duration-200">
            <div className="flex flex-col justify-center text-center relative h-full">
                <span className="leading-none absolute top-0.5 right-0.5">{protons}</span>
            </div>
        </td>
    )
}

const VoidCell = () => {
    return (
        <td className="p-0">
            <div className="w-16 h-8"></div>
        </td>
    )
}

const SpecialCell = ({ exec }: { exec: number }) => {
    return (
        <td className="p-0">
            <div className="w-16 text-center font-semibold">{exec < 88 ? "57-71" : "89-103"}</div>
        </td>
    )
}

export default function VoidPeriodicTable() {
    let n = 0;
    return (
        <table>
            <thead>
                <tr>
                    {Families.map((f, i) => <th className="p-0 h-16" key={i}>{f}</th>)}
                </tr>
            </thead>
            <tbody>{Layout.map((row, i) => {
                return <tr key={i}>
                    {row.map((cell, j) => {
                        if (cell > 1) {
                            n += 15;
                            return <SpecialCell key={j} exec={n} />;
                        }
                        if (n > 117) { n = 56; }
                        if (n == 70) { n = 87; }
                        if (cell && n < 118) {
                            n++;
                            return <Cell key={j} protons={n} />
                        }
                        else { return <VoidCell key={j} /> }
                    })}
                </tr>
            })}</tbody>
        </table>
    )
}