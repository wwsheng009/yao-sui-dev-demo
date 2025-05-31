// e:\projects\yao\demos\cui-demo\data\templates\default\userinfo\userinfo.backend.ts
import { sui } from "@yao/sui";
import { Store } from "@yao/lib";

// Mock user data - in a real application, this would come from a database or an API call
const MOCK_USER_DATA = {
  id: "1",
  name: "Yao App User",
  email: "user@example.com",
  bio: "This is a sample user bio. I enjoy building applications with Yao and SUI!"
};

/**
 * Fetches user information.
 * In a real application, this function would interact with a database or an external API.
 * @param r The SUI request object (optional)
 * @returns User data or null if not found.
 */
function GetUserInfo(r?: sui.Request): object | null {
  console.log('GetUserInfo called');
  // Simulate fetching user data. You can add logic here to fetch based on r.params.id if needed.
  // For now, we return a mock user.
  
  // Example: Accessing a user ID from the route if this component is used in a dynamic route like /user/[id]
  // const userId = r?.params?.id;
  // if (userId) { 
  //   // Fetch user by userId
  // }

  return MOCK_USER_DATA;
}

/**
 * Example of an API function that could be called from the frontend.
 * All functions exposed to the frontend via $Backend().Call() must be prefixed with "Api".
 * @param userId The ID of the user to update.
 * @param data The data to update.
 * @returns The updated user data or an error object.
 */
function ApiUpdateUserBio(userId: string, newBio: string): object | { error: string } {
  console.log(`ApiUpdateUserBio called for user ${userId} with new bio: ${newBio}`);
  // Simulate updating user data
  if (MOCK_USER_DATA.id === userId) {
    MOCK_USER_DATA.bio = newBio;
    // In a real app, you would save this to the database.
    // new Store('cache').Set(`user_${userId}`, MOCK_USER_DATA); // Example of caching
    return MOCK_USER_DATA;
  }
  return { error: "User not found" };
}

/**
 * This function is called before the component is rendered on the server.
 * It's useful for preparing data that the HTML template will need.
 * This is only called if the component is embedded in another page using the `is` attribute.
 * @param request The SUI request object.
 * @param props The properties passed to the component from the parent.
 * @returns An object containing data to be injected into the component's template.
 */
function BeforeRender(request: sui.Request, props: any): object {
  console.log('userinfo.backend.ts: BeforeRender called');
  // You could fetch user-specific data here based on props or request parameters
  // For example, if a userID is passed as a prop:
  // const userId = props.userId;
  // const user = GetUserById(userId); // Your function to get user by ID
  // return { user: user };
  
  // For this example, we'll just return the mock user directly if no specific logic is needed here.
  // If the data is already fetched by a $handler in JSON, this might not be necessary
  // or could be used for additional data processing.
  return {
    user: GetUserInfo(request), // Ensure the user data is available for the template
    customMessage: "Data prepared by BeforeRender"
  };
}