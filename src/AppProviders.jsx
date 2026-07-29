import { ThemeProvider } from "./context/ThemeContext";
import { FavouritesProvider } from "./HeaderAndFooter/context/FavouritesContext";
import { UserProvider } from "./context/UserContext";

export function AppProviders({ children }) {
    return (
        <UserProvider>
            <ThemeProvider>
                <FavouritesProvider>
                    {children}
                </FavouritesProvider>
            </ThemeProvider>
        </UserProvider>
    )
}