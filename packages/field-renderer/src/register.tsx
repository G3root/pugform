import { customElement, noShadowDOM } from 'solid-element'
import { FieldRenderer } from './components/field-renderer'

export function registerWebComponents() {
	customElement('pug-form', getInitialProps(), (props) => {
		noShadowDOM()
		return <FieldRenderer formId={props.formId} />
	})
}

function getInitialProps() {
	return {
		formId: '',
	}
}
