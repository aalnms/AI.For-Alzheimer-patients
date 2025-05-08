import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet } from 'react-native';

export default function PatientFiles() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">إدارة ملفات المرضى</ThemedText>
      <ThemedText>
        قم بإدارة ملفات المرضى بسهولة، بما في ذلك إضافة معلومات جديدة، تعديل البيانات، أو حذف الملفات.
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
