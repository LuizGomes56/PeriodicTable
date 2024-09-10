export default function Darkmode({ darkmode, onChange }: { darkmode: boolean, onChange: () => void }) {
    return (
        <label htmlFor="darkmode">
            <div className="select-none has-[:checked]:bg-emerald-300 min-w-28 cursor-pointer text-nowrap h-10 text-center px-4 bg-rose-100 rounded transition-all duration-300 justify-center flex items-center text-black">
                <input
                    type="checkbox"
                    id="darkmode"
                    className="appearance-none hidden"
                    checked={darkmode}
                    onChange={onChange}
                />
                <span className="font-medium">Darkmode</span>
            </div>
        </label>
    )
}