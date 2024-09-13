import { ButtonHeight, ButtonWidth, Difficulty } from "../types";

const MaxAlgarisms = 5;

export default function ArcadeEditor({ mainkey, name, value, onChange, setCustom }: { mainkey: keyof Difficulty["arcade"], name: string, value: number, onChange: (key: keyof Difficulty["arcade"], val: number) => void, setCustom: () => void }) {
    const onEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const InputVal = e.target.value.replace(/\D/g, '');
        if (InputVal.length <= MaxAlgarisms) {
            const toNum = Number(InputVal);
            setCustom();
            onChange(mainkey, toNum);
        }
    };

    return (
        <div className="grid grid-cols-2 gap-1">
            <label htmlFor={mainkey} className={`bg-stone-100 dark:bg-white rounded text-center font-semibold ${ButtonHeight} ${ButtonWidth} content-center`}>
                {name}
            </label>
            <input
                id={mainkey}
                type="text"
                inputMode="numeric"
                value={value >= 1e6 ? "∞" : value.toString()}
                onChange={onEvent}
                className={`${value >= 1E6 && "text-xl"} ${ButtonHeight} ${ButtonWidth} px-4 text-center dark:bg-sky-400 font-semibold bg-blue-100 rounded`}
            />
        </div>
    )
}
