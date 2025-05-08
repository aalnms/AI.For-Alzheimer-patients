import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet } from 'react-native';

export default function SessionSetup() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">إعداد الجلسة</ThemedText>
      <ThemedText>
        قم بإعداد جلسة علاجية مخصصة عبر اختيار الذكريات، مدة الجلسة، وتفعيل خيارات الواقع الافتراضي أو التدليك الذكي.
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
