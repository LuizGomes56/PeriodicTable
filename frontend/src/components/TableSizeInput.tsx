import { ButtonHeight, ButtonWidth } from "../types";

export default function TableSizeInput({ value, onChange }: { value: number, onChange: (val: number) => void }) {
    const onEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const InputVal = e.target.value.replace(/\D/g, '');
        if (InputVal.length > 0) {
            const LastDigit = InputVal.slice(-1);
            onChange(Number(LastDigit));
        }
    };

    return (
        <div className="grid grid-cols-2 gap-1">
            <label htmlFor="tableSize" className={`bg-stone-100 ${ButtonHeight} ${ButtonWidth} dark:bg-white rounded text-center font-semibold content-center`}>
                Table Size
            </label>
            <input
                id="tableSize"
                type="text"
                inputMode="numeric"
                value={value.toString()}
                onChange={onEvent}
                className={`px-4 ${ButtonHeight} ${ButtonWidth} text-center dark:bg-sky-400 font-semibold bg-blue-100 rounded`}
            />
        </div>
    )
}