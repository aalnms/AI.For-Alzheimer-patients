import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [pickedFile, setPickedFile] = useState(null);

  // اختيار ملف
  const pickFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if (res.type === 'success') setPickedFile(res);
  };

  // استدعاء Gemini مع نص أو ملف
  async function handleGeminiAction(type, inputText, file) {
    setLoadingAI(true);
    setAiResult('');
    let prompt = '';
    if (type === 'memory') prompt = 'اقترح ذكرى إيجابية يمكن إضافتها لمريض الزهايمر بناءً على اهتماماته.';
    if (type === 'plan') prompt = 'اقترح خطة جلسة علاجية لمريض الزهايمر مع أنشطة محفزة.';
    if (type === 'report') prompt = 'لخص تفاعل المريض في الجلسات الأخيرة واقترح توصيات.';
    // تخصيص البرومبت بالنص المدخل
    if (inputText) prompt += `\nملاحظة إضافية من المستخدم: ${inputText}`;
    // إذا كان هناك ملف، أضف اسمه للبرومبت (للتوضيح فقط)
    if (file) prompt += `\nتم إرفاق ملف: ${file.name}`;
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

  // عند الضغط على زر سريع: أظهر المودال وحدد النوع
  const openQuickModal = (type) => {
    setModalType(type);
    setUserInput('');
    setPickedFile(null);
    setModalVisible(true);
  };

  // عند تأكيد الإدخال في المودال
  const handleModalSubmit = () => {
    setModalVisible(false);
    handleGeminiAction(modalType, userInput, pickedFile);
  };

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
          <TouchableOpacity style={styles.quickBtn} onPress={() => openQuickModal('memory')}>
            <Ionicons name="images" size={28} color="#1976d2" />
            <Text style={styles.quickBtnText}>إضافة ذكريات</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickBtn} onPress={() => openQuickModal('plan')}>
            <Ionicons name="calendar" size={28} color="#1976d2" />
            <Text style={styles.quickBtnText}>تخطيط جلسة</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickBtn} onPress={() => openQuickModal('report')}>
            <Ionicons name="document-text" size={28} color="#1976d2" />
            <Text style={styles.quickBtnText}>مراجعة تقارير</Text>
          </TouchableOpacity>
        </View>
        {/* Modal لإدخال نص أو ملف */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={{ fontWeight: 'bold', fontSize: 17, marginBottom: 8 }}>
                {modalType === 'memory' && 'إضافة ذكرى'}
                {modalType === 'plan' && 'تخطيط جلسة'}
                {modalType === 'report' && 'مراجعة تقارير'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder="أدخل نصاً إضافياً (اختياري)"
                value={userInput}
                onChangeText={setUserInput}
                multiline
              />
              <TouchableOpacity style={styles.fileBtn} onPress={pickFile}>
                <Ionicons name="attach" size={20} color="#1976d2" />
                <Text style={{ color: '#1976d2', marginLeft: 6 }}>
                  {pickedFile ? pickedFile.name : 'إرفاق ملف (اختياري)'}
                </Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                  <Text style={{ color: '#1976d2' }}>إلغاء</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleModalSubmit} style={styles.submitBtn}>
                  <Text style={{ color: '#fff' }}>إرسال</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* عرض نتيجة الذكاء الاصطناعي */}
        {(loadingAI || aiResult) && (
          <View style={styles.aiResultBox}>
            {loadingAI ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="sparkles" size={20} color="#1976d2" style={{ marginLeft: 8 }} />
                <Text style={{ color: '#1976d2' }}>الذكاء الاصطناعي يكتب الآن...</Text>
                <ActivityIndicator color="#1976d2" size="small" style={{ marginLeft: 8 }} />
              </View>
            ) : (
              <Text style={{ color: '#333', fontSize: 15 }}>{aiResult}</Text>
            )}
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
    paddingHorizontal: 6,
    paddingTop: 6,
    backgroundColor: '#f7f7f7',
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
    textAlign: 'right',
  },
  patientAge: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 4,
    alignSelf: 'flex-start',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 8,
    overflow: 'hidden',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  tabBtnActive: {
    backgroundColor: '#1976d2',
  },
  tabText: {
    fontSize: 13,
    color: '#555',
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: '#fff',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 6,
    textAlign: 'right',
  },
  editBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 6,
  },
  editBtnText: {
    color: '#1976d2',
    fontWeight: 'bold',
    fontSize: 13,
  },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1976d2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    marginTop: 6,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  timelineContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
  },
  timeline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  timelineItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    minWidth: 55,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1976d2',
    marginBottom: 2,
  },
  timelineYear: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 1,
  },
  timelineEvent: {
    fontSize: 10,
    color: '#444',
    textAlign: 'center',
    marginBottom: 1,
  },
  timelineLine: {
    width: 28,
    height: 2,
    backgroundColor: '#1976d2',
    position: 'absolute',
    top: 4,
    left: 22,
  },
  familyList: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    flexWrap: 'wrap',
  },
  familyItem: {
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 6,
    width: 60,
  },
  familyImg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    marginBottom: 2,
  },
  familyName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  familyRelation: {
    fontSize: 10,
    color: '#888',
    textAlign: 'center',
  },
  sessionItem: {
    marginBottom: 6,
    padding: 6,
    backgroundColor: '#f1f8e9',
    borderRadius: 8,
  },
  sessionDate: {
    fontSize: 11,
    color: '#1976d2',
    fontWeight: 'bold',
    marginBottom: 1,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  quickBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    padding: 8,
    width: 85,
  },
  quickBtnText: {
    color: '#1976d2',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  aiResultBox: {
    backgroundColor: '#f1f8e9',
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
    minHeight: 36,
    justifyContent: 'center',
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1976d2',
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
  },
  exportBtnText: {
    color: '#fff',
    fontSize: 13,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    width: '92%',
    elevation: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 8,
    minHeight: 36,
    marginBottom: 8,
    textAlign: 'right',
    fontSize: 13,
  },
  fileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 8,
    marginBottom: 4,
  },
  cancelBtn: {
    padding: 8,
    marginRight: 6,
  },
  submitBtn: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    padding: 8,
    minWidth: 50,
    alignItems: 'center',
  },
});