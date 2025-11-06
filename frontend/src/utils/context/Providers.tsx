import { type ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import UserInfoProvider from "./UserInfoContext";
import SocketProvider from "./SocketContext";
import ConversationProvider from "./CoversationContext";
import { ExploreProvider } from "./ExploreContext";
import AddressProvider from "./AddressContext";
// import { Provider } from "react-redux";

interface ProvidersProps {
  children: ReactNode;
}

function Providers({ children }: ProvidersProps) {
  return (
    // <Provider store={AppStore}>
    <AuthProvider>
      <UserInfoProvider>
        <AddressProvider>
          <ExploreProvider>
            <ConversationProvider>
              <SocketProvider>{children}</SocketProvider>
            </ConversationProvider>
          </ExploreProvider>
        </AddressProvider>
      </UserInfoProvider>
    </AuthProvider>
    // </Provider>
  );
}
export default Providers;
