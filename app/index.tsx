import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

type Screen =
  | 'welcome'
  | 'login'
  | 'signup'
  | 'cuisine'
  | 'taste'
  | 'ingredients'
  | 'replacement'
  | 'home'
  | 'scan'
  | 'review';

type Choice = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  image?: ImageSourcePropType;
};

const heroChicken = require('../assets/images/hero-chicken.jpg');
const recipePasta = require('../assets/images/recipe-pasta.jpg');
const fridge = require('../assets/images/fridge.jpg');

const cuisineChoices: Choice[] = [
  { title: 'سعودي', description: 'نكهات أصيلة من قلب الجزيرة', icon: 'sunny-outline', image: heroChicken },
  { title: 'إيطالي', description: 'مذاقات عالمية محبوبة', icon: 'restaurant-outline', image: recipePasta },
  { title: 'شامي', description: 'مطبخ غني بالتقاليد', icon: 'leaf-outline', image: heroChicken },
  { title: 'آسيوي', description: 'نكهات مميزة من الشرق', icon: 'color-filter-outline', image: recipePasta },
  { title: 'هندي', description: 'بهارات غنية ومذاق استثنائي', icon: 'flame-outline', image: heroChicken },
  { title: 'مطابخ أخرى', description: 'مزيد من النكهات لاكتشافها', icon: 'globe-outline', image: recipePasta },
];

const tasteChoices: Choice[] = [
  { title: 'عالي البروتين', description: 'يدعم نشاطك وبناء العضلات', icon: 'barbell-outline', image: heroChicken },
  { title: 'سريع', description: 'وجبات لذيذة في وقت قصير', icon: 'timer-outline', image: recipePasta },
  { title: 'أخف', description: 'خيارات متوازنة وأقل سعرات', icon: 'leaf-outline', image: heroChicken },
  { title: 'اقتصادي', description: 'وجبات شهية بمكونات مناسبة', icon: 'wallet-outline', image: recipePasta },
  { title: 'نباتي', description: 'نكهات متنوعة من المطبخ النباتي', icon: 'nutrition-outline', image: heroChicken },
  { title: 'بدون تفضيل', description: 'اعرض لي كل الوصفات المناسبة', icon: 'sparkles-outline' },
];

