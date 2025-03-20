import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions,
  Alert,
  Animated
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  ProgressBar,
  Headline,
  Subheading,
  IconButton,
  Surface,
  Divider,
  Caption,
  Portal,
  Dialog,
  ActivityIndicator
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
const { width, height } = Dimensions.get('window');
import { AuthContext } from '../Context/AuthContext';
import config from '../config';
//import AsyncStorage from '@react-native-async-storage/async-storage';

//const id = await AsyncStorage.getItem('userId');
const theme = {
  colors: {
    primary: '#6ec341',
    accent: '#2f5f2c',
    background: '#f0f8ed',
    surface: '#FFFFFF',
    text: '#333333',
    error: '#B00020',
  },
};

const NewOrder = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    creado_por: 9,
    nombre_completo: '',
    email: '',
    telefono: '',
    cp: '',
    calle: '',
    numero_exterior: '',
    numero_interior: '',
    colonia: '',
    descripcion: '',
    peso: '',
    largo: '',
    ancho: '',
    alto: ''
  });
  const { userToken, userRol,userid } = useContext(AuthContext);
console.log('iduser'+ userid);
  const [errors, setErrors] = useState({});
  

  const progress = (currentStep + 1) / 2;

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.nombre_completo) newErrors.nombre_completo = 'El nombre es requerido';
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.telefono) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.cp) newErrors.cp = 'El código postal es requerido';
    if (!formData.calle) newErrors.calle = 'La calle es requerida';
    if (!formData.numero_exterior) newErrors.numero_exterior = 'El número exterior es requerido';
    if (!formData.colonia) newErrors.colonia = 'La colonia es requerida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.descripcion) newErrors.descripcion = 'La descripción es requerida';
    if (!formData.peso) {
      newErrors.peso = 'El peso es requerido';
    } else if (isNaN(parseFloat(formData.peso))) {
      newErrors.peso = 'El peso debe ser un número';
    }
    if (!formData.largo) {
      newErrors.largo = 'El largo es requerido';
    } else if (isNaN(parseFloat(formData.largo))) {
      newErrors.largo = 'El largo debe ser un número';
    }
    if (!formData.ancho) {
      newErrors.ancho = 'El ancho es requerido';
    } else if (isNaN(parseFloat(formData.ancho))) {
      newErrors.ancho = 'El ancho debe ser un número';
    }
    if (!formData.alto) {
      newErrors.alto = 'El alto es requerido';
    } else if (isNaN(parseFloat(formData.alto))) {
      newErrors.alto = 'El alto debe ser un número';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleNext = () => {
    if (currentStep === 0) {
      if (validateStep1()) {
        animateTransition(() => {
          setCurrentStep(1);
        });
      }
    }
  };
  

  const handleBack = () => {
    if (currentStep === 1) {
      animateTransition(() => {
        setCurrentStep(0);
      });
    } else {
      navigation.goBack();
    }
  };
  
  // Animate transition between steps
  const animateTransition = (callback) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: currentStep === 0 ? width : -width,
        duration: 0,
        useNativeDriver: true,
      })
    ]).start(() => {
      callback();
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    });
  };
  
  const handleSubmit = async () => {
    if (validateStep2()) {
      setIsLoading(true);
      
      try {
        const dataToSubmit = {
          ...formData,
          peso: parseFloat(formData.peso),
          largo: parseFloat(formData.largo),
          ancho: parseFloat(formData.ancho),
          alto: parseFloat(formData.alto)
        };
        
        const response = await axios.post(
          config.API_URL+'/ordenes/cliente', 
          dataToSubmit
        );
        
        console.log('Order created successfully:', response.data);

        setIsLoading(false);
        setShowSuccess(true);
        
        setTimeout(() => {
          setShowSuccess(false);
          navigation.navigate('Inicio');
        }, 2000);
        
      } catch (error) {
        console.error('Error creating order:', error);
        setIsLoading(false);
        
        Alert.alert(
          'Error',
          'No se pudo crear el pedido. Por favor intenta nuevamente.',
          [{ text: 'OK' }]
        );
      }
    }
  };
  
  const renderStepIndicator = () => {
    return (
      <View style={styles.stepIndicatorContainer}>
        <View style={styles.stepRow}>
          <View style={[styles.stepCircle, currentStep >= 0 ? styles.activeStep : {}]}>
            <Text style={[styles.stepNumber, currentStep >= 0 ? styles.activeStepText : {}]}>1</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={[styles.stepCircle, currentStep >= 1 ? styles.activeStep : {}]}>
            <Text style={[styles.stepNumber, currentStep >= 1 ? styles.activeStepText : {}]}>2</Text>
          </View>
        </View>
        <View style={styles.stepLabelRow}>
          <Text style={[styles.stepLabel, currentStep >= 0 ? styles.activeStepLabel : {}]}>
            Dirección de envío
          </Text>
          <Text style={[styles.stepLabel, currentStep >= 1 ? styles.activeStepLabel : {}]}>
            Descripción del paquete
          </Text>
        </View>
        <ProgressBar 
          progress={progress} 
          color={theme.colors.primary} 
          style={styles.progressBar} 
        />
      </View>
    );
  };
  
  // Render shipping address form (step 1)
  const renderAddressForm = () => {
    return (
      <Animated.View 
        style={[
          styles.formContainer, 
          { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }
        ]}
      >
        <Headline style={styles.formTitle}>¡Vamos a comenzar con tu envío!</Headline>
        <Subheading style={styles.formSubtitle}>
          Cuéntanos a dónde debemos llevar tu paquete
        </Subheading>
        
        <Surface style={styles.formCard}>
          <TextInput
            label="Nombre completo"
            value={formData.nombre_completo}
            onChangeText={(text) => handleChange('nombre_completo', text)}
            style={styles.input}
            mode="outlined"
            outlineColor={theme.colors.primary}
            activeOutlineColor={theme.colors.accent}
            error={!!errors.nombre_completo}
          />
          {errors.nombre_completo && <Caption style={styles.errorText}>{errors.nombre_completo}</Caption>}
          
          <View style={styles.rowInputs}>
            <View style={styles.inputHalf}>
              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                style={styles.input}
                mode="outlined"
                outlineColor={theme.colors.primary}
                activeOutlineColor={theme.colors.accent}
                keyboardType="email-address"
                error={!!errors.email}
              />
              {errors.email && <Caption style={styles.errorText}>{errors.email}</Caption>}
            </View>
            
            <View style={styles.inputHalf}>
              <TextInput
                label="Teléfono"
                value={formData.telefono}
                onChangeText={(text) => handleChange('telefono', text)}
                style={styles.input}
                mode="outlined"
                outlineColor={theme.colors.primary}
                activeOutlineColor={theme.colors.accent}
                keyboardType="phone-pad"
                error={!!errors.telefono}
              />
              {errors.telefono && <Caption style={styles.errorText}>{errors.telefono}</Caption>}
            </View>
          </View>
          
          <Divider style={styles.divider} />
          <Caption style={styles.sectionCaption}>Dirección</Caption>
          
          <View style={styles.rowInputs}>
            <View style={styles.inputHalf}>
              <TextInput
                label="Código Postal"
                value={formData.cp}
                onChangeText={(text) => handleChange('cp', text)}
                style={styles.input}
                mode="outlined"
                outlineColor={theme.colors.primary}
                activeOutlineColor={theme.colors.accent}
                keyboardType="number-pad"
                error={!!errors.cp}
              />
              {errors.cp && <Caption style={styles.errorText}>{errors.cp}</Caption>}
            </View>
            
            <View style={styles.inputHalf}>
              <TextInput
                label="Colonia"
                value={formData.colonia}
                onChangeText={(text) => handleChange('colonia', text)}
                style={styles.input}
                mode="outlined"
                outlineColor={theme.colors.primary}
                activeOutlineColor={theme.colors.accent}
                error={!!errors.colonia}
              />
              {errors.colonia && <Caption style={styles.errorText}>{errors.colonia}</Caption>}
            </View>
          </View>
          
          <TextInput
            label="Calle"
            value={formData.calle}
            onChangeText={(text) => handleChange('calle', text)}
            style={styles.input}
            mode="outlined"
            outlineColor={theme.colors.primary}
            activeOutlineColor={theme.colors.accent}
            error={!!errors.calle}
          />
          {errors.calle && <Caption style={styles.errorText}>{errors.calle}</Caption>}
          
          <View style={styles.rowInputs}>
            <View style={styles.inputHalf}>
              <TextInput
                label="Número Exterior"
                value={formData.numero_exterior}
                onChangeText={(text) => handleChange('numero_exterior', text)}
                style={styles.input}
                mode="outlined"
                outlineColor={theme.colors.primary}
                activeOutlineColor={theme.colors.accent}
                error={!!errors.numero_exterior}
              />
              {errors.numero_exterior && <Caption style={styles.errorText}>{errors.numero_exterior}</Caption>}
            </View>
            
            <View style={styles.inputHalf}>
              <TextInput
                label="Número Interior (opcional)"
                value={formData.numero_interior}
                onChangeText={(text) => handleChange('numero_interior', text)}
                style={styles.input}
                mode="outlined"
                outlineColor={theme.colors.primary}
                activeOutlineColor={theme.colors.accent}
              />
            </View>
          </View>
        </Surface>
      </Animated.View>
    );
  };
  
  const renderPackageForm = () => {
    return (
      <Animated.View 
        style={[
          styles.formContainer, 
          { opacity: fadeAnim, transform: [{ translateX: slideAnim }] }
        ]}
      >
        <Headline style={styles.formTitle}>¡Cuéntanos sobre tu paquete!</Headline>
        <Subheading style={styles.formSubtitle}>
          Necesitamos algunos detalles para brindarte el mejor servicio
        </Subheading>
        
        <Surface style={styles.formCard}>
          <TextInput
            label="Descripción del paquete"
            value={formData.descripcion}
            onChangeText={(text) => handleChange('descripcion', text)}
            style={styles.input}
            mode="outlined"
            outlineColor={theme.colors.primary}
            activeOutlineColor={theme.colors.accent}
            multiline
            numberOfLines={3}
            error={!!errors.descripcion}
          />
          {errors.descripcion && <Caption style={styles.errorText}>{errors.descripcion}</Caption>}
          
          <View style={styles.packageIconContainer}>
            <MaterialCommunityIcons name="package-variant" size={60} color={theme.colors.primary} />
            <Caption style={styles.packageHint}>
              Proporciona las medidas exactas para un cálculo preciso
            </Caption>
          </View>
          
          <Divider style={styles.divider} />
          <Caption style={styles.sectionCaption}>Dimensiones y Peso</Caption>
          
          <View style={styles.dimensionsContainer}>
            <View style={styles.dimensionItem}>
              <TextInput
                label="Peso (kg)"
                value={formData.peso}
                onChangeText={(text) => handleChange('peso', text)}
                style={styles.dimensionInput}
                mode="outlined"
                outlineColor={theme.colors.primary}
                activeOutlineColor={theme.colors.accent}
                keyboardType="decimal-pad"
                error={!!errors.peso}
                right={<TextInput.Affix text="kg" />}
              />
              {errors.peso && <Caption style={styles.errorText}>{errors.peso}</Caption>}
            </View>
          </View>
          
          <View style={styles.dimensionsRow}>
            <View style={styles.dimensionItem}>
              <TextInput
                label="Largo"
                value={formData.largo}
                onChangeText={(text) => handleChange('largo', text)}
                style={styles.dimensionInput}
                mode="outlined"
                outlineColor={theme.colors.primary}
                activeOutlineColor={theme.colors.accent}
                keyboardType="decimal-pad"
                error={!!errors.largo}
                right={<TextInput.Affix text="cm" />}
              />
              {errors.largo && <Caption style={styles.errorText}>{errors.largo}</Caption>}
            </View>
            
            <View style={styles.dimensionItem}>
              <TextInput
                label="Ancho"
                value={formData.ancho}
                onChangeText={(text) => handleChange('ancho', text)}
                style={styles.dimensionInput}
                mode="outlined"
                outlineColor={theme.colors.primary}
                activeOutlineColor={theme.colors.accent}
                keyboardType="decimal-pad"
                error={!!errors.ancho}
                right={<TextInput.Affix text="cm" />}
              />
              {errors.ancho && <Caption style={styles.errorText}>{errors.ancho}</Caption>}
            </View>
            
            <View style={styles.dimensionItem}>
              <TextInput
                label="Alto"
                value={formData.alto}
                onChangeText={(text) => handleChange('alto', text)}
                style={styles.dimensionInput}
                mode="outlined"
                outlineColor={theme.colors.primary}
                activeOutlineColor={theme.colors.accent}
                keyboardType="decimal-pad"
                error={!!errors.alto}
                right={<TextInput.Affix text="cm" />}
              />
              {errors.alto && <Caption style={styles.errorText}>{errors.alto}</Caption>}
            </View>
          </View>
        </Surface>
      </Animated.View>
    );
  };
  
  // Success dialog
  const renderSuccessDialog = () => {
    return (
      <Portal>
        <Dialog visible={showSuccess} dismissable={false}>
          <Dialog.Content>
            <View style={styles.successContainer}>
              <MaterialCommunityIcons name="check-circle" size={60} color={theme.colors.primary} />
              <Text style={styles.successText}>¡Pedido agregado!</Text>
              <Text style={styles.successSubtext}>Redirigiendo a inicio...</Text>
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
    );
  };
  
  // Loading dialog
  const renderLoadingDialog = () => {
    return (
      <Portal>
        <Dialog visible={isLoading} dismissable={false}>
          <Dialog.Content>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Procesando pedido...</Text>
            </View>
          </Dialog.Content>
        </Dialog>
      </Portal>
    );
  };
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.topDecoration}>
        <Svg height="100%" width="100%" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={theme.colors.accent} stopOpacity="1" />
              <Stop offset="100%" stopColor={theme.colors.primary} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,224C672,213,768,171,864,149.3C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            fill="url(#grad)"
          />
        </Svg>
      </View>
      
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          color={theme.colors.accent}
          size={24}
          onPress={handleBack}
        />
        <Text style={styles.headerTitle}>Nuevo Pedido</Text>
        <View style={{ width: 40 }} />
      </View>
      
      {renderStepIndicator()}
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentStep === 0 ? renderAddressForm() : renderPackageForm()}
      </ScrollView>
      
      <Surface style={styles.footer}>
        {currentStep === 0 ? (
          <Button
            mode="contained"
            onPress={handleNext}
            style={styles.actionButton}
            labelStyle={styles.buttonLabel}
            icon="arrow-right"
            contentStyle={{ flexDirection: 'row-reverse' }}
          >
            Siguiente
          </Button>
        ) : (
          <View style={styles.footerButtons}>
            <Button
              mode="outlined"
              onPress={handleBack}
              style={[styles.actionButton, styles.backButton]}
              labelStyle={[styles.buttonLabel, { color: theme.colors.accent }]}
              icon="arrow-left"
            >
              Atrás
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.actionButton}
              labelStyle={styles.buttonLabel}
              disabled={isLoading}
              icon="check"
              contentStyle={{ flexDirection: 'row-reverse' }}
            >
              Crear Pedido
            </Button>
          </View>
        )}
      </Surface>
      
      {renderLoadingDialog()}
      {renderSuccessDialog()}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  topDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.accent,
  },
  stepIndicatorContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: theme.colors.primary,
  },
  stepNumber: {
    color: '#757575',
    fontWeight: 'bold',
  },
  activeStepText: {
    color: 'white',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
  },
  stepLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepLabel: {
    fontSize: 12,
    color: '#757575',
    width: '45%',
    textAlign: 'center',
  },
  activeStepLabel: {
    color: theme.colors.accent,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  formContainer: {
    padding: 16,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.accent,
    textAlign: 'center',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  formCard: {
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
  },
  divider: {
    marginVertical: 16,
  },
  sectionCaption: {
    fontSize: 14,
    color: theme.colors.accent,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  errorText: {
    color: theme.colors.error,
    marginTop: -8,
    marginBottom: 8,
  },
  packageIconContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  packageHint: {
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  dimensionsContainer: {
    marginBottom: 12,
  },
  dimensionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dimensionItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  dimensionInput: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 8,
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 4,
    backgroundColor: theme.colors.primary,
  },
  backButton: {
    borderColor: theme.colors.accent,
    marginRight: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 15,
    fontSize: 16,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  successText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.accent,
    marginTop: 16,
  },
  successSubtext: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 8,
  }
});

export default NewOrder;