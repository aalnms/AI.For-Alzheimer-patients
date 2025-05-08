import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet } from 'react-native';

export default function ReportingAnalytics() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">نظام التقارير والتحليل</ThemedText>
      <ThemedText>
        استعرض تقارير مفصلة حول تفاعل المريض، المزاج، وعدد الذكريات المسترجعة باستخدام الرسوم البيانية والإحصائيات.
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
