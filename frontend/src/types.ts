export type Difficulty = {
    arcade: {
        penaltyTime: number;
        bonusTime: number;
        totalTime: number;
    };
    errorProtection: boolean;
    answerPersist: boolean;
    table: {
        name: boolean;
        symbol: boolean;
        protons: boolean;
        colors: boolean;
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
    alkali: "bg-rose-250",
    alkaliEarth: "bg-orange-200",
    metal: "bg-gold",
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

export const ButtonWidth = "min-w-24";
export const ButtonHeight = "h-10";
export const SectionMaxWidth = "md:max-w-[196px]";

export type LocalStorageData = {
    game: GameProps;
    settings: GameSettings;
    darkmode: boolean;
    tableSize: number;
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
    typeClass: string;
    ptBR: {
        name: string;
        type: string;
    };
    enUS: {
        name: string;
        type: string;
    };
    esES: {
        name: string;
        type: string;
    };
}

export type GameProps = Elements[];

export const Translations = {
    darkmode: {
        ptBR: ["Modo Escuro", "Modo Claro"],
        enUS: ["Dark Mode", "Light Mode"],
        esES: ["Modo Oscuro", "Modo Claro"]
    },
    language: {
        title: {
            ptBR: "Idioma",
            enUS: "Language",
            esES: "Idioma"
        },
        ptBR: "Português",
        enUS: "English",
        esES: "Español"
    },
    tableSize: {
        ptBR: "Tamanho",
        enUS: "Table Size",
        esES: "Tamaño"
    },
    gamemode: {
        title: {
            ptBR: "Modo de Jogo",
            enUS: "Gamemode",
            esES: "Modo de Juego"
        },
        ptBR: {
            classic: "Clássico",
            arcade: "Arcade"
        },
        enUS: {
            classic: "Classic",
            arcade: "Arcade"
        },
        esES: {
            classic: "Clásico",
            arcade: "Arcade"
        }
    },
    difficulty: {
        title: {
            ptBR: "Dificuldade",
            enUS: "Difficulty",
            esES: "Dificultad"
        },
        ptBR: {
            custom: "Custom",
            learn: "Aprender",
            easy: "Fácil",
            medium: "Médio",
            hard: "Difícil",
            insane: "Insano",
            extreme: "Extremo",
            impossible: "Impossível"
        },
        enUS: {
            custom: "Custom",
            learn: "Learn",
            easy: "Easy",
            medium: "Medium",
            hard: "Hard",
            insane: "Insane",
            extreme: "Extreme",
            impossible: "Impossible"
        },
        esES: {
            custom: "Custom",
            learn: "Aprender",
            easy: "Fácil",
            medium: "Medio",
            hard: "Difícil",
            insane: "Insano",
            extreme: "Extremo",
            impossible: "Imposible"
        }
    },
    arcadeSettings: {
        title: {
            ptBR: "Tempo do Arcade",
            enUS: "Arcade Time",
            esES: "Tiempo Arcade"
        },
        totalTime: {
            ptBR: "Total",
            enUS: "Total",
            esES: "Total"
        },
        penaltyTime: {
            ptBR: "Penalidade",
            enUS: "Penalty",
            esES: "Penalidad"
        },
        bonusTime: {
            ptBR: "Bonus",
            enUS: "Bonus",
            esES: "Bonus"
        }
    },
    generalSettings: {
        title: {
            ptBR: "Geral",
            enUS: "General",
            esES: "General"
        },
        errorProtection: {
            ptBR: "Proteção de Erros",
            enUS: "Error Protection",
            esES: "Protección de Errores"
        },
        answerPersist: {
            ptBR: "Resposta Persistente",
            enUS: "Answer Persist",
            esES: "Respuesta Persistente"
        }
    },
    tableSettings: {
        title: {
            ptBR: "Tabela",
            enUS: "Table",
            esES: "Tabla"
        },
        name: {
            ptBR: "Nome",
            enUS: "Name",
            esES: "Nombre"
        },
        symbol: {
            ptBR: "Simbolo",
            enUS: "Symbol",
            esES: "Símbolo"
        },
        protons: {
            ptBR: "Protons",
            enUS: "Protons",
            esES: "Protones"
        },
        colors: {
            ptBR: "Cores",
            enUS: "Colors",
            esES: "Colores"
        }
    },
    hintSettings: {
        title: {
            ptBR: "Dicas",
            enUS: "Hints",
            esES: "Dudas"
        },
        name: {
            ptBR: "Nome",
            enUS: "Name",
            esES: "Nombre"
        },
        family: {
            ptBR: "Familia",
            enUS: "Family",
            esES: "Familia"
        },
        symbol: {
            ptBR: "Simbolo",
            enUS: "Symbol",
            esES: "Símbolo"
        },
        mass: {
            ptBR: "Massa",
            enUS: "Mass",
            esES: "Masa"
        },
        electron: {
            ptBR: "Eletrônica",
            enUS: "Electron",
            esES: "Electrónica"
        },
        group: {
            ptBR: "Grupo",
            enUS: "Group",
            esES: "Grupo"
        },
        period: {
            ptBR: "Período",
            enUS: "Period",
            esES: "Período"
        },
        block: {
            ptBR: "Bloco",
            enUS: "Block",
            esES: "Bloque"
        },
        type: {
            ptBR: "Tipo",
            enUS: "Type",
            esES: "Tipo"
        },
        protons: {
            ptBR: "Protons",
            enUS: "Protons",
            esES: "Protones"
        }
    },
    gameStatus: {
        pause: {
            ptBR: "Pausar",
            enUS: "Pause",
            esES: "Pausar"
        },
        resume: {
            ptBR: "Continuar",
            enUS: "Resume",
            esES: "Continuar"
        },
        restart: {
            ptBR: "Reiniciar",
            enUS: "Restart",
            esES: "Reiniciar"
        },
        attempts: {
            ptBR: "Tentativas",
            enUS: "Attempts",
            esES: "Intentos"
        },
        time: {
            ptBR: "Tempo",
            enUS: "Time",
            esES: "Tiempo"
        },
        score: {
            ptBR: "Score",
            enUS: "Score",
            esES: "Puntuación"
        },
        errors: {
            ptBR: "Erros",
            enUS: "Errors",
            esES: "Errores"
        }
    }
} as const;