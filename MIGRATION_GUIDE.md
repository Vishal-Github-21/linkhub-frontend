# React to React Native Migration Guide - LinkHub

## 📋 Migration Summary

This document outlines how your React web application was converted to React Native mobile app.

## 🔄 Component Mapping

### Pages Converted

| Web Page            | Mobile Screen              | Status         | Notes                 |
| ------------------- | -------------------------- | -------------- | --------------------- |
| `Home.js`           | `HomeScreen.tsx`           | ✅ Complete    | Animations simplified |
| `Authorise.js`      | `AuthScreen.tsx`           | ✅ Complete    | Combined Sign In/Up   |
| `Dashboard.js`      | `DashboardScreen.tsx`      | ✅ Complete    | FlatList for cards    |
| `Profile.js`        | `ProfileScreen.tsx`        | ✅ Complete    | Simplified layout     |
| `Create.js`         | `CreateScreen.tsx`         | ✅ Complete    | No rich text editor   |
| `Edit.js`           | `EditScreen.tsx`           | ⚠️ Placeholder | Needs implementation  |
| `FullView.js`       | `FullViewScreen.tsx`       | ⚠️ Placeholder | Needs implementation  |
| `ForgotPassword.js` | `ForgotPasswordScreen.tsx` | ✅ Complete    | -                     |

### Components Status

| Web Component       | Mobile Component      | Status        |
| ------------------- | --------------------- | ------------- |
| `Nav.js`            | Built into screens    | ✅ Integrated |
| `CardsList.js`      | FlatList in Dashboard | ✅ Complete   |
| `HorizontalCard.js` | Card in Dashboard     | ✅ Complete   |
| `Loader.js`         | ActivityIndicator     | ✅ Complete   |

## 🔧 Technical Changes

### 1. Navigation System

**Before (React):**

```javascript
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/dashboard" element={<Dashboard />} />
</Routes>;

// Usage
const navigate = useNavigate();
navigate('/dashboard');

<Link to="/dashboard">Dashboard</Link>;
```

**After (React Native):**

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

<NavigationContainer>
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
  </Stack.Navigator>
</NavigationContainer>;

// Usage
navigation.navigate('Dashboard');
// Note: No Link component, use TouchableOpacity with navigation
```

### 2. Storage Management

**Before (React):**

```javascript
// Synchronous
localStorage.setItem('token', token);
const token = localStorage.getItem('token');
localStorage.removeItem('token');
```

**After (React Native):**

```typescript
// Asynchronous
import { setItem, getItem, removeItem } from './utils/storage';

await setItem('token', token);
const token = await getItem('token');
await removeItem('token');
```

### 3. Styling Approach

**Before (React):**

```css
/* Dashboard.css */
.container {
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  padding: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}
```

```javascript
import './Dashboard.css';

<div className="container">
  <h1 className="title">Dashboard</h1>
</div>;
```

**After (React Native):**

```typescript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});

<View style={styles.container}>
  <Text style={styles.title}>Dashboard</Text>
</View>;
```

### 4. Icons

**Before (React):**

```javascript
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons';

<FontAwesomeIcon icon={faHome} size="lg" />;
```

**After (React Native):**

```typescript
import Icon from 'react-native-vector-icons/FontAwesome';

<Icon name="home" size={24} color="#007bff" />;
```

### 5. Lists & Scrolling

**Before (React):**

```javascript
<div className="cards-container">
  {cards.map(card => (
    <Card key={card.id} {...card} />
  ))}
</div>
```

**After (React Native):**

```typescript
<FlatList
  data={cards}
  renderItem={({ item }) => <Card {...item} />}
  keyExtractor={item => item.id}
/>
```

### 6. Forms & Inputs

**Before (React):**

```javascript
<input
  type="email"
  placeholder="Email"
  value={email}
  onChange={e => setEmail(e.target.value)}
/>
```

**After (React Native):**

```typescript
<TextInput
  placeholder="Email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  autoCapitalize="none"
/>
```

### 7. Buttons & Interactions

**Before (React):**

```javascript
<button onClick={handleSubmit} className="submit-btn">
  Submit
</button>
```

**After (React Native):**

```typescript
<TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
  <Text style={styles.submitBtnText}>Submit</Text>
</TouchableOpacity>
```

## 📱 Screen-by-Screen Breakdown

### HomeScreen

**Key Changes:**

- Removed images (can be added back with React Native Image)
- Simplified animations using `Animated` API
- Replaced Link components with TouchableOpacity + navigation
- Converted typing animation to React Native compatible version

**Web vs Mobile:**

```javascript
// Web
<Link to="/signup" className="Home_btn">
  Get Started <FontAwesomeIcon icon={faArrowRight} />
</Link>

// Mobile
<TouchableOpacity
  style={styles.getStartedButton}
  onPress={() => navigation.navigate('Auth', {isSignUp: true})}>
  <Text style={styles.getStartedText}>{displayText}</Text>
  <Icon name="arrow-right" size={18} color="#fff" />
