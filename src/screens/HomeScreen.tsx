import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
//   Image,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen = ({navigation}: any) => {
  const [showText, setShowText] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Simulate typing effect
    const timeout = setTimeout(() => {
      setShowText(true);
      animateText('Get Started');
    }, 500);

    return () => clearTimeout(timeout);
  }, [fadeAnim]);

  const animateText = (text: string) => {
    const chars = text.split('');
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex <= chars.length) {
        setDisplayText(chars.slice(0, currentIndex).join(''));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Navigation Bar */}
      <View style={styles.navbar}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>LinkHub</Text>
        </View>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => navigation.navigate('Auth', {isSignUp: false})}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <Animated.View style={[styles.heroSection, {opacity: fadeAnim}]}>
          <Text style={styles.title}>LinkHub</Text>
          <Text style={styles.description}>
            LinkHub is a platform that allows you to share your links with the
            world. You can share your social media profiles, websites, blogs,
            and much more with just one link. Create your free account today!
          </Text>

          {showText && (
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={() => navigation.navigate('Auth', {isSignUp: true})}>
              <Text style={styles.getStartedText}>{displayText}</Text>
              <Icon name="arrow-right" size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Feature Section */}
        <View style={styles.featureSection}>
          <FeatureCard
            icon="link"
            title="One Link"
            description="Share all your links in one place"
          />
          <FeatureCard
            icon="users"
            title="Connect"
            description="Connect with your audience easily"
          />
          <FeatureCard
            icon="chart-line"
            title="Track"
            description="Track your link performance"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const FeatureCard = ({icon, title, description}: any) => (
  <View style={styles.featureCard}>
    <Icon name={icon} size={40} color="#512da8" />
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#512da8',
  },
  signInButton: {
    backgroundColor: '#512da8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  heroSection: {
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  getStartedButton: {
    flexDirection: 'row',
    backgroundColor: '#512da8',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  featureSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: 30,
  },
  featureCard: {
    width: '30%',
    minWidth: 100,
    alignItems: 'center',
    padding: 15,
    marginBottom: 20,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;
