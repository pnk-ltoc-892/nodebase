import { PAGINATION } from "@/config/constants"
import { useEffect, useState } from "react"



interface UseEntitySearchProps<T extends {
    search: string 
    page: number }
>{
    params: T
    setParams: (params: T) => void
    debounceMs?: number
}


/**
 * Provides a debounced local search state that stays in sync with external params and resets pagination when the search changes.
 *
 * Keeps an internal `searchValue` synchronized with `params.search`. When the local search is cleared it immediately updates `params` to clear the search and reset `page` to `PAGINATION.DEFAULT_PAGE`. Otherwise it updates `params.search` to the debounced local value and resets `page` to `PAGINATION.DEFAULT_PAGE` after `debounceMs` milliseconds.
 *
 * @param params - External params object containing `search` and `page`
 * @param setParams - Callback to update the external params
 * @param debounceMs - Debounce delay in milliseconds for updating `params.search` (default: 500)
 * @returns An object with `searchValue` (the current local search string) and `onSearchChange` (setter to update the local search)
 */
export function useEntitySearch<T extends {
    search: string 
    page: number
}>({
    params,
    setParams,
    debounceMs = 500
}: UseEntitySearchProps<T>){
    const [localSearch, setLocalSearch] = useState(params.search)

    useEffect( () => {
        if(localSearch === "" && params.search !== ""){
            setParams({
                ...params,
                search: "",
                page: PAGINATION.DEFAULT_PAGE
            })
            return
        }

        const timer = setTimeout(() => {
            if(localSearch !==  params.search){
                setParams({
                    ...params,
                    search: localSearch,
                    page: PAGINATION.DEFAULT_PAGE
                })
            }
        }, debounceMs)
        
        return () => clearTimeout(timer)
    }, [localSearch, params, setParams, debounceMs])

    useEffect(() => {
        setLocalSearch(params.search)
    }, [params.search])

    return {
        searchValue: localSearch,
        onSearchChange: setLocalSearch
    }
}