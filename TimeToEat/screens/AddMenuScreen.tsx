import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView, Image,} from "react-native";
import * as ImagePicker from "expo-image-picker"; // Import image picker
import { Dish, CourseType } from "../App";

interface AddMenuScreenProps {
  dishes: Dish[];
  onAddDish: (dish: Dish) => void;
}

const categories: CourseType[] = ["Starter", "Main Course", "Dessert"];

const AddMenuScreen: React.FC<AddMenuScreenProps> = ({ dishes, onAddDish }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState<CourseType>("Main Course");
  const [price, setPrice] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  // Function to pick an image from device gallery
  const pickImage = async () => {
    try {
      // Request permission to access media library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert("Permission Required", "Please allow access to your photos to add images.");
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
      console.error("Image picker error:", error);
    }
  };

  // Function to add a new dish to the menu
  const addDish = () => {
    // Validate form inputs
    if (!name.trim()) {
      Alert.alert("Error", "Please enter a dish name");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }
    if (!price.trim()) {
      Alert.alert("Error", "Please enter a price");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert("Error", "Please enter a valid price greater than 0");
      return;
    }

    // Check for duplicate dish names
    const isDuplicate = dishes.some(
      (dish) => dish.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (isDuplicate) {
      Alert.alert("Duplicate", "This dish already exists in the menu");
      return;
    }

    // Create new dish object
    const newDish: Dish = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      course,
      price: priceNum,
      imageUri: imageUri || undefined, // Include image URI if available
    };

    // Add dish to menu and reset form
    onAddDish(newDish);
    setName("");
    setDescription("");
    setPrice("");
    setCourse("Main Course");
    setImageUri(null);

    Alert.alert("Success", "Dish added to menu!");
  };

  // Function to get color for each category
  const getCategoryColor = (cat: CourseType): string => {
    switch (cat) {
      case "Starter": return "#e74c3c";
      case "Main Course": return "#3498db";
      case "Dessert": return "#27ae60";
      default: return "#95a5a6";
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>➕ Add New Dish</Text>
        <Text style={styles.subtitle}>Create a new menu item</Text>
      </View>

      <View style={styles.form}>
        {/* Dish Image Section */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dish Image</Text>
          <Pressable style={styles.imagePicker} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.selectedImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderText}>Tap to add photo</Text>
                <Text style={styles.imageHelperText}>Choose from your gallery</Text>
              </View>
            )}
          </Pressable>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dish Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter dish name..."
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your dish..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categories}>
            {categories.map((cat) => (
              <Pressable
                key={cat}
                style={[
                  styles.categoryBtn,
                  { borderColor: getCategoryColor(cat) },
                  course === cat && [styles.selectedCategory, { backgroundColor: getCategoryColor(cat) }],
                ]}
                onPress={() => setCourse(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    course === cat && styles.selectedCategoryText,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price (Rands)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price..."
            placeholderTextColor="#999"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
        </View>

        <Pressable style={styles.addButton} onPress={addDish}>
          <Text style={styles.addButtonText}>🚀 Add to Menu</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
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
  form: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#bdc3c7",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  categories: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  categoryBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  selectedCategory: {
    backgroundColor: "#3498db",
  },
  categoryText: {
    color: "#7f8c8d",
    fontWeight: "600",
    fontSize: 12,
  },
  selectedCategoryText: {
    color: "white",
  },
  addButton: {
    backgroundColor: "#27ae60",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#27ae60",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePicker: {
    borderWidth: 2,
    borderColor: "#bdc3c7",
    borderStyle: "dashed",
    borderRadius: 12,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  imagePlaceholder: {
    alignItems: "center",
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: "#7f8c8d",
    fontWeight: "600",
  },
  imageHelperText: {
    fontSize: 12,
    color: "#bdc3c7",
    marginTop: 4,
  },
});

export default AddMenuScreen;