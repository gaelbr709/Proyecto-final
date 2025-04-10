import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import axios from 'axios'; 
import { config } from '../config'; 
import QRCode from 'react-native-qrcode-svg'; 

const DetallesCargamento = ({ route }) => {
  const { id } = route.params; // Obtener el ID del cargamento
  const [cargamento, setCargamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrValue, setQrValue] = useState(''); // Estado para el valor del QR

  useEffect(() => {
    const fetchCargamento = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/cargamentos/${id}`);
        setCargamento(response.data);

        // Generar el valor del QR usando los datos del cargamento
        const textoQR = `ID: ${response.data.id}, Descripción: ${response.data.descripcion}`;
        setQrValue(textoQR);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCargamento();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del Cargamento</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>ID: {cargamento.id}</Text>
        <Text style={styles.detail}>Orden de envío ID: {cargamento.orden_envio_id}</Text>
        <Text style={styles.detail}>Descripción: {cargamento.descripcion}</Text>
        <Text style={styles.detail}>Peso: {cargamento.peso} kg</Text>
        <Text style={styles.detail}>Dimensiones: {cargamento.dimensiones}</Text>
        <Text style={styles.detail}>Almacén ID: {cargamento.almacen_id}</Text>
      </View>

      {/* Mostrar el código QR debajo de los detalles */}
      {qrValue ? (
        <View style={styles.qrContainer}>
          <Text style={styles.qrTitle}>Código QR del Cargamento</Text>
          <QRCode
            value={qrValue} // El valor que se convertirá en QR
            size={200} // Tamaño del QR
            color="black" // Color del QR
            backgroundColor="white" // Color de fondo del QR
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  detail: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  qrContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default DetallesCargamento;