import { useEffect, useRef } from "react";
import { Difficulty, Families, GameProps, GroupColors, Languages, Layout } from "../types";

type ChangePropertyProps = { width: string, height: string, symbolSize: string, truncateAt: string, truncateSize: string, protonSize: string };

const VanishTimeOut = 1250;

const EventStyles = {
    onCorrect: "bg-correct",
    onWrong: "bg-wrong",
    wrong: "#f87171",
    correct: [
        "#00FA9A", "#a3e635", "#fbbf24", "#f97316"
    ]
}

let TableSize = {
    width: "w-16",
    height: "h-16",
    symbolSize: "text-lg",
    truncateAt: "w-14",
    truncateSize: "text-sm",
    protonSize: "text-base"
} as ChangePropertyProps;

const Sizesheet: Record<string, ChangePropertyProps> = {
    "0": {
        width: "w-[40px]",
        height: "h-[40px]",
        symbolSize: "text-xs",
        truncateAt: "w-8",
        truncateSize: "text-[0.525rem]",
        protonSize: "text-[0.575rem]"
    },
    "1": {
        width: "w-[42px]",
        height: "h-[42px]",
        symbolSize: "text-[0.8rem]",
        truncateAt: "w-9",
        truncateSize: "text-[0.55rem]",
        protonSize: "text-[0.6rem]"
    },
    "2": {
        width: "w-[44px]",
        height: "h-[44px]",
        symbolSize: "text-[0.85rem]",
        truncateAt: "w-9",
        truncateSize: "text-[0.625rem]",
        protonSize: "text-[0.65rem]"
    },
    "3": {
        width: "w-[46px]",
        height: "h-[46px]",
        symbolSize: "text-sm",
        truncateAt: "w-10",
        truncateSize: "text-[0.65rem]",
        protonSize: "text-[0.675rem]"
    },
    "4": {
        width: "w-[48px]",
        height: "h-[48px]",
        symbolSize: "text-[0.9rem]",
        truncateAt: "w-10",
        truncateSize: "text-[0.7rem]",
        protonSize: "text-[0.7rem]"
    },
    "5": {
        width: "w-[52px]",
        height: "h-[52px]",
        symbolSize: "text-[0.95rem]",
        truncateAt: "w-11",
        truncateSize: "text-[0.7rem]",
        protonSize: "text-xs"
    },
    "6": {
        width: "w-[56px]",
        height: "h-[56px]",
        symbolSize: "text-base",
        truncateAt: "w-12",
        truncateSize: "text-xs",
        protonSize: "text-[0.85rem]"
    },
    "7": {
        width: "w-[60px]",
        height: "h-[60px]",
        symbolSize: "text-base",
        truncateAt: "w-[54px]",
        truncateSize: "text-[0.8rem]",
        protonSize: "text-[0.9rem]"
    },
    "8": {
        width: "w-[64px]",
        height: "h-[64px]",
        symbolSize: "text-[1.05rem]",
        truncateAt: "w-14",
        truncateSize: "text-[0.8rem] leading-4",
        protonSize: "text-[0.925rem]"
    },
    "9": {
        width: "w-[68px]",
        height: "h-[68px]",
        symbolSize: "text-lg",
        truncateAt: "w-16",
        truncateSize: "text-[0.825rem] leading-4",
        protonSize: "text-[0.95rem]"
    },
}

const Cell = ({ protons, symbol, name, type, config, onClick }: { protons: number, symbol: string, name: string, type: string, config: Difficulty["table"], onClick: (cell: number, ref: React.RefObject<HTMLTableCellElement>) => void }) => {
    const bg = config.colors ? GroupColors[type as keyof typeof GroupColors] : '';
    const cellRef = useRef<HTMLTableCellElement>(null);
    return (
        <td ref={cellRef} onClick={() => onClick(protons, cellRef)} className={`${bg ? bg : "bg-white"} select-none cursor-pointer border p-0 border-black transition-all ${TableSize.height} ${TableSize.width} duration-200 ${bg}`}>
            <div className="aspect-square flex flex-col justify-center text-center relative h-full">
                {config.protons && <span className={`leading-none absolute ${TableSize.protonSize} top-0.5 right-0.5`}>{protons}</span>}
                {config.symbol && <span className={`leading-5 ${TableSize.symbolSize} font-medium`}>{symbol}</span>}
                {config.name && <span className={`${TableSize.truncateSize} leading-none truncate ${TableSize.truncateAt} place-self-center`}>{name}</span>}
            </div>
        </td>
    )
}

