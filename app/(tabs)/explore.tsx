import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">ميزات البحث والتصنيف والإشعارات</ThemedText>
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">بحث وتصنيف متقدم للذكريات</ThemedText>
        <ThemedText>
          صنّف الذكريات باستخدام علامات (Tags) وابحث بسرعة حسب النوع أو الكلمات المفتاحية أو التاريخ.
        </ThemedText>
        {/* مثال على واجهة البحث والتصنيف (للتطوير لاحقاً) */}
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">إشعارات ذكية وتذكيرات</ThemedText>
        <ThemedText>
          احصل على تنبيهات تلقائية لمواعيد الجلسات أو عند الحاجة لإضافة ذكريات جديدة أو عند تغيّر تفاعل المريض.
        </ThemedText>
        {/* مثال على إشعار أو تذكير (للتطوير لاحقاً) */}
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText type="subtitle">أمثلة على الاستخدام</ThemedText>
        <ThemedText>
          - البحث عن ذكريات "العيد" في 2022<br />
          - تصنيف الذكريات: عائلية، سفر، إنجازات<br />
          - إشعار: "اقترب موعد جلسة اليوم مع المريض"
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  sectionContainer: {
    gap: 8,
    marginBottom: 18,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 12,
  },
});
