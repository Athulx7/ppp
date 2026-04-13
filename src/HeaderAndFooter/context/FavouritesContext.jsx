import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { ApiCall } from '../../library/constants'

const FavouritesContext = createContext()

export function FavouritesProvider({ children }) {
    const [favourites, setFavourites] = useState([])

    const loadFavourites = useCallback(async () => {
        try {
            const res = await ApiCall('GET', '/menuFavourites')
            if (res?.data?.success) {
                setFavourites(res.data.data.data)
            }
        } catch (err) {
            console.error('Failed to load favourites', err)
        }
    }, [])

    useEffect(() => {
        loadFavourites()
    }, [loadFavourites])

    const toggleFavourite = useCallback(async (item) => {

        const route = item.routes || item.route_path
        const name = item.label || item.sub_menu_name
        const icon = item.icon || item.icon_name

        const isAlreadyFav = favourites.some(f => f.route_path === route)

        if (isAlreadyFav) {
            setFavourites(prev => prev.filter(f => f.route_path !== route))
        } else {
            const newFav = { route_path: route, sub_menu_name: name, icon_name: icon }
            setFavourites(prev => {
                const updated = [newFav, ...prev]
                return updated.length > 10 ? updated.slice(0, 10) : updated
            })
        }

        try {
            await ApiCall('POST', '/menuFavourites/toggle', { route_path: route })
        } catch (err) {
            console.error('Failed to toggle favourite', err)
            loadFavourites()
        }
    }, [favourites, loadFavourites])

    const favRoutes = favourites.map(f => f.route_path)

    return (
        <FavouritesContext.Provider value={{ favourites, favRoutes, toggleFavourite, loadFavourites }}>
            {children}
        </FavouritesContext.Provider>
    )
}

export const useFavourites = () => useContext(FavouritesContext)