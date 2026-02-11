import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { AvatarPreset } from '@/src/domain/profile/avatar-preset';
import { palette } from '@/src/presentation/theme/palette';

interface AvatarPresetPickerProps {
  presets: AvatarPreset[];
  selectedPresetId: string;
  onSelect: (preset: AvatarPreset) => void;
}

export function AvatarPresetPicker({ presets, selectedPresetId, onSelect }: AvatarPresetPickerProps) {
  const selectedPreset = presets.find((preset) => preset.id === selectedPresetId) ?? presets[0];

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.preview,
          {
            backgroundColor: selectedPreset?.backgroundColor ?? palette.surface,
            borderColor: selectedPreset?.accentColor ?? palette.primary,
          },
        ]}>
        <MaterialIcons
          name={selectedPreset?.iconName ?? 'person'}
          size={44}
          color={selectedPreset?.accentColor ?? palette.primary}
        />
      </View>

      <View style={styles.optionsRow}>
        {presets.map((preset) => {
          const selected = preset.id === selectedPresetId;

          return (
            <Pressable
              key={preset.id}
              onPress={() => onSelect(preset)}
              style={[
                styles.option,
                {
                  backgroundColor: preset.backgroundColor,
                  borderColor: selected ? preset.accentColor : 'rgba(255, 255, 255, 0.2)',
                  transform: [{ scale: selected ? 1.08 : 1 }],
                },
              ]}>
              <MaterialIcons name={preset.iconName} size={20} color={preset.accentColor} />
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.caption}>用意されたアバターから選択</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    gap: 12,
  },
  preview: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  option: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caption: {
    color: palette.textSecondary,
    fontSize: 12,
  },
});
