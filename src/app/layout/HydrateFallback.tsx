/** Render vazio enquanto o loader inicial roda (o mock responde na hora). */
export function HydrateFallback() {
  return <div className="min-h-screen bg-paper-50" aria-busy="true" />
}
