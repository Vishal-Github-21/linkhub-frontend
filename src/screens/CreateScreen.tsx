import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
//   Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {BACKEND_URL} from '../utils/config';
import {getItem} from '../utils/storage';

const CreateScreen = ({navigation}: any) => {
  const [loading, setLoading] = useState(false);
  const [existingNames, setExistingNames] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    bio: '',
    github: '',
    x: '',
    yt: '',
    insta: '',
    hyperlinks: [] as Array<{name: string; url: string}>,
    profileImage: '',
  });
  const [urls, setUrls] = useState<string[]>([]);
  const [linkNames, setLinkNames] = useState<string[]>([]);

  useEffect(() => {
    fetchExistingNames();
  }, []);

  const fetchExistingNames = async () => {
    try {
      const token = await getItem('token');
      const response = await fetch(`${BACKEND_URL}/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || '',
        },
      });

      const data = await response.json();
      if (data.status !== 'failed') {
        setExistingNames(data.user.userLinks.map((link: any) => link.name));
      }
    } catch (error) {
      console.error('Error fetching names:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const addLink = () => {
    setUrls([...urls, '']);
    setLinkNames([...linkNames, '']);
  };

  const updateLink = (index: number, url: string, name: string) => {
    const newUrls = [...urls];
    const newNames = [...linkNames];
    newUrls[index] = url;
    newNames[index] = name;
    setUrls(newUrls);
    setLinkNames(newNames);
  };

  const deleteLink = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    const newNames = linkNames.filter((_, i) => i !== index);
    setUrls(newUrls);
    setLinkNames(newNames);
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      Alert.alert('Error', 'Please enter a LinkHub alias');
      return;
    }

    if (existingNames.includes(formData.name)) {
      Alert.alert('Error', 'Alias of this name already exists');
      return;
    }

    setLoading(true);
    try {
      const token = await getItem('token');
      const hyperlinks = urls.map((url, i) => ({
        name: linkNames[i] || `Link ${i + 1}`,
        url: url,
      }));

      const submitData = {
        ...formData,
        hyperlinks,
        linkid: Date.now().toString(),
        published: false,
        bioHtml: formData.bio,
      };

      const response = await fetch(`${BACKEND_URL}/create-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || '',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (data.status === 'success') {
        Alert.alert('Success', 'Link created successfully!', [
          // Open the Edit screen for the newly created link so user can publish/share/update icon
          {text: 'OK', onPress: () => navigation.replace('Edit', {linkid: submitData.linkid})},
        ]);
      } else {
        Alert.alert('Error', data.error || 'Failed to create link');
      }
    } catch (error) {
      console.error('Error creating link:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const alreadyExists = existingNames.includes(formData.name);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create LinkHub</Text>
        <TouchableOpacity onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Icon name="check" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Image Placeholder */}
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Icon name="user" size={50} color="#ccc" />
          </View>
          <TouchableOpacity style={styles.editImageButton}>
            <Icon name="pencil" size={16} color="#512da8" />
          </TouchableOpacity>
        </View>

        {/* LinkHub Alias */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>LinkHub Alias *</Text>
          <TextInput
            style={styles.input}
            placeholder="What should we call this LinkHub?"
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />
          {alreadyExists && (
            <Text style={styles.errorText}>
              * Alias of this name already exists *
            </Text>
          )}
        </View>

        {/* Contact Info */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>
              <Icon name="envelope" size={14} /> Email
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
            />
          </View>

          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>
              <Icon name="phone" size={14} /> Phone
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Phone"
              value={formData.phoneNumber}
              onChangeText={(text) => handleInputChange('phoneNumber', text)}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Bio */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us about yourself..."
            value={formData.bio}
            onChangeText={(text) => handleInputChange('bio', text)}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Social Handles */}
        <Text style={styles.sectionTitle}>Social Handles</Text>
        {[
          {icon: 'github', field: 'github', placeholder: 'GitHub ID'},
          {icon: 'twitter', field: 'x', placeholder: 'X Handle'},
          {icon: 'youtube', field: 'yt', placeholder: 'YouTube ID'},
          {icon: 'instagram', field: 'insta', placeholder: 'Instagram ID'},
        ].map((social) => (
          <View key={social.field} style={styles.socialContainer}>
            <Icon name={social.icon} size={24} color="#666" />
            <TextInput
              style={styles.socialInput}
              placeholder={social.placeholder}
              value={formData[social.field as keyof typeof formData] as string}
              onChangeText={(text) => handleInputChange(social.field, text)}
            />
          </View>
        ))}

        {/* Additional Links */}
        <View style={styles.linksSection}>
          <Text style={styles.sectionTitle}>Additional Links</Text>
          {urls.map((url, index) => (
            <View key={index} style={styles.linkItem}>
              <TextInput
                style={[styles.input, {flex: 1}]}
                placeholder="URL"
                value={url}
                onChangeText={(text) => updateLink(index, text, linkNames[index])}
              />
              <TextInput
                style={[styles.input, {flex: 1, marginLeft: 10}]}
                placeholder="Link Name"
                value={linkNames[index]}
                onChangeText={(text) => updateLink(index, url, text)}
              />
              <TouchableOpacity
                onPress={() => deleteLink(index)}
                style={styles.deleteButton}>
                <Icon name="trash" size={20} color="#dc3545" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton} onPress={addLink}>
            <Icon name="plus" size={20} color="#512da8" />
            <Text style={styles.addButtonText}>Add Link</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#512da8',
    borderBottomWidth: 0,
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#512da8',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#f409d2',
    fontSize: 14,
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  socialInput: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
  linksSection: {
    marginBottom: 30,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButton: {
    marginLeft: 10,
    padding: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#512da8',
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 15,
    marginTop: 10,
  },
  addButtonText: {
    color: '#512da8',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default CreateScreen;
