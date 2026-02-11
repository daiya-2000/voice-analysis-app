import { StyleSheet, View } from 'react-native';

import { palette } from '@/src/presentation/theme/palette';

interface WaveBarsProps {
  heights: number[];
  activeFrom?: number;
  barWidth?: number;
}

export function WaveBars({ heights, activeFrom = Number.MAX_SAFE_INTEGER, barWidth = 4 }: WaveBarsProps) {
  return (
    <View style={styles.row}>
      {heights.map((height, index) => (
        <View
          key={`wave-${index}`}
          style={[
            styles.bar,
            {
              height,
              width: barWidth,
              backgroundColor: index >= activeFrom ? palette.primary : 'rgba(43, 238, 108, 0.3)',
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  bar: {
    borderRadius: 99,
  },
});