const VoidCell = () => {
    return (
        <td className="p-0">
            <div className={`${TableSize.width} h-8`}></div>
        </td>
    )
}

const SpecialCell = ({ exec }: { exec: number }) => {
    return (
        <td className="p-0 dark:text-white">
            <div className={`${TableSize.protonSize} text-center font-semibold`}>{exec < 88 ? "57-71" : "89-103"}</div>
        </td>
    )
}

export default function PeriodicTable(
    {
        game,
        config,
        paused,
        started,
        lang,
        tableSize,
        draft,
        wrongGuesses,
        setWrongGuesses,
        setOptions,
        setCount,
        setArcadeTime
    }: {
        game: GameProps,
        paused: boolean,
        started: boolean,
        wrongGuesses: number,
        setWrongGuesses: React.Dispatch<React.SetStateAction<number>>,
        setOptions: React.Dispatch<React.SetStateAction<number[]>>,
        setCount: React.Dispatch<React.SetStateAction<number>>,
        setArcadeTime: React.Dispatch<React.SetStateAction<number>>,
        config: Difficulty,
        draft: number,
        lang: string,
        tableSize: number
    }) {

    let n = 0;

    useEffect(() => {
        if (!config.errorProtection) {
            const WrongCells = document.querySelectorAll(`td.${EventStyles.onWrong}`);
            WrongCells.forEach((cell) => cell.classList.remove(EventStyles.onWrong));
        }
        if (!config.answerPersist) {
            const CorrectCells = document.querySelectorAll(`td.${EventStyles.onCorrect}`);
            CorrectCells.forEach((cell) => cell.classList.remove(EventStyles.onCorrect));
        }
    }, [config.errorProtection, config.answerPersist]);

    TableSize = { ...TableSize, ...Sizesheet[tableSize] };

    const PlayerClick = (local: number, cellRef: React.RefObject<HTMLTableCellElement>) => {
        if (!cellRef.current || paused) { return };

        const cell = cellRef.current;

        if (cell.classList.contains(EventStyles.onWrong) || cell.classList.contains(EventStyles.onCorrect)) return;

        const bgColor = cell.style.backgroundColor;

        setCount(prev => prev + 1);

        const WrongCells = document.querySelectorAll(`td.${EventStyles.onWrong}`);

        if ((local - 1) == draft) {
            WrongCells.forEach((cell) => cell.classList.remove(EventStyles.onWrong));

            setArcadeTime(prev => prev + config.arcade.bonusTime);

            setOptions(prev => {
                return prev.filter(num => num !== (local - 1));
            });

            cell.classList.add(EventStyles.onCorrect, 'cursor-default');
            cell.style.backgroundColor = EventStyles.correct[wrongGuesses] || EventStyles.correct[EventStyles.correct.length - 1];

            if (!config.answerPersist) {
                setTimeout(() => {
                    cell.classList.remove(EventStyles.onCorrect);
                }, VanishTimeOut);
            }
            setWrongGuesses(0);
        }
        else {
            setArcadeTime(prev => prev - config.arcade.penaltyTime);
            if (config.errorProtection) {
                cell.classList.add(EventStyles.onWrong, 'cursor-default');
            }
            else {
                cell.classList.add(EventStyles.onWrong);
                setTimeout(() => {
                    cell.classList.remove(EventStyles.onWrong);
                    cell.style.backgroundColor = bgColor;
                }, VanishTimeOut);
            }
            setWrongGuesses(prev => prev + 1);
        }
    }

    return (
        <table className={`border-collapse table-auto xl:w-full ${paused || !started ? 'pointer-events-none' : ''}`}>
            <thead>
                <tr>
                    {Families.map((f, i) => <th className={`p-0 font-semibold dark:text-white ${TableSize.height} ${TableSize.protonSize}`} key={i}>{f}</th>)}
                </tr>
            </thead>
            <tbody>{Layout.map((row, i) => (
                <tr key={i}>
                    {row.map((cell, j) => {
                        if (cell > 1) {
                            n += 15;
                            return <SpecialCell key={j} exec={n} />;
                        }
                        if (n > 117) { n = 56; }
                        const path = game[n];
                        if (n == 70) { n = 87; }
                        if (cell && n < 118) {
                            n++;
                            return <Cell
                                onClick={PlayerClick}
                                config={config.table}
                                key={path.family + j + i}
                                type={path.typeClass}
                                protons={path.protons}
                                symbol={path.symbol}
                                name={path[lang as (typeof Languages)[number]].name}
                            />
                        }
                        else { return <VoidCell key={j} /> }
                    })}
                </tr>
            ))}</tbody>
        </table>
    )
}