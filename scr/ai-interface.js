console.log('AIInterface loaded');
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StyleSheet } from 'react-native';

export default function AIInterface() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">واجهة الذكاء الاصطناعي</ThemedText>
      <ThemedText>
        تفاعل مع الذكاء الاصطناعي لتحليل البيانات وتقديم توصيات علاجية مخصصة.
      </ThemedText>
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