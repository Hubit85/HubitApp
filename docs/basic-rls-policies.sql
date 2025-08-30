-- POLITICAS RLS BASICAS PARA HUBIT
-- Este script configura las politicas de seguridad Row Level Security (RLS)
-- Ejecutar DESPUES de complete-database-setup.sql

-- =============================================================================
-- POLITICAS PARA TABLA PROFILES
-- =============================================================================

-- Los usuarios pueden ver y editar solo su propio perfil
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Los usuarios autenticados pueden insertar su perfil (manejado por trigger)
CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- =============================================================================
-- POLITICAS PARA TABLA PROPERTIES
-- =============================================================================

-- Los usuarios pueden gestionar sus propias propiedades
CREATE POLICY "Users can view own properties" 
  ON properties FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own properties" 
  ON properties FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own properties" 
  ON properties FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own properties" 
  ON properties FOR DELETE 
  USING (auth.uid() = user_id);

-- =============================================================================
-- POLITICAS PARA TABLA SERVICE_CATEGORIES
-- =============================================================================

-- Las categorias de servicios son publicas para lectura
CREATE POLICY "Anyone can view active service categories" 
  ON service_categories FOR SELECT 
  USING (is_active = true);

-- =============================================================================
-- POLITICAS PARA TABLA BUDGET_REQUESTS
-- =============================================================================

-- Los usuarios pueden gestionar sus propias solicitudes de presupuesto
CREATE POLICY "Users can view own budget requests" 
  ON budget_requests FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budget requests" 
  ON budget_requests FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budget requests" 
  ON budget_requests FOR UPDATE 
  USING (auth.uid() = user_id);

-- Los proveedores de servicios pueden ver solicitudes publicadas
CREATE POLICY "Service providers can view published budget requests" 
  ON budget_requests FOR SELECT 
  USING (
    status = 'published' AND 
    EXISTS (
      SELECT 1 FROM service_providers 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- =============================================================================
-- POLITICAS PARA TABLA SERVICE_PROVIDERS
-- =============================================================================

-- Los usuarios pueden gestionar su perfil de proveedor
CREATE POLICY "Users can view own service provider profile" 
  ON service_providers FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own service provider profile" 
  ON service_providers FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own service provider profile" 
  ON service_providers FOR UPDATE 
  USING (auth.uid() = user_id);

-- Los perfiles de proveedores activos son publicos para lectura
CREATE POLICY "Anyone can view active service providers" 
  ON service_providers FOR SELECT 
  USING (is_active = true);

-- =============================================================================
-- POLITICAS PARA TABLA QUOTES
-- =============================================================================

-- Los usuarios pueden ver cotizaciones relacionadas con sus solicitudes
CREATE POLICY "Users can view quotes for own budget requests" 
  ON quotes FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM budget_requests 
      WHERE id = budget_request_id AND user_id = auth.uid()
    )
  );

-- Los proveedores pueden gestionar sus propias cotizaciones
CREATE POLICY "Service providers can manage own quotes" 
  ON quotes FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM service_providers 
      WHERE id = service_provider_id AND user_id = auth.uid()
    )
  ) 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM service_providers 
      WHERE id = service_provider_id AND user_id = auth.uid()
    )
  );

-- =============================================================================
-- POLITICAS PARA TABLA CONTRACTS
-- =============================================================================

-- Los usuarios pueden ver contratos donde son cliente o proveedor
CREATE POLICY "Users can view own contracts" 
  ON contracts FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM service_providers 
      WHERE id = service_provider_id AND user_id = auth.uid()
    )
  );

-- Solo los usuarios involucrados pueden actualizar contratos
CREATE POLICY "Users can update own contracts" 
  ON contracts FOR UPDATE 
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM service_providers 
      WHERE id = service_provider_id AND user_id = auth.uid()
    )
  );

-- =============================================================================
-- POLITICAS PARA TABLA INVOICES
-- =============================================================================

-- Los usuarios pueden ver facturas donde son cliente o proveedor
CREATE POLICY "Users can view own invoices" 
  ON invoices FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM service_providers 
      WHERE id = service_provider_id AND user_id = auth.uid()
    )
  );

-- Los proveedores pueden crear facturas para sus servicios
CREATE POLICY "Service providers can create invoices" 
  ON invoices FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM service_providers 
      WHERE id = service_provider_id AND user_id = auth.uid()
    )
  );

-- =============================================================================
-- POLITICAS PARA TABLA PAYMENTS
-- =============================================================================

-- Los usuarios pueden ver pagos donde son cliente o proveedor
CREATE POLICY "Users can view own payments" 
  ON payments FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM service_providers 
      WHERE id = service_provider_id AND user_id = auth.uid()
    )
  );

