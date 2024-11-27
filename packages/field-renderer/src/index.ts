import { createIsland } from '~/modules/island'
import { FieldRenderer } from './components/field-renderer'

export const formWidget = () => createIsland(FieldRenderer)
