import { Difficulty } from "../types";

const MaxAlgarisms = 5

export default function ArcadeEditor({ mainkey, name, value, onChange }: { mainkey: keyof Difficulty["arcade"], name: string, value: number, onChange: (key: keyof Difficulty["arcade"], val: number) => void }) {
    const onEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        let InputVal = e.target.value.replace(/\D/g, '');
        if (InputVal.length <= MaxAlgarisms) {
            onChange(mainkey, Number(InputVal));
        }
    };

    return (
        <div className="grid grid-cols-2 gap-1 md:max-w-[228px]">
            <label htmlFor={mainkey} className="bg-stone-100 dark:bg-white rounded text-center font-semibold min-w-28 h-10 content-center">
                {name}
            </label>
            <input
                id={mainkey}
                type="text"
                inputMode="numeric"
                value={value >= 1e6 ? "∞" : value.toString()}
                onChange={onEvent}
                className={`${value >= 1e6 && "text-xl"} min-w-28 h-10 px-4 text-center dark:bg-sky-400 font-semibold bg-blue-100 rounded`}
            />
        </div>
    )
}
