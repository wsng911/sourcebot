'use client';

import { useNonEmptyQueryParam } from "@/hooks/useNonEmptyQueryParam";
import { createContext, useCallback, useEffect, useState } from "react";

export interface BrowseState {
    selectedSymbolInfo?: {
        symbol名称: string;
        repo名称: string;
        revision名称: string;
        language: string;
    }
    isBottomPanelCollapsed: boolean;
    isFileTreePanelCollapsed: boolean;
    isFile搜索Open: boolean;
    activeExploreMenuTab: "references" | "definitions";
    activeBottomPanelTab: "explore" | "history";
    bottomPanelSize: number;
}

const defaultState: BrowseState = {
    selectedSymbolInfo: undefined,
    isBottomPanelCollapsed: true,
    isFileTreePanelCollapsed: false,
    isFile搜索Open: false,
    activeExploreMenuTab: "references",
    activeBottomPanelTab: "history",
    bottomPanelSize: 35,
};

export const SET_BROWSE_STATE_QUERY_PARAM = "setBrowseState";

export const BrowseStateContext = createContext<{
    state: BrowseState;
    updateBrowseState: (state: Partial<BrowseState>) => void;
}>({
    state: defaultState,
    updateBrowseState: () => {},
});

interface BrowseStateProviderProps {
    children: React.ReactNode;
}

export const BrowseStateProvider = ({ children }: BrowseStateProviderProps) => {
    const [state, setState] = useState<BrowseState>(defaultState);

    const hydratedBrowseState = useNonEmptyQueryParam(SET_BROWSE_STATE_QUERY_PARAM);

    const onUpdateState = useCallback((state: Partial<BrowseState>) => {
        setState((prevState) => ({
            ...prevState,
            ...state,
        }));
    }, []);

    useEffect(() => {
        if (hydratedBrowseState) {
            try {
                const parsedState = JSON.parse(hydratedBrowseState) as Partial<BrowseState>;
                onUpdateState(parsedState);
            } catch (error) {
                console.error("Error parsing hydratedBrowseState", error);
            }

            // 移除 the query param
            const url = new URL(window.location.href);
            url.searchParams.delete(SET_BROWSE_STATE_QUERY_PARAM);
            window.history.replaceState({}, '', url.toString());
        }
    }, [hydratedBrowseState, onUpdateState]);

    return (
        <BrowseStateContext.Provider
            value={{
                state,
                updateBrowseState: onUpdateState,
            }}
        >
            {children}
        </BrowseStateContext.Provider>
    );
};