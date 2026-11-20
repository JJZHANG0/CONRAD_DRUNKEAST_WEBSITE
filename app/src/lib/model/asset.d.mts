import type * as THREE from 'three'
export function createAsset(three: typeof THREE, options?: {states?: string; sharedResources?: boolean}): Promise<THREE.Group & { dispose: () => Promise<void> }>
