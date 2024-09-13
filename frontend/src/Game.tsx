import { useEffect, useRef, useState } from "react";
import { ButtonHeight, ButtonWidth, Diff, Difficulties, Difficulty, Gamemodes, GameProps, GameSettings, Lang, Languages, LocalStorageData, SectionMaxWidth } from "./types";
import PeriodicTable from "./components/PeriodicTable";
import VoidPeriodicTable from "./components/VoidPeriodicTable";
import Selectors from "./components/Selectors";
import Hintbox from "./components/Hintbox";
import ArcadeEditor from "./components/ArcadeEditor";
import Darkmode from "./components/Darkmode";
import TableSizeInput from "./components/TableSizeInput";
import useSkipRender from "./useSkipRender";

const EndPoint = "http://localhost:3000";

const FetchType: "Frontend" | "Backend" = "Frontend";

const MinimumArcadeTime = 25;

const GetUrl = (path: string): string => {
    switch (FetchType) {
        case "Frontend":
            return `/json/${path}.json`;
        default:
            return `${EndPoint}/api/${path}`;
    }
}

const FetchGame = async (): Promise<GameProps | null> => {
    try {
        const response = await fetch(GetUrl("game"), {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const resJson = await response.json() as GameProps;
        return resJson;
    }
    catch (e) {
        console.log(e);
    }
    return null;
}

const FetchSettings = async (): Promise<GameSettings | null> => {
    try {
        const response = await fetch(GetUrl("settings"), {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const resJson = await response.json() as GameSettings;
        return resJson;
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
                <label htmlFor={e} key={i} className={`${array.length % 2 !== 0 && i === array.length - 1 ? "col-span-2" : ""} ${ButtonHeight} ${ButtonWidth}`}>
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
        <section className={`${SectionMaxWidth}`}>
            <h2 className="font-semibold text-lg my-2 dark:text-white">
                {type.charAt(0).toUpperCase() + type.substring(1)}
            </h2>
            <span className="grid grid-cols-2 gap-1">
                <CreateSelector array={Object.values(array)} value={value} type={type} onChange={onChange} />
            </span>
        </section>
    )
}

const SessionData = ({ text, value }: { text: string, value: string | number }) => {
    return (
        <div className="grid grid-cols-2 gap-x-2">
            <span className="text-sky-950 dark:text-white font-semibold">{text}</span>
            <span className="text-red-700 dark:text-emerald-300 text-center font-semibold">{value}</span>
        </div>
    )
}

export default function Game() {
    const [game, setGame] = useState<GameProps | null>(null);
    const [settings, setSettings] = useState<GameSettings | null>(null);
    const [darkmode, setDarkmode] = useState<boolean>(false);
    const [tableSize, setTableSize] = useState<number>(8);
    const [difficulty, setDifficulty] = useState<Diff>("custom");
    const [language, setLanguage] = useState<Lang>("enUS");
    const [gamemode, setGamemode] = useState<"classic" | "arcade">("arcade");
    const [started, setStarted] = useState<boolean>(true);
    const [paused, setPaused] = useState<boolean>(false);
    const [arcadeTime, setArcadeTime] = useState<number>(MinimumArcadeTime);
    const [time, setTime] = useState<number>(0);
    const [options, setOptions] = useState<number[]>([]);
    const [draft, setDraft] = useState<number>(0);
    const [count, setCount] = useState<number>(0);
    const [config, setConfig] = useState<Difficulty | null>(null);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const StartTimers = () => {
        if (gamemode === "arcade") {
            intervalRef.current = setInterval(() => {
                setArcadeTime(prev => prev - 1);
                setTime(prev => prev + 1);
            }, 1000);
        } else {
            intervalRef.current = setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000);
        }
    };

    const clearIntervalIfExists = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const RestartGame = () => {
        setPaused(false);
        setStarted(true);
        const opt = Array.from({ length: 118 }, (_, i) => i);
        setOptions(opt);
        setCount(0);
        setArcadeTime(config?.arcade.totalTime || MinimumArcadeTime);
        setTime(0);
        clearIntervalIfExists();
        StartTimers();
        const cells = document.querySelectorAll("table td");
        cells.forEach(cell => {
            cell.removeAttribute("style");
            cell.classList.remove("bg-wrong");
        });
    };

    const PauseOrResume = () => {
        if (paused) {
            setPaused(false);
            StartTimers();
        }
        else {
            setPaused(true);
            clearIntervalIfExists();
        }
    };

    const RestartEvent = () => {
        RestartGame();
    };

    useEffect(() => {
        if (started && !paused) {
            StartTimers();
        } else {
            clearIntervalIfExists();
        }
        return () => clearIntervalIfExists();
    }, [started, paused, gamemode, config?.arcade.totalTime]);

    useSkipRender(() => {
        if (config) {
            const main = {
                difficulty: difficulty,
                gamemode: gamemode,
                config: config
            }
            const data = {
                darkmode: darkmode,
                language: language,
            };

            const newUri = encodeURIComponent(JSON.stringify(main));

            window.localStorage.setItem("periodicTableGame", JSON.stringify(Object.assign(main, data)));

            const newUrl = `${window.location.pathname}?data=${newUri}`;
            window.history.replaceState(null, '', newUrl);
        }
    }, [darkmode, difficulty, language, gamemode, config]);

    useEffect(() => {
        Load();
        const x = window.localStorage.getItem("periodicTableGame");
        if (x) {
            const y = JSON.parse(x) as LocalStorageData;
            setDarkmode(y.darkmode);
        }
        else {
            setDarkmode(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        setTableSize(CalculateTableSize(window.innerWidth));
    }, []);

    useEffect(() => {
        const a = document.body.classList;
        if (darkmode) {
            a.remove("bg-white");
            a.add("bg-zinc-800", "dark");
        }
        else {
            a.remove("bg-zinc-800", "dark");
            a.add("bg-white");
        }
    }, [darkmode]);

    const GetLocalStorage = (x: boolean): void => {
        const sess = window.localStorage.getItem("periodicTableGame");
        if (sess) {
            const jSess = JSON.parse(sess) as Omit<LocalStorageData, "game" | "settings">;
            if (!x) {
                setDifficulty(jSess.difficulty);
                setGamemode(jSess.gamemode);
                setConfig(jSess.config);
            }
            setDarkmode(jSess.darkmode);
            setLanguage(jSess.language);
        }
    }

    useSkipRender(() => {
        const a = config?.arcade.totalTime;
        if (a) {
            setArcadeTime(a < MinimumArcadeTime ? MinimumArcadeTime : a);
        }
        if (started) { RestartGame(); }
    }, [config]);

    useSkipRender(() => RestartGame(), [gamemode]);

    useSkipRender(() => {
        RestartGame();
        if (difficulty === "learn" || gamemode === "classic") {
            setArcadeTime(Infinity);
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
    }, [options]);

    const Random = (opt: number[]) => opt[Math.floor(Math.random() * opt.length)];

    const Load = async () => {
        const g = await FetchGame();
        const s = await FetchSettings();
        setGame(g);
        setSettings(s);

        const urlParams = new URLSearchParams(window.location.search);
        const urlData = urlParams.get('data');

        const opt = Array.from({ length: 118 }, (_, i) => i);
        setOptions(opt);

        let operation = false;

        if (urlData) {
            try {
                const decodedData = JSON.parse(decodeURIComponent(urlData)) as Omit<LocalStorageData, "game" | "settings" | "darkmode" | "tableSize" | "language">;
                setDifficulty(decodedData.difficulty);
                setGamemode(decodedData.gamemode);
                setConfig(decodedData.config);
                operation = true;
            }
            catch (e) {
                console.error("Erro ao decodificar os dados da URL", e);
            }
        }
        GetLocalStorage(operation);

        if (!config && s) {
            const path = s.difficulties[difficulty];
            setConfig(path);
            setArcadeTime(path.arcade.totalTime);
        }
    };

    useSkipRender(() => {
        if (started && arcadeTime < 0) {
            RestartGame();
            setStarted(false);
            window.alert("Time out!");
        }
    }, [arcadeTime]);


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
        if (!config) { return };
        setConfig((prev) => {
            if (!prev) return prev;
            return { ...prev, arcade: { ...prev.arcade, [key]: val } };
        });
    }

    const SetCustomDifficulty = () => setDifficulty("custom");

    return (
        <div className="mx-auto sm:p-2 md:p-0 mb-4 flex flex-wrap">
            <div className="flex flex-wrap pl-4">
                <div className="w-full md:w-auto flex gap-4 justify-between flex-wrap">
                    <section className="flex flex-col w-full md:w-fit">
                        <section className={`${SectionMaxWidth}`}>
                            <h2 className="font-semibold text-lg my-2 dark:text-white">
                                Page Settings
                            </h2>
                            <span className="grid grid-cols-1 gap-1">
                                <Darkmode darkmode={darkmode} onChange={() => setDarkmode(prev => !prev)} />
                                <TableSizeInput value={tableSize} onChange={setTableSize} />
                            </span>
                        </section>
                        <span className="flex flex-col">
                            <CreateSettingsSelector type="language" value={language} onChange={setLanguage} array={Object.values(Languages)} />
                            <CreateSettingsSelector type="gamemode" value={gamemode} onChange={setGamemode} array={Object.values(Gamemodes)} />
                        </span>
                        <CreateSettingsSelector type="difficulty" value={difficulty} onChange={setDifficulty} array={Object.values(Difficulties)} />
                        {config && gamemode == "arcade" && <section className={`${SectionMaxWidth}`}>
                            <h2 className="font-semibold text-lg my-2 dark:text-white">
                                Arcade Settings
                            </h2>
                            <span className="grid grid-cols-1 gap-1">
                                <ArcadeEditor setCustom={SetCustomDifficulty} name="Total Time" mainkey="totalTime" value={config.arcade.totalTime} onChange={ChangeArcadeSettings} />
                                <ArcadeEditor setCustom={SetCustomDifficulty} name="Bonus Time" mainkey="bonusTime" value={config.arcade.bonusTime} onChange={ChangeArcadeSettings} />
                                <ArcadeEditor setCustom={SetCustomDifficulty} name="Penalty Time" mainkey="penaltyTime" value={config.arcade.penaltyTime} onChange={ChangeArcadeSettings} />
                            </span>
                        </section>}
                    </section>
                    {config && <Selectors config={config} setCustom={SetCustomDifficulty} onEvent={ChangeSettings} />}
                </div>
            </div>
            <div className="overflow-auto scrollbar flex-auto px-4">
                <section className="mt-4 flex gap-x-8 gap-y-4 justify-center flex-wrap mb-4 md:mb-0">
                    <div className="flex gap-4">
                    </div>
                    {started ? <>
                        <div className="flex gap-4 my-1">
                            <button
                                onClick={PauseOrResume}
                                type="button"
                                className={`font-semibold ${paused ? "dark:bg-emerald-300 bg-emerald-500" : "bg-red-500 dark:bg-red-300"} ${ButtonWidth} ${ButtonHeight} py-2 px-4 rounded`}>
                                {paused ? "Resume" : "Pause"}
                            </button>
                            <button
                                onClick={RestartEvent}
                                type="button"
                                className={`bg-amber-500 dark:bg-yellow-300 ${ButtonWidth} ${ButtonHeight} font-semibold py-2 px-4 rounded`}>
                                Restart
                            </button>
                        </div>
                        <div className="flex flex-col items-center w-full md:w-auto">
                            <section className="min-w-64 rounded grid grid-cols-1 sm:grid-cols-[auto,auto] gap-1 gap-x-2">
                                <SessionData text="Attempts" value={count} />
                                <SessionData text="Score" value={`${118 - options.length} / 118`} />
                                <SessionData text="Time" value={gamemode == "arcade" ? arcadeTime > 1E5 ? "∞" : arcadeTime : time} />
                                <SessionData text="Errors" value={count - (118 - options.length)} />
                            </section>
                        </div>
                        <div className="flex flex-col items-center w-full md:w-auto">
                            {config && game && <Hintbox config={config.hints} draft={game[draft]} language={language} />}
                        </div>
                    </> :
                        <button
                            type="button"
                            onClick={() => setStarted(true)}
                            className={`bg-violet-500 ${ButtonWidth} ${ButtonHeight} dark:bg-sky-300 font-semibold py-2 px-4 rounded`}>
                            Start
                        </button>
                    }
                </section>
                <div className="flex min-w-max w-full max-w-7xl">
                    {game && config ?
                        <PeriodicTable setCount={setCount} started={started} paused={paused} setOptions={setOptions} setArcadeTime={setArcadeTime} draft={draft} tableSize={tableSize} game={game} config={config} lang={language} /> : <VoidPeriodicTable />}
                </div>
            </div>
        </div>
    )
}