</TouchableOpacity>
```

### AuthScreen

**Key Changes:**

- Combined SignIn and SignUp into one screen with toggle
- Replaced form submission with async API calls
- Used Alert for success/error messages
- KeyboardAvoidingView for better UX

**Web vs Mobile:**

```javascript
// Web
const registerFunction = async e => {
  e.preventDefault();
  // ... fetch logic
  if (data.status === 'success') {
    navigate('/login');
  }
};

// Mobile
const handleRegister = async () => {
  // No e.preventDefault needed
  // ... fetch logic
  if (data.status === 'success') {
    Alert.alert('Success', 'Account created!', [
      { text: 'OK', onPress: () => setIsSignUp(false) },
    ]);
  }
};
```

### DashboardScreen

**Key Changes:**

- Used FlatList instead of mapping for better performance
- Integrated navigation into the screen
- Added bottom navigation bar
- Pull-to-refresh ready (not implemented)

**Web vs Mobile:**

```javascript
// Web
<div className="cards-container">
  {userLinks.map(link => (
    <HorizontalCard key={link.linkid} {...link} />
  ))}
</div>

// Mobile
<FlatList
  data={filteredLinks}
  renderItem={renderLinkCard}
  keyExtractor={(item) => item.linkid}
  contentContainerStyle={styles.listContent}
/>
```

### CreateScreen

**Key Changes:**

- Removed rich text editor (Quill doesn't work in RN)
- Used plain TextInput for bio
- Image picker not yet implemented
- ScrollView for entire form

**Major Difference:**

```javascript
// Web - Rich Text Editor
<ReactQuill
  theme="snow"
  value={quillvalue}
  onChange={setQuillValue}
  modules={modules}
  formats={formats}
/>

// Mobile - Plain TextInput
<TextInput
  style={[styles.input, styles.textArea]}
  placeholder="Tell us about yourself..."
  value={formData.bio}
  onChangeText={(text) => handleInputChange('bio', text)}
  multiline
  numberOfLines={4}
/>
```

## 🚨 Breaking Changes & Limitations

### 1. No Rich Text Editor

- **Web:** Uses `react-quill`
- **Mobile:** Plain text input (needs replacement)
- **Solution:** Use `react-native-pell-rich-editor` or similar

### 2. No Image Upload

- **Web:** File input with preview
- **Mobile:** Not implemented
- **Solution:** Use `react-native-image-picker`

### 3. No DOM Manipulation

- **Web:** Can use `document.querySelector()`, etc.
- **Mobile:** No DOM access
- **Solution:** Use refs and state management

### 4. Different Event Handling

- **Web:** `onClick`, `onChange`, `onSubmit`
- **Mobile:** `onPress`, `onChangeText`, no form submission event

### 5. CSS Differences

- No cascading styles
- No pseudo-classes (`:hover`, `:active`)
- No CSS animations (use Animated API)
- Limited layout options (mainly flexbox)

## ✅ What Works the Same

1. **React Hooks** - useState, useEffect, etc. work identically
2. **API Calls** - Fetch and Axios work the same
3. **State Management** - Same patterns apply
4. **Component Logic** - Business logic remains unchanged
5. **Data Flow** - Props and state work identically

## 🔜 Next Steps

### To Complete the Migration:

1. **Implement Missing Features:**

   - [ ] Rich text editor for bio
   - [ ] Image picker for profile pictures
   - [ ] Full Edit screen functionality
   - [ ] Full View screen implementation

2. **Enhance UX:**

   - [ ] Add loading indicators everywhere
   - [ ] Pull-to-refresh on Dashboard
   - [ ] Offline support
   - [ ] Better error messages

3. **Testing:**

   - [ ] Test on iOS devices
   - [ ] Test on Android devices
   - [ ] Test different screen sizes
   - [ ] Test slow network conditions

4. **Polish:**

   - [ ] Add animations
   - [ ] Improve accessibility
   - [ ] Add haptic feedback
   - [ ] Optimize performance

5. **Deployment:**
   - [ ] Set up CI/CD
   - [ ] Configure app icons
   - [ ] Set up splash screens
   - [ ] Prepare for App Store/Play Store

## 📚 Learning Resources

- **React Native Basics:** https://reactnative.dev/docs/getting-started
- **React Navigation:** https://reactnavigation.org/
- **AsyncStorage:** https://react-native-async-storage.github.io/
- **Vector Icons:** https://oblador.github.io/react-native-vector-icons/
- **Styling:** https://reactnative.dev/docs/style

## 💡 Pro Tips

1. **Test on Real Devices** - Simulators don't show real performance
2. **Use Flipper** - Great debugging tool for React Native
3. **Handle Platform Differences** - Use `Platform.OS` for iOS/Android specific code
4. **Optimize Images** - Use appropriate sizes and formats
5. **Handle Permissions** - iOS and Android need different permission handling

---

**Remember:** The mobile app shares the same backend, so no backend changes are needed! Just update the `BACKEND_URL` in `config.ts` and you're good to go.
