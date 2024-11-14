import { Outlet } from 'react-router';

import { FormLayout as FormLayoutComponent } from '~/components/layouts/form-layout'

export default function FormLayout() {
	return (
		<FormLayoutComponent>
			<Outlet />
		</FormLayoutComponent>
	)
}
