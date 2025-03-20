import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { API_URL } from '@env';

const ScanQR = () => {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    // Simulación de carga de datos desde un API
    const fetchData = async () => {
      const response = await fetch(`${API_URL}/noticias`);
      const data = await response.json();
      setNoticias(data);
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.titulo}</Text>
      <Text style={styles.description}>{item.descripcion}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={noticias}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
  },
  title: {
    fontSize: 18,
  },
  description: {
    marginTop: 5,
  },
});

export default ScanQR;