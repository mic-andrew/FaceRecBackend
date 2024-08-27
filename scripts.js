

function ensureKAnonymity(dataset, k) {
    // Group data by quasi-identifiers (generalized age and masked phone)
    const groupedData = groupByQuasiIdentifiers(dataset);
  
    // Anonymize data to ensure k-anonymity
    for (const key in groupedData) {
      if (groupedData[key].length < k) {
        // If a group has fewer than k records, apply further anonymization
        furtherAnonymize(groupedData[key]);
      }
    }
  
    // Reconstruct the dataset from the anonymized groups
    return Object.values(groupedData).flat();
  }
  
  // Group records by quasi-identifiers: generalized age and masked phone
  function groupByQuasiIdentifiers(dataset) {
    const groupedData = {};
    
    dataset.forEach(record => {
      const generalizedAge = generalizeAge(record.age);
      const maskedPhone = maskPhone(record.phone);
  
      const key = `${generalizedAge}-${maskedPhone}`;
      
      if (!groupedData[key]) {
        groupedData[key] = [];
      }
      groupedData[key].push({
        ...record,
        age: generalizedAge,
        phone: maskedPhone,
        name: `Patient ${Math.random().toString(36).substring(7)}`  // Replace name with a random identifier
      });
    });
  
    return groupedData;
  }
  
  // Generalize the age into ranges
  function generalizeAge(age) {
    if (age < 30) return '<30';
    if (age >= 30 && age < 50) return '30-50';
    return '50+';
  }
  
  // Mask the phone number (partial suppression)
  function maskPhone(phone) {
    return phone.slice(0, 3) + "xxxx" + phone.slice(-4);
  }
  
  // Apply further anonymization to ensure k-anonymity
  function furtherAnonymize(group) {
    group.forEach(record => {
      record.age = "N/A";  // Further generalize or suppress the age
      record.phone = "xxx-xxx-xxxx";  // Fully suppress the phone number
    });
  }
  
  // Example dataset
  const dataset = [
    { name: "John Doe", phone: "1234567890", age: 34, clinic: "General Hospital", diagnosis: "Hypertension", date: "2024-08-26" },
    { name: "Jane Doe", phone: "0987654321", age: 45, clinic: "General Hospital", diagnosis: "Diabetes", date: "2024-08-26" },
    { name: "Alice Smith", phone: "1231231234", age: 25, clinic: "Clinic A", diagnosis: "Asthma", date: "2024-08-26" },
    { name: "Bob Johnson", phone: "3213214321", age: 55, clinic: "Clinic B", diagnosis: "COPD", date: "2024-08-26" },
    // Add more patient records as needed
  ];
  
  const k = 2;
  const anonymizedDataset = ensureKAnonymity(dataset, k);
  console.log("Anonymized Dataset:", anonymizedDataset);
  