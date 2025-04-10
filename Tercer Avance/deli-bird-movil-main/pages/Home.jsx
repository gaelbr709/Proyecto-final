// import React, { useState } from 'react';
// import { View, StyleSheet, Dimensions, StatusBar, ScrollView, Alert } from 'react-native';
// import { Text, Button, Card, TextInput, Portal, Dialog, ActivityIndicator } from 'react-native-paper';
// import { Svg, Circle, Path } from 'react-native-svg';

// const { width, height } = Dimensions.get('window');

// const theme = {
//   colors: {
//     primary: '#6ec341',
//     accent: '#2f5f2c',
//     background: '#f0f8ed',
//     surface: '#FFFFFF',
//     text: '#333333',
//   },
// };

// const NewOrderForm = ({ onSubmit, onCancel }) => {
//   const [formData, setFormData] = useState({
//     creado_por: 1,
//     nombre_completo: '',
//     email: '',
//     telefono: '',
//     cp: '',
//     calle: '',
//     numero_exterior: '',
//     numero_interior: '',
//     colonia: ''
//   });
  
//   const [errors, setErrors] = useState({});
  
//   const handleChange = (field, value) => {
//     setFormData({
//       ...formData,
//       [field]: value
//     });
    
//     if (errors[field]) {
//       setErrors({
//         ...errors,
//         [field]: null
//       });
//     }
//   };
  
//   const validate = () => {
//     const newErrors = {};
    
//     if (!formData.nombre_completo) newErrors.nombre_completo = 'El nombre es requerido';
//     if (!formData.email) newErrors.email = 'El email es requerido';
//     else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
//     if (!formData.telefono) newErrors.telefono = 'El teléfono es requerido';
//     if (!formData.cp) newErrors.cp = 'El código postal es requerido';
//     if (!formData.calle) newErrors.calle = 'La calle es requerida';
//     if (!formData.numero_exterior) newErrors.numero_exterior = 'El número exterior es requerido';
//     if (!formData.colonia) newErrors.colonia = 'La colonia es requerida';
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };
  
//   const handleSubmit = () => {
//     if (validate()) {
//       onSubmit(formData);
//     }
//   };
  
//   return (
//     <ScrollView style={styles.formContainer}>
//       <Text style={styles.formTitle}>Nueva Orden</Text>
      
//       <TextInput
//         label="Nombre Completo"
//         value={formData.nombre_completo}
//         onChangeText={(text) => handleChange('nombre_completo', text)}
//         style={styles.input}
//         error={!!errors.nombre_completo}
//       />
//       {errors.nombre_completo && <Text style={styles.errorText}>{errors.nombre_completo}</Text>}
      
//       <TextInput
//         label="Email"
//         value={formData.email}
//         onChangeText={(text) => handleChange('email', text)}
//         style={styles.input}
//         keyboardType="email-address"
//         error={!!errors.email}
//       />
//       {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      
//       <TextInput
//         label="Teléfono"
//         value={formData.telefono}
//         onChangeText={(text) => handleChange('telefono', text)}
//         style={styles.input}
//         keyboardType="phone-pad"
//         error={!!errors.telefono}
//       />
//       {errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
      
//       <TextInput
//         label="Código Postal"
//         value={formData.cp}
//         onChangeText={(text) => handleChange('cp', text)}
//         style={styles.input}
//         keyboardType="number-pad"
//         error={!!errors.cp}
//       />
//       {errors.cp && <Text style={styles.errorText}>{errors.cp}</Text>}
      
//       <TextInput
//         label="Calle"
//         value={formData.calle}
//         onChangeText={(text) => handleChange('calle', text)}
//         style={styles.input}
//         error={!!errors.calle}
//       />
//       {errors.calle && <Text style={styles.errorText}>{errors.calle}</Text>}
      
//       <TextInput
//         label="Número Exterior"
//         value={formData.numero_exterior}
//         onChangeText={(text) => handleChange('numero_exterior', text)}
//         style={styles.input}
//         error={!!errors.numero_exterior}
//       />
//       {errors.numero_exterior && <Text style={styles.errorText}>{errors.numero_exterior}</Text>}
      
//       <TextInput
//         label="Número Interior (opcional)"
//         value={formData.numero_interior}
//         onChangeText={(text) => handleChange('numero_interior', text)}
//         style={styles.input}
//       />
      
//       <TextInput
//         label="Colonia"
//         value={formData.colonia}
//         onChangeText={(text) => handleChange('colonia', text)}
//         style={styles.input}
//         error={!!errors.colonia}
//       />
//       {errors.colonia && <Text style={styles.errorText}>{errors.colonia}</Text>}
      
//       <View style={styles.buttonContainer}>
//         <Button 
//           mode="outlined" 
//           onPress={onCancel}
//           style={styles.cancelButton}
//           labelStyle={{ color: theme.colors.accent }}
//         >
//           Cancelar
//         </Button>
//         <Button 
//           mode="contained" 
//           onPress={handleSubmit}
//           style={styles.submitButton}
//           labelStyle={{ color: 'white' }}
//         >
//           Crear Orden
//         </Button>
//       </View>
//     </ScrollView>
//   );
// };

