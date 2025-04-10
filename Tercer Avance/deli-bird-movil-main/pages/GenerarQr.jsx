import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';
import { config } from '../config';

const GenerarQr = () => {
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.API_URL}/cargamentos/1`); // Obtén los datos de la API
        const cargamento = response.data;
        const textoQR = `ID: ${cargamento.id}, Descripción: ${cargamento.descripcion}`; // Formatea el texto
        setQrValue(textoQR);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {qrValue ? (
        <View style={styles.qrContainer}>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default GenerarQr;