function App() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [screen, setScreen] = useState<Screen>('welcome');
  const [selectedCuisine, setSelectedCuisine] = useState<string[]>(['سعودي', 'شامي', 'آسيوي']);
  const [selectedTaste, setSelectedTaste] = useState<string[]>(['عالي البروتين', 'سريع', 'نباتي']);
  const [selectedReplacement, setSelectedReplacement] = useState<string[]>(['المتوفر عندي', 'أخف']);
  const [ingredients, setIngredients] = useState<string[]>(['دجاج', 'رز', 'باستا']);
  const [email, setEmail] = useState('');

  const go = (next: Screen) => {
    void Haptics.selectionAsync();
    setScreen(next);
  };

  const toggleChoice = (
    value: string,
    current: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    void Haptics.selectionAsync();
    setter(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const content = useMemo(() => {
    switch (screen) {
      case 'welcome':
        return <WelcomeScreen colors={colors} go={go} insets={insets} />;
      case 'login':
        return <AuthScreen mode="login" colors={colors} go={go} insets={insets} email={email} setEmail={setEmail} />;
      case 'signup':
        return <AuthScreen mode="signup" colors={colors} go={go} insets={insets} email={email} setEmail={setEmail} />;
      case 'cuisine':
        return (
          <OnboardingShell
            colors={colors}
            insets={insets}
            step={1}
            title="وش المطابخ اللي تفضلها؟"
            subtitle="اختر ما يناسب ذوقك لنقترح لك وصفات أقرب لك."
            onBack={() => go('signup')}
            onNext={() => go('taste')}
          >
            <View style={styles.choiceGrid}>
              {cuisineChoices.map((choice) => (
                <ChoiceCard
                  key={choice.title}
                  choice={choice}
                  selected={selectedCuisine.includes(choice.title)}
                  onPress={() => toggleChoice(choice.title, selectedCuisine, setSelectedCuisine)}
                  colors={colors}
                />
              ))}
            </View>
          </OnboardingShell>
        );
      case 'taste':
        return (
          <OnboardingShell
            colors={colors}
            insets={insets}
            step={2}
            title="كيف تحب وجباتك؟"
            subtitle="اختر النمط الأقرب لك وسنراعيه في اقتراحاتنا."
            onBack={() => go('cuisine')}
            onNext={() => go('ingredients')}
          >
            <View style={styles.tasteList}>
              {tasteChoices.map((choice) => (
                <TasteCard
                  key={choice.title}
                  choice={choice}
                  selected={selectedTaste.includes(choice.title)}
                  onPress={() => toggleChoice(choice.title, selectedTaste, setSelectedTaste)}
                  colors={colors}
                />
              ))}
            </View>
            <Callout colors={colors} icon="leaf-outline" title="كل الأذواق مرحب بها!" text="يمكنك تغيير تفضيلاتك لاحقاً من الإعدادات." />
          </OnboardingShell>
        );
      case 'ingredients':
        return (
          <OnboardingShell
            colors={colors}
            insets={insets}
            step={3}
            title="خلّنا نعرف تفضيلاتك"
            subtitle="أضف ما تحبه وما لا تفضله لنقترح لك وصفات أدق."
            onBack={() => go('taste')}
            onNext={() => go('replacement')}
          >
            <IngredientPanel
              colors={colors}
              title="أشياء أحبها"
              icon="heart"
              image={heroChicken}
              tone="green"
              chips={ingredients}
              onAdd={() => setIngredients([...ingredients, 'خضار'])}
            />
            <IngredientPanel
              colors={colors}
              title="أشياء ما أحبها"
              icon="ban-outline"
              image={recipePasta}
              tone="rose"
              chips={['فطر', 'زيتون']}
              onAdd={() => undefined}
            />
            <IngredientPanel
              colors={colors}
              title="حساسية أو قيود غذائية"
              icon="leaf-outline"
              image={heroChicken}
              tone="green"
              chips={['خالي من الجلوتين', 'حساسية مكسرات']}
              onAdd={() => undefined}
            />
          </OnboardingShell>
        );
      case 'replacement':
        return (
          <OnboardingShell
            colors={colors}
            insets={insets}
            step={2}
            stepCount={4}
            title="وش يهمك عند الاستبدال؟"
            subtitle="ساعدنا نرتب البدائل بالطريقة الأقرب لاحتياجك."
            onBack={() => go('ingredients')}
            onNext={() => go('home')}
          >
            <View style={styles.replacementList}>
              {[
                ['المتوفر عندي', 'أعرض لي بدائل من المكونات الموجودة لديك.', 'home-outline'],
                ['أقرب للطعم', 'بدائل تحافظ على الطعم اللي تحبه.', 'restaurant-outline'],
                ['أخف', 'بدائل أخف وأسهل على المعدة.', 'leaf-outline'],
                ['أقل سعرات', 'بدائل بسعرات حرارية أقل.', 'flame-outline'],
                ['بديل محلي', 'أعرض لي بدائل من منتجات محلية سعودية.', 'location-outline'],
                ['أقل تكلفة', 'بدائل اقتصادية ومناسبة للميزانية.', 'layers-outline'],
              ].map(([title, description, icon]) => (
                <ReplacementRow
                  key={title}
                  title={title}
                  description={description}
                  icon={icon as keyof typeof Ionicons.glyphMap}
                  selected={selectedReplacement.includes(title)}
                  onPress={() => toggleChoice(title, selectedReplacement, setSelectedReplacement)}
                  colors={colors}
                />
              ))}
            </View>
            <Callout colors={colors} icon="settings-outline" title="ممكن تغير هذه التفضيلات لاحقاً" text="من خلال إعدادات الحساب في أي وقت." />
          </OnboardingShell>
        );
      case 'home':
        return <HomeScreen colors={colors} insets={insets} go={go} />;
      case 'scan':
        return <ScanScreen colors={colors} insets={insets} go={go} />;
      case 'review':
        return <ReviewScreen colors={colors} insets={insets} go={go} />;
    }
  }, [
    colors,
    email,
    ingredients,
    insets,
    screen,
    selectedCuisine,
    selectedReplacement,
    selectedTaste,
  ]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar style="dark" />
      {content}
    </View>
  );
}

function ScreenFrame({
  children,
  colors,
  insets,
  scroll = true,
}: {
  children: React.ReactNode;
  colors: ReturnType<typeof useColors>;
  insets: { top: number; bottom: number };
  scroll?: boolean;
}) {
  const inner = (
    <View style={[styles.frame, { paddingTop: insets.top + 6, paddingBottom: insets.bottom + 20 }]}>
      {children}
    </View>
  );
  return scroll ? (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {inner}
    </ScrollView>
  ) : (
    inner
  );
}

function Brand({ colors }: { colors: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.brand}>
      <View style={styles.brandRow}>
        <Text style={[styles.brandName, { color: colors.foreground }]}>وصفة</Text>
        <Ionicons name="leaf" size={17} color={colors.primary} style={styles.brandLeaf} />
      </View>
      <Text style={[styles.brandTagline, { color: colors.primary }]}>أكل أفضل .. لهدف أكبر</Text>
    </View>
  );
}

function Header({
  colors,
  insets,
  left,
  right,
  centered = false,
}: {
  colors: ReturnType<typeof useColors>;
  insets: { top: number };
  left?: React.ReactNode;
  right?: React.ReactNode;
  centered?: boolean;
}) {
  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, Platform.OS === 'web' ? 67 : 4) }]}>
      <View style={styles.headerSide}>{right}</View>
      <View style={centered ? styles.headerCenter : undefined}>
        <Brand colors={colors} />
      </View>
      <View style={[styles.headerSide, styles.headerSideLeft]}>{left}</View>
    </View>
  );
}

function WelcomeScreen({
  colors,
  go,
  insets,
}: {
  colors: ReturnType<typeof useColors>;
  go: (screen: Screen) => void;
  insets: { top: number; bottom: number };
}) {
  return (
    <ScreenFrame colors={colors} insets={insets}>
      <Header
        colors={colors}
        insets={insets}
        right={<Text style={[styles.headerHint, { color: colors.primary }]}>من{'\n'}السعودية{'\n'}ولكل بيت</Text>}
      />
      <ImageBackground source={heroChicken} style={styles.welcomeHero} imageStyle={styles.heroImage}>
        <View style={styles.heroWash} />
        <Text style={[styles.heroNote, { color: colors.primary }]}>من مطبخنا{'\n'}لوطن أجمل</Text>
      </ImageBackground>
      <View style={styles.welcomeBody}>
        <Text style={[styles.displayTitle, { color: colors.foreground }]}>اطبخ من الموجود</Text>
        <Text style={[styles.bodyText, { color: colors.mutedForeground }]}>سجّل مكوناتك، واكتشف وصفات تناسب ذوقك وتقلل الهدر.</Text>
        <View style={styles.benefits}>
          <Benefit colors={colors} icon="leaf-outline" title="مطبخ أكثر" caption="استدامة" />
          <Benefit colors={colors} icon="heart-outline" title="وصفات تناسب" caption="ذوقك" />
          <Benefit colors={colors} icon="basket-outline" title="استفد من" caption="موجوداتك" />
        </View>
        <Callout colors={colors} icon="leaf-outline" title="هدفنا نقلل الهدر في السعودية" text="نطمح لتقليل 4 ملايين طن من الهدر الغذائي" />
        <View style={styles.buttonStack}>
          <PrimaryButton colors={colors} label="ابدأ" onPress={() => go('login')} />
          <OutlineButton colors={colors} label="عندي حساب" onPress={() => go('login')} />
        </View>
      </View>
    </ScreenFrame>
  );
}

