import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

const MEMORY_TYPES = ['صور', 'فيديو', 'صوت', 'نصوص'];
const DURATIONS = ['10 دقائق', '20 دقيقة', '30 دقيقة'];
const QUICK_TEMPLATES = [
  { name: 'جلسة صباحية', memoryType: 'صور', duration: '10 دقائق', vr: false, massage: false },
  { name: 'جلسة استرخاء', memoryType: 'صوت', duration: '20 دقيقة', vr: true, massage: true },
  { name: 'جلسة ذكريات عائلية', memoryType: 'فيديو', duration: '30 دقيقة', vr: false, massage: true },
];
const SMART_TAGS = ['عائلة', 'أصدقاء', 'سفر', 'ذكريات الطفولة', 'مناسبات'];

export default function SessionWizardScreen() {
  const [memoryType, setMemoryType] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [vrEnabled, setVrEnabled] = useState(false);
  const [massageEnabled, setMassageEnabled] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reportVisible, setReportVisible] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  function applyTemplate(template: typeof QUICK_TEMPLATES[0]) {
    setMemoryType(template.memoryType);
    setDuration(template.duration);
    setVrEnabled(template.vr);
    setMassageEnabled(template.massage);
  }

  function toggleTag(tag: string) {
    setSelectedTags(tags =>
      tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: 'معالج إعداد الجلسة' }} />
        <ThemedText type="title" style={styles.title}>معالج إعداد الجلسة</ThemedText>

        {/* قوالب جلسات سريعة */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>قوالب جلسات سريعة</ThemedText>
        <View style={styles.templatesRow}>
          {QUICK_TEMPLATES.map(t => (
            <TouchableOpacity key={t.name} onPress={() => applyTemplate(t)}>
              <ThemedView style={styles.templateButton}>
                <Ionicons name="flash" size={18} color="#0a7ea4" />
                <ThemedText>{t.name}</ThemedText>
              </ThemedView>
            </TouchableOpacity>
          ))}
        </View>

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

        {/* نظام الوسوم الذكية */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>وسوم ذكية للذكريات</ThemedText>
        <View style={styles.tagsRow}>
          {SMART_TAGS.map(tag => (
            <TouchableOpacity key={tag} onPress={() => toggleTag(tag)}>
              <ThemedView style={[
                styles.tagButton,
                selectedTags.includes(tag) && styles.tagButtonSelected,
              ]}>
                <ThemedText style={{ color: selectedTags.includes(tag) ? '#fff' : '#0a7ea4' }}>
                  {tag}
                </ThemedText>
              </ThemedView>
            </TouchableOpacity>
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

        {/* إعدادات الإشعارات */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>إشعارات وتذكيرات مخصصة</ThemedText>
        <View style={styles.notificationsRow}>
          <ThemedText>تفعيل الإشعارات</ThemedText>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            thumbColor={notificationsEnabled ? "#0a7ea4" : "#ccc"}
          />
        </View>

        {/* زر عرض التقرير البصري */}
        <TouchableOpacity style={styles.reportButton} onPress={() => setReportVisible(true)}>
          <Ionicons name="stats-chart" size={20} color="#fff" />
          <ThemedText style={{ color: '#fff', marginLeft: 6 }}>عرض التقرير البصري</ThemedText>
        </TouchableOpacity>

        {/* نافذة التقرير البصري */}
        <Modal visible={reportVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.reportModal}>
              <ThemedText type="title" style={{ marginBottom: 8 }}>تقرير الجلسة</ThemedText>
              {/* رسم بياني بسيط توضيحي */}
              <View style={styles.chartBarContainer}>
                <View style={[styles.chartBar, { height: 60, backgroundColor: '#0a7ea4' }]} />
                <View style={[styles.chartBar, { height: 40, backgroundColor: '#4fc3f7' }]} />
                <View style={[styles.chartBar, { height: 80, backgroundColor: '#81d4fa' }]} />
              </View>
              <ThemedText style={{ textAlign: 'center', marginVertical: 8 }}>
                عدد الجلسات: 3 {"\n"} مدة التفاعل: 60 دقيقة
              </ThemedText>
              <TouchableOpacity onPress={() => setReportVisible(false)} style={styles.closeModalBtn}>
                <ThemedText style={{ color: '#fff' }}>إغلاق</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ThemedView>
    </ScrollView>
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
  templatesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  templateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#e3f7fb',
    marginBottom: 4,
    gap: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  tagButton: {
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginBottom: 4,
  },
  tagButtonSelected: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  notificationsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: 'center',
    marginTop: 10,
    gap: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportModal: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    elevation: 4,
  },
  chartBarContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
    height: 90,
    marginVertical: 8,
  },
  chartBar: {
    width: 24,
    borderRadius: 6,
  },
  closeModalBtn: {
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginTop: 10,
  },
});
