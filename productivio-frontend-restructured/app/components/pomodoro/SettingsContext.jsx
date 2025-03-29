import { createContext } from "react";

const SettingsContext = createContext({
    workMinutes: 25,
    breakMinutes: 5,
    setWorkMinutes: () => {},
    setBreakMinutes: () => {}
});

export default SettingsContext;
