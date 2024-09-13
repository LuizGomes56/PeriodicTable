import { ButtonHeight, ButtonWidth, Lang, Translations } from "../types";

export default function Darkmode({ darkmode, onChange, language }: { darkmode: boolean, onChange: () => void, language: Lang }) {
    return (
        <label htmlFor="darkmode">
            <div className={`select-none has-[:checked]:bg-emerald-300 ${ButtonWidth} ${ButtonHeight} cursor-pointer text-nowrap text-center px-4 bg-rose-100 rounded transition-all duration-300 justify-center flex items-center text-black`}>
                <input
                    type="checkbox"
                    id="darkmode"
                    className="appearance-none hidden"
                    checked={darkmode}
                    onChange={onChange}
                />
                <span className="font-medium">{darkmode ? Translations.darkmode[language][1] : Translations.darkmode[language][0]}</span>
            </div>
        </label>
    )
}