function AuthScreen({
  mode,
  colors,
  go,
  insets,
  email,
  setEmail,
}: {
  mode: 'login' | 'signup';
  colors: ReturnType<typeof useColors>;
  go: (screen: Screen) => void;
  insets: { top: number; bottom: number };
  email: string;
  setEmail: (value: string) => void;
}) {
  const isLogin = mode === 'login';
  return (
    <ScreenFrame colors={colors} insets={insets}>
      <Header colors={colors} insets={insets} centered />
      <ImageBackground source={isLogin ? recipePasta : fridge} style={styles.authHero} imageStyle={styles.heroImage}>
        <View style={styles.heroWash} />
        <Text style={[styles.heroNote, { color: colors.primary }]}>{isLogin ? 'مذاق{\\n}يلهم يومك' : 'مطبخ أفضل{\\n}لحياة أجمل'}</Text>
      </ImageBackground>
      <View style={styles.authBody}>
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}</Text>
        <Text style={[styles.bodyText, { color: colors.mutedForeground }]}>
          {isLogin ? 'ادخل إلى حسابك لمتابعة وصفاتك وذكرياتك الغذائية.' : 'ابدأ رحلتك مع وصفة بخطوات بسيطة.'}
        </Text>
        {!isLogin && <Field colors={colors} icon="person-outline" placeholder="الاسم" />}
        <Field colors={colors} icon="mail-outline" placeholder="البريد الإلكتروني أو رقم الجوال" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <Field colors={colors} icon="lock-closed-outline" placeholder="كلمة المرور" secureTextEntry />
        {isLogin && <Text style={[styles.forgot, { color: colors.primary }]}>نسيت كلمة المرور؟</Text>}
        {!isLogin && (
          <Text style={[styles.terms, { color: colors.mutedForeground }]}>
            □ أوافق على <Text style={{ color: colors.primary, textDecorationLine: 'underline' }}>الشروط وسياسة الخصوصية</Text>
          </Text>
        )}
        <View style={styles.buttonStack}>
          <PrimaryButton colors={colors} label={isLogin ? 'دخول' : 'إنشاء الحساب'} onPress={() => go(isLogin ? 'home' : 'cuisine')} />
          <OutlineButton colors={colors} label={isLogin ? 'إنشاء حساب جديد' : 'عندي حساب بالفعل'} onPress={() => go(isLogin ? 'signup' : 'login')} />
        </View>
        <Divider colors={colors} />
        {isLogin && (
          <>
            <SocialButton colors={colors} icon="logo-apple" label="أو المتابعة بحساب Apple" />
            <SocialButton colors={colors} icon="logo-google" label="أو المتابعة بحساب Google" />
          </>
        )}
      </View>
    </ScreenFrame>
  );
}

function OnboardingShell({
  colors,
  insets,
  step,
  stepCount = 3,
  title,
  subtitle,
  children,
  onBack,
  onNext,
}: {
  colors: ReturnType<typeof useColors>;
  insets: { top: number; bottom: number };
  step: number;
  stepCount?: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <ScreenFrame colors={colors} insets={insets}>
      <Header
        colors={colors}
        insets={insets}
        right={<Pressable onPress={onBack} hitSlop={12}><Ionicons name="arrow-forward" size={23} color={colors.primary} /></Pressable>}
        left={<Text style={[styles.skip, { color: colors.primary }]}>تخطي</Text>}
      />
      <View style={styles.onboardingBody}>
        <View style={styles.progressRow}>
          <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>{step} من {stepCount}</Text>
          <View style={styles.progressTrack}>
            {Array.from({ length: stepCount }).map((_, index) => (
              <View key={index} style={[styles.progressSegment, { backgroundColor: index < step ? colors.primary : colors.border }]} />
            ))}
          </View>
        </View>
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.bodyText, { color: colors.mutedForeground }]}>{subtitle}</Text>
        {children}
        <PrimaryButton colors={colors} label="التالي" onPress={onNext} />
        {step > 1 && <OutlineButton colors={colors} label="رجوع" onPress={onBack} />}
      </View>
    </ScreenFrame>
  );
}

