import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions,
  Alert,
  Image
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Headline,
  Paragraph,
  IconButton,
  Surface,
  HelperText,
  ActivityIndicator,
  Portal,
  Dialog
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

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

const Register = ({ navigation }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [successVisible, setSuccessVisible] = useState(false);
  
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
  
  const validateForm = () => {
    const newErrors = {};
    

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }
    

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      
      try {
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          rol: 'cliente',
          paqueteriaId: 1
        };
        
        const response = await axios.post(
          'http://127.0.0.1:8000/api/users/',
          userData
        );
        
        console.log('Registration successful:', response.data);
        

        setLoading(false);
        setSuccessVisible(true);
        
        setTimeout(() => {
          setSuccessVisible(false);
          navigation.navigate('Login');
        }, 2000);
        
      } catch (error) {
        console.error('Registration error:', error);
        setLoading(false);
        
        if (error.response && error.response.data) {
          if (error.response.data.email) {
            setErrors({
              ...errors,
              email: 'Este correo electrónico ya está registrado'
            });
          } else {
            Alert.alert(
              'Error',
              'No se pudo completar el registro. Por favor intenta nuevamente.',
              [{ text: 'OK' }]
            );
          }
        } else {
          Alert.alert(
            'Error',
            'Ocurrió un error en la conexión. Por favor verifica tu internet e intenta nuevamente.',
            [{ text: 'OK' }]
          );
        }
      }
    }
  };
  
  // Success dialog
  const renderSuccessDialog = () => {
    return (
      <Portal>
        <Dialog visible={successVisible} dismissable={false}>
          <Dialog.Content>
            <View style={styles.successContainer}>
              <MaterialCommunityIcons name="check-circle" size={60} color={theme.colors.primary} />
              <Text style={styles.successText}>¡Registro exitoso!</Text>
              <Text style={styles.successSubtext}>Redirigiendo a inicio de sesión...</Text>
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
          onPress={() => navigation.goBack()}
        />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons 
            name="truck-delivery" 
            size={60} 
            color={theme.colors.primary} 
          />
        </View>
        
        <Headline style={styles.title}>Crear Cuenta</Headline>
        <Paragraph style={styles.subtitle}>
          Regístrate para comenzar a enviar tus paquetes
        </Paragraph>
        
        <Surface style={styles.formCard}>
          <TextInput
            label="Nombre completo"
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
            style={styles.input}
            mode="outlined"
            outlineColor={theme.colors.primary}
            activeOutlineColor={theme.colors.accent}
            error={!!errors.name}
            left={<TextInput.Icon name="account" color={theme.colors.accent} />}
          />
          {errors.name && <HelperText type="error">{errors.name}</HelperText>}
          
          <TextInput
            label="Correo electrónico"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            style={styles.input}
            mode="outlined"
            outlineColor={theme.colors.primary}
            activeOutlineColor={theme.colors.accent}
            keyboardType="email-address"
            autoCapitalize="none"
            error={!!errors.email}
            left={<TextInput.Icon name="email" color={theme.colors.accent} />}
          />
          {errors.email && <HelperText type="error">{errors.email}</HelperText>}
          
          <TextInput
            label="Contraseña"
            value={formData.password}
            onChangeText={(text) => handleChange('password', text)}
            style={styles.input}
            mode="outlined"
            outlineColor={theme.colors.primary}
            activeOutlineColor={theme.colors.accent}
            secureTextEntry={!showPassword}
            error={!!errors.password}
            left={<TextInput.Icon name="lock" color={theme.colors.accent} />}
            right={
              <TextInput.Icon 
                name={showPassword ? "eye-off" : "eye"} 
                onPress={() => setShowPassword(!showPassword)}
                color={theme.colors.accent}
              />
            }
          />
          {errors.password && <HelperText type="error">{errors.password}</HelperText>}
          
          <TextInput
            label="Confirmar contraseña"
            value={formData.confirmPassword}
            onChangeText={(text) => handleChange('confirmPassword', text)}
            style={styles.input}
            mode="outlined"
            outlineColor={theme.colors.primary}
            activeOutlineColor={theme.colors.accent}
            secureTextEntry={!showConfirmPassword}
            error={!!errors.confirmPassword}
            left={<TextInput.Icon name="lock-check" color={theme.colors.accent} />}
            right={
              <TextInput.Icon 
                name={showConfirmPassword ? "eye-off" : "eye"} 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                color={theme.colors.accent}
              />
            }
          />
          {errors.confirmPassword && <HelperText type="error">{errors.confirmPassword}</HelperText>}
          
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.registerButton}
            labelStyle={styles.buttonLabel}
            loading={loading}
            disabled={loading}
          >
            Registrarme
          </Button>
        </Surface>
        
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>¿Ya tienes una cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
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
    paddingTop: 40,
    paddingHorizontal: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.accent,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.8,
  },
  formCard: {
    padding: 20,
    borderRadius: 12,
    elevation: 4,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  registerButton: {
    marginTop: 16,
    paddingVertical: 6,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  loginLink: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginLeft: 4,
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

export default Register;