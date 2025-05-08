import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// بيانات تجريبية
const patient = {
  name: 'محمد أحمد',
  age: 68,
  image: 'https://randomuser.me/api/portraits/men/32.jpg',
  cognitiveTrend: 'up', // up, down, stable
  notes: [
    'يحب الاستماع للموسيقى الكلاسيكية',
    'يستجيب بشكل جيد للعلاج الجماعي',
  ],
  milestones: [
    { year: 1956, event: 'الولادة' },
    { year: 1978, event: 'التخرج من الجامعة' },
    { year: 1982, event: 'الزواج' },
    { year: 1990, event: 'مولد الابن الأول' },
    { year: 2020, event: 'تشخيص الزهايمر' },
  ],
  family: [
    { name: 'سارة أحمد', relation: 'ابنة', image: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'أحمد محمد', relation: 'ابن', image: 'https://randomuser.me/api/portraits/men/45.jpg' },
    { name: 'منى علي', relation: 'زوجة', image: 'https://randomuser.me/api/portraits/women/46.jpg' },
  ],
  personal: {
    gender: 'ذكر',
    maritalStatus: 'متزوج',
    address: 'الرياض، السعودية',
    phone: '0501234567',
  },
  medicalHistory: [
    'ضغط دم مرتفع',
    'سكري من النوع الثاني',
    'تشخيص الزهايمر (2020)',
  ],
  interests: [
    'القراءة',
    'المشي في الحديقة',
    'الشطرنج',
  ],
  sessions: [
    { date: '2024-05-01', summary: 'جلسة علاج معرفي، استجابة جيدة.' },
    { date: '2024-05-15', summary: 'جلسة متابعة، تحسن في التفاعل.' },
  ],
};

const tabs = [
  { key: 'personal', label: 'المعلومات الشخصية' },
  { key: 'medical', label: 'التاريخ الطبي' },
  { key: 'family', label: 'العلاقات العائلية' },
  { key: 'interests', label: 'الاهتمامات' },
  { key: 'sessions', label: 'الجلسات السابقة' },
];