function HomeScreen({
  colors,
  insets,
  go,
}: {
  colors: ReturnType<typeof useColors>;
  insets: { top: number; bottom: number };
  go: (screen: Screen) => void;
}) {
  return (
    <ScreenFrame colors={colors} insets={insets}>
      <Header
        colors={colors}
        insets={insets}
        right={<View style={styles.avatarRow}><Image source={heroChicken} style={styles.avatar} /><Text style={[styles.avatarText, { color: colors.foreground }]}>مساء الخير{'\n'}<Text style={{ fontWeight: '700' }}>أحمد</Text></Text></View>}
        left={<View style={styles.location}><Ionicons name="location-outline" size={18} color={colors.foreground} /><Text style={{ color: colors.foreground }}>الرياض</Text></View>}
      />
      <ImageBackground source={fridge} style={styles.homeHero} imageStyle={styles.heroImage}>
        <View style={styles.heroWash} />
        <Text style={[styles.heroNote, { color: colors.primary }]}>مكوناتك اليوم{'\n'}ممكن تصنع{'\n'}وجبة مميزة</Text>
      </ImageBackground>
      <View style={styles.homeBody}>
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>وش عندك اليوم؟</Text>
        <Text style={[styles.bodyText, { color: colors.mutedForeground }]}>أضف مكوناتك واكتشف وصفات تناسبك</Text>
        <PrimaryButton colors={colors} label="ابدأ بإضافة المكونات" onPress={() => go('scan')} />
        <RecipeCard colors={colors} />
        <View style={styles.homeMiniRow}>
          <View style={[styles.miniCard, { backgroundColor: colors.secondary }]}>
            <Ionicons name="leaf-outline" size={28} color={colors.primary} />
            <Text style={[styles.miniCardTitle, { color: colors.primary }]}>كل وجبة تصنع{'\n'}فرقاً حقيقياً</Text>
          </View>
          <View style={[styles.miniCard, { backgroundColor: colors.card }]}>
            <Image source={heroChicken} style={styles.miniImage} />
            <Text style={[styles.miniCardTitle, { color: colors.foreground }]}>كسّة دجاج سعودية</Text>
            <Text style={[styles.miniCardCaption, { color: colors.mutedForeground }]}>أنت تحب النكهات التقليدية</Text>
          </View>
        </View>
        <Callout colors={colors} icon="leaf-outline" title="هدفنا نقلل الهدر في السعودية" text="نطمح لتقليل 4 ملايين طن من الهدر الغذائي" />
      </View>
      <BottomTabs colors={colors} active="home" onHome={() => go('home')} onScan={() => go('scan')} />
    </ScreenFrame>
  );
}

function ScanScreen({
  colors,
  insets,
  go,
}: {
  colors: ReturnType<typeof useColors>;
  insets: { top: number; bottom: number };
  go: (screen: Screen) => void;
}) {
  return (
    <ScreenFrame colors={colors} insets={insets}>
      <Header colors={colors} insets={insets} right={<Pressable onPress={() => go('home')}><Text style={{ color: colors.primary }}>رجوع</Text></Pressable>} left={<Text style={{ color: colors.foreground }}>كيف أضيف مكوناتي؟ ⓘ</Text>} />
      <View style={styles.scanBody}>
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>أضف مكوناتك</Text>
        <Text style={[styles.bodyText, { color: colors.mutedForeground }]}>صوّر، اكتب، أو أضف رابط وصفة.</Text>
        <ImageBackground source={fridge} style={styles.scanArea} imageStyle={styles.scanAreaImage}>
          <View style={styles.scanOverlay} />
          <View style={[styles.cameraPrompt, { backgroundColor: `${colors.background}CC` }]}>
            <View style={[styles.cameraCircle, { backgroundColor: colors.secondary }]}>
              <Ionicons name="camera-outline" size={43} color={colors.primary} />
            </View>
            <Text style={[styles.cameraTitle, { color: colors.foreground }]}>ابدأ بصورة لما لديك{'\n'}في المطبخ</Text>
            <Text style={[styles.cameraCaption, { color: colors.primary }]}>من مطبخك{'\n'}لوطن أجمل</Text>
          </View>
        </ImageBackground>
        <View style={[styles.sourceTabs, { backgroundColor: colors.card }]}>
          {[
            ['camera-outline', 'الكاميرا'],
            ['images-outline', 'الصور'],
            ['mic-outline', 'الصوت'],
            ['create-outline', 'اكتب'],
            ['link-outline', 'رابط'],
          ].map(([icon, label], index) => (
            <Pressable key={label} style={[styles.sourceTab, index === 0 && { backgroundColor: colors.secondary }]} onPress={() => index === 1 && go('review')}>
              <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={21} color={index === 0 ? colors.primary : colors.foreground} />
              <Text style={[styles.sourceLabel, { color: index === 0 ? colors.primary : colors.foreground }]}>{label}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.scanButtonWrap}>
          <PrimaryButton colors={colors} label="اعرف وش عندي" icon="sparkles-outline" onPress={() => go('review')} />
          <Text style={[styles.helperText, { color: colors.mutedForeground }]}>أضف مكوناً واحداً على الأقل للمتابعة</Text>
        </View>
      </View>
      <BottomTabs colors={colors} active="scan" onHome={() => go('home')} onScan={() => go('scan')} />
    </ScreenFrame>
  );
}

function ReviewScreen({
  colors,
  insets,
  go,
}: {
  colors: ReturnType<typeof useColors>;
  insets: { top: number; bottom: number };
  go: (screen: Screen) => void;
}) {
  const thumbs = [heroChicken, recipePasta, fridge, heroChicken];
  return (
    <ScreenFrame colors={colors} insets={insets}>
      <Header colors={colors} insets={insets} right={<Pressable onPress={() => go('scan')}><Text style={{ color: colors.primary }}>رجوع</Text></Pressable>} left={<View style={styles.location}><Ionicons name="location-outline" size={18} color={colors.foreground} /><Text>الرياض</Text></View>} />
      <View style={styles.reviewBody}>
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>راجع صور مكوناتك</Text>
        <Text style={[styles.bodyText, { color: colors.mutedForeground }]}>كل هذه الصور ستُحلّل معاً كجلسة واحدة.</Text>
        <View style={styles.reviewHero}>
          <Image source={fridge} style={styles.reviewHeroImage} />
          <View style={[styles.imageLabel, { backgroundColor: colors.secondary }]}><Ionicons name="image-outline" size={15} color={colors.primary} /><Text style={{ color: colors.primary }}>الصورة الرئيسية</Text></View>
          <Pressable style={styles.closeButton}><Ionicons name="close" size={21} color={colors.foreground} /></Pressable>
        </View>
        <View style={styles.thumbnailRow}>
          {thumbs.map((image, index) => (
            <View key={index} style={styles.thumbnail}>
              <Image source={image} style={styles.thumbnailImage} />
              <Pressable style={styles.thumbnailClose}><Ionicons name="close" size={14} color={colors.foreground} /></Pressable>
            </View>
          ))}
          <Pressable style={[styles.addThumbnail, { borderColor: colors.primary }]}><Ionicons name="add-circle-outline" size={24} color={colors.primary} /><Text style={{ color: colors.primary, fontSize: 11 }}>أضف صورة أخرى</Text></Pressable>
        </View>
        <View style={[styles.reviewSummary, { backgroundColor: colors.secondary }]}>
          <View style={styles.summaryCount}><Ionicons name="images-outline" size={21} color={colors.primary} /><Text style={{ color: colors.foreground }}>5 صور</Text></View>
          <View><Text style={[styles.summaryTitle, { color: colors.primary }]}>جلسة واحدة</Text><Text style={[styles.summaryCaption, { color: colors.mutedForeground }]}>كل هذه الصور ستحلل معاً كجلسة واحدة.</Text></View>
        </View>
        <View style={styles.buttonStack}>
          <PrimaryButton colors={colors} label="اعرف وش عندي" icon="sparkles-outline" onPress={() => go('home')} />
          <OutlineButton colors={colors} label="أضف صورة أخرى" onPress={() => go('scan')} />
        </View>
      </View>
      <BottomTabs colors={colors} active="scan" onHome={() => go('home')} onScan={() => go('scan')} />
    </ScreenFrame>
  );
}

function ChoiceCard({
  choice,
  selected,
  onPress,
  colors,
}: {
  choice: Choice;
  selected: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.choiceCard, { backgroundColor: colors.card, borderColor: selected ? colors.accent : colors.border }, selected && { borderWidth: 2 }]}>
      {choice.image && <Image source={choice.image} style={styles.choiceImage} />}
      <View style={[styles.selectionBadge, { backgroundColor: selected ? colors.accent : colors.card, borderColor: selected ? colors.accent : colors.border }]}>
        <Ionicons name={selected ? 'checkmark' : 'ellipse-outline'} size={selected ? 17 : 21} color={selected ? colors.foreground : colors.mutedForeground} />
      </View>
      <View style={styles.choiceCopy}><Text style={[styles.choiceTitle, { color: colors.foreground }]}>{choice.title}</Text><Text style={[styles.choiceDescription, { color: colors.mutedForeground }]}>{choice.description}</Text></View>
      <Ionicons name={choice.icon} size={27} color={colors.primary} style={styles.choiceIcon} />
    </Pressable>
  );
}

