import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet } from 'react-native';

export default function DeviceIntegration() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">ربط الأجهزة</ThemedText>
      <ThemedText>
        قم بربط الأجهزة الذكية مثل نظارات الواقع الافتراضي وأجهزة التدليك الذكي لتجربة علاجية متكاملة.
      </ThemedText>
      {/* مكونات إضافية سيتم إضافتها لاحقاً */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