export default function PatientFiles() {
  const [activeTab, setActiveTab] = useState('personal');
  const [notes, setNotes] = useState(patient.notes);
  const [aiResult, setAiResult] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  // دالة عامة لاستدعاء Gemini API
  async function handleGeminiAction(type) {
    setLoadingAI(true);
    setAiResult('');
    let prompt = '';
    if (type === 'memory') prompt = 'اقترح ذكرى إيجابية يمكن إضافتها لمريض الزهايمر بناءً على اهتماماته.';
    if (type === 'plan') prompt = 'اقترح خطة جلسة علاجية لمريض الزهايمر مع أنشطة محفزة.';
    if (type === 'report') prompt = 'لخص تفاعل المريض في الجلسات الأخيرة واقترح توصيات.';
    try {
      const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      });
      const data = await res.json();
      setAiResult(
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        'لم يتم الحصول على رد من الذكاء الاصطناعي.'
      );
    } catch (e) {
      setAiResult('حدث خطأ في الاتصال بالذكاء الاصطناعي.');
    }
    setLoadingAI(false);
  }

  // مؤشرات تطور الحالة
  const renderCognitiveTrend = () => {
    let color = '#4caf50', icon = '↑', label = 'تحسن';
    if (patient.cognitiveTrend === 'down') {
      color = '#f44336'; icon = '↓'; label = 'تراجع';
    } else if (patient.cognitiveTrend === 'stable') {
      color = '#ff9800'; icon = '→'; label = 'ثبات';
    }
    return (
      <View style={[styles.trendContainer, { borderColor: color }]}>
        <Text style={{ color, fontSize: 22 }}>{icon}</Text>
        <Text style={{ color, marginRight: 6 }}>{label}</Text>
      </View>
    );
  };

  // جدول زمني مرئي
  const renderTimeline = () => (
    <View style={styles.timelineContainer}>
      <Text style={styles.sectionTitle}>المراحل المهمة في حياة المريض</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.timeline}>
          {patient.milestones.map((m, idx) => (
            <View key={idx} style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <Text style={styles.timelineYear}>{m.year}</Text>
              <Text style={styles.timelineEvent}>{m.event}</Text>
              {idx < patient.milestones.length - 1 && <View style={styles.timelineLine} />}
            </View>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.editBtn}><Text style={styles.editBtnText}>تعديل</Text></TouchableOpacity>
    </View>
  );

  // قسم العلاقات العائلية
  const renderFamily = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>العلاقات العائلية</Text>
      <View style={styles.familyList}>
        {patient.family.map((f, idx) => (
          <View key={idx} style={styles.familyItem}>
            <Image source={{ uri: f.image }} style={styles.familyImg} />
            <Text style={styles.familyName}>{f.name}</Text>
            <Text style={styles.familyRelation}>{f.relation}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.addBtn}><Text style={styles.addBtnText}>+</Text></TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.editBtn}><Text style={styles.editBtnText}>تعديل</Text></TouchableOpacity>
    </View>
  );

  // أقسام علامات التبويب
  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>المعلومات الشخصية</Text>
            <Text>الجنس: {patient.personal.gender}</Text>
            <Text>الحالة الاجتماعية: {patient.personal.maritalStatus}</Text>
            <Text>العنوان: {patient.personal.address}</Text>
            <Text>رقم الهاتف: {patient.personal.phone}</Text>
            <TouchableOpacity style={styles.editBtn}><Text style={styles.editBtnText}>تعديل</Text></TouchableOpacity>
          </View>
        );
      case 'medical':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>التاريخ الطبي</Text>
            {patient.medicalHistory.map((item, idx) => (
              <Text key={idx}>• {item}</Text>
            ))}
            <TouchableOpacity style={styles.editBtn}><Text style={styles.editBtnText}>تعديل</Text></TouchableOpacity>
          </View>
        );
      case 'family':
        return renderFamily();
      case 'interests':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الاهتمامات</Text>
            {patient.interests.map((item, idx) => (
              <Text key={idx}>• {item}</Text>
            ))}
            <TouchableOpacity style={styles.editBtn}><Text style={styles.editBtnText}>تعديل</Text></TouchableOpacity>
          </View>
        );
      case 'sessions':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الجلسات السابقة</Text>
            {patient.sessions.map((s, idx) => (
              <View key={idx} style={styles.sessionItem}>
                <Text style={styles.sessionDate}>{s.date}</Text>
                <Text>{s.summary}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.editBtn}><Text style={styles.editBtnText}>تعديل</Text></TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  // قسم الملاحظات السريعة
  const renderNotes = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>ملاحظات سريعة</Text>
      {notes.map((n, idx) => (
        <Text key={idx}>• {n}</Text>
      ))}
      <TouchableOpacity style={styles.addBtn}><Text style={styles.addBtnText}>+</Text></TouchableOpacity>
    </View>
  );

  // رسم بياني دائري ملون (SVG يدوي)
  const renderPieChart = () => (
    <View style={{ alignItems: 'center', marginVertical: 12 }}>
      <View style={{ width: 100, height: 100 }}>
        <View style={{ position: 'absolute', left: 0, top: 0 }}>
          {/* دائرة كاملة */}
          <View style={{
            width: 100, height: 100, borderRadius: 50,
            backgroundColor: '#e3f2fd', position: 'absolute'
          }} />
          {/* ربع أول */}
          <View style={{
            width: 100, height: 100, borderRadius: 50,
            borderRightWidth: 50, borderRightColor: '#1976d2',
            borderTopWidth: 50, borderTopColor: 'transparent',
            borderLeftWidth: 0, borderBottomWidth: 0,
            position: 'absolute'
          }} />
          {/* ربع ثاني */}
          <View style={{
            width: 100, height: 100, borderRadius: 50,
            borderTopWidth: 50, borderTopColor: '#4caf50',
            borderLeftWidth: 50, borderLeftColor: 'transparent',
            borderRightWidth: 0, borderBottomWidth: 0,
            position: 'absolute'
          }} />
        </View>
        <View style={{
          position: 'absolute', left: 25, top: 25,
          width: 50, height: 50, borderRadius: 25,
          backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'
        }}>
          <Text style={{ fontSize: 18, color: '#1976d2' }}>78%</Text>
        </View>
      </View>
      <Text style={{ fontSize: 12, color: '#888', marginTop: 4 }}>معدل التفاعل</Text>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* بطاقة رأسية */}
      <View style={styles.headerCard}>
        <Image source={{ uri: patient.image }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.patientName}>{patient.name}</Text>
          <Text style={styles.patientAge}>العمر: {patient.age}</Text>
        </View>
        {renderCognitiveTrend()}
      </View>

      {/* علامات التبويب */}
      <View style={styles.tabsContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabBtn, activeTab === tab.key && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* جدول زمني مرئي */}
        {renderTimeline()}

        {/* محتوى القسم النشط */}
        {renderTabContent()}

        {/* ملاحظات سريعة */}
        {renderNotes()}

        {/* أزرار سريعة */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickBtn} onPress={() => handleGeminiAction('memory')}>
            <Ionicons name="images" size={28} color="#1976d2" />
            <Text style={styles.quickBtnText}>إضافة ذكريات</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickBtn} onPress={() => handleGeminiAction('plan')}>
            <Ionicons name="calendar" size={28} color="#1976d2" />
            <Text style={styles.quickBtnText}>تخطيط جلسة</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickBtn} onPress={() => handleGeminiAction('report')}>
            <Ionicons name="document-text" size={28} color="#1976d2" />
            <Text style={styles.quickBtnText}>مراجعة تقارير</Text>
          </TouchableOpacity>
        </View>
        {/* عرض نتيجة الذكاء الاصطناعي */}
        {(loadingAI || aiResult) && (
          <View style={styles.aiResultBox}>
            {loadingAI
              ? <Text style={{ color: '#1976d2' }}>جاري معالجة الطلب...</Text>
              : <Text style={{ color: '#333', fontSize: 15 }}>{aiResult}</Text>
            }
          </View>
        )}
        {/* التقارير */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>التقارير</Text>
          {renderPieChart()}
          <TouchableOpacity style={styles.exportBtn} onPress={() => {/* تصدير PDF وهمي */}}>
            <Ionicons name="download" size={20} color="#fff" />
            <Text style={styles.exportBtnText}>تصدير PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    backgroundColor: '#f7f7f7',
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  patientName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
    textAlign: 'right',
  },
  patientAge: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  tabBtnActive: {
    backgroundColor: '#1976d2',
  },
  tabText: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
    textAlign: 'right',
  },
  editBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 8,
  },
  editBtnText: {
    color: '#1976d2',
    fontWeight: 'bold',
    fontSize: 15,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1976d2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginTop: 8,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  timelineContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  timelineItem: {
    alignItems: 'center',
    marginHorizontal: 12,
    minWidth: 70,
  },
  timelineDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#1976d2',
    marginBottom: 4,
  },
  timelineYear: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 2,
  },
  timelineEvent: {
    fontSize: 13,
    color: '#444',
    textAlign: 'center',
    marginBottom: 2,
  },
  timelineLine: {
    width: 40,
    height: 2,
    backgroundColor: '#1976d2',
    position: 'absolute',
    top: 6,
    left: 35,
  },
  familyList: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  familyItem: {
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  familyImg: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 4,
  },
  familyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  familyRelation: {
    fontSize: 12,
    color: '#888',
  },
  sessionItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f1f8e9',
    borderRadius: 8,
  },
  sessionDate: {
    fontSize: 13,
    color: '#1976d2',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  quickBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    padding: 12,
    width: 100,
  },
  quickBtnText: {
    color: '#1976d2',
    fontSize: 14,
    marginTop: 4,
  },
  aiResultBox: {
    backgroundColor: '#f1f8e9',
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    minHeight: 40,
    justifyContent: 'center',
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1976d2',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  exportBtnText: {
    color: '#fff',
    fontSize: 15,
    marginLeft: 6,
  },
});