function TasteCard({
  choice,
  selected,
  onPress,
  colors,
}: {
  choice: Choice;
  selected: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.tasteCard, { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.secondary : colors.card }]}>
      <View style={[styles.tasteCheck, { backgroundColor: selected ? colors.primary : colors.card, borderColor: selected ? colors.primary : colors.border }]}><Ionicons name={selected ? 'checkmark' : 'ellipse-outline'} size={17} color={selected ? colors.card : colors.mutedForeground} /></View>
      <View style={styles.tasteCopy}><Text style={[styles.tasteTitle, { color: colors.foreground }]}>{choice.title}</Text><Text style={[styles.tasteDescription, { color: colors.mutedForeground }]}>{choice.description}</Text></View>
      {choice.image && <Image source={choice.image} style={styles.tasteImage} />}
    </Pressable>
  );
}

function IngredientPanel({
  colors,
  title,
  icon,
  image,
  tone,
  chips,
  onAdd,
}: {
  colors: ReturnType<typeof useColors>;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  image: ImageSourcePropType;
  tone: 'green' | 'rose';
  chips: string[];
  onAdd: () => void;
}) {
  return (
    <View style={[styles.ingredientPanel, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.ingredientHeader, { backgroundColor: tone === 'rose' ? '#fbf1ee' : colors.secondary }]}>
        <Image source={image} style={styles.ingredientImage} />
        <View style={styles.ingredientTitleWrap}><View style={styles.ingredientTitleRow}><Text style={[styles.ingredientTitle, { color: tone === 'rose' ? colors.destructive : colors.primary }]}>{title}</Text><Ionicons name={icon} size={19} color={tone === 'rose' ? colors.destructive : colors.primary} /></View><Text style={[styles.ingredientSubtitle, { color: colors.mutedForeground }]}>اختر المكونات التي تستمتع بتناولها.</Text></View>
      </View>
      <View style={styles.chips}>{chips.map((chip) => <View key={chip} style={[styles.chip, { backgroundColor: tone === 'rose' ? '#fbe3e0' : colors.secondary }]}><Text style={{ color: colors.foreground, fontSize: 12 }}>{chip}</Text><Ionicons name="close" size={13} color={colors.foreground} /></View>)}</View>
      <Pressable onPress={onAdd} style={[styles.addRow, { borderColor: colors.border }]}><Text style={{ color: colors.mutedForeground }}>أضف عنصراً</Text><Ionicons name="add" size={22} color={colors.foreground} /></Pressable>
    </View>
  );
}

function ReplacementRow({
  title,
  description,
  icon,
  selected,
  onPress,
  colors,
}: {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.replacementRow, { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.secondary : colors.card }]}>
      <View style={[styles.replacementIcon, { backgroundColor: colors.secondary }]}><Ionicons name={icon} size={23} color={colors.foreground} /></View>
      <View style={styles.replacementCopy}><Text style={[styles.replacementTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.replacementDescription, { color: colors.mutedForeground }]}>{description}</Text></View>
      <View style={[styles.radio, { borderColor: selected ? colors.primary : colors.mutedForeground, backgroundColor: selected ? colors.primary : colors.card }]}>{selected && <Ionicons name="checkmark" size={16} color={colors.card} />}</View>
    </Pressable>
  );
}

