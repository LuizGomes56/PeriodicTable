import { useEffect, useState } from "react";
import { Diff, Difficulties, Difficulty, Gamemodes, GameProps, GameSettings, Lang, Languages, LocalStorageData } from "./types";
import PeriodicTable from "./components/PeriodicTable";
import VoidPeriodicTable from "./components/VoidPeriodicTable";
import Selectors from "./components/Selectors";
import Hintbox from "./components/Hintbox";
import ArcadeEditor from "./components/ArcadeEditor";
import Darkmode from "./components/Darkmode";
import TableSizeInput from "./components/TableSizeInput";

const EndPoint = "http://localhost:3000";

const GetUrl = (path: string) => `${EndPoint}/api/${path}`

const FetchGame = async (): Promise<GameProps | null> => {
    try {
        let response = await fetch(GetUrl("game"), {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        let game = await response.json() as GameProps;
        return game;
    }
    catch (e) {
        console.log(e);
    }
    return null;
}

const CreateSelector = ({ array, type, onChange, value }: { array: string[], type: string, value: string, onChange: (value: any) => void }) => {
    return (
        <>
            {array.map((e, i) => (
                <label htmlFor={e} key={i} className="h-10 min-w-28">
                    <div className="select-none has-[:checked]:bg-sky-300 cursor-pointer h-full px-4 bg-blue-100 dark:bg-white dark:has-[:checked]:bg-sky-400 rounded transition-all duration-300 justify-center flex items-center text-black">
                        <input
                            type="radio"
                            name={type}
                            id={e}
                            className="appearance-none hidden"
                            onChange={() => onChange(e)}
                            checked={value === e}
                        />
                        <span className="font-medium">{e.charAt(0).toUpperCase() + e.slice(1)}</span>
                    </div>
                </label>
            ))}
        </>
    )
}

const CreateSettingsSelector = ({ array, type, onChange, value }: { array: string[], type: string, value: string, onChange: (value: any) => void }) => {
    return (
        <section>
            <h2 className="font-semibold text-lg my-2 dark:text-white">
                {type.charAt(0).toUpperCase() + type.substring(1)}
            </h2>
            <span className="grid grid-cols-2 gap-1">
                <CreateSelector array={Object.values(array)} value={value} type={type} onChange={onChange} />
            </span>
        </section>
    )
}

const FetchSettings = async (): Promise<GameSettings | null> => {
    try {
        let response = await fetch(GetUrl("settings"), {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        let settings = await response.json() as GameSettings;
        return settings;
    }
    catch (e) {
        console.log(e);
    }
    return null;
}

export default function Game() {
    let [game, setGame] = useState<GameProps | null>(null);
    let [settings, setSettings] = useState<GameSettings | null>(null);

    let [darkmode, setDarkmode] = useState<boolean>(false);
    let [tableSize, setTableSize] = useState<number>(8);

    let [difficulty, setDifficulty] = useState<Diff>("easy");
    let [language, setLanguage] = useState<Lang>("enUS");
    let [gamemode, setGamemode] = useState<"classic" | "arcade">("arcade");

    let [time, setTime] = useState<number>(0);
    let [options, setOptions] = useState<number[]>([]);
    let [draft, setDraft] = useState<number>(0);
    let [count, setCount] = useState<number>(0);

    let [config, setConfig] = useState<Difficulty | null>(null);

    useEffect(() => {
        Load();
    }, []);

    useEffect(() => {
        let a = document.body.classList;
        if (darkmode) {
            a.remove("bg-white");
            a.add("bg-zinc-800", "dark");
        }
        else {
            a.remove("bg-zinc-800", "dark");
            a.add("bg-white");
        }
    }, [darkmode]);

    useEffect(() => {
        if (gamemode === "arcade") {
            const interval = setInterval(() => setTime(prev => prev + 1), 1000);
            return () => clearInterval(interval);
        }
    }, [gamemode]);

    const GetLocalStorage = (): boolean => {
        let sess = window.localStorage.getItem("periodicTableGame");
        if (sess) {
            const jSess = JSON.parse(sess) as LocalStorageData;
            setGame(jSess.game);
            setSettings(jSess.settings);
            setOptions(jSess.options);
            setDifficulty(jSess.difficulty);
            setLanguage(jSess.language);
            setGamemode(jSess.gamemode);
            setTime(jSess.time);
            setConfig(jSess.config);
            return true;
        }
        else return false;
    }

    useEffect(() => {
        let opt = Array.from({ length: 118 }, (_, i) => i);
        setOptions(opt);
        if (settings?.difficulties[difficulty] && difficulty !== "custom") {
            setConfig(settings.difficulties[difficulty]);
            setTime(0);
        }
        UpdateLocalStorage("difficulty", difficulty);
    }, [difficulty]);

    useEffect(() => {
        if (options.length > 0) {
            setDraft(Random(options));
        }
        else {
            console.log("Endgame, display information and congratz");
        }
    }, [options])

    const UpdateLocalStorage = <K extends keyof LocalStorageData>(key: K, val: LocalStorageData[K]): void => {
        let sess = window.localStorage.getItem("periodicTableGame");
        if (sess) {
            const jSess = JSON.parse(sess) as LocalStorageData;
            jSess[key] = val;
            window.localStorage.setItem("periodicTableGame", JSON.stringify(jSess));
        }
    }

    const Random = (opt: number[]) => opt[Math.floor(Math.random() * opt.length)];

    const Load = async () => {
        let a = GetLocalStorage();
        if (!a) {
            let game = await FetchGame();
            let settings = await FetchSettings();
            setGame(game);
            setSettings(settings);
            setConfig(settings?.difficulties[difficulty] || null);
            // const urlJSON = encodeURIComponent(JSON.stringify(settings?.difficulties[difficulty] || null));
            // console.log(urlJSON)
            // const decodeURL = decodeURIComponent(urlJSON);
            // console.log(decodeURL)
        }
    }

    const ChangeSettings = (key: keyof Omit<Difficulty, 'arcade'>, val: boolean, subkey?: keyof Difficulty["hints"] | keyof Difficulty["table"]) => {
        if (!config) return;
        setConfig((prev) => {
            if (!prev) return prev;
            return subkey && typeof prev[key] === 'object' ? { ...prev, [key]: { ...prev[key], [subkey]: val, } } : { ...prev, [key]: val, };
        });
    };

    const ChangeArcadeSettings = (key: keyof Difficulty["arcade"], val: number) => {
        if (!config) return;
        setConfig((prev) => {
            if (!prev) return prev;
            return { ...prev, arcade: { ...prev.arcade, [key]: val, } };
        });
    }

    const SetCustomDifficulty = () => setDifficulty("custom");

    return (
        <div className="mx-auto container p-4 sm:p-2 md:p-0 mb-5">
            <div className="flex flex-wrap">
                <div className="w-full md:w-auto flex flex-col justify-between p-4 flex-wrap">
                    <section className="flex flex-col md:flex-row md:gap-4">
                        <span className="flex flex-col">
                            <CreateSettingsSelector type="gamemode" value={gamemode} onChange={setGamemode} array={Object.values(Gamemodes)} />
                            <CreateSettingsSelector type="language" value={language} onChange={setLanguage} array={Object.values(Languages)} />
                        </span>
                        <CreateSettingsSelector type="difficulty" value={difficulty} onChange={setDifficulty} array={Object.values(Difficulties)} />
                        {config && gamemode == "arcade" && <section>
                            <h2 className="font-semibold text-lg my-2 dark:text-white">
                                Arcade Settings
                            </h2>
                            <span className="grid grid-cols-1 gap-1">
                                <ArcadeEditor name="Total Time" mainkey="totalTime" value={config.arcade.totalTime} onChange={ChangeArcadeSettings} />
                                <ArcadeEditor name="Bonus Time" mainkey="bonusTime" value={config.arcade.bonusTime} onChange={ChangeArcadeSettings} />
                                <ArcadeEditor name="Penalty Time" mainkey="penaltyTime" value={config.arcade.penaltyTime} onChange={ChangeArcadeSettings} />
                            </span>
                        </section>}
                        <section>
                            <h2 className="font-semibold text-lg my-2 dark:text-white">
                                Page Settings
                            </h2>
                            <span className="grid grid-cols-1 gap-1">
                                <Darkmode darkmode={darkmode} onChange={() => setDarkmode(prev => !prev)} />
                                <TableSizeInput value={tableSize} onChange={setTableSize} />
                            </span>
                        </section>
                    </section>
                    {config && <Selectors config={config} setCustom={SetCustomDifficulty} onEvent={ChangeSettings} />}
                </div>
            </div>
            <div className="flex flex-col items-center flex-auto">
                {config && game && <Hintbox config={config.hints} draft={game[draft]} language={language} />}
            </div>
            <div>
                Count: {count} Score: {118 - options.length}
            </div>
            <div className="overflow-auto">
                <div className="flex justify-center min-w-max">
                    {game && config ?
                        <PeriodicTable setCount={setCount} setOptions={setOptions} draft={draft} tableSize={tableSize} game={game} config={config} lang={language} /> : <VoidPeriodicTable />}
                </div>
            </div>
        </div>
    )
}