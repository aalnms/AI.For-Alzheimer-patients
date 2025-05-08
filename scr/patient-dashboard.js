import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  I18nManager,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// فرض اتجاه RTL
if (I18nManager.isRTL === false) {
  I18nManager.forceRTL(true);
}

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;

export default function PatientDashboard() {
  // بيانات المريض
  const patient = { 
    name: 'محمد', 
    image: require('@/assets/images/E30A99BB-3278-419C-8002-EE399608FB56.png') 
  };
  
  // معلومات الجلسة القادمة
  const [nextSession, setNextSession] = useState({ 
    time: '10:30 صباحاً', 
    inMinutes: 45,
    date: new Date()
  });
  
  // تحديث العد التنازلي للوقت المتبقي
  useEffect(() => {
    const timer = setInterval(() => {
      setNextSession(prev => ({
        ...prev,
        inMinutes: Math.max(0, prev.inMinutes - 1)
      }));
    }, 60000); // تحديث كل دقيقة

    return () => clearInterval(timer);
  }, []);

  const progress = 0.7;
  const achievements = 5;

  const [volume, setVolume] = useState(50);
  const [brightness, setBrightness] = useState(70);
  
  // أيام الأسبوع واليوم الحالي
  const today = new Date().getDay();
  const days = ['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج'];
  
  // حالة ظهور القائمة
  const [menuVisible, setMenuVisible] = useState(false);
  
  // نسبة تحويل قياسات الشاشة حسب حجمها
  const scale = useMemo(() => Math.min(width / 375, 1), [width]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6F7FB" />
      <ThemedView style={styles.container}>
        {/* شريط التنقل العلوي */}
        <View style={styles.navBar}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setMenuVisible(!menuVisible)}
          >
            <Ionicons name="menu-outline" size={28 * scale} color="#1A237E" />
          </TouchableOpacity>
          
          <View style={styles.navTitle}>
            <ThemedText type="title" style={styles.titleText}>
              الصفحة الرئيسية
            </ThemedText>
          </View>
          
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24 * scale} color="#1A237E" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* ترحيب شخصي وصورة المريض */}
          <LinearGradient
            colors={['#E8F5FF', '#F6F7FB']}
            style={styles.welcomeCard}
          >
            <View style={styles.header}>
              <View style={styles.avatarContainer}>
                <Image source={patient.image} style={styles.avatar} />
              </View>
              <View style={styles.welcomeTextContainer}>
                <ThemedText style={[styles.rtlText, styles.welcomeText]}>
                  مرحباً بك،
                </ThemedText>
                <ThemedText type="title" style={[styles.rtlText, styles.nameText]}>
                  {patient.name}
                </ThemedText>
              </View>
            </View>
          </LinearGradient>

          {/* شريط حالة الجلسة القادمة */}
          <LinearGradient
            colors={['#E0F7FA', '#B2EBF2']}
            style={styles.statusBar}
          >
            <View style={styles.statusIcon}>
              <Ionicons name="time-outline" size={24 * scale} color="#0277BD" />
            </View>
            <View style={styles.statusTextContainer}>
              <ThemedText style={[styles.rtlText, styles.primaryText]}>
                الجلسة القادمة: {nextSession.time}
              </ThemedText>
              <ThemedText style={[styles.rtlText, styles.secondaryText]}>
                {nextSession.inMinutes > 0 
                  ? `الوقت المتبقي: ${nextSession.inMinutes} دقيقة` 
                  : "الجلسة الآن!"
                }
              </ThemedText>
            </View>
            <TouchableOpacity style={styles.statusActionButton}>
              <Ionicons name="arrow-forward" size={20 * scale} color="#0277BD" />
            </TouchableOpacity>
          </LinearGradient>

          {/* رزنامة مبسطة */}
          <View style={styles.calendar}>
            <View style={styles.sectionHeader}>
              <ThemedText style={[styles.rtlText, styles.sectionTitle]}>
                جلسات هذا الأسبوع
              </ThemedText>
              <TouchableOpacity>
                <ThemedText style={styles.viewAllText}>عرض الكل</ThemedText>
              </TouchableOpacity>
            </View>
            <View style={styles.calendarRow}>
              {days.map((d, i) => (
                <TouchableOpacity 
                  key={i} 
                  style={[
                    styles.day, 
                    i === today && styles.activeDay,
                    i < today && styles.pastDay
                  ]}
                >
                  <ThemedText 
                    style={[
                      styles.rtlText, 
                      styles.dayText,
                      i === today && styles.activeDayText
                    ]}
                  >
                    {d}
                  </ThemedText>
                  {i === today && (
                    <View style={styles.todayDot} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* أزرار كبيرة للأقسام */}
          <View style={styles.sectionHeader}>
            <ThemedText style={[styles.rtlText, styles.sectionTitle]}>
              الأقسام الرئيسية
            </ThemedText>
          </View>
          <View style={styles.sections}>
            <View style={styles.sectionRow}>
              <SectionButton 
                gradientColors={['#7BC6CC', '#6EBAC2']} 
                label="جلستي القادمة" 
                icon="clock" 
                scale={scale}
              />
              <SectionButton 
                gradientColors={['#FFD86F', '#FFC107']} 
                label="مكتبة ذكرياتي" 
                icon="book" 
                scale={scale}
              />
            </View>
            <View style={styles.sectionRow}>
              <SectionButton 
                gradientColors={['#A0D995', '#8BC34A']} 
                label="ألبوم العائلة" 
                icon="users" 
                scale={scale}
              />
              <SectionButton 
                gradientColors={['#B39DDB', '#9575CD']} 
                label="ألعاب الذاكرة" 
                icon="puzzle-piece" 
                scale={scale}
              />
            </View>
          </View>

          {/* ملخص التقدم والإنجازات */}
          <LinearGradient
            colors={['#E3FCEC', '#C8E6C9']}
            style={styles.progressBox}
          >
            <View style={styles.progressHeader}>
              <ThemedText style={[styles.rtlText, styles.progressTitle]}>
                تقدمك الأسبوعي
              </ThemedText>
              <View style={styles.achievementContainer}>
                <ThemedText style={[styles.rtlText, styles.achievementText]}>
                  {achievements}
                </ThemedText>
                <Text style={styles.medalEmoji}>🏅</Text>
              </View>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
              </View>
              <ThemedText style={[styles.rtlText, styles.progressPercentage]}>
                {Math.round(progress * 100)}%
              </ThemedText>
            </View>
            
            <ThemedText style={[styles.rtlText, styles.progressNote]}>
              استمر بالمشاركة للحصول على المزيد من النقاط!
            </ThemedText>
          </LinearGradient>

          {/* التفضيلات السهلة */}
          <View style={styles.preferences}>
            <View style={styles.sectionHeader}>
              <ThemedText style={[styles.rtlText, styles.sectionTitle]}>
                التفضيلات
              </ThemedText>
            </View>
            
            <PreferenceSlider 
              icon="volume-up"
              label="الصوت"
              value={volume}
              setValue={setVolume}
              scale={scale}
            />
            
            <View style={styles.divider} />
            
            <PreferenceSlider 
              icon="sun"
              label="السطوع"
              value={brightness}
              setValue={setBrightness}
              scale={scale}
            />
          </View>

          {/* قسم نموذج الذكاء الاصطناعي */}
          <View style={styles.aiSection}>
            <View style={styles.aiHeader}>
              <FontAwesome5 name="robot" size={22 * scale} color="#0D47A1" style={styles.aiIcon} />
              <ThemedText type="subtitle" style={[styles.rtlText, styles.aiTitle]}>
                توصيات مخصصة لك
              </ThemedText>
            </View>
            <ThemedText style={[styles.rtlText, styles.aiContent]}>
              بناءً على نشاطك الأخير، ننصحك بتجربة مجموعة "استرجاع الذكريات الشخصية" في الجلسة القادمة.
            </ThemedText>
            <TouchableOpacity style={styles.aiButton}>
              <ThemedText style={styles.aiButtonText}>
                اقتراحات أكثر
              </ThemedText>
              <Ionicons name="chevron-back" size={16 * scale} color="#0D47A1" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* زر SOS */}
        <TouchableOpacity 
          style={styles.sosButton} 
          onPress={() => Alert.alert(
            "طلب المساعدة",
            "هل تريد الاتصال بالمسؤول للحصول على المساعدة؟",
            [
              { text: "إلغاء", style: "cancel" },
              { text: "اتصال", onPress: () => Alert.alert("تم طلب المساعدة!", "سيتصل بك المسؤول قريباً.") }
            ]
          )}
        >
          <LinearGradient
            colors={['#FF5252', '#F44336']}
            style={styles.sosGradient}
          >
            <FontAwesome5 name="exclamation-circle" size={20 * scale} color="#FFF" style={styles.sosIcon} />
            <ThemedText style={styles.sosText}>مساعدة</ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}

// مكون زر القسم الرئيسي
function SectionButton({ gradientColors, label, icon, scale = 1 }) {
  return (
    <TouchableOpacity style={styles.sectionBtnContainer}>
      <LinearGradient
        colors={gradientColors}
        style={styles.sectionBtn}
      >
        <View style={styles.sectionIconContainer}>
          <FontAwesome5 name={icon} size={26 * scale} color="#FFF" />
        </View>
        <ThemedText style={[styles.sectionLabel, styles.rtlText]}>
          {label}
        </ThemedText>
      </LinearGradient>
    </TouchableOpacity>
  );
}

// مكون شريط التفضيلات
function PreferenceSlider({ icon, label, value, setValue, scale = 1 }) {
  return (
    <View style={styles.prefRow}>
      <FontAwesome5 name={icon} size={20 * scale} color="#607D8B" style={styles.prefIcon} />
      <ThemedText style={[styles.rtlText, styles.prefLabel]}>
        {label}
      </ThemedText>
      
      <View style={styles.sliderContainer}>
        <TouchableOpacity 
          style={styles.sliderButton}
          onPress={() => setValue(v => Math.max(0, v - 10))}
        >
          <FontAwesome5 name="minus" size={12 * scale} color="#607D8B" />
        </TouchableOpacity>
        
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: `${value}%` }]} />
        </View>
        
        <TouchableOpacity 
          style={styles.sliderButton}
          onPress={() => setValue(v => Math.min(100, v + 10))}
        >
          <FontAwesome5 name="plus" size={12 * scale} color="#607D8B" />
        </TouchableOpacity>
      </View>
      
      <ThemedText style={styles.sliderValue}>
        {value}%
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#F6F7FB',
    justifyContent: 'flex-start',
    direction: 'rtl',
  },
  navBar: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F6F7FB',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  menuButton: {
    padding: 6,
  },
  navTitle: {
    flex: 1,
    alignItems: 'center',
  },
  titleText: {
    color: '#1A237E',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  notificationButton: {
    padding: 6,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F44336',
  },
  scrollContent: {
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  welcomeCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  avatarContainer: {
    borderWidth: 2,
    borderColor: '#1A237E',
    borderRadius: 40,
    padding: 2,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E0E0E0',
  },
  welcomeTextContainer: {
    marginRight: 12,
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#455A64',
  },
  nameText: {
    fontSize: 24,
    color: '#1A237E',
    fontWeight: 'bold',
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  statusBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  statusIcon: {
    marginLeft: 12,
  },
  statusTextContainer: {
    flex: 1,
  },
  primaryText: {
    color: '#222',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryText: {
    color: '#607D8B',
    fontSize: 14,
    marginTop: 4,
  },
  statusActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(178, 235, 242, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 6,
  },
  sectionTitle: {
    color: '#1A237E',
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllText: {
    color: '#1976D2',
    fontSize: 14,
  },
  calendar: {
    backgroundColor: '#FFFDE7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  calendarRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  day: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    position: 'relative',
  },
  activeDay: {
    backgroundColor: '#FFD86F',
    borderColor: '#FFD86F',
  },
  pastDay: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderColor: '#E0E0E0',
  },
  dayText: {
    color: '#37474F',
    fontWeight: 'bold',
    fontSize: 16,
  },
  activeDayText: {
    color: '#222',
  },
  todayDot: {
    position: 'absolute',
    bottom: -4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF9800',
  },
  sections: {
    marginBottom: 16,
  },
  sectionRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionBtnContainer: {
    width: '48%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderRadius: 16,
  },
  sectionBtn: {
    width: '100%',
    height: 110,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  sectionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  progressBox: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  progressHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    color: '#2E7D32',
    fontSize: 18,
    fontWeight: 'bold',
  },
  achievementContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  achievementText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginRight: 4,
  },
  medalEmoji: {
    fontSize: 20,
  },
  progressBarContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 14,
    backgroundColor: 'rgba(200, 230, 201, 0.5)',
    borderRadius: 7,
    overflow: 'hidden',
    marginLeft: 12,
  },
  progressBarFill: {
    height: 14,
    backgroundColor: '#43A047',
    borderRadius: 7,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  progressNote: {
    color: '#4CAF50',
    fontSize: 14,
    marginTop: 8,
  },
  preferences: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  prefRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginVertical: 12,
  },
  prefIcon: {
    marginLeft: 12,
  },
  prefLabel: {
    width: 80,
    fontSize: 16,
    color: '#37474F',
  },
  sliderContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  sliderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#EEEEEE',
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  sliderFill: {
    height: 8,
    backgroundColor: '#64B5F6',
    borderRadius: 4,
  },
  sliderValue: {
    width: 40,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#37474F',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  aiSection: {
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  aiHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiIcon: {
    marginLeft: 8,
  },
  aiTitle: {
    color: '#1565C0',
    fontSize: 18,
    fontWeight: 'bold',
  },
  aiContent: {
    color: '#37474F',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  aiButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  aiButtonText: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sosButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    elevation: 6,
    zIndex: 100,
    shadowColor: '#B71C1C',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderRadius: 28,
  },
  sosGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  sosIcon: {
    marginRight: 8,
  },
  sosText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  }
});