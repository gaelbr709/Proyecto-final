
import React, { useState, useEffect, useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './Context/AuthContext';
import Login from './components/Login';
import Home from './pages/Home';
import ScanQR from './pages/ScanQR';
import PendingOrders from './pages/PendingOrders';
import HomeClient from './PagesClient/HomeClient';
import SettingsClient from './PagesClient/SettingsClient';
import NewOrder from './PagesClient/NewOrder';
import { NavigationContainer } from '@react-navigation/native';
import OrderList from './PagesClient/OrderList';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Register from './pages/Register';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const theme = {
  colors: {
    primary: '#6ec341',
    accent: '#2f5f2c',
    background: '#f0f8ed',
    surface: '#FFFFFF',
    text: '#333333',
    pending: '#FFC107',
    inTransit: '#2196F3',
    completed: '#4CAF50',
    cancelled: '#F44336',
  },
};

const AppContent = () => {
  const { isAuthenticated, setIsAuthenticated, setUserToken,setUserid } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [userRol, setUserRol] = useState(null);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const rol = await AsyncStorage.getItem('userRol');
        const id = await AsyncStorage.getItem('userId');
        console.log('Token al iniciar:', token);
        console.log('userid al iniciar:', id);

        if (token) {
          setUserToken(token);
          setUserRol(rol);
          setUserid(id);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error al obtener el token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthStatus();
  }, []); 

  if (isLoading) {
    return null; 
  }


  
const AuthenticatedTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          height: 60,
          borderTopWidth: 0,
          paddingBottom: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          color: theme.colors.text,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Inicio') {
            iconName = 'home-outline';
          } else if (route.name === 'Ordenes') {
            iconName = 'clipboard-list-outline';
          } else if (route.name === 'Cuenta') {
            iconName = 'account-outline';
          } else if (route.name === 'Home') {
            iconName = 'warehouse';
          } else if (route.name === 'Scan Order') {
            iconName = 'qrcode-scan';
          } else if (route.name === 'Settings') {
            iconName = 'cog-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      {userRol === 'personal_carga' ? (
        <>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Escanear Orden" component={ScanQR} /> 
          <Tab.Screen name="Ordenes pendientes" component={PendingOrders} /> 
          <Tab.Screen name="Generar Qr" component={GenerarQr} /> 
          <Tab.Screen
            name="Lista Cargamentos"
            component={CargamentosStack} 
            options={{ headerShown: false }} 
          />
          <Tab.Screen name="Cuenta" component={SettingsClient} />
        </>
      ) : (
        <>
          <Tab.Screen name="Inicio" component={HomeClient} />
          <Tab.Screen name="Ordenes" component={OrderList} />
          <Tab.Screen name="Cuenta" component={SettingsClient} />
        </>
      )}
    </Tab.Navigator>
  );
};

return (
  <NavigationContainer>
    {isAuthenticated ? (
      <Stack.Navigator>
        <Stack.Screen name="HomeTabs" component={AuthenticatedTabs} options={{ headerShown: false }} />
        <Stack.Screen name="NewOrder" component={NewOrder} options={{ headerShown: false }} />
      </Stack.Navigator>
    ) : (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }}/>
      </Stack.Navigator>
    )}
  </NavigationContainer>
);
}

export default AppContent;