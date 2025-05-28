
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { AuthProvider } from "@/hooks/useAuth";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Admin from "./pages/Admin";
import WhatsAppNumbers from "./pages/WhatsAppNumbers";
import ChatbotConfig from "./pages/ChatbotConfig";
import ChatbotManagement from "./pages/ChatbotManagement";
import ShopeeIntegration from "./pages/ShopeeIntegration";
import FlowBuilder from "./pages/FlowBuilder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="dohoo-ui-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <AppLayout>
                  <ProtectedRoute permission="dashboard.view">
                    <Dashboard />
                  </ProtectedRoute>
                </AppLayout>
              } />
              
              <Route path="/chat" element={
                <AppLayout>
                  <ProtectedRoute permission="chat.view">
                    <Chat />
                  </ProtectedRoute>
                </AppLayout>
              } />
              
              <Route path="/whatsapp-numbers" element={
                <AppLayout>
                  <ProtectedRoute permission="whatsapp.view">
                    <WhatsAppNumbers />
                  </ProtectedRoute>
                </AppLayout>
              } />
              
              <Route path="/chatbot-config" element={
                <AppLayout>
                  <ProtectedRoute permission="chatbot.manage">
                    <ChatbotConfig />
                  </ProtectedRoute>
                </AppLayout>
              } />
              
              <Route path="/chatbot-management" element={
                <AppLayout>
                  <ProtectedRoute permission="chatbot.view">
                    <ChatbotManagement />
                  </ProtectedRoute>
                </AppLayout>
              } />
              
              <Route path="/flow-builder" element={
                <AppLayout>
                  <ProtectedRoute permission="chatbot.manage">
                    <FlowBuilder />
                  </ProtectedRoute>
                </AppLayout>
              } />
              
              <Route path="/shopee-integration" element={
                <AppLayout>
                  <ProtectedRoute permission="shopee.view">
                    <ShopeeIntegration />
                  </ProtectedRoute>
                </AppLayout>
              } />
              
              <Route path="/admin" element={
                <AppLayout>
                  <ProtectedRoute permission="admin.view">
                    <Admin />
                  </ProtectedRoute>
                </AppLayout>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
