import { Slot} from 'expo-router';
import { AuthProvider} from './Context/Auth';
import { ThemeProvider } from './Context/ThemeContext';



export default function Root() {
  
  
  // If the user is logged in, render our layout inside of the auth context.

  // Set up the auth context and render our layout inside of it.
  return (
   
    <AuthProvider>
       <ThemeProvider>
        <Slot />
      </ThemeProvider>
    </AuthProvider>
   
  );
}
