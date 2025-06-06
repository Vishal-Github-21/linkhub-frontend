import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {BACKEND_URL} from '../utils/config';
import {getItem, removeItem} from '../utils/storage';

interface Link {
  linkid: string;
  name: string;
  views: number;
  published: boolean;
  lastupdated: string;
}

const DashboardScreen = ({navigation}: any) => {
  const [data, setData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  });

  const fetchDashboardData = async () => {
    try {
      const token = await getItem('token');
      
      if (!token) {
        navigation.replace('Auth', {isSignUp: false});
        return;
      }

      const response = await fetch(`${BACKEND_URL}/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });

      const result = await response.json();

      if (result.status === 'failed') {
        navigation.replace('Auth', {isSignUp: false});
      } else {
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Alert.alert('Error', 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await removeItem('token');
    navigation.replace('Home');
  };

  const filteredLinks = data?.user?.userLinks?.filter((link: Link) =>
    link.name.toLowerCase().includes(searchQuery.toLowerCase()),
  ) || [];

  const renderLinkCard = ({item}: {item: Link}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Edit', {linkid: item.linkid})}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <View style={[styles.statusBadge, item.published && styles.publishedBadge]}>
          <Text style={styles.statusText}>
            {item.published ? 'Published' : 'Draft'}
          </Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.viewsContainer}>
          <Icon name="eye" size={16} color="#666" />
          <Text style={styles.viewsText}>{item.views || 0} views</Text>
        </View>
        <Text style={styles.dateText}>
          Updated: {new Date(item.lastupdated).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#512da8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate('Profile')}>
            <Icon name="user-circle" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Create Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('Create')}>
        <Icon name="plus" size={20} color="#fff" />
        <Text style={styles.createButtonText}>Create New Link</Text>
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={18} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Links"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Links List */}
      <View style={styles.linksContainer}>
        <Text style={styles.sectionTitle}>Your Links</Text>
        {filteredLinks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="link" size={50} color="#ccc" />
            <Text style={styles.emptyText}>No links found</Text>
            <Text style={styles.emptySubtext}>
              Create your first link to get started
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredLinks}
            renderItem={renderLinkCard}
            keyExtractor={(item) => item.linkid}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={24} color="#512da8" />
          <Text style={[styles.navText, styles.activeNavText]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile')}>
          <Icon name="user" size={24} color="#666" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleLogout}>
          <Icon name="sign-out" size={24} color="#666" />
          <Text style={styles.navText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#512da8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0,
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: '#512da8',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  linksContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  listContent: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  publishedBadge: {
    backgroundColor: '#28a745',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewsText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  dateText: {
    color: '#999',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 10,
    paddingBottom: 25,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  activeNavText: {
    color: '#512da8',
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