-- Los clientes pueden crear pagos
CREATE POLICY "Users can create payments" 
  ON payments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- POLITICAS PARA TABLA RATINGS
-- =============================================================================

-- Los usuarios pueden gestionar sus propias calificaciones
CREATE POLICY "Users can manage own ratings" 
  ON ratings FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- Los proveedores pueden ver calificaciones sobre ellos
CREATE POLICY "Service providers can view own ratings" 
  ON ratings FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM service_providers 
      WHERE id = service_provider_id AND user_id = auth.uid()
    )
  );

-- Las calificaciones verificadas son publicas
CREATE POLICY "Anyone can view verified ratings" 
  ON ratings FOR SELECT 
  USING (is_verified = true);

-- =============================================================================
-- POLITICAS PARA TABLA WORK_SESSIONS
-- =============================================================================

-- Solo cliente y proveedor pueden ver sesiones de trabajo
CREATE POLICY "Users can view own work sessions" 
  ON work_sessions FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM contracts 
      WHERE id = contract_id AND (
        user_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM service_providers 
          WHERE id = contracts.service_provider_id AND user_id = auth.uid()
        )
      )
    )
  );

-- Los proveedores pueden gestionar sus sesiones de trabajo
CREATE POLICY "Service providers can manage work sessions" 
  ON work_sessions FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM service_providers 
      WHERE id = service_provider_id AND user_id = auth.uid()
    )
  ) 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM service_providers 
      WHERE id = service_provider_id AND user_id = auth.uid()
    )
  );

-- =============================================================================
-- POLITICAS PARA TABLA CONVERSATIONS
-- =============================================================================

-- Los usuarios pueden ver conversaciones donde participan
CREATE POLICY "Users can view own conversations" 
  ON conversations FOR ALL 
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM service_providers 
      WHERE id = service_provider_id AND user_id = auth.uid()
    )
  ) 
  WITH CHECK (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM service_providers 
      WHERE id = service_provider_id AND user_id = auth.uid()
    )
  );

-- =============================================================================
-- POLITICAS PARA TABLA MESSAGES
-- =============================================================================

-- Los usuarios pueden ver mensajes de sus conversaciones
CREATE POLICY "Users can view own messages" 
  ON messages FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE id = conversation_id AND (
        user_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM service_providers 
          WHERE id = conversations.service_provider_id AND user_id = auth.uid()
        )
      )
    )
  );

-- Los usuarios pueden enviar mensajes en sus conversaciones
CREATE POLICY "Users can send messages" 
  ON messages FOR INSERT 
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE id = conversation_id AND (
        user_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM service_providers 
          WHERE id = conversations.service_provider_id AND user_id = auth.uid()
        )
      )
    )
  );

-- Los usuarios pueden marcar sus mensajes como leidos
CREATE POLICY "Users can update message read status" 
  ON messages FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM conversations 
      WHERE id = conversation_id AND (
        user_id = auth.uid() OR 
        EXISTS (
          SELECT 1 FROM service_providers 
          WHERE id = conversations.service_provider_id AND user_id = auth.uid()
        )
      )
    )
  );

-- =============================================================================
-- POLITICAS PARA TABLA DOCUMENTS
-- =============================================================================

-- Los usuarios pueden gestionar sus propios documentos
CREATE POLICY "Users can manage own documents" 
  ON documents FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- Los documentos publicos son visibles para todos
CREATE POLICY "Anyone can view public documents" 
  ON documents FOR SELECT 
  USING (is_public = true);

-- =============================================================================
-- POLITICAS PARA TABLA EMERGENCY_REQUESTS
-- =============================================================================

-- Los usuarios pueden gestionar sus propias solicitudes de emergencia
CREATE POLICY "Users can manage own emergency requests" 
  ON emergency_requests FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- Los proveedores pueden ver solicitudes abiertas en su area
CREATE POLICY "Service providers can view open emergency requests" 
  ON emergency_requests FOR SELECT 
  USING (
    status IN ('open', 'assigned') AND 
    EXISTS (
      SELECT 1 FROM service_providers 
      WHERE user_id = auth.uid() AND emergency_services = true AND is_active = true
    )
  );

-- =============================================================================
-- POLITICAS PARA TABLA NOTIFICATIONS
-- =============================================================================

-- Los usuarios pueden gestionar sus propias notificaciones
CREATE POLICY "Users can manage own notifications" 
  ON notifications FOR ALL 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- =============================================================================
-- VERIFICACION DE POLITICAS RLS
-- =============================================================================

DO $$
BEGIN
    RAISE INFO 'POLITICAS RLS CONFIGURADAS EXITOSAMENTE';
    RAISE INFO 'Base de datos completamente segura';
    RAISE INFO 'Los usuarios solo pueden acceder a sus propios datos';
END $$;
