// import React, { useState, useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { StyleSheet, Image } from 'react-native';
// import { Provider as PaperProvider } from 'react-native-paper';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Login from './components/Login';
// import Home from './pages/Home';
// import ScanQR from './pages/ScanQR';
// import PendingOrders from './pages/PendingOrders';

// const Tab = createBottomTabNavigator();

// const AppContent = () => {


//   useEffect(() => {
//     checkAuthStatus();
    
//   }, []);

//   const checkAuthStatus = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
//       if (token) {
//         setIsAuthenticated(true);
//       }
//     } catch (error) {
//       console.error('Error checking auth status:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.removeItem('userToken');
//       setIsAuthenticated(false);
//     } catch (error) {
//       console.error('Error logging out:', error);
//     }
//   };

//   if (isLoading) {
//     // You might want to show a loading screen here
//     return null;
//   }

//   return (
//     <NavigationContainer>
//       {isAuthenticated ? (
//         <Tab.Navigator
//           screenOptions={({ route }) => ({
//             tabBarIcon: ({ focused, color, size }) => {
//               let iconName;

//               // if (route.name === 'Home') {
//               //   iconName = focused
//               //     ? require('./assets/home_active.png')
//               //     : require('./assets/home_inactive.png');
//               // } else if (route.name === 'Scan Order') {
//               //   iconName = focused
//               //     ? require('./assets/scan_active.png')
//               //     : require('./assets/scan_inactive.png');
//               // } else if (route.name === 'Settings') {
//               //   iconName = focused
//               //     ? require('./assets/settings_active.png')
//               //     : require('./assets/settings_inactive.png');
//               // }

//               // return <Image source={iconName} style={{ width: size, height: size }} />;
//             },
//             tabBarActiveTintColor: 'tomato',
//             tabBarInactiveTintColor: 'gray',
//           })}
//         >
//           <Tab.Screen 
//             name="Home" 
//             component={Home} 
//             options={{ headerShown: false }}
//           />
//           <Tab.Screen name="Scan Order" component={ScanQR} />
//           <Tab.Screen name="Settings" component={PendingOrders} />
//         </Tab.Navigator>
//       ) : (
//         <Login setIsAuthenticated={setIsAuthenticated} />
//       )}
//     </NavigationContainer>
//   );
// };

// const App = () => {
//   return (
//     <PaperProvider>
//       <AppContent />
//     </PaperProvider>
//   );
// };

// export default App;

import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider } from './Context/AuthContext'; // Asegúrate de tener esta importación
import AppContent from './AppContent ';

const App = () => {
  
  return (
    <PaperProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </PaperProvider>
  );
};

export default App;

