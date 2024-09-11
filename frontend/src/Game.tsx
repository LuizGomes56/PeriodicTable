import { useEffect, useState } from "react";
import { Diff, Difficulties, Difficulty, Gamemodes, GameProps, GameSettings, Lang, Languages, LocalStorageData } from "./types";
import PeriodicTable from "./components/PeriodicTable";
import VoidPeriodicTable from "./components/VoidPeriodicTable";
import Selectors from "./components/Selectors";
import Hintbox from "./components/Hintbox";
import ArcadeEditor from "./components/ArcadeEditor";
import Darkmode from "./components/Darkmode";
import TableSizeInput from "./components/TableSizeInput";
import useSkipRender from "./useSkipRender";

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
                <label htmlFor={e} key={i} className={`${array.length % 2 !== 0 && i === array.length - 1 ? "col-span-2" : ""} h-10 min-w-28`}>
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

const SessionData = ({ text, value }: { text: string, value: string | number }) => {
    return (
        <div className="grid grid-cols-2 gap-x-2">
            <span className="text-sky-950 dark:text-white font-semibold">{text}</span>
            <span className="text-red-700 dark:text-red-300 text-center font-semibold">{value}</span>
        </div>
    )
}

export default function Game() {
    let [game, setGame] = useState<GameProps | null>(null);
    let [settings, setSettings] = useState<GameSettings | null>(null);

    let [darkmode, setDarkmode] = useState<boolean>(false);
    let [tableSize, setTableSize] = useState<number>(8);

    let [difficulty, setDifficulty] = useState<Diff>("custom");
    let [language, setLanguage] = useState<Lang>("enUS");
    let [gamemode, setGamemode] = useState<"classic" | "arcade">("arcade");

    let [time, setTime] = useState<number>(0);
    let [options, setOptions] = useState<number[]>([]);

    let [draft, setDraft] = useState<number>(0);
    let [count, setCount] = useState<number>(0);

    let [config, setConfig] = useState<Difficulty | null>(null);

    useSkipRender(() => {
        console.log("JOINING LOCAL STORAGE SESSION")
        if (game && settings && config) {
            let data = {
                game: game,
                settings: settings,
                darkmode: darkmode,
                tableSize: tableSize,
                difficulty: difficulty,
                language: language,
                gamemode: gamemode,
                config: config
            } as LocalStorageData;
            window.localStorage.setItem("periodicTableGame", JSON.stringify(data));
        }
    }, [game, settings, darkmode, tableSize, difficulty, language, gamemode, config]);

    useEffect(() => {
        Load();
        let x = window.localStorage.getItem("periodicTableGame");
        if (x) {
            let y = JSON.parse(x) as LocalStorageData;
            setDarkmode(y.darkmode);
        }
        else {
            setDarkmode(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        setTableSize(CalculateTableSize(window.innerWidth));
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

    const GetLocalStorage = (): boolean => {
        let sess = window.localStorage.getItem("periodicTableGame");
        if (sess) {
            const jSess = JSON.parse(sess) as LocalStorageData;
            setGame(jSess.game);
            setSettings(jSess.settings);
            setDifficulty(jSess.difficulty);
            setDarkmode(jSess.darkmode);
            setTableSize(jSess.tableSize);
            setLanguage(jSess.language);
            setGamemode(jSess.gamemode);
            setConfig(jSess.config);
            return true;
        }
        else return false;
    }

    const RestartGame = () => {
        let opt = Array.from({ length: 118 }, (_, i) => i);
        setOptions(opt);
        setCount(0);
        setTime(settings?.difficulties[difficulty].arcade.totalTime || 0);
    }

    useSkipRender(() => {
        setTime(config?.arcade.totalTime || 0);
    }, [config?.arcade.totalTime])

    useSkipRender(() => {
        RestartGame();
        if (difficulty === "learn") {
            setTime(Infinity)
        }
        if (settings?.difficulties[difficulty]) {
            setConfig(settings.difficulties[difficulty]);
        }
    }, [difficulty]);

    useSkipRender(() => {
        if (options.length > 0) {
            setDraft(Random(options));
        }
        else {
            window.alert("Você venceu o jogo!");
            RestartGame();
        }
    }, [options])

    // const UpdateLocalStorage = <K extends keyof LocalStorageData>(key: K, val: LocalStorageData[K]): void => {
    //     let sess = window.localStorage.getItem("periodicTableGame");
    //     if (!sess) {
    //         let data = {} as LocalStorageData;
    //         data.game = game as GameProps;
    //         data.gamemode = gamemode;
    //         data.difficulty = difficulty;
    //         data.language = language;
    //         data.time = time;
    //         data.settings = settings as GameSettings;
    //         data.options = options;
    //         data.config = config as Difficulty;
    //         data.darkmode = darkmode;
    //         data.tableSize = tableSize;
    //         data.count = count;
    //         data.draft = draft;
    //         window.localStorage.setItem("periodicTableGame", JSON.stringify(data));
    //     }
    //     if (sess) {
    //         let jSess = JSON.parse(sess) as LocalStorageData;
    //         jSess[key] = val;
    //         window.localStorage.setItem("periodicTableGame", JSON.stringify(jSess));
    //     }
    // }

    const Random = (opt: number[]) => opt[Math.floor(Math.random() * opt.length)];

    const Load = async () => {
        let a = GetLocalStorage();
        if (!a) {
            let game = await FetchGame();
            let settings = await FetchSettings();
            setGame(game);
            if (settings) {
                let path = settings.difficulties[difficulty];
                setSettings(settings);
                setConfig(path);
                setTime(path.arcade.totalTime);
            }
            // const urlJSON = encodeURIComponent(JSON.stringify(settings?.difficulties[difficulty] || null));
            // console.log(urlJSON)
            // const decodeURL = decodeURIComponent(urlJSON);
            // console.log(decodeURL)
        }
        let opt = Array.from({ length: 118 }, (_, i) => i);
        setOptions(opt);
        const interval = setInterval(() => setTime(prev => prev - 1), 1000);
        return () => clearInterval(interval);
    }

    const ChangeSettings = (key: keyof Omit<Difficulty, 'arcade'>, val: boolean, subkey?: keyof Difficulty["hints"] | keyof Difficulty["table"]) => {
        if (!config) return;
        setConfig((prev) => {
            if (!prev) return prev;
            return subkey && typeof prev[key] === 'object' ? { ...prev, [key]: { ...prev[key], [subkey]: val, } } : { ...prev, [key]: val, };
        });
        RestartGame();
    };

    const CalculateTableSize = (x: number) => Math.min(Math.max(Math.floor(0.00545 * x - 2.18), 0), 9);

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
                    <section className="flex flex-col md:flex-row md:gap-4 flex-wrap">
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
            <section className="flex justify-evenly flex-wrap mb-4 md:mb-0">
                <div className="flex flex-col items-center w-full md:w-auto">
                    <h2 className="text-lg text-center font-bold my-2 dark:text-white">Session</h2>
                    <section className="min-w-64 rounded grid grid-cols-1 sm:grid-cols-[auto,auto] gap-1 gap-x-8">
                        <SessionData text="Attempts" value={count} />
                        <SessionData text="Score" value={`${118 - options.length} / 118`} />
                        {gamemode === "arcade" && <SessionData text="Time" value={time > 1E5 ? "∞" : time} />}
                        <SessionData text="Errors" value={count - 118 + options.length} />
                    </section>
                </div>
                <div className="flex flex-col items-center w-full md:w-auto">
                    {config && game && <Hintbox config={config.hints} draft={game[draft]} language={language} />}
                </div>
            </section>
            <div className="overflow-auto scrollbar">
                <div className="flex justify-center min-w-max">
                    {game && config ?
                        <PeriodicTable setCount={setCount} setOptions={setOptions} draft={draft} tableSize={tableSize} game={game} config={config} lang={language} /> : <VoidPeriodicTable />}
                </div>
            </div>
        </div>
    )
}