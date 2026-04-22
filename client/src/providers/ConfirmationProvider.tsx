import { createContext, useContext, useState } from 'react';
import { ConfirmationModal } from '../components/modal/ConfirmationModal';

const ConfirmationContext = createContext();

export const useGetConfirmation = () => {
	const context = useContext(ConfirmationContext);

	if (!context) {
		throw new Error('useConfirmation must be used within a ConfirmationProvider');
	}
	return context;
};
export const ConfirmationProvider = ({ children }: { children: React.ReactNode }) => {
	const [modalParams, setModalParams] = useState();

	const closeConfirmation = () => {
		modalParams.onClose();
	};

	const getConfirmation = (params) => {
		return new Promise((resolve, reject) => {
			setModalParams({
				...params,
				onClose: () => {
					setModalParams(null);
					resolve(false);
				},
				onConfirm: () => {
					setModalParams(null);
					resolve(true);
				},
			});
		});
	};

	return (
		<ConfirmationContext value={{ closeConfirmation, getConfirmation }}>
			{children}
			{modalParams && <ConfirmationModal modalParams={modalParams} />}
		</ConfirmationContext>
	);
};
