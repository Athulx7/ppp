import { ThemeProvider } from "./context/ThemeContext";
import { FavouritesProvider } from "./HeaderAndFooter/context/FavouritesContext";

export function AppProviders({ children }) {
    return (
        <ThemeProvider>
            <FavouritesProvider>
                {children}
            </FavouritesProvider>
        </ThemeProvider>
    )
}