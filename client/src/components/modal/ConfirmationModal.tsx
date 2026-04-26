import { UIModal } from './UI/UIModal';
import styled from 'styled-components';

const ModalFooter = styled.footer`
	display: flex;
	justify-content: flex-end;
	gap: 10px;
	margin-top: 25px;

	& button {
		padding: 10px 20px;
		border-radius: 12px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		border: none;
	}

	& .cancel-btn {
		background: #f0f0f0;
		color: #666;
	}

	& .cancel-btn:hover {
		background: #e5e5e5;
	}

	& .confirm-btn {
		background: #4caf50;
		color: white;
	}

	& .confirm-btn:hover {
		background: #45a049;
		transform: translateY(-2px);
	}
`;

const ModalHeader = styled.header`
	font-weight: 600;
	margin-bottom: 15px;
	color: #1a1a1a;
`;

const ModalBody = styled.div`
	font-size: 16px;
	color: #555;
	line-height: 1.5;
`;

interface ModalParams {
	title: string;
	description: string;
	onClose: () => void;
	onConfirm: () => void;
	closeText?: string;
	confirmText?: string;
}

interface ConfirmationModalProps {
	modalParams: ModalParams;
}

export const ConfirmationModal = ({ modalParams }: ConfirmationModalProps) => {
	return (
		<UIModal isOpen onClose={modalParams.onClose}>
			<ModalHeader>{modalParams.title}</ModalHeader>
			<ModalBody>{modalParams.description}</ModalBody>
			<ModalFooter>
				<button className="cancel-btn" onClick={modalParams.onClose}>
					{modalParams.closeText || 'Отмена'}
				</button>
				<button className="confirm-btn" onClick={modalParams.onConfirm}>
					{modalParams.confirmText || 'Ок'}
				</button>
			</ModalFooter>
		</UIModal>
	);
};
