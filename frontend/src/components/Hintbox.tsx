import { Difficulty, GameProps, Lang } from "../types"

const CreateHintCell = ({ mainkey, val }: { mainkey: string, val: string }) => {
    switch (mainkey) {
        case "electron":
            let Regex: RegExp = new RegExp(/\^(\d+)/, 'g');
            val = val.replace(Regex, "<sup>$1</sup>");
            break;
        case "type":
            let RegexUppercase: RegExp = /([A-Z])/g;
            val = val.replace(RegexUppercase, ' $1').trim();
            val = val.charAt(0).toUpperCase() + val.substring(1);
            break;
        case "mass":
            val = Number(val).toFixed(2).toString();
            break;
        default: break;
    }
    return (
        <div className="grid grid-cols-2 gap-x-2">
            <span className="text-sky-950 dark:text-white font-semibold">{mainkey.charAt(0).toUpperCase() + mainkey.substring(1)}</span>
            <span className="text-red-700 dark:text-red-300 font-semibold" dangerouslySetInnerHTML={{ __html: val }} />
        </div>
    )
}

export default function Hintbox({ config, draft, language }: { config: Difficulty["hints"], draft: GameProps[number], language: Lang }) {
    if (!Object.values(config).includes(true)) return null;
    return (
        <>
            <h2 className="text-lg text-center font-bold my-2 dark:text-white">Hints</h2>
            <section className="rounded p-3 px-4 grid grid-cols-1 sm:grid-cols-[auto,auto] gap-1 gap-x-8 w-fit">
                {config && Object.entries(config).map(([key, val]) => Boolean(val) && <CreateHintCell key={key} mainkey={key} val={key == "name" ? draft[language][key] : draft[key as keyof typeof draft].toString()} />)}
            </section>
        </>
    )
}