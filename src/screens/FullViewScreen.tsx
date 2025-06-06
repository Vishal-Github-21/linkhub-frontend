import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const FullViewScreen = ({navigation, route}: any) => {
  const {linkid} = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>View Link</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.message}>
          Full View - Link ID: {linkid}
        </Text>
        <Text style={styles.info}>
          This screen would display the complete link page similar to how
          it appears to visitors.
        </Text>
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  message: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  info: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});

export default FullViewScreen;
