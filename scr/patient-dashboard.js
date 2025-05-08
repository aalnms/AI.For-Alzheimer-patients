import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useState } from 'react';
import { Button, I18nManager, Image, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

// فرض اتجاه RTL
if (I18nManager.isRTL === false) {
  I18nManager.forceRTL(true);
}

export default function PatientDashboard() {
  const patient = { name: 'محمد', image: require('@/assets/images/E30A99BB-3278-419C-8002-EE399608FB56.png') };
  const nextSession = { time: '10:30 صباحاً', inMinutes: 45 };
  const progress = 0.7;
  const achievements = 5;

  const [volume, setVolume] = useState(50);
  const [brightness, setBrightness] = useState(70);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ترحيب شخصي وصورة المريض */}
        <View style={styles.header}>
          <Image source={patient.image} style={styles.avatar} />
          <ThemedText type="title" style={[styles.rtlText, styles.titleText]}>مرحباً، {patient.name}!</ThemedText>
        </View>

        {/* شريط حالة الجلسة القادمة */}
        <View style={styles.statusBar}>
          <ThemedText style={[styles.rtlText, styles.primaryText]}>الجلسة القادمة: {nextSession.time}</ThemedText>
          <ThemedText style={[styles.rtlText, styles.secondaryText]}>الوقت المتبقي: {nextSession.inMinutes} دقيقة</ThemedText>
        </View>

        {/* رزنامة مبسطة */}
        <View style={styles.calendar}>
          <ThemedText style={[styles.rtlText, styles.primaryText]}>جلسات هذا الأسبوع:</ThemedText>
          <View style={styles.calendarRow}>
            {['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج'].map((d, i) => (
              <View key={i} style={[styles.day, i === 2 && styles.activeDay]}>
                <ThemedText style={[styles.rtlText, styles.dayText]}>{d}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* أزرار كبيرة للأقسام */}
        <View style={styles.sections}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row-reverse' }}>
            <SectionButton color="#7BC6CC" label="جلستي القادمة" icon="🕒" />
            <SectionButton color="#FFD86F" label="مكتبة ذكرياتي" icon="📚" />
            <SectionButton color="#A0D995" label="ألبوم العائلة" icon="👨‍👩‍👧‍👦" />
            <SectionButton color="#B39DDB" label="ألعاب الذاكرة" icon="🧩" />
          </ScrollView>
        </View>

        {/* ملخص التقدم والإنجازات */}
        <View style={styles.progressBox}>
          <ThemedText style={[styles.rtlText, styles.primaryText]}>التقدم:</ThemedText>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
          <ThemedText style={[styles.rtlText, styles.secondaryText]}>
            إنجازات: <Text style={{fontSize: 18}}>🏅</Text> {achievements}
          </ThemedText>
        </View>

        {/* التفضيلات السهلة */}
        <View style={styles.preferences}>
          <ThemedText style={[styles.rtlText, styles.primaryText]}>التفضيلات:</ThemedText>
          <View style={styles.prefRow}>
            <ThemedText style={[styles.rtlText, styles.secondaryText]}>الصوت</ThemedText>
            <Button title="-" onPress={() => setVolume(v => Math.max(0, v - 10))} />
            <ThemedText style={[styles.rtlText, styles.primaryText]}>{volume}%</ThemedText>
            <Button title="+" onPress={() => setVolume(v => Math.min(100, v + 10))} />
          </View>
          <View style={styles.prefRow}>
            <ThemedText style={[styles.rtlText, styles.secondaryText]}>السطوع</ThemedText>
            <Button title="-" onPress={() => setBrightness(b => Math.max(0, b - 10))} />
            <ThemedText style={[styles.rtlText, styles.primaryText]}>{brightness}%</ThemedText>
            <Button title="+" onPress={() => setBrightness(b => Math.min(100, b + 10))} />
          </View>
        </View>

        {/* قسم نموذج الذكاء الاصطناعي */}
        <View style={styles.aiSection}>
          <ThemedText type="subtitle" style={[styles.rtlText, styles.titleText]}>نموذج الذكاء الاصطناعي</ThemedText>
          <ThemedText style={[styles.rtlText, styles.secondaryText]}>
            هنا سيتم عرض ملخص عن أسلوب الذكاء الاصطناعي مع المريض واستجابته وتوصيات مخصصة.
          </ThemedText>
        </View>
      </ScrollView>

      {/* زر SOS */}
      <TouchableOpacity style={styles.sosButton} onPress={() => alert('تم طلب المساعدة!')}>
        <ThemedText style={styles.sosText}>SOS 🚨</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

// زر قسم كبير
function SectionButton({ color, label, icon }) {
  return (
    <TouchableOpacity style={[styles.sectionBtn, { backgroundColor: color }]}>
      <Text style={{ fontSize: 32 }}>{icon}</Text>
      <ThemedText style={[styles.sectionLabel, styles.rtlText, styles.primaryText]}>{label}</ThemedText>
    </TouchableOpacity>
  );
}

import { Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 32 : 16,
    paddingHorizontal: 10,
    backgroundColor: '#F6F7FB',
    justifyContent: 'flex-start',
    direction: 'rtl',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    gap: 12,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginLeft: 10,
    backgroundColor: '#E0E0E0',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  titleText: {
    color: '#1A237E', // أزرق داكن للعناوين
    fontWeight: 'bold',
  },
  primaryText: {
    color: '#222', // أسود تقريباً للنصوص الأساسية
  },
  secondaryText: {
    color: '#607D8B', // رمادي أزرق للنصوص الثانوية
  },
  dayText: {
    color: '#37474F', // رمادي داكن لأيام الأسبوع
    fontWeight: 'bold',
  },
  statusBar: {
    backgroundColor: '#E0F7FA',
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-end',
    marginBottom: 12,
    elevation: 1,
  },
  calendar: {
    backgroundColor: '#FFFDE7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  calendarRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  day: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeDay: {
    backgroundColor: '#FFD86F',
    borderColor: '#FFD86F',
  },
  sections: {
    marginBottom: 14,
    minHeight: 120,
  },
  sectionBtn: {
    width: 130,
    height: 110,
    borderRadius: 18,
    marginHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#B0BEC5',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionLabel: {
    fontSize: 17,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    // اللون الأساسي للنصوص في الأزرار
    color: '#222',
  },
  progressBox: {
    backgroundColor: '#E3FCEC',
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  progressBarBg: {
    width: '100%',
    height: 14,
    backgroundColor: '#C8E6C9',
    borderRadius: 7,
    marginVertical: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 14,
    backgroundColor: '#43A047',
    borderRadius: 7,
  },
  preferences: {
    backgroundColor: '#FFFDE7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  prefRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
    gap: 8,
  },
  sosButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    backgroundColor: '#FF5252',
    borderRadius: 32,
    paddingVertical: 14,
    paddingHorizontal: 30,
    elevation: 6,
    zIndex: 100,
    shadowColor: '#B71C1C',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  sosText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    letterSpacing: 1,
  },
  aiSection: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    marginBottom: 30,
  },
});
