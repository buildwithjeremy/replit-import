
// TODO: Replace with real Google OAuth implementation
let currentUser = null;

export const authService = {
  // Mock Google Sign-In
  signInWithGoogle: async () => {
    // TODO: Implement real Google OAuth
    // For now, return mock trainer data
    return new Promise((resolve) => {
      setTimeout(() => {
        currentUser = {
          id: "trainer-001",  
          name: "Grace Lee",
          email: "grace.lee@teamtenacious.com",
          role: "trainer",
          assignedRepIds: ["rep-001", "rep-002"]
        };
        resolve(currentUser);
      }, 1000);
    });
  },

  // Mock Admin Sign-In  
  signInAsAdmin: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        currentUser = {
          id: "admin-001",
          name: "Sarah Admin", 
          email: "sarah.admin@teamtenacious.com",
          role: "admin",
          assignedRepIds: []
        };
        resolve(currentUser);
      }, 1000);
    });
  },

  signOut: () => {
    currentUser = null;
    return Promise.resolve();
  },

  getCurrentUser: () => {
    return currentUser;
  },

  isSignedIn: () => {
    return currentUser !== null;
  }
};
