export type Difficulty = {
    arcade: {
        penaltyTime: number;
        bonusTime: number;
        totalTime: number;
    };
    errorProtection: boolean;
    answerPersist: boolean;
    showGroupColors: boolean;
    table: {
        name: boolean;
        symbol: boolean;
        protons: boolean;
    };
    hints: {
        name: boolean;
        family: boolean;
        symbol: boolean;
        electron: boolean;
        mass: boolean;
        protons: boolean;
        group: boolean;
        period: boolean;
        block: boolean;
        type: boolean;
    }
}

export const GroupColors = {
    alkali: "bg-red-400",
    alkaliEarth: "bg-rose-300",
    metal: "bg-orange-200",
    nobleGas: "bg-purple-400",
    halogen: "bg-indigo-300",
    nonMetal: "bg-sky-300",
    semiMetal: "bg-lime-200",
    metalloid: "bg-emerald-200",
    lanthanides: "bg-indigo-200",
    actinides: "bg-sky-200"
} as const;

export type Lang = (typeof Languages)[number];
export type Mode = (typeof Gamemodes)[number];
export type Diff = (typeof Difficulties)[number];

export const Gamemodes = ["classic", "arcade"] as const;

export const Difficulties = ["custom", "learn", "easy", "medium", "hard", "insane", "extreme", "impossible"] as const;

export const Languages = ["enUS", "esES", "ptBR"] as const;

export const Families = ["1A", "2A", "3B", "4B", "5B", "6B", "7B", "8B", "8B", "8B", "1B", "2B", "3A", "4A", "5A", "6A", "7A", "8A"] as const;

export const Layout: number[][] = [
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
] as const;

export type LocalStorageData = {
    game: GameProps;
    settings: GameSettings;
    time: number;
    options: number[];
    gamemode: (typeof Gamemodes)[number];
    difficulty: (typeof Difficulties)[number];
    language: (typeof Languages)[number];
    config: Difficulty;
}

export type GameSettings = {
    languages: (typeof Languages)[number][];
    gamemodes: (typeof Gamemodes)[number][];
    difficulties: Record<(typeof Difficulties)[number], Difficulty>;
}

type Elements = {
    protons: number;
    mass: number;
    symbol: string;
    electron: string;
    group: string;
    family: string;
    period: string;
    block: string;
    type: string;
    ptBR: {
        name: string;
    };
    enUS: {
        name: string;
    };
    esES: {
        name: string;
    };
}

export type GameProps = Elements[]