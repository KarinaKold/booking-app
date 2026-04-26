import { createContext, useContext } from 'react';

export interface ConfirmationParams {
	title: string;
	description: string;
	confirmText?: string;
	closeText?: string;
}

export interface ConfirmationContext {
	closeConfirmation: () => void;
	getConfirmation: (params: ConfirmationParams) => Promise<boolean>;
}

export const ConfirmationContext = createContext<ConfirmationContext | null>(null);

export const useGetConfirmation = (): ConfirmationContext => {
	const context = useContext(ConfirmationContext);
	if (!context) {
		throw new Error('useConfirmation must be used within a ConfirmationProvider');
	}
	return context;
};
