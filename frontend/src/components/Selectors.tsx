import { ButtonHeight, ButtonWidth, Difficulty, SectionMaxWidth } from "../types";

const InputCheckbox = ({ path, name, onEvent, mainkey, subkey, setCustom, increments }: { path: boolean, name: string, onEvent: (key: keyof Omit<Difficulty, 'arcade'>, val: boolean, subkey?: keyof Difficulty["hints"] | keyof Difficulty["table"]) => void, mainkey: keyof Omit<Difficulty, 'arcade'>, subkey?: keyof Difficulty["hints"] | keyof Difficulty["table"], setCustom: () => void, increments?: string }) => {
    const onChange = () => {
        onEvent(mainkey, !path, subkey);
        setCustom();
    }
    return (
        <label className={increments ? increments : ""} htmlFor={name + mainkey}>
            <div className={`select-none has-[:checked]:bg-emerald-300 dark:has-[:checked]:bg-emerald-300 ${ButtonWidth} cursor-pointer text-nowrap ${ButtonHeight} text-center px-4 dark:bg-rose-300 bg-rose-100 rounded transition-all duration-300 justify-center flex items-center text-black`}>
                <input
                    type="checkbox"
                    id={name + mainkey}
                    className="appearance-none hidden"
                    checked={path}
                    onChange={onChange}
                />
                <span className="font-medium">{name}</span>
            </div>
        </label>
    )
}

export default function Selectors({ config, onEvent, setCustom }: { config: Difficulty | undefined, onEvent: (key: keyof Omit<Difficulty, 'arcade'>, val: boolean, subkey?: keyof Difficulty["hints"] | keyof Difficulty["table"]) => void, setCustom: () => void }) {
    type HintProps<T extends keyof Difficulty> = { subkey: keyof Difficulty[T], name: string }[]
    const HintSettings = [
        { subkey: "name", name: "Name" },
        { subkey: "mass", name: "Mass" },
        { subkey: "electron", name: "Electrons" },
        { subkey: "group", name: "Group" },
        { subkey: "period", name: "Period" },
        { subkey: "block", name: "Block" },
        { subkey: "family", name: "Family" },
        { subkey: "type", name: "Type" },
        { subkey: "protons", name: "Protons" }
    ] as HintProps<"hints">;
    const TableSettings = [
        { subkey: "protons", name: "Protons" },
        { subkey: "symbol", name: "Symbol" },
        { subkey: "colors", name: "Colors" },
        { subkey: "name", name: "Name" },
    ] as HintProps<"table">;
    return (
        <>
            {config && (
                <div className="flex flex-col w-full md:w-fit">
                    <section className={`flex flex-col ${SectionMaxWidth}`}>
                        <div className="flex flex-col">
                            <h2 className="text-lg font-semibold h-11 content-center dark:text-white">General Settings</h2>
                            <div className="flex flex-col gap-1">
                                <InputCheckbox setCustom={setCustom} onEvent={onEvent} mainkey="answerPersist" path={config.answerPersist} name="Answer Persist" />
                                <InputCheckbox setCustom={setCustom} onEvent={onEvent} mainkey="errorProtection" path={config.errorProtection} name="Error Protection" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-lg font-semibold h-11 my-0.5 content-center dark:text-white">Table Settings</h2>
                            <div className="grid grid-cols-2 gap-1">
                                {TableSettings.map(({ subkey, name }) => (
                                    <InputCheckbox
                                        key={subkey}
                                        setCustom={setCustom}
                                        onEvent={onEvent}
                                        mainkey="table"
                                        subkey={subkey as keyof Difficulty["table"]}
                                        path={config.table[subkey]}
                                        name={name}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                    <section className={`flex flex-col ${SectionMaxWidth}`}>
                        <div className="flex flex-col">
                            <h2 className="text-lg font-semibold h-11 content-center dark:text-white">Hint Settings</h2>
                            <div className="grid grid-cols-2 gap-1">
                                {HintSettings.map(({ subkey, name }, i) => (
                                    <InputCheckbox
                                        setCustom={setCustom}
                                        key={subkey + i}
                                        onEvent={onEvent}
                                        mainkey="hints"
                                        subkey={subkey as keyof Difficulty["hints"]}
                                        path={config.hints[subkey]}
                                        name={name}
                                        increments={HintSettings.length % 2 !== 0 && i === HintSettings.length - 1 ? "col-span-2" : ""}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </>
    )
}