function RecipeCard({ colors }: { colors: ReturnType<typeof useColors> }) {
  return (
    <View style={[styles.recipeCard, { backgroundColor: colors.card }]}>
      <Image source={recipePasta} style={styles.recipeImage} />
      <View style={styles.recipeTime}><Ionicons name="time-outline" size={14} color={colors.foreground} /><Text style={{ fontSize: 11, color: colors.foreground }}>30 دقيقة</Text></View>
      <View style={styles.recipeCopy}><View style={[styles.recipeTag, { backgroundColor: colors.secondary }]}><Ionicons name="leaf-outline" size={13} color={colors.primary} /><Text style={{ color: colors.primary, fontSize: 11 }}>مناسب لك اليوم</Text></View><Text style={[styles.recipeTitle, { color: colors.foreground }]}>مكرونة بالدجاج{'\n'}والكريمة</Text><Text style={[styles.recipeCaption, { color: colors.mutedForeground }]}>طبق لذيذ وسهل بمكوناتك المتوفرة في المنزل</Text></View>
    </View>
  );
}

function BottomTabs({
  colors,
  active,
  onHome,
  onScan,
}: {
  colors: ReturnType<typeof useColors>;
  active: 'home' | 'scan';
  onHome: () => void;
  onScan: () => void;
}) {
  return (
    <View style={[styles.bottomTabs, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: Platform.OS === 'web' ? 34 : 8 }]}>
      <TabItem colors={colors} icon="person-outline" label="حسابي" />
      <TabItem colors={colors} icon="heart-outline" label="الذاكرة" />
      <TabItem colors={colors} icon="camera-outline" label="التقط مكوناتك" active={active === 'scan'} prominent onPress={onScan} />
      <TabItem colors={colors} icon="book-outline" label="الوصفات" />
      <TabItem colors={colors} icon="home" label="الرئيسية" active={active === 'home'} onPress={onHome} />
    </View>
  );
}

function TabItem({
  colors,
  icon,
  label,
  active,
  prominent,
  onPress,
}: {
  colors: ReturnType<typeof useColors>;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active?: boolean;
  prominent?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.tabItem}>
      <View style={[prominent && styles.prominentTab, { backgroundColor: prominent ? colors.accent : 'transparent' }]}><Ionicons name={icon} size={prominent ? 26 : 21} color={active ? colors.primary : colors.foreground} /></View>
      <Text style={[styles.tabLabel, { color: active ? colors.primary : colors.foreground }]}>{label}</Text>
    </Pressable>
  );
}

function Benefit({ colors, icon, title, caption }: { colors: ReturnType<typeof useColors>; icon: keyof typeof Ionicons.glyphMap; title: string; caption: string }) {
  return <View style={styles.benefit}><View style={[styles.benefitIcon, { backgroundColor: colors.secondary }]}><Ionicons name={icon} size={22} color={colors.foreground} /></View><Text style={{ color: colors.foreground, fontSize: 12, textAlign: 'center' }}>{title}{'\n'}{caption}</Text></View>;
}

function Callout({ colors, icon, title, text }: { colors: ReturnType<typeof useColors>; icon: keyof typeof Ionicons.glyphMap; title: string; text: string }) {
  return <View style={[styles.callout, { backgroundColor: colors.secondary }]}><Ionicons name={icon} size={27} color={colors.primary} /><View style={styles.calloutCopy}><Text style={[styles.calloutTitle, { color: colors.primary }]}>{title}</Text><Text style={[styles.calloutText, { color: colors.mutedForeground }]}>{text}</Text></View></View>;
}

function PrimaryButton({ colors, label, onPress, icon }: { colors: ReturnType<typeof useColors>; label: string; onPress: () => void; icon?: keyof typeof Ionicons.glyphMap }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.button, styles.primaryButton, { backgroundColor: colors.accent, opacity: pressed ? 0.82 : 1 }]}><Text style={[styles.buttonText, { color: colors.foreground }]}>{label}</Text>{icon && <Ionicons name={icon} size={19} color={colors.foreground} />}</Pressable>;
}

function OutlineButton({ colors, label, onPress }: { colors: ReturnType<typeof useColors>; label: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.button, styles.outlineButton, { borderColor: colors.foreground, opacity: pressed ? 0.7 : 1 }]}><Text style={[styles.buttonText, { color: colors.foreground }]}>{label}</Text></Pressable>;
}

function Field({ colors, icon, placeholder, value, onChangeText, secureTextEntry, keyboardType }: { colors: ReturnType<typeof useColors>; icon: keyof typeof Ionicons.glyphMap; placeholder: string; value?: string; onChangeText?: (value: string) => void; secureTextEntry?: boolean; keyboardType?: 'email-address' | 'default' }) {
  return <View style={[styles.field, { borderColor: colors.border, backgroundColor: colors.card }]}><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.mutedForeground} secureTextEntry={secureTextEntry} keyboardType={keyboardType} textAlign="right" style={[styles.fieldInput, { color: colors.foreground }]} /><Ionicons name={icon} size={21} color={colors.foreground} /></View>;
}

