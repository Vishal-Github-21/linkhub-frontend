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
  Modal,
  Linking,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {BACKEND_URL, FRONTEND_URL} from '../utils/config';
import {getItem} from '../utils/storage';

const EditScreen = ({navigation, route}: any) => {
  const {linkid} = route.params || {};
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [existingNames, setExistingNames] = useState<string[]>([]);
  const [originalName, setOriginalName] = useState('');
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
    published: false,
  });
  const [urls, setUrls] = useState<string[]>([]);
  const [linkNames, setLinkNames] = useState<string[]>([]);

  const fetchLinkData = async () => {
    try {
      setFetching(true);
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
        const link = data.user.userLinks.find((l: any) => l.linkid === linkid);
        if (link) {
          setFormData({
            name: link.name || '',
            email: link.email || '',
            phoneNumber: link.phoneNumber || '',
            bio: link.bio || '',
            github: link.github || '',
            x: link.x || '',
            yt: link.yt || '',
            insta: link.insta || '',
            hyperlinks: link.hyperlinks || [],
            profileImage: link.profileImage || '',
            published: link.published || false,
          });
          setOriginalName(link.name || '');
          
          // Set additional links
          if (link.hyperlinks && link.hyperlinks.length > 0) {
            setUrls(link.hyperlinks.map((h: any) => h.url));
            setLinkNames(link.hyperlinks.map((h: any) => h.name));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching link data:', error);
      Alert.alert('Error', 'Failed to load link data');
    } finally {
      setFetching(false);
    }
  };

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

  useEffect(() => {
    fetchLinkData();
    fetchExistingNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openActions = () => {
    setShowActionsMenu(true);
  };

  const handleShareHub = async () => {
    try {
      const url = `${FRONTEND_URL}/shortview/${linkid}`;
      await Share.share({message: url});
    } catch (err) {
      console.error('Share error', err);
    }
  };

  const handleSharePage = async () => {
    try {
      const url = `${FRONTEND_URL}/pageview/${linkid}`;
      await Share.share({message: url});
    } catch (err) {
      console.error('Share error', err);
    }
  };

  const handleView = () => {
    const url = `${FRONTEND_URL}/shortview/${linkid}`;
    Linking.openURL(url).catch(err => console.error('Open URL error', err));
  };

  const handlefullView = () => {
    const url = `${FRONTEND_URL}/pageview/${linkid}`;
    Linking.openURL(url).catch(err => console.error('Open URL error', err));
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

  const handlepublish = async () => {
    try {
      const token = await getItem('token');
      const response = await fetch(`${BACKEND_URL}/publish-link/${linkid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: token || '' },
      });
      const data = await response.json();
      if (data.status === 'success') {
        fetchLinkData();
        Alert.alert('Success', 'Published');
      } else {
        Alert.alert('Error', data.error || 'Failed to publish');
      }
    } catch (err) {
      console.error('Publish error', err);
      Alert.alert('Error', 'Failed to publish');
    }
  };

  const handleunpublish = async () => {
    try {
      const token = await getItem('token');
      const response = await fetch(`${BACKEND_URL}/unpublish-link/${linkid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: token || '' },
      });
      const data = await response.json();
      if (data.status === 'success') {
        fetchLinkData();
        Alert.alert('Success', 'Unpublished');
      } else {
        Alert.alert('Error', data.error || 'Failed to unpublish');
      }
    } catch (err) {
      console.error('Unpublish error', err);
      Alert.alert('Error', 'Failed to unpublish');
    }
  };

  const saveProfileImage = async () => {
    if (!tempImageUrl) {
      Alert.alert('Error', 'Please enter image URL');
      return;
    }
    setLoading(true);
    try {
      const token = await getItem('token');
      const payload = { linkid, profileImage: tempImageUrl };
      const response = await fetch(`${BACKEND_URL}/update-link`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: token || '' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setShowImageModal(false);
        setTempImageUrl('');
        fetchLinkData();
        Alert.alert('Success', 'Profile image updated');
      } else {
        Alert.alert('Error', data.error || 'Failed to update image');
      }
    } catch (err) {
      console.error('Update image error', err);
      Alert.alert('Error', 'Failed to update image');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      Alert.alert('Error', 'Please enter a LinkHub alias');
      return;
    }

    // Check if name changed and if new name already exists
    if (formData.name !== originalName && existingNames.includes(formData.name)) {
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
        linkid: linkid,
        bioHtml: formData.bio,
      };

      const response = await fetch(`${BACKEND_URL}/update-link`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || '',
        },
        body: JSON.stringify(submitData),
      });

      // Log response details for debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const responseText = await response.text();
      console.log('Response text:', responseText);

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch {
        console.error('JSON parse error. Response was:', responseText);
        Alert.alert('Error', `Server returned invalid response. Status: ${response.status}`);
        return;
      }

      if (data.status === 'success') {
        Alert.alert('Success', 'Link updated successfully!', [
          {text: 'OK', onPress: () => navigation.replace('Dashboard')},
        ]);
      } else {
        Alert.alert('Error', data.error || 'Failed to update link');
      }
    } catch (error) {
      console.error('Error updating link:', error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const alreadyExists = formData.name !== originalName && existingNames.includes(formData.name);

  if (fetching) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#512da8" />
        <Text style={styles.loadingText}>Loading link data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit LinkHub</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity 
            onPress={() => {
              console.log('Actions button pressed');
              openActions();
            }} 
            style={{marginRight: 15, padding: 5}}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          >
            <Icon name="ellipsis-v" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleSubmit} 
            disabled={loading}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon name="check" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Actions Menu Modal */}
      <Modal visible={showActionsMenu} transparent animationType="slide">
        <TouchableOpacity 
          style={{flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'flex-end'}} 
          activeOpacity={1}
          onPress={() => setShowActionsMenu(false)}
        >
          <TouchableOpacity activeOpacity={1}>
            <View style={{backgroundColor:'#fff',borderTopLeftRadius:20,borderTopRightRadius:20,paddingBottom:30}}>
            <View style={{padding:20,borderBottomWidth:1,borderBottomColor:'#f0f0f0'}}>
              <Text style={{fontSize:18,fontWeight:'bold',color:'#333'}}>Actions</Text>
            </View>
            <TouchableOpacity 
              style={styles.actionItem} 
              onPress={() => {setShowActionsMenu(false); handleView();}}
            >
              <Icon name="eye" size={20} color="#512da8" />
              <Text style={styles.actionText}>View Hub</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionItem} 
              onPress={() => {setShowActionsMenu(false); handlefullView();}}
            >
              <Icon name="file-text-o" size={20} color="#512da8" />
              <Text style={styles.actionText}>Page View</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionItem} 
              onPress={() => {setShowActionsMenu(false); handleShareHub();}}
            >
              <Icon name="share-alt" size={20} color="#512da8" />
              <Text style={styles.actionText}>Share Hub</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionItem} 
              onPress={() => {setShowActionsMenu(false); handleSharePage();}}
            >
              <Icon name="share" size={20} color="#512da8" />
              <Text style={styles.actionText}>Share Page</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionItem} 
              onPress={() => {
                setShowActionsMenu(false);
                formData.published ? handleunpublish() : handlepublish();
              }}
            >
              <Icon name={formData.published ? "unlink" : "wifi"} size={20} color="#512da8" />
              <Text style={styles.actionText}>{formData.published ? 'Unpublish' : 'Publish'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionItem} 
              onPress={() => {setShowActionsMenu(false); setShowImageModal(true);}}
            >
              <Icon name="image" size={20} color="#512da8" />
              <Text style={styles.actionText}>Update Icon</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionItem, {borderTopWidth:1,borderTopColor:'#f0f0f0',marginTop:10}]} 
              onPress={() => setShowActionsMenu(false)}
            >
              <Text style={[styles.actionText,{color:'#dc3545',fontWeight:'600',textAlign:'center',flex:1}]}>Cancel</Text>
            </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Update Icon Modal */}
      <Modal visible={showImageModal} transparent animationType="fade">
        <TouchableOpacity 
          style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'rgba(0,0,0,0.4)'}}
          activeOpacity={1}
          onPress={() => {setShowImageModal(false); setTempImageUrl('');}}
        >
          <TouchableOpacity activeOpacity={1} style={{width:'90%'}}>
            <View style={{backgroundColor:'#fff',padding:20,borderRadius:10}}>
              <Text style={{fontSize:18,fontWeight:'bold',marginBottom:10}}>Update Profile Image</Text>
              <TextInput
                placeholder="Enter image URL"
                value={tempImageUrl}
                onChangeText={setTempImageUrl}
                style={{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:10,marginBottom:12}}
              />
              <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                <TouchableOpacity onPress={() => {setShowImageModal(false); setTempImageUrl('');}} style={{marginRight:12}}>
                  <Text style={{color:'#666'}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={saveProfileImage}>
                  <Text style={{color:'#512da8',fontWeight:'600'}}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <ScrollView style={styles.scrollView}>
        {/* Profile Image Placeholder */}
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Icon name="user" size={50} color="#ccc" />
          </View>
          <TouchableOpacity style={styles.editImageButton} onPress={() => setShowImageModal(true)}>
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
                style={[styles.input, styles.linkUrlInput]}
                placeholder="URL"
                value={url}
                onChangeText={(text) => updateLink(index, text, linkNames[index])}
              />
              <TextInput
                style={[styles.input, styles.linkNameInput]}
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
  linkUrlInput: {
    flex: 1,
  },
  linkNameInput: {
    flex: 1,
    marginLeft: 10,
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
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  actionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
});

export default EditScreen;
