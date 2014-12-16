if (Lifts.find().count() === 0) {
  // ensureIndex on the server side
  Lifts._ensureIndex({ fromLoc: "2dsphere" });
  Lifts._ensureIndex({ toLoc: "2dsphere" });
} 
