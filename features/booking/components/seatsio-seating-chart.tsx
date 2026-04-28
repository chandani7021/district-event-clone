import SeatsioSeatingChartSDK from '@seatsio/seatsio-react-native';
import { View } from 'react-native';
import { THEME } from '@/lib/theme';

interface ZonePricing {
  readonly category: string;
  readonly price: number;
}

export interface ObjectPopoverConfig {
  showLabel?: boolean;
  showCategory?: boolean;
  showPricing?: boolean;
  showUnavailableNotice?: boolean;
}

interface SeatsioSeatingChartProps {
  workspaceKey: string;
  event: string;
  region: string;
  pricing?: readonly ZonePricing[];
  filteredCategories?: string[];
  unavailableCategories?: string[];
  objectPopover?: ObjectPopoverConfig;
  onObjectClicked: (obj: any) => void;
}

export function SeatsioSeatingChart({
  workspaceKey,
  event,
  region,
  pricing,
  filteredCategories,
  unavailableCategories,
  objectPopover,
  onObjectClicked,
}: SeatsioSeatingChartProps) {
  return (
    <View style={{ flex: 1, backgroundColor: '#09090b' }}>
      <SeatsioSeatingChartSDK
        workspaceKey={workspaceKey}
        event={event}
        region={region}
        colorScheme="dark"
        pricing={pricing}
        filteredCategories={filteredCategories}
        unavailableCategories={unavailableCategories}
        objectPopover={objectPopover}
        showMinimap={true}
        minimap={{ enabled: true, showOnMobile: true, position: 'top-right' }}
        showZoomOutButtonOnMobile={true}
        onObjectClicked={(obj) => {
          onObjectClicked({
            id: obj.id,
            label: obj.label,
            category: obj.category ? { label: obj.category.label, key: obj.category.key || obj.category.label } : null,
            pricing: obj.pricing ? { price: obj.pricing.price } : null,
          });
        }}
      />
    </View>
  );
}
