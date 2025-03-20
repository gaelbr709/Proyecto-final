import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import {
  Text,
  Card,
  Title,
  Paragraph,
  Badge,
  Divider,
  Chip,
  Searchbar,
  Button,
  Portal,
  Dialog,
  IconButton,
  Surface,
  SegmentedButtons,
  TextInput,
  Caption
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Svg, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';
import { AuthContext } from '../Context/AuthContext';
import { useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const theme = {
  colors: {
    primary: '#6ec341',
    accent: '#2f5f2c',
    background: '#f0f8ed',
    surface: '#FFFFFF',
    text: '#333333',
    error: '#B00020',
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

const OrderList = ({ navigation }) => {
  const { userToken } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('pending');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const route = useRoute();
  useEffect(() => {
    // Check if we have route params to show order details
    if (route?.params?.showDetails && route?.params?.selectedOrderId) {
      const orderId = route.params.selectedOrderId;
      
      // Find the order in our orders array
      const orderToShow = orders.find(order => order.id === orderId);
      
      // If found, show its details
      if (orderToShow) {
        setSelectedOrder(orderToShow);
        setDetailsVisible(true);
      }
    }
  }, [route?.params, orders]);

  // Edit form state
  const [editVisible, setEditVisible] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [editFormData, setEditFormData] = useState({
    nombre_completo: '',
    email: '',
    telefono: '',
    calle: '',
    numero_exterior: '',
    numero_interior: '',
    cp: '',
    colonia: ''
  });
  const [editErrors, setEditErrors] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  

  useEffect(() => {
    if (navigation.route?.params?.showDetails && navigation.route?.params?.selectedOrderId) {
      const orderId = navigation.route.params.selectedOrderId;
      
      // Find the order in our orders array
      const orderToShow = orders.find(order => order.id === orderId);
      
      // If found, show its details
      if (orderToShow) {
        setSelectedOrder(orderToShow);
        setDetailsVisible(true);
      }
    }
  }, [navigation.route?.params, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const id = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        Alert.alert('Error', 'No se encontró token de autenticación');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${config.API_URL}/ordenes/usuario/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      setOrders(response.data);
      filterOrdersByStatus(response.data, selectedTab);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los pedidos. Por favor intenta nuevamente.'
      );
      setLoading(false);
    }
  };
  
  const filterOrdersByStatus = (ordersList, tab) => {
    const filtered = ordersList.filter(order => {
      const currentStatus = getCurrentStatus(order.historial_ordenes);
      
      if (tab === 'pending') {
        if (!['completada', 'cancelada'].includes(currentStatus)) {
          if (searchQuery) {
            return (
              order.identificador.toLowerCase().includes(searchQuery.toLowerCase()) ||
              order.destinatario.nombre_completo.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
          return true;
        }
        return false;
      } else if (tab === 'completed') {
        if (['completada', 'cancelada'].includes(currentStatus)) {
          if (searchQuery) {
            return (
              order.identificador.toLowerCase().includes(searchQuery.toLowerCase()) ||
              order.destinatario.nombre_completo.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
          return true;
        }
        return false;
      }
      return false;
    });
    
    const sortedFiltered = filtered.sort((a, b) => 
      new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
    );
    
    setFilteredOrders(sortedFiltered);
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };
  
  const onChangeSearch = (query) => {
    setSearchQuery(query);
    filterOrdersByStatus(orders, selectedTab);
  };
  
  const onTabChange = (value) => {
    setSelectedTab(value);
    filterOrdersByStatus(orders, value);
  };

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setDetailsVisible(true);
  };
  
  const parseDimensions = (dimensionsString) => {
    try {
      return JSON.parse(dimensionsString);
    } catch (e) {
      return { largo: 0, ancho: 0, alto: 0 };
    }
  };
  

  const handleEditOrder = (order) => {
    const currentStatus = getCurrentStatus(order.historial_ordenes);
    if (currentStatus === 'pendiente') {
      // Set the order to edit
      setEditOrder(order);
      

      setEditFormData({
        nombre_completo: order.destinatario.nombre_completo || '',
        email: order.destinatario.email || '',
        telefono: order.destinatario.telefono || '',
        calle: order.destinatario.direccion.calle || '',
        numero_exterior: order.destinatario.direccion.num_ext || '',
        numero_interior: order.destinatario.direccion.num_int || '',
        cp: order.destinatario.direccion.cp || '',
        colonia: order.destinatario.direccion.colonia || ''
      });
      

      setEditErrors({});

      setEditVisible(true);
      
  
      if (detailsVisible) {
        setDetailsVisible(false);
      }
    } else {
      Alert.alert(
        'No se puede editar',
        'Solo los pedidos en estado pendiente pueden ser editados.'
      );
    }
  };
  

  const handleEditChange = (field, value) => {
    setEditFormData({
      ...editFormData,
      [field]: value
    });

    if (editErrors[field]) {
      setEditErrors({
        ...editErrors,
        [field]: null
      });
    }
  };
  
  const validateEditForm = () => {
    const newErrors = {};
    
    if (!editFormData.nombre_completo) newErrors.nombre_completo = 'El nombre es requerido';
    if (!editFormData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(editFormData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!editFormData.telefono) newErrors.telefono = 'El teléfono es requerido';
    if (!editFormData.cp) newErrors.cp = 'El código postal es requerido';
    if (!editFormData.calle) newErrors.calle = 'La calle es requerida';
    if (!editFormData.numero_exterior) newErrors.numero_exterior = 'El número exterior es requerido';
    if (!editFormData.colonia) newErrors.colonia = 'La colonia es requerida';
    
    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
 
  const handleUpdateOrder = async () => {
    if (validateEditForm() && editOrder) {
      setIsUpdating(true);
      
      try {
        const response = await axios.put(
          `${config.API_URL}/ordenes/v2/${editOrder.id}`, 
          editFormData,
          {
            headers: {
              'Authorization': `Bearer ${userToken}`,
              'Content-Type': 'application/json',
            }
          }
        );
        
        console.log('Order updated successfully:', response.data);
        
        // Show success message
        setIsUpdating(false);
        setUpdateSuccess(true);
        
        // Automatically close and refresh after 2 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
          setEditVisible(false);
          fetchOrders(); // Refresh the order list
        }, 2000);
        
      } catch (error) {
        console.error('Error updating order:', error);
        setIsUpdating(false);
        
        Alert.alert(
          'Error',
          'No se pudo actualizar el pedido. Por favor intenta nuevamente.',
          [{ text: 'OK' }]
        );
      }
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      filterOrdersByStatus(orders, selectedTab);
    }
  }, [searchQuery]);
  
  const renderOrderCard = (order) => {
    const currentStatus = getCurrentStatus(order.historial_ordenes);
    const statusInfo = statusMap[currentStatus] || { color: '#999', label: 'Desconocido' };
    const dimensions = parseDimensions(order.cargamentos.dimensiones);
    const isPending = currentStatus === 'pendiente';
    
    return (
      <Card 
        key={order.id} 
        style={styles.orderCard}
      >
        <Card.Content>
          <View style={styles.orderHeader}>
            <View>
              <Title style={styles.orderNumber}>{order.identificador}</Title>
              <Paragraph style={styles.orderDate}>
                Creado: {formatDate(order.fecha_creacion)}
              </Paragraph>
            </View>
            <Badge style={{ backgroundColor: statusInfo.color }}>
              {statusInfo.label}
            </Badge>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.orderDetails}>
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="account" size={18} color={theme.colors.accent} />
              <Text style={styles.detailText}>
                {order.destinatario.nombre_completo}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="map-marker" size={18} color={theme.colors.accent} />
              <Text style={styles.detailText} numberOfLines={1}>
                {`${order.destinatario.direccion.calle} ${order.destinatario.direccion.num_ext}, ${order.destinatario.direccion.colonia}`}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="package-variant" size={18} color={theme.colors.accent} />
              <Text style={styles.detailText} numberOfLines={1}>
                {order.cargamentos.descripcion}
              </Text>
            </View>
          </View>
          
          <View style={styles.packageInfo}>
            <Chip 
              icon="weight" 
              style={styles.infoChip}
              textStyle={styles.chipText}
            >
              {order.cargamentos.peso} kg
            </Chip>
            <Chip 
              icon="cube-outline" 
              style={styles.infoChip}
              textStyle={styles.chipText}
            >
              {dimensions.largo}×{dimensions.ancho}×{dimensions.alto} cm
            </Chip>
          </View>
          
          <View style={styles.deliveryInfo}>
            <MaterialCommunityIcons 
              name="truck-delivery-outline" 
              size={16} 
              color={theme.colors.primary} 
            />
            <Text style={styles.deliveryText}>
              Entrega estimada: {formatDate(order.fecha_entrega_estimada)}
            </Text>
          </View>
          
          {/* Add card actions with edit button for pending orders */}
          <View style={styles.cardActions}>
            <Button 
              mode="text" 
              onPress={() => showOrderDetails(order)}
              labelStyle={{ color: theme.colors.accent }}
            >
              Detalles
            </Button>
            
            {isPending && (
              <Button 
                mode="text" 
                onPress={() => handleEditOrder(order)}
                labelStyle={{ color: theme.colors.primary }}
                icon="pencil"
              >
                Editar
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };
  
  const renderOrderDetails = () => {
    if (!selectedOrder) return null;
    
    const currentStatus = getCurrentStatus(selectedOrder.historial_ordenes);
    const statusInfo = statusMap[currentStatus] || { color: '#999', label: 'Desconocido' };
    const dimensions = parseDimensions(selectedOrder.cargamentos.dimensiones);
    const isPending = currentStatus === 'pendiente';
    
    return (
      <Portal>
        <Dialog
          visible={detailsVisible}
          onDismiss={() => setDetailsVisible(false)}
          style={styles.detailsDialog}
        >
          <Dialog.Title style={styles.dialogTitle}>
            Detalles del Pedido
          </Dialog.Title>
          <Dialog.Content>
            <View style={styles.dialogHeader}>
              <Title style={styles.dialogOrderNumber}>
                {selectedOrder.identificador}
              </Title>
              <Badge style={{ backgroundColor: statusInfo.color }}>
                {statusInfo.label}
              </Badge>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Información del Destinatario</Text>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Nombre:</Text>
                <Text style={styles.detailValue}>
                  {selectedOrder.destinatario.nombre_completo}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Teléfono:</Text>
                <Text style={styles.detailValue}>
                  {selectedOrder.destinatario.telefono}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>
                  {selectedOrder.destinatario.email}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Dirección de Entrega</Text>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Calle:</Text>
                <Text style={styles.detailValue}>
                  {selectedOrder.destinatario.direccion.calle} {selectedOrder.destinatario.direccion.num_ext}
                  {selectedOrder.destinatario.direccion.num_int ? `, Int. ${selectedOrder.destinatario.direccion.num_int}` : ''}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Colonia:</Text>
                <Text style={styles.detailValue}>
                  {selectedOrder.destinatario.direccion.colonia}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>CP:</Text>
                <Text style={styles.detailValue}>
                  {selectedOrder.destinatario.direccion.cp}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Información del Paquete</Text>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Descripción:</Text>
                <Text style={styles.detailValue}>
                  {selectedOrder.cargamentos.descripcion}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Peso:</Text>
                <Text style={styles.detailValue}>
                  {selectedOrder.cargamentos.peso} kg
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Dimensiones:</Text>
                <Text style={styles.detailValue}>
                  {dimensions.largo} × {dimensions.ancho} × {dimensions.alto} cm
                </Text>
              </View>
              {selectedOrder.cargamentos.codigo_qr && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Código QR:</Text>
                  <Text style={styles.detailValue}>
                    {selectedOrder.cargamentos.codigo_qr}
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Fechas</Text>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Creación:</Text>
                <Text style={styles.detailValue}>
                  {formatDate(selectedOrder.fecha_creacion)}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Entrega Estimada:</Text>
                <Text style={styles.detailValue}>
                  {formatDate(selectedOrder.fecha_entrega_estimada)}
                </Text>
              </View>
            </View>
            
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Historial de Estados</Text>
              {selectedOrder.historial_ordenes.map((historial, index) => (
                <View key={index} style={styles.historyItem}>
                  <Badge 
                    style={{ 
                      backgroundColor: statusMap[historial.estatus]?.color || '#999',
                      alignSelf: 'flex-start'
                    }}
                  >
                    {statusMap[historial.estatus]?.label || 'Desconocido'}
                  </Badge>
                  <Text style={styles.historyDate}>
                    {formatDate(historial.created_at)}
                  </Text>
                </View>
              ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDetailsVisible(false)}>Cerrar</Button>
            
            {/* Add edit button for pending orders */}
            {isPending && (
              <Button 
                mode="outlined" 
                style={{ borderColor: theme.colors.primary }}
                textColor={theme.colors.primary}
                onPress={() => {
                  setDetailsVisible(false);
                  handleEditOrder(selectedOrder);
                }}
                icon="pencil"
              >
                Editar
              </Button>
            )}
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };
  
  // Render edit form dialog
  const renderEditForm = () => {
    if (!editOrder) return null;
    
    return (
      <Portal>
        <Dialog
          visible={editVisible}
          onDismiss={() => !isUpdating && !updateSuccess && setEditVisible(false)}
          style={styles.editDialog}
          dismissable={!isUpdating && !updateSuccess}
        >
          <Dialog.Title style={styles.dialogTitle}>
            Editar Pedido
          </Dialog.Title>
          
          <Dialog.ScrollArea style={styles.scrollArea}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <ScrollView>
                <View style={styles.editFormContent}>
                  <Text style={styles.orderNumber}>{editOrder.identificador}</Text>
                  
                  <Divider style={styles.divider} />
                  <Caption style={styles.sectionCaption}>Datos del destinatario</Caption>
                  
                  <TextInput
                    label="Nombre completo"
                    value={editFormData.nombre_completo}
                    onChangeText={(text) => handleEditChange('nombre_completo', text)}
                    style={styles.input}
                    mode="outlined"
                    outlineColor={theme.colors.primary}
                    activeOutlineColor={theme.colors.accent}
                    error={!!editErrors.nombre_completo}
                  />
                  {editErrors.nombre_completo && <Caption style={styles.errorText}>{editErrors.nombre_completo}</Caption>}
                  
                  <View style={styles.rowInputs}>
                    <View style={styles.inputHalf}>
                      <TextInput
                        label="Email"
                        value={editFormData.email}
                        onChangeText={(text) => handleEditChange('email', text)}
                        style={styles.input}
                        mode="outlined"
                        outlineColor={theme.colors.primary}
                        activeOutlineColor={theme.colors.accent}
                        keyboardType="email-address"
                        error={!!editErrors.email}
                      />
                      {editErrors.email && <Caption style={styles.errorText}>{editErrors.email}</Caption>}
                    </View>
                    
                    <View style={styles.inputHalf}>
                      <TextInput
                        label="Teléfono"
                        value={editFormData.telefono}
                        onChangeText={(text) => handleEditChange('telefono', text)}
                        style={styles.input}
                        mode="outlined"
                        outlineColor={theme.colors.primary}
                        activeOutlineColor={theme.colors.accent}
                        keyboardType="phone-pad"
                        error={!!editErrors.telefono}
                      />
                      {editErrors.telefono && <Caption style={styles.errorText}>{editErrors.telefono}</Caption>}
                    </View>
                  </View>
                  
                  <Divider style={styles.divider} />
                  <Caption style={styles.sectionCaption}>Dirección de entrega</Caption>
                  
                  <View style={styles.rowInputs}>
                    <View style={styles.inputHalf}>
                      <TextInput
                        label="Código Postal"
                        value={editFormData.cp}
                        onChangeText={(text) => handleEditChange('cp', text)}
                        style={styles.input}
                        mode="outlined"
                        outlineColor={theme.colors.primary}
                        activeOutlineColor={theme.colors.accent}
                        keyboardType="number-pad"
                        error={!!editErrors.cp}
                      />
                      {editErrors.cp && <Caption style={styles.errorText}>{editErrors.cp}</Caption>}
                    </View>
                    
                    <View style={styles.inputHalf}>
                      <TextInput
                        label="Colonia"
                        value={editFormData.colonia}
                        onChangeText={(text) => handleEditChange('colonia', text)}
                        style={styles.input}
                        mode="outlined"
                        outlineColor={theme.colors.primary}
                        activeOutlineColor={theme.colors.accent}
                        error={!!editErrors.colonia}
                      />
                      {editErrors.colonia && <Caption style={styles.errorText}>{editErrors.colonia}</Caption>}
                    </View>
                  </View>
                  
                  <TextInput
                    label="Calle"
                    value={editFormData.calle}
                    onChangeText={(text) => handleEditChange('calle', text)}
                    style={styles.input}
                    mode="outlined"
                    outlineColor={theme.colors.primary}
                    activeOutlineColor={theme.colors.accent}
                    error={!!editErrors.calle}
                  />
                  {editErrors.calle && <Caption style={styles.errorText}>{editErrors.calle}</Caption>}
                  
                  <View style={styles.rowInputs}>
                    <View style={styles.inputHalf}>
                      <TextInput
                        label="Número Exterior"
                        value={editFormData.numero_exterior}
                        onChangeText={(text) => handleEditChange('numero_exterior', text)}
                        style={styles.input}
                        mode="outlined"
                        outlineColor={theme.colors.primary}
                        activeOutlineColor={theme.colors.accent}
                        error={!!editErrors.numero_exterior}
                      />
                      {editErrors.numero_exterior && <Caption style={styles.errorText}>{editErrors.numero_exterior}</Caption>}
                    </View>
                    
                    <View style={styles.inputHalf}>
                      <TextInput
                        label="Número Interior (opcional)"
                        value={editFormData.numero_interior}
                        onChangeText={(text) => handleEditChange('numero_interior', text)}
                        style={styles.input}
                        mode="outlined"
                        outlineColor={theme.colors.primary}
                        activeOutlineColor={theme.colors.accent}
                      />
                    </View>
                  </View>
                  
                  <View style={styles.noteContainer}>
                    <MaterialCommunityIcons name="information-outline" size={20} color={theme.colors.accent} />
                    <Text style={styles.noteText}>
                      Solo puedes editar los datos del destinatario y la dirección de entrega para pedidos pendientes.
                    </Text>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </Dialog.ScrollArea>
          
          {/* Show loading or success state */}
          {isUpdating && (
            <Dialog.Content>
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Actualizando pedido...</Text>
              </View>
            </Dialog.Content>
          )}
          
          {updateSuccess && (
            <Dialog.Content>
              <View style={styles.successContainer}>
                <MaterialCommunityIcons name="check-circle" size={60} color={theme.colors.primary} />
                <Text style={styles.successText}>¡Pedido actualizado!</Text>
                <Text style={styles.successSubtext}>Actualizando lista de pedidos...</Text>
              </View>
            </Dialog.Content>
          )}
          
          {!isUpdating && !updateSuccess && (
            <Dialog.Actions>
              <Button 
                onPress={() => setEditVisible(false)}
                textColor={theme.colors.accent}
              >
                Cancelar
              </Button>
              <Button 
                mode="contained" 
                onPress={handleUpdateOrder}
                style={{ backgroundColor: theme.colors.primary }}
                icon="content-save"
              >
                Guardar Cambios
              </Button>
            </Dialog.Actions>
          )}
        </Dialog>
      </Portal>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.topDecoration}>
        <Svg height="100%" width="100%" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={theme.colors.accent} stopOpacity="1" />
              <Stop offset="100%" stopColor={theme.colors.primary} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path
            d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,224C672,213,768,171,864,149.3C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256<Thinking>
I need to continue the code from where it was cut off. The cut-off point was in the SVG Path element in the topDecoration View. I'll continue the JSX code for the OrderList component, completing the SVG path and then continuing with the rest of the component's return statement and any remaining code.
</Thinking>

C384,213,480,235,576,224C672,213,768,171,864,149.3C960,128,1056,128,1152,149.3C1248,171,1344,213,1392,234.7L1440,256L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
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
        <Text style={styles.headerTitle}>Mis Pedidos</Text>
        <IconButton
          icon="refresh"
          color={theme.colors.accent}
          size={24}
          onPress={onRefresh}
          disabled={refreshing}
        />
      </View>
      
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Buscar pedido..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchbar}
          iconColor={theme.colors.accent}
        />
      </View>
      
      <View style={styles.tabContainer}>
        <SegmentedButtons
          value={selectedTab}
          onValueChange={onTabChange}
          buttons={[
            {
              value: 'pending',
              label: 'Por Entregar',
              icon: 'truck-delivery',
            },
            {
              value: 'completed',
              label: 'Completados',
              icon: 'check-circle',
            },
          ]}
          style={styles.segmentedButtons}
        />
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Cargando pedidos...</Text>
        </View>
      ) : (
        <>
          {filteredOrders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons 
                name={selectedTab === 'pending' ? 'package-variant' : 'package-variant-closed-check'} 
                size={80} 
                color={theme.colors.accent}
                style={{ opacity: 0.5 }}
              />
              <Text style={styles.emptyText}>
                {selectedTab === 'pending' 
                  ? 'No tienes pedidos pendientes por entregar' 
                  : 'No tienes pedidos completados'}
              </Text>
              <Button 
                mode="contained" 
                style={styles.newOrderButton}
                onPress={() => navigation.navigate('NewOrder')}
              >
                Crear Nuevo Pedido
              </Button>
            </View>
          ) : (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <Text style={styles.resultCount}>
                {filteredOrders.length} {filteredOrders.length === 1 ? 'pedido' : 'pedidos'} encontrados
              </Text>
              
              {filteredOrders.map(order => renderOrderCard(order))}
              
              <View style={{ height: 20 }} />
            </ScrollView>
          )}
        </>
      )}
      
      {renderOrderDetails()}
      {renderEditForm()}
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('NewOrder')}
      >
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
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
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchbar: {
    elevation: 2,
    backgroundColor: 'white',
  },
  tabContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  segmentedButtons: {
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  resultCount: {
    fontSize: 14,
    color: theme.colors.accent,
    marginBottom: 8,
    opacity: 0.7,
  },
  orderCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.accent,
    textAlign: 'center',
    marginBottom: 8,
  },
  orderDate: {
    fontSize: 12,
    color: theme.colors.text,
    opacity: 0.7,
  },
  divider: {
    marginVertical: 12,
  },
  orderDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 8,
    flex: 1,
  },
  packageInfo: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoChip: {
    marginRight: 8,
    backgroundColor: '#E8F5E9',
  },
  chipText: {
    fontSize: 12,
    color: theme.colors.accent,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.accent,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.accent,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  newOrderButton: {
    backgroundColor: theme.colors.primary,
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
  detailsDialog: {
    borderRadius: 12,
    backgroundColor: 'white',
  },
  editDialog: {
    borderRadius: 12,
    backgroundColor: 'white',
    maxHeight: height * 0.8,
  },
  scrollArea: {
    paddingHorizontal: 0,
  },
  editFormContent: {
    padding: 16,
  },
  dialogTitle: {
    color: theme.colors.accent,
    fontWeight: 'bold',
  },
  dialogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dialogOrderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.accent,
  },
  detailSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.accent,
    marginBottom: 8,
  },
  sectionCaption: {
    fontSize: 14,
    color: theme.colors.accent,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.7,
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 8,
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
  errorText: {
    color: theme.colors.error,
    marginTop: -8,
    marginBottom: 8,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  noteText: {
    fontSize: 14,
    color: theme.colors.accent,
    marginLeft: 8,
    flex: 1,
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

export default OrderList;