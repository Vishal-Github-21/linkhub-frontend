import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {BACKEND_URL} from '../utils/config';
import {setItem, getItem} from '../utils/storage';

interface AuthScreenProps {
  navigation: any;
  route: any;
}

const AuthScreen: React.FC<AuthScreenProps> = ({navigation, route}) => {
  const [isSignUp, setIsSignUp] = useState(route.params?.isSignUp || false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    setIsSignUp(route.params?.isSignUp || false);
    setErrorMsg('');
    // Load saved credentials
    loadSavedCredentials();
  }, [route.params?.isSignUp]);

  const loadSavedCredentials = async () => {
    try {
      const savedEmail = await getItem('savedEmail');
      const savedPassword = await getItem('savedPassword');
      if (savedEmail) setEmail(savedEmail);
      if (savedPassword) setPassword(savedPassword);
    } catch (error) {
      console.error('Error loading credentials:', error);
    }
  };

  const isEmailValid = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isPasswordValid = (password: string): boolean => {
    const regex = /^(?=.*[!@#$%^&*])(?=.*[0-9]).{6,}$/;
    return regex.test(password);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        await setItem('token', data.token);
        // Save credentials if rememberMe is true
        if (rememberMe) {
          await setItem('savedEmail', email);
          await setItem('savedPassword', password);
        } else {
          // Clear saved credentials if rememberMe is false
          await setItem('savedEmail', '');
          await setItem('savedPassword', '');
        }
        setPassword('');
        navigation.replace('Dashboard');
      } else {
        setPassword('');
        setErrorMsg(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMsg('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setErrorMsg('Please fill in all fields');
      return;
    }

    if (!isEmailValid(email)) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    if (!isPasswordValid(password)) {
      setErrorMsg(
        'Password must be at least 6 characters long and contain at least one special character and one numeric character',
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        Alert.alert('Success', 'Account created successfully! Please sign in.', [
          {
            text: 'OK',
            onPress: () => {
              setName('');
              setEmail('');
              setPassword('');
              setErrorMsg('');
              setIsSignUp(false);
            },
          },
        ]);
      } else {
        setErrorMsg(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMsg('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setErrorMsg('');
    setEmail('');
    setPassword('');
    setName('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerContainer}>
          <Text style={styles.logo}>LinkHub</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? 'Create your account' : 'Welcome back!'}
          </Text>
        </View>

        <View style={styles.formContainer}>
          {isSignUp && (
            <View style={styles.inputGroup}>
              <Icon name="user" size={20} color="#666" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Icon name="envelope" size={18} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Icon name="lock" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {errorMsg ? <Text style={styles.errorText}>* {errorMsg} *</Text> : null}

          {!isSignUp && (
            <View style={styles.rememberMeContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setRememberMe(!rememberMe)}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Icon name="check" size={14} color="#fff" />}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={isSignUp ? handleRegister : handleLogin}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </Text>
            <TouchableOpacity onPress={toggleForm}>
              <Text style={styles.toggleLink}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#512da8',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#f409d2',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 14,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#512da8',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#512da8',
  },
  rememberMeText: {
    color: '#666',
    fontSize: 14,
  },
  forgotPassword: {
    color: '#512da8',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#512da8',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  toggleText: {
    color: '#666',
    fontSize: 14,
  },
  toggleLink: {
    color: '#512da8',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default AuthScreen;
