import { useState, type ReactNode } from 'react';
import { ConfirmationModal } from '../components/modal/ConfirmationModal';
import { ConfirmationContext, type ConfirmationParams } from './ConfirmationContext';

interface ModalState extends ConfirmationParams {
	onClose: () => void;
	onConfirm: () => void;
}

export const ConfirmationProvider = ({ children }: { children: ReactNode }) => {
	const [modalParams, setModalParams] = useState<ModalState | null>(null);

	const closeConfirmation = () => {
		modalParams?.onClose();
	};

	const getConfirmation = (params: ConfirmationParams): Promise<boolean> => {
		return new Promise((resolve) => {
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