function SocialButton({ colors, icon, label }: { colors: ReturnType<typeof useColors>; icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return <Pressable style={[styles.socialButton, { borderColor: colors.border, backgroundColor: colors.card }]}><Ionicons name={icon} size={22} color={colors.foreground} /><Text style={{ color: colors.foreground, fontSize: 14 }}>{label}</Text><View style={{ width: 22 }} /></Pressable>;
}

function Divider({ colors }: { colors: ReturnType<typeof useColors> }) {
  return <View style={styles.divider}><View style={[styles.dividerLine, { backgroundColor: colors.border }]} /><Text style={[styles.dividerText, { color: colors.mutedForeground }]}>أو</Text><View style={[styles.dividerLine, { backgroundColor: colors.border }]} /></View>;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  frame: { flexGrow: 1 },
  header: { minHeight: 83, paddingHorizontal: 20, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerSide: { width: 91, alignItems: 'flex-start' },
  headerSideLeft: { alignItems: 'flex-end' },
  headerHint: { fontSize: 12, lineHeight: 17, textAlign: 'right' },
  brand: { alignItems: 'center', justifyContent: 'center' },
  brandRow: { flexDirection: 'row', alignItems: 'flex-start' },
  brandName: { fontSize: 40, lineHeight: 44, fontWeight: '800', letterSpacing: -2 },
  brandLeaf: { marginTop: 1, marginLeft: -3, transform: [{ rotate: '-25deg' }] },
  brandTagline: { fontSize: 12, marginTop: -1 },
  welcomeHero: { height: 375, marginTop: -20, justifyContent: 'center', paddingHorizontal: 26 },
  authHero: { height: 210, marginTop: -16, justifyContent: 'center', paddingHorizontal: 26 },
  homeHero: { height: 250, marginTop: -10, justifyContent: 'center', paddingHorizontal: 26 },
  heroImage: { resizeMode: 'cover' },
  heroWash: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(255,255,255,0.2)' },
  heroNote: { zIndex: 1, fontSize: 15, lineHeight: 22, textAlign: 'center', alignSelf: 'flex-start', marginLeft: 15, transform: [{ rotate: '-5deg' }] },
  welcomeBody: { paddingHorizontal: 20, marginTop: -37, zIndex: 2, alignItems: 'center' },
  authBody: { paddingHorizontal: 20, marginTop: -12, zIndex: 2 },
  displayTitle: { fontSize: 34, lineHeight: 43, fontWeight: '800', textAlign: 'center' },
  screenTitle: { fontSize: 29, lineHeight: 38, fontWeight: '800', textAlign: 'center', marginTop: 6 },
  bodyText: { fontSize: 15, lineHeight: 24, textAlign: 'center', marginTop: 4, marginBottom: 16 },
  benefits: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginBottom: 12 },
  benefit: { flex: 1, alignItems: 'center' },
  benefitIcon: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  callout: { width: '100%', flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16, marginBottom: 13 },
  calloutCopy: { flex: 1, alignItems: 'flex-end' },
  calloutTitle: { fontSize: 14, fontWeight: '700', textAlign: 'right' },
  calloutText: { fontSize: 11, lineHeight: 17, textAlign: 'right' },
  buttonStack: { width: '100%', gap: 9 },
  button: { height: 57, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row-reverse', gap: 8 },
  primaryButton: { borderWidth: 0 },
  outlineButton: { backgroundColor: 'transparent', borderWidth: 1.4 },
  buttonText: { fontSize: 18, fontWeight: '700' },
  forgot: { textAlign: 'right', fontSize: 13, textDecorationLine: 'underline', marginTop: -1, marginBottom: 13, marginRight: 5 },
  terms: { textAlign: 'right', fontSize: 12, lineHeight: 22, marginBottom: 12 },
  field: { height: 58, borderRadius: 15, borderWidth: 1, flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 14, marginBottom: 10 },
  fieldInput: { flex: 1, fontSize: 14, marginRight: 10, paddingVertical: 0 },
  socialButton: { height: 53, borderRadius: 14, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 17, marginBottom: 9 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 14 },
  dividerLine: { height: 1, flex: 1 },
  dividerText: { fontSize: 13 },
  onboardingBody: { paddingHorizontal: 16, alignItems: 'stretch' },
  progressRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, marginBottom: 16, paddingHorizontal: 7 },
  progressLabel: { fontSize: 12 },
  progressTrack: { flex: 1, flexDirection: 'row', gap: 5 },
  progressSegment: { height: 7, flex: 1, borderRadius: 10 },
  skip: { fontSize: 13 },
  choiceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 13 },
  choiceCard: { width: '48.5%', minHeight: 171, borderRadius: 17, borderWidth: 1, overflow: 'hidden', position: 'relative' },
  choiceImage: { width: '100%', height: 91, resizeMode: 'cover' },
  selectionBadge: { position: 'absolute', right: 9, top: 9, width: 29, height: 29, borderRadius: 15, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  choiceCopy: { paddingHorizontal: 11, paddingTop: 7, paddingBottom: 10, alignItems: 'flex-end' },
  choiceTitle: { fontSize: 18, fontWeight: '700', textAlign: 'right' },
  choiceDescription: { fontSize: 10, lineHeight: 15, textAlign: 'right', marginTop: 2 },
  choiceIcon: { position: 'absolute', left: 9, bottom: 8, opacity: 0.45 },
  tasteList: { gap: 9, marginBottom: 12 },
  tasteCard: { minHeight: 88, borderRadius: 16, borderWidth: 1.4, overflow: 'hidden', flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 11, position: 'relative' },
  tasteCheck: { width: 28, height: 28, borderRadius: 15, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginLeft: 7 },
  tasteCopy: { flex: 1, alignItems: 'flex-end', paddingRight: 5 },
  tasteTitle: { fontSize: 17, fontWeight: '700' },
  tasteDescription: { fontSize: 11, marginTop: 3 },
  tasteImage: { width: 103, height: 76, resizeMode: 'contain', marginLeft: -7 },
  ingredientPanel: { borderRadius: 17, borderWidth: 1, overflow: 'hidden', marginBottom: 11 },
  ingredientHeader: { minHeight: 78, flexDirection: 'row', paddingLeft: 12, alignItems: 'center' },
  ingredientImage: { width: 104, height: 73, resizeMode: 'contain' },
  ingredientTitleWrap: { flex: 1, alignItems: 'flex-end', paddingRight: 13 },
  ingredientTitleRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  ingredientTitle: { fontSize: 17, fontWeight: '700' },
  ingredientSubtitle: { fontSize: 10, marginTop: 4, textAlign: 'right' },
  chips: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 7, paddingHorizontal: 12, paddingTop: 9, paddingBottom: 8 },
  chip: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 6, borderRadius: 18 },
  addRow: { height: 43, borderRadius: 12, borderWidth: 1, marginHorizontal: 12, marginBottom: 11, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 11 },
  replacementList: { gap: 8, marginBottom: 12 },
  replacementRow: { minHeight: 70, borderRadius: 15, borderWidth: 1, paddingHorizontal: 12, flexDirection: 'row-reverse', alignItems: 'center' },
  replacementIcon: { width: 42, height: 42, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  replacementCopy: { flex: 1, alignItems: 'flex-end' },
  replacementTitle: { fontSize: 16, fontWeight: '700' },
  replacementDescription: { fontSize: 10, marginTop: 3, textAlign: 'right' },
  radio: { width: 25, height: 25, borderRadius: 13, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  avatar: { width: 35, height: 35, borderRadius: 18 },
  avatarText: { fontSize: 11, lineHeight: 15, textAlign: 'right' },
  location: { flexDirection: 'row-reverse', alignItems: 'center', gap: 3 },
  homeBody: { alignItems: 'center', paddingHorizontal: 14, marginTop: -3 },
  homeMiniRow: { flexDirection: 'row-reverse', gap: 8, width: '100%', marginBottom: 12 },
  miniCard: { flex: 1, borderRadius: 16, minHeight: 105, padding: 11, overflow: 'hidden' },
  miniImage: { width: 68, height: 68, borderRadius: 13, alignSelf: 'flex-start', marginBottom: -2 },
  miniCardTitle: { fontSize: 13, fontWeight: '700', lineHeight: 19, textAlign: 'right' },
  miniCardCaption: { fontSize: 10, lineHeight: 15, textAlign: 'right', marginTop: 3 },
  recipeCard: { width: '100%', borderRadius: 20, overflow: 'hidden', marginBottom: 11, shadowColor: '#18371f', shadowOpacity: 0.12, shadowRadius: 11, shadowOffset: { width: 0, height: 5 }, elevation: 3 },
  recipeImage: { width: '100%', height: 250, resizeMode: 'cover' },
  recipeTime: { position: 'absolute', left: 13, top: 13, flexDirection: 'row', gap: 4, alignItems: 'center', backgroundColor: '#ffffffdd', borderRadius: 14, paddingHorizontal: 9, paddingVertical: 5 },
  recipeCopy: { padding: 11, alignItems: 'flex-end' },
  recipeTag: { borderRadius: 17, paddingHorizontal: 10, paddingVertical: 5, flexDirection: 'row-reverse', gap: 4, alignItems: 'center' },
  recipeTitle: { fontSize: 22, fontWeight: '800', lineHeight: 29, textAlign: 'right', marginTop: 7 },
  recipeCaption: { fontSize: 12, textAlign: 'right', marginTop: 4 },
  bottomTabs: { minHeight: 76, borderTopWidth: 1, flexDirection: 'row-reverse', alignItems: 'flex-start', justifyContent: 'space-around', paddingTop: 7, marginHorizontal: -16, marginBottom: -(20 + 34) },
  tabItem: { flex: 1, alignItems: 'center', gap: 3 },
  prominentTab: { width: 51, height: 51, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginTop: -25, borderWidth: 4, borderColor: '#fbfaf6' },
  tabLabel: { fontSize: 10, textAlign: 'center' },
  scanBody: { paddingHorizontal: 14, alignItems: 'center' },
  scanArea: { width: '100%', height: 365, borderRadius: 23, overflow: 'hidden', marginTop: 8, borderWidth: 2, borderColor: '#aab5a7', borderStyle: 'dashed' },
  scanAreaImage: { resizeMode: 'cover' },
  scanOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(255,255,255,0.12)' },
  cameraPrompt: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  cameraCircle: { width: 91, height: 91, borderRadius: 46, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  cameraTitle: { fontSize: 18, lineHeight: 26, fontWeight: '700', textAlign: 'center' },
  cameraCaption: { fontSize: 12, lineHeight: 19, textAlign: 'center', marginTop: 6 },
  sourceTabs: { height: 70, width: '100%', borderRadius: 17, flexDirection: 'row-reverse', overflow: 'hidden', marginTop: 10, elevation: 2 },
  sourceTab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
  sourceLabel: { fontSize: 10 },
  scanButtonWrap: { width: '100%', alignItems: 'center', marginTop: 12 },
  helperText: { fontSize: 11, marginTop: 8 },
  reviewBody: { paddingHorizontal: 14, alignItems: 'center' },
  reviewHero: { width: '100%', height: 265, borderRadius: 20, overflow: 'hidden', position: 'relative', marginTop: 7 },
  reviewHeroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imageLabel: { position: 'absolute', top: 10, right: 10, borderRadius: 15, paddingHorizontal: 10, paddingVertical: 6, flexDirection: 'row-reverse', gap: 4, alignItems: 'center' },
  closeButton: { position: 'absolute', left: 10, top: 10, width: 37, height: 37, borderRadius: 19, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  thumbnailRow: { flexDirection: 'row-reverse', gap: 7, width: '100%', marginVertical: 11 },
  thumbnail: { flex: 1, height: 86, borderRadius: 14, overflow: 'hidden', position: 'relative' },
  thumbnailImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  thumbnailClose: { position: 'absolute', right: 4, top: 4, width: 23, height: 23, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  addThumbnail: { flex: 1, height: 86, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 3 },
  reviewSummary: { width: '100%', borderRadius: 16, minHeight: 65, paddingHorizontal: 13, flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between' },
  summaryCount: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5 },
  summaryTitle: { fontSize: 15, fontWeight: '700', textAlign: 'right' },
  summaryCaption: { fontSize: 10, textAlign: 'right', marginTop: 2 },
});

export default App;