import { useSelector } from 'react-redux';
import { Error } from '../error/Error';
import { selectUserRole } from '../../selectors';
import { checkAccess } from '../../utils';
import { ERROR } from '../../constants';

export const PrivateContent = ({
	children,
	access,
	check = true,
	serverError = null,
}) => {
	const userRole = useSelector(selectUserRole);

	const hasRoleAccess = checkAccess(access, userRole);

	const accessError = hasRoleAccess && check ? null : ERROR.ACCESS_DENIED;

	const error = serverError || accessError;

	return error ? <Error error={error} /> : children;
};
