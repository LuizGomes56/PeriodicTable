import { ButtonHeight, ButtonWidth, Difficulty, Lang, SectionMaxWidth, Translations } from "../types";

const InputCheckbox = ({ path, name, onEvent, mainkey, subkey, setCustom }: { path: boolean, name: string, onEvent: (key: keyof Omit<Difficulty, 'arcade'>, val: boolean, subkey?: keyof Difficulty["hints"] | keyof Difficulty["table"]) => void, mainkey: keyof Omit<Difficulty, 'arcade'>, subkey?: keyof Difficulty["hints"] | keyof Difficulty["table"], setCustom: () => void }) => {
    const onChange = () => {
        onEvent(mainkey, !path, subkey);
        setCustom();
    }
    return (
        <label htmlFor={name + mainkey}>
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

export default function Selectors({ config, language, onEvent, setCustom }: { config: Difficulty | undefined, language: Lang, onEvent: (key: keyof Omit<Difficulty, 'arcade'>, val: boolean, subkey?: keyof Difficulty["hints"] | keyof Difficulty["table"]) => void, setCustom: () => void }) {
    const HintSettings = [
        "name",
        "symbol",
        "mass",
        "electron",
        "group",
        "period",
        "block",
        "family",
        "type",
        "protons"
    ] as const;

    const TableSettings = [
        "protons",
        "symbol",
        "colors",
        "name",
    ] as const;

    return (
        <>
            {config && (
                <div className="flex flex-col max-w-sm w-full md:w-fit">
                    <section className={`flex flex-col ${SectionMaxWidth}`}>
                        <div className="flex flex-col">
                            <h2 className="text-lg font-semibold h-11 content-center dark:text-white">{Translations.generalSettings.title[language]}</h2>
                            <div className="flex flex-col gap-1">
                                <InputCheckbox setCustom={setCustom} onEvent={onEvent} mainkey="answerPersist" path={config.answerPersist} name={Translations.generalSettings.answerPersist[language]} />
                                <InputCheckbox setCustom={setCustom} onEvent={onEvent} mainkey="errorProtection" path={config.errorProtection} name={Translations.generalSettings.errorProtection[language]} />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <h2 className="text-lg font-semibold h-11 my-0.5 content-center dark:text-white">{Translations.tableSettings.title[language]}</h2>
                            <div className="grid grid-cols-2 gap-1">
                                {TableSettings.map(x => (
                                    <InputCheckbox
                                        key={x}
                                        setCustom={setCustom}
                                        onEvent={onEvent}
                                        mainkey="table"
                                        subkey={x as keyof Difficulty["table"]}
                                        path={config.table[x]}
                                        name={Translations.tableSettings[x][language]}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                    <section className={`flex flex-col ${SectionMaxWidth}`}>
                        <div className="flex flex-col">
                            <h2 className="text-lg font-semibold h-11 content-center dark:text-white">{Translations.hintSettings.title[language]}</h2>
                            <div className="grid grid-cols-2 gap-1">
                                {HintSettings.map((x, i) => (
                                    <InputCheckbox
                                        setCustom={setCustom}
                                        key={x + i}
                                        onEvent={onEvent}
                                        mainkey="hints"
                                        subkey={x as keyof Difficulty["hints"]}
                                        path={config.hints[x]}
                                        name={Translations.hintSettings[x][language]}
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