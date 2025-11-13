// ViewMenuScreen.tsx - Updated to handle both local and gallery images
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Image, Dimensions, Alert } from "react-native";
import { Dish, CourseType } from "../App";

interface ViewMenuScreenProps {
  dishes: Dish[];
  onDeleteDish: (dishId: string) => void;
}

const categories: CourseType[] = ["Starter", "Main Course", "Dessert"];

// Get screen dimensions for responsive layout
const { width } = Dimensions.get('window');

const ViewMenuScreen: React.FC<ViewMenuScreenProps> = ({ dishes, onDeleteDish }) => {
  const [selectedCategory, setSelectedCategory] = useState<CourseType | "All">(
    "All"
  );

  // Filter dishes based on selected category
  const filteredDishes =
    selectedCategory === "All"
      ? dishes
      : dishes.filter((dish) => dish.course === selectedCategory);

  // Function to get color for each course type
  const getCategoryColor = (course: CourseType): string => {
    switch (course) {
      case "Starter":
        return "#e74c3c";
      case "Main Course":
        return "#3498db";
      case "Dessert":
        return "#27ae60";
      default:
        return "#95a5a6";
    }
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

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Restaurant Menu</Text>
        <Text style={styles.subtitle}>Manage your dishes</Text>
      </View>

      {/* Category Filter Section - Horizontal Scroll */}
      <ScrollView
        horizontal
        style={styles.categories}
        showsHorizontalScrollIndicator={false}
      >
        <Pressable
          style={[
            styles.categoryPill,
            selectedCategory === "All" && styles.selectedPill,
          ]}
          onPress={() => setSelectedCategory("All")}
        >
          <Text style={styles.categoryIcon}>🍽️</Text>
          <Text
            style={[
              styles.categoryText,
              selectedCategory === "All" && styles.selectedText,
            ]}
          >
            All ({dishes.length})
          </Text>
        </Pressable>

        {categories.map((cat) => (
          <Pressable
            key={cat}
            style={[
              styles.categoryPill,
              selectedCategory === cat && styles.selectedPill,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.selectedText,
              ]}
            >
              {cat} ({dishes.filter((d) => d.course === cat).length})
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Dishes Grid Section */}
      <ScrollView
        style={styles.dishesContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredDishes.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyText}>No dishes found</Text>
            <Text style={styles.emptySubtext}>
              {selectedCategory === "All"
                ? "Add some dishes to your menu"
                : `No ${selectedCategory.toLowerCase()} dishes yet`}
            </Text>
          </View>
        ) : (
          <View style={styles.dishesGrid}>
            {filteredDishes.map((dish) => {
              const imageSource = getImageSource(dish);
              return (
                <View key={dish.id} style={styles.dishCard}>
                  {/* Dish Image Section */}
                  {imageSource ? (
                    <Image
                      source={imageSource}
                      style={styles.dishImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.dishImage, styles.dishImagePlaceholder]}>
                      <Text style={styles.dishImagePlaceholderText}>📷</Text>
                      <Text style={styles.dishImagePlaceholderSubtext}>No Image</Text>
                    </View>
                  )}

                  <View style={styles.dishContent}>
                    <View style={styles.dishHeader}>
                      <Text style={styles.dishName} numberOfLines={1}>
                        {dish.name}
                      </Text>
                      <Pressable 
                        style={styles.deleteCardButton}
                        onPress={() => handleDeleteDish(dish.id, dish.name)}
                      >
                        <Text style={styles.deleteCardButtonText}>✕</Text>
                      </Pressable>
                    </View>

                    <Text style={styles.dishDescription} numberOfLines={2}>
                      {dish.description}
                    </Text>

                    <View style={styles.dishFooter}>
                      <Text style={styles.dishPrice}>R{dish.price}</Text>
                      <View
                        style={[
                          styles.categoryTag,
                          { backgroundColor: getCategoryColor(dish.course) },
                        ]}
                      >
                        <Text style={styles.categoryTagText}>
                          {dish.course === "Main Course" ? "Main" : dish.course}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
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
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 4,
  },
  categories: {
    marginBottom: 20,
    maxHeight: 60,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedPill: {
    backgroundColor: "#3498db",
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    color: "#7f8c8d",
    fontWeight: "600",
    fontSize: 12,
  },
  selectedText: {
    color: "white",
  },
  dishesContainer: {
    flex: 1,
  },
  dishesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dishCard: {
    width: (width - 40) / 2 - 8, // Two columns with padding
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  dishImage: {
    width: "100%",
    height: 160,
  },
  dishImagePlaceholder: {
    backgroundColor: "#ecf0f1",
    justifyContent: "center",
    alignItems: "center",
  },
  dishImagePlaceholderText: {
    fontSize: 32,
    color: "#7f8c8d",
    marginBottom: 8,
  },
  dishImagePlaceholderSubtext: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  dishContent: {
    padding: 12,
  },
  dishHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  dishName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    flex: 1,
    marginRight: 8,
  },
  deleteCardButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: "#e74c3c",
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteCardButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  dishDescription: {
    color: "#7f8c8d",
    lineHeight: 16,
    fontSize: 12,
    marginBottom: 8,
  },
  dishFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dishPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#27ae60",
  },
  categoryTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryTagText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  empty: {
    alignItems: "center",
    padding: 40,
    backgroundColor: "white",
    borderRadius: 16,
    marginTop: 20,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    color: "#7f8c8d",
    fontSize: 18,
    marginBottom: 8,
    fontWeight: "600",
  },
  emptySubtext: {
    color: "#bdc3c7",
    fontSize: 14,
    textAlign: "center",
  },
});

export default ViewMenuScreen;