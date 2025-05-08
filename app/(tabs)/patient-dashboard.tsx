import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet } from 'react-native';

export default function PatientDashboard() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">لوحة المريض</ThemedText>
      <ThemedText>
        مرحباً! استمتع بجلسة علاجية مخصصة تجمع بين الذكريات الجميلة والتدليك الذكي.
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
