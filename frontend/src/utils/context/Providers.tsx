import { type ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
// import UserInfoProvider from "./UserInfoContext";
import SocketProvider from "./SocketContext";
// import ConversationProvider from "./CoversationContext";
import { ExploreProvider } from "./ExploreContext";
import AddressProvider from "./AddressContext";
import { NotificationQueueProvider } from "./NotificationQueueContext";

interface ProvidersProps {
  children: ReactNode;
}

function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <NotificationQueueProvider>
        <AddressProvider>
          <ExploreProvider>
            {/* <ConversationProvider> */}
            <SocketProvider>{children}</SocketProvider>
            {/* </ConversationProvider> */}
          </ExploreProvider>
        </AddressProvider>
      </NotificationQueueProvider>
    </AuthProvider>
  );
}

export default Providers;
