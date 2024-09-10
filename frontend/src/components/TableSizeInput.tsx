export default function TableSizeInput({ value, onChange }: { value: number, onChange: (val: number) => void }) {
    const onEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        let InputVal = e.target.value.replace(/\D/g, '');
        if (InputVal.length > 0) {
            const lastDigit = InputVal.slice(-1);
            onChange(Number(lastDigit));
        }
    };

    return (
        <div className="grid grid-cols-2 gap-1">
            <label htmlFor="tableSize" className="bg-stone-100 dark:bg-white rounded text-center font-semibold w-28 h-10 content-center">
                Table Size
            </label>
            <input
                id="tableSize"
                type="text"
                inputMode="numeric"
                value={value.toString()}
                onChange={onEvent}
                className="w-28 h-10 px-4 text-center dark:bg-sky-400 font-semibold bg-blue-100 rounded"
            />
        </div>
    )
}