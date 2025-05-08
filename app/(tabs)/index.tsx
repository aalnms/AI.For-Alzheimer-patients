import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.accessibleTitle}>
          ذاكرة الحاضر - لوحة مقدم الرعاية
        </ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">معالج إعداد الجلسة</ThemedText>
        <ThemedText>
          ابدأ جلسة جديدة عبر خطوات مبسطة: اختر نوع الذكريات، مدة الجلسة، وفعّل خيارات الواقع الافتراضي أو التدليك الذكي.
        </ThemedText>
        <TouchableOpacity
          style={styles.largeButton}
          onPress={async () => {
            // Placeholder for audio instruction
            console.log('Audio instruction: بدء معالج الإعداد');
          }}>
          <Text style={styles.buttonText}>بدء معالج الإعداد</Text>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">إدارة مكتبة الذكريات</ThemedText>
        <ThemedText>
          أضف، رتب، أو احذف الذكريات (صور، فيديو، صوت) بسهولة عبر واجهة سحب وإفلات.
        </ThemedText>
        {/* زر إدارة الذكريات (للتطوير لاحقاً) */}
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">لوحة تتبع التقدم</ThemedText>
        <ThemedText>
          راقب تفاعل المريض، المزاج، وعدد الذكريات المسترجعة عبر رسوم بيانية وإحصائيات.
        </ThemedText>
        {/* مكان للرسوم البيانية لاحقاً */}
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">ميزات إضافية</ThemedText>
        <ThemedText>
          - إشعارات ذكية وتذكيرات للجلسات{'\n'}- بحث وتصنيف متقدم للذكريات
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  accessibleTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  largeButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionContainer: {
    gap: 8,
    marginBottom: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 12,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  actionButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
});
