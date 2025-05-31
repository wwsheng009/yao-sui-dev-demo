// e:\projects\yao\demos\cui-demo\data\templates\default\userinfo\userinfo.ts
import { Component, EventData, EventDetail, $Backend, __sui_data, $Query } from "@yao/sui";

const self = this as Component;

self.once = async function () {
  console.log('Userinfo component initialized');
  // __sui_data contains data injected from the server, including results from JSON $handlers
  // and BeforeRender function.
  if (__sui_data && __sui_data.user) {
    self.store.SetJSON("currentUser", __sui_data.user);
    console.log('User data loaded from __sui_data:', __sui_data.user);
  } else {
    console.log('No initial user data found in __sui_data, attempting to load...');
    await loadUserData();
  }
  // Example: Add a class to the root element once initialized
  self.$root.addClass('userinfo-initialized');
};

async function loadUserData() {
  self.$root.find('.loading-indicator')?.removeClass('hidden');
  self.$root.find('.error-message')?.addClass('hidden');
  try {
    // Assuming GetUserInfo in backend.ts can be called via $Backend if it were prefixed with Api
    // For this example, we'll rely on the initial data load via userinfo.json's $user: "@GetUserInfo"
    // If we needed to call an API function, it would look like this:
    // const user = await $Backend('/userinfo').Call('GetUserInfo'); 
    // For now, we'll just log that data should be pre-loaded.
    console.log('User data should be pre-loaded by SUI through userinfo.json.');
    const user = self.store.GetJSON("currentUser");
    if (user) {
        // If data is already in store (e.g. from __sui_data), render it
        // This part is mostly for demonstration if data wasn't in __sui_data
        await self.render('', { user: user }); // Re-render the whole component with new data
    } else {
        throw new Error("User data not available.")
    }
  } catch (error) {
    console.error('Error loading user data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    await self.render('', { error: errorMessage, user: null });
    self.$root.find('.error-message')?.removeClass('hidden');
  } finally {
    self.$root.find('.loading-indicator')?.addClass('hidden');
  }
}

// Example of a frontend function that might interact with the backend
// self.updateBio = async (event: Event, data: EventData, detail: EventDetail) => {
//   const newBio = prompt("Enter new bio:");
//   if (newBio === null) return; // User cancelled

//   const currentUser = self.store.GetJSON("currentUser");
//   if (!currentUser || !currentUser.id) {
//     console.error("User ID not found, cannot update bio.");
//     return;
//   }

//   try {
//     const updatedUser = await $Backend('/userinfo').Call('UpdateUserBio', currentUser.id, newBio);
//     if (updatedUser && !updatedUser.error) {
//       self.store.SetJSON("currentUser", updatedUser);
//       // Re-render the component or specific parts to show the updated bio
//       await self.render('', { user: updatedUser }); 
//       alert("Bio updated successfully!");
//     } else {
//       throw new Error(updatedUser.error || 'Failed to update bio');
//     }
//   } catch (error) {
//     console.error('Error updating bio:', error);
//     alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
//   }
// };

// To make updateBio callable from HTML, you'd add a button like:
// <button s:on-click="updateBio">Update Bio</button>