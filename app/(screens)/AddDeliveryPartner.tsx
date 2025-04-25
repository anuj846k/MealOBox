import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createDeliveryPartner } from "../api/postApi/postApi";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define a type for the file object
interface FileObject {
  uri: string;
  type: string;
  name: string;
}

const AddDeliveryPartner = () => {
  const router = useRouter();

  // Basic Details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState(new Date());
  const [gender, setGender] = useState("Male");

  // Payment System
  const [deliveryCharges, setDeliveryCharges] = useState("");
  const [onTimeDeliveryBonus, setOnTimeDeliveryBonus] = useState("");
  const [highRatingBonus, setHighRatingBonus] = useState("");

  // Payment Details
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [panCardNo, setPanCardNo] = useState("");
  const [aadharCardNo, setAadharCardNo] = useState("");

  // Working Days
  const [workingDays, setWorkingDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Document uploads and previews
  const [panCardFile, setPanCardFile] = useState<FileObject | null>(null);
  const [aadharCardFile, setAadharCardFile] = useState<FileObject | null>(null);
  const [panCardPreview, setPanCardPreview] = useState<string | null>(null);
  const [aadharCardPreview, setAadharCardPreview] = useState<string | null>(null);

  // Add kitchenPartnerId state
  const [kitchenPartnerId, setKitchenPartnerId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchKitchenPartnerId = async () => {
        try {
            const storedData = await AsyncStorage.getItem("data");
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                setKitchenPartnerId(parsedData.kitchenPartner?.id || null);
                console.log(parsedData.kitchenPartner?.id || null);
            }
        } catch (error) {
            console.error("Error fetching kitchenPartnerId:", error);
        }
    };

    fetchKitchenPartnerId();
}, []);

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  const toggleWorkingDay = (day: keyof typeof workingDays) => {
    setWorkingDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleFilePick = async (type: "pan" | "aadhar") => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "You need to allow access to your media library");
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: false,
      selectionLimit: 1,
    });
  
    if (!result.canceled && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      const uriParts = selectedAsset.uri.split(".");
      const fileExtension = uriParts.pop();
      const fileName = `${type}_card_${Date.now()}.${fileExtension}`;
      const file: FileObject = {
        uri: selectedAsset.uri,
        type: `image/${fileExtension}`,
        name: fileName,
      };
  
      if (type === "pan") {
        setPanCardFile(file);
        setPanCardPreview(selectedAsset.uri);
      } else {
        setAadharCardFile(file);
        setAadharCardPreview(selectedAsset.uri);
      }
    }
  };

  const handleSave = async () => {
    if (!name || !phone || !email || !deliveryCharges || !beneficiaryName || !ifscCode || !bankName) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (!kitchenPartnerId) {
      Alert.alert("Error", "Kitchen partner ID not found. Please login again.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      // Add basic details
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('dateOfBirth', dob.toISOString());
      formData.append('gender', gender);
      formData.append('kitchenPartnerId', kitchenPartnerId);

      // Add payment system details
      formData.append('deliveryCharges', deliveryCharges);
      if (onTimeDeliveryBonus) {
        formData.append('onTimeDeliveryBonus', onTimeDeliveryBonus);
      }
      if (highRatingBonus) {
        formData.append('highRatingBonus', highRatingBonus);
      }

      // Add payment details
      formData.append('beneficiaryName', beneficiaryName);
      formData.append('ifscCode', ifscCode);
      formData.append('bankName', bankName);
      if (bankBranch) {
        formData.append('bankBranch', bankBranch);
      }
      if (panCardNo) {
        formData.append('panCardNo', panCardNo);
      }
      if (aadharCardNo) {
        formData.append('aadharCardNo', aadharCardNo);
      }

      // Add working days - exactly as expected by the API
      Object.entries(workingDays).forEach(([day, isWorking]) => {
        formData.append(day, isWorking ? 'on' : 'off');
      });

      // Add files if they exist - ensure they match the expected structure
      if (panCardFile) {
        formData.append('panCardUpload', panCardFile as any);
      }

      if (aadharCardFile) {
        formData.append('aadharCardUpload', aadharCardFile as any);
      }

      const result = await createDeliveryPartner(formData);
      if (result.success) {
        Alert.alert("Success", "Delivery partner created successfully");
        router.back();
      } else {
        throw new Error(result.message || 'Creation failed');
      }
    } catch (error: any) {
      console.error("Error creating delivery partner:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to create delivery partner. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Delivery Partner</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Basic Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Details</Text>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter name"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Phone *</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Date Of Birth</Text>
            <TouchableOpacity 
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{formatDate(dob)}</Text>
              <Ionicons name="calendar-outline" size={20} color="#888" />
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={dob}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Gender</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity 
                style={[styles.genderOption, gender === "Male" && styles.selectedGender]}
                onPress={() => setGender("Male")}
              >
                <Text style={gender === "Male" ? styles.selectedGenderText : styles.genderText}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.genderOption, gender === "Female" && styles.selectedGender]}
                onPress={() => setGender("Female")}
              >
                <Text style={gender === "Female" ? styles.selectedGenderText : styles.genderText}>Female</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Payment Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Beneficiary Name *</Text>
            <TextInput
              style={styles.input}
              value={beneficiaryName}
              onChangeText={setBeneficiaryName}
              placeholder="Enter beneficiary name"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>IFSC Code *</Text>
            <TextInput
              style={styles.input}
              value={ifscCode}
              onChangeText={setIfscCode}
              placeholder="Enter IFSC code"
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Bank Name *</Text>
            <TextInput
              style={styles.input}
              value={bankName}
              onChangeText={setBankName}
              placeholder="Enter bank name"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Bank Branch</Text>
            <TextInput
              style={styles.input}
              value={bankBranch}
              onChangeText={setBankBranch}
              placeholder="Enter bank branch"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>PAN Card Number</Text>
            <TextInput
              style={styles.input}
              value={panCardNo}
              onChangeText={setPanCardNo}
              placeholder="Enter PAN card number"
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Aadhar Card Number</Text>
            <TextInput
              style={styles.input}
              value={aadharCardNo}
              onChangeText={setAadharCardNo}
              placeholder="Enter Aadhar card number"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Payment System Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment System</Text>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Delivery Charges (Per km.) *</Text>
            <TextInput
              style={styles.input}
              value={deliveryCharges}
              onChangeText={setDeliveryCharges}
              placeholder="Enter delivery charges"
              keyboardType="numeric"
            />
            <Text style={styles.helperText}>(In Rupees)</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>On-Time Delivery Bonus</Text>
            <TextInput
              style={styles.input}
              value={onTimeDeliveryBonus}
              onChangeText={setOnTimeDeliveryBonus}
              placeholder="Enter on-time delivery bonus"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>High Rating Bonus</Text>
            <TextInput
              style={styles.input}
              value={highRatingBonus}
              onChangeText={setHighRatingBonus}
              placeholder="Enter high rating bonus"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Working Days Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Working Days</Text>
          <View style={styles.workingDaysContainer}>
            {Object.entries(workingDays).map(([day, isWorking]) => (
              <TouchableOpacity
                key={day}
                style={[styles.dayOption, isWorking && styles.selectedDay]}
                onPress={() => toggleWorkingDay(day as keyof typeof workingDays)}
              >
                <Text style={isWorking ? styles.selectedDayText : styles.dayText}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Documents Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Documents</Text>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>PAN Card</Text>
            <TouchableOpacity 
              style={styles.uploadButton} 
              onPress={() => handleFilePick('pan')}
            >
              <Text style={styles.uploadButtonText}>
                {panCardFile ? 'Change PAN Card' : 'Upload PAN Card'}
              </Text>
            </TouchableOpacity>
            {panCardPreview && (
              <View style={styles.previewContainer}>
                <Image source={{ uri: panCardPreview }} style={styles.previewImage} />
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => {
                    setPanCardFile(null);
                    setPanCardPreview(null);
                  }}
                >
                  <Ionicons name="close" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Aadhar Card</Text>
            <TouchableOpacity 
              style={styles.uploadButton} 
              onPress={() => handleFilePick('aadhar')}
            >
              <Text style={styles.uploadButtonText}>
                {aadharCardFile ? 'Change Aadhar Card' : 'Upload Aadhar Card'}
              </Text>
            </TouchableOpacity>
            {aadharCardPreview && (
              <View style={styles.previewContainer}>
                <Image source={{ uri: aadharCardPreview }} style={styles.previewImage} />
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => {
                    setAadharCardFile(null);
                    setAadharCardPreview(null);
                  }}
                >
                  <Ionicons name="close" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={[styles.saveButton, loading && styles.disabledButton]}
        onPress={handleSave}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.saveButtonText}>CREATE DELIVERY PARTNER</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: "#888888",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  genderContainer: {
    flexDirection: "row",
  },
  genderOption: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 4,
    padding: 10,
    marginRight: 10,
    minWidth: 80,
    alignItems: "center",
  },
  selectedGender: {
    backgroundColor: "#FFA500",
    borderColor: "#FFA500",
  },
  genderText: {
    color: "#000000",
  },
  selectedGenderText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  helperText: {
    fontSize: 12,
    color: "#888888",
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  workingDaysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayOption: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 4,
    padding: 8,
    minWidth: 80,
    alignItems: "center",
    marginBottom: 8,
  },
  selectedDay: {
    backgroundColor: "#FFA500",
    borderColor: "#FFA500",
  },
  dayText: {
    color: "#000000",
  },
  selectedDayText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  uploadButton: {
    backgroundColor: '#FFA500',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  previewContainer: {
    marginTop: 12,
    position: 'relative',
    width: 200,
    height: 150,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#FF5252',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: "#FFA500",
    padding: 16,
    margin: 16,
    borderRadius: 4,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default AddDeliveryPartner;
