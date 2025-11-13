// HomeScreen.tsx - Updated to handle both local and gallery images
import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, Pressable, Alert } from "react-native";
import { Dish } from "../App";

interface HomeScreenProps {
  dishes: Dish[];
  onDeleteDish: (dishId: string) => void;
}

// Get screen width for responsive design
const { width } = Dimensions.get('window');

const HomeScreen: React.FC<HomeScreenProps> = ({ dishes, onDeleteDish }) => {
  // Filter dishes by course type
  const starters = dishes.filter((dish) => dish.course === "Starter");
  const mains = dishes.filter((dish) => dish.course === "Main Course");
  const desserts = dishes.filter((dish) => dish.course === "Dessert");
  
  // Calculate statistics
  const totalValue = dishes.reduce((sum, dish) => sum + dish.price, 0);
  const averagePrice = dishes.length > 0 ? totalValue / dishes.length : 0;
  
  // Find most popular course
  const courseCounts = {
    starters: starters.length,
    mains: mains.length,
    desserts: desserts.length
  };
  
  const mostPopularCourse = 
    courseCounts.starters >= courseCounts.mains && courseCounts.starters >= courseCounts.desserts ? "Starters" :
    courseCounts.mains >= courseCounts.desserts ? "Main Courses" : "Desserts";

  // Function to handle dish deletion
  const handleDeleteDish = (dishId: string, dishName: string) => {
    Alert.alert(
      "Delete Dish",
      `Are you sure you want to delete "${dishName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => onDeleteDish(dishId) }
      ]
    );
  };

  // Function to get image source
  const getImageSource = (dish: Dish) => {
    if (dish.imageSource) {
      return dish.imageSource; // Local require() image
    } else if (dish.imageUri) {
      return { uri: dish.imageUri }; // Gallery image URI
    }
    return null; // No image
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section with restaurant branding */}
      <View style={styles.header}>
        <Image
          source={require("../assets/J_logo.jpg")}
          style={styles.logoImage}
        />
        <View style={styles.headerText}>
          <Text style={styles.title}>Tasty Bites</Text>
          <Text style={styles.welcome}>Chef Christoffel's Command Center</Text>
        </View>
      </View>

      {/* Statistics Cards Section - Dashboard Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{dishes.length}</Text>
          <Text style={styles.statLabel}>Total Menu Items</Text>
          <Text style={styles.statSubtext}>All Courses</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>R{averagePrice.toFixed(0)}</Text>
          <Text style={styles.statLabel}>Average Price</Text>
          <Text style={styles.statSubtext}>Per Dish</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{mostPopularCourse}</Text>
          <Text style={styles.statLabel}>Most Popular</Text>
          <Text style={styles.statSubtext}>Course Category</Text>
        </View>
      </View>

      {/* Price Breakdown Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Analytics</Text>
        <View style={styles.priceBreakdown}>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Starters</Text>
            <Text style={styles.priceValue}>
              R{starters.reduce((sum, dish) => sum + dish.price, 0)}
            </Text>
            <Text style={styles.priceAverage}>
              Avg: R{starters.length > 0 ? (starters.reduce((sum, dish) => sum + dish.price, 0) / starters.length).toFixed(0) : 0}
            </Text>
          </View>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Main Courses</Text>
            <Text style={styles.priceValue}>
              R{mains.reduce((sum, dish) => sum + dish.price, 0)}
            </Text>
            <Text style={styles.priceAverage}>
              Avg: R{mains.length > 0 ? (mains.reduce((sum, dish) => sum + dish.price, 0) / mains.length).toFixed(0) : 0}
            </Text>
          </View>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel}>Desserts</Text>
            <Text style={styles.priceValue}>
              R{desserts.reduce((sum, dish) => sum + dish.price, 0)}
            </Text>
            <Text style={styles.priceAverage}>
              Avg: R{desserts.length > 0 ? (desserts.reduce((sum, dish) => sum + dish.price, 0) / desserts.length).toFixed(0) : 0}
            </Text>
          </View>
        </View>
      </View>

      {/* Menu Overview Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menu Overview</Text>

        <View style={styles.categorySection}>
          <View style={[styles.categoryCard, styles.starterCard]}>
            <Text style={styles.categoryCount}>{starters.length}</Text>
            <Text style={styles.categoryLabel}>Starters</Text>
          </View>

          <View style={[styles.categoryCard, styles.mainCard]}>
            <Text style={styles.categoryCount}>{mains.length}</Text>
            <Text style={styles.categoryLabel}>Main Courses</Text>
          </View>

          <View style={[styles.categoryCard, styles.dessertCard]}>
            <Text style={styles.categoryCount}>{desserts.length}</Text>
            <Text style={styles.categoryLabel}>Desserts</Text>
          </View>
        </View>
      </View>

      {/* All Dishes Section with Delete Functionality */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>All Dishes</Text>

        <View style={styles.dishesList}>
          {dishes.map((dish) => {
            const imageSource = getImageSource(dish);
            return (
              <View key={dish.id} style={styles.dishItem}>
                {/* Dish Image in List */}
                {imageSource ? (
                  <Image 
                    source={imageSource}
                    style={styles.dishItemImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.dishItemImage, styles.dishItemImagePlaceholder]}>
                    <Text style={styles.dishItemPlaceholderText}>📷</Text>
                    <Text style={styles.dishItemPlaceholderSubtext}>No Image</Text>
                  </View>
                )}
                
                <View style={styles.dishInfo}>
                  <Text style={styles.dishName}>{dish.name}</Text>
                  <Text style={styles.dishDescription} numberOfLines={2}>
                    {dish.description}
                  </Text>
                </View>
                <View style={styles.dishMeta}>
                  <Text style={styles.dishPrice}>R{dish.price}</Text>
                  <View style={[
                    styles.courseBadge,
                    {
                      backgroundColor:
                        dish.course === "Starter" ? "#e74c3c" :
                          dish.course === "Main Course" ? "#3498db" : "#27ae60"
                    }
                  ]}>
                    <Text style={styles.courseBadgeText}>
                      {dish.course === "Main Course" ? "Main" : dish.course}
                    </Text>
                  </View>
                  <Pressable 
                    style={styles.deleteButton}
                    onPress={() => handleDeleteDish(dish.id, dish.name)}
                  >
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

// ... (styles remain the same as previous version)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  welcome: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  statLabel: {
    color: "#7f8c8d",
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  statSubtext: {
    color: "#bdc3c7",
    fontSize: 10,
    marginTop: 2,
  },
  section: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  priceBreakdown: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceItem: {
    flex: 1,
    alignItems: "center",
    padding: 12,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#27ae60",
  },
  priceAverage: {
    fontSize: 10,
    color: "#7f8c8d",
    marginTop: 2,
  },
  categorySection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categoryCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  starterCard: {
    backgroundColor: "#ffeaa7",
  },
  mainCard: {
    backgroundColor: "#a29bfe",
  },
  dessertCard: {
    backgroundColor: "#fd79a8",
  },
  categoryCount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 12,
    color: "#2c3e50",
    fontWeight: "600",
  },
  // All Dishes List Styles
  dishesList: {
    gap: 12,
  },
  dishItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
  },
  dishItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  dishItemImagePlaceholder: {
    backgroundColor: "#ecf0f1",
    justifyContent: "center",
    alignItems: "center",
  },
  dishItemPlaceholderText: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  dishItemPlaceholderSubtext: {
    fontSize: 8,
    color: "#7f8c8d",
    marginTop: 2,
  },
  dishInfo: {
    flex: 1,
    marginRight: 12,
  },
  dishName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  dishDescription: {
    fontSize: 12,
    color: "#7f8c8d",
    lineHeight: 16,
  },
  dishMeta: {
    alignItems: "flex-end",
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#27ae60",
    marginBottom: 6,
  },
  courseBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  courseBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  deleteButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#e74c3c",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 12,
  },
});

export default HomeScreen;