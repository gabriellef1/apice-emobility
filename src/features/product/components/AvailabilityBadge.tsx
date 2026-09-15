import { Badge } from '@/components/ui/Badge'
import { type Availability, AVAILABILITY_LABELS } from '@/services/catalog'

const tone: Record<Availability, 'success' | 'warning' | 'muted'> = {
  in_stock: 'success',
  pre_order: 'warning',
  sold_out: 'muted',
}

export function AvailabilityBadge({ availability }: { availability: Availability }) {
  return <Badge tone={tone[availability]}>{AVAILABILITY_LABELS[availability]}</Badge>
}
