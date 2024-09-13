import { Difficulty, GameProps, Lang, Translations } from "../types"

const CreateHintCell = ({ mainkey, val, increments, language }: { mainkey: string, val: string, language: Lang, increments: boolean }) => {
    switch (mainkey) {
        case "electron":
            val = val.replace(/\^(\d+)/g, "<sup>$1</sup>");
            break;
        case "type":
            val = val.replace(/([A-Z])/g, ' $1').trim();
            val = val.charAt(0).toUpperCase() + val.substring(1);
            break;
        case "mass":
            val = Number(val).toFixed(2).toString();
            break;
        default: break;
    }
    return (
        <div className={`${increments ? "col-span-2 w-fit gap-x-4" : "gap-x-2"} grid grid-cols-2`}>
            <span className="text-sky-950 dark:text-white font-semibold">{Translations.hintSettings[mainkey as keyof typeof Translations.hintSettings][language]}</span>
            <span className="text-red-700 dark:text-cyan-300 font-semibold" dangerouslySetInnerHTML={{ __html: val }} />
        </div>
    )
}

export default function Hintbox({ config, draft, language }: { config: Difficulty["hints"], draft: GameProps[number], language: Lang }) {
    const Entries = Object.entries(config).filter(([_, val]) => Boolean(val));
    return Entries.length ? <>
        <section className="min-w-64 rounded grid grid-cols-1 sm:grid-cols-[auto,auto] gap-1 gap-x-8">
            {Entries.map(([key, _]) => (
                <CreateHintCell
                    key={key}
                    increments={Entries.length === 1}
                    mainkey={key}
                    language={language}
                    val={key === "name" || key === "type" ? draft[language][key] : draft[key as keyof typeof draft].toString()}
                />
            ))}
        </section>
    </> : null;
}