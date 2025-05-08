import { Stack } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const MEMORY_TYPES = ['صور', 'فيديو', 'صوت', 'نصوص'];
const DURATIONS = ['10 دقائق', '20 دقيقة', '30 دقيقة'];

export default function SessionWizardScreen() {
  const [memoryType, setMemoryType] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [vrEnabled, setVrEnabled] = useState(false);
  const [massageEnabled, setMassageEnabled] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'معالج إعداد الجلسة' }} />
      <ThemedText type="title" style={styles.title}>معالج إعداد الجلسة</ThemedText>

      {/* اختيار نوع الذكريات */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>اختر نوع الذكريات</ThemedText>
      <View style={styles.optionsRow}>
        {MEMORY_TYPES.map(type => (
          <OptionButton
            key={type}
            label={type}
            selected={memoryType === type}
            onPress={() => setMemoryType(type)}
          />
        ))}
      </View>

      {/* اختيار مدة الجلسة */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>اختر مدة الجلسة</ThemedText>
      <View style={styles.optionsRow}>
        {DURATIONS.map(d => (
          <OptionButton
            key={d}
            label={d}
            selected={duration === d}
            onPress={() => setDuration(d)}
          />
        ))}
      </View>

      {/* خيارات إضافية */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>خيارات إضافية</ThemedText>
      <View style={styles.optionsRow}>
        <ToggleButton
          label="الواقع الافتراضي"
          enabled={vrEnabled}
          onPress={() => setVrEnabled(v => !v)}
        />
        <ToggleButton
          label="التدليك الذكي"
          enabled={massageEnabled}
          onPress={() => setMassageEnabled(v => !v)}
        />
      </View>
    </ThemedView>
  );
}

function OptionButton({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <ThemedView
      style={[
        styles.optionButton,
        selected && styles.optionButtonSelected,
      ]}
    >
      <ThemedText
        style={{ color: selected ? '#fff' : '#0a7ea4' }}
        onPress={onPress}
      >
        {label}
      </ThemedText>
    </ThemedView>
  );
}

function ToggleButton({ label, enabled, onPress }: { label: string; enabled: boolean; onPress: () => void }) {
  return (
    <ThemedView
      style={[
        styles.toggleButton,
        enabled && styles.toggleButtonEnabled,
      ]}
    >
      <ThemedText
        style={{ color: enabled ? '#fff' : '#0a7ea4' }}
        onPress={onPress}
      >
        {label}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 18,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  optionButtonSelected: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  toggleButton: {
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
  },
  toggleButtonEnabled: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
});
