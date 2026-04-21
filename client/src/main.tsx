import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { router } from './router/router.ts';
import { AppProvider } from './AppProvider.tsx';
import './index.css';
import './i18n';

createRoot(document.getElementById('root')!).render(
	<AppProvider>
		<RouterProvider router={router} />
	</AppProvider>,
);
