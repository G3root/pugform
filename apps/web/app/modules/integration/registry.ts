import type { IntegrationHandler } from './integrations/_base'
import { handlers } from './integrations/_handlers'
import type { TIntegrationIds } from './schema'
import type { IntegrationMetadata } from './types'

interface TRegistryMetadata extends IntegrationMetadata {
	id: TIntegrationIds
}

export class IntegrationRegistry {
	private handlerInstances = new Map<TIntegrationIds, IntegrationHandler>()
	private allMetadata: TRegistryMetadata[] = []

	constructor() {
		// Initialize handlers
		// biome-ignore lint/complexity/noForEach: <explanation>
		Object.entries(handlers).forEach(([id, Handler]) => {
			const handler = new Handler()
			const integrationId = id as TIntegrationIds
			this.handlerInstances.set(integrationId, handler)
			this.allMetadata.push({ ...handler.metadata, id: integrationId })
		})
	}

	getHandler(type: TIntegrationIds) {
		const handler = this.handlerInstances.get(type)
		if (!handler) {
			throw new Error(`No handler found for integration type: ${type}`)
		}
		return handler
	}
	getAllMetadata() {
		return this.allMetadata
	}

	getMetadata(type: TIntegrationIds) {
		const metadata = this.handlerInstances.get(type)?.metadata
		if (!metadata) {
			throw new Error(`No metadata found for integration type: ${type}`)
		}
		return metadata
	}
}