// const NewShipmentForm = ({ onSubmit, onCancel }) => {
//   const [formData, setFormData] = useState({
//     orden_envio_id: 1,
//     codigo_qr: '',
//     descripcion: '',
//     peso: '',
//     dimensiones: '',
//     almacen_id: 2
//   });
  
//   const [errors, setErrors] = useState({});
  
//   const handleChange = (field, value) => {
//     setFormData({
//       ...formData,
//       [field]: value
//     });
    
//     if (errors[field]) {
//       setErrors({
//         ...errors,
//         [field]: null
//       });
//     }
//   };
  
//   const validate = () => {
//     const newErrors = {};
    
//     if (!formData.codigo_qr) newErrors.codigo_qr = 'El código QR es requerido';
//     if (!formData.descripcion) newErrors.descripcion = 'La descripción es requerida';
//     if (!formData.peso) newErrors.peso = 'El peso es requerido';
//     else if (isNaN(parseFloat(formData.peso))) newErrors.peso = 'El peso debe ser un número';
//     if (!formData.dimensiones) newErrors.dimensiones = 'Las dimensiones son requeridas';
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };
  
//   const handleSubmit = () => {
//     if (validate()) {
//       const submissionData = {
//         ...formData,
//         peso: parseFloat(formData.peso)
//       };
//       onSubmit(submissionData);
//     }
//   };
  
//   return (
//     <ScrollView style={styles.formContainer}>
//       <Text style={styles.formTitle}>Nuevo Cargamento</Text>
      
//       <TextInput
//         label="Código QR"
//         value={formData.codigo_qr}
//         onChangeText={(text) => handleChange('codigo_qr', text)}
//         style={styles.input}
//         error={!!errors.codigo_qr}
//       />
//       {errors.codigo_qr && <Text style={styles.errorText}>{errors.codigo_qr}</Text>}
      
//       <TextInput
//         label="Descripción"
//         value={formData.descripcion}
//         onChangeText={(text) => handleChange('descripcion', text)}
//         style={styles.input}
//         multiline
//         numberOfLines={3}
//         error={!!errors.descripcion}
//       />
//       {errors.descripcion && <Text style={styles.errorText}>{errors.descripcion}</Text>}
      
//       <TextInput
//         label="Peso (kg)"
//         value={formData.peso}
//         onChangeText={(text) => handleChange('peso', text)}
//         style={styles.input}
//         keyboardType="decimal-pad"
//         error={!!errors.peso}
//       />
//       {errors.peso && <Text style={styles.errorText}>{errors.peso}</Text>}
      
//       <TextInput
//         label="Dimensiones (ej: 30x40x50)"
//         value={formData.dimensiones}
//         onChangeText={(text) => handleChange('dimensiones', text)}
//         style={styles.input}
//         error={!!errors.dimensiones}
//       />
//       {errors.dimensiones && <Text style={styles.errorText}>{errors.dimensiones}</Text>}
      
//       <View style={styles.buttonContainer}>
//         <Button 
//           mode="outlined" 
//           onPress={onCancel}
//           style={styles.cancelButton}
//           labelStyle={{ color: theme.colors.accent }}
//         >
//           Cancelar
//         </Button>
//         <Button 
//           mode="contained" 
//           onPress={handleSubmit}
//           style={styles.submitButton}
//           labelStyle={{ color: 'white' }}
//         >
//           Crear Cargamento
//         </Button>
//       </View>
//     </ScrollView>
//   );
// };

// const Home = ({ navigation }) => {
//   const [currentScreen, setCurrentScreen] = useState('home');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleOptionPress = (option) => {
//     if (option === 'neworder') {
//       setCurrentScreen('neworder');
//     } else if (option === 'newcargamento') {
//       setCurrentScreen('newshipment');
//     } else {
//       console.log(`Navigating to ${option}`);
//       // Aquí puedes agregar la navegación a otras pantallas si es necesario
//     }
//   };
  
//   const handleOrderSubmit = async (data) => {
//     setIsLoading(true);
//     try {
//       // Simular envío de datos a la API
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       console.log('Order data submitted:', data);
//       setIsLoading(false);
//       Alert.alert('Éxito', 'La orden ha sido creada correctamente.', [
//         { text: 'OK', onPress: () => setCurrentScreen('home') }
//       ]);
//     } catch (error) {
//       setIsLoading(false);
//       Alert.alert('Error', 'No se pudo crear la orden. Intente nuevamente.');
//     }
//   };
  
