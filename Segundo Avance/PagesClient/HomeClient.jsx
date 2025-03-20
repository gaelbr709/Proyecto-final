import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity, 
  ImageBackground,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { 
  Text, 
  Button, 
  Card, 
  Avatar, 
  Title, 
  Paragraph,
  Divider,
  Badge
} from 'react-native-paper';
import { Svg, Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../Context/AuthContext';
import config from '../config';

const { width, height } = Dimensions.get('window');

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

const statusMap = {
  pendiente: { color: theme.colors.pending, label: 'Pendiente' },
  aceptada: { color: theme.colors.primary, label: 'Aceptada' },
  'en camino': { color: theme.colors.inTransit, label: 'En Camino' },
  completada: { color: theme.colors.completed, label: 'Completada' },
  cancelada: { color: theme.colors.cancelled, label: 'Cancelada' },
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getCurrentStatus = (historialOrdenes) => {
  if (!historialOrdenes || historialOrdenes.length === 0) return 'pendiente';
  
  const sortedHistory = [...historialOrdenes].sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  );
  
  return sortedHistory[0].estatus;
};

const Home = ({ navigation }) => {
  const { username, userToken } = useContext(AuthContext);
  const [userName, setUserName] = useState('Cliente');
  const [activeOrders, setActiveOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  

  const fetchUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const storedUserName = username || await AsyncStorage.getItem('userName');
      if (storedUserName) {
        setUserName(storedUserName);
      }
      
      return userId;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const userId = await fetchUserData();
      
      if (!userId || !userToken) {
        console.log('Missing user ID or token');
        setLoading(false);
        return;
      }
      const response = await axios.get(`${config.API_URL}/ordenes/usuario/${userId}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (response.data && Array.isArray(response.data)) {
        const orders = response.data;
        
        let active = 0;
        let completed = 0;
        
        orders.forEach(order => {
          const status = getCurrentStatus(order.historial_ordenes);
          if (['completada', 'cancelada'].includes(status)) {
            completed++;
          } else {
            active++;
          }
        });
        
        setActiveOrders(active);
        setCompletedOrders(completed);
        
        const sorted = [...orders].sort((a, b) => 
          new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
        );
        
        setRecentOrders(sorted.slice(0, 5));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, [userToken]);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.accent} />
      
      {/* Top Wave Decoration */}
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
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>¡Bienvenido!</Text>
            <Text style={styles.nameText}>{userName}</Text>
          </View>
          <Avatar.Image 
            size={60} 
            source={{ uri: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userName) + '&background=2f5f2c&color=fff' }} 
            style={styles.avatar}
          />
        </View>
        
        {/* Order Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => navigation.navigate('Ordenes', { tab: 'pending' })}
          >
            <MaterialCommunityIcons name="truck-delivery" size={32} color={theme.colors.primary} />
            <Text style={styles.statNumber}>{activeOrders}</Text>
            <Text style={styles.statLabel}>Por Entregar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.statCard}
            onPress={() => navigation.navigate('Ordenes', { tab: 'completed' })}
          >
            <MaterialCommunityIcons name="package-variant-closed-check" size={32} color={theme.colors.primary} />
            <Text style={styles.statNumber}>{completedOrders}</Text>
            <Text style={styles.statLabel}>Completados</Text>
          </TouchableOpacity>
        </View>
        
        {/* Main Action Card */}
        <Card style={styles.mainActionCard}>
          <ImageBackground
            source={{ uri: 'https://img.freepik.com/free-photo/delivery-concept-handsome-african-american-delivery-man_1157-34999.jpg' }}
            style={styles.cardBackground}
            imageStyle={{ borderRadius: 12, opacity: 0.2 }}
          >
            <Card.Content style={styles.mainCardContent}>
              <Title style={styles.mainCardTitle}>¿Necesitas enviar algo hoy?</Title>
              <Paragraph style={styles.mainCardText}>
                Realiza un nuevo pedido y nuestros mensajeros lo recogerán en minutos
              </Paragraph>
              <Button 
                mode="contained" 
                style={styles.mainCardButton}
                labelStyle={{ color: 'white', fontWeight: 'bold' }}
                onPress={() => navigation.navigate('NewOrder')}
              >
                Hacer un Pedido
              </Button>
            </Card.Content>
          </ImageBackground>
        </Card>
        
        {/* Recent Orders Section */}
        <View style={styles.recentOrdersHeader}>
          <Text style={styles.sectionTitle}>Pedidos Recientes</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MisPedidos')}>
            <Text style={styles.viewAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Cargando pedidos...</Text>
          </View>
        ) : (
          <>
            {recentOrders.length === 0 ? (
              <View style={styles.emptyOrdersContainer}>
                <MaterialCommunityIcons 
                  name="package-variant" 
                  size={60} 
                  color={theme.colors.accent}
                  style={{ opacity: 0.5 }}
                />
                <Text style={styles.emptyOrdersText}>
                  No tienes pedidos recientes
                </Text>
                <Button 
                  mode="contained" 
                  style={styles.createOrderButton}
                  onPress={() => navigation.navigate('NewOrder')}
                >
                  Crear Primer Pedido
                </Button>
              </View>
            ) : (
              recentOrders.map((order) => {
                const currentStatus = getCurrentStatus(order.historial_ordenes);
                const statusInfo = statusMap[currentStatus] || { color: '#999', label: 'Desconocido' };
                
                return (
                  <Card 
                    key={order.id} 
                    style={styles.orderCard}
                    onPress={() => navigation.navigate('Ordenes', { 
                      selectedOrderId: order.id,
                      showDetails: true
                    })}
                  >
                    
                    <Card.Content>
                      <View style={styles.orderHeader}>
                        <View>
                          <Text style={styles.orderNumber}>{order.identificador}</Text>
                          <Text style={styles.orderDate}>{formatDate(order.fecha_creacion)}</Text>
                        </View>
                        <Badge style={{ backgroundColor: statusInfo.color }}>
                          {statusInfo.label}
                        </Badge>
                      </View>
                      <Divider style={{ marginVertical: 10 }} />
                      <View style={styles.orderDetails}>
                        <MaterialCommunityIcons name="package-variant" size={24} color={theme.colors.accent} />
                        <View style={{ marginLeft: 10, flex: 1 }}>
                          <Text style={styles.orderItemName}>
                            {order.cargamentos.descripcion || 'Paquete'}
                          </Text>
                          <Text style={styles.orderItemDescription}>
                            {currentStatus === 'completada' 
                              ? `Entregado: ${formatDate(order.fecha_entrega_real || order.fecha_entrega_estimada)}` 
                              : `Entrega estimada: ${formatDate(order.fecha_entrega_estimada)}`}
                          </Text>
                        </View>
                        <MaterialCommunityIcons 
                          name="chevron-right" 
                          size={24} 
                          color={theme.colors.accent}
                        />
                      </View>
                    </Card.Content>
                  </Card>
                );
              })
            )}
          </>
        )}
        
        {/* Bottom Spacing */}
        <View style={{ height: 30 }} />
      </ScrollView>
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('NewOrder')}
      >
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: height * 0.08,
    marginBottom: 20,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.accent,
  },
  avatar: {
    backgroundColor: theme.colors.accent,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.accent,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 4,
  },
  mainActionCard: {
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
    elevation: 4,
  },
  cardBackground: {
    padding: 16,
    height: 180,
    justifyContent: 'center',
  },
  mainCardContent: {
    alignItems: 'flex-start',
  },
  mainCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.accent,
    marginBottom: 8,
  },
  mainCardText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 16,
    maxWidth: '80%',
  },
  mainCardButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  recentOrdersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.accent,
  },
  viewAllText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.accent,
  },
  emptyOrdersContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyOrdersText: {
    fontSize: 16,
    color: theme.colors.accent,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  createOrderButton: {
    backgroundColor: theme.colors.primary,
  },
  orderCard: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.accent,
  },
  orderDate: {
    fontSize: 12,
    color: theme.colors.text,
    opacity: 0.7,
  },
  orderDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  orderItemDescription: {
    fontSize: 12,
    color: theme.colors.text,
    opacity: 0.7,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: theme.colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default Home;