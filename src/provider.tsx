import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { LanguageModel } from "ai";
import React from "react";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: false,
		},
	},
});

const AIModelContext = React.createContext<Props>({});

interface Props {
	model?: LanguageModel;
	queryClient?: QueryClient;
}

export const AIModelProvider: React.FC<React.PropsWithChildren<Props>> = (
	props,
) => (
	<QueryClientProvider client={props.queryClient ?? queryClient}>
		<AIModelContext.Provider value={{ model: props.model, queryClient }}>
			{props.children}
		</AIModelContext.Provider>
	</QueryClientProvider>
);

export const useModelContext = () => React.useContext(AIModelContext);