//   const handleShipmentSubmit = async (data) => {
//     setIsLoading(true);
//     try {
//       // Simular envío de datos a la API
//       await new Promise(resolve => setTimeout(resolve, 1000));
//       console.log('Shipment data submitted:', data);
//       setIsLoading(false);
//       Alert.alert('Éxito', 'El cargamento ha sido creado correctamente.', [
//         { text: 'OK', onPress: () => setCurrentScreen('home') }
//       ]);
//     } catch (error) {
//       setIsLoading(false);
//       Alert.alert('Error', 'No se pudo crear el cargamento. Intente nuevamente.');
//     }
//   };

//   const renderContent = () => {
//     switch (currentScreen) {
//       case 'neworder':
//         return (
//           <NewOrderForm 
//             onSubmit={handleOrderSubmit} 
//             onCancel={() => setCurrentScreen('home')} 
//           />
//         );
//       case 'newshipment':
//         return (
//           <NewShipmentForm 
//             onSubmit={handleShipmentSubmit} 
//             onCancel={() => setCurrentScreen('home')} 
//           />
//         );
//       default:
//         return (
//           <View style={styles.content}>
//             <Text style={styles.greeting}>Buen día</Text>
//             <Card style={styles.optionCard} onPress={() => handleOptionPress('AssignedShipments')}>
//               <Card.Content>
//                 <Text style={styles.optionTitle}>Ver Cargamentos Asignados</Text>
//                 <Text style={styles.optionDescription}>Revisa tus envíos pendientes</Text>
//               </Card.Content>
//             </Card>
//             <Card style={styles.optionCard} onPress={() => handleOptionPress('neworder')}>
//               <Card.Content>
//                 <Text style={styles.optionTitle}>Crear nueva Orden</Text>
//                 <Text style={styles.optionDescription}>Crear nueva orden a entregar</Text>
//               </Card.Content>
//             </Card>
//             <Card style={styles.optionCard} onPress={() => handleOptionPress('newcargamento')}>
//               <Card.Content>
//                 <Text style={styles.optionTitle}>Crear cargamento</Text>
//                 <Text style={styles.optionDescription}>Crear cargamento para una orden creada</Text>
//               </Card.Content>
//             </Card>
//             <Card style={styles.optionCard} onPress={() => handleOptionPress('CompletedShipments')}>
//               <Card.Content>
//                 <Text style={styles.optionTitle}>Cargamentos Realizados</Text>
//                 <Text style={styles.optionDescription}>Historial de envíos completados</Text>
//               </Card.Content>
//             </Card>
//             <Card style={styles.optionCard} onPress={() => handleOptionPress('ShipmentStats')}>
//               <Card.Content>
//                 <Text style={styles.optionTitle}>Estadísticas de Envíos</Text>
//                 <Text style={styles.optionDescription}>Analiza tu rendimiento</Text>
//               </Card.Content>
//             </Card>
//           </View>
//         );
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor={theme.colors.accent} />
//       <View style={styles.topDecoration}>
//         <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
//           <Circle cx="100" cy="0" r="80" fill={theme.colors.primary} fillOpacity="0.3" />
//           <Circle cx="0" cy="100" r="60" fill={theme.colors.accent} fillOpacity="0.3" />
//         </Svg>
//       </View>
      
//       {renderContent()}
      
//       <View style={styles.bottomDecoration}>
//         <Svg height="100%" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
//           <Path
//             d="M0 100 C 20 80, 50 80, 100 100 Z"
//             fill={theme.colors.primary}
//             fillOpacity="0.3"
//           />
//         </Svg>
//       </View>
      
//       <Portal>
//         <Dialog visible={isLoading} dismissable={false}>
//           <Dialog.Content>
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="large" color={theme.colors.primary} />
//               <Text style={styles.loadingText}>Procesando...</Text>
//             </View>
//           </Dialog.Content>
//         </Dialog>
//       </Portal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//   },
//   topDecoration: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     height: height * 0.3,
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   greeting: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: theme.colors.accent,
//     textAlign: 'center',
//     marginBottom: 30,
//   },
//   optionCard: {
//     marginBottom: 20,
//     elevation: 4,
//     borderRadius: 10,
//     backgroundColor: theme.colors.surface,
//   },
//   optionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: theme.colors.accent,
//     marginBottom: 5,
//   },
//   optionDescription: {
//     fontSize: 14,
//     color: theme.colors.text,
//   },
//   bottomDecoration: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: height * 0.1,
//   },
//   formContainer: {
//     flex: 1,
//     padding: 20,
//   },
//   formTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: theme.colors.accent,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     marginBottom: 8,
//     backgroundColor: 'white',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 12,
//     marginBottom: 10,
//     marginTop: -5,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//     marginBottom: 40,
//   },
//   cancelButton: {
//     flex: 1,
//     marginRight: 10,
//     borderColor: theme.colors.accent,
//   },
//   submitButton: {
//     flex: 1,
//     marginLeft: 10,
//     backgroundColor: theme.colors.primary,
//   },
//   loadingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   loadingText: {
//     marginLeft: 15,
//     fontSize: 16,
//   },
// });

// export default Home;
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { API_URL } from '@env';

const Home = () => {
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

export default Home;